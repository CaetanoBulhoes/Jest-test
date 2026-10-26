// TESTE DE INTEGRAÇÃO – tela que consome a API REST
// O fetch é simulado (mock) para o teste não depender da rede e poder forçar erros.
import { screen, fireEvent } from '@testing-library/react-native';
import { renderizarLogado, rolarAteOFim } from './helpers/login';
import { API_URL } from '../src/screens/PostsScreen';

const POSTS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Título ${i + 1}`,
  body: `Corpo do post ${i + 1}`,
}));

function respostaOk(dados) {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(dados) });
}

describe('04 - Integração com API (posts)', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => respostaOk(POSTS));
  });

  afterEach(() => {
    delete global.fetch;
  });

  async function abrirPosts() {
    await renderizarLogado();
    await fireEvent.press(screen.getByTestId('aba-posts'));
  }

  test('carrega e exibe os 20 posts', async () => {
    await abrirPosts();
    expect(await screen.findByTestId('lista-posts')).toBeOnTheScreen();
    expect(global.fetch).toHaveBeenCalledWith(`${API_URL}?_limit=20`);
    expect(screen.getByText(/^20 posts carregados em \d+ ms$/)).toBeOnTheScreen();
    expect(screen.getByTestId('post-1')).toBeOnTheScreen();

    // Rolagem até o último item
    await rolarAteOFim('lista-posts');
    expect(await screen.findByTestId('post-20')).toBeOnTheScreen();
  });

  test('recarregar busca os dados de novo', async () => {
    await abrirPosts();
    await screen.findByTestId('lista-posts');
    await fireEvent.press(screen.getByTestId('botao-recarregar'));
    expect(await screen.findByTestId('lista-posts')).toBeOnTheScreen();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('mostra erro quando a API falha e permite tentar novamente', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({ ok: false, status: 500 }))
      .mockImplementationOnce(() => respostaOk(POSTS));

    await abrirPosts();
    expect(await screen.findByText('Falha ao carregar posts: HTTP 500')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('botao-tentar-novamente'));
    expect(await screen.findByTestId('lista-posts')).toBeOnTheScreen();
  });

  test('mostra erro quando não há conexão', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network request failed')));

    await abrirPosts();
    expect(
      await screen.findByText('Falha ao carregar posts: Network request failed'),
    ).toBeOnTheScreen();
  });
});
