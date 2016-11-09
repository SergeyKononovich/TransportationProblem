import { IEquatable }       from './iEquatable';
import { Guid }             from './guid';

export class Vertex implements IEquatable<Vertex> {

    private _identifier: string;
    public potential: number;

    constructor(private _name: string, public power: number, public priority: boolean = false) {
        this._identifier = Guid.newGuid();
        this.potential = Number.NEGATIVE_INFINITY;
    }

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        if (!value)
            throw "Name can't have null or undefined value";

        this._name = value;
    }


    equals(vertex: Vertex): boolean {
        return this._identifier === vertex._identifier;
    }
}