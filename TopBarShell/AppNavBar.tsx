// The waffle panel: every application and its links, each application with
// its status dot, and Settings in the footer.
import React, { useState } from 'react';
import {
  DefaultButton,
  INavLink,
  IRenderFunction,
  Icon,
  IconButton,
  Nav,
  Panel,
  PanelType,
  mergeStyles,
} from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { useApplications, useNav } from '../../denim';
import { SettingsDialog } from '../../denim-fabric/shared/SettingsDialog';
import { StatusDot } from '../../denim-fabric/shared/StatusDot';
import type { AppSwitcherProps } from '../../denim-fabric/shared/barContract';
import { getTopBarStyle as getStyle } from './styles';

export interface AppNavBarProps extends AppSwitcherProps {
  /**
   * Whether the panel is open; Header passes it and opens the panel from its
   * waffle button. Without it the panel is uncontrolled and draws its own
   * waffle button (so `<AppSwitcher />` works on its own).
   */
  isOpen?: boolean;
  dismissPanel?: () => void;
  /** Extra content at the top of the panel (ShellProps.ExternalApps). */
  ExternalApps?: React.FC<any>;
}

// Space between an application's name and its dot (the Nav's link has no gap).
const dotClass = mergeStyles({ marginLeft: 6 });

// The default link content, then the application's dot (nothing while it
// has no status, so the panel is unchanged for an app without dots).
const renderLink: IRenderFunction<INavLink> = (link, defaultRender) => (
  <>
    {defaultRender?.(link)}
    {link?.app && <StatusDot app={link.app} className={dotClass} />}
  </>
);

/**
 * The package exports it as the role `AppSwitcher` (props: AppSwitcherProps).
 */
export const AppNavBar: React.FC<AppNavBarProps> = props =>
  props.isOpen === undefined ? <UncontrolledAppNavBar {...props} /> : <AppNavPanel {...props} isOpen={props.isOpen} />;

// The waffle button and the panel it opens, as in the header.
const UncontrolledAppNavBar: React.FC<AppNavBarProps> = ({ dismissPanel, ...rest }) => {
  const [open, setOpen] = useState(false);
  const style = getStyle();
  return (
    <>
      <IconButton onClick={() => setOpen(true)} className={style.headerIconButton} ariaLabel="Applications">
        <Icon iconName={'Waffle'} className={style.waffle} />
      </IconButton>
      <AppNavPanel
        {...rest}
        isOpen={open}
        dismissPanel={() => {
          setOpen(false);
          dismissPanel?.();
        }}
      />
    </>
  );
};

const AppNavPanel: React.FC<AppNavBarProps & { isOpen: boolean }> = ({ isOpen, dismissPanel, ExternalApps, onNavigate }) => {
  const navigate = useNavigate();
  const nav = useNav();
  const { applications, ready } = useApplications();
  const [modalOpen, setModalOpen] = useState(false);

  const links: INavLink[] = ready
    ? applications.map(app => ({
        name: app.name,
        url: nav.appUrl(app),
        isExpanded: nav.isAppActive(app),
        // The active app's key is the current URL, so the Nav highlights the
        // app itself only when no link below it matches.
        key: nav.isAppActive(app) ? nav.pathname : nav.appUrl(app),
        app,
        links: (app.links ?? []).map(l => ({
          name: l.text,
          url: nav.linkUrl(app, l),
          key: `/${app.path}/${l.path}`,
        })),
      }))
    : [{ name: 'Loading...', url: '', key: 'loading', disabled: true }];

  return (
    <Panel
      isLightDismiss
      customWidth={'20.94em'}
      type={PanelType.customNear}
      isOpen={isOpen}
      onDismiss={dismissPanel}
      closeButtonAriaLabel="Close"
      onRenderFooterContent={() => (
        <>
          <DefaultButton onClick={() => setModalOpen(true)}>Settings</DefaultButton>
          <SettingsDialog isOpen={modalOpen} onDismiss={() => setModalOpen(false)} />
        </>
      )}
    >
      {ExternalApps && <ExternalApps />}

      <h2>Applications</h2>
      <Nav
        selectedKey={nav.pathname}
        groups={[{ links }]}
        onRenderLink={renderLink}
        onLinkClick={(ev?: any, item?: INavLink) => {
          ev?.preventDefault();
          item && navigate(item.url);
          dismissPanel?.();
          onNavigate?.();
        }}
        isOnTop={false}
      />
    </Panel>
  );
};

export default AppNavBar;
