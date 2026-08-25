export type RosterTab = 'experience' | 'projects' | 'interests';

export type ProfessionalMove = { name: string; skill: string };

export type CareerEntry = {
  id: string;
  creatureName: string;
  organization: string;
  role: string;
  category: 'Experience' | 'Project' | 'Interest';
  cardMetadata: string;
  dates?: string;
  location?: string;
  highlight: string;
  professionalType: string;
  moves: ProfessionalMove[];
  spriteId: string;
  link?: { label: string; href: string };
};

export type Roster = {
  id: RosterTab;
  label: string;
  entries: CareerEntry[];
};

export type ProfessionalLink = { label: string; href: string };

export type TrainerProfile = {
  name: string;
  school: string;
  graduation: string;
  major: string;
  hometown: string;
  links: ProfessionalLink[];
};

const moves = (...skills: string[]): ProfessionalMove[] =>
  skills.map((skill) => ({ name: skill, skill }));

export const rosterTabs: Roster[] = [
  {
    id: 'experience',
    label: 'Experience',
    entries: [
      {
        id: 'amazon',
        creatureName: 'AWS',
        organization: 'Amazon Web Services (AWS)',
        role: 'Software Development Engineer Intern',
        category: 'Experience',
        cardMetadata: 'Aug 2026 - Present',
        dates: 'Aug 2026 - Present',
        location: 'Seattle, WA',
        highlight:
          'Designing an agentic AI advisor that reduces cloud-access review cycles from 4 weeks to 2 hours.',
        professionalType: 'Cloud Engineering',
        moves: moves(
          'Amazon Bedrock AgentCore',
          'Strands',
          'RAG',
          'Bedrock Guardrails',
          'Entra / Google OAuth',
        ),
        spriteId: 'amazon',
      },
      {
        id: 'draftkings',
        creatureName: 'DraftKings',
        organization: 'DraftKings',
        role: 'Software Engineering Intern',
        category: 'Experience',
        cardMetadata: 'Jun 2026 - Aug 2026',
        dates: 'Jun 2026 - Aug 2026',
        location: 'Boston, MA',
        highlight:
          'Built a LangGraph agent querying Snowflake across 3 verticals, cutting cloud-cost analysis by 20 hours per week.',
        professionalType: 'Software Engineering',
        moves: moves('LangGraph', 'Snowflake', 'Kubernetes', 'Terraform', 'Datadog'),
        spriteId: 'draftkings',
      },
      {
        id: 'procuremateai',
        creatureName: 'ProcureMate AI',
        organization: 'ProcureMate AI',
        role: 'Software Engineering Intern',
        category: 'Experience',
        cardMetadata: 'Jan 2026 - May 2026',
        dates: 'Jan 2026 - May 2026',
        location: 'Boston, MA',
        highlight:
          'Built a computer vision system across 20+ dental offices, eliminating 15+ hours per week of manual work per office.',
        professionalType: 'Computer Vision',
        moves: moves('Node.js', 'S3', 'Vercel', 'Roboflow', 'Claude API'),
        spriteId: 'procuremateai',
      },
      {
        id: 'johnson-johnson',
        creatureName: 'Johnson & Johnson',
        organization: 'Johnson & Johnson',
        role: 'Software Engineering Co-op',
        category: 'Experience',
        cardMetadata: 'Jun 2025 - Dec 2025',
        dates: 'Jun 2025 - Dec 2025',
        location: 'Raritan, NJ',
        highlight:
          'Built Node.js Slack microservices delivering trial data on demand, eliminating 15 hours per week of manual exports.',
        professionalType: 'AI/ML Engineering',
        moves: moves('Node.js', 'Microsoft Graph', 'SharePoint', 'Kubernetes', 'AWS Athena', 'S3'),
        spriteId: 'johnson-johnson',
      },
      {
        id: 'wps-data-lab',
        creatureName: 'WPS Data Lab',
        organization: 'WPS Data Lab',
        role: 'Data Science Research Assistant',
        category: 'Experience',
        cardMetadata: 'Oct 2024 - Present',
        dates: 'Oct 2024 - Present',
        location: 'Boston, MA',
        highlight:
          'Analyzed 257K EPA violations and 100K+ federal spending records to identify 12 significant worker-safety drivers.',
        professionalType: 'Data Science Research',
        moves: moves('Python', 'PostgreSQL', 'Hierarchical REML'),
        spriteId: 'wps-data-lab',
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    entries: [
      {
        id: 'remetra',
        creatureName: 'Remetra',
        organization: 'Remetra',
        role: 'Autoimmune symptom-tracking application',
        category: 'Project',
        cardMetadata: 'React · Supabase · FastAPI',
        highlight:
          'Shipped a cross-platform iOS and Android symptom-tracking app used by 250 users logging 10K+ entries.',
        professionalType: 'Health Technology',
        moves: moves('React', 'Supabase', 'FastAPI', 'Ollama', 'Neo4j'),
        spriteId: 'remetra',
      },
      {
        id: 'forgetmenot',
        creatureName: 'ForgetMeNot',
        organization: 'ForgetMeNot',
        role: 'AI dementia-care platform',
        category: 'Project',
        cardMetadata: 'FastAPI · Snowflake · Gemini',
        highlight: 'Built an AI dementia-care platform that placed 2nd at HackRU among 300 teams.',
        professionalType: 'AI Application',
        moves: moves('FastAPI', 'Snowflake', 'Gemini', 'Google Cloud', 'React', 'OpenCV'),
        spriteId: 'forget-me-not',
      },
      {
        id: 'breathe-easy',
        creatureName: 'BreatheEasy',
        organization: 'BreatheEasy',
        role: 'Lower-pollution navigation application',
        category: 'Project',
        cardMetadata: 'Flutter · Dart · Google Maps',
        highlight:
          'Placed 1st at CSBase Hacks among 250 teams with a lower-pollution navigation app.',
        professionalType: 'Mobile Engineering',
        moves: moves('Flutter', 'Dart', 'Google Maps API', 'Shelf', 'Docker'),
        spriteId: 'breathe-easy',
      },
    ],
  },
  {
    id: 'interests',
    label: 'Interests',
    entries: [
      { id: 'bhangra', creatureName: 'Bhangra', organization: 'Bhangra', role: 'Captain', category: 'Interest', cardMetadata: 'Dance · Performance', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'bhangra' },
      { id: 'sigma-beta-rho', creatureName: 'Sigma Beta Rho', organization: 'Sigma Beta Rho', role: 'Fundraising & Academic Lead', category: 'Interest', cardMetadata: 'Leadership · Community', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'sigma-beta-rho' },
      { id: 'games-collecting', creatureName: 'Games & Collecting', organization: 'Games & Collecting', role: 'Pokémon · Destiny 2 · League', category: 'Interest', cardMetadata: 'Cards · Games', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'games-collecting' },
      { id: 'hiking', creatureName: 'Hiking', organization: 'Hiking', role: 'Trails & outdoors', category: 'Interest', cardMetadata: 'Explore · Recharge', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'hiking' },
      { id: 'music', creatureName: 'Music', organization: 'Music', role: 'House & R&B', category: 'Interest', cardMetadata: 'Listen · Discover', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'music' },
      { id: 'food-explorer', creatureName: 'Food Explorer', organization: 'Food Explorer', role: 'Restaurants & cuisines', category: 'Interest', cardMetadata: 'Taste · Explore', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'food-explorer' },
    ],
  },
];

export const trainerProfile: TrainerProfile = {
  name: 'Keshav Goel',
  school: 'Northeastern University',
  graduation: 'May 2028',
  major: 'Data Science',
  hometown: 'Boston, MA',
  links: [
    { label: 'Résumé', href: '/resume.pdf' },
    { label: 'GitHub', href: 'https://github.com/keshavgoel787' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/goel-keshav' },
    { label: 'Email', href: 'mailto:kgoel9657@gmail.com' },
  ],
};

export const getRoster = (tab: RosterTab) => rosterTabs.find((roster) => roster.id === tab);

export const getRosterEntry = (tab: RosterTab, entryId: string) =>
  getRoster(tab)?.entries.find((entry) => entry.id === entryId);
