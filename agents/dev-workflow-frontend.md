# Fluxo de Trabalho – Agente Frontend

Este documento define o **fluxo obrigatório** para o **Agente Frontend**. O trabalho de frontend é feito **sempre** no repositório **fitness-coach-frontend** (remote `origin` quando clonado, ou `frontend` se estiver num monorepo). O agente **sempre puxa e envia branch desse repositório**.

---

## Repositório e branch

- **Repositório:** **fitness-coach-frontend** (GitHub).
- **Remote:** ao trabalhar **direto no clone** do frontend: `origin`; ao trabalhar num **monorepo** que tem `app/`: usar `git subtree split --prefix=app` e `git push frontend <branch>:main` para enviar (conforme `agents/git.md`).
- **Branch:** sempre criar e trabalhar a partir da **main** do fitness-coach-frontend: `git checkout main && git pull origin main`, depois `git checkout -b feature/nome-descritivo`.
- O conteúdo na raiz do repo frontend é o app Flutter (`lib/`, `pubspec.yaml`, `web/`, etc.). Não commitar código de backend neste repositório.

---

## Fluxo em sequência (visão geral)

| # | Passo | Referência |
|---|--------|------------|
| 1 | **Abrir nova branch a partir da main** | `git pull origin main` no repo fitness-coach-frontend; criar `feature/nome`. |
| 2 | **Revisar a solução com o Arquiteto** | PRD, refinamento técnico (seção Frontend), contratos (ex.: `docs/backend/contratos-frontend.md` no backend repo ou referência externa). |
| 3 | **Desenvolvimento** | Implementar somente o escopo planejado (telas, providers, modelos Freezed, integração com API). |
| 4 | **Testes da API** | N/A para frontend (API é coberta no repo backend); rodar app e testar fluxos manualmente ou com testes de widget/providers. |
| 5 | **Rodar o app** | `flutter run` ou `flutter run -d chrome`; validar fluxos de auth, onboarding, etc. |
| 6 | **Code review** | Checklist de contratos, arquitetura (Riverpod, Freezed), segurança (JWT em secure storage), UX. |
| 7 | **Chamar o Documentador do Frontend** | Se houve alteração no app: acionar `agents/documentador-frontend.md` com resumo; atualizar `docs/frontend/` e CHANGELOG (quando existirem no repo). |
| 8 | **Commit e Pull Request** | Seguir `agents/git.md`; push para **origin** (fitness-coach-frontend) ou, em monorepo, subtree + push para `frontend`; abrir PR para **main** no repositório **fitness-coach-frontend**. |

Após abertura do PR: revisão; merge somente após aprovação.

---

## Passos obrigatórios (detalhado)

### 1. Alinhamento e branch

- Ler PRD, refinamento (seção Frontend), contratos para o frontend e `agents/frontend.md`.
- Criar branch a partir da **main** do fitness-coach-frontend: `git checkout main && git pull origin main && git checkout -b feature/nome`.

### 2. Implementação e testes locais

- Desenvolver somente o escopo planejado (features, core, shared).
- Garantir que não haja lints/erros: `flutter analyze`; rodar o app e testar fluxos principais.

### 3. Testes (widgets e providers)

- Quando aplicável: testes de providers com `ProviderContainer`, testes de widget com override de providers; cobrir estados (Loading, Data, Error).

### 4. Code review

- Solicitar revisão com checklist: contratos (request/response), arquitetura (Riverpod, Freezed), segurança (JWT, secure storage), NFRs de UX.

### 5. Documentador do Frontend

- Se houve alteração no app (lib/, pubspec, etc.): acionar **Agente Documentador do Frontend** (`agents/documentador-frontend.md`) com:
  ```
  Documentador: atualize a documentação do frontend.
  **O que foi feito:** [resumo]
  **Arquivos/pastas alterados:** [ex.: lib/features/auth/]
  **Requisitos/cenários (opcional):** [ex.: REQ-AUTH-001, Fase 1]
  ```
- Incluir alterações de documentação no commit antes do PR (quando `docs/frontend/` existir no repo).

### 6. Commit e Pull Request

- Ler e seguir **Agente Git** (`agents/git.md`): credenciais, Conventional Commits, **push após commit**.
- Fazer push para **origin** (fitness-coach-frontend) ou, em monorepo, seguir princípio 6 de `agents/git.md` (subtree + push para `frontend`).
- Abrir PR da branch de feature para **main** no repositório **fitness-coach-frontend**.
- Na descrição do PR: PRD, refinamento, REQ-* e SCN-* cobertos, tamanho (~500 linhas máx.).

### 7. Merge

- Somente após aprovação, fazer merge na **main** do fitness-coach-frontend.

---

## Regras adicionais

- Tamanho máximo de PR: ~500 linhas (adições + remoções).
- Não mesclar na main sem PR e sem review.
- Alterações de contratos (OpenAPI, modelos Freezed definidos pelo Arquiteto): abrir tarefa para o Arquiteto e aguardar artefatos.
