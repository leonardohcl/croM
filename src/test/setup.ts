// jsdom doesn't implement window.matchMedia at all, unlike real browsers. Default to
// "matches" so components gated by useIsDesktop (e.g. App) render their desktop content
// under test unless a spec stubs matchMedia itself to exercise the mobile case.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
