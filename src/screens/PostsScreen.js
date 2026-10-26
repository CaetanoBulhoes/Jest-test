import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable, StyleSheet } from 'react-native';

// API pública de testes – a mesma usada no teste de carga (tests/06_carga_api.test.js)
export const API_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function PostsScreen() {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tempoMs, setTempoMs] = useState(null);

  async function carregar() {
    setCarregando(true);
    setErro('');
    const inicio = Date.now();
    try {
      const resp = await fetch(`${API_URL}?_limit=20`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      setPosts(await resp.json());
      setTempoMs(Date.now() - inicio);
    } catch (e) {
      setErro('Falha ao carregar posts: ' + e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" testID="carregando-posts" />
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro} testID="erro-posts">{erro}</Text>
        <Pressable testID="botao-tentar-novamente" onPress={carregar} style={styles.botao}>
          <Text style={styles.botaoTexto}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Text style={styles.info} testID="info-posts">
          {posts.length} posts carregados em {tempoMs} ms
        </Text>
        <Pressable testID="botao-recarregar" onPress={carregar}>
          <Text style={styles.link}>Recarregar</Text>
        </Pressable>
      </View>
      <FlatList
        testID="lista-posts"
        data={posts}
        keyExtractor={(p) => String(p.id)}
        renderItem={({ item }) => (
          <View style={styles.card} testID={`post-${item.id}`}>
            <Text style={styles.cardTitulo}>#{item.id} {item.title}</Text>
            <Text style={styles.cardCorpo} numberOfLines={2}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  topo: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  info: { color: '#6B7085', fontWeight: '600' },
  link: { color: '#3B5BDB', fontWeight: '600' },
  card: { backgroundColor: '#FFF', padding: 14, borderRadius: 10, marginBottom: 8 },
  cardTitulo: { fontWeight: '700', color: '#1E2235', marginBottom: 4 },
  cardCorpo: { color: '#6B7085' },
  erro: { color: '#D64545', textAlign: 'center', marginBottom: 12 },
  botao: { backgroundColor: '#3B5BDB', padding: 12, borderRadius: 8 },
  botaoTexto: { color: '#FFF', fontWeight: '700' },
});
