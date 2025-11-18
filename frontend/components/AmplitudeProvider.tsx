'use client';

import { useEffect, useRef } from 'react';
import * as amplitude from '@amplitude/unified';

export default function AmplitudeProvider() {
  const initialized = useRef(false);

  useEffect(() => {
    // Ensure Amplitude is only initialized once
    if (!initialized.current) {
      amplitude.initAll('fa10f7b2dd376e428df1c8f1667b66c4', {
        analytics: {
          autocapture: true
        },
        sessionReplay: {
          sampleRate: 1
        }
      });

      initialized.current = true;
      console.log('Amplitude Analytics and Session Replay initialized');
    }
  }, []);

  return null;
}
