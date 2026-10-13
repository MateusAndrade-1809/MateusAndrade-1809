import { useCallback, useEffect, useState } from "react";
import snapshot from "../../public/data/github-snapshot.json";
import {
  CACHE_TTL,
  GITHUB_CACHE_KEY,
  fetchGitHub,
  fetchWeather,
  isGitHubData,
  type GitHubData,
  type Weather,
} from "./services";

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function saveStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private browsing can deny storage. */
  }
}

export function useGitHub() {
  const [initial] = useState(() => {
    const cached = readStorage<unknown>(GITHUB_CACHE_KEY, null);
    const valid = isGitHubData(cached);
    const age = valid ? Date.now() - Date.parse(cached.fetchedAt) : Infinity;
    return {
      data: valid ? cached : (snapshot as GitHubData),
      fresh: valid && age >= 0 && age < CACHE_TTL,
    };
  });
  const [data, setData] = useState<GitHubData>(initial.data);
  const [status, setStatus] = useState<
    "loading" | "live" | "cached" | "offline"
  >(initial.fresh ? "cached" : "loading");
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (attempt === 0 && initial.fresh) return;
    fetchGitHub(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setData(result);
        setStatus("live");
        saveStorage(GITHUB_CACHE_KEY, result);
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus("offline");
      });
    return () => controller.abort();
  }, [attempt, initial.fresh]);
  return { data, status, retry };
}

export function useWeather() {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchWeather(controller.signal)
      .then(setWeather)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return weather;
}
