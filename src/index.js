import { Command } from 'commander'
import chalk from 'chalk'
import { scanDirectory } from './scanner.js'
import { categorize } from './categorizer.js'
import { enrichWithBlame } from './blame.js'
import { renderStats } from './stats.js'
import { renderReport } from './reporter.js'

export function createProgram() {
  const program = new Command()

  program
    .name('todo-hunter')
    .description('Find and resolve all TODOs with AI')
    .version('1.0.0')

  program
    .command('scan [dir]')
    .description('Scan a directory for TODO, FIXME, HACK, XXX, OPTIMIZE, NOTE comments')
    .option('-e, --ext <extensions>', 'comma-separated file extensions to scan', 'js,ts,jsx,tsx,py,go,rb,java,php,cs,cpp,c,rs,swift,kt')
    .option('--no-blame', 'skip git blame (faster)')
    .option('-o, --output <format>', 'output format: table|json|csv', 'table')
    .action(async (dir = '.', opts) => {
      const targetDir = dir
      process.stdout.write(chalk.hex('#EC4899')('Scanning') + ' ' + chalk.bold(targetDir) + '...\n')

      try {
        const extensions = opts.ext.split(',').map(e => e.trim())
        const rawItems = await scanDirectory(targetDir, extensions)

        if (rawItems.length === 0) {
          process.stdout.write(chalk.green('No TODOs found. Clean codebase!\n'))
          return
        }

        const categorized = rawItems.map(categorize)
        const withBlame = opts.blame
          ? await enrichWithBlame(categorized)
          : categorized

        if (opts.output === 'json') {
          process.stdout.write(JSON.stringify(withBlame, null, 2) + '\n')
          return
        }

        if (opts.output === 'csv') {
          outputCsv(withBlame)
          return
        }

        renderReport(withBlame)
      } catch (err) {
        process.stderr.write(chalk.red('Error: ') + err.message + '\n')
        process.exit(1)
      }
    })

  program
    .command('stats [dir]')
    .description('Show statistics dashboard for TODOs in a directory')
    .option('-e, --ext <extensions>', 'file extensions to scan', 'js,ts,jsx,tsx,py,go,rb,java,php,cs,cpp,c,rs,swift,kt')
    .action(async (dir = '.', opts) => {
      try {
        const extensions = opts.ext.split(',').map(e => e.trim())
        const rawItems = await scanDirectory(dir, extensions)
        const categorized = rawItems.map(categorize)
        const withBlame = await enrichWithBlame(categorized)
        renderStats(withBlame, dir)
      } catch (err) {
        process.stderr.write(chalk.red('Error: ') + err.message + '\n')
        process.exit(1)
      }
    })

  program
    .command('report [dir]')
    .description('Generate a detailed prioritized report')
    .option('-e, --ext <extensions>', 'file extensions to scan', 'js,ts,jsx,tsx,py,go,rb,java,php,cs,cpp,c,rs,swift,kt')
    .option('-p, --priority <level>', 'filter by priority: P1|P2|P3|P4')
    .option('-t, --type <type>', 'filter by type: bug|tech-debt|feature|optimization|question')
    .action(async (dir = '.', opts) => {
      try {
        const extensions = opts.ext.split(',').map(e => e.trim())
        const rawItems = await scanDirectory(dir, extensions)
        let categorized = rawItems.map(categorize)
        const withBlame = await enrichWithBlame(categorized)

        let filtered = withBlame
        if (opts.priority) {
          filtered = filtered.filter(i => i.priority === opts.priority.toUpperCase())
        }
        if (opts.type) {
          filtered = filtered.filter(i => i.type === opts.type.toLowerCase())
        }

        renderReport(filtered, { verbose: true })
      } catch (err) {
        process.stderr.write(chalk.red('Error: ') + err.message + '\n')
        process.exit(1)
      }
    })

  program
    .command('blame [dir]')
    .description('Show who owns each TODO and how old it is')
    .option('-e, --ext <extensions>', 'file extensions to scan', 'js,ts,jsx,tsx,py,go,rb,java,php,cs,cpp,c,rs,swift,kt')
    .option('--ancient', 'show only TODOs older than 90 days')
    .option('--orphaned', 'show only TODOs from authors no longer active')
    .action(async (dir = '.', opts) => {
      try {
        const extensions = opts.ext.split(',').map(e => e.trim())
        const rawItems = await scanDirectory(dir, extensions)
        const categorized = rawItems.map(categorize)
        const withBlame = await enrichWithBlame(categorized)

        let filtered = withBlame
        if (opts.ancient) {
          filtered = filtered.filter(i => i.blame && i.blame.ageDays > 90)
        }
        if (opts.orphaned) {
          filtered = filtered.filter(i => i.blame && i.blame.orphaned)
        }

        renderReport(filtered, { blameMode: true })
      } catch (err) {
        process.stderr.write(chalk.red('Error: ') + err.message + '\n')
        process.exit(1)
      }
    })

  return program
}

function outputCsv(items) {
  const header = 'file,line,type,priority,keyword,text,author,ageDays'
  process.stdout.write(header + '\n')
  for (const item of items) {
    const row = [
      item.file,
      item.line,
      item.type,
      item.priority,
      item.keyword,
      `"${(item.text || '').replace(/"/g, '""')}"`,
      item.blame?.author || '',
      item.blame?.ageDays || ''
    ].join(',')
    process.stdout.write(row + '\n')
  }
}
