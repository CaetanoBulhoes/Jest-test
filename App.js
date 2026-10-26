import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Text, Pressable } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import TarefasScreen from './src/screens/TarefasScreen';
import PostsScreen from './src/screens/PostsScreen';

/**
 * App de exemplo usado para demonstrar a ferramenta de testes Jest.
 * Navegação simples por estado (sem bibliotecas extras) para facilitar o estudo.
 */
export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [aba, setAba] = useState('tarefas');

  if (!usuario) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <LoginScreen onLogin={setUsuario} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.ola} testID="texto-boas-vindas">
          Olá, {usuario}!
        </Text>
        <Pressable testID="botao-sair" onPress={() => setUsuario(null)}>
          <Text style={styles.sair}>Sair</Text>
        </Pressable>
      </View>

      <View style={styles.abas}>
        <Pressable
          testID="aba-tarefas"
          style={[styles.aba, aba === 'tarefas' && styles.abaAtiva]}
          onPress={() => setAba('tarefas')}
        >
          <Text style={[styles.abaTexto, aba === 'tarefas' && styles.abaTextoAtivo]}>Tarefas</Text>
        </Pressable>
        <Pressable
          testID="aba-posts"
          style={[styles.aba, aba === 'posts' && styles.abaAtiva]}
          onPress={() => setAba('posts')}
        >
          <Text style={[styles.abaTexto, aba === 'posts' && styles.abaTextoAtivo]}>Posts (API)</Text>
        </Pressable>
      </View>

      {aba === 'tarefas' ? <TarefasScreen /> : <PostsScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', paddingTop: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  ola: { fontSize: 20, fontWeight: '700', color: '#1E2235' },
  sair: { color: '#D64545', fontWeight: '600' },
  abas: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 8, gap: 8 },
  aba: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#E4E6EF', alignItems: 'center' },
  abaAtiva: { backgroundColor: '#3B5BDB' },
  abaTexto: { color: '#1E2235', fontWeight: '600' },
  abaTextoAtivo: { color: '#FFF' },
});
