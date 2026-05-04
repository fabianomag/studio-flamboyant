export const ROUTE_SHELL_TRANSITION_KEY = "julia-route-shell-transition";

export type RouteShellTransitionMode = "home-leave" | "home-enter";

export function setPendingRouteShellTransition(mode: RouteShellTransitionMode) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ROUTE_SHELL_TRANSITION_KEY, mode);
}

export function getPendingRouteShellTransition() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ROUTE_SHELL_TRANSITION_KEY) as RouteShellTransitionMode | null;
}

export function clearPendingRouteShellTransition() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ROUTE_SHELL_TRANSITION_KEY);
}
