import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { NAV, type Locale, type Section } from "./data";
import { weatherKind, type Weather } from "./services";

export const PORTAL_LOCATIONS: { id: Section; x: number; y: number }[] = [
  { id: "about", x: 24, y: 32 },
  { id: "projects", x: 50, y: 22 },
  { id: "skills", x: 77, y: 32 },
  { id: "experience", x: 24, y: 67 },
  { id: "achievements", x: 50, y: 77 },
  { id: "contact", x: 77, y: 67 },
];

const HERO = [
  "......hhhhh.......",
  ".....hHHHHHh......",
  "....hHHLLHHHh.....",
  "....hHLLLLHHh.....",
  "....hSSSSSSSh.....",
  "....SSESSSESS.....",
  "....SSSSSSSSS.....",
  ".....SSSmSSS......",
  "......SSSSS.......",
  "....rrrrrrrrr.....",
  "...brrrrrrrrrb....",
  "...bBBBBBBBbb....",
  "..SbBBbBBbBBbS....",
  "..SbBBbBBbBBbS....",
  "..SSBBbBBbBBSS....",
  "....BBBBBBBBB.....",
  "....BByyyBBBB.....",
  "....bbbbbBBBB.....",
  ".....bbb.bbb......",
  ".....bbb.bbb......",
];
const PALETTE: Record<string, string> = {
  h: "#30251f",
  H: "#6e4330",
  L: "#ae7450",
  S: "#f1c799",
  E: "#31342e",
  m: "#b7735a",
  r: "#b64d39",
  b: "#263a4b",
  B: "#588794",
  y: "#d7bd6c",
};

export function drawHero(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: string,
  walkFrame: number,
  bounce = 0,
) {
  ctx.fillStyle = "#17271e66";
  ctx.fillRect(x - 13, y - 2, 26, 5);
  ctx.save();
  ctx.translate(Math.round(x) - 18, Math.round(y) - 43 - bounce);
  if (facing === "left") {
    ctx.translate(36, 0);
    ctx.scale(-1, 1);
  }
  HERO.forEach((row, py) =>
    [...row].forEach((cell, px) => {
      if (!PALETTE[cell]) return;
      ctx.fillStyle =
        facing === "up" && py >= 4 && py <= 8 ? PALETTE.H : PALETTE[cell];
      ctx.fillRect(px * 2, py * 2, 2, 2);
    }),
  );
  ctx.fillStyle = "#252b2b";
  ctx.fillRect(9 + walkFrame, 39, 7, 4);
  ctx.fillRect(19 - walkFrame, 39, 7, 4);
  ctx.restore();
}

export function World({
  locale,
  visited,
  weather,
  quiet,
  onEnter,
}: {
  locale: Locale;
  visited: Section[];
  weather: Weather | null;
  quiet: boolean;
  onEnter: (section: Section) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const keys = useRef(new Set<string>());
  const destination = useRef<{ x: number; y: number } | null>(null);
  const position = useRef({ x: 50, y: 51 });
  const onEnterRef = useRef(onEnter);
  const [near, setNear] = useState<Section | null>(null);
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    const activeKeys = keys.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0;
    let previous = 0;
    let entered = false;
    let lastNear: Section | null = null;
    let facing = "down";
    const tick = (time: number) => {
      const delta = Math.min((time - (previous || time)) / 1000, 0.04);
      previous = time;
      let dx =
        (keys.current.has("arrowright") || keys.current.has("d") ? 1 : 0) -
        (keys.current.has("arrowleft") || keys.current.has("a") ? 1 : 0);
      let dy =
        (keys.current.has("arrowdown") || keys.current.has("s") ? 1 : 0) -
        (keys.current.has("arrowup") || keys.current.has("w") ? 1 : 0);
      if (dx || dy) destination.current = null;
      if (destination.current) {
        dx = destination.current.x - position.current.x;
        dy = destination.current.y - position.current.y;
        if (Math.hypot(dx, dy) < 0.35) {
          dx = 0;
          dy = 0;
          destination.current = null;
        }
      }
      const distance = Math.hypot(dx, dy);
      const walking = distance > 0;
      if (walking && !entered) {
        const step = Math.min(
          distance,
          (keys.current.has("shift") ? 28 : 18) * delta,
        );
        position.current.x = Math.max(
          16,
          Math.min(84, position.current.x + (dx / distance) * step),
        );
        position.current.y = Math.max(
          19,
          Math.min(81, position.current.y + (dy / distance) * step),
        );
        facing =
          Math.abs(dx) > Math.abs(dy)
            ? dx > 0
              ? "right"
              : "left"
            : dy > 0
              ? "down"
              : "up";
      }
      const nearest = PORTAL_LOCATIONS.find(
        (portal) =>
          Math.hypot(
            portal.x - position.current.x,
            portal.y - position.current.y,
          ) < 9,
      );
      if ((nearest?.id ?? null) !== lastNear) {
        lastNear = nearest?.id ?? null;
        setNear(lastNear);
      }
      if (
        nearest &&
        !entered &&
        Math.hypot(
          nearest.x - position.current.x,
          nearest.y - position.current.y,
        ) < 2.5
      ) {
        entered = true;
        onEnterRef.current(nearest.id);
      }
      ctx.clearRect(0, 0, 768, 512);
      ctx.imageSmoothingEnabled = false;
      const x = Math.round((position.current.x / 100) * 768);
      const y = Math.round((position.current.y / 100) * 512);
      const walkFrame = walking ? Math.floor(time / 120) % 2 : 0;
      const bounce = !quiet && walking ? walkFrame : 0;
      drawHero(ctx, x, y, facing, walkFrame, bounce);
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    const down = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (
        (event.target as HTMLElement)?.closest(
          "input, textarea, select, [contenteditable=true]",
        )
      )
        return;
      const key = event.key.toLowerCase();
      if (
        ![
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "w",
          "a",
          "s",
          "d",
          "shift",
        ].includes(key)
      )
        return;
      if (!worldRef.current?.contains(document.activeElement)) return;
      event.preventDefault();
      keys.current.add(key);
    };
    const up = (event: KeyboardEvent) =>
      keys.current.delete(event.key.toLowerCase());
    const blur = () => keys.current.clear();
    const visibility = () => {
      blur();
      cancelAnimationFrame(frame);
      previous = 0;
      if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      activeKeys.clear();
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [quiet]);

  const directions = [
    { key: "arrowup", Icon: ArrowUp, pt: "Andar para cima", en: "Walk up" },
    {
      key: "arrowleft",
      Icon: ArrowLeft,
      pt: "Andar para a esquerda",
      en: "Walk left",
    },
    {
      key: "arrowdown",
      Icon: ArrowDown,
      pt: "Andar para baixo",
      en: "Walk down",
    },
    {
      key: "arrowright",
      Icon: ArrowRight,
      pt: "Andar para a direita",
      en: "Walk right",
    },
  ];
  return (
    <div className={`world-wrap ${quiet ? "quiet" : ""}`}>
      <div
        className={`world-map ${weather && !weather.isDay ? "world-night" : ""}`}
        ref={worldRef}
        tabIndex={0}
        role="application"
        onKeyDown={(event) => {
          if (event.key === "Escape") destination.current = null;
        }}
        aria-label={
          locale === "pt"
            ? "Mapa jogável. Use WASD, setas ou escolha um portal."
            : "Playable map. Use WASD, arrow keys or select a portal."
        }
        onPointerDown={(event) => {
          if (
            event.target === event.currentTarget ||
            event.target instanceof HTMLCanvasElement
          )
            worldRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("button")) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          destination.current = {
            x: Math.max(
              16,
              Math.min(
                84,
                ((event.clientX - bounds.left) / bounds.width) * 100,
              ),
            ),
            y: Math.max(
              19,
              Math.min(
                81,
                ((event.clientY - bounds.top) / bounds.height) * 100,
              ),
            ),
          };
        }}
      >
        <img
          className="world-art"
          src="./assets/forest-world.webp"
          width="1536"
          height="1024"
          alt=""
          draggable={false}
          fetchPriority="high"
        />
        <div className="world-light" aria-hidden="true" />
        {PORTAL_LOCATIONS.map((portal) => {
          const info = NAV.find((item) => item.id === portal.id)!;
          return (
            <button
              type="button"
              key={portal.id}
              className={`world-portal ${near === portal.id ? "near" : ""} ${visited.includes(portal.id) ? "visited" : ""}`}
              aria-label={`${locale === "pt" ? "Entrar no portal" : "Enter portal"}: ${info.label[locale]}`}
              style={
                {
                  left: `${portal.x}%`,
                  top: `${portal.y}%`,
                  "--portal-color": info.color,
                } as React.CSSProperties
              }
              onClick={() => {
                destination.current = { x: portal.x, y: portal.y };
              }}
            >
              <span className="portal-arch" aria-hidden="true">
                <span className="portal-energy" />
                <span className="portal-rune">◇</span>
              </span>
              <span className="portal-label">
                {info.label[locale]}
                {visited.includes(portal.id) && <i aria-hidden="true" />}
              </span>
            </button>
          );
        })}
        <canvas
          width="768"
          height="512"
          className="hero-canvas"
          ref={canvasRef}
          role="img"
          aria-label={
            locale === "pt" ? "Personagem de Mateus" : "Mateus' character"
          }
        />
        {weather && weatherKind(weather.code) === "rain" && !quiet && (
          <div className="world-rain" aria-hidden="true" />
        )}
        <div className="map-coordinate" aria-hidden="true">
          DEVQUEST / 01
        </div>
        <div
          className="direction-pad"
          aria-label={locale === "pt" ? "Movimento" : "Movement"}
        >
          {directions.map(({ key, Icon, ...label }) => (
            <button
              key={key}
              type="button"
              title={label[locale]}
              aria-label={label[locale]}
              onPointerDown={(event) => {
                event.preventDefault();
                keys.current.add(key);
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={() => keys.current.delete(key)}
              onPointerCancel={() => keys.current.delete(key)}
              onLostPointerCapture={() => keys.current.delete(key)}
              onKeyDown={(event) => {
                if (event.key === " " || event.key === "Enter")
                  keys.current.add(key);
              }}
              onKeyUp={() => keys.current.delete(key)}
              onBlur={() => keys.current.delete(key)}
            >
              <Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
