// 2a passagem: le o PDF gerado,_descobre em que pagina caiu cada secao do sumario,
// grava dados/sumario.json e manda o gerar-pdf.js rodar de novo com os numeros certos.
const fs = require('fs');
const path = require('path');

const SECOES = [
  'Parte 1 — Como a esteira funciona',
  '1.1 O problema que ela resolve',
  '1.2 A arquitetura em quatro arquivos',
  '1.3 Como cada critério é testado',
  '1.4 A pontuação e as faixas de conceito',
  '1.5 O que o aluno vê',
  'Parte 2 — Como foi feito',
  '2.1 O que já existia e o que precisei construir',
  '2.2 A ordem das decisões',
  '2.3 Cinco armadilhas que quase pararam tudo',
  'Parte 3 — Como aplicar no seu projeto',
  '3.1 Pré-requisitos',
  '3.2 Passo a passo, do zero ao badge',
  '3.3 Adaptando às arquiteturas mais comuns',
  '3.4 Testes antes de abrir o PR',
  'Parte 4 — Referência rápida',
  '4.1 Os 40 critérios, item a item',
  '4.2 Comandos do dia a dia',
  '4.3 Troubleshooting',
  'Parte 5 — Limitações e cuidados',
  '5.1 O que a nota mede',
  '5.2 O que ela não mede',
  '5.3 Falsos positivos e falsos negativos',
  '5.4 Checklist de revisão humana',
  'Apêndice A — Os 12 projetos e suas notas',
];

const norm = (s) => s.replace(/\s+/g, ' ').trim();

(async () => {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(fs.readFileSync(path.join(__dirname, 'guia-ci-nota.pdf')));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

  const paginas = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const p = await doc.getPage(i);
    const tc = await p.getTextContent();
    paginas.push(norm(tc.items.map((x) => x.str).join(' ')));
  }
  // a pagina do sumario e a que contem o titulo "Sumario"
  const pagSumario = paginas.findIndex((t) => t.includes('Sumário Parte 1')) + 1;

  const mapa = {};
  for (const sec of SECOES) {
    // procura apenas depois da pagina do sumario (para nao pegar a propria lista)
    for (let i = pagSumario; i < paginas.length; i++) {
      if (paginas[i].includes(norm(sec))) {
        mapa[sec] = i + 1;
        break;
      }
    }
    if (!mapa[sec]) {
      console.error('NAO ENCONTRADO no corpo: ' + sec);
      process.exitCode = 1;
    }
  }
  fs.writeFileSync(path.join(__dirname, 'dados/sumario.json'), JSON.stringify(mapa, null, 2));
  console.log('sumario.json gerado (' + Object.keys(mapa).length + '/' + SECOES.length + ' secoes)');
})();