import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from '@fluentui/react';
import type { BarLinkProps } from '../../denim-fabric/shared/barContract';
import { getTopBarStyle as getStyle } from './styles';

/**
 * A link in the top bar, underlined in the theme colour when active. The
 * package exports it as the role `BarLink` (props: BarLinkProps).
 */
export const HeaderLink: React.FC<BarLinkProps> = ({ to, children, className = '', active, onClick }) => {
  const style = getStyle();
  return (
    <Link to={to} aria-current={active ? 'page' : undefined} onClick={onClick}>
      <Stack
        verticalAlign={'center'}
        className={`${style.headerLinkContainer} ${active ? style.headerLinkActive : ''}`}
      >
        <span className={`${style.headerLink} ${className}`}>{children}</span>
      </Stack>
    </Link>
  );
};

export default HeaderLink;
