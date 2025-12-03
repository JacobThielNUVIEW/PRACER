export const cssVar = (name: string) => `var(--${name})`;

export const RAC = {
  bgDepth:   cssVar('rac-depth'),
  bgSurface: cssVar('rac-surface'),
  border:    cssVar('rac-border'),
  blue:      cssVar('rac-blue'),
  blueDark:  cssVar('rac-blue-dark'),
  glow:      cssVar('rac-blue-glow'),
  text:      cssVar('rac-text-main'),
  muted:     cssVar('rac-text-muted'),
  signal:    cssVar('rac-signal'),
};

export default RAC;
