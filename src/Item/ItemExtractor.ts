import Item from './Item';

export default class ItemExtractor {
  public static extract(selector: string, scope: Document | Element = document): Item[] {
    const items: Item[] = [];

    if (scope instanceof Element && scope.hasAttribute(selector)) {
      const item = ItemExtractor.extractElement(scope, selector);
      if (item !== null) {
        items.push(item);
      }
    }

    scope.querySelectorAll(`[${selector}]`).forEach(element => {
      const item = ItemExtractor.extractElement(element, selector);
      if (item !== null) {
        items.push(item);
      }
    });

    return items;
  }

  public static extractElement(element: Element, selector: string): Item | null {
    let attributeValue: string|number = element.getAttribute(selector) as string;

    if (!Number.isNaN(Number(attributeValue))) {
      const timestamp = parseInt(attributeValue, 10);
      attributeValue = timestamp * 1000;
    }

    element.removeAttribute(selector);

    const itemDate = new Date(attributeValue);

    if (itemDate.getTime() > 0) {
      if (!element.hasAttribute('title')) {
        element.setAttribute('title', element.textContent ?? '');
      }
      return new Item(element, element.innerHTML, itemDate);
    }

    return null;
  }
}
