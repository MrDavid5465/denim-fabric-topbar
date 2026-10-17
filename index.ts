// denim-fabric-topbar: the top bar for denim-fabric (Fluent UI v8), Denim's
// original look: a fixed header with the active application's name and
// links, a waffle panel listing every application, Settings in the panel's
// footer.
//
// The export surface is the same as every other bar's (denim-fabric's
// shared/barContract.ts): everything from denim-fabric (and so the core),
// `Shell` and the default export, and the bar's building blocks under the
// shared role names (Bar, BarNav, BarLink, AppSwitcher, StatusDot), each
// typed with the role's shared props. Switching to denim-fabric-sidebar is
// an import-path change. parity.check.ts keeps it that way.
//
// The components keep their own names in TopBarShell/ (Header, NavBar,
// HeaderLink, AppNavBar), with their extra props.
import { TopBarShell } from './TopBarShell';
import { Header } from './TopBarShell/Header';
import { NavBar } from './TopBarShell/NavBar';
import { HeaderLink } from './TopBarShell/HeaderLink';
import { AppNavBar } from './TopBarShell/AppNavBar';
import { StatusDot as SharedStatusDot } from '../denim-fabric/shared/StatusDot';
import type { ShellComponent } from '../denim-fabric/shared/shell';
import type {
  AppSwitcherComponent,
  BarComponent,
  BarLinkComponent,
  BarNavComponent,
  StatusDotComponent,
} from '../denim-fabric/shared/barContract';

export * from '../denim-fabric';

/** The top-bar shell (ShellProps; ignores `title` and `SidebarFooter`). */
export const Shell: ShellComponent = TopBarShell;
export default Shell;

/** The bar: the fixed header (`Header`), with the waffle panel. */
export const Bar: BarComponent = Header;
/** An application's links: the header's links and narrow-screen link menu (`NavBar`). */
export const BarNav: BarNavComponent = NavBar;
/** One header link (`HeaderLink`). */
export const BarLink: BarLinkComponent = HeaderLink;
/** The waffle panel (`AppNavBar`), with its own waffle button when used on its own. */
export const AppSwitcher: AppSwitcherComponent = AppNavBar;
/** An application's status dot, as drawn in the waffle panel. */
export const StatusDot: StatusDotComponent = SharedStatusDot;
