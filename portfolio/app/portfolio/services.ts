import { PROFILE, type Project } from "./data.ts";

export type Repository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  fork: boolean;
};
export type GitHubData = {
  user: {
    name: string | null;
    public_repos: number;
    followers: number;
    avatar_url: string;
  };
  repos: Repository[];
  fetchedAt: string;
};
export type Weather = {
  temperature: number;
  code: number;
  isDay: boolean;
  time: string;
};

export const GITHUB_CACHE_KEY = "devquest:github:v2";
export const CACHE_TTL = 60 * 60 * 1000;

export function safeExternalUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    /* Invalid external metadata is not made into a link. */
  }
}

export function isGitHubData(value: unknown): value is GitHubData {
  if (!value || typeof value !== "object") return false;
  const data = value as GitHubData;
  return (
    Number.isFinite(Date.parse(data.fetchedAt)) &&
    !!data.user &&
    Number.isFinite(data.user.public_repos) &&
    Array.isArray(data.repos) &&
    data.repos.every(
      (repo) =>
        !!repo &&
        typeof repo === "object" &&
        Number.isFinite(repo.id) &&
        typeof repo.name === "string" &&
        (repo.language === null || typeof repo.language === "string") &&
        typeof repo.fork === "boolean" &&
        (repo.description === null || typeof repo.description === "string") &&
        Number.isFinite(Date.parse(repo.created_at)) &&
        Number.isFinite(repo.stargazers_count) &&
        !!safeExternalUrl(repo.html_url),
    )
  );
}

export async function fetchJson(
  url: string,
  signal?: AbortSignal,
): Promise<unknown> {
  const timeout = AbortSignal.timeout(12000);
  const response = await fetch(url, {
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function fetchGitHub(signal?: AbortSignal): Promise<GitHubData> {
  const [user, firstPage] = await Promise.all([
    fetchJson(`https://api.github.com/users/${PROFILE.username}`, signal),
    fetchJson(
      `https://api.github.com/users/${PROFILE.username}/repos?per_page=100&sort=created&direction=asc`,
      signal,
    ),
  ]);
  if (!Array.isArray(firstPage)) throw new Error("Invalid repository response");
  const repos = [...firstPage];
  for (
    let page = 2;
    repos.length % 100 === 0 && repos.length > 0 && page <= 10;
    page++
  ) {
    const next = await fetchJson(
      `https://api.github.com/users/${PROFILE.username}/repos?per_page=100&sort=created&direction=asc&page=${page}`,
      signal,
    );
    if (!Array.isArray(next)) throw new Error("Invalid repository page");
    repos.push(...next);
    if (next.length < 100) break;
  }
  const result = { user, repos, fetchedAt: new Date().toISOString() };
  if (!isGitHubData(result)) throw new Error("Invalid GitHub response");
  return result;
}

export async function fetchWeather(signal?: AbortSignal): Promise<Weather> {
  const data = (await fetchJson(
    "https://api.open-meteo.com/v1/forecast?latitude=-19.92&longitude=-43.94&current=temperature_2m,weather_code,is_day&timezone=America%2FSao_Paulo",
    signal,
  )) as { current?: Record<string, number | string> };
  const current = data?.current;
  if (
    !current ||
    !Number.isFinite(current.temperature_2m) ||
    !Number.isFinite(current.weather_code) ||
    (current.is_day !== 0 && current.is_day !== 1) ||
    typeof current.time !== "string"
  ) {
    throw new Error("Invalid weather response");
  }
  return {
    temperature: Number(current.temperature_2m),
    code: Number(current.weather_code),
    isDay: current.is_day === 1,
    time: current.time,
  };
}

export function weatherKind(code: number): "sun" | "cloud" | "rain" | "snow" {
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 51) return "rain";
  if (code >= 2) return "cloud";
  return "sun";
}

export function sortProjects(
  projects: Project[],
  repos: Repository[],
  descending = false,
) {
  return projects
    .map((project) => {
      const repo = repos.find((item) => item.name === project.repoName);
      return {
        ...project,
        date: repo?.created_at ?? project.date,
        stars: repo?.stargazers_count ?? 0,
      };
    })
    .sort(
      (a, b) =>
        (Date.parse(a.date) - Date.parse(b.date)) * (descending ? -1 : 1),
    );
}

export function languageCounts(repos: Repository[]) {
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    if (!repo.fork && repo.language && repo.name !== PROFILE.username)
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export function validateContact(data: {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}) {
  const errors: Record<string, string> = {};
  if (data.name.trim().length < 2 || data.name.trim().length > 100)
    errors.name = "name";
  if (
    data.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())
  )
    errors.email = "email";
  if (data.message.trim().length < 20 || data.message.trim().length > 3000)
    errors.message = "message";
  if (!data.consent) errors.consent = "consent";
  return errors;
}

export async function sendContact(data: {
  name: string;
  email: string;
  message: string;
  website: string;
}) {
  if (data.website) throw new Error("spam");
  const response = await fetch(`https://formsubmit.co/ajax/${PROFILE.email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
      _subject: "Contato pelo portfólio DevQuest",
      _template: "table",
      _honey: data.website,
    }),
  });
  if (!response.ok) throw new Error("send-failed");
  const result = await response.json();
  if (result.success !== true && result.success !== "true")
    throw new Error("send-failed");
  return /activat|confirm.*email/i.test(String(result.message ?? ""))
    ? "activation"
    : "accepted";
}
