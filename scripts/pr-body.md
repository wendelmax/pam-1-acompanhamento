## 🤖 Atualização do CI: Validação da Fase 4 (Peso 3x) + Testes Funcionais de SQLite

Este PR atualiza o **CI automático de nota** do projeto para incluir a **Fase 4 (Entrega Final)** e os **Testes Funcionais de Execução Real do SQLite**, totalizando **100 pontos**. Não altera nenhuma tela nem o funcionamento do seu app!

### O que mudou nesta atualização

1. **Inclusão da Fase 4 (15 itens × 3 pts = 45 pts — peso 3x):**
   - **SQLite como única fonte de dados (18 pts):** Verifica se o fluxo das telas usa exclusivamente SQLite (sem depender de `AsyncStorage` para dados críticos) e **executa as funções do banco em memória (`node:sqlite`)** testando na prática `CREATE TABLE`, `INSERT INTO`, `SELECT`/`WHERE`, `UPDATE` e `DELETE FROM`.
   - **Recurso do dispositivo (6 pts):** Valida o uso de pelo menos um recurso nativo (`expo-notifications`, `expo-image-picker`, `expo-location`, `expo-camera`, etc.) **ou** justificativa de não uso no `README.md`.
   - **Polish de UX — Aula 18 (12 pts):**
     - **Loading** ao carregar a lista do SQLite (`ActivityIndicator` + estado `loading`/`carregando`).
     - **Empty state** quando não houver registros (mensagem amigável + ícone/emoji/ilustração).
     - **Mensagem de erro amigável** se falhar ao salvar ou carregar (`try/catch` + `Alert`).
   - **Organização e Entrega (9 pts):** Separação em pastas (`screens`/`app`, `database`/`data`, `components`), interface consistente (`FlatList` + `StyleSheet.create`), `.gitignore` sem `node_modules` e `README.md` documentando como testar no Expo Go / APK.
2. **Tabela de nota no `README.md` e `NOTA.md` atualizada para 100 pontos:**
   - **Fase 1** — Estrutura (10 itens × 1 pt = **10 pts** · peso 1x)
   - **Fase 2** — AsyncStorage (15 itens × 1 pt = **15 pts** · peso 1x)
   - **Fase 3** — SQLite + CRUD (15 itens × 2 pts = **30 pts** · peso 2x)
   - **Fase 4** — App Completo: SQLite Exclusivo, UX, Dispositivo e Entrega (15 itens × 3 pts = **45 pts** · peso 3x)
   - **Total:** **100 pontos** (**I**: <25% · **R**: 25–49% · **B**: 50–74% · **MB**: ≥75%)

> [!TIP]
> Assim que vocês fizerem o **Merge** deste PR, a nota atualizada com as 4 fases já fica visível no topo do `README.md` e detalhada item por item no arquivo [`NOTA.md`](NOTA.md)!

Qualquer dúvida sobre algum item do checklist da Fase 4, é só chamar o professor! 🚀
