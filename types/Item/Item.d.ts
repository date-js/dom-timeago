export default class Item {
    readonly reference: Element;
    readonly initialContent: string;
    readonly date: Date;
    nextUpdate: Date | null | undefined;
    constructor(reference: Element, initialContent: string, date: Date);
}
