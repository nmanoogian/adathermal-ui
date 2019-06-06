import * as t from "io-ts";

export class Nothing {
    static readonly shared = new Nothing();
    static readonly ioType = new t.Type<Nothing, Nothing, unknown>(
        "nothing",
        (a): a is Nothing => a instanceof Nothing,
        () => t.success(Nothing.shared),
        t.identity,
    );
}
