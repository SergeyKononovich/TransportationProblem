export class Vertex implements IEquatable<Vertex> {

    private identifier: string;
    private prop_name: string;
    private prop_power: number;
    private prop_potential: number;
    priority: boolean;

    constructor(name: string, power: number, priority: boolean = false) {
        this.identifier = Guid.newGuid();
        this.potential = Number.NEGATIVE_INFINITY;

        this.name = name;
        this.prop_power = power;
        this.priority = priority;
    }

    get name(): string {
        return this.prop_name;
    }
    set name(value: string) {
        if (!value)
            throw new Error("Name can't have null or undefined value");

        this.prop_name = value;
    }

    get potential(): number {
        return this.prop_potential;
    }
    set potential(value: number) {
        this.prop_potential = value;
    }

    get power(): number {
        return this.prop_power;
    }
    set power(value: number) {
        this.prop_power = value;
    }

    equals(vertex: Vertex): boolean {
        return this.identifier === vertex.identifier;
    }
}
export class Arc implements IEquatable<Arc> {

    private prop_source: Vertex;
    private prop_slink: Vertex;
    private prop_rate: number;
    private prop_capacity: number;
    private prop_flow: number;
    private prop_basic: boolean;
    private prop_inCycle: boolean;
    private prop_straight: boolean;

    constructor(source: Vertex, slink: Vertex, rate: number) {
        this.source = source;
        this.slink = slink;

        this.rate = rate;
        this.capacity = Number.MAX_VALUE;

        this.basic = false;
        this.inCycle = false;
        this.straight = undefined;
        this.flow = 0;
    }

    get source(): Vertex {
        return this.prop_source;
    }
    set source(value: Vertex) {
        if (!value)
            throw new Error("Arc's source can't have null or undefined value")

        this.prop_source = value;
    }

    get slink(): Vertex {
        return this.prop_slink;
    }
    set slink(value: Vertex) {
        if (!value)
            throw new Error("Arc's slink can't have null or undefined value");

        this.prop_slink = value;
    }

    get rate(): number {
        return this.prop_rate;
    }
    set rate(value: number) {
        if (value < 0)
            throw new Error("Vertex's rate can't have negative value");

        this.prop_rate = value;
    }

    get capacity(): number {
        return this.prop_capacity;
    }
    set capacity(value: number) {
        if (value < 0)
            throw new Error("Vertex's capacity can't have negative value");
    }

    get basic(): boolean {
        return this.prop_basic;
    }
    set basic(value: boolean) {
        this.prop_basic = value;
    }

    get delta(): number {
        return this.rate - (this.source.potential - this.slink.potential);
    }

    get inCycle(): boolean {
        return this.prop_inCycle;
    }
    set inCycle(value: boolean) {
        this.prop_inCycle = value;
    }

    get straight(): boolean {
        return this.prop_straight;
    }
    set straight(value: boolean) {
        this.prop_straight = value;
    }

    set flow(value: number) {
        if (value < 0)
            throw new Error("Vertex's flow can't have negative value");

        this.prop_flow = value;
    }
    get flow(): number {
        return this.prop_flow
    }


    equals(arc: Arc): boolean {
        return (this.slink.equals(arc.slink) && this.source.equals(arc.source));
    }
}

export class Network {
    private static MAX_VALUE: number = 1e+15;

    private vertexes: UniqueSet<Vertex>;
    private arcs: UniqueSet<Arc>;
    private adjency: number[][];

    constructor() {
        this.vertexes = new UniqueSet<Vertex>();
        this.arcs = new UniqueSet<Arc>();
    }

    addVertex(vertex: Vertex): void {
        try { this.vertexes.add(vertex); }
        catch (Error) { alert(Error.message); }
    }
    addArc(arc: Arc): void {
        try { this.arcs.add(arc); }
        catch (Error) { alert(Error.message); }
    }
    optimize(): void {
        try {
            if (!this.isConnectivity())
                throw new Error("Network isn't connectivily");

            let getIntroduced = function (network: Network) {
                let maxDevitation = Number.MAX_VALUE;
                let needed: Arc = null;

                for (let arc of network.arcs.where(x => !x.basic).items()) {
                    let currentDevitation = arc.delta;

                    if (currentDevitation < maxDevitation) {
                        maxDevitation = currentDevitation;
                        needed = arc;
                    }
                }
                return maxDevitation >= 0 ? null : needed;
            }
            let dump = this.balance();

            if (dump) {
                this.vertexes.where(x => x.priority).forEach(x => {
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
        catch (Error) { alert(Error.message); }
    }
    forbitTransportation(arc: Arc) {
        if (!arc || !this.arcs.contains(arc))
            return;

        arc.rate = Network.MAX_VALUE;
    }
    setTransportation(arc: Arc, value: number) {
        if (!arc || !this.arcs.contains(arc))
            return;

        if (value > arc.source.power)
            throw new Error("Flow rate can't be higher for source's power");

        arc.source.power -= value;
        arc.slink.power += value;

        arc.flow = value;
        arc.rate = Network.MAX_VALUE;
    }

    /*Clear functions*/
    private reset(): void {
        this.vertexes.forEach(x => x.potential = Number.NEGATIVE_INFINITY);
        this.arcs.forEach(x => x.inCycle = false);
        this.arcs.forEach(x => x.straight = null);
    }
    private clearJunk(zero: Vertex, addition: Vertex) {
        if (zero) {
            let zeroJunk = this.arcs.where(x => x.slink.equals(zero) || x.source.equals(zero));
            this.arcs.removeAll(zeroJunk);

            this.vertexes.remove(zero);
        }
        if (addition) {
            let additionJunk = this.arcs.where(x => x.slink.equals(addition) || x.source.equals(addition));
            this.arcs.removeAll(additionJunk);

            this.vertexes.remove(addition);
        }
    }
    /*End clear functions*/

    /*basic plan's steps*/
    private balance(): Vertex {
        let totalPower = 0;

        this.vertexes.forEach(x => totalPower += x.power);

        if (totalPower !== 0) {
            let addition = new Vertex("addition", -totalPower);

            let arc: Arc = null;
            if (-totalPower >= 0) {
                for (let vertex of this.vertexes.items()) {
                    arc = new Arc(addition, vertex, Network.MAX_VALUE);
                    this.arcs.add(arc);
                }
            }
            else {
                for (let vertex of this.vertexes.items()) {
                    arc = new Arc(vertex, addition, Network.MAX_VALUE);
                    this.arcs.add(arc);
                }
            }

            this.vertexes.add(addition);
            return addition;
        }
        return null;
    }
    private addImaginaryVertex(): Vertex {
        let zero = new Vertex("Zero", 0);

        let arc: Arc = null;
        for (let vertex of this.vertexes.items()) {

            if (vertex.power >= 0)
                arc = new Arc(vertex, zero, Network.MAX_VALUE);
            else
                arc = new Arc(zero, vertex, Network.MAX_VALUE);

            arc.flow = Math.abs(vertex.power);
            arc.basic = true;

            this.arcs.add(arc);
        }
        this.vertexes.add(zero);
        return zero;
    }
    /*end basic plan's steps*/

    private calculatePotential() {
        let basics = this.getBasicVertexes();
        basics.elementAt(0).potential = 0;

        let resolve = function (network: Network, vertex: Vertex) {
            var slinks = network.getSlinkRelated(vertex).intersect(network.getBasicVertexes());
            var sources = network.getSourceRelated(vertex).intersect(network.getBasicVertexes());

            for (let slink of slinks.items()) {
                if (!isFinite(slink.potential)) {
                    let arc = network.getArc(vertex, slink);
                    if (arc.basic) {
                        slink.potential = vertex.potential - arc.rate;
                        resolve(network, slink);
                    }
                }
            }
            for (let source of sources.items()) {

                if (!isFinite(source.potential)) {
                    let arc = network.getArc(source, vertex);

                    if (arc.basic) {
                        source.potential = arc.rate + vertex.potential;
                        resolve(network, source);
                    }
                }
            }
        }
        resolve(this, basics.elementAt(0));
    }
    private recalculate(introduced: Arc): void {
        let setCycle = function (network: Network, introduced: Arc, last: Vertex, target: Vertex) {
            introduced.inCycle = true;

            let sibling = network.arcs.where(x => x.basic
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
        let cycleArcs = this.arcs.where(x => x.inCycle && !x.equals(introduced));

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
        //TODO
        let needed = this.arcs.where(x => x.straight != null && !x.equals(introduced) && x.inCycle).min(x => x.flow);
        var min = needed.flow;
        //End
        needed.basic = false;

        for (let arc of this.arcs.where(x => x.inCycle).items()) {
            if (arc.straight)
                arc.flow += min;
            else
                arc.flow -= min;
        }
    }
    private isConnectivity(): boolean {
        var adjency = this.getAdjency();
        var used = Array<boolean>(this.vertexes.size());

        let dfs = function (v: number, adjency: number[][], used: boolean[]): void {
            used[v] = true;
            for (let i = 0; i < adjency[v].length; i++) {
                if (!used[i])
                    dfs(i, adjency, used);
            }
        }
        dfs(0, adjency, used);

        return used.every(x => x == true);
    }


    /*addition functions*/
    private getAdjency(): number[][] {
        if (!this.adjency) {
            let size = this.vertexes.size();
            let matrix: any[] = [];

            for (let i = 0; i < size; i++) {
                matrix[i] = new Array<number>(size);
                let related = this.getRelated(this.vertexes.elementAt(i));

                for (let j = 0; j < related.length; j++) {
                    let index = this.vertexes.indexOf(related[j]);
                    matrix[i][index] = 1;
                }
            }
            this.adjency = matrix;
        }
        return this.adjency;
    }

    private getRelated(vertex: Vertex): Vertex[] {
        let array = new Array<Vertex>();

        this.getSourceRelated(vertex).forEach(x => array.push(x));
        this.getSlinkRelated(vertex).forEach(x => array.push(x));

        return array;
    }
    private getSourceRelated(vertex: Vertex): IUniqueSet<Vertex> {
        let array = new UniqueSet<Vertex>();
        for (let arc of this.arcs.items()) {
            if (arc.slink.equals(vertex))
                array.add(arc.source);
        }
        return array;
    }
    private getSlinkRelated(vertex: Vertex): IUniqueSet<Vertex> {
        let array = new UniqueSet<Vertex>();

        for (let arc of this.arcs.items()) {
            if (arc.source.equals(vertex))
                array.add(arc.slink);
        }
        return array;
    }
    private getArc(source: Vertex, slink: Vertex): Arc {
        return this.arcs.where(x => x.slink.equals(slink) &&
            x.source.equals(source)).elementAt(0);
    }

    private getBasicFlow(): IUniqueSet<Arc> {
        return this.arcs.where(x => x.basic);
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
}


interface IUniqueSet<T extends IEquatable<T>> {
    contains(arg: T): boolean;
    add(value: T): void;
    addRange(values: Array<T>): void;
    where(predicate: (T: T) => boolean): void;
    union(set: IUniqueSet<T>): IUniqueSet<T>;
    intersect(set: IUniqueSet<T>): IUniqueSet<T>;
    residual(set: IUniqueSet<T>): IUniqueSet<T>;
    copy(): IUniqueSet<T>;
    items(): Array<T>;
    forEach(action: (T: T) => void): void;
    indexOf(value: T): number;
    size(): number;
    elementAt(index: number): T;
    firstOrDefault(predicate: (T: T) => boolean): T;
    remove(element: T): void;
    removeAll(set: IUniqueSet<T>): void;
    min(lamda: (T: T) => number): T;

}
interface IEquatable<T> {
    equals(arg: T): boolean;
}

class UniqueSet<T extends IEquatable<T>> implements IUniqueSet<T>{
    private container: T[];

    constructor() {
        this.container = new Array<T>();
    }

    contains(arg: T): boolean {
        if (!arg)
            return false;

        return this.container.some(x => x.equals(arg));
    }
    add(value: T) {
        if (!value)
            throw new Error("Inalid argument value");

        if (this.contains(value))
            throw new Error("Set already exists this object");

        this.container.push(value);
    }
    addRange(values: Array<T>): void {
        if (!values)
            throw new Error("Invalid argument value");

        for (let item of values)
            this.add(item);
    }
    where(predicate: (T: T) => boolean): IUniqueSet<T> {
        let set = new UniqueSet<T>();

        for (let item of this.container) {
            if (predicate(item))
                set.add(item);
        }
        return set;
    }
    items(): Array<T> {
        return this.container;
    }
    copy(): IUniqueSet<T> {
        let set = new UniqueSet<T>();

        for (let item of this.container) {
            set.add(item);
        }
        return set;
    }
    union(set: IUniqueSet<T>): IUniqueSet<T> {
        if (!set)
            throw new Error("Invalid argument value");

        let union = this.copy();

        for (let item of set.items()) {
            if (!union.contains(item))
                union.add(item);
        }
        return union;
    }
    intersect(set: IUniqueSet<T>): IUniqueSet<T> {
        if (!set)
            throw new Error("Invalid argument value");

        let intersection = new UniqueSet<T>();

        for (let item of set.items()) {
            if (this.container.indexOf(item) > -1)
                intersection.add(item);
        }
        return intersection;
    }
    residual(set: IUniqueSet<T>): IUniqueSet<T> {
        if (!set)
            throw new Error("Invalid argument value");

        let residual = new UniqueSet<T>();

        for (let item of this.container) {
            if (!set.contains(item))
                residual.add(item);
        }
        return residual;
    }
    forEach(action: (T: T) => void): void {
        this.container.forEach(action);
    }
    indexOf(value: T): number {
        return this.container.indexOf(value);
    }
    size(): number {
        return this.container.length;
    }
    elementAt(index: number): T {
        var element = this.container.shift();
        this.container.unshift(element);

        return element;
    }
    firstOrDefault(predicate: (T: T) => boolean): T {
        let result: T = null;
        for (let item of this.container) {
            if (predicate(item)) {
                result = item;
                break;
            }
        }
        return result;
    }
    remove(element: T): void {
        var index = this.container.indexOf(element, 0);
        if (index > -1) {
            this.container.splice(index, 1);
        }
    }
    removeAll(set: IUniqueSet<T>): void {
        if (!set)
            return;

        for (let item of set.items()) {
            if (this.contains(item))
                this.remove(item);
        }
    }
    min(lambda: (T: T) => number): T {
        let min = this.container[0];

        for (let i = 1; i < this.container.length; i++) {
            if (lambda(min) > lambda(this.container[i]))
                min = this.container[i];
        }
        return min;
    }
}
class Guid {
    static newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}