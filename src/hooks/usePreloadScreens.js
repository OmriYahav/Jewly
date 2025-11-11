import { useEffect, useMemo } from "react";
import { router, useRootNavigation, useRootNavigationState } from "expo-router";

const noop = () => {};

function normalizeRoute(route) {
  if (!route) {
    return null;
  }

  if (typeof route === "string") {
    return route;
  }

  if (typeof route === "object") {
    return { ...route };
  }

  return null;
}

export function usePreloadScreens(routes) {
  const navigationState = useRootNavigationState();
  const rootNavigation = useRootNavigation();
  const navigationIsReady =
    typeof rootNavigation?.isReady === "function"
      ? rootNavigation.isReady()
      : Boolean(navigationState?.routes?.length);
  const isNavigationReady = Boolean(
    navigationState?.key &&
      typeof navigationState?.index === "number" &&
      Array.isArray(navigationState?.routes) &&
      navigationState.routes.length > 0 &&
      navigationIsReady
  );

  const normalizedRoutes = useMemo(() => {
    if (!Array.isArray(routes)) {
      return [];
    }

    return routes
      .map(normalizeRoute)
      .filter(Boolean);
  }, [routes]);

  useEffect(() => {
    if (!isNavigationReady || normalizedRoutes.length === 0) {
      return noop;
    }

    let cancelled = false;

    const prefetch = async () => {
      for (const route of normalizedRoutes) {
        if (cancelled) {
          return;
        }

        try {
          await router.prefetch(route);
        } catch (error) {
          if (__DEV__) {
            const message = String(error?.message ?? "");
            if (!message.includes("Attempted to navigate before mounting the Root Layout component")) {
              console.warn("Failed to preload route", route, error);
            }
          }
        }
      }
    };

    prefetch();

    return () => {
      cancelled = true;
    };
  }, [isNavigationReady, normalizedRoutes]);
}
