import { IEquatable }       from './iEquatable';
import { IUniqueSet }       from './iUniqueSet';

export class UniqueSet<T extends IEquatable<T>> implements IUniqueSet<T>{
    private container: T[] = new Array<T>();


    contains(arg: T): boolean {
        if (!arg)
            return false;

        return this.container.some(x => x.equals(arg));
    }
    add(value: T): void {
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