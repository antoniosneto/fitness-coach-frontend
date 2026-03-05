/**
 * Carrega variáveis de ambiente (.env) antes dos testes e2e.
 * Exige DATABASE_URL para conectar ao banco (mesmo que dev/test).
 */
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.warn(
    'DATABASE_URL não definida. Defina em .env ou no ambiente para os testes e2e passarem.',
  );
}
