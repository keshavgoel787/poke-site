import { getRosterEntry, rosterTabs, trainerProfile } from './portfolioData';

const visibleEntries = () => rosterTabs.flatMap((tab) => tab.entries);

it('provides exactly the approved roster tabs and visible entries', () => {
  expect(rosterTabs.map((tab) => tab.id)).toEqual(['experience', 'projects']);
  expect(rosterTabs[0].entries.map((entry) => entry.organization)).toEqual([
    'Amazon',
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
        'Incoming intern scoped to build identity-synchronization and telemetry pipelines across AWS, Azure, and Google Cloud.',
      moves: ['AWS', 'Azure', 'Google Cloud'],
    },
    draftkings: {
      highlight:
        'Built a production LangGraph FinOps agent that eliminated 20+ hours per week of manual cloud-cost analysis.',
      moves: ['LangGraph', 'Kubernetes', 'Terraform', 'DynamoDB', 'Datadog'],
    },
    procuremateai: {
      highlight:
        'Built a computer vision system across 20+ dental offices, eliminating 15+ hours per week of manual work per office.',
      moves: ['Node.js', 'S3', 'Vercel', 'Roboflow', 'Claude API'],
    },
    'johnson-johnson': {
      highlight:
        'Built a GPT-4o and LangChain paper-summarization pipeline that cut literature review from 2 hours to 30 minutes.',
      moves: ['GPT-4o', 'LangChain', 'Neo4j', 'GraphRAG', 'Streamlit', 'FastAPI'],
    },
    'wps-data-lab': {
      highlight:
        'Analyzed 257K EPA violations and 100K+ federal spending records to identify 12 significant worker-safety drivers.',
      moves: ['Python', 'PostgreSQL', 'Hierarchical REML'],
    },
    remetra: {
      highlight:
        'Built a cross-platform autoimmune symptom-tracking app used by 250 users logging 10K+ entries.',
      moves: ['React', 'Supabase', 'FastAPI', 'Ollama', 'Neo4j'],
    },
    forgetmenot: {
      highlight: 'Placed 2nd at HackRU among 300 teams with an AI dementia-care platform.',
      moves: ['FastAPI', 'Gemini', 'ElevenLabs', 'OpenCV', 'Next.js', 'Snowflake'],
    },
    'breathe-easy': {
      highlight: 'Placed 1st at CSBase Hacks among 250 teams with a lower-pollution navigation app.',
      moves: ['Flutter', 'Dart', 'Google Maps API', 'Shelf', 'Docker'],
    },
  } as const;

  expect(Object.keys(expectedContent)).toHaveLength(visibleEntries().length);

  for (const entry of visibleEntries()) {
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
