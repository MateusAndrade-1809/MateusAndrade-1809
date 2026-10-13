import { writeFile } from "node:fs/promises";
import { fetchGitHub } from "../app/portfolio/services.ts";

const data = await fetchGitHub();
const { name, public_repos, followers, avatar_url } = data.user;
const snapshot = {
  fetchedAt: data.fetchedAt,
  user: { name, public_repos, followers, avatar_url },
  repos: data.repos.map(
    ({
      id,
      name,
      description,
      html_url,
      homepage,
      language,
      created_at,
      updated_at,
      stargazers_count,
      fork,
    }) => ({
      id,
      name,
      description,
      html_url,
      homepage,
      language,
      created_at,
      updated_at,
      stargazers_count,
      fork,
    }),
  ),
};
await writeFile(
  new URL("../public/data/github-snapshot.json", import.meta.url),
  JSON.stringify(snapshot, null, 2) + "\n",
);
console.log(
  `Saved ${snapshot.repos.length} public repositories at ${snapshot.fetchedAt}.`,
);
