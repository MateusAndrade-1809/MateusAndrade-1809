import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Cloud,
  CloudRain,
  Code2,
  Compass,
  GraduationCap,
  ContactRound as Linkedin,
  Mail,
  Map,
  Menu,
  Moon,
  Pause,
  Play,
  RefreshCw,
  Sparkles,
  Sun,
  Trophy,
  X,
} from "lucide-react";
import { NAV, PROFILE, type Locale, type Section } from "./data";
import { readStorage, saveStorage, useGitHub, useWeather } from "./hooks";
import { languageCounts, weatherKind } from "./services";
import { World } from "./World";
import { RoomExit } from "./RoomExit";
import { ProjectJournal } from "./ProjectJournal";
import {
  AboutSection,
  AchievementsSection,
  ContactSection,
  ExperienceSection,
  SkillsSection,
} from "./Sections";

const validSection = (value: string): Section =>
  NAV.some((item) => item.id === value) ? (value as Section) : "world";
const sectionFromHash = () => validSection(window.location.hash.slice(1));

export function PortfolioApp() {
  const [locale, setLocale] = useState<Locale>(() =>
    readStorage<string>("devquest:locale", "pt") === "en" ? "en" : "pt",
  );
  const [section, setSection] = useState<Section>(sectionFromHash);
  const [visited, setVisited] = useState<Section[]>(() => {
    const saved = readStorage<unknown>("devquest:visited", []);
    const result = Array.isArray(saved)
      ? ([
          ...new Set(
            saved.filter(
              (item) =>
                typeof item === "string" &&
                item !== "world" &&
                NAV.some((nav) => nav.id === item),
            ),
          ),
        ] as Section[])
      : [];
    const initial = sectionFromHash();
    return initial !== "world" && !result.includes(initial)
      ? [...result, initial]
      : result;
  });
  const [quiet, setQuiet] = useState(
    () =>
      readStorage(
        "devquest:quiet",
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ) === true,
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const { data, status, retry } = useGitHub();
  const weather = useWeather();
  const pt = locale === "pt";
  const current = NAV.find((item) => item.id === section)!;
  const languages = languageCounts(data.repos);
  const navigate = useCallback((target: Section) => {
    if (window.location.hash === `#${target}`) setSection(target);
    else window.location.hash = target;
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const sync = () => {
      const next = sectionFromHash();
      setSection(next);
      if (next !== "world")
        setVisited((previous) =>
          previous.includes(next) ? previous : [...previous, next],
        );
    };
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [section]);
  useEffect(() => {
    saveStorage("devquest:visited", visited);
  }, [visited]);
  useEffect(() => {
    saveStorage("devquest:quiet", quiet);
  }, [quiet]);
  useEffect(() => {
    saveStorage("devquest:locale", locale);
    document.documentElement.lang = pt ? "pt-BR" : "en";
    document.title = pt
      ? "Mateus Andrade | Portfólio DevQuest"
      : "Mateus Andrade | DevQuest Portfolio";
  }, [locale, pt]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const WeatherIcon = weather
    ? !weather.isDay
      ? Moon
      : weatherKind(weather.code) === "rain"
        ? CloudRain
        : weatherKind(weather.code) === "cloud"
          ? Cloud
          : Sun
    : Sun;
  const statusText = {
    loading: pt ? "Sincronizando GitHub" : "Syncing GitHub",
    live: pt ? "GitHub atualizado" : "GitHub up to date",
    cached: pt ? "GitHub · dados em cache" : "GitHub · cached data",
    offline: pt ? "GitHub · cópia salva" : "GitHub · saved snapshot",
  }[status];

  return (
    <div
      className={`portfolio-app ${quiet ? "reduced-motion" : ""}`}
      style={{ "--section-accent": current.color } as CSSProperties}
    >
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        {pt ? "Ir para o conteúdo" : "Skip to content"}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#world"
            aria-label={pt ? "DevQuest, início" : "DevQuest, home"}
          >
            <span className="brand-emblem">
              <Compass size={24} strokeWidth={1.5} />
            </span>
            <span>
              DevQuest<small>MATEUS ANDRADE</small>
            </span>
          </a>
          <nav
            className={menuOpen ? "main-nav open" : "main-nav"}
            aria-label={pt ? "Navegação principal" : "Main navigation"}
            id="main-navigation"
          >
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={section === item.id ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.id === "world" && <Map size={15} />}
                {item.label[locale]}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <div
              className="language-switch"
              role="group"
              aria-label={pt ? "Idioma" : "Language"}
            >
              {(["pt", "en"] as const).map((lang) => (
                <button
                  type="button"
                  key={lang}
                  aria-pressed={locale === lang}
                  onClick={() => setLocale(lang)}
                  aria-label={lang === "pt" ? "Português" : "English"}
                  title={lang === "pt" ? "Português" : "English"}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="icon-button motion-toggle"
              title={
                quiet
                  ? pt
                    ? "Ativar animações"
                    : "Enable animations"
                  : pt
                    ? "Reduzir animações"
                    : "Reduce animations"
              }
              aria-label={
                quiet
                  ? pt
                    ? "Ativar animações"
                    : "Enable animations"
                  : pt
                    ? "Reduzir animações"
                    : "Reduce animations"
              }
              aria-pressed={quiet}
              onClick={() => setQuiet((value) => !value)}
            >
              {quiet ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              className="icon-button menu-toggle"
              aria-label={
                menuOpen
                  ? pt
                    ? "Fechar menu"
                    : "Close menu"
                  : pt
                    ? "Abrir menu"
                    : "Open menu"
              }
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className={section === "world" ? "main-world" : "main-room"}
      >
        <div className="page-heading">
          <div>
            <div className="breadcrumb">
              <span>PORTFOLIO</span>
              <ChevronRight size={12} />
              <span>
                {section === "world"
                  ? pt
                    ? "MUNDO ABERTO"
                    : "OPEN WORLD"
                  : current.label[locale]}
              </span>
            </div>
            <h1 ref={heading} tabIndex={-1}>
              {current.title[locale]}
            </h1>
            <p>{current.subtitle[locale]}</p>
          </div>
          {section === "world" ? (
            <a
              className="weather-chip"
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              title={
                pt
                  ? "Clima de Belo Horizonte · Open-Meteo"
                  : "Belo Horizonte weather · Open-Meteo"
              }
            >
              <WeatherIcon size={19} />
              <span>
                {weather ? `${Math.round(weather.temperature)}°` : "BH"}
                <small>
                  {weather
                    ? "Belo Horizonte"
                    : pt
                      ? "O reino está aberto"
                      : "The realm is open"}
                </small>
              </span>
            </a>
          ) : (
            <button
              className="button subtle back-top"
              onClick={() => navigate("world")}
            >
              <ArrowLeft size={16} />
              {pt ? "Voltar ao reino" : "Back to the realm"}
            </button>
          )}
        </div>
        {section === "world" ? (
          <>
            <div className="realm-layout">
              <aside className="adventurer-panel">
                <div className="profile-identity">
                  <img
                    src="./assets/mateus-avatar.png"
                    width="72"
                    height="72"
                    alt="Mateus Andrade Motta"
                  />
                  <span className="profile-level">
                    <GraduationCap size={14} />
                    {pt ? "EM FORMAÇÃO" : "STUDENT"}
                  </span>
                </div>
                <span className="eyebrow">
                  {pt ? "O DESENVOLVEDOR" : "THE DEVELOPER"}
                </span>
                <h2>
                  Mateus
                  <br />
                  Andrade<span>.</span>
                </h2>
                <p className="profile-role">
                  {pt
                    ? "Estudante de Engenharia de Software"
                    : "Software Engineering Student"}
                </p>
                <p className="profile-school">PUC Minas · Brasil</p>
                <div className="profile-stats">
                  <div>
                    <strong>{data.repos.length}</strong>
                    <span>{pt ? "repositórios" : "repositories"}</span>
                  </div>
                  <div>
                    <strong>{languages.length}</strong>
                    <span>{pt ? "linguagens" : "languages"}</span>
                  </div>
                  <div>
                    <strong>01</strong>
                    <span>{pt ? "conquista" : "achievement"}</span>
                  </div>
                </div>
                <button
                  className="featured-achievement"
                  onClick={() => navigate("achievements")}
                >
                  <Trophy size={24} />
                  <span>
                    <small>WE MAKE SOFTWARE</small>
                    <strong>
                      {pt
                        ? "Melhor projeto do semestre"
                        : "Best project of the semester"}
                    </strong>
                  </span>
                  <ChevronRight size={16} />
                </button>
                <div className="exploration">
                  <div>
                    <span>{pt ? "Sua exploração" : "Your exploration"}</span>
                    <strong>{visited.length} / 6</strong>
                  </div>
                  <div
                    className="exploration-track"
                    role="progressbar"
                    aria-label={pt ? "Salas visitadas" : "Rooms visited"}
                    aria-valuemin={0}
                    aria-valuemax={6}
                    aria-valuenow={visited.length}
                  >
                    {NAV.filter((item) => item.id !== "world").map((item) => (
                      <span
                        key={item.id}
                        className={
                          visited.includes(item.id) ? "is-visited" : ""
                        }
                        title={item.label[locale]}
                      />
                    ))}
                  </div>
                </div>
                <div className="profile-social">
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <Code2 size={19} />
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    aria-label="E-mail"
                    title="E-mail"
                  >
                    <Mail size={18} />
                  </a>
                  <button
                    onClick={() => navigate("about")}
                    className="text-link"
                  >
                    {pt ? "Minha história" : "My story"}
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </aside>
              <World
                locale={locale}
                visited={visited}
                weather={weather}
                quiet={quiet}
                onEnter={navigate}
              />
            </div>
            <div className="realm-bottom">
              <span>
                <Sparkles size={14} />
                {pt
                  ? "Ideias, código e um pouco de aventura."
                  : "Ideas, code and a little adventure."}
              </span>
              <button
                className="text-link"
                onClick={() => navigate("projects")}
              >
                <BookOpen size={16} />
                {pt ? "Abrir livro de projetos" : "Open project journal"}
                <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className={`room-wall room-${section}`}>
            <div className="room-content">
              {section === "about" && <AboutSection locale={locale} />}
              {section === "projects" && (
                <ProjectJournal locale={locale} repos={data.repos} />
              )}
              {section === "experience" && (
                <ExperienceSection locale={locale} />
              )}
              {section === "skills" && (
                <SkillsSection locale={locale} repos={data.repos} />
              )}
              {section === "achievements" && (
                <AchievementsSection locale={locale} />
              )}
              {section === "contact" && <ContactSection locale={locale} />}
            </div>
            <RoomExit
              key={section}
              locale={locale}
              quiet={quiet}
              onReturn={() => navigate("world")}
            />
          </div>
        )}
      </main>
      <footer className="site-footer">
        <span>
          © {new Date().getFullYear()} Mateus Andrade Motta
          <span className="footer-dot">·</span>
          <span className="footer-course">
            {pt ? "Engenharia de Software" : "Software Engineering"}
          </span>
        </span>
        <div
          className={`github-status status-${status}`}
          title={`${pt ? "Última consulta" : "Last fetched"}: ${new Date(data.fetchedAt).toLocaleString(pt ? "pt-BR" : "en-US")}`}
        >
          <span className="status-dot" />
          <span>{statusText}</span>
          <button
            className="icon-button"
            aria-label={
              pt ? "Atualizar dados do GitHub" : "Refresh GitHub data"
            }
            title={pt ? "Atualizar GitHub" : "Refresh GitHub"}
            disabled={status === "loading"}
            onClick={retry}
          >
            <RefreshCw
              size={13}
              className={status === "loading" ? "spin" : ""}
            />
          </button>
        </div>
      </footer>
    </div>
  );
}
