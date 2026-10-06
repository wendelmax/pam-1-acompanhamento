# Guia em PDF — CI de Nota Automática (PAM I)

Documento de 18 páginas explicando **como a esteira de nota funciona** e **como aplicá-la em outras turmas**, escrito para outro professor.

## Arquivos

| Arquivo | O que é |
|---|---|
| `guia-ci-nota.pdf` | **O guia pronto para ler/imprimir/distribuir** |
| `gerar-pdf.js` | Script que gera o PDF (biblioteca `pdfkit`, JavaScript puro) |
| `gerar-sumario.js` | Segunda passagem: descobre a página real de cada seção e preenche o sumário |
| `dados/criterios.json` | Os 40 critérios extraídos do analisador (fonte da Parte 4.1) |
| `dados/notas.json` | As notas reais dos 12 projetos (fonte do Apêndice A) |
| `dados/configs.json` | Os 12 configs por projeto (fonte do exemplo da Parte 1.2) |
| `dados/sumario.json` | Páginas de cada seção (gerado; não editar à mão) |
| `dados/configs-individuais/` | Cópia dos 12 `pam-ci.config.json` que vão para os repositórios |

## Como regenerar o PDF

Precisa de Node.js e das duas bibliotecas:

```bash
cd guia
npm install pdfkit pdfjs-dist

node gerar-pdf.js      # 1a passagem (numero de página provisório)
node gerar-sumario.js  # descobre a página real de cada seção
node gerar-pdf.js      # 2a passagem (sumário correto)
```

O PDF já está versionado. Só regenere quando mudar o conteúdo — e sempre rode as três passagens, senão o sumário mostra páginas erradas.

## Estrutura do guia

- **Capa** — a ideia em uma frase + mapa das 5 partes
- **Os números desta implantação** — indicadores reais da turma
- **Sumário** com páginas
- **Parte 1** — como a esteira funciona (conceitos, os 4 arquivos, as 3 estratégias de teste, pontuação, o que o aluno vê)
- **Parte 2** — como foi feito, incluindo **as 5 armadilhas** que quase bloquearam a implantação
- **Parte 3** — receita passo a passo para aplicar no seu projeto, adaptação a arquiteturas e testes antes do PR
- **Parte 4** — referência rápida: os 40 critérios um a um, comandos, troubleshooting
- **Parte 5** — limitações: o que a nota mede, o que não mede, falsos positivos/negativos, checklist de revisão humana
- **Apêndice A** — os 12 projetos com as notas reais e o que a distribuição revela

## Nota sobre os dados

O Apêndice A usa as notas medidas em **05/10/2026**. Elas envelhecem: cada projeto atualiza a própria nota no `README.md` a cada push. Ao regenerar o PDF, atualize `dados/notas.json`.

## Licença de uso

Material de uso interno da disciplina. Pode adaptar e redistribuir para outras turmas livremente — mas mantenha os exemplos genéricos (não cite nomes de alunos nem dados sensíveis). Os campos `grupo` em `dados/notas.json` e nos configs podem ser substituídos pelos seus grupos.