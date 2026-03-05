# Plano de Ação – Backend Épico 1

**Referências:** `agents/backend.md`, `agents/dev-workflow.md`, `PRD/prd-001-auth-onboarding-metas.md`, `refinamentos técnicos/refinamento-tecnico-001-auth-onboarding-metas.md`, `AGENTS.md`.

---

## 1. Objetivo

Concluir o Épico 1 no backend com **testes e2e** que cubram os cenários BDD (SCN-*) e manter a documentação de próximos passos atualizada.

---

## 2. Estado atual (main)

- **Auth:** signup, login, forgot-password, reset-password; força bruta 5 tentativas → 429 por 15 min (REQ-AUTH-002).
- **Onboarding:** PUT profile (com body_fat_visual_id → body_fat_percentage), PUT goals (validação 1,5%/semana), PUT training-preferences (machines_only).
- **Plan:** POST /plans/weekly (motor de metas, TACO, treino semanal, preferência machines_only).
- **Schema:** Tenant, User, UserProfile, BodyCompositionGoal, WeeklyPlan, Food, AuthSession, PasswordResetToken, TrainingPreference.

---

## 3. Plano de execução

| # | Ação | Critério de conclusão |
|---|------|------------------------|
| 1 | **Documentar este plano** | Arquivo `docs/backend/PLANO-ACAO-BACKEND-EPICO1.md` criado e referenciado. |
| 2 | **Criar infraestrutura e2e** | Pasta `backend/test/`, `jest-e2e.json`, módulo de teste que sobe a API (NestJS TestingModule + supertest). |
| 3 | **E2E SCN-AUTH-BLOQUEIO-FALHAS** | Teste: 5 logins inválidos (mesmo IP+email) → 6ª requisição retorna HTTP 429; mensagem de bloqueio 15 min. |
| 4 | **E2E SCN-ONB-BIOTIPO-VISUAL** | Teste: PUT profile com `body_fat_visual_id` (ex.: "25") → backend persiste valor numérico em `body_fat_percentage` (verificação via Prisma no teste). |
| 5 | **E2E SCN-GOAL-METAS-MEDIUM** | Teste: PUT goals com meta válida (taxa ≤ 1,5%/semana) → 200; com meta insegura → 422 e mensagem adequada. |
| 6 | **E2E SCN-TRAIN-ROTINA-MAQUINAS** | Teste: onboarding completo + PUT training-preferences (machines_only: true) + POST /plans/weekly → 201; body com `summary.weekly_training` e `summary.machines_only`; estrutura de dias (descanso segunda, treino pernas quinta/domingo, upper sábado, etc.). |
| 7 | **Atualizar PROXIMOS-PASSOS-epico1.md** | Refletir que auth (forgot/reset), preferências de treino e plano semanal estão na main; próximos passos = testes e2e e opcional DD-ENT-SPORTPREFERENCE. |
| 8 | **Commit e push** | Branch `feature/backend-e2e-scn` (ou similar); seguir `agents/git.md` (commit + push). |

---

## 4. Ordem de execução

1. Documentar plano (este arquivo).
2. Infraestrutura e2e (config Jest, app de teste, helpers).
3. Implementar os quatro testes e2e na ordem: Auth bloqueio → Onboarding biotipo → Goals → Plans weekly.
4. Atualizar PROXIMOS-PASSOS-epico1.md.
5. Rodar `npm run test:e2e` e garantir que todos passam (exige `DATABASE_URL` em `backend/.env` ou no ambiente).
6. Commit + push conforme dev-workflow.

---

## 5. Opcional (fora deste plano)

- **DD-ENT-SPORTPREFERENCE:** modelo e endpoints para preferências de esportes (natação, corrida, etc.); depende de decisão Arquiteto/PM para Épico 1.

---

*Documento criado para execução fervorosa do plano de ação backend Épico 1.*
