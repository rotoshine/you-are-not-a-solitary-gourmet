import * as Bluebird from 'bluebird';

export interface DummyConstructor extends Bluebird<any> {
    new<T>(): Bluebird<T>;
    all: any;
    race: any;
}

declare global {
    interface Promise<T> extends Bluebird<T> {}

    interface PromiseConstructor extends DummyConstructor {}
}