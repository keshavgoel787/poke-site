import { getRoster, getRosterEntry, rosterTabs, trainerProfile } from './portfolioData';

const visibleEntries = () => rosterTabs.flatMap((tab) => tab.entries);
const professionalEntries = () => rosterTabs.slice(0, 2).flatMap((tab) => tab.entries);

it('provides exactly the approved roster tabs and visible entries', () => {
  expect(rosterTabs.map((tab) => tab.id)).toEqual(['experience', 'projects', 'interests']);
  expect(rosterTabs[0].entries.map((entry) => entry.organization)).toEqual([
    'Amazon Web Services (AWS)',
    'DraftKings',
    'ProcureMate AI',
    'Johnson & Johnson',
    'WPS Data Lab',
  ]);
  expect(rosterTabs[1].entries.map((entry) => entry.organization)).toEqual([
    'Remetra',
    'ForgetMeNot',
    'BreatheEasy',
  ]);
  expect(visibleEntries().map((entry) => entry.creatureName)).toEqual([
    'AWS',
    'DraftKings',
    'ProcureMate AI',
    'Johnson & Johnson',
    'WPS Data Lab',
    'Remetra',
    'ForgetMeNot',
    'BreatheEasy',
    'Bhangra',
    'Sigma Beta Rho',
    'Games & Collecting',
    'Hiking',
    'Music',
    'Food Explorer',
  ]);
});

it('provides the exact Interests roster content', () => {
  const interests = rosterTabs[2].entries;

  expect(interests.map(({ creatureName, role, cardMetadata, category, spriteId }) => ({
    creatureName,
    role,
    cardMetadata,
    category,
    spriteId,
  }))).toEqual([
    { creatureName: 'Bhangra', role: 'Captain', cardMetadata: 'Dance · Performance', category: 'Interest', spriteId: 'bhangra' },
    { creatureName: 'Sigma Beta Rho', role: 'Fundraising & Academic Lead', cardMetadata: 'Leadership · Community', category: 'Interest', spriteId: 'sigma-beta-rho' },
    { creatureName: 'Games & Collecting', role: 'Pokémon · Destiny 2 · League', cardMetadata: 'Cards · Games', category: 'Interest', spriteId: 'games-collecting' },
    { creatureName: 'Hiking', role: 'Trails & outdoors', cardMetadata: 'Explore · Recharge', category: 'Interest', spriteId: 'hiking' },
    { creatureName: 'Music', role: 'House & R&B', cardMetadata: 'Listen · Discover', category: 'Interest', spriteId: 'music' },
    { creatureName: 'Food Explorer', role: 'Restaurants & cuisines', cardMetadata: 'Taste · Explore', category: 'Interest', spriteId: 'food-explorer' },
  ]);
  expect(getRoster('interests')).toBe(rosterTabs[2]);
});

it('removes stale experience entries from the visible roster', () => {
  const organizations = visibleEntries().map((entry) => entry.organization);

  expect(organizations).not.toContain('Generate');
  expect(organizations).not.toContain('VDart');
});

it('provides the exact trainer card profile fields', () => {
  expect(trainerProfile).toMatchObject({
    name: 'Keshav Goel',
    school: 'Northeastern University',
    graduation: 'May 2028',
    major: 'Data Science',
    hometown: 'Boston, MA',
  });
});

it('uses one source-verified highlight and one or more source-verified moves per entry', () => {
  const expectedContent = {
    amazon: {
      highlight:
        'Designing an agentic AI advisor that reduces cloud-access review cycles from 4 weeks to 2 hours.',
      moves: ['Amazon Bedrock AgentCore', 'Strands', 'RAG', 'Bedrock Guardrails', 'Entra / Google OAuth'],
    },
    draftkings: {
      highlight:
        'Built a LangGraph agent querying Snowflake across 3 verticals, cutting cloud-cost analysis by 20 hours per week.',
      moves: ['LangGraph', 'Snowflake', 'Kubernetes', 'Terraform', 'Datadog'],
    },
    procuremateai: {
      highlight:
        'Built a computer vision system across 20+ dental offices, eliminating 15+ hours per week of manual work per office.',
      moves: ['Node.js', 'S3', 'Vercel', 'Roboflow', 'Claude API'],
    },
    'johnson-johnson': {
      highlight:
        'Built Node.js Slack microservices delivering trial data on demand, eliminating 15 hours per week of manual exports.',
      moves: ['Node.js', 'Microsoft Graph', 'SharePoint', 'Kubernetes', 'AWS Athena', 'S3'],
    },
    'wps-data-lab': {
      highlight:
        'Analyzed 257K EPA violations and 100K+ federal spending records to identify 12 significant worker-safety drivers.',
      moves: ['Python', 'PostgreSQL', 'Hierarchical REML'],
    },
    remetra: {
      highlight:
        'Shipped a cross-platform iOS and Android symptom-tracking app used by 250 users logging 10K+ entries.',
      moves: ['React', 'Supabase', 'FastAPI', 'Ollama', 'Neo4j'],
    },
    forgetmenot: {
      highlight: 'Built an AI dementia-care platform that placed 2nd at HackRU among 300 teams.',
      moves: ['FastAPI', 'Snowflake', 'Gemini', 'Google Cloud', 'React', 'OpenCV'],
    },
    'breathe-easy': {
      highlight: 'Placed 1st at CSBase Hacks among 250 teams with a lower-pollution navigation app.',
      moves: ['Flutter', 'Dart', 'Google Maps API', 'Shelf', 'Docker'],
    },
  } as const;

  expect(Object.keys(expectedContent)).toHaveLength(professionalEntries().length);

  for (const entry of professionalEntries()) {
    expect(entry.highlight).toBe(expectedContent[entry.id as keyof typeof expectedContent].highlight);
    expect(entry.moves.map((move) => move.skill)).toEqual(
      expectedContent[entry.id as keyof typeof expectedContent].moves,
    );
  }
});

it('provides dates and location for every experience entry', () => {
  const experienceEntries = rosterTabs[0].entries;

  expect(experienceEntries.every((entry) => entry.dates?.trim())).toBe(true);
  expect(experienceEntries.every((entry) => entry.location?.trim())).toBe(true);
  expect(experienceEntries.map(({ role, dates, location }) => ({ role, dates, location }))).toEqual([
    {
      role: 'Software Development Engineer Intern',
      dates: 'Aug 2026 - Present',
      location: 'Seattle, WA',
    },
    {
      role: 'Software Engineering Intern',
      dates: 'Jun 2026 - Aug 2026',
      location: 'Boston, MA',
    },
    {
      role: 'Software Engineering Intern',
      dates: 'Jan 2026 - May 2026',
      location: 'Boston, MA',
    },
    {
      role: 'Software Engineering Co-op',
      dates: 'Jun 2025 - Dec 2025',
      location: 'Raritan, NJ',
    },
    {
      role: 'Data Science Research Assistant',
      dates: 'Oct 2024 - Present',
      location: 'Boston, MA',
    },
  ]);
});

it('provides concise roster-card metadata for every entry', () => {
  const experienceEntries = rosterTabs[0].entries;
  const projectEntries = rosterTabs[1].entries;

  expect(experienceEntries.map((entry) => entry.cardMetadata)).toEqual(
    experienceEntries.map((entry) => entry.dates),
  );
  expect(projectEntries.map((entry) => entry.cardMetadata)).toEqual([
    'React · Supabase · FastAPI',
    'FastAPI · Snowflake · Gemini',
    'Flutter · Dart · Google Maps',
  ]);
});

it('finds a roster entry by tab and id', () => {
  expect(getRosterEntry('projects', 'forgetmenot')?.organization).toBe('ForgetMeNot');
});

it('provides verified professional links for the trainer profile', () => {
  const links = Object.fromEntries(trainerProfile.links.map((link) => [link.label, link.href]));

  expect(links['Résumé']).toBe('/resume.pdf');
  expect(links.GitHub).toBe('https://github.com/keshavgoel787');
  expect(links.LinkedIn).toBe('https://www.linkedin.com/in/goel-keshav');
  expect(links.Email).toBe('mailto:kgoel9657@gmail.com');
});
