import type { ComponentProps, PropsWithChildren } from "react";
import type { Href } from "expo-router";

// No navigation or DOM changes on native platforms.
export function WebNavigationProvider({ children }: PropsWithChildren) { return children; }
const nativeNavigation = {
  registerLeaveGuard: (_guard: () => Promise<boolean>) => () => {},
  requestExit: async (_save: () => Promise<boolean>) => false,
  navigate: async (_href: Href) => {},
};
export function useWebNavigation() { return nativeNavigation; }
export function SiteLink(_props: PropsWithChildren<Omit<ComponentProps<"a">, "href"> & { href: Href; onNavigate?: () => void }>) { return null; }
