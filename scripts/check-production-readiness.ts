import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'docs/launch/COMMERCIAL_READINESS.md',
  'docs/operations/SCALE_RUNBOOK.md',
  'infra/deployment/kubernetes/api.yaml',
  'infra/deployment/kubernetes/workers.yaml',
  'infra/database/migrations/0005_idempotency.sql',
  'infra/database/migrations/0006_ledger.sql',
  'infra/database/migrations/0008_outbox.sql',
];

const requiredPhrases: Readonly<Record<string, readonly string[]>> = {
  'docs/launch/COMMERCIAL_READINESS.md': [
    'Non-negotiable launch gates',
    'Definition of done for public launch',
    'Do not store provider credentials',
  ],
  'docs/operations/SCALE_RUNBOOK.md': [
    '1,000,000+ concurrent users',
    'Back-pressure',
    'Rollback procedure',
  ],
  'infra/deployment/kubernetes/api.yaml': [
    'HorizontalPodAutoscaler',
    'maxReplicas: 250',
    'readinessProbe',
    'PodDisruptionBudget',
  ],
  'infra/deployment/kubernetes/workers.yaml': [
    'HorizontalPodAutoscaler',
    'maxReplicas: 400',
    'readinessProbe',
    'PodDisruptionBudget',
  ],
};

const failures: string[] = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`Missing required file: ${file}`);
}

for (const [file, phrases] of Object.entries(requiredPhrases)) {
  if (!existsSync(file)) continue;
  const content = readFileSync(file, 'utf8');
  for (const phrase of phrases) {
    if (!content.includes(phrase)) failures.push(`${file} must include: ${phrase}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Production readiness guardrails are present.');
