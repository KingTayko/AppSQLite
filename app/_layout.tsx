import { Stack } from 'expo-router/stack';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

async function initializeDatabase() {
  try {
    const db = await SQLite.openDatabaseAsync('sistema.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS usuario (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        senha TEXT NOT NULL
      );
    `);
    console.log('Banco inicializado!');
  } catch (error) {
    console.error('Erro no banco:', error);
  }
}

export default function Layout() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <SQLiteProvider databaseName="sistema.db">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="index" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="editar/[id]"/>
      </Stack>
    </SQLiteProvider>
  );  
}