# PAM I — Acompanhamento (ETEC Bento Quirino)

Repositório de **controle e acompanhamento** do Trabalho em Grupo da disciplina **PAM I — Programação de Aplicativos Móveis I** (React Native + SQLite), do professor **Jackson Sá**.

Este repositório **não é um app**. É o "mapa" do acompanhamento: onde cada grupo está, o que já foi feito, quais PRs/issues abrir, como a automação de CI/nota funciona e como retomar o trabalho de onde parou.

> Objetivo pedagógico: automatizar o feedback. O CI de cada grupo valida as fases e gera a **nota atual** a cada rodada, para o grupo ver exatamente o que falta.

## Quick start

- [Status dos 12 grupos](ESTADO.md) — tabela com fase atual, nota aproximada e pendências.
- [Contexto e instruções para a IA](CONTEXTO-IA.md) — **leia isto primeiro** se for continuar o acompanhamento.
- [Links](LINKS.md) — todos os repos, forks, PRs e issues.
- [Automação de nota (CI)](AUTOMACAO-NOTA.md) — como o CI calcula a nota e como ajustar os critérios.
- [`scripts/`](scripts/) — cópia versionada de tudo que é injetado nos repos dos grupos (`pam-ci.mjs`, configs por projeto, corpo do PR).

## Os 12 grupos

| # | Projeto | Grupo | Tema |
|---|---------|-------|------|
| 1 | ToDoDev- | FocusIT | Lista de tarefas |
| 2 | EDUCAMIRIM | VIISRE | Atividades do Mirim |
| 3 | 3GDStock | 3GD | Estoque de materiais de construção |
| 4 | TripGo | TripGo | Viagens |
| 5 | equipcontrol | TechControl | Equipamentos |
| 6 | EduSophia | Educa+ | Matérias de estudo |
| 7 | MEIHub | Babuínos do note.js | Gestão MEI (clientes/serviços/agendamentos) |
| 8 | CDF | Controle Financeiro Diário | Lançamentos financeiros |
| 9 | Pet_Match | Zenin's | Adoção de pets |
| 10 | F.O.C | F.O.C | Controle financeiro |
| 11 | Vamoa- | ref's | Viagens |
| 12 | Boom-Patch | TRP bentão | Campeonatos |

## Estado resumido (28–29/09/2026)

- **Todos os 12 repos** já estão com o **CI de nota** aberto via PR (pendente de merge pelos grupos).
- **Vamoa-**, **Boom-Patch** e **CDF** já mesclaram o material de Fases 1/2 do professor.
- **EDUCAMIRIM** é o mais adiantado (Fase 3 com SQLite praticamente pronta).
- Grupos que usam AsyncStorage **sem a dependência** no `package.json` (o app quebra ao abrir): **ToDoDev-**, **3GDStock**, **Pet_Match** — há issue aberta para cada.