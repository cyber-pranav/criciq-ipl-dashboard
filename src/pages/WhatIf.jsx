import React from 'react';
import { IconSparkles } from '@tabler/icons-react';
import WhatIfEngine from '../components/ai/WhatIfEngine';

export default function WhatIf() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          <IconSparkles size={24} className="text-cyan" stroke={1.5} />
          What-If Simulator
        </h1>
        <p className="text-muted text-sm mt-1">Explore alternate cricket realities</p>
      </div>
      <WhatIfEngine />
    </div>
  );
}
