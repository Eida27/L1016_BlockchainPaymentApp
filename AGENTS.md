# Repository working rules

Read the full [Gaming Marketplace implementation plan](docs/GAMING_MARKETPLACE_CODEX_IMPLEMENTATION_PLAN.md) before any phase work. Also read [product scope](docs/product-scope.md), the [architecture proposal](docs/decisions/0001-architecture.md), and the [phase ledger and review procedure](docs/reviews/README.md).

## Authorization and phase boundaries

- Work on ONE explicitly authorized phase only, within its approved file scope and commands.
- Begin each new phase with a read-only preflight. Wait for explicit implementation authorization before modifications.
- Implementation authorization is not a human GO decision. Only the owner can approve a phase after reviewing actual evidence.
- Never automatically advance to another phase or infer approval from silence, passing checks, or an agent completion statement. A previous phase GO does not authorize the next phase.
- If a required check fails, is skipped, or is unavailable, disclose it and do not claim phase completion or GO. Remediation stays in the same phase.
- Do not commit, push, create a PR, deploy, spend cloud funds, access secrets, integrate third parties, deploy contracts, or perform external writes without separate explicit permission.
- Do not install dependencies unless specifically authorized. Phase 00 permits documentation and ignore rules only: no application code, scaffolding, dependencies, services, or smart contracts.
- Preserve existing work. Propose deviations before making them; do not overwrite the authoritative plan to resolve a conflict silently.

## Security and privacy constraints

- Development uses fictional Sandbox Arena listings, fake identities, local simulation, and later approved testnets with valueless test tokens only. No mainnet, real funds, real identity documents, or real game credentials.
- Never request or store game passwords, wallet private keys, or recovery phrases. Keep credentials out of source, logs, fixtures, and review evidence. Ignore rules are not a substitute for checking content.
- Paid game/category operations default to disabled and require documented publisher permission and server-side enforcement. Roblox off-platform paid item trading remains disabled. MLBB credential-sharing boosting is prohibited; paid coaching/co-play remains disabled without publisher clearance.
- Never trust the browser for ownership, authorization, verification status, or funding. Verify chain, escrow contract, token, exact amount, event, and confirmations server-side.
- Use integers for fiat minor units and token base units; never floating-point money. Prevent double settlement and total payouts above the deposit.
- Keep identity metadata, chats, and evidence private and off-chain. Chain references must not disclose private user data.
- Disputes freeze ordinary settlement; enforce permitted cancellation rules and separate reviewer and settlement-approver duties. No arbitrary administrator withdrawal or unilateral reclaim of an active agreement.
- Keep local mock escrow unmistakably SIMULATED; never enable mock payments in a paid production configuration. Production remains blocked pending the separately authorized launch program.

## Implementation and evidence

- For functional changes use red -> green -> refactor -> verify: observe the relevant failure, implement the smallest fix, refactor within scope, and run the required checks again.
- Documentation-only work uses file, link, whitespace, scope, and manual content checks. Do not invent application tests or install a toolchain to test Phase 00.
- Run only available, approved commands. Record exact commands, exit codes/results, failures, skipped checks, and untested areas. Never report an expected result as an observed pass.
- Inspect both tracked diffs and new untracked files; `git diff --check` alone does not inspect untracked content.
- A handoff includes changed files, actual verification evidence, manual acceptance steps, environment/migration changes, security/privacy notes, open decisions, and rollback considerations.
- Record phase status honestly in the ledger. GO requires the owner's explicit decision and evidence reference; future phases must not be marked done.
- End the handoff with `STOPPED — Phase NN awaiting human review` and wait. Do not start Phase NN+1.

## Phase 01 workspace commands and scope

Phase 01 implementation was authorized after its read-only preflight. Work in the existing checkout and preserve Phase 00 governance; do not create a worktree. Commits require separate explicit permission. After accepting Phase 01, the owner authorized a local Phase 00/01 commit on 2026-10-31; no push, deployment or next-phase work is authorized. Use Node 24.22.1 and pnpm 11.25.0. Source packages use ESM, strict TypeScript, and root orchestration; do not bypass environment validation with direct network listeners.

- `pnpm.cmd install --frozen-lockfile`: reproduce reviewed dependencies; lifecycle builds are explicitly allowlisted.
- `pnpm.cmd format:check`, `pnpm.cmd lint`, `pnpm.cmd typecheck`, `pnpm.cmd test`, `pnpm.cmd build`: required separate checks.
- `pnpm.cmd dev`: local web/API runner; Ctrl+C stops its child processes. Restart for API source edits.
- `docker compose -p gametrust-phase01 up -d --wait postgres`: approved isolated database only; `down` preserves its volume. Never use prune or volume deletion without separate authorization.

Phase 01 excludes authentication, domain/schema/migrations, payments, wallets, chain connections, contracts, CI workflows and deployment. Database and contract package placeholders do not claim tests. Validate required local configuration before listening, redact configuration errors, and keep every listener on loopback. Mark Phase 01 review only after actual verification and wait for owner GO; Phase 02 requires a separate request and authorization.
