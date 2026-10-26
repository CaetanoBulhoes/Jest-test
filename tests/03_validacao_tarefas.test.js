// TESTE DE VALIDAÇÃO / NEGATIVO – entradas inválidas
import { screen } from '@testing-library/react-native';
import { renderizarLogado, adicionarTarefa } from './helpers/login';

describe('03 - Validação de entrada', () => {
  beforeEach(async () => {
    await renderizarLogado();
  });

  test('tarefa vazia não é adicionada', async () => {
    await adicionarTarefa('');
    expect(screen.getByText('Digite o nome da tarefa')).toBeOnTheScreen();
    expect(screen.getByText('Total: 0 | Concluídas: 0')).toBeOnTheScreen();
  });

  test('tarefa só com espaços não é adicionada', async () => {
    await adicionarTarefa('     ');
    expect(screen.getByText('Digite o nome da tarefa')).toBeOnTheScreen();
    expect(screen.getByText('Total: 0 | Concluídas: 0')).toBeOnTheScreen();
  });

  test('aceita acentuação e caracteres especiais', async () => {
    await adicionarTarefa('Tarefa com acentuação ç ã é e símbolos #@!');
    expect(screen.queryByTestId('aviso-tarefa')).not.toBeOnTheScreen();
    expect(screen.getByText('Tarefa com acentuação ç ã é e símbolos #@!')).toBeOnTheScreen();
    expect(screen.getByText('Total: 1 | Concluídas: 0')).toBeOnTheScreen();
  });

  test('aviso some depois de adicionar uma tarefa válida', async () => {
    await adicionarTarefa('');
    expect(screen.getByTestId('aviso-tarefa')).toBeOnTheScreen();
    await adicionarTarefa('Válida');
    expect(screen.queryByTestId('aviso-tarefa')).not.toBeOnTheScreen();
  });
});
