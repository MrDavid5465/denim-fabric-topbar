// denim-fabric-topbar: the top bar for denim-fabric (Fluent UI v8), Denim's
// original look: a fixed header with the active application's name and
// links, a waffle panel listing every application, Settings in the panel's
// footer.
//
// The export surface is the same as every other bar's (denim-fabric's
// shared/barContract.ts): everything from denim-fabric (and so the core),
// plus `Shell` and the default export. Switching to denim-fabric-sidebar is
// an import-path change. parity.check.ts keeps it that way.
import { TopBarShell } from './TopBarShell';
import type { ShellComponent } from '../denim-fabric/shared/shell';

export * from '../denim-fabric';

/** The top-bar shell (ShellProps; ignores `title` and `SidebarFooter`). */
export const Shell: ShellComponent = TopBarShell;
export default Shell;
