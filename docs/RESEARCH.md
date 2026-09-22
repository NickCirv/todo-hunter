# Source review — todo-hunter

## Revision and method

Inspected public commit: [`ab90c08ff9bd781e386ad3c37171fd973d086fb2`](https://github.com/NickCirv/todo-hunter/commit/ab90c08ff9bd781e386ad3c37171fd973d086fb2). Source tree: `fcc03137c438ffe55c380f547808e5af27b3f1a0`. Capture scope: all eligible text files; 12 of 12 eligible files.

This review read captured implementation and documentation. It did not install dependencies, execute project commands, call project APIs, check package publication or establish live CI status. Examples are source-derived, not captured execution transcripts.

## Claim ledger

| Claim | Evidence | Status |
| --- | --- | --- |
| Actual report-only CLI commands | [src/index.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/index.js) | Verified in inspected source; execution unverified |
| Keyword classification | [src/categorizer.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/categorizer.js) | Verified in inspected source; execution unverified |
| Git blame and recent-author heuristic | [src/blame.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/blame.js) | Verified in inspected source; execution unverified |

## Findings and verification gaps

Despite the package description’s AI wording, the inspected commands scan, classify and report; they do not use an AI service to resolve TODOs. Priority/type labels are rules, not owner-confirmed urgency. A contributor absent from a 90-day log is not proof that a task is unowned.

The captured smoke test only asks Node to syntax-check the entrypoint. It does not exercise behavior, integrations or failure paths. Neither that test nor installation was run in this review.

| Dimension | Result |
| --- | --- |
| Purpose and documented commands | Partially verified: static source inspection |
| Clean installation and examples | Unverified |
| Test suite and live CI | Unverified |
| Performance and security guarantees | Unverified |
| Publication | Local documentation only |

## Documentation inventory

- [README.md](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/README.md) — Rewritten; historic section anchors retained where practical.
- [LICENSE](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/LICENSE) — protected document preserved unchanged.

## Captured source inventory

- [LICENSE](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/LICENSE) — Git blob `05b804beeec7d1a6c933d087387ba4adf6463d93`.
- [README.md](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/README.md) — Git blob `7e4e4fd17cc692477ed357c2c3b17a610ec022bb`.
- [package.json](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/package.json) — Git blob `75a280ff001e22d032b03ad0abe69051c1eeb41b`.
- [.github/workflows/ci.yml](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/.github/workflows/ci.yml) — Git blob `44515034a394670de44454a7a1bd2c7ef0c9836e`.
- [bin/hunt.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/bin/hunt.js) — Git blob `d9f1e38690710f657cfd9a54046fa45446274bcc`.
- [src/blame.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/blame.js) — Git blob `edc5b1674a54ea886c2f4147d30143b97d94d365`.
- [src/categorizer.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/categorizer.js) — Git blob `51da69d4330d45cceb8bd89a4284152b031cfb7f`.
- [src/index.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/index.js) — Git blob `abd949e5c4a8a798586846b4a6ba6c06c34e57f9`.
- [src/reporter.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/reporter.js) — Git blob `fa836fd05b1eda125559a4b35a11178a9eb6a299`.
- [src/scanner.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/scanner.js) — Git blob `d64b7f7bd7b76939d39af1a123d9cc801703f6b3`.
- [src/stats.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/src/stats.js) — Git blob `8f7b90e32e8a0a70fa39d3a1c1afcca4ecd2c90f`.
- [test/smoke.test.js](https://github.com/NickCirv/todo-hunter/blob/ab90c08ff9bd781e386ad3c37171fd973d086fb2/test/smoke.test.js) — Git blob `cfc10442553d2b8a57ad7695d844372f22ecdbe2`.

## Scope boundary

Capture excludes lockfiles, binary artwork, generated output, vendored dependencies and files above the acquisition size limit. The tree records their existence; no verification claim is made for omitted content. Protected documents and historical records are not replaced.

## Reference coverage

Added [command reference](REFERENCE.md) from the argument parser, command handlers and source-defined help at the pinned revision. README examples remain unexecuted.
