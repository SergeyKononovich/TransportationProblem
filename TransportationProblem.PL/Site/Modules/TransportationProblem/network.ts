import { IUniqueSet }        from './iUniqueSet';
import { UniqueSet }        from './uniqueSet';
import { Arc }              from './arc';
import { Vertex }           from './vertex';

export class Network {
    private static MAX_VALUE: number = 1e+20;

    private _vertexes = new UniqueSet<Vertex>();
    private _arcs = new UniqueSet<Arc>();
    private _adjency: number[][];


    addVertex(vertex: Vertex): void {
        this._vertexes.add(vertex);
    }
    addArc(arc: Arc): void {
        this._arcs.add(arc);
    }
    optimize(): void {
        try {
            if (!this.isConnectivity())
                throw "Network isn't connectivily";

            let getIntroduced = function (network: Network) {
                let maxDevitation = Number.MAX_VALUE;
                let needed: Arc = null;

                for (let arc of network._arcs.where(x => !x.basic).items()) {
                    let currentDevitation = arc.delta;

                    if (currentDevitation < maxDevitation) {
                        maxDevitation = currentDevitation;
                        needed = arc;
                    }
                }
                return maxDevitation >= 0 ? null : needed;
            }
            let dump = this.balance();

            if (!dump) {
                this._vertexes.where(x => x.priority).forEach(x => {
                    if (x.power > 0)
                        this.getArc(x, dump).rate = Network.MAX_VALUE;
                    else
                        this.getArc(dump, x).rate = Network.MAX_VALUE;
                });
            }

            let zero = this.addImaginaryVertex();

            this.calculatePotential();
            let introduced = getIntroduced(this);

            while (introduced) {
                this.recalculate(introduced);
                this.reset();

                this.calculatePotential();
                introduced = getIntroduced(this);
            }

            this.clearJunk(zero, dump);
        }
        catch (Error) { throw "Оптимизация завершилась неудачно!"; }
    }
    forbitTransportation(arc: Arc) {
        if (!arc || !this._arcs.contains(arc))
            return;

        arc.rate = Network.MAX_VALUE;
    }
    setTransportation(arc: Arc, value: number) {
        if (!arc || !this._arcs.contains(arc))
            return;

        if (value > arc.source.power)
            throw "Flow rate can't be higher for source's power";

        arc.source.power -= value;
        arc.slink.power += value;

        arc.flow = value;
        arc.rate = Network.MAX_VALUE;
    }
    getArcs(): Arc[] {
        return this._arcs.items();
    }

    /*Clear functions*/
    private reset(): void {
        this._vertexes.forEach(x => x.potential = Number.NEGATIVE_INFINITY);
        this._arcs.forEach(x => x.inCycle = false);
        this._arcs.forEach(x => x.straight = undefined);
    }
    private clearJunk(zero: Vertex, addition: Vertex) {
        if (zero) {
            let zeroJunk = this._arcs.where(x => x.slink.equals(zero) || x.source.equals(zero));
            this._arcs.removeAll(zeroJunk);

            this._vertexes.remove(zero);
        }
        if (addition) {
            let additionJunk = this._arcs.where(x => x.slink.equals(addition) || x.source.equals(addition));
            this._arcs.removeAll(additionJunk);

            this._vertexes.remove(addition);
        }
    }
    /*End clear functions*/

    /*basic plan's steps*/
    private balance(): Vertex {
        let totalPower = 0;

        this._vertexes.forEach(x => totalPower += x.power);

        if (totalPower !== 0) {
            let addition = new Vertex("addition", -totalPower);

            let arc: Arc = null;
            if (-totalPower >= 0)
                for (let vertex of this._vertexes.items()) {
                    arc = new Arc(addition, vertex, Network.MAX_VALUE);
                    this._arcs.add(arc);
                }
            else
                for (let vertex of this._vertexes.items()) {
                    arc = new Arc(vertex, addition, Network.MAX_VALUE);
                    this._arcs.add(arc);
                }

            this._vertexes.add(addition);
            return addition;
        }

        return null;
    }
    private addImaginaryVertex(): Vertex {
        let zero = new Vertex("Zero", 0);

        let arc: Arc = null;
        for (let vertex of this._vertexes.items()) {

            if (vertex.power >= 0)
                arc = new Arc(vertex, zero, Network.MAX_VALUE);
            else
                arc = new Arc(zero, vertex, Network.MAX_VALUE);

            arc.flow = Math.abs(vertex.power);
            arc.basic = true;

            this._arcs.add(arc);
        }

        this._vertexes.add(zero);

        return zero;
    }
    /*end basic plan's steps*/

    private calculatePotential() {
        let basics = this.getBasicVertexes();
        basics.elementAt(0).potential = 0;

        let resolve = function (network: Network, vertex: Vertex) {
            var slinks = network.getSlinkRelated(vertex).intersect(network.getBasicVertexes());
            var sources = network.getSourceRelated(vertex).intersect(network.getBasicVertexes());

            for (let slink of slinks.items())
                if (!isFinite(slink.potential)) {
                    let arc = network.getArc(vertex, slink);
                    if (arc.basic) {
                        slink.potential = vertex.potential - arc.rate;
                        resolve(network, slink);
                    }
                }
            for (let source of sources.items())
                if (!isFinite(source.potential)) {
                    let arc = network.getArc(source, vertex);

                    if (arc.basic) {
                        source.potential = arc.rate + vertex.potential;
                        resolve(network, source);
                    }
                }
        }
        resolve(this, basics.elementAt(0));
    }
    private recalculate(introduced: Arc): void {
        let setCycle = function (network: Network, introduced: Arc, last: Vertex, target: Vertex) {
            introduced.inCycle = true;

            let sibling = network._arcs.where(x => x.basic
                && (x.source.equals(last) || x.slink.equals(last))
                && !x.equals(introduced));

            if (sibling.size() > 0) {
                for (let arc of sibling.items()) {
                    if (arc.slink.equals(target) ||
                        arc.source.equals(target)) {
                        arc.inCycle = true;
                        return true;
                    }

                    else {
                        if (!setCycle(network, arc, arc.source.equals(last) ? arc.slink : arc.source, target))
                            arc.inCycle = false;
                        else { return true; }
                    }
                }
            }
            else {
                introduced.inCycle = false;
                return false;
            }
        }
        setCycle(this, introduced, introduced.slink, introduced.source);

        introduced.straight = true;
        introduced.basic = true;

        let cycle = new Array<Arc>(introduced);
        let cycleArcs = this._arcs.where(x => x.inCycle && !x.equals(introduced));

        let head = introduced.slink;

        while (cycleArcs.size() > 0) {
            let peak = cycle.pop();
            let sibling: Arc = null;

            sibling = cycleArcs.firstOrDefault(x => x.source.equals(head));
            if (sibling) {
                sibling.straight = true;
                head = sibling.slink;
            }
            else {
                sibling = cycleArcs.firstOrDefault(x => x.slink.equals(head));
                sibling.straight = false;
                head = sibling.source;
            }
            cycle.push(peak);
            cycle.push(sibling);

            cycleArcs.remove(sibling);
        }
        let min = this._arcs.where(x => !x.straight && x.inCycle).min(x => x.flow);
        min.basic = false;

        for (let arc of this._arcs.where(x => x.inCycle).items()) {
            if (arc.straight)
                arc.flow += min.flow;
            else
                arc.flow -= min.flow;
        }
    }
    private isConnectivity(): boolean {
        var adjency = this.getAdjency();
        var used = Array<boolean>(this._vertexes.size());

        let dfs = function (v: number, adjency: number[][], used: boolean[]): void {
            used[v] = true;
            for (let i = 0; i < adjency[v].length; i++)
                if (!used[i])
                    dfs(i, adjency, used);
        }
        dfs(0, adjency, used);

        return used.every(x => x == true);
    }


    /*addition functions*/
    private getAdjency(): number[][] {
        if (!this._adjency) {
            let size = this._vertexes.size();
            let matrix: Array<number>[] = [];

            for (let i = 0; i < size; i++) {
                matrix[i] = new Array<number>(size);
                let related = this.getRelated(this._vertexes.elementAt(i));

                for (let j = 0; j < related.length; j++) {
                    let index = this._vertexes.indexOf(related[j]);
                    matrix[i][index] = 1;
                }
            }
            this._adjency = matrix;
        }

        return this._adjency;
    }

    private getRelated(vertex: Vertex): Vertex[] {
        let array = new Array<Vertex>();

        this.getSourceRelated(vertex).forEach(x => array.push(x));
        this.getSlinkRelated(vertex).forEach(x => array.push(x));

        return array;
    }
    private getSourceRelated(vertex: Vertex): IUniqueSet<Vertex> {
        let array = new UniqueSet<Vertex>();
        for (let arc of this._arcs.items())
            if (arc.slink.equals(vertex))
                array.add(arc.source);

        return array;
    }
    private getSlinkRelated(vertex: Vertex): IUniqueSet<Vertex> {
        let array = new UniqueSet<Vertex>();

        for (let arc of this._arcs.items())
            if (arc.source.equals(vertex))
                array.add(arc.slink);

        return array;
    }
    private getArc(source: Vertex, slink: Vertex): Arc {
        return this._arcs.where(x => x.slink.equals(slink) && x.source.equals(source)).elementAt(0);
    }

    private getBasicFlow(): IUniqueSet<Arc> {
        return this._arcs.where(x => x.basic);
    }
    private getBasicVertexes(): IUniqueSet<Vertex> {
        let vertexes = new UniqueSet<Vertex>();

        for (let arc of this.getBasicFlow().items()) {
            if (!vertexes.contains(arc.source))
                vertexes.add(arc.source);
            if (!vertexes.contains(arc.slink))
                vertexes.add(arc.slink);
        }

        return vertexes;
    }
    /*End addition functions*/
}