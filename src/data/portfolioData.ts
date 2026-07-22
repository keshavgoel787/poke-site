export type BoxId = 'experience' | 'projects' | 'trainer';

export type Move = { name: string; skill: string };

export type CareerEntry = {
  id: string;
  creatureName: string;
  organization: string;
  role: string;
  dates: string;
  impact: string;
  types: [string] | [string, string];
  moves: [Move, Move, Move, Move];
  spriteId: string;
  link?: { label: string; href: string };
};

export type CareerBox = {
  id: BoxId;
  label: string;
  entries: CareerEntry[];
};

export type ProfessionalLink = { label: string; href: string };

export interface TrainerProfile {
  name: string;
  positioning: string;
  education: string;
  highlights: Array<Pick<CareerEntry, 'organization' | 'role' | 'dates'>>;
  personal: string;
  locations: string[];
  links: ProfessionalLink[];
}

export const careerBoxes: CareerBox[] = [
  {
    id: 'experience',
    label: 'Experience',
    entries: [
      {
        id: 'amazon',
        creatureName: 'Amazoar',
        organization: 'Amazon',
        role: 'Incoming Software Engineering Intern',
        dates: 'Incoming',
        impact: 'Incoming software engineering internship.',
        types: ['Software Engineering'],
        moves: [
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
        ],
        spriteId: 'amazon',
      },
      {
        id: 'draftkings',
        creatureName: 'Draftion',
        organization: 'DraftKings',
        role: 'Incoming Software Engineering Intern',
        dates: 'Incoming',
        impact: 'Incoming software engineering internship.',
        types: ['Software Engineering'],
        moves: [
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
        ],
        spriteId: 'draftkings',
      },
      {
        id: 'procuremateai',
        creatureName: 'Procura',
        organization: 'ProcureMateAI',
        role: 'Software Engineering Intern',
        dates: 'Current',
        impact: 'Current software engineering internship.',
        types: ['Software Engineering'],
        moves: [
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
        ],
        spriteId: 'procuremateai',
      },
      {
        id: 'generate',
        creatureName: 'Generex',
        organization: 'Generate',
        role: 'Data Scientist',
        dates: 'Previous',
        impact: 'Previous data scientist role.',
        types: ['Data Science'],
        moves: [
          { name: 'Data Science', skill: 'Data Science' },
          { name: 'Data Science', skill: 'Data Science' },
          { name: 'Data Science', skill: 'Data Science' },
          { name: 'Data Science', skill: 'Data Science' },
        ],
        spriteId: 'generate',
      },
      {
        id: 'johnson-johnson',
        creatureName: 'JandJay',
        organization: 'Johnson & Johnson',
        role: 'Software Engineering Co-op',
        dates: 'Previous',
        impact: 'Previous software engineering co-op.',
        types: ['Software Engineering'],
        moves: [
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
        ],
        spriteId: 'johnson-johnson',
      },
      {
        id: 'vdart',
        creatureName: 'Dartbyte',
        organization: 'VDart',
        role: 'Software Engineering Intern',
        dates: 'Previous',
        impact: 'Previous software engineering internship.',
        types: ['Software Engineering'],
        moves: [
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
          { name: 'Software Engineering', skill: 'Software Engineering' },
        ],
        spriteId: 'vdart',
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    entries: [
      {
        id: 'breathe-easy',
        creatureName: 'AeroRoute',
        organization: 'Breathe Easy',
        role: 'Pollution-aware smart navigation project',
        dates: 'Project',
        impact: '1st of 400 at CSBase Hacks.',
        types: ['Navigation'],
        moves: [
          { name: 'Pollution Awareness', skill: 'Pollution-aware navigation' },
          { name: 'Smart Navigation', skill: 'Smart navigation' },
          { name: 'Route Planning', skill: 'Smart navigation' },
          { name: 'Pollution-Aware Routes', skill: 'Pollution-aware navigation' },
        ],
        spriteId: 'breathe-easy',
      },
      {
        id: 'forgetmenot',
        creatureName: 'Memorai',
        organization: 'ForgetMeNot',
        role: 'AI memory trainer for dementia',
        dates: 'Project',
        impact: '2nd of 500 at HackRU.',
        types: ['AI', 'Memory Training'],
        moves: [
          { name: 'AI Memory Training', skill: 'AI memory training' },
          { name: 'Memory Training', skill: 'Memory training' },
          { name: 'Dementia Focus', skill: 'Dementia' },
          { name: 'AI', skill: 'AI' },
        ],
        spriteId: 'forget-me-not',
      },
    ],
  },
  {
    id: 'trainer',
    label: 'Trainer',
    entries: [
      {
        id: 'northeastern-university',
        creatureName: 'Northeaster',
        organization: 'Northeastern University',
        role: 'Data Science student',
        dates: 'Current',
        impact: 'Studies data science with a math minor.',
        types: ['Data Science', 'Mathematics'],
        moves: [
          { name: 'Data Science', skill: 'Data Science' },
          { name: 'Math Minor', skill: 'Math minor' },
          { name: 'Data Science', skill: 'Data Science' },
          { name: 'Math Minor', skill: 'Math minor' },
        ],
        spriteId: 'northeastern-university',
      },
      {
        id: 'bhangra',
        creatureName: 'BhangraBeat',
        organization: 'Bhangra',
        role: 'Dancer',
        dates: 'Personal',
        impact: 'Bhangra dancer.',
        types: ['Bhangra'],
        moves: [
          { name: 'Bhangra', skill: 'Bhangra' },
          { name: 'Dancer', skill: 'Bhangra dancer' },
          { name: 'Bhangra', skill: 'Bhangra' },
          { name: 'Dancer', skill: 'Bhangra dancer' },
        ],
        spriteId: 'bhangra',
      },
      {
        id: 'locations',
        creatureName: 'MetroMap',
        organization: 'NJ / NY / Boston',
        role: 'Locations',
        dates: 'Personal',
        impact: 'NJ, NY, and Boston.',
        types: ['Locations'],
        moves: [
          { name: 'Route', skill: 'NJ' },
          { name: 'Route', skill: 'NY' },
          { name: 'Route', skill: 'Boston' },
          { name: 'Explore', skill: 'Locations' },
        ],
        spriteId: 'locations',
      },
      {
        id: 'interests',
        creatureName: 'AutoMind',
        organization: 'Data, ML, and AI',
        role: 'Automation focus',
        dates: 'Personal',
        impact: 'Focused on automating manual tasks with data, ML, and AI.',
        types: ['Data', 'Machine Learning'],
        moves: [
          { name: 'Data', skill: 'Data' },
          { name: 'ML', skill: 'ML' },
          { name: 'AI', skill: 'AI' },
          { name: 'Automate', skill: 'Automating manual tasks' },
        ],
        spriteId: 'interests',
      },
    ],
  },
];

export const trainerProfile: TrainerProfile = {
  name: 'Keshav Goel',
  positioning:
    'Software engineering and data science student focused on automating manual tasks with data, ML, and AI.',
  education: 'Northeastern University — Data Science, math minor',
  highlights: [
    {
      organization: 'Amazon',
      role: 'Incoming Software Engineering Intern',
      dates: 'Incoming',
    },
    {
      organization: 'DraftKings',
      role: 'Incoming Software Engineering Intern',
      dates: 'Incoming',
    },
    {
      organization: 'ProcureMateAI',
      role: 'Software Engineering Intern',
      dates: 'Current',
    },
  ],
  personal: 'Bhangra dancer',
  locations: ['NJ', 'NY', 'Boston'],
  links: [
    { label: 'Résumé', href: '/resume.pdf' },
    { label: 'GitHub', href: 'https://github.com/keshavgoel787' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/goel-keshav' },
    { label: 'Email', href: 'mailto:kgoel9657@gmail.com' },
  ],
};

export const getBox = (boxId: BoxId) => careerBoxes.find((box) => box.id === boxId);

export const getEntry = (boxId: BoxId, entryId: string) =>
  getBox(boxId)?.entries.find((entry) => entry.id === entryId);
