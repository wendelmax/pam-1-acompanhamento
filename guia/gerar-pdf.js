// Gerador do guia em PDF: "CI de Nota Automatica - PAM I".
// JavaScript puro com pdfkit (sem navegador). Execute: node gerar-pdf.js
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const SC = __dirname; // onde os scripts do CI estao
const CRIT = JSON.parse(fs.readFileSync(path.join(SC, 'dados/criterios.json'), 'utf8'));
const NOTAS = JSON.parse(fs.readFileSync(path.join(SC, 'dados/notas.json'), 'utf8'));
const CFGS = JSON.parse(fs.readFileSync(path.join(SC, 'dados/configs.json'), 'utf8'));
// Numeros de pagina do sumario: preenchidos na 2a passagem (ver Tools/gerar-sumario.js)
const SUM = fs.existsSync(path.join(SC, 'dados/sumario.json'))
  ? JSON.parse(fs.readFileSync(path.join(SC, 'dados/sumario.json'), 'utf8')) : {};

const M = 52; // margem
const W = 595.28; // A4 largura
const H = 841.89;
const CW = W - M * 2;

const C = {
  tinta: '#1b2430',
  cinza: '#5b6b7c',
  claro: '#8a97a4',
  linha: '#d7dee6',
  azul: '#1f5fa8',
  azulBg: '#eef4fc',
  verde: '#177245',
  verdeBg: '#eaf6ee',
  amber: '#8a5a00',
  amberBg: '#fdf3e0',
  vermelho: '#9c2222',
  vermelhoBg: '#fceceb',
  roxo: '#5b3d9c',
  roxoBg: '#f1ecfa',
  codeBg: '#f4f6f8',
  cinzaBg: '#f0f2f4',
};

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: M, bottom: M, left: M, right: M },
  info: {
    Title: 'CI de Nota Automatica - PAM I',
    Author: 'Jackson Wendel Santos Sa',
    Subject: 'Guia para outros professores aplicarem o CI de nota automatica nos projetos da disciplina',
    Keywords: 'PAM I, React Native, Expo, SQLite, GitHub Actions, nota automatica, avaliacao',
  },
});
doc.pipe(fs.createWriteStream(path.join(SC, 'guia-ci-nota.pdf')));

// ---------- helpers de baixo nivel ----------
let paginaAtual = 1;
const ELEMENTOS_PAGINA = [];

function rodape() {
  const y = H - M + 14;
  // Desenha na area fora da margem: sem isso o pdfkit cria uma pagina extra
  // automaticamente (ele quebra pagina quando o texto passa da margem inferior).
  const mb = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.save();
  doc.moveTo(M, y - 12).lineTo(W - M, y - 12).lineWidth(0.5).strokeColor(C.linha).stroke();
  doc.font('Helvetica').fontSize(7.5).fillColor(C.claro)
    .text('CI de Nota Automatica - PAM I', M, y - 6, { lineBreak: false });
  doc.text('pag. ' + paginaAtual, W - M - 46, y - 6, { width: 46, align: 'right', lineBreak: false });
  doc.restore();
  doc.page.margins.bottom = mb;
}

// Garante que 'h' de espaco existam a partir de doc.y. NAO avanca doc.y.
function espacoPara(h) {
  if (doc.y + h > H - M - 10) novaPagina();
}

// Garante espaco vertical; se nao couber, quebra a pagina UMA vez.
function espaco(q) {
  if (doc.y + q > H - M - 10) novaPagina();
  else doc.y += q;
}

function novaPagina() {
  // Evita cascata: se a pagina esta virtually vazia, nao quebra de novo.
  if (doc.y > M + 2) {
    rodape();
    doc.addPage();
    paginaAtual++;
  }
}

function texto(t, o = {}) {
  doc.font(o.font || 'Helvetica').fontSize(o.size || 10).fillColor(o.color || C.tinta);
  doc.text(t, o.x || M, o.y, {
    width: o.width || CW,
    align: o.align || 'left',
    lineGap: o.lineGap != null ? o.lineGap : 2.6,
    continued: false,
  });
}

function h1(t) {
  espaco(16 + 34);
  doc.font('Helvetica-Bold').fontSize(17).fillColor(C.azul).text(t, M, doc.y, { width: CW });
  doc.y += 4;
  doc.moveTo(M, doc.y).lineTo(M + 54, doc.y).lineWidth(2.6).strokeColor(C.azul).stroke();
  doc.y += 13;
}
function h1top(t) {
  espaco(34);
  doc.font('Helvetica-Bold').fontSize(17).fillColor(C.azul).text(t, M, doc.y, { width: CW });
  doc.y += 4;
  doc.moveTo(M, doc.y).lineTo(M + 54, doc.y).lineWidth(2.6).strokeColor(C.azul).stroke();
  doc.y += 13;
}
function h2(t) {
  espaco(13 + 16);
  doc.font('Helvetica-Bold').fontSize(12).fillColor(C.tinta).text(t, M, doc.y, { width: CW });
  doc.y += 3;
}
function h3(t) {
  espaco(9 + 14);
  doc.font('Helvetica-Bold').fontSize(10.2).fillColor(C.azul).text(t, M, doc.y, { width: CW });
  doc.y += 2;
}

function par(t, o = {}) {
  const size = o.size || 9.8;
  doc.font('Helvetica').fontSize(size);
  const hh = Math.max(doc.heightOfString(t, { width: CW }), 12);
  espacoPara(hh);
  espaco(o.espaco || 6);
  texto(t, { size, color: o.color || C.tinta, lineGap: 3 });
  doc.y += o.depois != null ? o.depois : 4;
}

// ---------- caixas (callouts) ----------
function caixa(titulo, corpo, tipo = 'nota') {
  const cores = {
    nota: [C.azulBg, C.azul, 'NOTA'],
    importante: [C.roxoBg, C.roxo, 'IMPORTANTE'],
    atencao: [C.amberBg, C.amber, 'ATENCAO'],
    cuidado: [C.vermelhoBg, C.vermelho, 'CUIDADO'],
    dica: [C.verdeBg, C.verde, 'DICA'],
  };
  const [bg, fg, tag] = cores[tipo] || cores.nota;
  const pad = 9;
  // mede a altura
  doc.font('Helvetica-Bold').fontSize(9.2);
  const lhT = doc.heightOfString(titulo, { width: CW - pad * 2 - 16 });
  doc.font('Helvetica').fontSize(9.2);
  const lhC = doc.heightOfString(corpo, { width: CW - pad * 2 - 16 });
  const h = pad * 2 + lhT + 3 + lhC;
  if (doc.y + h > H - M - 10) novaPagina();
  const y = doc.y;
  doc.save();
  doc.roundedRect(M, y, CW, h, 4).fillColor(bg).fill();
  doc.roundedRect(M, y, 3, h, 1.5).fillColor(fg).fill();
  doc.restore();
  doc.font('Helvetica-Bold').fontSize(9.2).fillColor(fg).text(titulo, M + pad + 16, y + pad, { width: CW - pad * 2 - 16 });
  doc.font('Helvetica').fontSize(9.2).fillColor(C.tinta).text(corpo, M + pad + 16, doc.y + 3, { width: CW - pad * 2 - 16 });
  doc.y = y + h + 8;
}

function codigo(t, o = {}) {
  const size = o.size || 8;
  const larg = CW - 22; // largura util dentro da caixa
  const linhas = String(t).replace(/\t/g, '  ').split('\n');
  doc.font('Courier').fontSize(size);
  // Mede a altura REAL: linhas longas quebram e podem aumentar a altura da caixa.
  const lh = doc.heightOfString('Wg') + 1.6;
  const hReal = doc.heightOfString(linhas.join('\n'), { width: larg, lineGap: 1.6 });
  const h = Math.max(linhas.length * lh, hReal) + 14;
  if (doc.y + h > H - M - 10) novaPagina();
  const y = doc.y;
  doc.save();
  doc.roundedRect(M, y, CW, h, 4).fillColor(C.codeBg).fill();
  doc.roundedRect(M, y, 2.5, h, 1.2).fillColor(C.linha).fill();
  doc.restore();
  doc.font('Courier').fontSize(size).fillColor('#243447');
  doc.text(linhas.join('\n'), M + 11, y + 7, { width: larg, lineGap: 1.6 });
  doc.y = y + h + 9;
}

// ---- texto rico inline: interpreta <b>...</b> ----
function medirRico(t, w, size) {
  doc.font('Helvetica-Bold').fontSize(size);
  return doc.heightOfString(String(t).replace(/<\/?b>/g, ''), { width: w });
}
// Desenha em fluxo a partir de doc.y (com indentacao x) e devolve a altura usada.
function desenharRico(t, x, w, o = {}) {
  const size = o.size || 9.8;
  const lineGap = o.lineGap || 2.4;
  const partes = String(t).split(/(<b>[\s\S]*?<\/b>)/g).filter((s) => s !== '');
  const y0 = doc.y;
  let primeira = true;
  for (const p of partes) {
    const bold = p.startsWith('<b>');
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size)
      .fillColor(bold ? o.boldColor || C.tinta : o.color || C.tinta);
    const opcoes = { width: w, lineGap, continued: true };
    if (primeira) {
      doc.text(bold ? p.replace(/<\/?b>/g, '') : p, x, y0, opcoes);
      primeira = false;
    } else {
      doc.text(bold ? p.replace(/<\/?b>/g, '') : p, opcoes);
    }
  }
  doc.text('', { continued: false });
  return doc.y - y0;
}

function parRico(t, o = {}) {
  const size = o.size || 9.8;
  const hh = Math.max(medirRico(t, CW, size), 12);
  espacoPara(hh);
  espaco(o.espaco || 6);
  desenharRico(t, M, CW, { size, lineGap: 3 });
  doc.y += o.depois != null ? o.depois : 4;
}

// ---------- listas ----------
function bullets(itens, o = {}) {
  espaco(3);
  const x = o.x || M;
  const w = o.width || CW;
  const marcador = o.marcador || '•';
  itens.forEach((it) => {
    const hh = Math.max(medirRico(it, w - 15, 9.8), 11);
    espacoPara(hh + 3);
    doc.font('Helvetica').fontSize(9.8).fillColor(C.tinta)
      .text(marcador, x, doc.y, { width: 12, lineBreak: false });
    desenharRico(it, x + 15, w - 15);
    doc.y += 3;
  });
  doc.y += 4;
}

function numerado(itens, o = {}) {
  espaco(3);
  const w = o.width || CW;
  itens.forEach((it, i) => {
    const n = (i + 1) + '.';
    doc.font('Helvetica-Bold').fontSize(9.8);
    const nn = doc.widthOfString(n);
    const hh = Math.max(medirRico(it, w - nn - 8, 9.8), 11);
    espacoPara(hh + 4);
    doc.font('Helvetica-Bold').fontSize(9.8).fillColor(C.azul)
      .text(n, M, doc.y, { width: nn + 4, lineBreak: false });
    desenharRico(it, M + nn + 8, w - nn - 8);
    doc.y += 4;
  });
  doc.y += 4;
}

function passos(itens) {
  espaco(4);
  itens.forEach((p, i) => {
    const bh = 17;
    if (doc.y + bh > H - M - 10) novaPagina();
    const y = doc.y;
    doc.save();
    doc.circle(M + 9, y + 7.5, 9).fillColor(C.azul).fill();
    doc.restore();
    doc.font('Helvetica-Bold').fontSize(8.6).fillColor('#ffffff').text(String(i + 1), M, y + 3.8, { width: 18, align: 'center', lineBreak: false });
    doc.font('Helvetica-Bold').fontSize(10).fillColor(C.tinta).text(p.titulo, M + 24, y, { width: CW - 24 });
    if (p.texto) {
      doc.font('Helvetica').fontSize(9.4).fillColor(C.cinza).text(p.texto, M + 24, doc.y + 1, { width: CW - 24, lineGap: 2.4 });
    }
    doc.y = y + bh + (p.texto ? 6 : 3);
  });
  doc.y += 5;
}

// ---------- tabelas ----------
function tabela(colunas, linhas, o = {}) {
  const tam = o.size || 8.4;
  const alt = o.alt || 15;
  const larguras = o.larguras;
  const total = larguras ? larguras.reduce((a, b) => a + b, 0) : 100;
  const ws = larguras ? larguras.map((l) => (l / total) * CW) : colunas.map(() => CW / colunas.length);
  const align = o.align || colunas.map(() => 'left');
  const desenhaLinha = (vals, opts) => {
    doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(tam);
    let hh = alt;
    vals.forEach((v, i) => {
      hh = Math.max(hh, doc.heightOfString(String(v), { width: ws[i] - 8 }) + 6);
    });
    if (doc.y + hh > H - M - 10) novaPagina();
    const y = doc.y;
    if (opts.bg) {
      doc.save();
      doc.rect(M, y, CW, hh).fillColor(opts.bg).fill();
      doc.restore();
    }
    let x = M;
    vals.forEach((v, i) => {
      doc.font(opts.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(tam).fillColor(opts.cor || C.tinta);
      doc.text(String(v), x + 4, y + 4, { width: ws[i] - 8, align: align[i], lineGap: 1.4 });
      x += ws[i];
    });
    doc.y = y + hh;
    if (!opts.semLinha) {
      doc.save().moveTo(M, doc.y).lineTo(M + CW, doc.y).lineWidth(0.5).strokeColor(C.linha).stroke().restore();
    }
  };
  desenhaLinha(colunas, { bold: true, bg: o.headBg || C.cinzaBg, cor: o.headCor || C.tinta });
  let par = 0; // indice da linha (para a zebra)
  linhas.forEach((l) => {
    const antes = paginaAtual;
    desenhaLinha(l, { bg: par % 2 ? '#fafbfc' : null });
    // se a linha foi para a proxima pagina, redesenha o cabecalho
    if (paginaAtual !== antes) {
      desenhaLinha(colunas, { bold: true, bg: o.headBg || C.cinzaBg, cor: o.headCor || C.tinta });
    }
    par++;
  });
  doc.y += 8;
}

function checklist(itens) {
  espaco(3);
  itens.forEach((it) => {
    doc.font('Helvetica').fontSize(9.8);
    const hh = doc.heightOfString(it, { width: CW - 22 }) + 1;
    espacoPara(hh + 2.2);
    const y = doc.y;
    doc.save().rect(M + 1, y + 1.6, 9, 9).lineWidth(1).strokeColor(C.verde).stroke().restore();
    doc.font('Helvetica').fontSize(9.8).fillColor(C.tinta).text(it, M + 22, y, { width: CW - 22, lineGap: 2.1 });
    doc.y = y + hh + 2.2;
  });
  doc.y += 5;
}

function corDaNota(n) {
  return { I: C.vermelho, R: C.amber, B: C.azul, MB: C.verde }[n] || C.cinza;
}

// =====================================================================
// CAPA
// =====================================================================
(function capa() {
  doc.save();
  doc.rect(0, 0, W, 250).fillColor('#16324f').fill();
  doc.rect(0, 250, W, 5).fillColor(C.azul).fill();
  doc.restore();

  doc.font('Helvetica').fontSize(10.5).fillColor('#9dc0e6').text('ETEC BENTO QUIRINO  ·  PROGRAMAÇÃO DE APLICATIVOS MÓVEIS I', M, 74, { width: CW });
  doc.font('Helvetica-Bold').fontSize(27).fillColor('#ffffff').text('CI de Nota Automática', M, 100, { width: CW, lineGap: 3 });
  doc.font('Helvetica').fontSize(15).fillColor('#cfe1f2').text('Como fazer — e como foi feito', M, 142, { width: CW });
  doc.font('Helvetica').fontSize(10).fillColor('#9dc0e6').text('Guia para aplicar a mesma avaliação automatizada nos seus projetos', M, 168, { width: CW });
  doc.font('Helvetica').fontSize(10).fillColor('#9dc0e6').text('GitHub Actions  ·  React Native / Expo  ·  SQLite', M, 186, { width: CW });

  doc.y = 285;
  par('Este documento descreve uma esteira de avaliação automatizada construída para a disciplina de PAM I e já aplicada a 12 projetos de grupos reais. Ele tem duas partes: como a esteira funciona e foi implantada, e o passo a passo para outro professor replicá-la em suas próprias turmas.', { size: 10.4 });
  doc.y += 6;

  caixa(
    'A ideia em uma frase',
    'Um script lê o código do projeto dos alunos, confere 40 critérios das três fases da disciplina, calcula uma nota de 0 a 55 pontos e publica um badge e um checklist direto no README do repositório — automaticamente, a cada push. Ninguém precisa abrir o projeto, ler 40 arquivos ou anotar nada: o número aparece no topo do README.',
    'nota',
  );

  h2('O que você vai encontrar aqui');
  tabela(
    ['Parte', 'Conteúdo'],
    [
      ['Parte 1', 'O que a esteira faz e como ela foi desenhada (conceitos, arquitetura, os 4 arquivos)'],
      ['Parte 2', 'Como foi feito na prática, com as armadilhas reais que quase bloquearam a implantação'],
      ['Parte 3', 'Receita: como aplicar no seu projeto, passo a passo, do zero ao badge funcionando'],
      ['Parte 4', 'Referência rápida: os 40 critérios, as faixas de nota, comandos e troubleshooting'],
      ['Parte 5', 'Limitações e cuidados: o que a nota mede e o que ela não mede'],
      ['Apêndice A', 'Os 12 projetos da turma e as notas reais obtidas'],
    ],
    { larguras: [16, 84] },
  );
})();

// ---- pagina de numeros (antes das partes) ----
novaPagina();
h1top('Os números desta implantação');
par('Estes são os números reais da primeira rodada completa, medida nos 12 repositórios da turma. Servem de referência para calibrar a sua: se a sua distribuição vier muito diferente, vale investigar o config antes de suspeitar dos alunos.');

tabela(
  ['Indicador', 'Valor'],
  [
    ['Projetos avaliados', '12 grupos'],
    ['Critérios verificados', '40 (10 na Fase 1, 15 na Fase 2, 15 na Fase 3)'],
    ['Pontuação máxima', '55 pontos (10 + 15 + 30)'],
    ['Custo', 'zero — o GitHub Actions é gratuito para repositórios públicos'],
    ['Dependências do script', 'zero — Node.js puro, nada para instalar'],
    ['Config por projeto', '12 arquivos, escritos à mão, um por arquitetura'],
    ['Projetos que já mergearam a esteira', '6 de 12 no momento da escrita deste guia'],
  ],
  { larguras: [32, 68] },
);

h2('Como usar este documento');
bullets([
  '<b>Quer aplicar?</b> Vá direto para a Parte 3 (receita). A Parte 4 serve de consulta durante a execução.',
  '<b>Quer entender o porquê?</b> Leia as Partes 1 e 2. A 2.3 é a mais importante: são as armadilhas que custaram mais tempo na implantação real.',
  '<b>Quer ajustar a avaliação?</b> A Parte 4.1 traz os 40 critérios um a um, com o peso de cada um — é onde se mexe quando a disciplina evolui.',
  '<b>Quer saber se pode confiar no número?</b> A Parte 5 é obrigatória. Ela lista o que a nota não mede, incluindo o que um aluno conseguiria passar sem ter feito o trabalho.',
]);

caixa(
  'A decisão de ethos, antes de tudo',
  'Esta esteira foi desenhada para NÃO alterar o código do aluno. Ela lê o projeto e escreve um relatório; nunca sobrescreve o que o grupo fez. Respeitar a arquitetura do aluno é requisito de projeto, não cortesia: um avaliador que reescreve o trabalho do grupo deixa de ser justo. Por isso a adaptação a cada projeto é feita no config, e nunca no código do aluno.',
  'importante',
);

// =====================================================================
// SUMARIO
// =====================================================================
novaPagina();
h1top('Sumário');
[
  ['Parte 1 — Como a esteira funciona', 3],
  ['1.1 O problema que ela resolve', 3],
  ['1.2 A arquitetura em quatro arquivos', 4],
  ['1.3 Como cada critério é testado', 5],
  ['1.4 A pontuação e as faixas de conceito', 6],
  ['1.5 O que o aluno vê', 6],
  ['Parte 2 — Como foi feito', 7],
  ['2.1 O que já existia e o que precisei construir', 7],
  ['2.2 A ordem das decisões', 8],
  ['2.3 Cinco armadilhas que quase pararam tudo', 9],
  ['Parte 3 — Como aplicar no seu projeto', 12],
  ['3.1 Pré-requisitos', 12],
  ['3.2 Passo a passo, do zero ao badge', 13],
  ['3.3 Adaptando às arquiteturas mais comuns', 15],
  ['3.4 Testes antes de abrir o PR', 16],
  ['Parte 4 — Referência rápida', 17],
  ['4.1 Os 40 critérios, item a item', 17],
  ['4.2 Comandos do dia a dia', 20],
  ['4.3 Troubleshooting', 20],
  ['Parte 5 — Limitações e cuidados', 22],
  ['5.1 O que a nota mede', 22],
  ['5.2 O que ela não mede', 22],
  ['5.3 Falsos positivos e falsos negativos', 23],
  ['5.4 Checklist de revisão humana', 23],
  ['Apêndice A — Os 12 projetos e suas notas', 24],
].forEach(([t, p]) => {
  espaco(4);
  const y = doc.y;
  doc.font('Helvetica-Bold').fontSize(9.8).fillColor(C.tinta).text(t, M, y, { width: CW - 30 });
  doc.font('Helvetica').fontSize(9.8).fillColor(C.claro).text(SUM[t] ? String(SUM[t]) : String(p), W - M - 26, y, { width: 26, align: 'right', lineBreak: false });
  const wT = doc.font('Helvetica-Bold').fontSize(9.8).widthOfString(t);
  doc.save().moveTo(M, y + 13.5).lineTo(M + wT + 8, y + 13.5).lineWidth(0.5).strokeColor(C.linha).stroke().restore();
  doc.y = y + 19;
});

// =====================================================================
// PARTE 1
// =====================================================================
novaPagina();
h1('Parte 1 — Como a esteira funciona');
par('Esta parte descreve a arquitetura. Se você só quer aplicar, pule para a Parte 3 e volte aqui quando algo der errado.');

// 1.1
h2('1.1 O problema que ela resolve');
par('A disciplina tem três fases e um produto final em grupo. A avaliação natural de um trabalho em grupo acaba sendo: abrir o repositório, procurar a tela de listagem, procurar o storage, procurar o banco, contar o que existe e o que não existe. Em 12 projetos, são 40 perguntas repetidas 12 vezes.');
par('O material automático disponível no GitHub é ótimo para testar se o código compila — e inútil para a pergunta que importa: "esse grupo entregou a Fase 3?". Testes automatizados verificam se o software funciona. Não verificam se o escopo pedido foi cumprido.');
par('A saída foi um analisador estático com um checklist de 40 itens derivado das fichas das fases, executado pelo GitHub a cada push, com o resultado publicado dentro do próprio repositório do grupo. Três decisões moldaram o resto:');
bullets([
  '<b>Sem alteração do código do aluno.</b> A esteira lê e escreve só os próprios relatórios. Isso é requisito: um avaliador que reescreve o trabalho do grupo deixa de ser justo.',
  '<b>Resultado no lugar onde o grupo já olha.</b> O grupo abre o repositório; o badge está no topo do README. Nada de pedir que o aluno baixe um .zip na aba Actions.',
  '<b>Nota auditável.</b> Todo item ganha uma "prova" — o arquivo onde a evidência foi encontrada. O professor julga sobre a evidência, não sobre um número.',
]);

// 1.2
h2('1.2 A arquitetura em quatro arquivos');
par('A esteira inteira cabe em quatro arquivos dentro de .github/. Não há dependência a instalar, não há banco, não há servidor.');

h3('.github/pam-ci.config.json — o único arquivo que você ajusta por projeto');
par('Diz ao analisador onde está cada peça do projeto. É o arquivo que precisa ser escrito à mão para cada turma, porque cada grupo organiza os arquivos do seu jeito:');
codigo(JSON.stringify(CFGS.equipcontrol, null, 2));
par('O campo raiz existe porque alguns grupos têm o app dentro de uma subpasta (educamirim/app, app/), e outros na raiz. Nos 12 projetos desta turma, cinco usavam subpasta.');
caixa(
  'Por que o config importa tanto',
  'Os critérios da Fase 1 (existe tela de listagem, existe formulário, existe detalhe) conferem a existência de um caminho de arquivo. Sem o config, um projeto com as telas em src/screens/ seria pontuado como se não tivesse telas. É o arquivo que adapta a esteira à arquitetura de cada grupo — e a razão de ela não "reescrever" o projeto.',
  'nota',
);

h3('.github/scripts/pam-ci.mjs — o analisador');
par('Node.js puro, sem dependências. Lê o package.json, varre todos os arquivos .js, .jsx, .ts e .tsx do projeto (ignorando node_modules, .git, .expo, android, ios e build), e para cada um dos 40 critérios testa se o padrão esperado existe. Ao final escreve dois arquivos: nota.md (relatório para humanos) e nota.json (dados estruturados, útil para automação e gráficos).');

h3('.github/scripts/publicar-nota.mjs — o publicador');
par('Lê o nota.json e escreve o resultado dentro do repositório: injeta o bloco com os badges no README.md e cria o NOTA.md na raiz. É separado do analisador por um motivo prático: o analisador roda em qualquer contexto (inclusive na sua máquina, sem GitHub), e só o publicador depende do GitHub.');

h3('.github/workflows/pam-ci.yml — o orquestrador');
par('O workflow do GitHub Actions. Dispara em push na main, em pull_request e manualmente. Faz checkout, instala o Node, roda o analisador, publica o resumo na aba Actions, sobe um artefato e — só em push na main — chama o publicador e commita o resultado. O detalhe do "somente em push na main" está explicado na Parte 2.');

espaco(4);
parRico('<b>Fluxo completo de um push na branch main:</b>', {});
codigo('push na main\n'
  + '  -> workflow dispara\n'
  + '    -> pam-ci.mjs      le o codigo, confere 40 criterios, gera nota.md + nota.json\n'
  + '    -> resumo          nota.md vai para a aba Actions (visivel sem baixar nada)\n'
  + '    -> artefato        nota-pam.zip com nota.md + nota.json (download, opcional)\n'
  + '    -> publicar-nota   escreve o bloco do badge no README.md e cria o NOTA.md\n'
  + '    -> commit          "docs: atualiza a nota automatica [skip ci]"\n'
  + '  -> badge do README ja mostra a nota nova');

// 1.3
novaPagina();
h2('1.3 Como cada critério é testado');
par('O analisador usa três estratégias, do mais confiável ao mais frágil. Conhecer essa hierarquia é o que permite corrigir um critério mal calibrado sem reescrever o sistema.');

h3('Estratégia 1 — o arquivo existe');
codigo("ok: fileExists(CONFIG.lista)\n"
  + "// e a prova exibida no relatorio:\n"
  + "prova: CONFIG.lista  // -> src/screens/EquipmentListScreen.js");
par('É o critério mais confiável: um arquivo existe ou não existe. Serve para os itens da Fase 1 que tratam de estrutura (existe tela de listagem, existe formulário, existe detalhe). Depende inteiramente do config estar correto.');

h3('Estratégia 2 — o padrão existe em algum arquivo do projeto');
codigo("ok: grepFiles(/CREATE TABLE\\s+IF NOT EXISTS/i).length > 0\n"
  + "prova: grepFiles(/CREATE TABLE\\s+IF NOT EXISTS/i)[0]  // -> src/database.js");
par('É a estratégia mais usada (a maioria dos 40 itens). grepFiles percorre todos os arquivos de código e devolve os que casam com a expressão regular. O primeiro resultado vira a "prova" exibida no relatório, o que torna cada ponto verificável por mão.');

h3('Estratégia 3 — as dependências resolvem (a mais elaborada)');
codigo('const re = /(?:(?:import|export)\\s+(?:[^\'"]*\\s+from\\s+)?|require\\()\\s*[\'"]([^\'"]+)[\'"]/g;\n'
  + '// extrai todo import/require do projeto e compara com package.json\n'
  + 'ok: unresolvedImports().length === 0');
par('Este é o critério mais sofisticado da Fase 1 e o que mais frequentemente pega bug real. Ele extrai todo import e todo require do projeto e confere se cada pacote está declarado no package.json. Serve para pegar o clássico "usou AsyncStorage mas esqueceu de instalar o pacote": o aluno ganha o ponto da tela, mas o app quebra ao abrir. É o único critério que detecta erro de configuração real em vez de ausência de código.');

h3('A Fase 3 exige a cadeia completa de CRUD');
par('Um aluno que copiasse um SELECT solto e declarasse a fase concluída não deve passar. Por isso a Fase 3 não verifica "tem SQL", verifica a cadeia inteira:');
bullets([
  'cria a tabela (CREATE TABLE IF NOT EXISTS),',
  'insere (INSERT INTO), consulta (SELECT), atualiza (UPDATE), exclui (DELETE FROM),',
  'filtra (WHERE) e abre o banco (openDatabaseAsync),',
  'e então três itens de integração: a lista carrega do banco, o formulário salva com runAsync, o detalhe busca com WHERE.',
], { marcador: '›' });
par('Cada item da Fase 3 vale 2 pontos, porque a fase é a mais pesada da disciplina.');

// 1.4
h2('1.4 A pontuação e as faixas de conceito');
tabela(
  ['Fase', 'Critérios', 'Peso por item', 'Total'],
  [
    ['Fase 1 — Estrutura do projeto', '10', '1 ponto', '10 pontos'],
    ['Fase 2 — Persistência com AsyncStorage', '15', '1 ponto', '15 pontos'],
    ['Fase 3 — Banco de dados SQLite', '15', '2 pontos', '30 pontos'],
    ['Total', '40', '—', '55 pontos'],
  ],
  { larguras: [46, 18, 20, 16], align: ['left', 'center', 'center', 'center'] },
);
par('A Fase 3 tem o dobro do peso porque é o conteúdo novo e o que mais distingue um projeto completo de um parcial. A conversão para conceito usa o percentual de pontos:');
tabela(
  ['Conceito', 'Faixa', 'Significado'],
  [
    ['I — Insuficiente', '0% a 24%', 'Não entregou o essencial da disciplina'],
    ['R — Regular', '25% a 49%', 'Entregou a base, falta conteúdo'],
    ['B — Bom', '50% a 74%', 'Entrega as três fases com alguma profundidade'],
    ['MB — Muito bom', '75% a 100%', 'Projeto completo, todas as fases bem desenvolvidas'],
  ],
  { larguras: [26, 20, 54] },
);
par('O badge usa a mesma faixa, com uma cor: I vermelho, R laranja, B azul, MB verde. A cor é o que o grupo vê primeiro.');

// 1.5
novaPagina();
h2('1.5 O que o aluno vê');
par('Três lugares, em ordem de visibilidade:');
tabela(
  ['Onde', 'O que aparece', 'Quando'],
  [
    ['README.md do repositório', 'Bloco "Nota atual": 2 badges (status do CI e nota com conceito e cor), mais uma tabela com os pontos de cada fase', 'A cada push na main, escrito pelo CI'],
    ['NOTA.md na raiz', 'Checklist completo dos 40 itens, com [x] e [ ] e a "prova" de cada um', 'A cada push na main, escrito pelo CI'],
    ['Aba Actions', 'O relatório da rodada no campo Summary, sem precisar baixar nada', 'A cada execução'],
    ['Artefato nota-pam', 'nota.md e nota.json em .zip, para quem quiser processar dados', 'A cada execução, sobrescrevendo o anterior'],
  ],
  { larguras: [24, 52, 24] },
);
par('O bloco do README fica entre dois marcadores de comentário:');
codigo('<!-- PAM-CI-NOTA-INICIO -->\n'
  + '### Nota atual (automática) — TechControl (equipamentos)\n'
  + '[![CI](...badge.svg)] [![Nota](https://img.shields.io/badge/Nota%20PAM%20I-B-yellow)]\n'
  + '**B** — Bom · **56%** (31/55 pontos) · atualizado em 2026-10-05 23:29\n'
  + '| Fase | Pontos |\n'
  + '| Fase 1 — Estrutura | 10/10 |\n'
  + '<!-- PAM-CI-NOTA-FIM -->');
caixa(
  'O publicador é idempotente e cirúrgico',
  'O publicador reescreve apenas o conteúdo entre os dois marcadores. Se eles ainda não existirem, insere o bloco logo abaixo do primeiro título (#) do README. Rodar duas vezes não duplica nada e nunca toca no resto do README do grupo. Foi testado explicitamente para isso antes de subir nos 12 repositórios.',
  'dica',
);

// =====================================================================
// PARTE 2
// =====================================================================
novaPagina();
h1('Parte 2 — Como foi feito');
par('Esta parte é o registro honesto do processo, incluindo o que deu errado. Se você vai fazer o mesmo, a lista de armadilhas da seção 2.3 economiza mais tempo do que qualquer outra parte deste documento.');

h2('2.1 O que já existia e o que precisei construir');
par('O ponto de partida: 12 repositórios de grupos, cada um com uma arquitetura diferente, e uma disciplina já montada com 20 aulas e três fases avaliadas. Existia um gerador de nota (o artefato antigo na aba Actions), mas ele falhava em três requisitos:');
tabela(
  ['Requisito', 'Situação original', 'Decisão tomada'],
  [
    ['O grupo precisa ver a nota sem esforço', 'Nota escondida: dentro de um .zip no fim da página da rodada, com 0 downloads', 'Publicar no README com badge + NOTA.md'],
    ['Não posso alterar o trabalho do aluno', 'Risco real ao distribuir um gerador', 'Adaptar por config; escrever só relatórios'],
    ['Precisa funcionar em 12 arquiteturas distintas', 'Cada grupo estruturou os arquivos do seu jeito', 'Um config por projeto, 12 configs escritos à mão'],
  ],
  { larguras: [26, 38, 36] },
);
par('A segunda linha foi a mais importante na prática. Um gerador "universal" teria que reescrever o projeto para normalizar a arquitetura — exatamente o que não se deve fazer com trabalho de aluno. Adaptar um config por projeto é mais lento, mas preserva o trabalho de cada grupo intacto.');

h2('2.2 A ordem das decisões');
passos([
  { titulo: 'Extrair os critérios das fichas das fases', texto: 'Os 40 itens não foram inventados: saíram das fichas da Fase 1, 2 e 3 da disciplina, convertendo cada requisito em uma pergunta verificável no código.' },
  { titulo: 'Escrever o analisador como script de Node puro', texto: 'Sem dependências, para rodar tanto no GitHub Actions quanto na máquina do professor, para depurar e para testar antes de abrir qualquer PR.' },
  { titulo: 'Calibrar em um projeto real, não em exemplo fictício', texto: 'O primeiro projeto usado para calibração foi o equipcontrol, do grupo TechControl. Calibrar em código real expõe imediatamente os casos que um exemplo inventado esconderia (telas em subpasta, dependência faltando, seed fora do lugar).' },
  { titulo: 'Adicionar a publicação no README', texto: 'Só depois de a nota estar confiável veio o publicador, porque publicar um número errado de forma visível é pior do que não publicar.' },
  { titulo: 'Escrever um config por grupo e testar cada um localmente', texto: 'Antes de abrir qualquer PR, o script foi rodado na máquina contra o main de cada um dos 12 projetos, conferindo que a nota fazia sentido e que o README não era destruído.' },
  { titulo: 'Abrir PR, um por projeto, e esperar os grupos mergearem', texto: 'O CI é instalado no repositório de cada grupo via pull request. Nenhum push direto foi feito no repositório de nenhum aluno.' },
]);

novaPagina();
h2('2.3 Cinco armadilhas que quase pararam tudo');
par('Estas são as lições que custaram mais tempo. Elas estão aqui porque qualquer pessoa replicando a esteira vai encontrá-las.');

h3('Armadilha 1 — o token sem escopo de workflow (a que mais custou tempo)');
par('Para enviar uma branch que contenha arquivos .github/workflows/ para um repositório usando a linha de comando do GitHub, o token precisa do escopo workflow. Sem ele, o GitHub rejeita o push com uma mensagem que parece de rede:');
codigo('! [remote rejected] ci/nota-visivel -> ci/nota-visivel\n'
  + '  (refusing to allow an OAuth App to create or update workflow\n'
  + '   `.github/workflows/pam-ci.yml` without `workflow` scope)');
par('O pior detalhe: se você encadeia o comando do git com um pipe (por exemplo git push ... | tail), o código de saída que você testa é o do último comando do pipe, não o do git. O script reporta sucesso, o push não aconteceu, e o erro some. Foi exatamente o que aconteceu nos primeiros 8 PRs: o script dizia "branch enviada" e nenhum branch existia no fork.');
caixa(
  'A lição',
  'Nunca confie em git push dentro de um pipe sem checar o código de saída do git em si (use PIPESTATUS, ou redirecione a saída para um arquivo e leia depois). E para enviar workflows por SSH, use uma chave — a chave SSH não tem essa restrição de escopo que o token OAuth tem.',
  'atencao',
);

h3('Armadilha 2 — o loop infinito de commits');
par('O workflow escreve no README e faz commit. Se esse commit disparar o workflow de novo, ele reescreve o README e commita de novo, para sempre. Duas proteções resolvem, e ambas são necessárias:');
bullets([
  '<b>[skip ci] na mensagem do commit</b> — o GitHub Actions não dispara workflow para commits com esse marcador.',
  '<b>checar quem é o autor</b> — a etapa de publicação só roda se o autor do push não for o próprio bot (github.actor != github-actions[bot]).',
]);
par('Sem a segunda proteção, um push do próprio bot reativaria o fluxo. Com as duas, o fluxo é idempotente.');

h3('Armadilha 3 — pull request de fork não consegue escrever');
par('A etapa que escreve no README só roda em push na branch main — nunca em pull_request. Isso não é limitação do script, é do GitHub: em PRs que vêm de fork, o token é somente-leitura, e commitar num PR do próprio repositório empurraria commits na branch de trabalho do aluno. A solução foi preparar o PR: o branch já sobe com o README e o NOTA.md gerados, para o aluno ver a prévia do que vai acontecer. O main recebe a versão autoritativa no momento do merge.');

h3('Armadilha 4 — a nota some se ninguém abre o repositório');
par('A primeira versão da esteira só produzia artefato (o .zip na aba Actions). Auditando os 12 projetos, o resultado foi constrangidor: os artefatos existiam, mas tinham 0 downloads. A nota estava tecnicamente disponível e praticamente invisível. Daí a decisão de publicar no README — não como complemento do artefato, mas como o canal principal.');

h3('Armadilha 5 — config errado dá nota errada com muita confiança');
par('O config diz onde está cada tela. Se aponta para um caminho errado em um projeto, os itens da Fase 1 marcam zero sem nenhuma indicação de que o problema é o config, não o aluno. Por isso todo item do relatório exibe a "prova" (o caminho testado): se a lista der zero, o professor vê que testou "src/screens/Lista.js" quando o grupo chamava o arquivo de "TelaHome.js" e corrige o config, em vez de punir o grupo.');

// =====================================================================
// PARTE 3
// =====================================================================
novaPagina();
h1('Parte 3 — Como aplicar no seu projeto');
par('Esta é a parte executável. Se você leu até aqui, o resto é seguir a receita.');

h2('3.1 Pré-requisitos');
bullets([
  'Um repositório no GitHub — a esteira depende do GitHub Actions e não roda em GitLab nem em CI local.',
  'Node.js na sua máquina, só para testar o script antes de abrir o PR (opcional, mas recomendado).',
  'Permissão de escrita no repositório, ou um fork seu para abrir o PR.',
  'As fichas das fases da sua disciplina — elas são a fonte dos critérios. Sem elas você não tem checklist.',
]);

h2('3.2 Passo a passo, do zero ao badge');
par('Siga na ordem. Os passos 1 a 4 são feitos uma vez por projeto; os passos 5 a 8 se repetem em cada turma nova.');

passos([
  { titulo: 'Crie um fork do projeto para enviar seus PRs', texto: 'Você não deve ter permissão de escrita no repositório do aluno. Envie sempre do seu fork pessoal, via pull request.' },
  { titulo: 'Escreva o config para aquele projeto', texto: 'Copie pam-ci.config.json para .github/ e ajuste os caminhos (principal, lista, form, detalhe, dados, storage, sqlite) e o campo raiz. Este é o passo que exige ler a estrutura do projeto do aluno — e é o único.' },
  { titulo: 'Copie os três scripts e o workflow', texto: 'pam-ci.mjs, publicar-nota.mjs e pam-ci.yml vão para .github/scripts/ e .github/workflows/ (veja a estrutura completa na seção 1.2). Nada precisa ser instalado — são arquivos .mjs e .yml puros.' },
  { titulo: 'Teste o script na sua máquina, contra o projeto real', texto: 'Dentro do clone do projeto do aluno, rode node .github/scripts/pam-ci.mjs. Ele imprime o relatório e grava nota.md e nota.json. Leia a nota: ela faz sentido? A Fase 1 está reconhecendo as telas que existem? Se um item der zero de forma suspeita, quase sempre é o config — confira a prova exibida e corrija o caminho.' },
  { titulo: 'Rode o publicador e confira o README', texto: 'Rode node .github/scripts/publicar-nota.mjs. Ele injeta o bloco do badge no README e cria o NOTA.md. Abra o README e confirme que só o bloco entre os marcadores mudou e que nada mais do documento do aluno foi tocado. Rode duas vezes: nada deve duplicar.' },
  { titulo: 'Limpe e faça o commit', texto: 'Apague nota.md e nota.json (são artefatos temporários locais; no repositório só entram README.md e NOTA.md), versione .github/ e faça o commit com seu nome e e-mail de professor.' },
  { titulo: 'Crie um branch e envie', texto: 'Crie um branch (ex.: ci/pam-nota) e envie por SSH a partir do seu fork (veja a armadilha 1). Uma branch por projeto, sempre baseada no main atual do grupo.' },
  { titulo: 'Abra o pull request e explique ao grupo', texto: 'O corpo do PR deve dizer, em uma frase, que a ferramenta mede o escopo das fases e não mexe no código deles, e apontar onde a nota aparece. Alunos tendem a achar que é um mecanismo de vigilância; Sea transparente sobre a finalidade desde a primeira linha.' },
]);

novaPagina();
h2('3.3 Adaptando às arquiteturas mais comuns');
par('Cada grupo organiza os arquivos do seu jeito. O config absorve quase toda essa diferença. Os casos observados nos 12 projetos desta turma:');
tabela(
  ['Arquitetura do aluno', 'O que ajustar no config', 'Observação'],
  [
    ['Expo clássico (App.js na raiz)', '"principal": "App.js", "raiz": "."', 'O caso mais simples; a maioria dos grupos cai aqui'],
    ['Expo Router (app/ na raiz)', '"raiz": ".", telas em app/…', 'Aponte lista/form/detalhe para dentro de app/'],
    ['Projeto dentro de subpasta', '"raiz": "educamirim" (ou app/)', 'Todo caminho é relativo a essa raiz; 5 dos 12 grupos usavam'],
    ['TypeScript (.tsx)', 'Nada nos critérios', 'O analisador já lê .ts e .tsx; nenhum ajuste necessário'],
    ['Sem tela de detalhe ainda', 'Deixe "detalhe" apontando para onde deveria estar', 'O item da Fase 1 dá zero — correto, porque a fase pede'],
  ],
  { larguras: [26, 34, 40] },
);
caixa(
  'Regra de ouro da adaptação',
  'Você configura a esteira para reconhecer a arquitetura que o aluno construiu. Você nunca muda a arquitetura do aluno para ela caber no validador. Se um critério não dá conta de uma estrutura legítima, ajuste o critério ou o config — nunca puxe o trabalho do grupo na sua direção.',
  'importante',
);

h2('3.4 Testes antes de abrir o PR');
par('Um roteiro curto que pega quase tudo antes do grupo ver:');
checklist([
  'Rodei o analisador e a nota faz sentido (nenhuma fase com zero inexplicável).',
  'Rodei o publicador e conferi que o README só mudou entre os marcadores.',
  'Rodei o publicador duas vezes: nada duplicou.',
  'Apaguei nota.md e nota.json antes do commit.',
  'O commit leva .github/, README.md e NOTA.md — e nada mais do aluno.',
  'A branch foi baseada no main atual do grupo (não em um fork atrasado).',
  'Enviei por SSH e confirmei que a branch existe no fork (git ls-remote).',
  'Abri o PR e o corpo dele está em português, explicando que a ferramenta não altera o código do grupo.',
]);

// =====================================================================
// PARTE 4
// =====================================================================
novaPagina();
h1('Parte 4 — Referência rápida');

h2('4.1 Os 40 critérios, item a item');
par('A lista completa, como o analisador verifica. Guarde esta página: é o conteúdo que você vai querer ajustar quando a disciplina evoluir.');

const fases = [
  { key: Object.keys(CRIT)[0], peso: '1 ponto por item — total 10 pontos' },
  { key: Object.keys(CRIT)[1], peso: '1 ponto por item — total 15 pontos' },
  { key: Object.keys(CRIT)[2], peso: '2 pontos por item — total 30 pontos' },
];
fases.forEach((f) => {
  h3(f.key + '  (' + f.peso + ')');
  const itens = CRIT[f.key];
  itens.forEach((it) => {
    const pts = it[2] ? '2' : it[1];
    doc.font('Helvetica').fontSize(9);
    const hh = Math.max(13, doc.heightOfString(it[3], { width: CW - 38 }) + 4);
    espacoPara(hh);
    const y = doc.y;
    const marcar = it[0] === 'x';
    doc.save().rect(M + 1, y + 1.8, 8, 8).lineWidth(0.9).strokeColor(marcar ? C.verde : C.linha).stroke().restore();
    doc.font('Helvetica-Bold').fontSize(8.2).fillColor(C.claro).text('+' + pts, M + 15, y + 1.5, { width: 22, lineBreak: false });
    doc.font('Helvetica').fontSize(9).fillColor(C.tinta).text(it[3], M + 38, y, { width: CW - 38, lineGap: 2.2 });
    doc.y = y + hh;
  });
  doc.y += 6;
});

h2('4.2 Comandos do dia a dia');
tabela(
  ['Para', 'Comando'],
  [
    ['Rodar o analisador localmente', 'node .github/scripts/pam-ci.mjs'],
    ['Publicar no README e no NOTA.md', 'node .github/scripts/publicar-nota.mjs'],
    ['Ver a nota em JSON', 'cat nota.json'],
    ['Rodar uma rodada manualmente no GitHub', 'Actions -> PAM I - Validacao das fases e nota -> Run workflow'],
    ['Baixar o relatório da rodada', 'Aba Actions -> Artifacts -> nota-pam'],
    ['Ver a nota no repositório', 'README.md (bloco no topo) ou NOTA.md'],
    ['Conferir se a branch existe no fork', 'git ls-remote git@github.com:voce/Repo.git'],
    ['Ver o badge funcionando', 'Abra o README do projeto em modo anônimo (sem estar logado)'],
  ],
  { larguras: [32, 68], size: 8.2 },
);

h2('4.3 Troubleshooting');
tabela(
  ['Sintoma', 'Causa provável', 'O que fazer'],
  [
    ['Push rejeitado com "without workflow scope"', 'Token sem escopo de workflow', 'Envie por SSH (chave). Ver Armadilha 1'],
    ['Script diz que enviou, mas a branch não existe', 'Erro do git escondido por um pipe', 'Rode git push sem pipe e confira; teste com git ls-remote'],
    ['Workflow roda mas não escreve no README', 'Não é push na main, ou é PR', 'O publicador só roda em push na main. Em PR, o branch já sobe com o relatório'],
    ['Infinite loop de commits', 'Faltou [skip ci] ou a checagem do autor', 'Inclua [skip ci] na mensagem e github.actor != github-actions[bot]'],
    ['Fase inteira com zero', 'Config apontando para caminhos errados', 'Leia a "prova" de cada item: ela mostra o caminho testado. Corrija o config'],
    ['Fase 1 dá zero mas o projeto tem telas', 'raiz errada no config', 'O config aponta para a subpasta errada; ajuste "raiz"'],
    ['Nota parece errada num item', 'Critério por regex não reconheceu o nome do aluno', 'Ajuste a regex em pam-ci.mjs para aceitar o padrão da turma (é esperado)'],
    ['Badge não muda depois do merge', 'O bot commita mas o workflow não roda', 'Veja se o commit do bot tem [skip ci] e se houve um push depois dele'],
    ['Artefato com 0 downloads', 'Esperado — ninguém precisa baixar', 'O canal principal é o README. O artefato é só para quem quiser'],
  ],
  { larguras: [30, 26, 44], size: 7.8 },
);

// =====================================================================
// PARTE 5
// =====================================================================
novaPagina();
h1('Parte 5 — Limitações e cuidados');
par('Uma ferramenta de nota precisa ser honesta sobre o que não sabe. Esta parte é o que você deve comunicar aos alunos e a si mesmo.');

h2('5.1 O que a nota mede');
bullets([
  'Presença e coerência da estrutura do projeto (as três telas, o app principal, a identidade do app).',
  'Se as dependências estão declaradas — o único teste que pega erro de configuração real.',
  'Uso das APIs da Fase 2 (AsyncStorage) e da Fase 3 (SQLite) no código.',
  'A cadeia completa de CRUD na Fase 3, incluindo a integração com as telas.',
  'Presença de async/await, tratamento de erro por Alert, e validação de formulário.',
]);

h2('5.2 O que ela não mede');
bullets([
  'Se o app realmente roda. O analisador lê o código; ele não executa nada.',
  'Se o SQL está correto. Um SELECT sintaticamente válido e semanticamente errado ganha o mesmo ponto.',
  'Qualidade visual, layout, acessibilidade, design.',
  'Trabalho em equipe. Quem fez o quê não é visível no código de forma confiável.',
  'Sobrevivência (copiar do colega, do StackOverflow, de um projeto anterior). A esteira não é antifraude; um SQL copiado da internet passa.',
]);

h2('5.3 Falsos positivos e falsos negativos');
par('Sendo uma análise por regex, os dois erros são possíveis:');
tabela(
  ['Erro', 'Exemplo', 'Com que frequência ocorre'],
  [
    ['Falso negativo (aluno injustamente penalized)', 'O aluno deu o nome buscarProduto à função em vez de findItem; o padrão não casou', 'Comum no início; ajuste a regex para a convenção da sua turma'],
    ['Falso positivo (aluno ganha ponto de graça)', 'Comentário com // TODO: SELECT FROM aqui marca o item de SELECT', 'Menos comum, mas acontece; por isso a prova é exibida'],
  ],
  { larguras: [22, 40, 38], size: 8 },
);
caixa(
  'Como usar a nota sem injustiças',
  'A nota é um ponto de partida para a conversa, não um veredito. Todo item traz a prova (o arquivo e o padrão testados): quando um zero parece errado, quase sempre é o config ou a regex — não o aluno. Use a nota para ordenar as conversas, não para encerrá-las.',
  'importante',
);

h2('5.4 Checklist de revisão humana');
par('Antes de fechar a avaliação de um projeto:');
checklist([
  'Rodei a esteira e a nota saiu coerente com o que eu sei do projeto.',
  'Para cada zero que me pareceu estranho, li a prova e ajustei o config (não o aluno).',
  'Para cada nota alta com projeto fraco, olhei o código — a regex pode ter sido enganada.',
  'Conferi que nenhum commit alterou código do aluno (só README e NOTA.md).',
  'Consideri a participação e o processo, que a nota não mede.',
]);

// =====================================================================
// APENDICE A
// =====================================================================
h1('Apêndice A — Os 12 projetos e suas notas');
par('Resultado da primeira rodada completa da esteira, com as notas medidas no repositório de cada grupo. Serve de referência para calibrar a sua turma: compare com a sua e veja se a distribuição faz sentido.');

h3('Distribuição');
const cont = { I: 0, R: 0, B: 0, MB: 0 };
NOTAS.forEach((n) => cont[n.nota]++);
tabela(
  ['Conceito', 'Quantidade', 'Projetos'],
  [
    ['MB — Muito bom', String(cont.MB), NOTAS.filter((n) => n.nota === 'MB').map((n) => n.projeto).join(', ')],
    ['B — Bom', String(cont.B), NOTAS.filter((n) => n.nota === 'B').map((n) => n.projeto).join(', ')],
    ['R — Regular', String(cont.R), NOTAS.filter((n) => n.nota === 'R').map((n) => n.projeto).join(', ')],
    ['I — Insuficiente', String(cont.I), NOTAS.filter((n) => n.nota === 'I').map((n) => n.projeto).join(', ') || '(nenhum)'],
  ],
  { larguras: [24, 14, 62] },
);

h3('Nota por projeto');
tabela(
  ['#', 'Projeto', 'Grupo', 'F1', 'F2', 'F3', 'Nota', '%', 'Pontos', 'PR'],
  NOTAS.map((n, i) => [String(i + 1), n.projeto, n.grupo, n.f1, n.f2, n.f3, n.nota, n.pct + '%', n.pts, n.pr]),
  { larguras: [4, 15, 20, 9, 9, 9, 7, 7, 11, 9], align: ['center', 'left', 'left', 'center', 'center', 'center', 'center', 'center', 'center', 'center'], size: 7.8 },
);

h3('O que a distribuição revela');
par('O dado mais informativo desta tabela não é a média — é a coluna da Fase 3. Ela mostra que 7 dos 12 grupos entregaram as fases 1 e 2 de forma razoável, mas pararam antes de fechar a Fase 3 (SQLite):');
bullets([
  'A Fase 3 é o maior gap da turma. Onde o grupo investe em SQLite, a nota sobe muito — CDF e EDUCAMIRIM mostram que só pela Fase 3 dá para chegar ao MB.',
  'Nenhum projeto ficou no I. A base (Fases 1 e 2) está bem consolidada na turma; o que falta é o conteúdo novo.',
  'Dois grupos (equipcontrol e Boom-Patch) estão no B já na primeira rodada, e um deles tinha o CI rodando há semanas — o que mostra que a nota responde ao esforço, como deve ser.',
]);
par('Estes dados foram coletados com a esteira funcionando, mas antes de os grupos terem os PRs de nota mergeados. Os números de cada projeto atualizam sozinhos no README de cada repositório a cada push — se você copiar esta tabela, ela envelhece. Consulte os repositórios para o valor atual.');

// rodape final
rodape();
doc.end();
console.log('PDF gerado: ' + path.join(SC, 'guia-ci-nota.pdf'));