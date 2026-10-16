// TopBarShell: Denim's original look, rebuilt on the headless core. A fixed
// header with the current application's name and links, a waffle panel
// listing every application, and Settings in the panel's footer.
import React from 'react';
import { Stack } from '@fluentui/react';
import { DenimProvider, DenimRoutes, DenimShellProps, splitShellProps, useDenim, useNav } from '../../denim';
import { getTopBarStyle as getStyle } from './styles';
import { Splash } from '../../denim-fabric/shared/Splash';
import { FluentThemeRoot, useFluentTheme } from '../../denim-fabric/shared/theme';
import DenimLogo from '../../denim-fabric/shared/Logo';
import { ShellMotionProvider } from '../../denim-fabric/shared/motion';
import { DEFAULT_BREAKPOINTS, ShellLayoutContext, useSimpleShellLayout } from '../../denim-fabric/shared/layout';
import type { ShellProps } from '../../denim-fabric/shared/shell';
import { Header } from './Header';

/** The top bar's props: the shared ShellProps (it ignores `title` and `SidebarFooter`). */
export type TopBarShellProps = ShellProps;

type OwnProps = Omit<ShellProps, keyof DenimShellProps>;

// The page box below the header, described for FullBleed (and so for
// MasterDetail): 1em side padding, none above or below, and the height
// left under the header (the box itself only has a min-height).
const contentVars = (top: boolean): React.CSSProperties =>
  ({
    '--denim-content-padding-inline': '1em',
    '--denim-content-padding-block': '0px',
    '--denim-content-height': top ? 'calc(100dvh - 3.85em)' : '100dvh',
  }) as React.CSSProperties;
const WITH_HEADER = contentVars(true);
const WITHOUT_HEADER = { ...contentVars(false), top: '0em' };

const TopBarLayout: React.FC<OwnProps> = ({
  themes,
  Logo = DenimLogo,
  Brand,
  Controls,
  ExternalApps,
  breakpoints = DEFAULT_BREAKPOINTS,
  welcome,
}) => {
  const { status, RootComponent } = useDenim();
  const nav = useNav();
  const themeKey = useFluentTheme(themes);
  const layoutContext = useSimpleShellLayout(breakpoints);

  if (status !== 'ready') {
    // A RootComponent (a public site's homepage) stands in for the splash:
    // it renders real content without needing the backend.
    return RootComponent ? (
      <FluentThemeRoot themeKey={themeKey} themes={themes}>
        <RootComponent />
      </FluentThemeRoot>
    ) : (
      <Splash Icon={Logo} statusText={status === 'waiting' ? 'Waiting for server…' : undefined} />
    );
  }

  const style = getStyle();
  return (
    <FluentThemeRoot themeKey={themeKey} themes={themes}>
      <ShellMotionProvider>
        <ShellLayoutContext.Provider value={layoutContext}>
          {nav.showChrome && <Header Brand={Brand} Controls={Controls} ExternalApps={ExternalApps} />}
          <DenimRoutes
            welcome={
              welcome ?? (
                <Stack>
                  <h1>Welcome, Click the waffle icon to begin!</h1>
                </Stack>
              )
            }
            wrap={(content, { app, kiosk }) => (
              <Stack
                className={style.content}
                style={kiosk || (!app && !nav.showChrome) ? WITHOUT_HEADER : WITH_HEADER}
              >
                {content}
              </Stack>
            )}
          />
        </ShellLayoutContext.Provider>
      </ShellMotionProvider>
    </FluentThemeRoot>
  );
};

/**
 * The top-bar shell. Takes every <DenimProvider> prop plus the shared
 * ShellProps; a drop-in replacement for the pre-split `<Denim>`.
 */
export const TopBarShell: React.FC<ShellProps> = props => {
  const [core, own] = splitShellProps(props);
  return (
    <DenimProvider {...core}>
      <TopBarLayout {...own} />
    </DenimProvider>
  );
};

export default TopBarShell;
