# Automação de nota (CI) — "Validando as fases e nota automática"

Injetada via PR em **todos os 12 repos** dos grupos. É o mesmo conteúdo em todos (3 arquivos novos, só mudam os nomes de arquivos/tema na config).

## O que o CI faz

- Roda a cada `push`, em cada `pull_request` e manualmente ("Run workflow").
- Valida um **checklist** derivado das fases:
  - **Fase 1 — Estrutura (10 pts):** README, app principal, `expo`, tela de listagem, dados seed, tela de formulário, tela de detalhe, imports sem dependência faltando, `app.json` nomeado, ≥2 telas.
  - **Fase 2 — AsyncStorage (15 pts):** dependência, import, `getItem`, `setItem`, funções carregar/adicionar/buscar/excluir, formulário com `TextInput` que salva, lista alimentada pelo storage, detalhe buscando, exclusão com `Alert`, seed gravado na 1ª execução, validação de campos.
  - **Fase 3 — SQLite (30 pts):** dependência `expo-sqlite`, import, arquivo de banco, `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`, `WHERE`, `openDatabaseAsync`, lista/form/detalhe ligados ao banco, `async/await`, seed em SQL.
- **Calcula a nota** (55 pts) e a converte:

  | Faixa | Conceito |
  |-------|----------|
  | 0–25% | **I** (Insuficiente) |
  | 25–50% | **R** (Regular) |
  | 50–75% | **B** (Bom) |
  | 75–100% | **MB** (Muito bom) |

- **Gera artefato** `nota-pam` com `nota.md` (relatório legível + badge) e `nota.json` (nota por item, útil p/ automação). **Cada rodada sobrescreve o artefato** → sempre mostra a **nota atual**.
- Publica também o resumo direto na aba **Actions** da rodada.

### Onde o aluno vê a nota (visibilidade)

O artefato, sozinho, ficava escondido (no fim da página da rodada, dentro de um `.zip`, com 0 downloads). Por isso o CI **publica a nota dentro do repositório**, a cada push na `main`:

| Onde | O que aparece |
|---|---|
| **Topo do `README.md`** | Bloco "Nota atual (automática)" com **2 badges** — status do CI e a **nota com conceito e cor** (I vermelho, R laranja, B amarelo, MB verde) — mais a tabela de pontos de cada fase |
| **`NOTA.md`** na raiz | Checklist completo (40 itens) com `[x]`/`[ ]`, mostrando o que falta |
| Aba **Actions** → Summary | Relatório da rodada |
| Artefato `nota-pam` | `nota.md` + `nota.json` (download) |

O bloco do README fica entre `<!-- PAM-CI-NOTA-INICIO -->` e `<!-- PAM-CI-NOTA-FIM -->`. O CI reescreve **só o conteúdo entre os marcadores** — o resto do README do grupo nunca é tocado (verificado que é idempotente: rodar duas vezes não duplica nada).

**Como evitar loop:** o commit automático usa `[skip ci]`, então a publicação não dispara uma nova execução. O passo só roda em `push` na `main` (nos PRs o token é somente-leitura).

**Validação feita:** num repositório de teste, um push que adicionou um módulo SQLite mudou a nota de **56% → 71%** e o badge/README foram atualizados sozinhos pelo CI.

## Arquivos injetados (copia versionada em [`scripts/`](scripts/))

| Arquivo | Papel |
|---|---|
| `pam-ci.mjs` | Script de validação (Node puro, sem deps). Lê a config, varre o código, preenche o checklist, calcula a nota e escreve `nota.md` + `nota.json`. |
| `publicar-nota.mjs` | Publica a nota no repositório: escreve o bloco com badges no `README.md` (entre marcadores) e gera o `NOTA.md`. |
| `pam-ci.yml` | Workflow (checkout → roda o script → publica resumo → sobe artefato → escreve no README/NOTA.md → commit `[skip ci]`). Precisa de `permissions: contents: write`. |
| `pam-ci.config.json` | **Por projeto:** `grupo`, `raiz`, e os caminhos de `principal`, `lista`, `form`, `detalhe`, `dados[]`, `storage`, `sqlite`. É o único que muda entre os grupos. |
| `pr-body.md` | Corpo padrão do PR (explicação ao grupo). |

## Como o script acha as telas (por config, não adivinhando)

O `pam-ci.config.json` diz onde está cada peça do app. Exemplo (Vamoa-, que usa `App.js` único com navegação por estado):

```json
{
  "grupo": "ref's (viagens)",
  "principal": "App.js",
  "lista": "App.js",
  "form": "App.js",
  "detalhe": "App.js",
  "dados": ["data/viagens.js"],
  "storage": "lib/storage.js",
  "sqlite": ""
}
```

Assim o CI funciona tanto em projetos com `App.js` + `screens/` (ToDoDev-, 3GDStock, EDUCAMIRIM, equipcontrol), quanto em `src/app/` expo-router (EduSophia, CDF, F.O.C, Pet_Match, Boom-Patch), quanto em `app/` (TripGo).

## Testar localmente (sem GitHub Actions)

```bash
# na raiz do repo do grupo (com os 3 arquivos no lugar):
node .github/scripts/pam-ci.mjs
# imprime o relatório e salva nota.md + nota.json
```

## Reinjetar / atualizar o CI nos repos (após editar o script)

O fluxo que gerou os PRs (todos os repos, com branch `ci/pam-nota`):

```bash
# 1) clonar o repo DO GRUPO (base no main atual deles, não no fork)
gh repo clone <owner>/<repo> repos/<repo> -- --depth=1
# 2) copiar os arquivos e a config
cp scripts/pam-ci.yml    repos/<repo>/.github/workflows/pam-ci.yml
cp scripts/pam-ci.mjs    repos/<repo>/.github/scripts/pam-ci.mjs
cp scripts/configs/<Repo>.json repos/<repo>/.github/pam-ci.config.json
# 3) branch + commit (identidade do professor) + force-push no fork
cd repos/<repo>
git -c user.email="jackson.sa@cps.sp.gov.br" -c user.name="Jackson Sá" checkout -b ci/pam-nota
git add -A
git -c user.email="jackson.sa@cps.sp.gov.br" -c user.name="Jackson Sá" commit -m "ci: validacao das fases e nota automatica (I/R/B/MB)"
git remote add fork git@github.com:wendelmax/<Repo>.git   # SSH!
git push -f fork ci/pam-nota:ci/pam-nota
# 4) abrir/atualizar o PR (head = wendelmax:ci/pam-nota)
gh pr create --repo <owner>/<repo> --base main --head wendelmax:ci/pam-nota --title "..." --body-file scripts/pr-body.md
```

> **Importante 1:** use **SSH** no push. Via HTTPS o token do `gh` nao tem escopo `workflow` e o GitHub **rejeita** qualquer push que altere `.github/workflows/*` ("refusing to allow an OAuth App ... without `workflow` scope").
>
> **Importante 2:** antes de commitar, **remova `nota.md` e `nota.json`** (sao artefatos temporarios locais; no repo so vao `README.md` e `NOTA.md`).
>
> **Importante 3:** dar force-push com a branch **baseada no main atual do grupo**. Se basar no main do fork (que pode estar velho), o PR aparece cheio de conflito/diff do app inteiro.

## Subir o CI em um repo novo (grupo novo)

Copie a config de um projeto com estrutura parecida, ajuste os caminhos, teste com `node .github/scripts/pam-ci.mjs` na raiz do projeto e abra o PR. O resto do fluxo é idêntico.