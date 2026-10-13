import {
  ArrowUpRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  Code2,
  Copy,
  Download,
  GraduationCap,
  HeartHandshake,
  ContactRound as Linkedin,
  Mail,
  MessageCircle,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  ABOUT,
  EXPERIENCES,
  PROFILE,
  SKILL_GROUPS,
  VOLUNTARIZE_REPO,
  type Locale,
} from "./data";
import { languageCounts, type Repository } from "./services";
import { ContactForm } from "./ContactForm";

export function AboutSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  return (
    <div className="about-layout">
      <div className="about-copy">
        <span className="eyebrow">
          {pt ? "OLÁ, EU SOU O MATEUS" : "HELLO, I'M MATEUS"}
        </span>
        <h2>
          {pt
            ? "Curiosidade para aprender.\nVontade de construir."
            : "Curious to learn.\nDriven to build."}
        </h2>
        <p className="lead">{ABOUT.intro[locale]}</p>
        <p>{ABOUT.journey[locale]}</p>
        <p>{ABOUT.objective[locale]}</p>
        <div className="about-actions">
          <a
            className="button primary"
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code2 size={17} />
            GitHub
            <ArrowUpRight size={15} />
          </a>
          <a className="button subtle" href="./mateus-andrade.vcf" download>
            <Download size={16} />
            {pt ? "Salvar contato" : "Save contact"}
          </a>
        </div>
      </div>
      <aside className="about-facts">
        <img
          className="about-avatar"
          src="./assets/mateus-avatar.png"
          alt={PROFILE.name}
          width="256"
          height="256"
        />
        <h3>{PROFILE.name}</h3>
        <dl>
          <div>
            <GraduationCap size={19} />
            <dt>{pt ? "Formação" : "Education"}</dt>
            <dd>
              {pt ? "Engenharia de Software" : "Software Engineering"}
              <small>PUC Minas · {pt ? "em andamento" : "ongoing"}</small>
            </dd>
          </div>
          <div>
            <Code2 size={19} />
            <dt>{pt ? "Interesses" : "Interests"}</dt>
            <dd>
              {pt
                ? "Web, APIs e desenvolvimento de jogos"
                : "Web, APIs and game development"}
            </dd>
          </div>
          <div>
            <Users size={19} />
            <dt>{pt ? "O que valorizo" : "What I value"}</dt>
            <dd>
              {pt
                ? "Aprendizado contínuo e colaboração"
                : "Continuous learning and collaboration"}
            </dd>
          </div>
          <div>
            <Award size={19} />
            <dt>{pt ? "Um marco especial" : "A special milestone"}</dt>
            <dd>
              Voluntarize
              <small>
                {pt
                  ? "Melhor projeto do semestre"
                  : "Best project of the semester"}
              </small>
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

export function ExperienceSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  return (
    <div className="experience-section">
      <div className="experience-intro">
        <GraduationCap size={25} />
        <p>
          {pt
            ? "Minha experiência está sendo construída na graduação, em projetos colaborativos e apresentações acadêmicas."
            : "I'm building my experience through university, collaborative projects and academic presentations."}
        </p>
      </div>
      <div className="experience-timeline">
        {EXPERIENCES.map((item) => (
          <article
            key={item.id}
            className={`experience-entry ${item.award ? "experience-award" : ""}`}
          >
            <div className="experience-marker">
              {item.award ? (
                <Trophy size={21} />
              ) : (
                <BriefcaseBusiness size={20} />
              )}
            </div>
            <div className="experience-period">{item.period[locale]}</div>
            <div className="experience-content">
              <span className="eyebrow">{item.institution}</span>
              <h2>{item.role[locale]}</h2>
              <p>{item.description[locale]}</p>
              <div className="tags">
                {item.tags.map((tag) => (
                  <span key={tag}>
                    {!pt && tag === "Trabalho em equipe" ? "Teamwork" : tag}
                  </span>
                ))}
              </div>
              {item.award && (
                <a
                  className="text-link"
                  href={VOLUNTARIZE_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pt
                    ? "Conheça o projeto premiado"
                    : "Discover the award-winning project"}
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection({
  locale,
  repos,
}: {
  locale: Locale;
  repos: Repository[];
}) {
  const pt = locale === "pt";
  const counts = languageCounts(repos);
  const total = counts.reduce((sum, [, count]) => sum + count, 0) || 1;
  return (
    <div className="skills-section">
      <div className="skills-grid">
        {SKILL_GROUPS.map((group, i) => (
          <article className="skill-group" key={group.title.pt}>
            <span className={`skill-icon skill-color-${i}`}>
              {i === 0 ? (
                <Code2 size={22} />
              ) : i === 1 ? (
                <BookOpen size={22} />
              ) : i === 2 ? (
                <BriefcaseBusiness size={22} />
              ) : (
                <Users size={22} />
              )}
            </span>
            <h2>{group.title[locale]}</h2>
            <p>{group.description[locale]}</p>
            <div className="tags">
              {group.items.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="language-section">
        <div>
          <span className="eyebrow">GITHUB</span>
          <h2>{pt ? "Linguagens na prática" : "Languages in practice"}</h2>
          <p>
            {pt
              ? "Linguagem principal dos meus repositórios públicos. A distribuição representa projetos, não um nível de domínio."
              : "Primary languages in my public repositories. This distribution represents projects, not proficiency."}
          </p>
        </div>
        <div className="language-bars">
          {counts.map(([name, count], index) => (
            <div
              className={`language-bar language-color-${index % 5}`}
              key={name}
            >
              <div>
                <strong>{name}</strong>
                <span>
                  {count} {pt ? "repos." : "repos"}
                </span>
              </div>
              <div
                className="language-track"
                role="meter"
                aria-label={name}
                aria-valuenow={count}
                aria-valuemin={0}
                aria-valuemax={total}
              >
                <span style={{ width: `${(count / total) * 100}%` }} />
              </div>
            </div>
          ))}
          {counts.length === 0 && (
            <p>
              {pt
                ? "As linguagens aparecerão quando houver repositórios disponíveis."
                : "Languages will appear when repositories are available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AchievementsSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  return (
    <div className="achievement-section">
      <div className="award-showcase">
        <div className="award-seal">
          <Trophy size={60} strokeWidth={1.2} />
          <span>2026</span>
        </div>
        <div>
          <span className="eyebrow">WE MAKE SOFTWARE · PUC MINAS</span>
          <h2>
            {pt
              ? "Melhor projeto\ndo semestre."
              : "Best project\nof the semester."}
          </h2>
          <p className="lead">Voluntarize</p>
          <p>
            {pt
              ? "Uma conquista da nossa equipe. Criamos uma plataforma para aproximar voluntários e ONGs, fomos escolhidos como o melhor projeto do semestre e levamos nossa solução ao We Make Software."
              : "A team achievement. We created a platform to bring volunteers and nonprofits together, were selected as the best project of the semester and presented our solution at We Make Software."}
          </p>
          <a
            href={VOLUNTARIZE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            {pt ? "Ver o trabalho da equipe" : "See the team's work"}
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
      <figure className="award-project-image">
        <img
          src="./projects/voluntarize.webp"
          alt={
            pt
              ? "Página inicial real do Voluntarize"
              : "Actual Voluntarize home page"
          }
          width="1200"
          height="750"
        />
        <figcaption>
          {pt
            ? "Voluntarize · plataforma desenvolvida em equipe na PUC Minas"
            : "Voluntarize · a platform developed as a team at PUC Minas"}
        </figcaption>
      </figure>
      <div className="award-values">
        <div>
          <HeartHandshake size={22} />
          <strong>{pt ? "Impacto social" : "Social impact"}</strong>
          <span>
            {pt
              ? "Tecnologia que conecta pessoas a causas."
              : "Technology connecting people with causes."}
          </span>
        </div>
        <div>
          <Users size={22} />
          <strong>{pt ? "Construção coletiva" : "Built together"}</strong>
          <span>
            {pt
              ? "Planejamento e desenvolvimento em equipe."
              : "Team planning and development."}
          </span>
        </div>
        <div>
          <Award size={22} />
          <strong>
            {pt ? "Reconhecimento acadêmico" : "Academic recognition"}
          </strong>
          <span>
            {pt
              ? "Projeto apresentado no We Make Software."
              : "Project presented at We Make Software."}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ContactSection({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  return (
    <div className="contact-layout">
      <aside className="contact-aside">
        <span className="eyebrow">
          {pt ? "A PRÓXIMA MISSÃO" : "THE NEXT QUEST"}
        </span>
        <h2>
          {pt
            ? "Boas ideias começam\ncom um olá."
            : "Good ideas start\nwith a hello."}
        </h2>
        <p>
          {pt
            ? "Vamos conversar sobre tecnologia, projetos colaborativos ou oportunidades de aprendizado e desenvolvimento."
            : "Let's talk about technology, collaborative projects or learning and development opportunities."}
        </p>
        <div className="contact-methods">
          <a href={`mailto:${PROFILE.email}`}>
            <Mail size={20} />
            <span>
              <strong>E-mail</strong>
              <small>{PROFILE.email}</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a
            href={`https://wa.me/${PROFILE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} />
            <span>
              <strong>WhatsApp</strong>
              <small>{PROFILE.whatsappLabel}</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={20} />
            <span>
              <strong>LinkedIn</strong>
              <small>Mateus Andrade</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
            <Code2 size={20} />
            <span>
              <strong>GitHub</strong>
              <small>@{PROFILE.username}</small>
            </span>
            <ArrowUpRight size={17} />
          </a>
        </div>
        <button
          className="text-link copy-contact"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(PROFILE.email);
              setCopied(true);
              setCopyError(false);
            } catch {
              setCopyError(true);
            }
          }}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied
            ? pt
              ? "E-mail copiado"
              : "Email copied"
            : pt
              ? "Copiar e-mail"
              : "Copy email"}
        </button>
        {copyError && (
          <p role="status">
            {pt
              ? "Você pode selecionar o endereço acima para copiar."
              : "You can select the address above to copy it."}
          </p>
        )}
      </aside>
      <div className="contact-form-side">
        <h3>{pt ? "Deixe sua mensagem" : "Leave a message"}</h3>
        <ContactForm locale={locale} />
      </div>
    </div>
  );
}
