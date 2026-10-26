/**
 * TESTE DE CARGA (API) – volume de requisições ao backend usado pelo app
 * Dispara N requisições reais e calcula média, p95, máximo e taxa de erro.
 * Este teste usa a rede de verdade (fetch nativo do Node 18+), por isso roda no
 * projeto Jest "carga-api", sem o preset jest-expo (que substitui o fetch por um mock).
 * Rodar com outros parâmetros (PowerShell):
 *   $env:REQUISICOES=200; $env:LIMITE_P95_MS=1500; npx jest tests/06_carga_api.test.js
 */

// Mesma API consumida pela tela de posts (src/screens/PostsScreen.js)
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const REQUISICOES = parseInt(process.env.REQUISICOES || '100', 10);
const LIMITE_MEDIA_MS = parseInt(process.env.LIMITE_MEDIA_MS || '800', 10);
const LIMITE_P95_MS = parseInt(process.env.LIMITE_P95_MS || '1500', 10);
const LIMITE_ERRO = parseFloat(process.env.LIMITE_ERRO || '0.05'); // 5 %

async function executarCarga(url, total) {
  const tempos = [];
  let erros = 0;
  const inicioGeral = Date.now();

  for (let i = 1; i <= total; i++) {
    // alterna entre listagem e detalhe para variar o tipo de carga
    const alvo = i % 2 === 0 ? `${url}/${(i % 100) + 1}` : `${url}?_limit=20`;
    const t0 = Date.now();
    let ok;
    try {
      ok = (await fetch(alvo)).ok;
    } catch (e) {
      ok = false;
    }
    tempos.push(Date.now() - t0);
    if (!ok) erros++;
  }

  const duracaoTotal = Date.now() - inicioGeral;
  tempos.sort((a, b) => a - b);
  const soma = tempos.reduce((a, b) => a + b, 0);

  return {
    requisicoes: total,
    erros,
    taxaErro: erros / total,
    media: Math.round(soma / total),
    minimo: tempos[0],
    maximo: tempos[tempos.length - 1],
    p95: tempos[Math.min(tempos.length - 1, Math.ceil(total * 0.95) - 1)],
    throughput: Math.round((total / (duracaoTotal / 1000)) * 100) / 100,
  };
}

describe('06 - Carga na API consumida pelo app', () => {
  let carga;

  beforeAll(async () => {
    carga = await executarCarga(API_URL, REQUISICOES);
    console.log(
      [
        '===== RELATORIO TESTE DE CARGA (API) =====',
        `Requisicoes : ${carga.requisicoes}`,
        `Erros       : ${carga.erros} (${(carga.taxaErro * 100).toFixed(1)}%)`,
        `Tempo medio : ${carga.media} ms`,
        `Min / Max   : ${carga.minimo} / ${carga.maximo} ms`,
        `P95         : ${carga.p95} ms`,
        `Throughput  : ${carga.throughput} req/s`,
        '==========================================',
      ].join('\n'),
    );
  }, REQUISICOES * 5000);

  test('taxa de erro aceitável', () => {
    expect(carga.taxaErro).toBeLessThanOrEqual(LIMITE_ERRO);
  });

  test('tempo médio de resposta aceitável', () => {
    expect(carga.media).toBeLessThanOrEqual(LIMITE_MEDIA_MS);
  });

  test('percentil 95 aceitável', () => {
    expect(carga.p95).toBeLessThanOrEqual(LIMITE_P95_MS);
  });
});
