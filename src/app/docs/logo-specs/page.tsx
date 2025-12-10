import React from 'react';
import PartnerLogo from '@/components/PartnerLogo';
import { IMAGES } from '@/lib/constants';

const logos: string[] = Object.keys(IMAGES.logos).filter(k => !k.toLowerCase().includes('dark'));

export default function LogoSpecsPage() {
  return (
    <div className="min-h-screen p-12 bg-rac-depth text-rac-text-main">
      <h1 className="text-3xl font-hud mb-6">PRACER — Partner Logo Specs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {logos.map((key) => (
          <div key={key} className="p-6 bg-rac-surface rounded-lg border border-rac-border">
            <h2 className="font-bold text-lg mb-2">{key}</h2>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-rac-text-muted">Light</p>
                <PartnerLogo brand={key as any} size={64} />
              </div>
              <div className="bg-black p-2 rounded">
                <p className="text-sm text-rac-text-muted">Dark</p>
                <PartnerLogo brand={key as any} size={64} dark />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
