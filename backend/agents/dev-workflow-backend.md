# Fluxo de Trabalho – Agente Backend

Este documento define o **fluxo obrigatório** para o **Agente Backend**. O trabalho de backend é feito **sempre** no repositório **fitness-coach** (remote `origin`). O agente **sempre puxa e envia branch desse repositório**.

---

## Repositório e branch

- **Repositório:** **fitness-coach** (GitHub).
- **Remote:** `origin` (não usar `frontend`).
- **Branch:** sempre criar e trabalhar a partir da **main** do fitness-coach: `git checkout main && git pull origin main`, depois `git checkout -b feature/nome-descritivo`.
- Nunca commitar código de frontend (`app/`) neste repositório; manter apenas `backend/`, `docker-compose.yml`, `README.md` e `agents/` (comum na raiz, exclusivos em `backend/agents/`).

---

## Fluxo em sequência (visão geral)

| # | Passo | Referência |
|---|--------|------------|
| 1 | **Abrir nova branch a partir da main** | `git pull origin main` no repo fitness-coach; criar `feature/nome`. |
| 2 | **Revisar a solução com o Arquiteto** | PRD, refinamento técnico (seção Backend), contratos OpenAPI e Prisma. |
| 3 | **Desenvolvimento** | Implementar somente o escopo planejado em `backend/` (controllers, services, DTOs, schema se aplicável). |
| 4 | **Criar/atualizar testes da API** | Postman ou e2e em `backend/test/`; cobrir novos endpoints e cenários (ex.: 422). |
| 5 | **Rodar os testes** | `cd backend && npm run test` e, se houver, testes e2e; garantir que passem. |
| 6 | **Code review** | Checklist de contratos, arquitetura, segurança, multi-tenancy, build e start. |
| 7 | **Chamar o Documentador do Backend** | Se houve alteração em `backend/`: acionar `backend/agents/documentador-backend.md` com resumo; atualizar `docs/backend/` e CHANGELOG (quando existirem no repo). |
| 8 | **Commit e Pull Request** | Seguir `agents/git.md` (credenciais, Conventional Commits, push após commit); abrir PR para **main** no repositório **fitness-coach**. |

Após abertura do PR: revisão; merge somente após aprovação.

---

## Passos obrigatórios (detalhado)

### 1. Alinhamento e branch

- Ler PRD, refinamento (seção Backend), OpenAPI, Prisma Schema e `backend/agents/backend.md`.
- Criar branch a partir da **main** do fitness-coach: `git checkout main && git pull origin main && git checkout -b feature/nome`.

### 2. Implementação e testes locais

- Desenvolver somente o escopo planejado em `backend/`.
- Garantir build e subida: `cd backend && npm run build && npm run start:dev` (e banco disponível, ex.: `docker compose up -d` na raiz).

### 3. Testes (Postman e/ou e2e)

- Criar ou atualizar testes (collection Postman em `docs/postman/` se existir, ou e2e em `backend/test/`).
- Rodar e garantir que todos passem.

### 4. Code review

- Solicitar revisão com checklist: contratos, arquitetura, multi-tenancy, segurança, dependências (ex.: Prisma 7).

### 5. Documentador do Backend

- Se houve alteração em `backend/` ou `backend/prisma/`: acionar **Agente Documentador do Backend** (`backend/agents/documentador-backend.md`) com:
  ```
  Documentador: atualize a documentação do backend.
  **O que foi feito:** [resumo]
  **Arquivos/módulos alterados:** [ex.: backend/src/modules/auth/]
  **Requisitos/cenários (opcional):** [ex.: REQ-AUTH-001]
  ```
- Incluir alterações de documentação no commit antes do PR (quando `docs/backend/` existir no repo).

### 6. Commit e Pull Request

- Ler e seguir **Agente Git** (`agents/git.md`): credenciais, Conventional Commits, **push após commit**.
- Fazer push para **origin** (fitness-coach); abrir PR da branch de feature para **main**.
- Na descrição do PR: PRD, refinamento, REQ-* e SCN-* cobertos, tamanho (~500 linhas máx.).

### 7. Merge

- Somente após aprovação, fazer merge na **main** do fitness-coach.

---

## Regras adicionais

- Tamanho máximo de PR: ~500 linhas (adições + remoções).
- Não mesclar na main sem PR e sem review.
- Alterações de contratos globais (OpenAPI, Prisma, ADRs): abrir tarefa para o Arquiteto e aguardar artefatos.
