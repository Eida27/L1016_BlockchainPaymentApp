# Gaming Marketplace — Codex Implementation Plan

> **Document purpose:** A phase-by-phase implementation runbook for a **mobile-first, gaming-focused marketplace with blockchain escrow**. It is designed to be given to Codex in a repository and executed **one approved phase at a time**, with **human review and verification before the next phase**.
>
> **Status:** PLANNING ONLY — no implementation or tests have been executed by this document.
>
> **Project working name:** GameTrust (placeholder; change before branding).
> **Audience:** Project owner, Codex, eventual reviewers.
> **Initial region:** Philippines (assumption; confirm before real-money launch).
> **Last plan revision:** 2026-10-31.

---

## 0. How to use this plan with Codex

1. Put this file in the **root of your project repository** (or `docs/` and adjust prompts accordingly).
2. Begin with **Phase 00**. Ask Codex for a **read-only preflight**: inspect repository, summarize the proposed changes, dependencies, risk, tests and any open decisions. **Do not modify files in preflight.**
3. Inspect the proposal. If acceptable, explicitly authorize **only that phase**. Codex may then implement, run tests, and supply evidence. Prefer a *red → green → refactor → verify* loop for each functional change.
4. Manually inspect the changed files, test outputs, UI, database migrations and transaction behavior. Record your review using the gate template in §3.
5. If anything fails, request **remediation in the same phase**. The next phase stays blocked.
6. Mark the phase **Approved / GO** only after verifying its criteria. Then initiate the next phase in a **new request**.
7. **Never let Codex automatically proceed into subsequent phases.** Never infer approval from silence.

**Mandatory boundaries for Codex:**

- Work on **one phase only**; do not implement later features “for convenience.”
- Respect the repo's existing conventions; propose deviations before changes.
- **No commit, push, PR creation, deployment, cloud spend, secret access, third-party integration, contract deployment or other external write without separate explicit permission.** Running a safe local test that needs no credentials may be approved with the phase.
- Do not invent test outcomes. Report **commands actually run**, results, and untested areas.
- If a command is unavailable or blocked, say so; do not call the phase complete.
- Stop after returning the phase handoff summary and wait for the owner's GO/NO-GO.
- Never use mainnet, real user funds, real game account credentials, or prohibited game trades during MVP development.

### Quick-start prompt (copy into Codex)

```text
Read GAMING_MARKETPLACE_CODEX_IMPLEMENTATION_PLAN.md fully and inspect this repository.
We are working on PHASE 00 ONLY. First perform a READ-ONLY preflight:
1. Describe the current repository and existing conventions.
2. Propose the exact files you would create/change for Phase 00.
3. Identify dependencies, security concerns, unknowns, and acceptance tests.
4. Show the commands you intend to run.
DO NOT edit files, install dependencies, commit, push, deploy, or start another phase.
Wait for my explicit authorization before modifying anything.
```

After reviewing that proposal:

```text
I authorize PHASE 00 ONLY, within the file scope and commands we just reviewed.
Implement the smallest change that satisfies Phase 00's acceptance criteria.
Run the checks; report actual output/results, the changed-file list, open risks,
and exact manual verification steps. STOP. Do not start Phase 01.
```

---

## 1. Product definition and immutable guardrails

### 1.1 Product vision

A mobile-first marketplace where verified gamers can:

- Publish **permitted gaming-related service requests**.
- Apply to provide a service; the client chooses one applicant.
- Agree on deliverables, due date, evidence requirements and payment before work begins.
- Secure the payer's funds in **escrow** and release/refund them under agreed rules.
- Chat within the agreement, submit evidence, review completion and raise disputes.
- Use a moderated administrator process, with restricted authorization, for disputed settlements.
- In a later release, list and purchase **only publisher-permitted** in-game assets with verifiable transfer methods.

### 1.2 Supported transaction types

| Type | Payer | Recipient | Funding trigger | MVP status |
|---|---|---|---|---|
| Service request | Client | Selected service provider | **Before** service listing is published (or remain a draft) | Build & test on testnet only |
| Asset sale | Buyer | Seller | **After** seller accepts buyer's offer, before transfer | Database/architecture only; trading later |

**One person, one account, many capacities.** A verified gamer may be a client, provider, buyer or seller; roles are contextual to each transaction. Administrative roles are distinct and tightly controlled.

### 1.3 Publisher compliance — hard feature flags

- **Roblox:** Its official support directs users to trade via Roblox's own Trade feature and states not to trade for real money, accounts, or items outside Roblox. **Do not implement or enable off-platform paid Roblox-item trading.** A future integration requires a publisher-authorized arrangement and a verifiable permitted mechanism.
- **Mobile Legends: Bang Bang (MLBB):** Publisher terms restrict account transfer/sharing and commercial uses. **Do not implement account-credential-sharing boosting or enable paid MLBB coaching/co-play without appropriate publisher clearance.** Never request or store a player's game password.
- For **any** game: default to `disabled` for money-related categories until someone documents permission, evidence, date, scope, and review outcome.
- **Use a fictitious test game** (e.g., `Sandbox Arena`) and fictional service listings for beta demos. This avoids implying publisher endorsement or permitting prohibited activities.
- No cheats, hacks, bots, exploiting security flaws, stolen accounts, or transactions prohibited by a publisher.

**Compliance status data:** `games.policy_status` and `categories.enabled_for_paid_transactions` must be enforced **server-side** and covered by tests, not merely hidden in the UI. Introduce a change audit and an approval record before toggling paid features.

### 1.4 Financial and identity safety

- **Testnet only** until separate legal, security, operational and publisher reviews explicitly authorize a production pilot. Test tokens must have **no real monetary value**.
- Identity checks for paid operations should be designed around **18+ eligibility** and a verification partner; during beta, use fake provider responses/test identities, **not real identity documents**.
- A payment is **not funded** because the browser or user says so: verify chain, correct escrow contract, token, amount, event, and confirmations through a backend verifier/indexer.
- Use exact integer amounts (`minor units` for fiat displays; `base units` for blockchain tokens); never floats for money.
- Keep private user data, identity details, chats and evidence **off-chain**. Store immutable hashes or minimal references on chain only where needed.
- A dispute **freezes normal release/refund paths** until an authorized decision; avoid an administrator single-key backdoor.
- Escrow must not pay more in total than its actual deposit. **No double settlement**. No unilateral client reclaim during an active, non-cancellable agreement.
- No guarantee that a traditional game's item was transferred without reliable publisher-supported evidence; escrow only secures payment, not external delivery.

### 1.5 MVP non-goals

No mainnet/production deposits; no fiat on/off-ramp; no native Android/iOS apps; no multiple chains; no token launch; no user-to-user lending; no Roblox cash-for-item trading; no MLBB credential-sharing boosting; no automated unsupported-game trades; no arbitrary admin movement of pooled funds; no trending recommendation algorithm until core flows are stable.

---

## 2. Proposed architecture (adjust to existing repo only with owner approval)

**Preferred architecture:** TypeScript monorepo using a responsive Next.js web app/PWA, NestJS API, PostgreSQL + Prisma, private object storage, a background blockchain event indexer, Solidity + Foundry + OpenZeppelin on an EVM testnet. Use managed identity and messaging infrastructure when appropriate, but do not require third-party access during initial local phases.

**Suggested directory layout (illustrative, not mandated):**

```text
gaming-marketplace/
├── AGENTS.md                   # Codex working rules (created in Phase 00)
├── GAMING_MARKETPLACE_CODEX_IMPLEMENTATION_PLAN.md
├── README.md
├── apps/
│   ├── web/                    # Next.js app / mobile-first UI
│   └── api/                    # NestJS REST API
├── packages/
│   ├── database/               # Prisma schema / migrations / seed
│   ├── shared/                 # DTOs, validators, domain types
│   └── contracts/              # Foundry escrow contracts and tests
├── docs/
│   ├── decisions/              # Small architecture decision records
│   ├── reviews/                # Human phase gate notes
│   ├── api/                    # OpenAPI and response contracts
│   └── threat-model.md
└── .github/workflows/          # CI checks (when approved)
```

**Separation of responsibility:**

- **Frontend:** listings, offers, contracts, wallet connection, completion, reviews and mobile UX. Never trusted for authorization or payment status.
- **API:** identity, game policy, roles, listings, offers, agreements, messaging, evidence, dispute decisions and audit records.
- **Database:** authoritative business records and projections of chain state; never the source of truth for actual token custody.
- **Smart contract:** ownership of test tokens and enforcement of escrow state, authorized releases/refunds/splits, deadlines, dispute locks.
- **Indexer/worker:** confirm and reconcile on-chain events, handle retries, reorgs and idempotency; do not blindly trust submitted transaction hashes.
- **Admin portal:** separate privileges for moderation, dispute review and settlement approval; immutable audit trail.

**Environment separation:** `local` (mock escrow), `testnet` (real testnet contract), `production` (disabled until explicit launch decision). Never permit a mock payment adapter in a paid production build.

### 2.1 Core business state machines

**Service listing:** `DRAFT -> AWAITING_FUNDING -> OPEN -> SELECTION_PENDING -> ACTIVE -> COMPLETED`; side paths `CANCELLED` and `EXPIRED`. An `OPEN` paid service listing must have confirmed escrow funding.

**Agreement:** `AWAITING_BOTH_ACCEPTANCES -> ACTIVE -> SUBMITTED -> IN_REVIEW -> SETTLED`; side paths `DISPUTED`, `CANCELLED`. Do not treat database state as proof of money movement.

**Escrow:** `CREATED -> FUNDED -> BOUND -> RELEASED` or `REFUNDED`, with `DISPUTED -> RESOLVED` as an alternate path. Implement only legal transitions and prevent repeated terminal transitions.

**Asset sale later:** Seller lists first; buyer offer accepted; buyer funds an escrow with the seller already designated; confirmed verified delivery precedes seller payout.

### 2.2 Baseline access control

| Role | Access |
|---|---|
| Visitor | Read public allowed listings and profiles |
| User (unverified) | Draft listings, complete onboarding; no funded contract |
| Verified gamer | Fund, post, apply, accept, submit, approve, dispute and review own deals |
| Moderator | Suspend prohibited listings/accounts; no unilateral payment settlement |
| Dispute reviewer | Read evidence and write recommendation; no unilateral payout |
| Settlement approver | Approve permitted decision; threshold/multisig for on-chain settlement |
| Super admin | Admin policies and privileges with enhanced controls; no unlogged fund transfer |

---

## 3. Manual review gate — required after **EVERY** phase

**Codex phase handoff must include:** (a) changes/diff summary; (b) actual commands and pass/fail outputs; (c) automated test evidence; (d) manual test instructions; (e) migration/environment changes; (f) security/privacy notes; (g) known gaps; (h) an explicit **STOPPED — awaiting human review** statement.

Copy the following into `docs/reviews/phase-NN-review.md` after each phase (the owner can create it manually; Codex may prepare a draft only if authorized):

```markdown
# Phase NN — Human Review
Date:
Reviewer:
Commit/revision reviewed:
Scope matched approved phase? [ ] Yes [ ] No
Changed files inspected? [ ] Yes [ ] No
Automated commands reviewed (real logs)? [ ] Yes [ ] No
Manual acceptance scenarios run? [ ] Yes [ ] No
Security & privacy checks reviewed? [ ] Yes [ ] No
No unapproved external writes / credentials / funds? [ ] Confirmed
Open issues / bugs:
Decisions and screenshots or evidence links:
Decision: [ ] GO — approve Phase NN only
          [ ] NO-GO — remediate Phase NN
          [ ] BLOCKED — unresolved prerequisite
Next-phase authorization given separately? [ ] No [ ] Yes, explicitly
```

**Hard stop:** A successful CI run or a Codex statement of “done” is **not** phase approval. A phase remains unapproved until the owner signs off. Failing or skipped required checks mean **NO-GO**, not “probably okay.”

**Standard verification set** (once scripts exist; use repo-equivalent commands rather than pretending these already work):

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
# Include separately when configured:
pnpm test:e2e
# Contracts, from the contract package:
forge test -vvv
# Inspect local changes before approval:
git diff --check
git status --short
```

Avoid destructive reset/migration commands in shared environments. Test migration rollback in a disposable local database. Dependency installation may require separate network permission.

---

## 4. Implementation phases — sequential and human-gated

### Phase 00 — Repository orientation, decisions and Codex governance

**Objective:** Establish constraints and a safe repository workflow before application code.

**Scope for Codex:**
1. Inspect current repo and report what's already present; do not blindly overwrite files.
2. After a **separate preflight approval**, create/update `AGENTS.md`, `README.md` (short), `docs/decisions/0001-architecture.md`, `docs/product-scope.md`, `docs/reviews/README.md` and `.gitignore` as appropriate.
3. In `AGENTS.md`, require reading this plan, one-phase scope, security/privacy constraints, red-green-refactor-verify, actual evidence, and a hard stop for human approval.
4. Record assumptions needing decisions: first permitted game/category, age threshold, escrow fees, deadlines, identity provider, wallet UX and testnet.
5. Define a phase status ledger (not started / proposed / approved-to-implement / in progress / review / GO / NO-GO / blocked) without marking future work done.

**Not in scope:** Install dependencies, create app code, cloud services or smart contracts.

**Verify:** Documents link to this plan; `git diff --check`; decisions and unresolved assumptions visible; AGENTS.md explicitly blocks automatic phase advancement.

**Owner manual check:** Read and accept all assumptions and guardrails. **Gate 00:** `[ ] GO  [ ] NO-GO`.

### Phase 01 — Monorepo and local developer experience

**Depends on:** GO 00.

**Scope:**
1. Scaffold `apps/web`, `apps/api`, `packages/database`, `packages/shared`, `packages/contracts` without enabling on-chain functionality.
2. Wire TypeScript strict checking, formatting, ESLint, testing toolchain, workspace scripts and environment validation.
3. Add local PostgreSQL via an approved isolated/dev setup (e.g. Docker Compose) and an example environment file with **placeholder values only**.
4. Add `/health` endpoint; responsive web landing page; development README.
5. Establish CI checks if GitHub workflow creation is approved (do not create remote PRs/push).

**Tests:** Web builds; API health test; lint, typecheck, tests and build work locally; missing required env vars produce clear errors.

**Owner manual check:** Fresh checkout setup, mobile-width landing page, no secrets in source, run commands documented. **Gate 01:** `[ ] GO  [ ] NO-GO`.

### Phase 02 — Domain schema, migrations and test fixtures

**Depends on:** GO 01.

**Scope:**
1. Design and migrate Prisma/PostgreSQL tables in §5; create keys, foreign keys, unique constraints, indexes and timestamps.
2. Add domain enums and seed only **fictional Sandbox Arena** data; no real identities or publisher item inventories.
3. Define exact monetary unit model (display currency vs chain token), transaction ownership, status transitions, and audit history.
4. Add migration/test database commands; keep risky data changes additive.

**Tests:** Fresh migration, seed idempotency, DB constraint tests (duplicate accepted offers, invalid amounts, invalid relationships), basic query tests.

**Owner manual check:** Inspect ERD, constraints, index plan, seed values, migration down/recovery strategy. **Gate 02:** `[ ] GO  [ ] NO-GO`.

### Phase 03 — Authentication, roles and test verification

**Depends on:** GO 02.

**Scope:**
1. Implement registration/login/session management with an approved authentication library/provider; secure cookie/session lifecycle and MFA-ready design.
2. Add role-based + resource-owner authorization helpers and API guards; never rely on user-supplied IDs.
3. Add wallet ownership proof using a nonce-bound signed challenge (no user private key storage).
4. Add **simulated** identity verification states for test users; architect real provider integration behind an interface for later.
5. Add privacy defaults, rate limits, abuse detection hooks and admin bootstrap strategy.

**Tests:** Unauthorized API -> 401; wrong owner -> 403/404; expired/replayed wallet challenge rejected; unverified user barred from monetary actions; sessions expire and log out correctly.

**Owner manual check:** Register, log in/out, inspect one user's forbidden access to another's resources, verify no ID documents/keys stored. **Gate 03:** `[ ] GO  [ ] NO-GO`.

### Phase 04 — Supported-game catalog and prohibited-category protection

**Depends on:** GO 03.

**Scope:**
1. Implement games, allowed service categories and policy version/history.
2. Seed a fictional demo game as **the only eligible paid category** in beta; store Roblox/MLBB as disabled or informational entries, never as paid offerings.
3. Add server-side checks for listing creation, publication, offer acceptance and funding; include restricted-keyword moderation queue (not as sole protection).
4. Build mobile-first catalog/category selection and explain why a category is disabled.
5. Add an audited permission/approval process before a paid category can be enabled.

**Tests:** API rejects disabled Roblox/MLBB paid operations even when called directly; allowed sandbox category succeeds; changing UI flags alone does not bypass server checks.

**Owner manual check:** Attempt forbidden listing/API requests, confirm no real game account password fields, inspect admin toggle audit. **Gate 04:** `[ ] GO  [ ] NO-GO`.

### Phase 05 — Service listings, drafts, funding eligibility and discovery UI

**Depends on:** GO 04.

**Scope:**
1. Service request create/edit/delete draft APIs; title, game/category, deliverable, proof, price, due date, application cut-off.
2. Responsive browse, search, filter, listing detail and My Listings pages.
3. Backend validated ownership, visibility, pagination, content moderation states, and sanitized user content.
4. Introduce `AWAITING_FUNDING` and `OPEN` workflow; **public paid listing cannot become OPEN until an authorized escrow adapter confirms funding**. Mock/test adapter may be used at this stage and must be labeled as simulated.
5. Implement safe owner cancellation when no active agreement exists.

**Tests:** Unverified or prohibited categories blocked from funded publication; draft editable only by owner; funded/open invariant; invalid money/deadlines rejected; list pagination and object authorization.

**Owner manual check:** Phone-size post flow, submit invalid data, verify unpublished unfunded draft and readable listing. **Gate 05:** `[ ] GO  [ ] NO-GO`.

### Phase 06 — Applications, provider selection and immutable agreements

**Depends on:** GO 05.

**Scope:**
1. Provider application/offer API and applicant list for owner; prevent self-application, duplicates, and applications to closed posts.
2. Owner selects at most one provider; create immutable agreement snapshot of title, scope, amount, deadline, evidence policy, cancellation policy and platform fees.
3. Record **both parties' acceptance** of the exact agreement version with timestamps and cryptographic term hash; changing terms requires a new version and new acceptances.
4. Ensure selection is atomic under concurrent requests; rejected applicants cannot bind an escrow.
5. Add applicant list, comparison cards, accept/reject UI and agreement review screen.

**Tests:** Race: two simultaneous selections yields one accepted provider; no participant can alter accepted terms; nonparty cannot accept; accepted offer belongs to same listing.

**Owner manual check:** Post -> receive 3 applications -> choose 1 -> inspect agreement -> both accept; attempt selection twice. **Gate 06:** `[ ] GO  [ ] NO-GO`.

### Phase 07 — Mock escrow adapter and end-to-end local service simulation

**Depends on:** GO 06.

**Scope:**
1. Define a typed `EscrowGateway` interface with methods for funding proof, binding selected payee, status, dispute lock, payout/refund and event reconciliation.
2. Implement **local/test-only mock escrow** with deterministic fixtures, clear `SIMULATED` labels, and no real-money capability.
3. Wire service workflow: draft -> simulated funded -> open -> selected -> both accept -> active -> completion placeholder.
4. Add an append-only business event log and correlation IDs to support debugging.

**Tests:** Impossible state transitions rejected; repeated funding and settlement requests idempotent; no later steps without prerequisite; mock adapter cannot be enabled in a production configuration.

**Owner manual check:** Full local demo and failure cases; confirm unmistakable simulator labeling. **Gate 07:** `[ ] GO  [ ] NO-GO`.

### Phase 08 — Solidity escrow contract and adversarial tests

**Depends on:** GO 07.

**Scope:**
1. Specify an escrow contract supporting (a) **pre-funded unassigned service listing**, later cryptographically bound to exactly one accepted provider; and (b) later buyer-funded asset agreement with known seller.
2. For service-provider binding, require payer authorization **and provider acknowledgement** of the agreement hash; protect against replay and unauthorized relinking.
3. Implement explicit deposit token/amount, payer/payee, agreement hash, deadlines, settlement state, cancellation eligibility and dispute lock.
4. Implement authorized release, predetermined refund, disputed settlement and split payout; enforce exact arithmetic and access control. Use approved, audited community libraries where appropriate.
5. Define how review-time expiry works **without silent admin override**; defer automatic payout if fairness checks are not yet ready.
6. Create unit, fuzz, invariant and adversarial tests. No testnet deploy in this phase.

**Required invariants/tests:**
- No `release`/`refund` before funding or outside permitted state.
- No double payout or duplicate refund; no overpayment even with fee splits.
- Wrong token, wrong caller, zero/invalid amount, expired/replayed signature rejected.
- Cannot replace bound provider; cannot bypass active dispute lock.
- Cancel unassigned/expired listing only under rules; enforce effect-before-interaction / reentrancy safety.
- No privileged single-key function that can take arbitrary escrows.

**Owner manual check:** Read contract API and threat assumptions; inspect detailed forge output and state-transition table. Arrange independent contract review **before any real-money use**. **Gate 08:** `[ ] GO  [ ] NO-GO`.

### Phase 09 — Wallet integration, testnet deployment and chain indexing

**Depends on:** GO 08 plus **separate explicit permission** for any network testnet writes or funded infrastructure.

**Scope:**
1. Add wallet connection and clear account/network switching UX; verify signatures.
2. Deploy only to an **approved testnet** using test tokens and a documented contract address; never embed deployer private keys in code.
3. Verify escrow creation/funding, signed provider binding and settlement calls from frontend/backend.
4. Build indexer with retries, confirmation policy, unique `(chain_id, tx_hash, log_index)` events and reconciliation/reorg handling.
5. Restrict chain/contract/token allowlists on server; never trust an arbitrary wallet-submitted `tx_hash`.
6. Expose real-time transaction status and delayed-confirmation states to the UI.

**Tests:** Wrong chain/contract/token/amount ignored; duplicate event replay safe; funding only marked confirmed after configured confirmations; indexer restart catches up; simulation blocked on prod mode.

**Owner manual check:** Inspect transaction on public testnet explorer, verify DB/event consistency, deliberate wrong-network test, no secrets in logs. **Gate 09:** `[ ] GO  [ ] NO-GO`.

### Phase 10 — Agreement workroom, chat, submission and evidence

**Depends on:** GO 09.

**Scope:**
1. Add agreement-specific secure messaging, contract timeline, deadlines and notifications.
2. Add evidence upload to private object storage with size/type limits, malware scanning plan, retention rules and signed expiring access URLs.
3. Provider submits completion proof; only agreement participants/admin with case access can view it.
4. Client can approve or dispute after submission; prevent a direct payment from a browser-only UI action.
5. Create API contract tests and end-to-end state tests.

**Tests:** Nonparticipants cannot read chat/files; unsafe uploads rejected; submit before active agreement blocked; repeat submit idempotent; expired URLs denied.

**Owner manual check:** Two browser accounts, exchange messages, upload sample proof, check access control and mobile UX. **Gate 10:** `[ ] GO  [ ] NO-GO`.

### Phase 11 — Disputes, review and administrative separation of duties

**Depends on:** GO 10.

**Scope:**
1. Either party opens a dispute with reason/evidence before an allowed review deadline.
2. Freeze normal escrow settlement once on-chain dispute status is confirmed; reconcile DB state with chain.
3. Build moderator dashboard and dispute queue, evidence timeline, response window and reviewer notes.
4. Separate `reviewer recommendation` from `settlement approver`; record a written reason and full audit trail.
5. Implement transparent resolution rules for provider full payout, payer refund or an agreed/proven split, with approval requirements.
6. Record a basic appeal process without allowing indefinite unauthorized fund lock.

**Tests:** Nonparty cannot open case; admin cannot pay self by changing recipient; reviewer alone cannot authorize transfer; two competing settlement attempts cannot both succeed; dispute and normal release race safe.

**Owner manual check:** Simulate fraudulent provider and fraudulent client cases; inspect audit timeline and role separation. **Gate 11:** `[ ] GO  [ ] NO-GO`.

### Phase 12 — Release/refund UX, fee accounting and recovery

**Depends on:** GO 11.

**Scope:**
1. Complete payer approval -> contract release and authorized dispute outcome -> payout/refund/split UI.
2. Show exact token amount, nominal fiat display, fee treatment and network fees. Disclose price quote vs actual settled token units.
3. Establish time-based cancellation/refund rules for listings with no selected provider; distinguish active contract cases.
4. Add reconciliation job to detect stale and mismatched escrow statuses; alert rather than silently rewrite money state.
5. Generate a downloadable audit-friendly transaction receipt (no personal identity info on public chain).

**Tests:** Full payout/refund/split conserve deposit; fee never charged twice; exhausted escrow cannot be reused; partial failure retries safe; deadlines and cancellation policy enforced.

**Owner manual check:** Complete three demo contracts (paid/refunded/split) and inspect wallet balance, blockchain event, DB and UI receipt. **Gate 12:** `[ ] GO  [ ] NO-GO`.

### Phase 13 — Reputation, notifications and user dashboard

**Depends on:** GO 12.

**Scope:**
1. Transaction history, wallet-escrow status, applications, active agreements and notifications.
2. Permit reviews **only after settled agreements**; one review per party per transaction; moderation and abuse controls.
3. Transparent, explainable profile summary (completed jobs, review count); no fake “verified delivery” badges.
4. Optional opt-in email notifications via an approved sender/sandbox (no unapproved third-party account access).

**Tests:** Reviews cannot be purchased or submitted for nonexistent work; notifications enforce recipient authorization; closed transactions retain accurate history.

**Owner manual check:** Use both identities; verify dashboard accuracy, review eligibility and notification links. **Gate 13:** `[ ] GO  [ ] NO-GO`.

### Phase 14 — Security, accessibility, performance and failure recovery

**Depends on:** GO 13.

**Scope:**
1. Threat model: account takeover, object-level auth, forged evidence, malicious files, replayed wallet signatures, chain event spoofing, admin key compromise, front-running/races and smart contract bugs.
2. Run security-focused tests, dependency review, secret scanning, API authorization matrix, rate limiting, CSRF/session safety and secure headers.
3. Exercise backups/restore in a disposable environment, queue retries, indexer restarts and chain reconciliation.
4. Test mobile layouts, slow connections, accessibility (keyboard/screen reader), common error/empty states.
5. Add structured logs and alerting that do not expose PII or secret material.

**Tests:** E2E happy + failure paths; CI lint/types/unit/integration/build; Foundry fuzz/invariants; security regression tests; backup/restore drill.

**Owner manual check:** Review threat-model residual risks, reproduce a restored local database, inspect accessibility and slow-network behavior. **Gate 14:** `[ ] GO  [ ] NO-GO`.

### Phase 15 — Closed beta (sandbox users + test tokens only)

**Depends on:** GO 14 plus explicit approval to run beta infrastructure.

**Scope:**
1. Prepare approved beta environment, isolated test accounts, fictional listings and test tokens; enforce no production money.
2. Write user testing scripts and support/dispute escalation playbook.
3. Run full two-user flows and adversarial scenarios with observed evidence, not simulated claims.
4. Collect error logs and qualitative feedback; file issues by severity; fix critical/high blockers within this phase or return NO-GO.
5. Produce a beta report and a separate **production-readiness gap list**.

**Required beta demos:** create -> fund -> open -> apply -> choose -> both accept -> submit -> approve -> pay; unfunded block; client cancellation; provider failure/refund; dispute/split; indexer restart; duplicate events; wrong wallet; prohibited game blocked.

**Owner manual check:** Sign beta report, verify money is valueless test tokens, decide whether additional beta iteration is needed. **Gate 15:** `[ ] GO  [ ] NO-GO`.

### Phase 16 — Separate production launch program (**NOT AUTHORIZED by this plan**)

Do **not** activate as an automatic next phase. Requires an independent decision with, at minimum:

- Written legal advice on the specific Philippines and target-jurisdiction model (cryptoassets/custody, payments, consumer protection, refunds, AML/KYC, data privacy, tax).
- Documented **publisher permissions** for every paid game/category or a game-agnostic permitted service model.
- Identity/provider and licensed-payment/custody partner due diligence where applicable.
- Independent smart-contract and backend security audit, key-management/multisig, recovery/incident-response exercise.
- Production safeguarding, customer support, adjudication and appeals SOPs; realistic fee/refund policy; operational treasury reconciliation.
- Explicit owner approval of production deployment, third-party contracts, real-money custody, and change-control procedures.

**No GO for Phase 16 is implied by completing Phase 15.**

### Phase 17 — Optional in-game asset marketplace (**future / separately scoped**)

Enable **only** approved games/assets with supportable delivery verification. Design seller listing -> buyer offers -> seller chooses buyer -> buyer funds -> permitted asset transfer -> independent verification -> release or dispute. For blockchain-native assets, evaluate atomic escrow of the **asset and payment** together. For game-server items, require publisher-supported APIs/records and reversal policy; user screenshots alone are inadequate. No Roblox cash-for-item trade without explicit authorization.

---

## 5. Core data model and constraints

The following is the **logical schema target**, not executable migration SQL. Codex should implement and test constraints incrementally in Phase 02, and extend as required by later phases.

| Table | Fields / notes | Important rules |
|---|---|---|
| `users` | id, username, email, auth_ref, status, created_at | unique normalized email/username; avoid storing passwords if auth provider owns them |
| `user_roles` | user_id, role, granted_by, granted_at | admin role grant audit |
| `identity_checks` | id, user_id, provider_ref, status, adult_eligible, checked_at | minimal metadata only, never raw identity documents |
| `wallets` | id, user_id, chain_id, address, verified_at | unique chain/address; proof-of-control required |
| `games` | id, name, publisher, policy_status, checked_at | disallowed by default for paid listings |
| `game_policies` | id, game_id, policy_url, version, reviewer, decision | immutable policy review history |
| `categories` | id, game_id, kind, enabled_for_paid_transactions | server-side allowlist |
| `game_profiles` | id, user_id, game_id, public_player_id | **never account password**; verify link where possible |
| `listings` | id, owner_id, game_id, category_id, kind, title, description, amount_minor, currency, deadline_at, status | active service listings require verified funding |
| `listing_requirements` | listing_id, deliverables_json, evidence_policy, cancellation_policy | clear terms and content moderation |
| `offers` | id, listing_id, applicant_id, message, status | one active offer/applicant/listing unless explicit versioning |
| `agreements` | id, listing_id, selected_offer_id, payer_id, payee_id, terms_hash, snapshot_json, status, due_at | one selected agreement/listing for MVP; immutable snapshot |
| `agreement_acceptances` | agreement_id, user_id, terms_hash, signed_at, proof_ref | exactly both valid parties and same version |
| `escrows` | id, listing_id, agreement_id nullable, chain_id, contract_address, token_address, amount_base_units, payer_wallet, status | actual funds verified by chain |
| `chain_events` | id, chain_id, tx_hash, log_index, block_hash, escrow_id, event_type, payload | unique `(chain_id,tx_hash,log_index)`; reorg-aware |
| `settlements` | id, escrow_id, payee_amount, refund_amount, fee_amount, tx_hash, finalized_at | totals cannot exceed deposit; final state once |
| `messages` | id, agreement_id, sender_id, body, created_at | authorize participants; retention/safety policy |
| `evidence_files` | id, agreement_id, uploaded_by, private_object_ref, hash, content_type | private storage, access expiry, validation |
| `disputes` | id, agreement_id, opened_by, reason, status, response_due_at | at most one open case/transaction initially |
| `dispute_events` | id, dispute_id, actor_id, action, body, created_at | append-only evidence trail |
| `dispute_decisions` | id, dispute_id, reviewer_id, reason, proposed_allocation | reviewers cannot directly settle |
| `settlement_approvals` | decision_id, approver_id, approved_at, signature_ref | independent authorization threshold |
| `reviews` | id, agreement_id, reviewer_id, target_id, rating, body | only settled contracts; one per direction |
| `notifications` | id, user_id, type, data_ref, read_at | users cannot view another's notifications |
| `audit_logs` | id, actor_id, object_type, object_id, action, old_hash, new_hash, time | append-only sensitive action history |

**Recommended indexes:** `listings(game_id,status,created_at DESC)`, `offers(listing_id,status)`, `agreements(payer_id,status)` and `(payee_id,status)`, `escrows(chain_id,contract_address)`, `disputes(status,created_at)`, `chain_events(chain_id,tx_hash,log_index)` unique.

**Transactions & concurrency:** use DB transactions and conditional updates for single selection; locks or unique partial indexes for single active agreement; idempotency keys for payment-changing commands; chain event and settlement uniqueness constraints. Return explicit errors for invalid transitions.

**API surface (suggested; finalize in an OpenAPI spec):**

```text
GET    /health
GET    /games                     GET    /categories?gameId=...
POST   /auth/wallet-challenge     POST   /auth/wallet-verify
GET    /me                        GET    /me/transactions
GET    /listings                  POST   /listings
GET    /listings/:id              PATCH  /listings/:id
POST   /listings/:id/offers       GET    /listings/:id/offers
POST   /listings/:id/select-offer
GET    /agreements/:id            POST   /agreements/:id/accept
POST   /agreements/:id/submit     POST   /agreements/:id/approve
POST   /agreements/:id/disputes   GET    /agreements/:id/messages
POST   /agreements/:id/messages   POST   /agreements/:id/evidence
GET    /escrows/:id               POST   /escrows/:id/funding-intent
GET    /me/notifications          POST   /agreements/:id/reviews
GET    /admin/disputes            POST   /admin/disputes/:id/recommend
POST   /admin/settlements/:id/approve
```

Authorization required on every nonpublic endpoint; never expose private case contents based on a guessable identifier.

---

## 6. Reusable Codex prompts for every phase

### A. Read-only preflight prompt

```text
Read AGENTS.md, GAMING_MARKETPLACE_CODEX_IMPLEMENTATION_PLAN.md and the
current repository code/docs. We are considering PHASE [NN] ONLY.
Before making any changes, give me:
- Current repo status; prerequisites and earlier GO approvals (if documented)
- The exact Phase [NN] acceptance criteria and non-goals
- Proposed files/diff surface and implementation steps
- The first failing test/check to write, the minimum fix and refactor scope
- Exact verification commands available in this repository
- Security, privacy, chain, publisher-policy and data-migration risks
- Any separate permissions needed for installs, network writes, secrets,
  contract deployment, Git commits/pushes, cloud services or providers
Do not modify files or run commands with side effects. STOP for approval.
```

### B. One-phase implementation prompt (after approving preflight)

```text
APPROVED: implement PHASE [NN] ONLY, with the file scope and commands just
approved. Read AGENTS.md and the plan again. Apply red/green/refactor/verify.
Do not add next-phase features, access real identities/funds, deploy mainnet,
commit, push or perform any other separately unauthorised external operation.
Run available focused and regression checks. Report actual command outputs,
changed files, risks, skipped tests, screenshots/manual steps where relevant.
End with: "STOPPED — Phase [NN] awaiting human review". Do not start [NN+1].
```

### C. Independent verification prompt

```text
Review the Phase [NN] diff against its approved scope and acceptance criteria.
Run or propose safe tests, inspect authorization, input validation, race
conditions, secret handling, payment invariants and relevant publisher flags.
Report concrete findings with filenames and line numbers, reproduction steps,
and severity. Do not modify files. Do not claim a passing test without a real
observed run. STOP for my manual decision.
```

### D. Same-phase remediation prompt

```text
Phase [NN] is NO-GO because of the following review findings: [PASTE ISSUES].
Fix ONLY these findings in the same phase. Add regression tests for each fix.
Run the relevant checks and report diffs/results. Do not start another phase,
commit, push or deploy. STOP for another manual review.
```

### E. Phase handoff prompt

```text
Summarize Phase [NN] for the human review record: changed files, exact tests
and outcomes, manual verification steps, decisions, open risks and rollback
considerations. Do not mark this phase GO; only I can approve it. Do not start
the next phase. STOP.
```

**Suggested owner reply after successful verification:**

```text
GO: I manually reviewed and accepted Phase [NN]. Record this decision in the
phase review ledger only (if previously authorized). Do NOT begin Phase [NN+1]
until I explicitly request its read-only preflight.
```

---

## 7. End-to-end acceptance scenarios (must survive future changes)

1. **Unverified client** attempts to activate a paid listing → reject.
2. **Disabled game/category** (Roblox paid item trade, MLBB paid boosting/coaching without permission) → reject server-side.
3. Client drafts service but **has not funded escrow** → listing is not publicly `OPEN`.
4. Client funds correct token/amount and chain confirms → listing becomes `OPEN` exactly once.
5. Three verified providers apply → client sees all; only selected applicant proceeds.
6. Two simultaneous selection requests → at most one accepted agreement.
7. Client and provider accept same immutable terms hash → contract becomes active.
8. Wrong wallet, token, chain, contract or replayed challenge → reject.
9. Provider submits proof; client approves → exact payout once, fee allocated correctly.
10. Client does not approve and opens timely dispute → ordinary settlement frozen.
11. Reviewer recommends refund; distinct approver authorizes → contract pays refund within deposit cap.
12. Payer tries early unilateral withdrawal after binding → reject.
13. Unassigned listing passes permitted cancellation rule → refund safely available.
14. Indexer receives same event twice or restarts → no duplicate state changes.
15. Outsider requests chat/evidence/admin record → reject.
16. A test token transfer fails or settlement tx reverts → UI/database do not claim success.
17. Mobile user on slow network sees accurate pending/error state and retry guidance.
18. Admin attempts settlement without sufficient approvals → reject and audit.

---

## 8. Decision log — confirm before corresponding phase

| Decision | Provisional choice | Must resolve before |
|---|---|---|
| Project name | GameTrust (placeholder) | public branding |
| Target UX | Responsive web/PWA, mobile-first | Phase 01 |
| Tech stack | Next.js / NestJS / Prisma / PostgreSQL / Solidity / Foundry | Phase 01 |
| Supported paid games | **Sandbox Arena fixture only** for testnet MVP | Phase 04 |
| Test chain/token | Owner-approved EVM testnet + allowlisted test token | Phase 08–09 |
| Wallet UX | External wallet connect + signatures | Phase 03/09 |
| Account eligibility | Prototype simulated 18+ verified status | Phase 03 |
| Fiat prices vs tokens | Show PHP-denominated reference; actual on-chain token/base units | Phase 02/09 |
| Platform fee | Example 3%, **not approved policy** | Phase 06/12 |
| Review window | Example 72 hours, **not approved policy** | Phase 06/11 |
| Dispute response window | Example 48 hours, **not approved policy** | Phase 11 |
| Automatic completion payout | Disabled by default pending strong safeguards | Phase 08/12 |
| Administrative settlement trust model | Restricted approvals / multisig for production | Phase 08/11 |
| Production license/compliance | **Unresolved; real money BLOCKED** | Phase 16 |
| Roblox paid item trading | Disabled; require explicit publisher permission | Phase 17 |
| MLBB commercial services/boosting | Disabled; require explicit publisher permission; no account sharing | Phase 04/16 |

---

## 9. Completion definition

**MVP closed beta is complete only when:**

- Phases **00–15 each have separate human GO records**.
- Two fake verified users can complete the happy-path service workflow end to end with **test tokens**.
- Failed funding, wrong owner, prohibited game, duplicate events, races and dispute scenarios pass recorded tests.
- Testnet on-chain transfers match database transaction history and visible receipts.
- Private records and admin functions enforce access controls.
- All material security and reliability defects are fixed or explicitly retained as beta-blocking NO-GO issues.
- No Roblox or MLBB paid game trade/boosting features are active without publisher authorization.
- No real payment processing or real identity-document collection is present in the sandbox beta.

**Production launch is a distinct legal, security, publisher and business approval project; it does not follow automatically.**

---

## 10. Reference reading (verify current terms again before production)

- OpenAI Codex workflow: [Iterating Development Workflows with Codex](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex) — optional `AGENTS.md` and phase-review conventions.
- OpenAI Codex long-project planning: [Run long-horizon tasks with Codex](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex).
- Roblox official support: [Trading on Roblox](https://en.help.roblox.com/hc/en-us/articles/203313310-Trading-on-Roblox) and [How to avoid trading scams](https://en.help.roblox.com/hc/en-us/articles/203312390-How-to-avoid-trading-scams).
- Moonton legal terms: [MLBB Esports — Terms of Service](https://mlbbesports.com/legal/terms) and [Mobile Legends Terms](https://www.mobilelegends.com/news/articleldetail?newsid=2690368).

**Not legal, security-audit or financial-compliance advice.** Publisher conditions and applicable law can change. Have appropriate specialists validate the real-money model before production.
