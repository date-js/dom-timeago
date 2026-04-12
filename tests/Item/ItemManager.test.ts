/**
 * @jest-environment jsdom
 */
import Item from '../../src/Item/Item';
import ItemManager from '../../src/Item/ItemManager';
import RuleEngine from '../../src/Rule/RuleEngine';
import RuleRender from '../../src/Rule/RuleRender';
import Rule from '../../src/Rule/Rule';

function makeElement(html = 'original'): HTMLElement {
  const el = document.createElement('span');
  el.innerHTML = html;
  document.body.appendChild(el);
  return el;
}

function makeItem(el: HTMLElement, date = new Date()): Item {
  return new Item(el, el.innerHTML, date);
}

const rules: Rule[] = [];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ItemManager.addItems', () => {
  it('adds items to the internal list', () => {
    const engine = new RuleEngine();
    jest.spyOn(engine, 'render').mockReturnValue(new RuleRender('3 minutes ago', undefined));

    const manager = new ItemManager(engine, 'en');
    const el = makeElement();
    const item = makeItem(el);

    manager.addItems([item]);
    manager.analyse(rules);

    expect(engine.render).toHaveBeenCalledTimes(1);
  });
});

describe('ItemManager.analyse', () => {
  it('updates innerHTML with the rendered text', () => {
    const engine = new RuleEngine();
    jest.spyOn(engine, 'render').mockReturnValue(new RuleRender('just now', undefined));

    const manager = new ItemManager(engine, 'en');
    const el = makeElement();
    manager.addItems([makeItem(el)]);
    manager.analyse(rules);

    expect(el.innerHTML).toBe('just now');
  });

  it('does not update innerHTML when the content is unchanged', () => {
    const engine = new RuleEngine();
    jest.spyOn(engine, 'render').mockReturnValue(new RuleRender('just now', undefined));

    const manager = new ItemManager(engine, 'en');
    const el = makeElement('just now');
    manager.addItems([makeItem(el)]);

    const setter = jest.spyOn(el, 'innerHTML', 'set');
    manager.analyse(rules);

    expect(setter).not.toHaveBeenCalled();
  });

  it('restores initialContent when no rule matches', () => {
    const engine = new RuleEngine();
    jest.spyOn(engine, 'render').mockReturnValue(null);

    const manager = new ItemManager(engine, 'en');
    const el = makeElement('original');
    // Capture the item before overwriting innerHTML so initialContent = 'original'
    const item = makeItem(el);
    el.innerHTML = 'overwritten';
    manager.addItems([item]);
    manager.analyse(rules);

    expect(el.innerHTML).toBe('original');
  });

  it('skips items whose nextUpdate is in the future', () => {
    const engine = new RuleEngine();
    const renderSpy = jest.spyOn(engine, 'render').mockReturnValue(new RuleRender('just now', undefined));

    const manager = new ItemManager(engine, 'en');
    const el = makeElement();
    const item = makeItem(el);
    item.nextUpdate = new Date(Date.now() + 60_000);

    manager.addItems([item]);
    manager.analyse(rules);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('processes items whose nextUpdate is in the past', () => {
    const engine = new RuleEngine();
    const renderSpy = jest.spyOn(engine, 'render').mockReturnValue(new RuleRender('1 minute ago', undefined));

    const manager = new ItemManager(engine, 'en');
    const el = makeElement();
    const item = makeItem(el);
    item.nextUpdate = new Date(Date.now() - 1_000);

    manager.addItems([item]);
    manager.analyse(rules);

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  it('removes items that are no longer in the DOM', () => {
    const engine = new RuleEngine();
    const renderSpy = jest.spyOn(engine, 'render').mockReturnValue(new RuleRender('just now', undefined));

    const manager = new ItemManager(engine, 'en');
    const el = makeElement();
    manager.addItems([makeItem(el)]);

    document.body.removeChild(el);
    manager.analyse(rules);

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('stops tracking an item when the rule has refresh=null', () => {
    const engine = new RuleEngine();
    jest.spyOn(engine, 'render')
      .mockReturnValueOnce(new RuleRender('long ago', null))
      .mockReturnValue(new RuleRender('long ago', null));

    const manager = new ItemManager(engine, 'en');
    const el = makeElement();
    manager.addItems([makeItem(el)]);

    manager.analyse(rules);
    manager.analyse(rules);

    // Item is removed after first analyse, so render is only called once
    expect(engine.render).toHaveBeenCalledTimes(1);
  });
});
