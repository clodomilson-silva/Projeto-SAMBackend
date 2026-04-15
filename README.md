# SAM Backend (estrutura inicial)

Backend inicial em Node.js com NestJS e PostgreSQL, preparado para evoluir por microservicos:

- `sam-gateway`: roteamento de entrada para os servicos internos
- `sam-auth-service`: autenticacao com JWT
- `sam-user-service`: usuarios e perfis
- `sam-request-service`: solicitacoes de atendimento
- `sam-appointment-service`: atendimentos/agendamentos

## Requisitos

- Node.js 20+
- Docker e Docker Compose

## 1) Subir banco PostgreSQL

```bash
docker compose up -d
```

## 2) Instalar dependencias do workspace

```bash
npm install
```

## 3) Criar `.env` em cada servico

Use os arquivos `.env.example` como base.

## 4) Gerar Prisma Client nos servicos com banco

```bash
npm --workspace sam-user-service run prisma:generate
npm --workspace sam-request-service run prisma:generate
npm --workspace sam-appointment-service run prisma:generate
```

## 5) Subir servicos

```bash
npm run start:auth
npm run start:users
npm run start:requests
npm run start:appointments
npm run start:gateway
```

## Rotas base via Gateway

- `POST /sam/auth/login`
- `POST /sam/users`
- `GET /sam/users`
- `POST /sam/requests`
- `GET /sam/requests`
- `PATCH /sam/requests/:id/status`
- `POST /sam/appointments`
- `GET /sam/appointments`
- `PATCH /sam/appointments/:id/status`

## Modelo de dados inicial (requisitos)

- **Usuarios e acesso (`sam-user-service`)**
- `users`: administrador, psicologa educacional, supervisao e gestao
- `auth_sessions`: controle de sessoes para autenticacao/refresh token
- `attendance_notes`: anotacoes de atendimento vinculadas a usuario e solicitacao

- **Solicitacoes (`sam-request-service`)**
- `requests`: protocolo da solicitacao, aluno, prioridade, status e conclusao
- status principais: `PENDENTE`, `EM_ANALISE`, `EM_ATENDIMENTO`, `CONCLUIDA`

- **Atendimentos e dossies (`sam-appointment-service`)**
- `appointments`: agendamentos e status do atendimento
- `dossiers`: dossie principal por solicitacao
- `dossier_records`: historico descritivo e opcoes selecionadas pela psicologa

## Proximos passos sugeridos

- Adicionar migrations Prisma por servico
- Implementar RBAC no gateway e servicos
- Criar testes unitarios e e2e
- Adicionar observabilidade (logs, tracing, metrics)
