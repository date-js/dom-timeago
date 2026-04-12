export default class RuleRender {
    readonly render: string;
    readonly nextUpdate: Date | null | undefined;
    constructor(render: string, nextUpdate: Date | null | undefined);
}
