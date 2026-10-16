// The top bar's own styles: the fixed header, its links, the waffle button,
// the content offset below the header, and the two breakpoint helpers the
// header's links use. They were getStyle() members before the bars became
// separate packages, and still are: importing this module registers them
// with denim-fabric's getStyle(), and the BarStyle augmentation below types
// them there (getStyle().navBar, ...).
import { getTheme, mergeStyleSets } from '@fluentui/react';
import type { IStyle, ITheme } from '@fluentui/react';
import { registerBarStyles } from '../../denim-fabric/lib/getStyle';

export interface TopBarStyle {
  /** The page under the fixed header: offset by its height, 1em side padding. */
  content: IStyle;
  /** Hidden below ~1261px (the header's inline links). */
  hiddenLgDown: IStyle;
  /** Hidden from ~1260px (the header's link-menu button). */
  hiddenXlUp: IStyle;
  appNavLink: IStyle;
  appNavLinkActive: IStyle;
  /** The waffle button. */
  headerIconButton: IStyle;
  /** The waffle icon. */
  waffle: IStyle;
  headerLinkActive: IStyle;
  headerLink: IStyle;
  headerLinkContainer: IStyle;
  /** The link-menu button on narrow screens. */
  iconButtonStyle: IStyle;
  /** The right side of the header. */
  navBar: IStyle;
}

declare module '../../denim-fabric/lib/getStyle' {
  // getStyle() includes the top bar's members in an app that has the top bar.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface BarStyle extends TopBarStyle {}
}

// The members keep their pre-split order: merge-styles inserts rules in
// this order, which decides between two classes on one element.
export const topBarStyles = (theme: ITheme): TopBarStyle => ({
  content: {
    position: 'relative',
    top: '3.85em',
    paddingRight: '1em',
    paddingLeft: '1em',
    width: '100%',
    marginRight: 'auto',
    marginLeft: 'auto',
    minHeight: 'calc(100vh - 3.85em)',
  },
  hiddenLgDown: {
    selectors: {
      '@media (max-width: 78.848em)': {
        display: 'none',
      },
    },
  },
  hiddenXlUp: {
    selectors: {
      '@media (min-width: 78.771em)': {
        display: 'none',
      },
    },
  },
  appNavLink: {
    position: 'fixed',
    left: 0,
    paddingLeft: '2.156em',
    width: '208.016',
    textAlign: 'left',
    overflow: 'hidden',
    color: theme.semanticColors.actionLink,
    textDecoration: 'none',
    selectors: {
      ':hover': {
        color: theme.semanticColors.link,
      },
    },
  },
  appNavLinkActive: {
    background: theme.palette.neutralLight,
    borderLeft: `0.231em solid ${theme.palette.themePrimary}`,
    selectors: {
      ':hover': {
        background: theme.palette.neutralLighter,
      },
    },
  },
  headerIconButton: {
    color: theme.palette.themeLighter,
    backgroundColor: theme.semanticColors.primaryButtonBackground,
    height: '3.85em',
    width: '3.85em',
    padding: 0,
    borderRight: `solid ${theme.palette.themeTertiary} 0.077em`,
    borderRadius: 0,
    selectors: {
      ':hover': {
        color: theme.semanticColors.primaryButtonTextHovered,
        backgroundColor: theme.semanticColors.primaryButtonBackgroundHovered,
      },
      ':active': {
        color: theme.semanticColors.primaryButtonTextPressed,
        backgroundColor: theme.semanticColors.primaryButtonBackgroundPressed,
      },
    },
  },
  waffle: {
    fontSize: '2em',
  },
  headerLinkActive: {
    borderTop: `0.308em solid ${theme.palette.themePrimary}`,
    borderBottom: `0.308em solid ${theme.palette.themeTertiary}`,
  },
  headerLink: {
    color: theme.palette.themeLighter,
    fontSize: '1.3em',
    textDecoration: 'none',
  },
  headerLinkContainer: {
    display: 'inline-block',
    height: '3.85em',
    padding: '.77em',
    borderTop: `0.308em solid ${theme.palette.themePrimary}`,
    borderBottom: `0.308em solid ${theme.palette.themePrimary}`,
    selectors: {
      ':hover': {
        backgroundColor: theme.semanticColors.primaryButtonBackgroundHovered,
      },
    },
  },
  iconButtonStyle: {
    color: theme.semanticColors.primaryButtonText,
    backgroundColor: theme.semanticColors.primaryButtonBackground,
    height: '3.85em',
    width: '3.85em',
    padding: 0,
    selectors: {
      ':hover': {
        color: theme.semanticColors.primaryButtonTextHovered,
        backgroundColor: theme.semanticColors.primaryButtonBackgroundHovered,
      },
      ':active': {
        color: theme.semanticColors.primaryButtonTextHovered,
        backgroundColor: theme.semanticColors.primaryButtonBackgroundPressed,
      },
    },
  },
  navBar: {
    position: 'fixed',
    right: 0,
    top: 0,
  },
});

registerBarStyles(topBarStyles);

/** The top bar's class names for the current theme. */
export const getTopBarStyle = () => mergeStyleSets(topBarStyles(getTheme()));
