import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

// Credenciais fixas apenas para fins de demonstração dos testes
const EMAIL_VALIDO = 'aluno@teste.com';
const SENHA_VALIDA = '123456';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function entrar() {
    if (!email || !senha) {
      setErro('Preencha e-mail e senha');
      return;
    }
    if (!email.includes('@')) {
      setErro('E-mail inválido');
      return;
    }
    if (email.trim().toLowerCase() !== EMAIL_VALIDO || senha !== SENHA_VALIDA) {
      setErro('Credenciais incorretas');
      return;
    }
    setErro('');
    onLogin(email.split('@')[0]);
  }

  return (
    <View style={styles.box}>
      <Text style={styles.titulo} testID="titulo-login">Tarefas Jest</Text>
      <Text style={styles.subtitulo}>Faça login para continuar</Text>

      <TextInput
        testID="input-email"
        style={styles.input}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        testID="input-senha"
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {erro ? (
        <Text style={styles.erro} testID="mensagem-erro">{erro}</Text>
      ) : null}

      <Pressable testID="botao-entrar" style={styles.botao} onPress={entrar}>
        <Text style={styles.botaoTexto}>Entrar</Text>
      </Pressable>

      <Text style={styles.dica}>Use: {EMAIL_VALIDO} / {SENHA_VALIDA}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 30, fontWeight: '800', color: '#1E2235', textAlign: 'center' },
  subtitulo: { fontSize: 15, color: '#6B7085', textAlign: 'center', marginBottom: 28 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D5D8E3',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  erro: { color: '#D64545', marginBottom: 12, textAlign: 'center', fontWeight: '600' },
  botao: { backgroundColor: '#3B5BDB', padding: 15, borderRadius: 10, alignItems: 'center' },
  botaoTexto: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  dica: { marginTop: 20, textAlign: 'center', color: '#9A9EB0', fontSize: 12 },
});
