/**
 * @jest-environment jsdom
 */
import ItemExtractor from '../../src/Item/ItemExtractor';

const SELECTOR = 'data-timeago';

function createElement(attrValue: string, existingTitle?: string): Element {
  const el = document.createElement('span');
  el.setAttribute(SELECTOR, attrValue);
  el.innerHTML = 'original content';
  if (existingTitle !== undefined) {
    el.setAttribute('title', existingTitle);
  }
  return el;
}

describe('ItemExtractor.extractElement', () => {
  it('parses a Unix timestamp (seconds) into a Date', () => {
    const timestamp = 1718445600; // 2024-06-15T10:00:00Z
    const el = createElement(String(timestamp));
    const item = ItemExtractor.extractElement(el, SELECTOR);
    expect(item).not.toBeNull();
    expect(item!.date.getTime()).toBe(timestamp * 1000);
  });

  it('parses an ISO date string into a Date', () => {
    const iso = '2024-06-15T10:00:00.000Z';
    const el = createElement(iso);
    const item = ItemExtractor.extractElement(el, SELECTOR);
    expect(item).not.toBeNull();
    expect(item!.date.toISOString()).toBe(iso);
  });

  it('removes the selector attribute from the element', () => {
    const el = createElement('2024-06-15T10:00:00.000Z');
    ItemExtractor.extractElement(el, SELECTOR);
    expect(el.hasAttribute(SELECTOR)).toBe(false);
  });

  it('stores the original innerHTML as initialContent', () => {
    const el = createElement('2024-06-15T10:00:00.000Z');
    const item = ItemExtractor.extractElement(el, SELECTOR);
    expect(item!.initialContent).toBe('original content');
  });

  it('sets title from textContent when no title exists', () => {
    const el = createElement('2024-06-15T10:00:00.000Z');
    ItemExtractor.extractElement(el, SELECTOR);
    expect(el.getAttribute('title')).toBe('original content');
  });

  it('does not override an existing title', () => {
    const el = createElement('2024-06-15T10:00:00.000Z', 'my title');
    ItemExtractor.extractElement(el, SELECTOR);
    expect(el.getAttribute('title')).toBe('my title');
  });

  it('returns null for an invalid date string', () => {
    const el = createElement('not-a-date');
    const item = ItemExtractor.extractElement(el, SELECTOR);
    expect(item).toBeNull();
  });
});

describe('ItemExtractor.extract', () => {
  it('returns an empty array when no elements match', () => {
    const container = document.createElement('div');
    expect(ItemExtractor.extract(SELECTOR, container)).toHaveLength(0);
  });

  it('extracts all matching descendant elements', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <span data-timeago="2024-06-15T10:00:00.000Z"></span>
      <span data-timeago="2024-06-14T10:00:00.000Z"></span>
    `;
    const items = ItemExtractor.extract(SELECTOR, container);
    expect(items).toHaveLength(2);
  });

  it('includes the scope element itself when it carries the selector attribute', () => {
    const el = createElement('2024-06-15T10:00:00.000Z');
    const items = ItemExtractor.extract(SELECTOR, el);
    expect(items).toHaveLength(1);
    expect(items[0].reference).toBe(el);
  });

  it('skips elements with an invalid date', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <span data-timeago="not-a-date"></span>
      <span data-timeago="2024-06-15T10:00:00.000Z"></span>
    `;
    const items = ItemExtractor.extract(SELECTOR, container);
    expect(items).toHaveLength(1);
  });
});
