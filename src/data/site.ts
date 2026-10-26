// All home-page text lives here. Source of truth: content/cv.md.
// Do not add anything that is not in cv.md; missing facts go in `todos` and TODO.md.

export const profile = {
  name: 'Islem Rebhi',
  handle: 'islem',
  role: 'Cloud & DevOps Engineering Student',
  focus: 'Platform engineering: infrastructure as code, GitOps, Kubernetes, observability.',
  lookingFor: 'PFE internship in Cloud / DevOps / Platform Engineering (Tunisia and Europe).',
  location: 'Tunis, Tunisia',
  school: 'ESPRIT',
  languages: ['Arabic (native)', 'French (fluent)', 'English (fluent)'],
};

export const links = {
  email: 'islem.rebhi@esprit.tn',
  github: 'https://github.com/Islem-rb',
  linkedin: 'https://www.linkedin.com/in/rebhi-islem/',
  cv: '/cv.pdf',
};

export const seo = {
  title: 'Islem Rebhi | Cloud & DevOps Engineering Student',
  description:
    'Islem Rebhi, Cloud & DevOps engineering student at ESPRIT. Platform engineering: infrastructure as code, GitOps, Kubernetes, observability. Open to PFE internships.',
};

export const nav = [
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export const hero = {
  ctas: {
    projects: 'View projects',
    cv: 'Download CV',
    contact: 'Contact',
  },
  terminal: {
    file: 'islem@esprit: ~',
    // Each command and its output lines, rendered by TerminalCard.
    session: [
      { cmd: 'whoami', out: [['', 'islem-rebhi']] },
      {
        cmd: 'cat profile.yaml',
        out: [
          ['role', 'Cloud & DevOps engineering student'],
          ['school', 'ESPRIT (Tunis, Tunisia)'],
          ['focus', '[IaC, GitOps, Kubernetes, observability]'],
          ['looking_for', 'PFE internship: Cloud / DevOps / Platform'],
          ['where', 'Tunisia, Europe'],
          ['languages', '[ar, fr, en]'],
        ],
      },
    ],
  },
};

export const sections = {
  projects: {
    kicker: '// projects',
    title: 'Selected projects',
    intro: 'From Terraform modules to progressive delivery on Kubernetes.',
    cta: 'Read case study',
  },
  skills: {
    kicker: '// skills',
    title: 'Toolbox',
  },
  experience: {
    kicker: '// experience & education',
    title: 'Path',
  },
  contact: {
    kicker: '// contact',
    title: "Let's talk",
    text: 'Looking for a PFE internship in Cloud / DevOps / Platform Engineering, in Tunisia or Europe.',
  },
};

export const labels = {
  contact: 'Contact',
  email: 'Email',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  newTab: '(opens in a new tab)',
  backToTop: 'Back to top ↑',
  skipLink: 'Skip to content',
};

// Grouped from the "Skills" section of cv.md. Items are copied verbatim.
export const skillGroups = [
  {
    title: 'Cloud & IaC',
    icon: 'cloud',
    items: ['AWS (EC2, VPC, S3, IAM, EKS)', 'OpenStack', 'KVM', 'Hyper-V', 'Terraform', 'Ansible'],
  },
  {
    title: 'Containers & Orchestration',
    icon: 'box',
    items: ['Docker', 'Kubernetes', 'Docker Swarm', 'Helm'],
  },
  {
    title: 'CI/CD & GitOps',
    icon: 'flow',
    items: ['GitHub Actions', 'Jenkins', 'Argo CD'],
  },
  {
    title: 'Observability & Security',
    icon: 'pulse',
    items: ['Prometheus', 'Grafana', 'Loki', 'Zabbix', 'Nagios', 'Trivy', 'Gitleaks'],
  },
  {
    title: 'Languages & Other',
    icon: 'code',
    items: [
      'Java',
      'Python',
      'JavaScript',
      'C',
      'Spring Boot',
      'Node.js',
      'Angular',
      'React',
      'Linux (Ubuntu, CentOS, RHEL)',
      'Networking',
      'Server hardening',
    ],
  },
] as const;

// Experience and education, most recent first. Dates copied exactly from cv.md.
export const timeline = [
  {
    kind: 'Education',
    org: 'ESPRIT (Ariana, Tunisia)',
    title: 'Engineering cycle, Cloud & DevOps',
    period: 'Sept 2023 to present',
    current: true,
  },
  {
    kind: 'Experience',
    org: 'Al Idhafa Group',
    title: 'Full-Stack Developer Intern',
    period: 'Jul 2025 to Aug 2025',
    text: 'Built Carnova, an automotive marketplace.',
    link: { href: '/projects/carnova', label: 'See Carnova' },
  },
  {
    kind: 'Experience',
    org: 'Abajim',
    title: 'Mobile Developer Intern',
    period: 'Feb 2024 to Jun 2024',
    text: 'React Native accessibility app for visually impaired users, OCR and text-to-speech APIs, Node.js + MongoDB backend.',
  },
  {
    kind: 'Education',
    org: 'ISITCOM (Hammam Sousse)',
    title: 'Bachelor in Computer Science',
    period: 'Sept 2021 to June 2023',
  },
  {
    kind: 'Education',
    org: 'Lycée El Manar, Kasserine',
    title: 'Baccalauréat (Mathematics)',
    period: '2020 to 2021',
  },
];

export const projectPage = {
  back: 'All projects',
  stack: 'Stack',
  repository: 'Repository',
  profileFallback: 'GitHub profile',
  flowTitle: 'Delivery flow',
  flowCaption: 'From a commit to production on EKS, then into the observability stack.',
  results: 'Results',
  next: 'Next project',
};

// GitOps EKS Platform delivery flow, from the "Delivery flow" line of cv.md.
export const deliveryFlow = [
  { title: 'git push', detail: [] },
  { title: 'GitHub Actions', detail: ['OIDC', 'Trivy', 'SBOM', 'Cosign'] },
  { title: 'ECR', detail: [] },
  { title: 'Argo CD', detail: [] },
  { title: 'EKS', detail: ['Argo Rollouts'] },
  { title: 'Observability', detail: ['Prometheus', 'Grafana', 'Loki', 'Alertmanager'] },
];

export const notFound = {
  title: 'Page not found',
  command: 'cd ./this-page',
  error: 'No such file or directory',
  back: 'Back to home',
};

export const footer = {
  note: 'Built with Astro and Tailwind CSS. Deployed on GitHub Pages.',
};

// Shown in the UI wherever a fact is missing from cv.md. Mirrored in TODO.md.
export const todos = {
  repoShort: 'TODO: repo URL',
  repo: 'TODO: exact repo URL (cv.md only links the GitHub profile)',
  metrics: 'TODO: measurable results (cv.md has no metrics for this project)',
};
