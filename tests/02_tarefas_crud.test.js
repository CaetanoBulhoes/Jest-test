// TESTE FUNCIONAL – Criar, concluir e excluir tarefas
import { screen, fireEvent } from '@testing-library/react-native';
import { renderizarLogado, adicionarTarefa } from './helpers/login';

describe('02 - CRUD de tarefas', () => {
  beforeEach(async () => {
    await renderizarLogado();
  });

  test('lista começa vazia', () => {
    expect(screen.getByText('Nenhuma tarefa cadastrada')).toBeOnTheScreen();
    expect(screen.getByText('Total: 0 | Concluídas: 0')).toBeOnTheScreen();
  });

  test('cria, conclui, desmarca e exclui tarefas', async () => {
    // Criar
    await adicionarTarefa('Estudar Jest');
    await adicionarTarefa('Entregar trabalho');
    expect(screen.getByText('Estudar Jest')).toBeOnTheScreen();
    expect(screen.getByText('Entregar trabalho')).toBeOnTheScreen();
    expect(screen.getByText('Total: 2 | Concluídas: 0')).toBeOnTheScreen();
    expect(screen.getByTestId('input-tarefa')).toHaveDisplayValue('');

    // Concluir
    await fireEvent.press(screen.getByTestId('check-1'));
    expect(screen.getByText('Total: 2 | Concluídas: 1')).toBeOnTheScreen();

    // Desmarcar
    await fireEvent.press(screen.getByTestId('check-1'));
    expect(screen.getByText('Total: 2 | Concluídas: 0')).toBeOnTheScreen();

    // Excluir
    await fireEvent.press(screen.getByTestId('remover-2'));
    expect(screen.queryByText('Entregar trabalho')).not.toBeOnTheScreen();
    expect(screen.getByText('Total: 1 | Concluídas: 0')).toBeOnTheScreen();
  });
});
