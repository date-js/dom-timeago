export default class DateInterval {
  public constructor(
    public readonly date: Date,
    public readonly day: number,
    public readonly hour: number,
    public readonly minute: number,
    public readonly second: number
  ) {
  }
}
