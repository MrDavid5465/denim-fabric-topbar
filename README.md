# denim-fabric-topbar

The top bar for [denim-fabric](https://github.com/MrDavid5465/denim-fabric),
the [Fluent UI v8](https://developer.microsoft.com/en-us/fluentui) skin of
the [Denim](https://github.com/MrDavid5465/denim) app shell. It is Denim's
original look:

- a fixed header with a waffle button, your `Brand`, the active
  application's name, its links (a slide-out menu on narrower screens) and
  your `Controls` on the right;
- a waffle panel listing every application and its links, with Settings in
  its footer;
- pages below the header with 1em side padding.

It is one of denim-fabric's interchangeable bars. It exports **exactly the
same members as
[denim-fabric-sidebar](https://github.com/MrDavid5465/denim-fabric-sidebar)**
(`Shell`, the default export, and everything from denim-fabric and the
core), so switching bars is an import-path change. An app clones one bar
and ships only that one.

Consumed as source (no build step, no npm package).

## Using with an AI coding agent

Before writing any code with the top bar, read:

- its skill,
  [`.claude/skills/denim-fabric-topbar/SKILL.md`](./.claude/skills/denim-fabric-topbar/SKILL.md);
- denim-fabric's `.claude/skills/denim-fabric/SKILL.md` (master-detail,
  the layout hook, `FullBleed`, theming, the Settings dialog,
  `getStyle()`) and, before changing this bar or writing another,
  `.claude/skills/write-a-denim-skin/SKILL.md`;
- denim's `.claude/skills/denim-app-shell/SKILL.md` (applications, routes,
  settings, the server contract);
- typical-admin-fabric's `.claude/skills/` (`reactive-admin`,
  `form-schema`, `list-schema`, `hand-rolled-components`,
  `playwright-verify`) and typiql-rs's `.claude/skills/typiql-api`.

Skills in a cloned repository are not loaded automatically unless the agent
was started inside that repository, so open the `SKILL.md` files directly.

## Layout: clone the libraries side by side

The packages import each other by relative path (`../denim`,
`../denim-fabric`, ...), so they must be sibling folders:

```
your-app/src/lib/denim/
your-app/src/lib/denim-fabric/
your-app/src/lib/denim-fabric-topbar/
your-app/src/lib/typical-admin/
your-app/src/lib/typical-admin-fabric/
your-app/src/lib/per-form/
```

```sh
cd your-app/src/lib
git clone https://github.com/MrDavid5465/denim
git clone https://github.com/MrDavid5465/denim-fabric
git clone https://github.com/MrDavid5465/denim-fabric-topbar
git clone https://github.com/MrDavid5465/typical-admin
git clone https://github.com/MrDavid5465/typical-admin-fabric
git clone https://github.com/MrDavid5465/per-form
```

(or add them as git submodules at those paths, or copy them in). The peer
npm packages are in denim-fabric's README.

## Minimal setup

`vite.config.ts`, `src/apollo.ts`, `src/main.tsx` and
`src/admin/ProjectsAdmin.tsx` are denim-fabric's
[Minimal setup](https://github.com/MrDavid5465/denim-fabric#minimal-setup).
Then:

**`src/App.tsx`**

```tsx
import Shell from './lib/denim-fabric-topbar';
import ProjectsAdmin from './admin/ProjectsAdmin';
import { settingsTabs } from './settings/DeviceTab';

// The header, waffle panel, Settings, theming and one route per application
// at /<path>/*. `components` maps each application's `frontEnd` (from the
// backend's my.applications) to its component.
export default function App() {
  return (
    <Shell
      settingsSource="server"
      settingsFields="deviceName"
      settingsTabs={settingsTabs}
      components={{ projects: ProjectsAdmin }}
    />
  );
}
```

**`src/settings/DeviceTab.tsx`**: an extra Settings tab (the extension point
is the core's; see its skill, section 5).

```tsx
import { useEffect, useState } from 'react';
import { Form } from '../lib/denim-fabric/lib';
import type { ISettingsTab, ISettingsTabProps } from '../lib/denim-fabric-topbar';

// A Settings tab: this device's name, saved with the rest of the settings.
function DeviceTab({ settings, onChange }: ISettingsTabProps) {
  const [name, setName] = useState<string>(settings.deviceName ?? '');
  useEffect(() => {
    // Merged into the one save; isValid=false blocks Save and shows the message.
    onChange({ deviceName: name }, name.length <= 40, 'Device name: 40 characters at most.');
  }, [name, onChange]);
  return (
    <Form
      name="device"
      form={{ deviceName: { type: 'text', label: 'Device name' } }}
      initialValues={{ deviceName: settings.deviceName ?? '' }}
      onChange={(_n: string, { clean }: any) => setName(clean.deviceName ?? '')}
    />
  );
}

export const settingsTabs: ISettingsTab[] = [
  { key: 'device', headerText: 'Device', Component: DeviceTab },
];
```

Applications with no entry in `components` render an empty page; map the
others as you build them. Master-detail screens (`AdminMasterDetail`,
`MasterDetail`) and full-area apps (`FullBleed`) work here too; see
denim-fabric's README.

## Props

`Shell` takes denim-fabric's `ShellProps`: every `<DenimProvider>` prop
(`components`, `applications`, `settingsSource`, `settingsTabs`, ... see
denim's README), plus:

| Prop | What it does here |
|---|---|
| `themes` | theme builders keyed `<mode>-<color>` plus `default`; default `THEMES` |
| `Logo` | splash-screen logo |
| `Brand` | icon next to the waffle button |
| `Controls` | right side of the header; on narrow screens it also opens the link menu |
| `ExternalApps` | extra content at the top of the waffle panel |
| `breakpoints` | `{ medium, wide }` in px, default `{ medium: 700, wide: 1200 }`: the layout MasterDetail and `useLayout()` see (the header's own links switch at ~1260px) |
| `welcome` | the `/` page when there is no `RootComponent` and no launch page |
| `title`, `SidebarFooter` | accepted, ignored (the sidebar's) |

## How it behaves

- The header shows the active application's name; its `links` sit in the
  header from ~1260px wide and in a slide-out menu (the menu button, or
  your `Controls`) below that. The active link is underlined.
- `group`, `icon` and status dots are ignored here.
- Pages sit below the fixed header with 1em side padding and grow with
  their content. `FullBleed` fills the area under the header edge to edge
  (the bar sets `--denim-content-padding-inline: 1em`,
  `--denim-content-padding-block: 0px` and `--denim-content-height` on the
  page box), so `MasterDetail` gets full-height panes that scroll on their
  own.
- On a phone, `MasterDetail` draws its own back bar above an open detail
  (this bar has none; `useShellLayout().backBar` is false).
- `/kiosk/<path>` shows the application without the header.
- Motion: Fluent's own Panel slides; the shared Settings dialog fade and
  `MasterDetail`'s selection and drill-in. "Reduce motion" turns them off.

## Its styles and `getStyle()`

The bar's styles are in `TopBarShell/styles.ts` (`topBarStyles(theme)`,
`getTopBarStyle()`): `content`, `navBar`, `headerLink`, `headerLinkActive`,
`headerLinkContainer`, `waffle`, `appNavLink`, `appNavLinkActive`,
`headerIconButton`, `iconButtonStyle`, and the two breakpoint helpers its
links use, `hiddenLgDown` and `hiddenXlUp`. Importing the bar registers
them with denim-fabric's `getStyle()`, so `getStyle().navBar` and the rest
work as they did before the bars were split (and are typed, through a
`BarStyle` augmentation, in an app that has this bar).

## Switching to the sidebar

Clone denim-fabric-sidebar next to it and change the import:

```diff
-import Shell from './lib/denim-fabric-topbar';
+import Shell from './lib/denim-fabric-sidebar';
```

The props stay valid: the sidebar uses `title` and `SidebarFooter` and
ignores `Controls` and `ExternalApps`. Every other import (from the bar,
from `denim-fabric` or the core) is the same member in both. Then remove
this folder.

## Same exports as every bar

`index.ts` is `export * from '../denim-fabric'` plus `Shell` and the
default export, the surface defined in denim-fabric's
`shared/barContract.ts`. `parity.check.ts` fails your app's `tsc` if this
bar's exports drift from it; denim-fabric's `scripts/check-bar-parity.mjs`
also compares type-only exports. The header's building blocks are not on
the surface: import them from `./lib/denim-fabric-topbar/TopBarShell/Header`
(`Header`, `HeaderProps`), `.../NavBar`, `.../AppNavBar`, `.../HeaderLink`
when you vary the bar.

## Verification

In a Vite + React + TS app with the packages side by side and a read-only
GraphQL mock: strict `tsc` over the setup above and master-detail screens;
the parity check; pixel-identical to the pre-split top bar in Chromium at
1400px, 900px, 800px and 390px (touch) for home, a list, show, new, a plain
page, the waffle panel, the Settings dialog and the link menu;
`AdminMasterDetail` and `MasterDetail` at each width (list | detail, the
phone's back bar); a full-bleed canvas; no console errors.

## What's in here

| Path | What it is |
|---|---|
| `index.ts` | the bar's exports (the shared surface + `Shell` + default) |
| `parity.check.ts` | the export-parity check |
| `TopBarShell/index.tsx` | `TopBarShell` (the `Shell`) |
| `TopBarShell/Header.tsx` | the fixed header |
| `TopBarShell/NavBar.tsx` | the active app's links and `Controls`, and the narrow-screen link menu |
| `TopBarShell/AppNavBar.tsx` | the waffle panel, with Settings |
| `TopBarShell/HeaderLink.tsx` | a header link |
| `TopBarShell/styles.ts` | the bar's styles, registered with `getStyle()` |

## License

MIT, see `LICENSE`.
