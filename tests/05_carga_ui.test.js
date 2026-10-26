// TESTE DE CARGA (UI) – volume de dados na interface
// Insere QTD tarefas seguidas e verifica se o app continua correto e responsivo.
// Rodar com outra quantidade (PowerShell):  $env:QTD=200; npx jest tests/05_carga_ui.test.js
// Rodar com outra quantidade (bash):        QTD=200 npx jest tests/05_carga_ui.test.js
import { screen, fireEvent } from '@testing-library/react-native';
import { renderizarLogado, adicionarTarefa, rolarAteOFim } from './helpers/login';

const QTD = parseInt(process.env.QTD || '50', 10);
const LIMITE_MS = parseInt(process.env.LIMITE_MS || '120000', 10); // tempo máximo para todas as inserções

describe('05 - Carga na interface (inserção em massa)', () => {
  test(`insere ${QTD} tarefas sem perder dados`, async () => {
    await renderizarLogado();

    const inicio = Date.now();
    for (let i = 1; i <= QTD; i++) {
      await adicionarTarefa(`Carga ${i}`);
    }
    const duracao = Date.now() - inicio;
    console.log(
      `[CARGA UI] ${QTD} tarefas em ${duracao} ms (media ${Math.round(duracao / QTD)} ms/tarefa)`,
    );

    // 1) Integridade: o contador precisa bater com a quantidade inserida
    expect(screen.getByText(`Total: ${QTD} | Concluídas: 0`)).toBeOnTheScreen();
    // 2) A tarefa mais recente aparece no topo
    expect(screen.getByText(`Carga ${QTD}`)).toBeOnTheScreen();
    // 3) Desempenho dentro do limite
    expect(duracao).toBeLessThan(LIMITE_MS);

    // 4) Lista grande continua rolável até o primeiro item
    await rolarAteOFim('lista-tarefas');
    expect(await screen.findByText('Carga 1')).toBeOnTheScreen();

    // 5) App continua responsivo após a carga
    await fireEvent.press(screen.getByTestId('check-1'));
    expect(screen.getByText(`Total: ${QTD} | Concluídas: 1`)).toBeOnTheScreen();
  }, LIMITE_MS + 30000);
});
