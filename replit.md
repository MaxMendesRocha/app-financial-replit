# Finance Copilot

Um copiloto financeiro doméstico que transforma movimentações, orçamento e metas em uma visão clara do que está acontecendo e do próximo passo.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/finance-copilot/src/App.tsx` — shell responsivo, dashboard e telas do MVP.
- `artifacts/finance-copilot/src/index.css` — tokens visuais, tema claro/escuro e animações.
- `artifacts/api-server/src/routes/finance.ts` — API do núcleo financeiro, cálculo de resumo e seed demo.
- `lib/api-spec/openapi.yaml` — contrato único da API; hooks e schemas são gerados a partir dele.
- `lib/db/src/schema/finance.ts` — tabelas Drizzle de contas, categorias, movimentações, metas, orçamento e cartões.

## Architecture decisions

- O backend é a fonte dos cálculos financeiros; o frontend consome hooks tipados gerados pelo contrato OpenAPI.
- O primeiro incremento usa um perfil demo persistido no PostgreSQL para manter o painel útil sem exigir autenticação antes do núcleo financeiro.
- Resumos e análises rápidas ficam em endpoints agregados para evitar enviar o banco inteiro ao cliente.
- O produto usa BRL e localização pt-BR desde a primeira experiência para refletir seu público doméstico brasileiro.

## Product

O MVP oferece uma visão geral com patrimônio líquido, saldo disponível, saúde financeira, fluxo de caixa e atividade recente. Também inclui rotas para movimentações com busca/filtro e criação, contas, metas, orçamento, cartões, inteligência financeira e configurações.

## User preferences

O prompt mestre do produto está preservado em `attached_assets/prompt_app_gestao_financeira_ia_1788396638145.md`.

## Gotchas

- Depois de alterar `lib/api-spec/openapi.yaml`, rode o codegen antes de usar hooks ou schemas novos.
- Alterações no schema Drizzle exigem `pnpm --filter @workspace/db run push` no banco de desenvolvimento.
- O servidor usa o caminho `/api`; o frontend acessa a API por URLs relativas ao proxy do artefato.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
