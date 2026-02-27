import { readdir, readFile } from 'fs/promises'
import { join, extname, relative } from 'path'

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.svn', 'dist', 'build', 'out', '.next',
  '.nuxt', 'coverage', '.nyc_output', 'vendor', '__pycache__',
  '.venv', 'venv', '.DS_Store', '.cache', 'tmp', 'temp'
])

const KEYWORD_PATTERN = /(?:\/\/|#|\/\*|<!--)\s*(TODO|FIXME|HACK|XXX|OPTIMIZE|NOTE|BUG|REFACTOR|PERF)[\s:!]*(.*?)(?:\*\/|-->|$)/gi

export async function scanDirectory(dir, extensions) {
  const extSet = new Set(extensions.map(e => (e.startsWith('.') ? e : `.${e}`)))
  const results = []

  await walk(dir, dir, extSet, results)
  return results
}

async function walk(rootDir, currentDir, extSet, results) {
  let entries
  try {
    entries = await readdir(currentDir, { withFileTypes: true })
  } catch {
    return
  }

  const tasks = []
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue

    const fullPath = join(currentDir, entry.name)

    if (entry.isDirectory()) {
      tasks.push(walk(rootDir, fullPath, extSet, results))
    } else if (entry.isFile() && extSet.has(extname(entry.name).toLowerCase())) {
      tasks.push(scanFile(rootDir, fullPath, results))
    }
  }

  await Promise.all(tasks)
}

async function scanFile(rootDir, filePath, results) {
  let content
  try {
    content = await readFile(filePath, 'utf8')
  } catch {
    return
  }

  const lines = content.split('\n')
  const relativePath = relative(rootDir, filePath)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    KEYWORD_PATTERN.lastIndex = 0
    let match
    while ((match = KEYWORD_PATTERN.exec(line)) !== null) {
      const keyword = match[1].toUpperCase()
      const text = match[2].trim()

      const contextStart = Math.max(0, i - 2)
      const contextEnd = Math.min(lines.length - 1, i + 2)
      const context = lines.slice(contextStart, contextEnd + 1).map((l, idx) => ({
        lineNumber: contextStart + idx + 1,
        text: l,
        isTodo: contextStart + idx === i
      }))

      results.push({
        file: relativePath,
        absolutePath: filePath,
        line: lineNum,
        column: match.index + 1,
        keyword,
        text,
        rawLine: line.trim(),
        context
      })
    }
  }
}
