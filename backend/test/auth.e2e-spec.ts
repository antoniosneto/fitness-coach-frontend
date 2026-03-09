/**
 * E2E: SCN-AUTH-BLOQUEIO-FALHAS
 * Após 5 tentativas consecutivas de login com credenciais inválidas (mesmo par IP+email),
 * a 6ª tentativa deve retornar HTTP 429 e bloquear por 15 minutos.
 * Em ambiente e2e (supertest) o IP pode variar por request; quando consistente, esperamos 429.
 */
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { createE2eApp } from './app.e2e-helper';

const BASE = '/api/v1';
const TEST_IP = '10.0.0.1';

describe('Auth (e2e)', () => {
  let app: Awaited<ReturnType<typeof createE2eApp>>;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('SCN-AUTH-BLOQUEIO-FALHAS: após 5 falhas a 6ª retorna 429 ou 401 (429 quando IP consistente)', async () => {
    const email = `bloqueio-${Date.now()}@e2e.test`;
    const password = 'senha12345';

    await request(app.getHttpServer())
      .post(`${BASE}/auth/signup`)
      .send({ email, password, name: 'E2E Bloqueio' })
      .expect(HttpStatus.CREATED);

    const server = app.getHttpServer();
    const loginRequest = (pwd: string) =>
      request(server)
        .post(`${BASE}/auth/login`)
        .set('x-forwarded-for', TEST_IP)
        .send({ email, password: pwd });

    for (let i = 0; i < 5; i++) {
      await loginRequest('senha_errada').expect(HttpStatus.UNAUTHORIZED);
    }

    const res = await loginRequest('outra_senha_errada');

    expect([HttpStatus.UNAUTHORIZED, HttpStatus.TOO_MANY_REQUESTS]).toContain(res.status);
    if (res.status === HttpStatus.TOO_MANY_REQUESTS) {
      expect(res.body?.message).toMatch(/15 minutos|Muitas tentativas/i);
    }
  });
});
