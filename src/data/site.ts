// All home-page text lives here. Source of truth: content/cv.md.
// Do not add anything that is not in cv.md; missing facts go in `todos` and TODO.md.

export const profile = {
  name: 'Islem Rebhi',
  handle: 'islem',
  role: 'Cloud & DevOps Engineering Student',
  focus: 'Platform engineering: infrastructure as code, GitOps, Kubernetes, observability.',
  lookingFor: 'PFE internship in Cloud / DevOps / Platform Engineering (Tunisia and Europe).',
  location: 'Ariana, Tunisia',
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
  ogImageAlt: 'Islem Rebhi, Cloud & DevOps Engineering Student. islem-rb.github.io',
  title: 'Islem Rebhi | Cloud & DevOps Engineering Student',
  description:
    'Islem Rebhi, Cloud & DevOps engineering student at ESPRIT. Platform engineering: infrastructure as code, GitOps, Kubernetes, observability. Open to PFE internships.',
};

// skills.txt window under the header. The prefix stays, the focus areas from cv.md are typed in turn.
export const tagline = {
  file: 'skills.txt',
  prefix: 'focus:',
  words: ['infrastructure as code', 'GitOps', 'Kubernetes', 'observability'],
};

// Page names for the side dots (home page sections, in order).
export const pages = {
  home: 'Home',
  about: 'About',
  projects: 'Projects & experience',
  contact: 'Contact',
  goTo: 'Go to',
  nav: 'Sections',
};

export const about = {
  title: ['Platform', 'engineering.'],
  photoAlt: 'Islem Rebhi',
  intro:
    'Cloud & DevOps engineering student at ESPRIT (Ariana, Tunisia), focused on platform engineering: infrastructure as code, GitOps, Kubernetes and observability. Looking for a PFE internship in Cloud / DevOps / Platform Engineering, in Tunisia or Europe.',
  link: 'More about me',
};

// /about page. Skills are the groups of cv.md, copied verbatim.
export const aboutPage = {
  title: 'About',
  lead: [
    'Cloud & DevOps engineering student at ESPRIT (Ariana, Tunisia).',
    'Focus: platform engineering: infrastructure as code, GitOps, Kubernetes, observability.',
    'Looking for: PFE internship in Cloud / DevOps / Platform Engineering (Tunisia and Europe).',
  ],
  skillsTitle: 'Skills',
  experienceTitle: 'Experience',
  educationTitle: 'Education',
  languagesTitle: 'Languages',
  cv: 'Download CV (PDF)',
  back: 'Back to home',
};

export const cvSkills = [
  { group: 'Cloud & infrastructure', items: 'AWS (EC2, VPC, S3, IAM, EKS), OpenStack, KVM, Hyper-V' },
  { group: 'IaC & delivery', items: 'Terraform, Ansible, GitHub Actions, Jenkins, Argo CD, Helm' },
  { group: 'Containers', items: 'Docker, Kubernetes, Docker Swarm' },
  { group: 'Observability & security', items: 'Prometheus, Grafana, Loki, Zabbix, Nagios, Trivy, Gitleaks' },
  { group: 'Systems', items: 'Linux (Ubuntu, CentOS, RHEL), networking, server hardening' },
  { group: 'Development', items: 'Java, Python, JavaScript, C, Spring Boot, Node.js, Angular, React' },
];

export const toolsLabel = 'Tools I work with';

export const sections = {
  projects: {
    title: 'Projects & experience',
    cta: 'Detailed report',
    inProgress: 'In progress',
  },
  experience: {
    kicker: '// experience & education',
    title: 'Path',
  },
  contact: {
    title: ['A question?', 'Get in touch.'],
    text: 'Looking for a PFE internship in Cloud / DevOps / Platform Engineering, in Tunisia or Europe.',
    form: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      placeholder: 'Your internship offer, project or question…',
      submit: 'Send',
      subject: 'Portfolio contact from',
      note: 'Sending opens your email app with the message filled in.',
      sent: 'Thanks, your message has been sent.',
      fallback: 'Or email me directly: ',
    },
  },
};

export const labels = {
  contact: 'Contact',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  newTab: '(opens in a new tab)',
  skipLink: 'Skip to content',
  darkTheme: 'Dark theme',
};

// Home timeline entries that have no project page (projects come from the content collection).
export const timelineExtra = [
  {
    year: '2024',
    context: 'Abajim',
    title: 'Mobile Developer Intern',
    tech: ['React Native', 'Node.js', 'MongoDB'],
    summary: 'React Native accessibility app for visually impaired users, OCR and text-to-speech APIs, Node.js + MongoDB backend.',
  },
];

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
  flowTitle: 'Delivery flow',
  flowCaption: 'From a commit to production on EKS, then into the observability stack.',
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
  about: 'About',
  cv: 'CV',
};

// Shown in the UI wherever a fact is missing from cv.md. Mirrored in TODO.md.
export const todos = {
  formspree: 'TODO: set FORMSPREE_ID in Contact.astro (the form uses mailto until then)',
  photo: 'TODO: add profile photo (src/assets/profile.jpg)',
};
