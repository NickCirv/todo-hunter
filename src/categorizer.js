const TYPE_RULES = [
  {
    type: 'bug',
    priority: 'P1',
    keywords: ['FIXME', 'BUG'],
    patterns: []
  },
  {
    type: 'tech-debt',
    priority: 'P2',
    keywords: ['HACK', 'XXX', 'REFACTOR'],
    patterns: []
  },
  {
    type: 'optimization',
    priority: 'P2',
    keywords: ['OPTIMIZE', 'PERF'],
    patterns: []
  },
  {
    type: 'question',
    priority: 'P3',
    keywords: ['TODO'],
    patterns: [/\?/]
  },
  {
    type: 'feature',
    priority: 'P3',
    keywords: ['TODO'],
    patterns: [
      /\badd\b/i, /\bimplement\b/i, /\bcreate\b/i, /\bbuild\b/i,
      /\bsupport\b/i, /\ballow\b/i, /\benable\b/i, /\bintegrate\b/i
    ]
  },
  {
    type: 'note',
    priority: 'P4',
    keywords: ['NOTE'],
    patterns: []
  }
]

const PRIORITY_MAP = {
  FIXME: 'P1',
  BUG: 'P1',
  HACK: 'P2',
  XXX: 'P2',
  REFACTOR: 'P2',
  OPTIMIZE: 'P2',
  PERF: 'P2',
  TODO: 'P3',
  NOTE: 'P4'
}

export function categorize(item) {
  const priority = PRIORITY_MAP[item.keyword] || 'P3'
  const type = inferType(item.keyword, item.text)

  return {
    ...item,
    type,
    priority
  }
}

function inferType(keyword, text) {
  for (const rule of TYPE_RULES) {
    if (!rule.keywords.includes(keyword)) continue

    if (rule.patterns.length === 0) {
      return rule.type
    }

    for (const pattern of rule.patterns) {
      if (pattern.test(text)) return rule.type
    }
  }

  if (keyword === 'TODO') return 'task'
  if (keyword === 'NOTE') return 'note'
  if (keyword === 'HACK' || keyword === 'XXX') return 'tech-debt'
  if (keyword === 'OPTIMIZE' || keyword === 'PERF') return 'optimization'
  return 'bug'
}
