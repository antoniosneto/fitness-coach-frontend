/**
 * E2E: SCN-GOAL-METAS-MEDIUM
 * PUT goals com meta válida (taxa ≤ 1,5%/semana) → 200.
 * PUT goals com meta insegura (taxa > 1,5%/semana) → 422.
 */
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { createE2eApp } from './app.e2e-helper';

const BASE = '/api/v1';

describe('Goals (e2e)', () => {
  let app: Awaited<ReturnType<typeof createE2eApp>>;
  let token: string;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  const signupLoginAndProfile = async () => {
    const email = `goals-${Date.now()}@e2e.test`;
    const password = 'senha12345';
    await request(app.getHttpServer())
      .post(`${BASE}/auth/signup`)
      .send({ email, password, name: 'E2E Goals' })
      .expect(HttpStatus.CREATED);

    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email, password })
      .expect(HttpStatus.OK);
    token = loginRes.body.access_token;

    await request(app.getHttpServer())
      .put(`${BASE}/onboarding/profile`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'E2E Goals',
        sex: 'male',
        birth_date: '1990-01-01',
        weight_kg: 99,
        height_cm: 180,
        body_fat_percentage: 25,
      })
      .expect(HttpStatus.OK);
  };

  it('SCN-GOAL-METAS-MEDIUM: meta válida (taxa ≤ 1,5%/semana) retorna 200', async () => {
    await signupLoginAndProfile();

    await request(app.getHttpServer())
      .put(`${BASE}/onboarding/goals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        current_weight_kg: 99,
        current_body_fat_percent: 25,
        target_weight_kg: 88,
        target_body_fat_percent: 14,
        months_to_target: 7,
        intensity: 'medium',
      })
      .expect(HttpStatus.OK);
  });

  it('SCN-GOAL-METAS-MEDIUM: meta insegura (taxa > 1,5%/semana) retorna 422', async () => {
    await signupLoginAndProfile();

    const res = await request(app.getHttpServer())
      .put(`${BASE}/onboarding/goals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        current_weight_kg: 99,
        current_body_fat_percent: 25,
        target_weight_kg: 70,
        target_body_fat_percent: 14,
        months_to_target: 2,
        intensity: 'medium',
      });

    expect(res.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(res.body?.message).toMatch(/1\.5|limite seguro|Taxa de perda/i);
  });
});
