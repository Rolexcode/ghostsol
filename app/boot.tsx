'use client';

import { useEffect } from 'react';

export default function Boot() {
  useEffect(() => {
    if (!document.getElementById('intro')) return;
    const script = document.createElement('script');
    script.src = '/script.js';
    document.body.appendChild(script);
    return () => script.remove();
  }, []);
  return null;
}
