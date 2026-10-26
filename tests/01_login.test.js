// TESTE FUNCIONAL – Tela de login (smoke)
import { render, screen, fireEvent } from '@testing-library/react-native';
import App from '../App';

async function preencher(email, senha) {
  await fireEvent.changeText(screen.getByTestId('input-email'), email);
  await fireEvent.changeText(screen.getByTestId('input-senha'), senha);
  await fireEvent.press(screen.getByTestId('botao-entrar'));
}

describe('01 - Login (cenários válidos e inválidos)', () => {
  beforeEach(async () => {
    await render(<App />);
  });

  test('exibe a tela de login', () => {
    expect(screen.getByText('Tarefas Jest')).toBeOnTheScreen();
  });

  test('cenário 1: campos vazios', async () => {
    await fireEvent.press(screen.getByTestId('botao-entrar'));
    expect(screen.getByText('Preencha e-mail e senha')).toBeOnTheScreen();
  });

  test('cenário 2: e-mail sem @', async () => {
    await preencher('alunoteste.com', '123456');
    expect(screen.getByText('E-mail inválido')).toBeOnTheScreen();
  });

  test('cenário 3: senha errada', async () => {
    await preencher('aluno@teste.com', '000000');
    expect(screen.getByText('Credenciais incorretas')).toBeOnTheScreen();
  });

  test('cenário 4: login correto', async () => {
    await preencher('aluno@teste.com', '123456');
    expect(screen.getByText('Olá, aluno!')).toBeOnTheScreen();
    expect(screen.queryByTestId('mensagem-erro')).not.toBeOnTheScreen();
  });

  test('cenário 5: logout volta para o login', async () => {
    await preencher('aluno@teste.com', '123456');
    await fireEvent.press(screen.getByTestId('botao-sair'));
    expect(screen.getByTestId('titulo-login')).toBeOnTheScreen();
  });
});
