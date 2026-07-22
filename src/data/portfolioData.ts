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
        types: ['Steel', 'Electric'],
        moves: [
          { name: 'Build', skill: 'Software engineering' },
          { name: 'Automate', skill: 'Automation' },
          { name: 'Analyze', skill: 'Data' },
          { name: 'Learn', skill: 'AI' },
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
        types: ['Steel', 'Fire'],
        moves: [
          { name: 'Build', skill: 'Software engineering' },
          { name: 'Automate', skill: 'Automation' },
          { name: 'Analyze', skill: 'Data' },
          { name: 'Learn', skill: 'AI' },
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
        types: ['Steel', 'Psychic'],
        moves: [
          { name: 'Build', skill: 'Software engineering' },
          { name: 'Automate', skill: 'Automation' },
          { name: 'Analyze', skill: 'Data' },
          { name: 'Learn', skill: 'AI' },
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
        types: ['Psychic', 'Electric'],
        moves: [
          { name: 'Analyze', skill: 'Data' },
          { name: 'Model', skill: 'Machine learning' },
          { name: 'Automate', skill: 'Automation' },
          { name: 'Learn', skill: 'AI' },
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
        types: ['Steel', 'Normal'],
        moves: [
          { name: 'Build', skill: 'Software engineering' },
          { name: 'Automate', skill: 'Automation' },
          { name: 'Analyze', skill: 'Data' },
          { name: 'Learn', skill: 'AI' },
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
        types: ['Steel', 'Flying'],
        moves: [
          { name: 'Build', skill: 'Software engineering' },
          { name: 'Automate', skill: 'Automation' },
          { name: 'Analyze', skill: 'Data' },
          { name: 'Learn', skill: 'AI' },
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
        types: ['Flying', 'Grass'],
        moves: [
          { name: 'Route Scan', skill: 'Pollution-aware navigation' },
          { name: 'Pathfind', skill: 'Smart navigation' },
          { name: 'Analyze', skill: 'Data' },
          { name: 'Build', skill: 'Software engineering' },
        ],
        spriteId: 'breathe-easy',
      },
      {
        id: 'forget-me-not',
        creatureName: 'Memorai',
        organization: 'ForgetMeNot',
        role: 'AI memory trainer for dementia',
        dates: 'Project',
        impact: '2nd of 500 at HackRU.',
        types: ['Psychic', 'Fairy'],
        moves: [
          { name: 'Recall', skill: 'Memory training' },
          { name: 'Assist', skill: 'Dementia support' },
          { name: 'Learn', skill: 'AI' },
          { name: 'Build', skill: 'Software engineering' },
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
        types: ['Psychic'],
        moves: [
          { name: 'Analyze', skill: 'Data science' },
          { name: 'Calculate', skill: 'Mathematics' },
          { name: 'Model', skill: 'Machine learning' },
          { name: 'Learn', skill: 'AI' },
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
        types: ['Fighting', 'Fairy'],
        moves: [
          { name: 'Rhythm', skill: 'Bhangra' },
          { name: 'Dance', skill: 'Bhangra' },
          { name: 'Perform', skill: 'Bhangra' },
          { name: 'Move', skill: 'Bhangra' },
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
        types: ['Ground', 'Flying'],
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
        types: ['Steel', 'Psychic'],
        moves: [
          { name: 'Analyze', skill: 'Data' },
          { name: 'Model', skill: 'Machine learning' },
          { name: 'Learn', skill: 'AI' },
          { name: 'Automate', skill: 'Manual tasks' },
        ],
        spriteId: 'interests',
      },
    ],
  },
];

export const getBox = (boxId: BoxId) => careerBoxes.find((box) => box.id === boxId);

export const getEntry = (boxId: BoxId, entryId: string) =>
  getBox(boxId)?.entries.find((entry) => entry.id === entryId);
