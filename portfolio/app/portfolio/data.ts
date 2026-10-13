export type Locale = "pt" | "en";
export type Section =
  | "world"
  | "about"
  | "projects"
  | "experience"
  | "skills"
  | "achievements"
  | "contact";
export type Bilingual = { pt: string; en: string };

export const PROFILE = {
  name: "Mateus Andrade Motta",
  shortName: "Mateus Andrade",
  username: "MateusAndrade-1809",
  email: "mateusandrademotta@gmail.com",
  whatsapp: "5531994337476",
  whatsappLabel: "+55 (31) 99433-7476",
  linkedin: "https://www.linkedin.com/in/mateus-andrade-6b20b63ba/",
  github: "https://github.com/MateusAndrade-1809",
  institution: "PUC Minas",
  publishedUrl: "https://mateusandrade-1809.github.io/MateusAndrade-1809/",
};

export const NAV: {
  id: Section;
  label: Bilingual;
  title: Bilingual;
  subtitle: Bilingual;
  color: string;
}[] = [
  {
    id: "world",
    label: { pt: "O reino", en: "The realm" },
    title: { pt: "O reino de Mateus", en: "Mateus' realm" },
    subtitle: {
      pt: "Cada caminho, uma parte da minha história.",
      en: "Every path, a part of my story.",
    },
    color: "#d8be76",
  },
  {
    id: "about",
    label: { pt: "Sobre mim", en: "About me" },
    title: { pt: "Muito além do personagem", en: "Beyond the character" },
    subtitle: {
      pt: "Uma jornada em construção, uma ideia de cada vez.",
      en: "A journey in the making, one idea at a time.",
    },
    color: "#81c6b1",
  },
  {
    id: "projects",
    label: { pt: "Projetos", en: "Projects" },
    title: { pt: "Meu livro de projetos", en: "My project journal" },
    subtitle: {
      pt: "Do primeiro experimento aos desafios mais recentes.",
      en: "From my first experiment to my latest challenges.",
    },
    color: "#e6c277",
  },
  {
    id: "experience",
    label: { pt: "Experiências", en: "Experience" },
    title: { pt: "A jornada até aqui", en: "The journey so far" },
    subtitle: {
      pt: "Aprendizado, colaboração e histórias para contar.",
      en: "Learning, collaboration and stories worth sharing.",
    },
    color: "#9cbfec",
  },
  {
    id: "skills",
    label: { pt: "Habilidades", en: "Skills" },
    title: { pt: "Meu inventário", en: "My inventory" },
    subtitle: {
      pt: "As ferramentas com que transformo ideias em projetos.",
      en: "The tools I use to turn ideas into projects.",
    },
    color: "#c6a7e4",
  },
  {
    id: "achievements",
    label: { pt: "Conquistas", en: "Achievements" },
    title: { pt: "O salão das conquistas", en: "The achievement hall" },
    subtitle: {
      pt: "Marcos reais, construídos em equipe.",
      en: "Real milestones, built together.",
    },
    color: "#eda889",
  },
  {
    id: "contact",
    label: { pt: "Contato", en: "Contact" },
    title: {
      pt: "Vamos criar algo juntos?",
      en: "Let's build something together",
    },
    subtitle: {
      pt: "Uma conversa pode ser o começo da próxima aventura.",
      en: "A conversation could start the next adventure.",
    },
    color: "#8ed3c9",
  },
];

export const VOLUNTARIZE_REPO =
  "https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti1-0438100-equipe-voluntarize";

export type Project = {
  id: string;
  name: string;
  date: string;
  repo: string;
  repoName?: string;
  description: Bilingual;
  detail: Bilingual;
  technologies: string[];
  category: "web" | "game" | "api";
  image: string;
  gallery?: string[];
  demo?: string;
  award?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "mam",
    name: "MAM Solidário",
    date: "2026-03-22",
    repoName: "mam-solidario",
    repo: `${PROFILE.github}/mam-solidario`,
    demo: "https://mateusandrade-1809.github.io/mam-solidario/",
    description: {
      pt: "Um projeto web acadêmico voltado a uma ONG e às suas ações solidárias.",
      en: "An academic web project presenting a nonprofit and its community initiatives.",
    },
    detail: {
      pt: "Um dos meus primeiros projetos públicos: estruturação de páginas, apresentação de conteúdo e publicação de um site acessível pelo navegador.",
      en: "One of my first public projects: page structure, content presentation and publishing a website people can visit.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "web",
    image: "mam-solidario.webp",
  },
  {
    id: "gastos",
    name: "Controle de Gastos",
    date: "2026-03-26",
    repoName: "controle-de-gastos",
    repo: `${PROFILE.github}/controle-de-gastos`,
    description: {
      pt: "Um organizador de despesas com cadastro, exclusão e cálculo do total de gastos.",
      en: "An expense organizer with creation, deletion and total calculation.",
    },
    detail: {
      pt: "Aplicação de aprendizado com Python e Flask, conectando formulários HTML ao processamento no servidor. Os dados desta versão ficam em memória.",
      en: "A learning application with Python and Flask, connecting HTML forms to server-side processing. This version keeps data in memory.",
    },
    technologies: ["Python", "Flask", "HTML", "CSS"],
    category: "web",
    image: "controle-gastos.webp",
  },
  {
    id: "interfaces",
    name: "Interfaces Web",
    date: "2026-05-02",
    repoName: "trabalho-pr-tico-semana-9-MateusAndrade-1809",
    repo: `${PROFILE.github}/trabalho-pr-tico-semana-9-MateusAndrade-1809`,
    description: {
      pt: "Atividade de Desenvolvimento de Interfaces Web com conteúdo dinâmico e páginas de detalhes.",
      en: "A Web Interface Development assignment with dynamic content and detail pages.",
    },
    detail: {
      pt: "Prática de JavaScript, manipulação do DOM e organização de dados para construir interações no navegador.",
      en: "JavaScript, DOM manipulation and data organization practice for building browser interactions.",
    },
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "web",
    image: "interfaces-web.webp",
  },
  {
    id: "voluntarize",
    name: "Voluntarize",
    date: "2026-04-07",
    repo: VOLUNTARIZE_REPO,
    description: {
      pt: "Uma plataforma que conecta pessoas que querem ajudar às ONGs que precisam de apoio.",
      en: "A platform connecting people who want to help with nonprofits that need support.",
    },
    detail: {
      pt: "Desenvolvido em equipe na PUC Minas, reúne descoberta de oportunidades, cadastro de voluntários e ONGs e gestão de candidaturas. Eleito melhor projeto do semestre e apresentado no We Make Software.",
      en: "Built as a team at PUC Minas, it brings together opportunity discovery, volunteer and nonprofit registration, and application management. Selected as the semester's best project and presented at We Make Software.",
    },
    technologies: ["HTML", "CSS", "JavaScript", "JSON Server", "Git"],
    category: "web",
    image: "voluntarize.webp",
    gallery: ["voluntarize.webp", "voluntarize-login.webp"],
    award: true,
  },
  {
    id: "alvo",
    name: "Alvo Relâmpago",
    date: "2026-06-07",
    repoName: "Alvo_Relampago",
    repo: `${PROFILE.github}/Alvo_Relampago`,
    description: {
      pt: "Um jogo de precisão e velocidade feito em Python, com alvos, combos e ranking de jogadores.",
      en: "A precision and speed game built with Python, featuring targets, combos and player rankings.",
    },
    detail: {
      pt: "Projeto em grupo de Introdução a Algoritmos. A dificuldade aumenta durante a partida, com itens especiais, efeitos sonoros e estatísticas de desempenho.",
      en: "An Introduction to Algorithms team project. Difficulty rises throughout the game, with special items, sound effects and performance statistics.",
    },
    technologies: ["Python", "Pygame"],
    category: "game",
    image: "alvo-relampago.png",
  },
  {
    id: "clima",
    name: "API-Clima",
    date: "2026-08-27",
    repoName: "API-Clima",
    repo: `${PROFILE.github}/API-Clima`,
    description: {
      pt: "Uma API REST em Java que consulta o clima de Belo Horizonte usando dados da Open-Meteo.",
      en: "A Java REST API that retrieves Belo Horizonte weather using Open-Meteo data.",
    },
    detail: {
      pt: "Construída com Spring Boot, separa controller, serviço e DTOs. Retorna temperatura, vento e horário da medição, com tratamento de indisponibilidade do serviço externo.",
      en: "Built with Spring Boot, with separate controller, service and DTO layers. Returns temperature, wind and measurement time, including external-service error handling.",
    },
    technologies: ["Java", "Spring Boot", "Maven", "REST API"],
    category: "api",
    image: "api-clima.webp",
  },
];

export const EXPERIENCES = [
  {
    id: "wms",
    period: { pt: "2026", en: "2026" },
    institution: "We Make Software · PUC Minas",
    role: {
      pt: "Apresentação de projeto premiado",
      en: "Award-winning project presentation",
    },
    description: {
      pt: "Com a equipe do Voluntarize, participei do We Make Software para apresentar o projeto escolhido como o melhor do semestre. Uma experiência de colaboração, comunicação e apresentação de uma solução com impacto social.",
      en: "Together with the Voluntarize team, I took part in We Make Software to present the project selected as the best of the semester. An experience in collaboration, communication and presenting a socially meaningful solution.",
    },
    tags: ["Voluntarize", "We Make Software"],
    award: true,
  },
  {
    id: "team",
    period: { pt: "1º semestre de 2026", en: "First semester of 2026" },
    institution: "PUC Minas · TIAW",
    role: {
      pt: "Desenvolvimento web em equipe",
      en: "Team-based web development",
    },
    description: {
      pt: "Participei do desenvolvimento do Voluntarize, desde a organização da proposta até a construção das interfaces e funcionalidades. O trabalho envolveu documentação, divisão de tarefas e colaboração com Git e GitHub.",
      en: "I contributed to Voluntarize, from shaping the proposal to building interfaces and features. The work involved documentation, task organization and collaboration with Git and GitHub.",
    },
    tags: ["JavaScript", "Git", "Trabalho em equipe"],
    award: false,
  },
  {
    id: "lab",
    period: { pt: "2026 · em andamento", en: "2026 · ongoing" },
    institution: "PUC Minas · Engenharia de Software",
    role: {
      pt: "Formação e projetos acadêmicos",
      en: "Education and academic projects",
    },
    description: {
      pt: "Desenvolvo projetos práticos em interfaces web, algoritmos e integração de aplicações. Minha jornada inclui Python e Pygame, aplicações com Flask e APIs REST com Java e Spring Boot.",
      en: "I develop practical projects in web interfaces, algorithms and application integration. My journey includes Python and Pygame, Flask applications, and REST APIs with Java and Spring Boot.",
    },
    tags: ["Python", "Java", "APIs REST"],
    award: false,
  },
];

export const SKILL_GROUPS = [
  {
    title: { pt: "Interfaces & experiências", en: "Interfaces & experiences" },
    items: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    description: {
      pt: "Páginas responsivas, interações e organização visual.",
      en: "Responsive pages, interactions and visual organization.",
    },
  },
  {
    title: { pt: "Lógica & aplicações", en: "Logic & applications" },
    items: ["Python", "Pygame", "Flask", "Jupyter Notebook"],
    description: {
      pt: "Algoritmos, jogos e aplicações em Python.",
      en: "Algorithms, games and Python applications.",
    },
  },
  {
    title: { pt: "Serviços & integração", en: "Services & integration" },
    items: ["Java", "Spring Boot", "Maven", "REST API", "JSON Server"],
    description: {
      pt: "Serviços web e comunicação entre aplicações.",
      en: "Web services and communication between applications.",
    },
  },
  {
    title: { pt: "Colaboração & ferramentas", en: "Collaboration & tools" },
    items: ["Git", "GitHub", "VS Code", "Figma"],
    description: {
      pt: "Versionamento, documentação e trabalho em equipe.",
      en: "Version control, documentation and teamwork.",
    },
  },
];

export const ABOUT = {
  intro: {
    pt: "Sou Mateus Andrade Motta, estudante de Engenharia de Software na PUC Minas. Gosto de transformar ideias em experiências que as pessoas possam usar de verdade.",
    en: "I'm Mateus Andrade Motta, a Software Engineering student at PUC Minas. I enjoy turning ideas into experiences people can actually use.",
  },
  journey: {
    pt: "Minha trajetória passa por desenvolvimento web, programação em Python e integração de APIs com Java. Aprendo construindo: de um jogo em Pygame a uma plataforma de voluntariado desenvolvida em equipe.",
    en: "My journey spans web development, Python programming and API integration with Java. I learn by building: from a Pygame game to a volunteering platform developed as a team.",
  },
  objective: {
    pt: "Quero continuar evoluindo como desenvolvedor, colaborar em projetos com propósito e encontrar oportunidades para aplicar o que aprendo na graduação.",
    en: "I want to keep growing as a developer, collaborate on meaningful projects and find opportunities to apply what I learn at university.",
  },
};
