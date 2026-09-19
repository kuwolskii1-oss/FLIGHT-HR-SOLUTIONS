import { useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => {};

/** Renders children only after hydration; the fallback is what the server and first paint show. */
export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return <>{mounted ? children : fallback}</>;
}
