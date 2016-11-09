import { IEquatable }       from './iEquatable';
import { Vertex }             from './vertex';


export class Arc implements IEquatable<Arc> {
    
    private _capacity: number;
    private _flow: number;
    private _basic: boolean;
    private _inCycle: boolean;
    private _straight: boolean;


    constructor(private _source: Vertex, private _slink: Vertex, private _rate: number) {
        this._capacity = Number.MAX_VALUE;
        this._basic = false;
        this._inCycle = false;
        this._straight = null;
        this._flow = 0;
    }


    get source(): Vertex {
        return this._source;
    }
    set source(value: Vertex) {
        if (!value)
            throw new Error("Arc's source can't have null or undefined value")

        this._source = value;
    }

    get slink(): Vertex {
        return this._slink;
    }
    set slink(value: Vertex) {
        if (!value)
            throw new Error("Arc's slink can't have null or undefined value");

        this._slink = value;
    }

    get rate(): number {
        return this._rate;
    }
    set rate(value: number) {
        if (value < 0)
            throw new Error("Vertex's rate can't have negative value");

        this._rate = value;
    }

    get capacity(): number {
        return this._capacity;
    }
    set capacity(value: number) {
        if (value < 0)
            throw new Error("Vertex's capacity can't have negative value");
    }

    get basic(): boolean {
        return this._basic;
    }
    set basic(value: boolean) {
        this._basic = value;
    }

    get delta(): number {
        return this._rate - (this._source.potential - this._slink.potential);
    }

    get inCycle(): boolean {
        return this._inCycle;
    }
    set inCycle(value: boolean) {
        this._inCycle = value;
    }

    get straight(): boolean {
        return this._straight;
    }
    set straight(value: boolean) {
        this._straight = value;
    }

    set flow(value: number) {
        if (value < 0)
            throw new Error("Vertex's flow can't have negative value");

        this._flow = value;
    }
    get flow(): number {
        return this._flow
    }


    equals(arc: Arc): boolean {
        return (this._slink.equals(arc._slink) && this._source.equals(arc._source)) ||
            (this._slink.equals(arc._source) && this._source.equals(arc._slink));
    }
}