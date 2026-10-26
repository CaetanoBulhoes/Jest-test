import { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';

export default function TarefasScreen() {
  const [texto, setTexto] = useState('');
  const [tarefas, setTarefas] = useState([]);
  const [proximoId, setProximoId] = useState(1);
  const [aviso, setAviso] = useState('');

  function adicionar() {
    const titulo = texto.trim();
    if (!titulo) {
      setAviso('Digite o nome da tarefa');
      return;
    }
    setTarefas((lista) => [{ id: proximoId, titulo, feita: false }, ...lista]);
    setProximoId((n) => n + 1);
    setTexto('');
    setAviso('');
  }

  function alternar(id) {
    setTarefas((lista) => lista.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)));
  }

  function remover(id) {
    setTarefas((lista) => lista.filter((t) => t.id !== id));
  }

  const concluidas = tarefas.filter((t) => t.feita).length;

  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <TextInput
          testID="input-tarefa"
          style={styles.input}
          placeholder="Nova tarefa"
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={adicionar}
        />
        <Pressable testID="botao-adicionar" style={styles.botao} onPress={adicionar}>
          <Text style={styles.botaoTexto}>+</Text>
        </Pressable>
      </View>

      {aviso ? <Text style={styles.aviso} testID="aviso-tarefa">{aviso}</Text> : null}

      <Text style={styles.contador} testID="contador-tarefas">
        Total: {tarefas.length} | Concluídas: {concluidas}
      </Text>

      <FlatList
        testID="lista-tarefas"
        data={tarefas}
        keyExtractor={(t) => String(t.id)}
        ListEmptyComponent={
          <Text style={styles.vazio} testID="lista-vazia">Nenhuma tarefa cadastrada</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item} testID={`tarefa-${item.id}`}>
            <Pressable
              testID={`check-${item.id}`}
              onPress={() => alternar(item.id)}
              style={[styles.check, item.feita && styles.checkFeito]}
            >
              {item.feita ? <Text style={styles.checkMarca}>✓</Text> : null}
            </Pressable>
            <Text style={[styles.itemTexto, item.feita && styles.itemFeito]}>{item.titulo}</Text>
            <Pressable testID={`remover-${item.id}`} onPress={() => remover(item.id)}>
              <Text style={styles.remover}>Excluir</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  linha: { flexDirection: 'row', gap: 8, marginTop: 8 },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D5D8E3',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  botao: { width: 50, backgroundColor: '#2F9E44', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  botaoTexto: { color: '#FFF', fontSize: 26, fontWeight: '700' },
  aviso: { color: '#D64545', marginTop: 6, fontWeight: '600' },
  contador: { marginVertical: 12, color: '#6B7085', fontWeight: '600' },
  vazio: { textAlign: 'center', color: '#9A9EB0', marginTop: 40 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
  },
  check: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#3B5BDB', alignItems: 'center', justifyContent: 'center' },
  checkFeito: { backgroundColor: '#3B5BDB' },
  checkMarca: { color: '#FFF', fontWeight: '800' },
  itemTexto: { flex: 1, fontSize: 16, color: '#1E2235' },
  itemFeito: { textDecorationLine: 'line-through', color: '#9A9EB0' },
  remover: { color: '#D64545', fontWeight: '600' },
});
