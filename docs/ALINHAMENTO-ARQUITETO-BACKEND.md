# Alinhamento Arquiteto ↔ Backend (prioridades e execução)

Documento que registra o **acordo entre o Agente Arquiteto** (`agents/arquiteto-software.md`) e o **Agente Backend** (`agents/backend.md`) a partir do code review do commit Auth (signup/login), e o que foi priorizado e executado.

---

## 1. O que o Arquiteto prioriza

- **Governança determinística:** qualquer decisão que afete contratos ou dependências deve estar em ADR ou AGENTS.md.
- **Contratos imutáveis:** controllers retornam DTOs de resposta tipados (DTO → service → DTO).
- **Prevenção de alucinações:** omissões (ex.: “@types podem?” ou “Argon2id 200–500 ms como validar?”) são resolvidas pelo Arquiteto e registradas.
- **Controller enxuto:** apenas orquestração; lógica de infra (ex.: extração de IP) em helper/core, não inline no controller.

---

## 2. O que o Backend prioriza

- Implementar estritamente o PRD e o refinamento; não adicionar libs de runtime sem ADR.
- Garantir NFRs (Argon2id, JWT, força bruta) com código documentado e rastreável.
- Manter controller sem regra de negócio e com retornos tipados (LoginResponseDto).

---

## 3. Discussão e prioridades acordadas

| Ponto | Arquiteto | Backend | Decisão |
|-------|-----------|---------|---------|
| **@types/express** | “Agentes não adicionam libs sem ADR.” | Precisamos de tipos para `Request` do Express (NestJS). | **ADR-001:** `@types/*` apenas tipagem, para deps já aprovadas, não exigem ADR por pacote. |
| **NFR-SEC-001 (Argon2id 200–500 ms)** | “Registrar e não delegar.” | Parâmetros já configurados; falta referência no código. | **ADR-001 + código:** Comentário no AuthService referenciando NFR-SEC-001 e ADR; validar tempo em pipeline/deploy. |
| **Retorno do login** | “Controller retorna DTO de resposta.” | LoginResponseDto existe mas não era usado como tipo. | **Backend:** Tipar retorno de `login()` com `Promise<LoginResponseDto>`. |
| **Extração de IP no controller** | “Controller só orquestra.” | IP é infra para rate limit, não regra de negócio. | **Backend:** Extrair para `core/utils/request.util.ts` (`getClientIp(req)`); controller chama helper. |

---

## 4. O que foi executado

1. **ADR-001** criado em `docs/adr/ADR-001-dependencias-tipos-e-argon2.md`:
   - Pacotes `@types/*` (só tipagem) para dependências já aprovadas: permitido sem ADR por lib.
   - Argon2id: baseline registrado; NFR-SEC-001 deve ser validado em ambiente de referência.

2. **Backend:**
   - `auth.controller.ts`: retorno de `login()` tipado como `Promise<LoginResponseDto>`; extração de IP substituída por `getClientIp(req)`.
   - `core/utils/request.util.ts`: criado helper `getClientIp(req: Request)`.
   - `auth.service.ts`: comentário NFR-SEC-001 acima do `argon2.hash(...)` com referência ao ADR-001.

---

## 5. Referências

- **Arquiteto:** `agents/arquiteto-software.md` (governança, ADRs, contratos).
- **Backend:** `agents/backend.md` (implementação, DTOs, NFRs).
- **Decisões:** `docs/adr/ADR-001-dependencias-tipos-e-argon2.md`.
