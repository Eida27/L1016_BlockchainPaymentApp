# Gaming Marketplace (working name: GameTrust)

Phase 01 provides a local-only Next.js landing page, NestJS process-health endpoint, strict TypeScript workspace and isolated PostgreSQL. There is no authentication, listing workflow, payment, wallet connection, Prisma schema, migration or contract implementation. GameTrust is a placeholder name. All displayed game/service examples are fictional.

- [Implementation plan](docs/GAMING_MARKETPLACE_CODEX_IMPLEMENTATION_PLAN.md)
- [Working rules](AGENTS.md)
- [Product scope and decisions](docs/product-scope.md)
- [Architecture](docs/decisions/0001-architecture.md)
- [Human review and evidence](docs/reviews/README.md)

## Windows local setup

Use Node **24.22.1** (supported range `>=24.22.1 <25`) and pnpm **11.25.0**. Node is recorded in `.node-version`, and pnpm in `package.json`. Use an existing compatible installation; no global tool installation is performed by this repository. Docker Desktop with its Linux engine and Compose is required for the isolated database.

Codex's bundled tools are available inside its agent environment but are not automatically on an ordinary PowerShell terminal's PATH. If `pnpm.cmd` is not recognized on this machine, run this in the terminal where you want to start the app:

```powershell
$codexTools = 'C:\Users\anula\.cache\codex-runtimes\codex-primary-runtime\dependencies'
$env:Path = "$codexTools\node\bin;$codexTools\bin\fallback;$env:Path"
node --version
pnpm.cmd --version
```

This adds the bundled Node and pnpm folders to this PowerShell session and its child processes only. It does not install tools, change Windows settings, or edit your PowerShell/fnm profile. The expected versions are `v24.22.1` and `11.25.0`. Both folders are needed because workspace commands also launch Node and pnpm internally. The path above is a machine-specific way to use the verified Codex bundle; other computers need their own supported Node/pnpm installation. Repeat the session setup in each new terminal that lacks those tools.

Run these commands from `C:\endless_refinement\mvp_projects\L1016_BlockchainPaymentApp`:

```powershell
node --version
pnpm.cmd --version
# Creates only the ignored local settings file; do not overwrite an existing .env.
if (-not (Test-Path -LiteralPath .env)) {
  Copy-Item -LiteralPath .env.example -Destination .env
}
pnpm.cmd install --frozen-lockfile
docker compose -p gametrust-phase01 config --quiet
docker compose -p gametrust-phase01 up -d --wait postgres
pnpm.cmd dev
```

`install` downloads locked dependencies. The Compose commands validate configuration and start this project's dedicated PostgreSQL container/volume; they do not migrate any schema. `dev` builds shared code and the API, validates root `.env`, then starts the web and API on loopback. API source changes require stopping and rerunning `dev`; web edits refresh automatically. Stop the application with Ctrl+C before rerunning.

Open [the web page](http://127.0.0.1:3000) and [API health](http://127.0.0.1:3001/health). Ports come from `.env`; the database host port is fixed at `55432` in `compose.yaml`. The database URL must remain loopback-only. The local placeholder password has no use outside this disposable local service. Do not use it for real/shared infrastructure.

`/health` returns `{ "status": "ok", "service": "api", "environment": "local" }`. It reports process health only, not database, chain, funding or escrow readiness. The landing page needs no database connection and makes no backend data requests.

`APP_ENV` must be `local`. Required configuration is `APP_ENV`, `WEB_PORT`, `API_PORT`, and `DATABASE_URL`; invalid values fail before listening and errors identify field names without printing values. `NODE_ENV=production` is allowed for an optimized local Next.js build; it does not authorize production operation. Root `.env` loads on API startup, web configuration, and the combined dev runner. Existing process environment variables take precedence.

## Verification

```powershell
pnpm.cmd format:check
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test
pnpm.cmd build
Invoke-RestMethod -Uri http://127.0.0.1:3001/health
docker compose -p gametrust-phase01 exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT 1;"'
git diff --check
git status --short --untracked-files=all
```

The HTTP request requires `dev` running in another terminal. The test command builds shared code, runs shared validation and web component tests, and compiles/runs API HTTP/startup tests. Database and contract placeholders claim no tests. Lint and formatting are separate from Next.js build. `pnpm.cmd format` formats source/configuration and documentation; it excludes the authoritative implementation plan and generated files.

For a fresh-copy check, copy the repository's source and lockfile to a disposable directory, excluding `.git`, `.env`, dependency/cache directories and generated outputs. Copy its `.env.example` to `.env`, run frozen install and all checks there, then remove only that disposable directory. No database reset is required.

## Shutdown and troubleshooting

```powershell
docker compose -p gametrust-phase01 down
```

This removes only this Compose project's containers/network and preserves its named volume. Do not add `--volumes` or prune shared Docker resources.

If Docker is unavailable, start Docker Desktop and verify `docker info` and `docker compose version`; report failures instead of calling database acceptance passed. If a port is occupied, stop only your own service or select distinct application ports in `.env`. If the database password is changed after volume creation, PostgreSQL retains its original initialized credentials; do not reset or delete that volume without explicit permission. Missing npm is harmless when the pinned `pnpm.cmd` is available. If native dependency installation fails, inspect the actual error and approved build list in `pnpm-workspace.yaml`; do not blanket-enable lifecycle scripts.

## Phase status

Phase 00 received owner GO on 2026-10-31. Phase 01 received owner GO on 2026-10-31 after manual review and the PowerShell setup follow-up. The owner separately authorized a local commit. Phase 02 has not started. No deployment, real funds, real identities, publisher integration or CI workflow is included.

On Windows, if Ctrl+C displays a batch-job prompt, answer Y to finish shutdown. Next.js automatic agent-rule generation is disabled to preserve the approved repository governance.
