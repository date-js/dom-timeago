export default class Item {
  public nextUpdate: Date | null | undefined;

  public constructor(
    public readonly reference: Element,
    public readonly initialContent: string,
    public readonly date: Date
  ) {
  }
}
