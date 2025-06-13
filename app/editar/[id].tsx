import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateUsuario, selectUsuarioById } from '../banco/crud';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function EditarUsuario() {
  const { id } = useLocalSearchParams();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function carregarUsuario() {
      const usuario = await selectUsuarioById(Number(id)) as { nome: string; email: string } | null;
      if (usuario) {
        setNome(usuario.nome);
        setEmail(usuario.email);
      }
    }
    carregarUsuario();
  }, [id]);

  async function handleAtualizar() {
    if (!nome || !email) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      await updateUsuario(Number(id), nome, email);
      router.push('/');
    } catch (err) {
      setError('Erro ao atualizar usuário');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Usuário</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Button title="Atualizar" onPress={handleAtualizar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});