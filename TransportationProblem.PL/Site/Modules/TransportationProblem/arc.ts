import { IEquatable }       from './iEquatable';
import { Vertex }             from './vertex';

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
        this.straight = null;
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
        return (this.slink.equals(arc.slink) && this.source.equals(arc.source)) ||
            (this.slink.equals(arc.source) && this.source.equals(arc.slink));
    }
}