/**
 * reporter.js — formatted terminal output for TODO items
 */

import chalk from 'chalk'

const PRIORITY_COLORS = {
  P1: chalk.red,
  P2: chalk.yellow,
  P3: chalk.cyan,
  P4: chalk.gray
}

const TYPE_COLORS = {
  bug: chalk.red,
  'tech-debt': chalk.yellow,
  optimization: chalk.blue,
  feature: chalk.green,
  question: chalk.magenta,
  note: chalk.gray,
  task: chalk.cyan
}

/**
 * Render a list of TODO items to the terminal.
 */
export function renderReport(items, options = {}) {
  const { verbose = false, blameMode = false } = options

  if (items.length === 0) {
    console.log(chalk.green('\n  No matching items found.\n'))
    return
  }

  console.log('')

  // Sort by priority then file
  const sorted = [...items].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority.localeCompare(b.priority)
    return a.file.localeCompare(b.file)
  })

  for (const item of sorted) {
    const priorityColor = PRIORITY_COLORS[item.priority] || chalk.white
    const typeColor = TYPE_COLORS[item.type] || chalk.white

    console.log(`  ${chalk.white(item.file)}:${chalk.yellow(item.line)}`)
    console.log(`  ${priorityColor('[' + item.priority + ']')} ${typeColor('[' + item.type + ']')} ${chalk.bold(item.keyword)}: ${item.text}`)

    if (item.blame) {
      const parts = [
        `Author: ${item.blame.author}`,
        `${item.blame.ageDays} days ago`
      ]
      if (item.blame.orphaned) {
        parts.push(chalk.red('orphaned'))
      }
      console.log(`  ${chalk.gray(parts.join('  ·  '))}`)
    }

    console.log('')
  }

  // Summary line
  const p1 = sorted.filter(i => i.priority === 'P1').length
  const p2 = sorted.filter(i => i.priority === 'P2').length
  const p3 = sorted.filter(i => i.priority === 'P3').length
  const p4 = sorted.filter(i => i.priority === 'P4').length

  const parts = [`Found ${chalk.bold(sorted.length)} items`]
  if (p1) parts.push(chalk.red(`${p1} P1`))
  if (p2) parts.push(chalk.yellow(`${p2} P2`))
  if (p3) parts.push(chalk.cyan(`${p3} P3`))
  if (p4) parts.push(chalk.gray(`${p4} P4`))

  console.log(`  ${parts.join('  ·  ')}`)
  console.log('')
}
