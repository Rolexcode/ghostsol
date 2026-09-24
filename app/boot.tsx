'use client';

import { useEffect } from 'react';

export default function Boot() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/script.js';
    document.body.appendChild(script);
    return () => script.remove();
  }, []);
  return null;
}
