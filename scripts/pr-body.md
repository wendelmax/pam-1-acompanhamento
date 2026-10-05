## 🤖 CI de validação das fases + nota automática

Este PR adiciona um **CI automático** ao projeto que valida as fases do Trabalho em Grupo e **gera a nota atual** a cada rodada. Não muda nada no funcionamento do app.

### O que ele faz

1. **Valida um checklist** baseado nas fases (Fase 1 — estrutura, Fase 2 — AsyncStorage, Fase 3 — SQLite/CRUD).
2. **Calcula a nota** de 0 a 100% e converte em conceito:
   - **I** — Insuficiente (0–25%)
   - **R** — Regular (25–50%)
   - **B** — Bom (50–75%)
   - **MB** — Muito bom (75–100%)
3. **Publica o resultado** em dois lugares:
   - Na aba **Actions** deste repositório (aba "Summary" da rodada), com o checklist completo marcado.
   - Como **artefato** `nota-pam` (conteúdo: `nota.md` e `nota.json`). Cada nova rodada **atualiza a nota atual**.

### Arquivos adicionados

| Arquivo | Função |
|---------|--------|
| `.github/workflows/pam-ci.yml` | Roda a validação a cada push/PR (e manualmente em "Run workflow") |
| `.github/scripts/pam-ci.mjs` | Script que confere cada item do checklist e calcula a nota |
| `.github/pam-ci.config.json` | Configuração do projeto (arquivos de tela, storage, sqlite) |

### Como ver a nota

1. Abra a aba **Actions** → clique na rodada mais recente.
2. No resumo, veja a nota e o checklist com os itens marcados.
3. Ou baixe o artefato **nota-pam** (no final da página da rodada), que também tem `nota.md` e `nota.json`.

> [!TIP]
> Cada vez que fizerem push (ou pedirem novo merge), o CI roda de novo e **atualiza a nota**. Vocês acompanham a evolução da fase 3 até a entrega!

> [!IMPORTANT]
> O CI apenas **avalia** o código — ele não bloqueia merges e não altera o app. Os itens desmarcados no checklist indicam exatamente o que ainda falta para ganhar nota.

### Critérios avaliados (checklist)

**Fase 1 — Estrutura (10 pts):** README do grupo · app principal · dependência `expo` · tela de listagem · dados iniciais · tela de formulário · tela de detalhe · imports sem dependência faltando (o app não quebra ao abrir) · app.json identificando o app · mais de 1 arquivo de tela.

**Fase 2 — AsyncStorage (15 pts):** dependência instalada · import · `getItem`/`setItem` · funções carregar, adicionar, buscar, excluir · formulário com `TextInput` que salva · lista alimentada pelo storage · detalhe buscando dado · exclusão com confirmação `Alert` · seed gravado na 1ª execução · validação de campos.

**Fase 3 — SQLite + CRUD (30 pts):** dependência `expo-sqlite` · import · arquivo de banco · `CREATE TABLE` · `INSERT` · `SELECT` · `UPDATE` · `DELETE` · filtros com `WHERE` · `openDatabaseAsync` · lista/formulário/detalhe ligados ao banco · `async/await` · seed em SQL.

### Como funciona o conceito

Peso por fase: **Fase 1 = 10 pts** (respiração), **Fase 2 = 15 pts** (AsyncStorage), **Fase 3 = 30 pts** (SQLite — o foco da entrega). Total: **55 pts**.

Qualquer dúvida, é só chamar o professor! 🚀