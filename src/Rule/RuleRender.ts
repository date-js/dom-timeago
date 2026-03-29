export default class RuleRender {
  public constructor(
    public readonly render: string,
    public readonly nextUpdate: Date | null | undefined
  ) {
  }
}
