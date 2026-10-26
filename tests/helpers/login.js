// Helper reutilizável: renderiza o app limpo e faz login válido
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../../App';

export async function renderizarLogado() {
  await render(<App />);
  expect(screen.getByTestId('titulo-login')).toBeOnTheScreen();
  await fireEvent.changeText(screen.getByTestId('input-email'), 'aluno@teste.com');
  await fireEvent.changeText(screen.getByTestId('input-senha'), '123456');
  await fireEvent.press(screen.getByTestId('botao-entrar'));
  expect(screen.getByText('Olá, aluno!')).toBeOnTheScreen();
}

// Digita uma tarefa e toca no botão "+"
export async function adicionarTarefa(titulo) {
  await fireEvent.changeText(screen.getByTestId('input-tarefa'), titulo);
  await fireEvent.press(screen.getByTestId('botao-adicionar'));
}

// Simula a rolagem da FlatList para que ela renderize itens fora da área visível
export async function rolarAteOFim(testID) {
  const lista = screen.getByTestId(testID);
  await fireEvent(lista, 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width: 400, height: 100000 } },
  });
  await fireEvent(lista, 'contentSizeChange', 400, 100000);
  await fireEvent.scroll(lista, {
    nativeEvent: {
      contentOffset: { y: 100000 },
      contentSize: { height: 100000, width: 400 },
      layoutMeasurement: { height: 100000, width: 400 },
    },
  });
}
