import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { PROJECTS, PROFILE } from "../app/portfolio/data.ts";
import {
  safeExternalUrl,
  isGitHubData,
  sortProjects,
  languageCounts,
  validateContact,
  fetchGitHub,
  fetchWeather,
  sendContact,
  weatherKind,
} from "../app/portfolio/services.ts";

const snapshot = JSON.parse(
  readFileSync(new URL("../public/data/github-snapshot.json", import.meta.url)),
);
const valid = {
  name: "Visitante",
  email: "teste@example.com",
  message: "Gostaria de conversar sobre um projeto.",
  consent: true,
  website: "",
};
test("snapshot público é válido e projetos têm capturas locais", () => {
  assert.equal(isGitHubData(snapshot), true);
  for (const project of PROJECTS)
    for (const image of project.gallery ?? [project.image])
      assert.ok(
        existsSync(new URL(`../public/projects/${image}`, import.meta.url)),
        image,
      );
});
test("cache malformado não derruba a aplicação", () => {
  for (const value of [
    null,
    {},
    [],
    { ...snapshot, repos: [null] },
    {
      ...snapshot,
      repos: [{ ...snapshot.repos[0], html_url: "javascript:alert(1)" }],
    },
  ])
    assert.equal(isGitHubData(value), false);
});
test("links externos recusam scripts e esquemas inválidos", () => {
  assert.equal(
    safeExternalUrl("https://github.com/example"),
    "https://github.com/example",
  );
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,bad",
    "/relative",
    "",
    null,
  ])
    assert.equal(safeExternalUrl(url), undefined);
});
test("linha do tempo começa no mais antigo sem mutar dados", () => {
  const ordered = sortProjects(PROJECTS, snapshot.repos);
  assert.equal(ordered[0].id, "mam");
  assert.equal(ordered.at(-1).id, "clima");
  assert.equal(ordered[2].id, "voluntarize");
  assert.equal(sortProjects(PROJECTS, snapshot.repos, true)[0].id, "clima");
  assert.equal(PROJECTS[0].date, "2026-03-22");
});
test("distribuição conta repositórios, não níveis fictícios", () => {
  const base = snapshot.repos[0];
  assert.deepEqual(
    languageCounts([
      { ...base, name: "a", language: "Java", fork: false },
      { ...base, name: "b", language: "Java", fork: false },
      { ...base, name: "c", language: "Python", fork: true },
      { ...base, name: PROFILE.username, language: "HTML", fork: false },
    ]),
    [["Java", 2]],
  );
});
test("formulário exige nome, email, mensagem e consentimento", () => {
  assert.deepEqual(validateContact(valid), {});
  assert.deepEqual(
    Object.keys(
      validateContact({
        name: "a",
        email: "invalido",
        message: "oi",
        consent: false,
      }),
    ).sort(),
    ["consent", "email", "message", "name"],
  );
  assert.ok(validateContact({ ...valid, message: "x".repeat(3001) }).message);
});
test("códigos de clima identificam sol, nuvens e chuva", () => {
  assert.equal(weatherKind(0), "sun");
  assert.equal(weatherKind(3), "cloud");
  assert.equal(weatherKind(61), "rain");
  assert.equal(weatherKind(71), "snow");
});
test("API GitHub consulta perfil e repositórios", async () => {
  const original = global.fetch;
  const calls = [];
  global.fetch = async (url) => {
    calls.push(url);
    return Response.json(
      url.includes("/repos?") ? snapshot.repos : snapshot.user,
    );
  };
  try {
    const data = await fetchGitHub();
    assert.equal(data.repos.length, snapshot.repos.length);
    assert.equal(calls.length, 2);
  } finally {
    global.fetch = original;
  }
});
test("erros de API são propagados para o fallback", async () => {
  const original = global.fetch;
  global.fetch = async () => new Response("", { status: 403 });
  try {
    await assert.rejects(fetchGitHub(), /HTTP 403/);
  } finally {
    global.fetch = original;
  }
});
test("clima inválido não é mostrado como informação real", async () => {
  const original = global.fetch;
  global.fetch = async () =>
    Response.json({ current: { temperature_2m: "erro" } });
  try {
    await assert.rejects(fetchWeather(), /Invalid weather/);
  } finally {
    global.fetch = original;
  }
});
test("envio só confirma sucesso com resposta positiva do serviço", async () => {
  const original = global.fetch;
  try {
    global.fetch = async () =>
      Response.json({ success: true, message: "Submission successful" });
    assert.equal(await sendContact(valid), "accepted");
    global.fetch = async () =>
      Response.json({ success: "true", message: "Please activate your email" });
    assert.equal(await sendContact(valid), "activation");
    global.fetch = async () =>
      Response.json({
        success: "false",
        message: "This form needs Activation. We've sent you an email containing an 'Activate Form' link.",
      });
    assert.equal(await sendContact(valid), "activation");
    global.fetch = async () => Response.json({ success: false });
    await assert.rejects(sendContact(valid), /send-failed/);
    await assert.rejects(sendContact({ ...valid, website: "spam" }), /spam/);
  } finally {
    global.fetch = original;
  }
});
