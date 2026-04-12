import Item from './Item';
export default class ItemExtractor {
    static extract(selector: string, scope?: Document | Element): Item[];
    static extractElement(element: Element, selector: string): Item | null;
}
