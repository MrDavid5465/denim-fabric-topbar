---
name: denim-fabric-topbar
description: How to use denim-fabric-topbar, the top-bar Fluent UI shell for Denim (the original Denim look) - its Shell and props (Brand, Controls, ExternalApps, welcome, breakpoints), the header links and narrow-screen link menu, the waffle panel with Settings, its styles (registered into getStyle()), master-detail and FullBleed under it, kiosk routes, and switching to denim-fabric-sidebar. Use before building or changing an app whose frame is the top bar, or migrating an app from the single-package Denim. Pair with denim-fabric's denim-fabric skill and denim's denim-app-shell skill.
license: MIT
---

# The top bar (denim-fabric-topbar)

One of denim-fabric's interchangeable bars: Denim's original look. It
exports exactly what denim-fabric-sidebar exports (`Shell`, the default
export, the role exports `Bar` = `Header`, `BarNav` = `NavBar`, `BarLink`
= `HeaderLink`, `AppSwitcher` = `AppNavBar`, `StatusDot`, and everything
from denim-fabric and the core), so an app that switches bars changes one
import. Shared pieces (master-detail, the layout
hook, `FullBleed`, theming, Settings, getStyle, Photo) are in denim-fabric's
`denim-fabric` skill.

```tsx
import Shell from './lib/denim-fabric-topbar';

<Shell settingsSource="server" settingsFields="deviceName"
       settingsTabs={settingsTabs} components={{ projects: ProjectsAdmin }}
       Brand={MyIcon} Controls={HeaderControls} ExternalApps={Shortcuts} />
```

## What it draws

- **Header** (fixed, 3.85em): waffle button, `Brand`, the active app's name
  (or "Home"), the app's `links` on wide screens (from ~1260px) and
  `Controls` on the right. Below that width the links move into a
  slide-out menu, opened by a menu button, or by clicking `Controls` when
  you pass them.
- **Waffle panel**: every application and its links (Fluent `Nav`), each
  application with its status dot after its name (the core's
  `useAppStatus`; none while an app has no status), `ExternalApps` at the
  top, the Settings button in its footer.
- **Pages** below the header, 1em side padding, growing with their content.

## Props it uses

`themes`, `Logo` (splash), `Brand`, `Controls`, `ExternalApps`, `welcome`,
`breakpoints` (only for the layout MasterDetail and `useLayout()` see; the
header's own breakpoints are fixed), plus every `<DenimProvider>` prop.
`title` and `SidebarFooter` are the sidebar's: accepted and ignored here.
`group` and `icon` are ignored too.

## Under the top bar

- `useShellLayout()` is provided: `layout` from `breakpoints`, `backBar:
  false`, `goUp`. So MasterDetail draws its own phone back bar above an
  open detail, and `AdminMasterDetail` drops the slots' back arrow as
  under the sidebar.
- `FullBleed` (and so `MasterDetail`) fills the viewport below the header,
  edge to edge: the page box sets `--denim-content-padding-inline: 1em`,
  `--denim-content-padding-block: 0px` and `--denim-content-height`. Panes
  scroll on their own.
- Kiosk routes (`/kiosk/<path>`) and landing pages render without the
  header (the page box's offset and height adjust).
- `ShellMotionProvider` wraps everything, so shared motion honours
  "Reduce motion".

## Styles

`TopBarShell/styles.ts` holds the bar's styles (`topBarStyles(theme)`,
`getTopBarStyle()`): `content`, `navBar`, `headerLink`, `headerLinkActive`,
`headerLinkContainer`, `waffle`, `appNavLink`, `appNavLinkActive`,
`headerIconButton`, `iconButtonStyle`, `hiddenLgDown`, `hiddenXlUp`.
Importing it registers them with denim-fabric's `getStyle()`
(`registerBarStyles`) and types them there (a `BarStyle` augmentation), so
old code using `getStyle().navBar` keeps working. Keep the members' order:
merge-styles inserts rules in that order, which decides between two classes
on one element (the look was verified pixel-identical with this order).

## Changing it

- Props first (`Brand`, `Controls`, `ExternalApps`, `welcome`, `themes`).
- A part on its own: the role exports (`Bar`, `BarNav`, `BarLink`,
  `AppSwitcher`, `StatusDot`), which take exactly the role's props and so
  work under either bar. For a part's extra props (`AppNavBar`'s `isOpen`,
  `Header`'s `ExternalApps`), import it by name from the folder
  (`./lib/denim-fabric-topbar/TopBarShell/Header`).
- Then copy `TopBarShell/` into your app and edit the copy; its parts are
  `Header`, `NavBar` (links + Controls + link menu), `AppNavBar` (waffle
  panel), `HeaderLink`, `styles.ts`.
- Never add a member to `index.ts` alone: the export surface is shared with
  every bar (`parity.check.ts` fails your `tsc`). See `write-a-denim-skin`.

## Switching to the sidebar

Clone `denim-fabric-sidebar` next to it, change `import Shell from
'./lib/denim-fabric-topbar'` to `'./lib/denim-fabric-sidebar'`, add a
`title`, and delete this folder. Everything else (imports from the bar,
denim-fabric or the core; master-detail screens; FullBleed apps) stays.

## Verify

Drive it with typical-admin-fabric's `playwright-verify` skill at 1400px,
900px, 800px and 390px (touch): the waffle panel, the header links and the
link menu below ~1260px, Settings from the waffle panel's footer, a
master-detail screen (list | detail, the phone's back bar), a kiosk route,
and no console errors. When changing the bar's look on purpose, compare
screenshots against the previous version; when not, they must be
pixel-identical.
