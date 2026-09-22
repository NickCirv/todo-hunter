# Command reference

Use `node bin/hunt.js` from the pinned source checkout described in the [README](../README.md). The entries below describe the inspected implementation.

| Command or argument | Behavior |
| --- | --- |
| `scan [dir]` | Find annotations and display a scan report. |
| `stats [dir]` | Display aggregate annotation statistics. |
| `report [dir]` | Generate a categorized Markdown report. |
| `blame [dir]` | Show annotation age and author information. |
| `-e, --ext LIST` | Set comma-separated source extensions for the selected command. |
| `scan --no-blame` | Skip Git blame enrichment. |
| `scan -o FORMAT` | Choose table, json or csv output; --output is the long form. |
| `report -p LEVEL` | Filter by P1, P2, P3 or P4 priority. |
| `report -t TYPE` | Filter by bug, tech-debt, feature, optimization or question. |
| `blame --ancient` | Show annotations older than 90 days. |
| `blame --orphaned` | Show annotations whose authors are not in the recent-activity set. |

For prerequisites, file writes, external services and known limitations, see [Behavior and limits](../README.md#behavior-and-limits).

Implementation: [src/index.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/index.js), [src/categorizer.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/categorizer.js), [src/blame.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/blame.js); [review evidence](RESEARCH.md).
