export default class DateInterval {
    readonly date: Date;
    readonly day: number;
    readonly hour: number;
    readonly minute: number;
    readonly second: number;
    constructor(date: Date, day: number, hour: number, minute: number, second: number);
}
