# Estado dos grupos (28–29/09/2026)

Legenda: 🟢 em dia · 🟡 em desenvolvimento · 🔴 travado/precisa de ajuda

| # | Projeto | Grupo | Tema | Fase atual | Nota CI aprox. | Pendências |
|---|---------|-------|------|------------|----------------|------------|
| 1 | ToDoDev- | FocusIT | Lista de tarefas | F2 (AsyncStorage) | ~R | Faltam: instalação da dependência async-storage (issue #2); F3 SQLite (issue #3) |
| 2 | EDUCAMIRIM | VIISRE | Atividades do Mirim | **F3 (SQLite)** | ~MB | Mais adiantado. Revisar F3 (issue #3 aberta como guia) |
| 3 | 3GDStock | 3GD | Estoque de materiais | F2 | ~R | Dependência async-storage ausente (issue #2); F3 (issue #3) |
| 4 | TripGo | TripGo | Viagens | F2 | ~B | F3 (issue #7). Issue #1 (design) do próprio grupo |
| 5 | equipcontrol | TechControl | Equipamentos | F2 | ~B | F3 (issue #3) |
| 6 | EduSophia | Educa+ | Matérias | F2 | ~B | F3 (issue #3) |
| 7 | MEIHub | Babuínos do note.js | Gestão MEI | F1→F2 | ~R | Falta concluir F2 (issue #3 do professor); F3 (issue #4) |
| 8 | CDF | Controle Fin. Diário | Lançamentos | F2 | ~B | F3 (issue #3) |
| 9 | Pet_Match | Zenin's | Adoção de pets | F1 (parcial) | ~R | Dependência ausente + lista não carrega (issue #7); F2 (issue #4); F3 (issue #5) |
| 10 | F.O.C | F.O.C | Controle financeiro | F2 (parcial) | ~R | Falta finalizar persistência (issue #4); F3 (issue #5) |
| 11 | Vamoa- | ref's | Viagens | F2 ✅ (PR #3 mergeado) | ~B | F3 (issue #4). Issue #5 já resolvida pelo merge |
| 12 | Boom-Patch | TRP bentão | Campeonatos | F2 ✅ (PR #4 mergeado) | ~B | F3 (issue #5). CI já mergeado e rodando |

> As "notas CI aprox." são uma leitura qualitativa do checklist na data acima — **a fonte oficial é o CI de cada repo** (artefato `nota-pam`). As Fases 1/2 já dão a base; a **Fase 3 (30 dos 55 pontos)** é o que mais move a nota agora.

## O que já foi entregue aos grupos

- ✅ Scaffolds de Fases 1/2 prontos em **Vamoa-** e **Boom-Patch** (mesclados pelos grupos).
- ✅ **CI de nota** em PR em todos os 12 repos (aguardando merge dos grupos, exceto Boom-Patch já mergeou).
- ✅ **Issue de Fase 3** (dicas SQLite por tema) em todos os 12 repos.
- ✅ **Issue de correção** para os que usam AsyncStorage sem a dependência (ToDoDev-, 3GDStock, Pet_Match).