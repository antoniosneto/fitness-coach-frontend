/**
 * E2E: SCN-TRAIN-ROTINA-MAQUINAS
 * Onboarding completo + PUT training-preferences (machines_only: true) + POST /plans/weekly
 * → 201; body com summary.weekly_training (Segunda descanso, Quinta/Domingo pernas, Sábado upper, Sexta descanso ativo) e summary.machines_only.
 */
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { createE2eApp } from './app.e2e-helper';

const BASE = '/api/v1';

describe('Plans (e2e)', () => {
  let app: Awaited<ReturnType<typeof createE2eApp>>;
  let token: string;

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  const fullOnboarding = async () => {
    const email = `plans-${Date.now()}@e2e.test`;
    const password = 'senha12345';
    await request(app.getHttpServer())
      .post(`${BASE}/auth/signup`)
      .send({ email, password, name: 'E2E Plans' })
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
        name: 'E2E Plans',
        sex: 'male',
        birth_date: '1990-01-01',
        weight_kg: 80,
        height_cm: 175,
        body_fat_percentage: 22,
      })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .put(`${BASE}/onboarding/goals`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        current_weight_kg: 80,
        current_body_fat_percent: 22,
        target_weight_kg: 75,
        target_body_fat_percent: 18,
        months_to_target: 6,
        intensity: 'medium',
      })
      .expect(HttpStatus.OK);

    await request(app.getHttpServer())
      .put(`${BASE}/onboarding/training-preferences`)
      .set('Authorization', `Bearer ${token}`)
      .send({ machines_only: true })
      .expect(HttpStatus.OK);
  };

  it('SCN-TRAIN-ROTINA-MAQUINAS: POST /plans/weekly retorna 201 com weekly_training e machines_only', async () => {
    await fullOnboarding();

    const res = await request(app.getHttpServer())
      .post(`${BASE}/plans/weekly`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CREATED);

    expect(res.body).toHaveProperty('weekly_plan_id');
    expect(res.body).toHaveProperty('summary');
    expect(res.body.summary).toHaveProperty('weekly_training');
    expect(res.body.summary).toHaveProperty('machines_only', true);

    const wt = res.body.summary.weekly_training;
    expect(Array.isArray(wt)).toBe(true);

    const byDay = (wt as { day_of_week: number; day_name: string; type: string; description: string }[]).reduce(
      (acc, d) => {
        acc[d.day_of_week] = d;
        return acc;
      },
      {} as Record<number, { day_name: string; type: string; description: string }>,
    );

    expect(byDay[1]?.type).toBe('rest');
    expect(byDay[1]?.day_name).toBe('Segunda');
    expect(byDay[4]?.type).toBe('legs');
    expect(byDay[5]?.type).toBe('active_rest');
    expect(byDay[6]?.type).toBe('upper_body');
    expect(byDay[7]?.type).toBe('legs');
  });

  it('POST /plans/weekly sem onboarding completo retorna 422', async () => {
    const email = `plans-incomplete-${Date.now()}@e2e.test`;
    const password = 'senha12345';
    await request(app.getHttpServer())
      .post(`${BASE}/auth/signup`)
      .send({ email, password, name: 'E2E Incomplete' })
      .expect(HttpStatus.CREATED);

    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email, password })
      .expect(HttpStatus.OK);
    const t = loginRes.body.access_token;

    await request(app.getHttpServer())
      .post(`${BASE}/plans/weekly`)
      .set('Authorization', `Bearer ${t}`)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY);
  });
});
