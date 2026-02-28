/**
 * stats.js — statistics dashboard for TODOs
 */

import chalk from 'chalk'

/**
 * Render a statistics dashboard.
 */
export function renderStats(items, dir) {
  console.log('')
  console.log(chalk.bold.white('  todo-hunter') + chalk.gray('  — stats dashboard'))
  console.log(chalk.gray('  ─────────────────────────────────────────────'))
  console.log('')

  console.log(chalk.bold(`  ${items.length} items found in ${dir}`))
  console.log('')

  // Priority breakdown
  const byPriority = { P1: 0, P2: 0, P3: 0, P4: 0 }
  for (const item of items) {
    byPriority[item.priority] = (byPriority[item.priority] || 0) + 1
  }

  console.log(chalk.bold('  By Priority'))
  console.log(`  ${chalk.red('P1 (Critical):')} ${byPriority.P1}`)
  console.log(`  ${chalk.yellow('P2 (High):')}     ${byPriority.P2}`)
  console.log(`  ${chalk.cyan('P3 (Medium):')}   ${byPriority.P3}`)
  console.log(`  ${chalk.gray('P4 (Low):')}      ${byPriority.P4}`)
  console.log('')

  // Category breakdown
  const byType = {}
  for (const item of items) {
    byType[item.type] = (byType[item.type] || 0) + 1
  }

  console.log(chalk.bold('  By Category'))
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    const pct = Math.round((count / items.length) * 100)
    const barLen = Math.round((count / items.length) * 20)
    console.log(`  ${type.padEnd(15)} ${chalk.magenta('█'.repeat(barLen))}${chalk.gray('░'.repeat(20 - barLen))} ${count} (${pct}%)`)
  }
  console.log('')

  // Blame stats
  const withBlame = items.filter(i => i.blame)
  if (withBlame.length > 0) {
    const orphaned = withBlame.filter(i => i.blame.orphaned).length
    const ancient = withBlame.filter(i => i.blame.ageDays > 90).length
    const avgAge = Math.round(withBlame.reduce((s, i) => s + i.blame.ageDays, 0) / withBlame.length)

    console.log(chalk.bold('  Blame Summary'))
    console.log(`  ${chalk.gray('Average age:')}  ${avgAge} days`)
    console.log(`  ${chalk.yellow('Ancient (>90d):')} ${ancient}`)
    console.log(`  ${chalk.red('Orphaned:')}     ${orphaned}`)
    console.log('')

    // Top authors
    const byAuthor = {}
    for (const item of withBlame) {
      const author = item.blame.author
      byAuthor[author] = (byAuthor[author] || 0) + 1
    }

    const topAuthors = Object.entries(byAuthor).sort((a, b) => b[1] - a[1]).slice(0, 5)
    if (topAuthors.length > 0) {
      console.log(chalk.bold('  Top Authors'))
      for (const [author, count] of topAuthors) {
        console.log(`  ${author.padEnd(35)} ${count} items`)
      }
      console.log('')
    }
  }
}
