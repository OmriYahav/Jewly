import { useEffect, useMemo } from "react";
import { router } from "expo-router";

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
  const normalizedRoutes = useMemo(() => {
    if (!Array.isArray(routes)) {
      return [];
    }

    return routes
      .map(normalizeRoute)
      .filter(Boolean);
  }, [routes]);

  useEffect(() => {
    if (normalizedRoutes.length === 0) {
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
            console.warn("Failed to preload route", route, error);
          }
        }
      }
    };

    prefetch();

    return () => {
      cancelled = true;
    };
  }, [normalizedRoutes]);
}
