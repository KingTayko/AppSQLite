import * as Crypto from 'expo-crypto';

export async function hashPassword(password: string): Promise<string> {
  const salt = await Crypto.randomUUID();
  const hashedPassword = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + salt
  );
  return `${salt}$${hashedPassword}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [salt, originalHash] = storedHash.split('$');
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password + salt
    );
    return hashedPassword === originalHash;
  } catch (error) {
    console.error('Erro na verificação da senha:', error);
    return false;
  }
}

export default {};