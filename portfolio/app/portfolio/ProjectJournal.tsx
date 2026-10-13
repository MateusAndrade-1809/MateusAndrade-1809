import { useMemo, useRef, useState, useEffect } from "react";
import {
  ArrowDownUp,
  ArrowUpRight,
  Code2,
  ExternalLink,
  ImageIcon,
  Search,
  Trophy,
  X,
} from "lucide-react";
import { PROJECTS, PROFILE, type Locale, type Project } from "./data";
import { safeExternalUrl, sortProjects, type Repository } from "./services";

export function ProjectJournal({
  locale,
  repos,
}: {
  locale: Locale;
  repos: Repository[];
}) {
  const pt = locale === "pt";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [descending, setDescending] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const projects = useMemo(
    () =>
      sortProjects(PROJECTS, repos, descending).filter(
        (project) =>
          (category === "all" || project.category === category) &&
          `${project.name} ${project.description[locale]} ${project.technologies.join(" ")}`
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase().trim()),
      ),
    [repos, descending, category, query, locale],
  );
  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
    } else if (dialog.current?.open) dialog.current.close();
  }, [selected]);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    lastTrigger.current?.focus();
  };

  return (
    <>
      <div className="project-toolbar">
        <label className="search-field">
          <Search size={17} />
          <span className="sr-only">
            {pt ? "Buscar projetos" : "Search projects"}
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              pt
                ? "Buscar projeto ou tecnologia"
                : "Search project or technology"
            }
          />
        </label>
        <label className="select-field">
          <span className="sr-only">{pt ? "Categoria" : "Category"}</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">{pt ? "Todas as áreas" : "All areas"}</option>
            <option value="web">Web</option>
            <option value="game">{pt ? "Jogos" : "Games"}</option>
            <option value="api">APIs</option>
          </select>
        </label>
        <button
          className="sort-button"
          onClick={() => setDescending((current) => !current)}
          aria-label={
            pt ? "Inverter ordem cronológica" : "Reverse chronological order"
          }
        >
          <ArrowDownUp size={16} />
          <span>
            {descending
              ? pt
                ? "Mais recentes"
                : "Newest first"
              : pt
                ? "Mais antigos"
                : "Oldest first"}
          </span>
        </button>
      </div>
      <div className="journal-summary">
        <span>
          {projects.length}{" "}
          {pt ? "projetos no livro" : "projects in the journal"}
        </span>
        <span>
          {pt ? "A jornada começou em 2026" : "The journey began in 2026"}
        </span>
      </div>
      <div className="project-timeline">
        {projects.map((project, index) => (
          <article
            className="project-entry"
            key={project.id}
            data-project={project.id}
          >
            <div className="project-date">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <time dateTime={project.date}>
                {new Intl.DateTimeFormat(pt ? "pt-BR" : "en-US", {
                  month: "short",
                  year: "numeric",
                }).format(new Date(project.date))}
              </time>
            </div>
            <button
              type="button"
              className="project-media"
              aria-label={`${pt ? "Ver imagens de" : "View images of"} ${project.name}`}
              onClick={(event) => {
                lastTrigger.current = event.currentTarget;
                setSelected(project);
                setGalleryIndex(0);
              }}
            >
              <img
                src={`./projects/${project.image}`}
                alt={`${pt ? "Tela real de" : "Actual screen of"} ${project.name}`}
                loading="lazy"
                width="1200"
                height="750"
              />
              <span className="media-expand">
                <ImageIcon size={15} />
                {pt ? "Ver projeto" : "View project"}
              </span>
              {project.award && (
                <span className="project-award">
                  <Trophy size={13} />
                  {pt ? "Projeto premiado" : "Award-winning"}
                </span>
              )}
            </button>
            <div className="project-info">
              <span className="eyebrow">
                {project.category === "game"
                  ? pt
                    ? "DESENVOLVIMENTO DE JOGOS"
                    : "GAME DEVELOPMENT"
                  : project.category === "api"
                    ? "BACK-END & API"
                    : pt
                      ? "DESENVOLVIMENTO WEB"
                      : "WEB DEVELOPMENT"}
              </span>
              <h2>{project.name}</h2>
              <p>{project.description[locale]}</p>
              <div className="tags">
                {project.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Code2 size={15} />
                  {pt ? "Código-fonte" : "Source code"}
                  <ArrowUpRight size={14} />
                </a>
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} />
                    {pt ? "Visitar site" : "Visit site"}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
        {projects.length === 0 && (
          <div className="empty-state">
            <Search size={26} />
            <h2>{pt ? "Nenhum projeto encontrado" : "No projects found"}</h2>
            <p>
              {pt
                ? "Tente outra tecnologia ou limpe os filtros."
                : "Try another technology or clear the filters."}
            </p>
            <button
              className="button subtle"
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              {pt ? "Limpar filtros" : "Clear filters"}
            </button>
          </div>
        )}
      </div>
      <details className="repository-archive">
        <summary>
          <Code2 size={19} />
          <span>
            {pt ? "Todos os repositórios públicos" : "All public repositories"}
          </span>
          <span className="archive-count">{repos.length}</span>
        </summary>
        <div className="archive-list">
          {[...repos]
            .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
            .map((repo) => (
              <a
                key={repo.id}
                href={safeExternalUrl(repo.html_url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <strong>{repo.name}</strong>
                  <small>
                    {repo.language ?? "GitHub"} ·{" "}
                    {new Date(repo.created_at).getFullYear()}
                  </small>
                </span>
                <ArrowUpRight size={17} />
              </a>
            ))}
        </div>
        <a
          className="text-link"
          href={`${PROFILE.github}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {pt ? "Continuar no GitHub" : "Continue on GitHub"}
          <ArrowUpRight size={15} />
        </a>
      </details>
      <dialog
        ref={dialog}
        className="project-dialog"
        onCancel={close}
        aria-labelledby="project-dialog-title"
      >
        {selected && (
          <div className="project-dialog-inner">
            <button
              className="icon-button dialog-close"
              onClick={close}
              aria-label={pt ? "Fechar projeto" : "Close project"}
              title={pt ? "Fechar" : "Close"}
            >
              <X size={22} />
            </button>
            <img
              src={`./projects/${(selected.gallery ?? [selected.image])[galleryIndex]}`}
              alt={selected.name}
            />
            <div className="project-dialog-text">
              <span className="eyebrow">
                {pt ? "PROJETO EM DETALHES" : "PROJECT DETAILS"}
              </span>
              <h2 id="project-dialog-title">{selected.name}</h2>
              <p>{selected.detail[locale]}</p>
              {selected.gallery && (
                <div
                  className="gallery-tabs"
                  role="group"
                  aria-label={pt ? "Imagens do projeto" : "Project images"}
                >
                  {selected.gallery.map((_, i) => (
                    <button
                      key={i}
                      aria-pressed={galleryIndex === i}
                      onClick={() => setGalleryIndex(i)}
                    >
                      {i === 0
                        ? pt
                          ? "Página inicial"
                          : "Home page"
                        : "Login"}
                    </button>
                  ))}
                </div>
              )}
              <a
                className="button primary"
                href={selected.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Code2 size={16} />
                {pt ? "Explorar repositório" : "Explore repository"}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
