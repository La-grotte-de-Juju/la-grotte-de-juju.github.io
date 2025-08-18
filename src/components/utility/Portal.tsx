"use client";
import { useEffect, useRef, ReactNode, useState } from 'react';

interface PortalProps {
  children: ReactNode;
  id?: string;
}

export function Portal({ children, id = 'portal-root' }: PortalProps) {
  const elRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  if (!elRef.current && typeof document !== 'undefined') {
    const existing = document.getElementById(id) as HTMLElement | null;
    elRef.current = existing ?? document.createElement('div');
    if (!existing) {
      elRef.current.setAttribute('id', id);
    }
  }

  useEffect(() => {
    if (!elRef.current) return;
    if (!elRef.current.isConnected) document.body.appendChild(elRef.current);
    setMounted(true);
  }, []);

  type PortalFn = (children: ReactNode, container: Element) => React.ReactPortal;
  const [portal, setPortal] = useState<PortalFn | null>(null);
  useEffect(() => {
    import('react-dom').then(m => setPortal(() => m.createPortal));
  }, []);
  if (!mounted || !elRef.current || !portal) return null;
  return portal(children, elRef.current);
}
