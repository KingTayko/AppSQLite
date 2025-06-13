import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { insertUsuario } from './banco/crud';
import { Link, useRouter } from 'expo-router';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleCadastro() {
    if (!nome || !email || !senha) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      await insertUsuario(nome, email, senha);
      router.push('/');
    } catch (err) {
      setError('Erro ao cadastrar usuário');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      
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
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      
      <Button title="Cadastrar" onPress={handleCadastro} />
      
      <Link href="/login" asChild>
        <Text style={styles.link}>Já tem conta? Faça login</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  error: {
    color: '#e53935',
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: '#1e88e5',
    marginTop: 24,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
