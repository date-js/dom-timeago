# @date-js/dom-timeago

[![npm](https://img.shields.io/npm/v/@date-js/dom-timeago?style=flat-square)](https://www.npmjs.com/package/@date-js/dom-timeago)
[![size](https://img.shields.io/bundlephobia/minzip/@date-js/dom-timeago?style=flat-square&label=gzip)](https://bundlephobia.com/package/@date-js/dom-timeago)
[![stars](https://img.shields.io/github/stars/date-js/dom-timeago?style=flat-square)](https://github.com/date-js/dom-timeago)

**One attribute. Live, human-readable dates. Zero boilerplate.**

```html
<span data-timeago="1579950627">26/01/2020</span>
<!-- becomes → "2 minutes ago", then "Today at 12:10", then "Yesterday at 12:10"… automatically -->
```

→ **[Live demo](https://date-js.github.io/dom-timeago/)**

---

## Why @date-js/dom-timeago?

Most relative-date libraries give you a formatting function. You call it once, you get a string, and you're on your own: looping over elements, setting up timers, deciding when to re-render.

@date-js/dom-timeago works differently. Put a timestamp in an attribute, call `DomTimeago.start()` once, and every date on the page stays current on its own.

**What sets it apart:**

- **HTML-first**: no JS per element. One attribute, one `start()` call, done
- **Smart per-item scheduling**: each rule sets its own refresh interval. "30 seconds ago" re-evaluates on the next tick; "March 12" never re-evaluates. Items that no longer need updates are dropped from tracking entirely
- **Rule-based rendering**: the display logic is a plain list of conditions you fully control. Override a default, add your own, or replace them all
- **Auto-discovery**: dynamically added elements are picked up automatically via MutationObserver, works seamlessly in SPAs
- **Tiny**: ~3 KB gzipped
- **Multilingual**: extensible to any locale by adding a key in each rule's `text`

---

## Install & Usage

### npm / bundler

```bash
npm install @date-js/dom-timeago
```

```js
import DomTimeago from '@date-js/dom-timeago';
DomTimeago.start();
```

### `<script>` tag, UMD (CDN)

No build step. `DomTimeago` is available as a global.

```html
<script src="https://cdn.jsdelivr.net/npm/@date-js/dom-timeago@3/dist/dom-timeago.umd.js"></script>
<script>
  DomTimeago.start();
</script>
```

### `<script type="module">`, ESM (CDN)

```html
<script type="module">
  import DomTimeago from 'https://cdn.jsdelivr.net/npm/@date-js/dom-timeago@3/dist/dom-timeago.esm.js';
  DomTimeago.start();
</script>
```

---

In all cases, the original content is preserved as a `title` attribute, and the element updates live:

```html
<span title="26/01/2020 12h10">2 minutes ago</span>
```

Stop it anytime:

```js
DomTimeago.stop();
```

## Configuration

```js
DomTimeago.start({
  refresh: 5,            // global re-render interval in seconds (default: 5)
  selector: 'data-timeago', // attribute to look for (default: 'data-timeago')
  rules: [],             // custom rules, evaluated before defaults
});
```

## Custom rules

Rules are evaluated in order; the first matching one wins. Each rule defines **when** it applies, **what** to display, and **how often** to refresh.

```js
DomTimeago.start({
// or DomTimeago.start({
  rules: [
    {
      condition: (interval) => interval.day >= 365 * 10,
      refresh: null, // never re-renders
      text: {
        en: "%dd day{%dd||s} ago (year %Y)",
        fr: "il y a %dd jour{%dd||s} (année %Y)",
      }
    }
  ]
});
```

Custom rules are evaluated **before** the defaults; the first matching rule wins.

See all default rules in [src/defaultRules.ts](src/defaultRules.ts) and the `DateInterval` shape in [src/DateInterval/DateInterval.ts](src/DateInterval/DateInterval.ts).

### Rule properties

| Property | Type | Description |
|---|---|---|
| `condition` | `(interval: DateInterval) => boolean` | Returns `true` if this rule applies. `interval` contains `day`, `hour`, `minute`, `second` (elapsed) and `date` (original `Date`) |
| `text` | `Record<string, string>` | Locale-keyed display templates. A rule is skipped if the current locale key is missing |
| `refresh` | `number \| null \| undefined` | Seconds until next render (`null` = never, `undefined` = global interval) |

### Template tokens

**Interval tokens** (elapsed time): `%ds` seconds · `%dm` minutes · `%dh` hours · `%dd` days

**Date tokens** (formatted via [@date-js/date-formatter](https://github.com/date-js/date-formatter)): `%H` hour · `%i` minutes · `%d` day · `%j` day (no leading zero) · `%F` month name · `%Y` year · `%l` weekday

Pluralization:

- `{%dd|singular|plural}` — singular when the value is ≤ 1 (enough for English, French, etc.)
- `{%dd|one:…|few:…|many:…|other:…}` — for languages with more forms. The branch is picked from the locale's plural category given by [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) (`zero`, `one`, `two`, `few`, `many`, `other`); missing categories fall back to `other`. Branches may contain tokens, e.g. Arabic: `منذ {%dm|one:دقيقة|two:دقيقتين|few:%dm دقائق|other:%dm دقيقة}`. On browsers without `Intl.PluralRules`, `one` is used for values ≤ 1 and `other` otherwise.

Inside a pluralization block, the characters `|`, `{`, `}`, `[` and `]` are reserved and cannot be used in a branch. Colons are allowed (only the first `:` after a category name acts as separator), e.g. `{%dh|one:at 1:00|other:at %dh:00}`.

## Languages

Detected automatically from `navigator.language`.

To add a language, include a key in each rule's `text` object matching the locale code (e.g. `"de"`, `"es"`).
