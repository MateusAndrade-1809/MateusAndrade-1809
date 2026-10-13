import { useEffect, useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { type Locale } from "./data";
import { drawHero } from "./World";

export function RoomExit({
  locale,
  quiet,
  onReturn,
}: {
  locale: Locale;
  quiet: boolean;
  onReturn: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const walking = useRef(false);
  const held = useRef(0);
  const back = useRef(onReturn);
  useEffect(() => {
    back.current = onReturn;
  }, [onReturn]);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    let x = 220,
      frame = 0,
      previous = 0,
      done = false;
    const tick = (time: number) => {
      const dt = Math.min((time - (previous || time)) / 1000, 0.04);
      previous = time;
      const direction = walking.current ? -1 : held.current;
      x = Math.max(32, Math.min(310, x + direction * dt * 95));
      ctx.clearRect(0, 0, 340, 90);
      drawHero(
        ctx,
        x,
        70,
        direction < 0 ? "left" : "down",
        !quiet && direction ? Math.floor(time / 120) % 2 : 0,
      );
      if (x < 38 && !done) {
        done = true;
        back.current();
      }
      if (!done) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const blur = () => {
      held.current = 0;
    };
    window.addEventListener("blur", blur);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("blur", blur);
    };
  }, [quiet]);
  const pt = locale === "pt";
  return (
    <div
      className="room-exit"
      ref={floor}
      role="application"
      tabIndex={0}
      aria-label={
        pt
          ? "Piso da sala. Ande para a esquerda ou escolha o portal para voltar."
          : "Room floor. Walk left or select the portal to return."
      }
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
          event.preventDefault();
          held.current = -1;
        }
        if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
          event.preventDefault();
          held.current = 1;
        }
      }}
      onKeyUp={() => {
        held.current = 0;
      }}
      onBlur={() => {
        held.current = 0;
      }}
    >
      <canvas
        className="room-hero"
        ref={canvas}
        width="340"
        height="90"
        aria-hidden="true"
      />
      <button
        onClick={() => {
          walking.current = true;
          floor.current?.focus({ preventScroll: true });
        }}
        className="return-portal"
        aria-label={
          pt ? "Portal de volta ao reino" : "Portal back to the realm"
        }
      >
        <span className="portal-arch" aria-hidden="true">
          <span className="portal-energy" />
          <span className="portal-rune">◇</span>
        </span>
        <span>
          <small>{pt ? "FIM DESTE CAPÍTULO" : "END OF THIS CHAPTER"}</small>
          <strong>
            {pt ? "De volta ao reino" : "Back to the realm"}
            <ArrowRight size={16} />
          </strong>
        </span>
      </button>
      <span className="room-discovered">
        <Check size={15} />
        {pt ? "Sala descoberta" : "Room discovered"}
      </span>
    </div>
  );
}
