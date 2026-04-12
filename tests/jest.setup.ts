// @date-js/date-formatter est un bundle UMD qui référence `self` (global navigateur).
// On le définit ici pour que Jest (Node.js) puisse charger le module.
(globalThis as unknown as Record<string, unknown>).self = globalThis;
