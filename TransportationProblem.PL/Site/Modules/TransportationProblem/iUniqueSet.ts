import { IEquatable }   from './iEquatable';


export interface IUniqueSet<T extends IEquatable<T>> {
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