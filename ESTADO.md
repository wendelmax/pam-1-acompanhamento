# Estado dos grupos (05/10/2026)

Legenda: 🟢 em dia · 🟡 em desenvolvimento · 🔴 travado/precisa de ajuda

Notas medidas pelo **CI de cada repo** (rodada de 05/10/2026). I = Insuficiente (<25%) · R = Regular (25–50%) · B = Bom (50–75%) · MB = Muito bom (≥75%).

| # | Projeto | Grupo | Tema | F1 | F2 | F3 | Nota | Pendências |
|---|---------|-------|------|----|----|----|------|------------|
| 1 | ToDoDev- | FocusIT | Lista de tarefas | 8/10 | 12/15 | **2/30** | **R** 40% (22/55) | F3 praticamente zerada. Issue #3 (SQLite) é o caminho |
| 2 | EDUCAMIRIM | VIISRE | Atividades do Mirim | 10/10 | 15/15 | 28/30 | **MB** 96% (53/55) | Só 2 pts de F3. Quase pronto p/ nota máxima |
| 3 | 3GDStock | 3GD | Estoque de materiais | 8/10 | 10/15 | **4/30** | **R** 40% (22/55) | F2 parcial + F3 zerada. Issues #2 e #3 |
| 4 | TripGo | TripGo | Viagens | 8/10 | 10/15 | **2/30** | **R** 36% (20/55) | F3 zerada. Issue #7 (Fase 3) |
| 5 | equipcontrol | TechControl | Equipamentos | 10/10 | 13/15 | **8/30** | **B** 56% (31/55) | F3 em andamento. Issue #3 |
| 6 | EduSophia | Educa+ | Matérias | 9/10 | 13/15 | **4/30** | **R** 47% (26/55) | F3 zerada. Issue #3 |
| 7 | MEIHub | Babuínos do note.js | Gestão MEI | 8/10 | 10/15 | **2/30** | **R** 36% (20/55) | F2 e F3. Issues #3 e #4 |
| 8 | CDF | Controle Fin. Diário | Lançamentos | 9/10 | 14/15 | 26/30 | **MB** 89% (49/55) | Bem avançado. F3 quase completa |
| 9 | Pet_Match | Zenin's | Adoção de pets | 7/10 | 11/15 | **2/30** | **R** 36% (20/55) | Menor nota: F1 e F3. Issues #4, #5, #7 |
| 10 | F.O.C | F.O.C | Controle financeiro | 8/10 | 13/15 | **4/30** | **R** 45% (25/55) | F3 zerada. Issue #5 |
| 11 | Vamoa- | ref's | Viagens | 9/10 | 15/15 | **2/30** | **R** 47% (26/55) | F2 ✅ (PR #3 mergeado). F3 zerada (issue #4) |
| 12 | Boom-Patch | TRP bentão | Campeonatos | 9/10 | 15/15 | 6/30 | **B** 55% (30/55) | F2 ✅ e rodando. F3 em andamento |

**Resumo:** 2 grupos no MB (EDUCAMIRIM, CDF), 2 no B (equipcontrol, Boom-Patch), 8 no R. Nenhum no I.
A **Fase 3 (30 dos 55 pontos)** é o maior gap: 8 de 12 grupos estão com 4 pts ou menos nela. Onde investirem, a nota sobe muito.

## O que já foi entregue aos grupos

- ✅ Scaffolds de Fases 1/2 prontos em **Vamoa-** e **Boom-Patch** (mergeados pelos grupos).
- ✅ **CI de nota** com badge no `README.md` em **PR em todos os 12 repos** (aguardando merge dos grupos).
- ✅ **Issue de Fase 3** (dicas SQLite por tema) em todos os 12 repos.
- ✅ **Issue de correção** para os que usam AsyncStorage sem a dependência (ToDoDev-, 3GDStock, Pet_Match).

## Pendências que dependem dos grupos

- Merge dos PRs de CI (8 abertos por merge, 4 já com branch atualizada).
- Cada grupo maintainer o próprio PR; o professor revisa e mergeia.