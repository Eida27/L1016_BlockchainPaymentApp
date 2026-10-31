# 0001 - Proposed architecture and trust boundaries

Date: 2026-10-31 (Asia/Manila)

Status: accepted for Phase 01 implementation by the owner's "proceed" after read-only preflight, 2026-10-31. Owner accepted Phase 01 after manual review on 2026-10-31; later infrastructure/providers remain unselected and later phases remain unauthorized.

Authority: [Gaming Marketplace implementation plan, sections 1, 2, 4 and 8](../GAMING_MARKETPLACE_CODEX_IMPLEMENTATION_PLAN.md).

## Context and proposal

The repository started with only the implementation plan. There is no existing application convention or dependency graph to preserve. Follow the plan's preferred TypeScript monorepo architecture, accepted for this local Phase 01 scaffold:

| Component          | Proposed technology                        | Responsibility and trust boundary                                                                                     |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Responsive web/PWA | Next.js, TypeScript                        | Mobile-first interface; never authoritative for authorization or payment status.                                      |
| API                | NestJS, TypeScript                         | Validate requests, ownership, identity eligibility, game policy, agreement transitions and administrative privileges. |
| Business records   | PostgreSQL with Prisma                     | Transactions, constraints, immutable agreement snapshots and audited chain projections; not proof of token custody.   |
| Shared package     | TypeScript types and validators            | Shared contracts without replacing server-side enforcement.                                                           |
| Private files      | Private object storage, provider undecided | Authorized evidence access with expiring links; no public identity documents.                                         |
| Indexer/worker     | Runtime and queue design unresolved        | Verify allowlisted chain events, confirmations and amounts; reconcile retries, duplicate events and reorgs.           |
| Escrow             | Solidity, Foundry, OpenZeppelin            | Enforce custody of test tokens, binding, settlement limits, dispute locks and authorized transitions.                 |
| Administration     | Restricted API/UI capabilities             | Separate moderation, dispute recommendation and settlement approval; audit sensitive actions.                         |

The plan illustrates `apps/web`, `apps/api`, `packages/database`, `packages/shared`, and `packages/contracts`. Phase 01 scaffolds all five paths. Database and contracts are documentation-only package boundaries; no schema or escrow functionality is implemented.

## Rationale and consequences

This follows the owner's supplied plan without introducing a competing stack. TypeScript can share validated interface definitions, while separate API and contract boundaries keep browser input from becoming authority over money. PostgreSQL provides transactional business constraints; chain verification remains necessary for token movements.

The separation adds operational complexity: multiple processes, database/chain consistency, event reconciliation, and contract security all require later evidence. Phase 01 pins Node 24.22.1 (range >=24.22.1 <25), pnpm 11.25.0, Next.js 16.4.3, React 19.3.1, NestJS 12.3.2, TypeScript 5.9.3 and Vitest 5.0.5. Exact direct dependencies and resolved transitive versions are recorded in package manifests and pnpm-lock.yaml. Use ESM throughout, NodeNext for API/shared compilation, and Nest legacy decorator metadata emitted by tsc. API tests compile before running Node's built-in test runner; web/shared use Vitest. ESLint and Prettier have independent checks. No CI, provider, queue or cloud account is configured. Prisma version selection and schema work are deferred to Phase 02.

## Environment and authorization boundaries

- `local`: explicit SIMULATED mock escrow and fictional fixtures; no real monetary capability. No service is started in Phase 00.
- `testnet`: separately approved EVM testnet, contract and valueless test token allowlists. Network writes and deployment require separate permission in Phase 09.
- `production`: disabled. Phase 16 is an independent launch program requiring legal, publisher, security, operational and explicit owner approval; it is not authorized by this plan.

Private records stay off-chain. Use exact integer money, immutable accepted terms, idempotent payment-changing actions, verified chain events and deposit-conserving settlement. These are design constraints, not implemented guarantees in Phase 00.

## Open decisions and adoption

See the [decision register](../product-scope.md) for game/category, eligibility, fees, deadlines, identity provider, wallet UX, chain/token and other unresolved choices. The complete review process and phase dependencies are in the [review ledger](../reviews/README.md).

Owner approval of Phase 00 accepts governance and recorded assumptions only to the extent explicitly stated. It does not authorize scaffolding, installation, provider integration, contract deployment, or production. Record any architecture acceptance or requested change with the human review decision before Phase 01 implementation.

## Phase 01 local developer contract

Use manually authored scaffolding without generator telemetry, hosted observability, external assets or integrations. The API and Next.js dev server listen on 127.0.0.1 only, normally ports 3001 and 3000. PostgreSQL 18.4 is isolated under Compose project `gametrust-phase01`, port 127.0.0.1:55432, with its own persistent named volume. No existing database or volume is reused. PostgreSQL 18 data is mounted at `/var/lib/postgresql`.

Root `.env.example` uses fictional local placeholders; `.env` is ignored. A shared validator requires local APP_ENV, distinct integer ports and a loopback PostgreSQL URL with credentials/database and no query/fragment overrides. Invalid configuration errors name fields without values. Each server validates before listening. NODE_ENV production optimization is separate from APP_ENV and does not authorize a production launch. Database settings are never exported into client environment variables.

The root development runner loads local settings and launches direct child Node processes. Ctrl+C, termination, or one child's failure stops the sibling process. Web changes refresh in development; API changes require restarting the runner. GET /health reports API process health only; database reachability is verified separately with SELECT 1. The landing page contains a fictional service example and no transactional controls, API data requests, wallet integration or functioning service worker. PWA install/offline behavior is deferred.

Next.js agentRules is explicitly false so dev startup cannot create or rewrite additional AGENTS.md files. The repository's approved root governance remains authoritative. Telemetry and experimental agent feedback are disabled; no framework reporting is authorized.

Prettier uses endOfLine:auto so both Windows CRLF checkouts and LF checkouts pass formatting checks. Git retains its existing line-ending normalization; no global Git or editor configuration is changed.
