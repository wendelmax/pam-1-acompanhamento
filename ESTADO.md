# Estado dos grupos (19/10/2026)

Legenda: 🟢 em dia · 🟡 em desenvolvimento · 🔴 travado/precisa de ajuda

Notas medidas pelo **CI de cada repo** (rodada de 19/10/2026, `main` de cada um). I = Insuficiente (<25%) · R = Regular (25–50%) · B = Bom (50–75%) · MB = Muito bom (≥75%).

| # | Projeto | Grupo | Tema | F1 | F2 | F3 | Nota | PR | Pendências |
|---|---------|-------|------|----|----|----|------|------------|
| 1 | ToDoDev- | FocusIT | Lista de tarefas | 8/10 | 10/15 | 24/30 | **MB** 76% (42/55) | aberto #5 | 🔴 **`package.json` foi sobrescrito pelo `package-lock.json` em 18/10** — perdeu `dependencies`/`main`/`scripts`. Custou 7 pts hoje |
| 2 | EDUCAMIRIM | VIISRE | Atividades do Mirim | 10/10 | 15/15 | 28/30 | **MB** 96% (53/55) | ✅ #5 | Só 2 pts de F3. Nota máxima ao alcance |
| 3 | 3GDStock | 3GD | Estoque de materiais | 8/10 | 10/15 | **4/30** | **R** 40% (22/55) | aberto #5 | F3 ainda baixa. Issues #2 e #3 |
| 4 | TripGo | TripGo | Viagens | 10/10 | 13/15 | **2/30** | **R** 45% (25/55) | ✅ #8 | F1 e F2 hoje prontos; F3 zerada (issue #7) |
| 5 | equipcontrol | TechControl | Equipamentos | 10/10 | 13/15 | 8/30 | **B** 56% (31/55) | aberto #5 | F3 em andamento (issue #3) |
| 6 | EduSophia | Educa+ | Matérias | 9/10 | 13/15 | **4/30** | **R** 47% (26/55) | ✅ #4 | F3 ainda baixa (issue #3) |
| 7 | MEIHub | Babuínos do note.js | Gestão MEI | 8/10 | 12/15 | 24/30 | **MB** 80% (44/55) | ✅ #6 | **Subiu de R 36% p/ MB 80%** com o SQLite de 19/10 |
| 8 | CDF | Controle Fin. Diário | Lançamentos | 9/10 | 14/15 | 26/30 | **MB** 89% (49/55) | ✅ #5 | F3 quase completa |
| 9 | Pet_Match | Zenin's | Adoção de pets | 7/10 | 12/15 | **2/30** | **R** 38% (21/55) | ✅ #8 | Menor nota da turma: F1 e F3 (issues #4, #5, #7) |
| 10 | F.O.C | F.O.C | Controle financeiro | 8/10 | 13/15 | **4/30** | **R** 45% (25/55) | ✅ #6 | F3 ainda baixa (issue #5) |
| 11 | Vamoa- | ref's | Viagens | 9/10 | 15/15 | **2/30** | **R** 47% (26/55) | ✅ #7 | F2 completa; F3 zerada (issue #4) |
| 12 | Boom-Patch | TRP bentão | Campeonatos | 9/10 | 15/15 | 6/30 | **B** 55% (30/55) | ✅ #9 | F2 completa; F3 em andamento (issue #5) |

**Resumo:** **4 MB** (EDUCAMIRIM 96, CDF 89, MEIHub 80, ToDoDev- 76) · **2 B** (equipcontrol 56, Boom-Patch 55) · **6 R** (EduSophia 47, Vamoa- 47, F.O.C 45, TripGo 45, 3GDStock 40, Pet_Match 38) · **0 I**.
Média da turma: **59,7%** (32,8/55, somando 394 de 660 pontos disponíveis). A Fase 3 (30 dos 55 pontos) continua sendo o maior gap: **6 de 12 grupos** têm 4 pts ou menos nela.

## O que mudou desde a rodada anterior (05/10 → 19/10)

- **MEIHub**: R 36% → **MB 80%** (+24 pts) — implementou SQLite em 19/10 17:12. O CI já publicou a nota sozinho (commit do bot às 20:12).
- **ToDoDev-**: R 40% → **MB 76%** (+20 pts) — refatorou as telas com SQLite em 18/10. **Mas** o mesmo commit sobrescreveu o `package.json`, que hoje custa 7 pts e impede a instalação das dependências.
- **TripGo**: 36% → 45% — F1 e F2 completas (10/10 e 13/15); F3 ainda zerada.
- **Pet_Match**: 36% → 38% (+1 pt).
- **PRs da nota visível**: de 6 abertos para **3** — Educação: 9 de 12 grupos já mergearam (badge + `NOTA.md` no `main`).

## O que já foi entregue aos grupos

- ✅ Scaffolds de Fases 1/2 prontos em **Vamoa-** e **Boom-Patch** (mergeados).
- ✅ **CI de nota** (validação das fases) mergeada nos **12** repos — todos com runs `success`, **zero falhas**.
- ✅ **Nota visível** (badge no `README.md` + `NOTA.md`) mergeada em **9** repos.
- ✅ **Issue de Fase 3** (dicas SQLite por tema) em todos os 12 repos.
- ✅ **Issue de correção** para os que usam AsyncStorage sem a dependência (ToDoDev-, 3GDStock, Pet_Match).

## Pendências que dependem dos grupos

- Merge dos PRs da nota visível: **ToDoDev- #5**, **3GDStock #5**, **equipcontrol #5** (os 3 restantes).
- **ToDoDev-**: corrigir o `package.json` (restaurar o manifest válido; o atual é o lockfile).
- 6 grupos com Fase 3 praticamente zerada: F1 e F2 já estão suficientes, o ganho está em instalar e usar o SQLite.
