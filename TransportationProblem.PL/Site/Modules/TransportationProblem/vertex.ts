import { IEquatable }       from './iEquatable';
import { Guid }             from './guid';

export class Vertex implements IEquatable<Vertex> {

    private identifier: string;
    private prop_potential: number;

    constructor(private prop_name: string, private prop_power: number, public priority: boolean = false) {
        this.identifier = Guid.newGuid();
        this.potential = Number.NEGATIVE_INFINITY;
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