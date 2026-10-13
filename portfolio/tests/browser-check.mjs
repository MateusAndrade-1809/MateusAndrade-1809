import { chromium } from "playwright";
import { preview } from "vite";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
(async () => {
  await fs.mkdir("work/screenshots", { recursive: true });
  const server = await preview({
    configFile: "vite.pages.config.ts",
    preview: { host: "127.0.0.1", port: 4178, strictPort: true },
  });

  let browser;
  const errors = [];
  const results = [];
  try {
    browser = await chromium.launch({
      channel: process.env.PW_CHANNEL || undefined,
      headless: true,
    });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4178/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    for (const size of [
      { width: 1440, height: 1000 },
      { width: 390, height: 844 },
      { width: 320, height: 740 },
    ]) {
      await page.setViewportSize(size);
      for (const section of [
        "world",
        "about",
        "projects",
        "experience",
        "skills",
        "achievements",
        "contact",
      ]) {
        await page.goto("http://127.0.0.1:4178/#" + section, {
          waitUntil: "networkidle",
        });
        await page.evaluate(async () => {
          await document.fonts.ready;
          await Promise.all(
            [...document.images].map(async (i) => {
              i.loading = "eager";
              try {
                await i.decode();
              } catch {}
            }),
          );
        });
        const bad = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          images: [...document.images]
            .filter((i) => !i.complete || i.naturalWidth === 0)
            .map((i) => i.src),
        }));
        assert.equal(bad.overflow, false, `${size.width} ${section} overflow`);
        assert.deepEqual(bad.images, [], `${section} missing images`);
        await page.screenshot({
          path: `work/screenshots/${section}-${size.width}.png`,
          fullPage: true,
        });
        results.push(`${size.width}px ${section}: no overflow, images loaded`);
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("http://127.0.0.1:4178/#projects");
    assert.equal(
      await page.locator("[data-project]").first().getAttribute("data-project"),
      "mam",
    );
    await page.getByRole("searchbox").fill("Pygame");
    assert.equal(await page.locator("[data-project]").count(), 1);
    await page
      .getByRole("button", { name: "Ver imagens de Alvo Relâmpago" })
      .click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").isVisible(), false);
    await page.getByRole("searchbox").fill("zzzz");
    await page.getByText("Nenhum projeto encontrado").waitFor();
    await page.getByRole("button", { name: "Limpar filtros" }).click();
    assert.equal(await page.locator("[data-project]").count(), 6);
    await page
      .getByRole("button", { name: "Inverter ordem cronológica" })
      .click();
    assert.equal(
      await page.locator("[data-project]").first().getAttribute("data-project"),
      "clima",
    );
    results.push("Project search, filters, sorting and modal: PASS");
    await page.getByRole("button", { name: "English", exact: true }).click();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
    await page.getByRole("button", { name: "Português", exact: true }).click();
    results.push("PT/EN persistence: PASS");
    await page.goto("http://127.0.0.1:4178/#world");
    const canvas = page.locator("canvas");
    const before = await canvas.evaluate((c) => c.toDataURL());
    await page.locator(".world-map").focus();
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(500);
    await page.keyboard.up("ArrowRight");
    assert.notEqual(await canvas.evaluate((c) => c.toDataURL()), before);
    await page
      .getByRole("button", {
        name: "Entrar no portal: Habilidades",
        exact: true,
      })
      .click();
    await page.waitForURL("**/#skills", { timeout: 10000 });
    assert.ok((await page.locator("h1").textContent()).includes("inventário"));
    results.push("Nonblank canvas, animated movement and portal arrival: PASS");
    await page
      .getByRole("button", { name: "Portal de volta ao reino" })
      .click();
    await page.waitForURL("**/#world", { timeout: 10000 });
    results.push("Room character walks to the return portal: PASS");
    await page.goto("http://127.0.0.1:4178/#contact");
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    assert.equal(await page.locator("[aria-invalid=true]").count(), 4);
    await page.getByLabel("Seu nome").fill("Teste automatizado");
    await page.getByLabel("Seu e-mail").fill("teste@example.com");
    await page
      .getByLabel("Sua mensagem")
      .fill("Mensagem de teste interceptada, não enviada.");
    await page.getByRole("checkbox").check();
    await page.route("https://formsubmit.co/**", (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await page.getByRole("alert").waitFor();
    assert.ok(
      (await page.getByLabel("Sua mensagem").inputValue()).includes(
        "interceptada",
      ),
    );
    await page.unroute("https://formsubmit.co/**");
    await page.route("https://formsubmit.co/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: "false",
          message: "This form needs Activation. We've sent you an email containing an 'Activate Form' link.",
        }),
      }),
    );
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await page.locator(".form-feedback.activation").waitFor();
    assert.ok((await page.getByLabel("Sua mensagem").inputValue()).includes("interceptada"));
    results.push("Activation response preserves fields and shows pending setup: PASS");
    await page.unroute("https://formsubmit.co/**");
    await page.route("https://formsubmit.co/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          message: "Submission successful",
        }),
      }),
    );
    await page.getByRole("button", { name: "Enviar mensagem" }).click();
    await page
      .getByText(
        "Mensagem aceita pelo serviço de envio. Obrigado pelo contato!",
      )
      .waitFor();
    assert.equal(await page.getByLabel("Sua mensagem").inputValue(), "");
    results.push(
      "Contact validation, simulated failure preservation and simulated acceptance: PASS (no real email sent)",
    );
    const offline = await browser.newPage({
      viewport: { width: 390, height: 844 },
    });
    await offline.route("https://api.github.com/**", (r) =>
      r.fulfill({ status: 403, body: "rate limited" }),
    );
    await offline.route("https://api.open-meteo.com/**", (r) => r.abort());
    await offline.goto("http://127.0.0.1:4178/", { waitUntil: "networkidle" });
    await offline.getByText("GitHub · cópia salva").waitFor();
    assert.equal(
      await offline.locator(".profile-stats strong").first().textContent(),
      "10",
    );
    await offline.getByRole("button", { name: "Abrir menu" }).click();
    await offline
      .locator(".main-nav")
      .getByRole("link", { name: "Contato", exact: true })
      .click();
    await offline.getByLabel("Seu nome").waitFor();
    results.push("Rate-limit fallback and mobile navigation: PASS");
    assert.deepEqual(errors, []);
    await fs.writeFile(
      "work/qa-results.json",
      JSON.stringify(
        { checkedAt: new Date().toISOString(), results, errors },
        null,
        2,
      ),
    );
    console.log(results.join("\n"));
  } finally {
    await browser?.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
