/**
 * blame.js — git blame integration for TODOs
 * Enriches items with author, age, and orphaned status.
 */

import { execFile as nodeExecFile } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execFileAsync = promisify(nodeExecFile)

/**
 * Get git blame info for a specific file:line.
 */
async function blameItem(item) {
  try {
    const dir = path.dirname(item.absolutePath)
    const { stdout } = await execFileAsync('git', [
      'blame', '-L', `${item.line},${item.line}`,
      '--porcelain', item.absolutePath
    ], { cwd: dir, timeout: 5000 })

    const authorMatch = stdout.match(/^author-mail <(.+)>/m)
    const timeMatch = stdout.match(/^author-time (\d+)/m)

    const author = authorMatch ? authorMatch[1] : 'unknown'
    const timestamp = timeMatch ? parseInt(timeMatch[1], 10) * 1000 : Date.now()
    const ageDays = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24))

    return { author, ageDays, timestamp }
  } catch {
    return null
  }
}

/**
 * Get set of recent contributors (committed in last 90 days).
 */
async function getActiveAuthors(dir) {
  try {
    const { stdout } = await execFileAsync('git', [
      'log', '--since=90 days ago', '--format=%ae'
    ], { cwd: dir, timeout: 10000 })

    return new Set(stdout.trim().split('\n').filter(Boolean))
  } catch {
    return new Set()
  }
}

/**
 * Enrich items with git blame data.
 */
export async function enrichWithBlame(items) {
  if (items.length === 0) return items

  // Get active authors for orphan detection
  const firstDir = path.dirname(items[0].absolutePath)
  const activeAuthors = await getActiveAuthors(firstDir)

  // Blame in batches of 10 for performance
  const results = []
  const batchSize = 10

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const blameResults = await Promise.all(batch.map(blameItem))

    for (let j = 0; j < batch.length; j++) {
      const blame = blameResults[j]
      results.push({
        ...batch[j],
        blame: blame ? {
          ...blame,
          orphaned: blame.author !== 'unknown' && !activeAuthors.has(blame.author)
        } : null
      })
    }
  }

  return results
}
