# Product scope and decision register

Authority: [Gaming Marketplace implementation plan](GAMING_MARKETPLACE_CODEX_IMPLEMENTATION_PLAN.md), especially sections 1, 4, 7 and 8.

Status: Phase 00 governance accepted; Phase 01 local scaffold accepted by the owner on 2026-10-31. Unresolved product proposals below are not approved business policy. See the [architecture proposal](decisions/0001-architecture.md) and [review ledger](reviews/README.md).

## Target MVP

A mobile-first responsive web marketplace for permitted gaming services: a client drafts and funds a service listing before it becomes publicly OPEN, providers apply, the client chooses exactly one provider, and both parties accept identical immutable terms before work begins. Submission, approval, disputes and authorized payout/refund follow explicit state transitions.

One account can act as client or provider in different agreements. Administrative privileges are distinct. Asset-sale architecture may be considered as directed by the plan; actual in-game asset trading is deferred to separately scoped Phase 17.

Use fictional Sandbox Arena data and fake verified identities for local demonstrations and later testnet beta. Test tokens have no real monetary value. Funding confirmation is a backend/chain responsibility, not a browser claim. The plan's section 7 scenarios are future regression requirements, not Phase 00 test results.

## Binding development guardrails

- No mainnet, real deposits, fiat on/off-ramp, token launch, lending, or production activation.
- No real identity documents, game passwords, wallet private keys or recovery phrases in application data or evidence.
- No cheats, hacks, bots, stolen accounts or publisher-prohibited transactions. Real-game paid categories default to disabled pending documented permission and server-side controls.
- Roblox off-platform cash-for-item trading remains disabled. MLBB account-sharing boosting is prohibited; paid coaching/co-play stays disabled without appropriate clearance.
- Keep private data, messages and evidence off-chain with restricted access.
- Use exact integer monetary units, confirmed funding, immutable agreement acceptance, no double settlement, and deposit-conserving payout/refund/fee allocations.
- An active dispute freezes normal settlement. Enforce cancellation eligibility, resource ownership and distinct recommendation/approval privileges; no administrator single-key backdoor.
- Clearly label simulation and block mock payments from a paid production configuration.
- No native mobile apps, multiple chains, unsupported automated game trades, or recommendation algorithm in this MVP.

## Decisions requiring owner review

All choices marked provisional or unresolved require confirmation before their listed phase. Approval to write this register is not approval of its example policies.

| Decision                      | Current proposal or constraint                                                                                                                                                   | Resolve before                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Name and region               | GameTrust placeholder; Philippines is an assumption, not a validated launch jurisdiction.                                                                                        | Public branding / Phase 16 real-money review                                          |
| UX and stack                  | Owner authorized responsive Next.js web, NestJS API and isolated PostgreSQL scaffolding in Phase 01. PWA offline/installability, Prisma schema and contracts remain later work.  | Phase 01 accepted; later features require separate authorization                      |
| Toolchain                     | Node 24.22.1 (>=24.22.1 <25), pnpm 11.25.0, strict TypeScript, ESLint/Prettier, Vitest and compiled API tests. ESM workspace; exact versions in manifests/lockfile. CI excluded. | Phase 01 verification / GO                                                            |
| First game/category           | Sandbox Arena fixtures only; fictional coaching is a proposed demo category, not real-game permission.                                                                           | Phase 04 (fixtures introduced in Phase 02)                                            |
| Account eligibility           | Simulated 18+ verified status; no real identity collection.                                                                                                                      | Phase 03                                                                              |
| Identity/auth providers       | Unselected. Prototype fake verification responses; later partner/auth choices require review and separate integration permission.                                                | Phase 03 interfaces; before any real integration                                      |
| Wallet UX                     | External wallet connection with nonce-bound ownership signatures; library/provider and recovery UX unresolved.                                                                   | Phase 03 / Phase 09                                                                   |
| Monetary units                | PHP reference display proposed; actual settlement in integer token base units. Token decimals and quote/rounding rules unresolved.                                               | Phase 02 model / Phase 09 integration                                                 |
| Test chain/token              | Owner-approved EVM testnet and allowlisted valueless test token; neither selected.                                                                                               | Phase 08 specification / Phase 09 deployment                                          |
| Platform fee                  | Example 3% is NOT approved policy. Fee calculation, recipient and refund treatment unresolved.                                                                                   | Phase 06 terms / Phase 12 accounting                                                  |
| Review window                 | Example 72 hours is NOT approved policy.                                                                                                                                         | Phase 06 terms / Phase 11 dispute rules                                               |
| Dispute response window       | Example 48 hours is NOT approved policy.                                                                                                                                         | Phase 11                                                                              |
| Other deadlines               | Application cutoff, service due dates, funding/binding expiry, cancellation and appeal windows unresolved.                                                                       | Phase 05 listing fields / Phase 06 terms / Phase 08 contract rules / Phase 11 appeals |
| Automatic completion payout   | Disabled by default pending explicit fairness and security safeguards.                                                                                                           | Phase 08 / Phase 12                                                                   |
| Settlement trust model        | Distinct reviewer/approver; exact thresholds and multisig/key arrangements unresolved.                                                                                           | Phase 08 / Phase 11; independent production review                                    |
| Private storage and retention | Provider, file limits, scanning and retention rules unresolved; evidence must be private.                                                                                        | Phase 10                                                                              |
| Publisher permissions         | Real-game paid categories remain disabled; require evidence, date, scope, reviewer and approval.                                                                                 | Phase 04 / Phase 16; Phase 17 for asset trading                                       |
| Production compliance         | Unresolved; real money BLOCKED pending independent launch program.                                                                                                               | Phase 16                                                                              |

## Phase 00 boundary and acceptance

Historical Phase 00 scope: six governance/ignore files were authorized. No app scaffolding, dependencies, database/schema, services, third-party integration or contract code is included. No migration or environment configuration is needed.

Acceptance requires valid document links, visible unresolved decisions, an explicit no-automatic-advancement rule, an honest phase ledger, whitespace/scope verification, and owner manual review. Passing document checks is not evidence that future payment, privacy, publisher-policy or authorization controls work.
