# Próximos passos – Épico 1 (dev-workflow + docs/backend + PRD + refinamento)

**Referências:** `agents/dev-workflow.md`, `docs/backend/README.md`, `PRD/prd-001-auth-onboarding-metas.md`, `refinamentos técnicos/refinamento-tecnico-001-auth-onboarding-metas.md`, `docs/backend/PLANO-ACAO-BACKEND-EPICO1.md`.

---

## 1. Onde estamos no fluxo (dev-workflow)

| Passo | Status | Observação |
|-------|--------|------------|
| 1–8  | ✅ Concluídos para os PRs já mergeados | Auth (signup, login, forgot-password, reset-password), Onboarding (profile, goals, training-preferences), Plans (POST /plans/weekly), treino semanal (SCN-TRAIN-ROTINA-MAQUINAS), code review, Documentador, commit, push. |
| 9–10 | ✅ Vários PRs já mergeados na **main** | feature/auth-forgot-password, feature/onboarding-training-preferences, feature/plan-weekly-training já na main. |
| **Testes e2e** | ✅ Em execução / concluídos | Branch `feature/backend-e2e-scn`: testes SCN-AUTH-BLOQUEIO-FALHAS, SCN-ONB-BIOTIPO-VISUAL, SCN-GOAL-METAS-MEDIUM, SCN-TRAIN-ROTINA-MAQUINAS. Ver `docs/backend/PLANO-ACAO-BACKEND-EPICO1.md`. |

---

## 2. Estado atual do backend (docs/backend)

- **Implementado (main):**
  - **Auth:** signup, login, **forgot-password**, **reset-password** (REQ-AUTH-003), JWT, Argon2id, força bruta 5→429 (REQ-AUTH-002).
  - **Onboarding:** PUT profile (com body_fat_visual_id → body_fat_percentage), PUT goals (validação 1,5%/semana), **PUT training-preferences** (DD-ENT-TRAININGPREFERENCE, machines_only).
  - **Plans:** POST /plans/weekly com motor de metas, GCT, déficit, TACO, estrutura de treino semanal (`summary.weekly_training`, `summary.machines_only`), seed TACO.
- **Testes e2e:** Implementados em `backend/test/*.e2e-spec.ts` para os quatro cenários BDD (ver plano de ação). Rodar com `npm run test:e2e` (exige DATABASE_URL).
- **Pendente (opcional):** DD-ENT-SPORTPREFERENCE (preferências de esportes); depende de decisão Arquiteto/PM para Épico 1.

---

## 3. O que falta no Épico 1 (PRD + refinamento)

| Item | Status |
|------|--------|
| **Estrutura de treino semanal (SCN-TRAIN-ROTINA-MAQUINAS)** | ✅ Feito (main). |
| **Preferências de treino (DD-ENT-TRAININGPREFERENCE)** | ✅ Feito (main): PUT /onboarding/training-preferences, machines_only, uso no PlanService. |
| **Recuperação de senha (REQ-AUTH-003)** | ✅ Feito (main): POST forgot-password, POST reset-password. |
| **Testes e2e dos SCN-*** | ✅ Implementados em branch feature/backend-e2e-scn (auth bloqueio, biotipo visual, goals 200/422, plans weekly 201/422). |
| **DD-ENT-SPORTPREFERENCE** | ⏳ Opcional; aguardar decisão Arquiteto/PM. |

---

## 4. Ordem sugerida para “seguir”

1. **Ciclo atual (testes e2e):** Revisão e merge do PR **feature/backend-e2e-scn** (passos 9–10 do dev-workflow). Garantir que `npm run test:e2e` passa com DATABASE_URL configurado.
2. **Depois:** Manter documentação em `docs/backend/` atualizada (Documentador no passo 7). Se for definido escopo para DD-ENT-SPORTPREFERENCE no Épico 1, abrir nova branch e seguir o fluxo.

---

## 5. Resumo

- **Agora:** Testes e2e dos cenários BDD implementados; concluir commit, push e PR da branch **feature/backend-e2e-scn**; revisão Arquiteto + PM e merge.
- **Depois:** Opcional DD-ENT-SPORTPREFERENCE conforme decisão do Arquiteto/PM.

A documentação em `docs/backend/` (README, api-endpoints, contratos-frontend) deve ser atualizada pelo **Documentador** a cada alteração no backend (passo 7 do fluxo).
