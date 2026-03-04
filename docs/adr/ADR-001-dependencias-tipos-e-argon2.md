# ADR-001: Dependências de tipagem (@types) e parâmetros Argon2id (NFR-SEC-001)

**Status:** Aceito  
**Decisores:** Arquiteto (governança) + Backend (implementação)  
**Data:** 2026-03-04  
**Contexto:** Code review do commit Auth (signup/login) levantou: (1) uso de `@types/express` sem ADR; (2) parâmetros Argon2id sem validação explícita do NFR (tempo de hash 200–500 ms).

---

## Decisão (Arquiteto, alinhada ao Backend)

### 1. Dependências exclusivamente de tipagem (`@types/*`)

- **Regra:** Pacotes **somente de tipagem** (`@types/*`, devDependencies) usados para tipar **dependências já aprovadas** (ex.: Express, usado pelo NestJS) **não** exigem ADR individual.
- O Backend pode adicionar `@types/express`, `@types/node`, etc., desde que a dependência de runtime correspondente já conste no manifesto/ADR (ex.: NestJS/Express).
- Qualquer **nova dependência de runtime** (npm package que entra em `dependencies`) continua exigindo ADR ou atualização do Arquiteto.

### 2. Parâmetros Argon2id (NFR-SEC-001)

- O NFR exige tempo de hash entre **200–500 ms** em hardware de referência.
- **Decisão:** Os parâmetros atuais (`argon2id`, `memoryCost: 65536`, `timeCost: 2`) ficam registrados como **baseline**. O Backend deve:
  - documentar no código (comentário) a referência ao NFR-SEC-001;
  - em pipeline de build ou documento de deploy, recomendar validação do tempo de hash em ambiente de referência; se estiver fora da faixa, ajustar `memoryCost`/`timeCost` e atualizar este ADR.

---

## Consequências

- Backend pode manter e adicionar `@types/*` para libs já aprovadas sem novo ADR por pacote.
- Contrato de segurança (Argon2id) permanece; responsabilidade de validar o NFR fica explícita no código e no processo.
