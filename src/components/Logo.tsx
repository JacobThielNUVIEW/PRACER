import React from 'react';

export default function Logo({ size = 56 }: { size?: number }) {
  const style: React.CSSProperties = { width: size, height: size, minWidth: size, minHeight: size };
  return (
    <div className="logo-mark" style={style} role="img" aria-label="REACELAY logo">R</div>
  );
}
