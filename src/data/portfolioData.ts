export type RosterTab = 'experience' | 'projects';

export type ProfessionalMove = { name: string; skill: string };

export type CareerEntry = {
  id: string;
  creatureName: string;
  organization: string;
  role: string;
  category: 'Experience' | 'Project';
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
        creatureName: 'Amazon',
        organization: 'Amazon',
        role: 'Incoming Software Engineering Intern',
        category: 'Experience',
        dates: 'Aug 2026 - Dec 2026',
        location: 'Seattle, WA',
        highlight:
          'Incoming intern scoped to build identity-synchronization and telemetry pipelines across AWS, Azure, and Google Cloud.',
        professionalType: 'Cloud Engineering',
        moves: moves('AWS', 'Azure', 'Google Cloud'),
        spriteId: 'amazon',
      },
      {
        id: 'draftkings',
        creatureName: 'DraftKings',
        organization: 'DraftKings',
        role: 'Software Engineering Intern',
        category: 'Experience',
        dates: 'Jun 2026 - Present',
        location: 'Boston, MA',
        highlight:
          'Built a production LangGraph FinOps agent that eliminated 20+ hours per week of manual cloud-cost analysis.',
        professionalType: 'Software Engineering',
        moves: moves('LangGraph', 'Kubernetes', 'Terraform', 'DynamoDB', 'Datadog'),
        spriteId: 'draftkings',
      },
      {
        id: 'procuremateai',
        creatureName: 'ProcureMate AI',
        organization: 'ProcureMate AI',
        role: 'Software Development Engineering Intern',
        category: 'Experience',
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
        dates: 'Jun 2025 - Dec 2025',
        location: 'Raritan, NJ',
        highlight:
          'Built a GPT-4o and LangChain paper-summarization pipeline that cut literature review from 2 hours to 30 minutes.',
        professionalType: 'AI/ML Engineering',
        moves: moves('GPT-4o', 'LangChain', 'Neo4j', 'GraphRAG', 'Streamlit', 'FastAPI'),
        spriteId: 'johnson-johnson',
      },
      {
        id: 'wps-data-lab',
        creatureName: 'WPS Data Lab',
        organization: 'WPS Data Lab',
        role: 'Data Science Research Assistant',
        category: 'Experience',
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
        highlight:
          'Built a cross-platform autoimmune symptom-tracking app used by 250 users logging 10K+ entries.',
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
        highlight: 'Placed 2nd at HackRU among 300 teams with an AI dementia-care platform.',
        professionalType: 'AI Application',
        moves: moves('FastAPI', 'Gemini', 'ElevenLabs', 'OpenCV', 'Next.js', 'Snowflake'),
        spriteId: 'forget-me-not',
      },
      {
        id: 'breathe-easy',
        creatureName: 'BreatheEasy',
        organization: 'BreatheEasy',
        role: 'Lower-pollution navigation application',
        category: 'Project',
        highlight:
          'Placed 1st at CSBase Hacks among 250 teams with a lower-pollution navigation app.',
        professionalType: 'Mobile Engineering',
        moves: moves('Flutter', 'Dart', 'Google Maps API', 'Shelf', 'Docker'),
        spriteId: 'breathe-easy',
      },
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
