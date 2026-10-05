# Contexto e instruções para a IA que for continuar

> Este arquivo existe para que **qualquer IA, de qualquer lugar**, consiga retomar o acompanhamento com todo o contexto. Leia antes de agir.

## 1. Identidade e credenciais

- **Git global** já configurado nesta máquina: `user.name = Jackson Sá`, `user.email = jackson.sa@cps.sp.gov.br`.
  - **Atenção:** ao commitar **nos repos dos alunos**, use explicitamente a identidade do professor:
    ```
    git -c user.email="jackson.sa@cps.sp.gov.br" -c user.name="Jackson Sá" commit -m "..."
    ```
- **gh CLI** autenticada como **`wendelmax`** (usuário de infraestrutura/professor). Todos os forks são criados sob `wendelmax/`.
- Protocolo git: SSH (o `gh` usa ssh). Push por https funciona via credential helper do `gh`.

## 2. O que já foi feito (histórico resumido)

### 2.1 Scaffolds de Fases 1/2 (21/09)
Criados PRs com o app "quase pronto" (AsyncStorage + telas lista/detalhe/adicionar) para grupos que estavam zerados:
- **Vamoa-** → PR #3 (material em `data/`, `lib/`, `App.js`) — ✅ **MERGED** pelo grupo em 29/09.
- **Boom-Patch** → PR #4 (material em `src/data/`, `src/lib/`, `src/app/`) — ✅ **MERGED** em 28/09.
  - Os PRs #2/#3 do Boom-Patch foram **fechados** (o grupo reinicializou o repo). O GitHub bloqueia reabrir PR quando o repo-base foi recriado ("no history in common"). Solução usada: sincronizar a branch com o main novo e abrir PR novo.

### 2.2 Fixes de conflito (28–29/09)
- **CDF**: conflito do PR #2 resolvido preservando o código do grupo + assets; commit de merge. ✅ depois **MERGED**.
- **Boom-Patch**: branch sincronizada com o main novo (o grupo recriou o repo com template novo), material portada para `src/app/`. Novo PR #4 ✅ MERGED.
- **Vamoa-**: conflito do PR #3 resolvido **adaptando o scaffold à arquitetura do grupo** (eles usam `App.js` único, sem expo-router). ✅ depois MERGED.

### 2.3 Issues de Fase 3 (28/09)
Uma issue por grupo com **dicas contextualizadas ao tema** (schema da tabela, blocos de CRUD SQLite, onde alterar). Ver `LINKS.md`.

### 2.4 Issues de Fase 2 (29/09)
- **Pet_Match #7** — AsyncStorage sem dependência no package.json (app quebra) + lista principal não carrega os cadastros.
- **Vamoa- #5** e **Boom-Patch #7** — apontando o PR de Fases 1/2 a mesclar.

### 2.5 CI de nota (29/09) — a "automação" principal
PR com workflow + script + config injetado em **todos os 12 repos** (ver `AUTOMACAO-NOTA.md` e a pasta `scripts/`).

## 3. Regras de ouro ao continuar

1. **Nunca** sobrescrever o trabalho dos grupos. Aosyncronizar um fork, **adaptar ao código que o grupo já tem** (estrutura de pastas, nomes de arquivos, App.js vs src/app). Como feito no Boom-Patch e no Vamoa-.
2. **Fork desatualizado**: os forks em `wendelmax/` podem estar atrás do main do grupo. Antes de abrir PR, clonar o repo **do grupo** e basar a branch no main **atual** dele; só então dar force-push no fork. (Foi assim que os PRs de CI ficaram limpos: só 3 arquivos novos, sem diff do app.)
3. **Issue aberta já existente**: **não duplicar**. Antes de criar, listar issues abertas do repo.
4. **Toda issue/PR** deve ser escrita em **pt-BR**, no tom didático do professor, com blocos de código e "onde alterar".
5. **Fase 3 é o foco atual** (prazo 19/10/2026). O CI pondera Fase 3 com o maior peso.

## 4. Como retomar (roteiro)

### Rodada diária/semanal de análise
1. Para cada repo, olhar: PRs abertos (conflito?), issues abertas (responder?), novos commits desde a última análise.
2. Atualizar `ESTADO.md` com a situação nova.
3. Se algum grupo travou num bug (ex.: falta dependência), abrir issue com a correção.

### Ajustar o CI / os critérios da nota
- O script e as configs por projeto estão versionados aqui em `scripts/`.
- Mudou o gabarito? Edite `scripts/pam-ci.mjs` (checklist, pesos, faixas de nota) e/ou o `scripts/configs/<projeto>.json`.
- Depois reinjetar nos repos (passo 5 do `AUTOMACAO-NOTA.md`).

## 5. Ambiente / paths úteis (nesta máquina)

- Este repo de acompanhamento: `/tmp/pam-1-acompanhamento`.
- Cópia de trabalho do CI (configs, corpo do PR, clones de teste): `/tmp/pam-ci` (`files/`, `configs/`, `repos/`, `test/`).
- Material do repositório **Vamoa-** (fix de conflito): `/tmp/Vamoa-`.
- Script gerador de issues de Fase 3: `/tmp/issue_gen.py`; corpos em `/tmp/issues/`.
- Workspace principal do professor (aulas, AGENTS.md, docs): `/mnt/c/Users/jackson.sa/Projetos/Programacao-Aplicativos-Moveis-I`.

> Os diretórios em `/tmp` são **efêmeros**. Se sumirem, tudo o que importa está neste repositório (em `scripts/` e nos documentos).

## 6. Glossário

- **Fork**: cópia do repo do grupo sob `wendelmax/`, de onde saem os PRs do professor.
- **Fase 1** (Aulas 03–05): estrutura de pastas + telas de lista/detalhe/formulário.
- **Fase 2** (Aulas 06–07): persistência com **AsyncStorage**.
- **Fase 3** (Aulas 14–15): banco **SQLite** + CRUD completo (Criar/Listar/Buscar/Atualizar/Excluir) + filtro com `WHERE`.
- **nota**: I (0–25%), R (25–50%), B (50–75%), MB (75–100%).