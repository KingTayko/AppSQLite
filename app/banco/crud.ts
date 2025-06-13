import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { hashPassword, verifyPassword } from './bcrypt';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

// Função para garantir que o banco e tabela existam
async function ensureDatabase() {
  const db = await SQLite.openDatabaseAsync('sistema.db');
  
  // Verifica se a tabela existe
  const tableExists = await db.getFirstAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='usuario'"
  );

  if (!tableExists) {
    await db.execAsync(`
      CREATE TABLE usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        senha TEXT NOT NULL
      );
    `);
    console.log('Tabela usuario criada com sucesso!');
  }
  
  return db;
}

// INSERT NA TABELA USUARIO
export async function insertUsuario(nome: string, email: string, senha: string) {
  try {
    const db = await ensureDatabase();

    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos!');
      return;
    }

    const hashedPassword = await hashPassword(senha);
    await db.runAsync(
      'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)', 
      [nome, email, hashedPassword]
    );
    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso');
  } catch (error) {
    console.error('Erro ao salvar o usuário: ', error);
    Alert.alert('Error', 'Falha ao salvar o usuário');
  }
}

// SELECT NA TABELA USUARIOS
export async function selectUsuarios(): Promise<Usuario[]> {
  try {
    const db = await ensureDatabase();
    const resultados = await db.getAllAsync<Usuario>('SELECT * FROM usuario');
    return resultados;
  } catch(error) {
    console.error('Erro ao buscar usuarios', error);
    return [];
  }
}

// SELECT DE USUÁRIO POR ID
export async function selectUsuarioById(id: number): Promise<Usuario | null> {
  try {
    const db = await ensureDatabase();
    const resultado = await db.getFirstAsync<Usuario>(
      'SELECT * FROM usuario WHERE id = ?', 
      [id]
    );
    return resultado;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
}

// DELETE NA TABELA USUARIO
export async function deleteUsuario(id: number) {
  try {
    const db = await ensureDatabase();
    await db.runAsync('DELETE FROM usuario WHERE id = ?', [id]);
    Alert.alert('Sucesso', 'Usuário excluído com sucesso');
  } catch (error) {
    console.error('Erro ao excluir o usuário', error);
    Alert.alert('Erro', 'Falha ao excluir o usuário.');
  }
}

// UPDATE NA TABELA USUARIO
export async function updateUsuario(
  id: number, 
  nome: string, 
  email: string, 
  senha?: string
) {
  try {
    const db = await ensureDatabase();

    if (!nome || !email) {
      Alert.alert('Erro', 'Por favor preencha todos os campos!');
      return;
    }

    if (senha) {
      const hashedPassword = await hashPassword(senha);
      await db.runAsync(
        'UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?',
        [nome, email, hashedPassword, id]
      );
    } else {
      await db.runAsync(
        'UPDATE usuario SET nome = ?, email = ? WHERE id = ?',
        [nome, email, id]
      );
    }
    
    Alert.alert('Sucesso', 'Usuário atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao editar o usuário: ', error);
    Alert.alert('Error', 'Falha ao editar o usuário.');
  }
}

// LOGIN DE USUÁRIO
export async function loginUsuario(email: string, senha: string) {
  try {
    const db = await SQLite.openDatabaseAsync('sistema.db');
    const usuario = await db.getFirstAsync<Usuario>(
      'SELECT * FROM usuario WHERE email = ? LIMIT 1', 
      [email]
    );
    
    if (!usuario) {
      console.log('Usuário não encontrado para o email:', email);
      return { success: false, message: 'Usuário não encontrado' };
    }

    console.log('Hash armazenado:', usuario.senha);
    const isValid = await verifyPassword(senha, usuario.senha);
    
    if (!isValid) {
      console.log('Senha inválida para o usuário:', email);
      return { success: false, message: 'Senha incorreta' };
    }

    console.log('Login bem-sucedido para:', email);
    return { success: true, user: usuario };
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { success: false, message: 'Erro ao fazer login' };
  }
}

export default {};