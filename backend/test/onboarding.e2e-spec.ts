/**
 * E2E: SCN-ONB-BIOTIPO-VISUAL
 * PUT profile com body_fat_visual_id (ex.: "25") deve persistir o valor numérico em body_fat_percentage.
 */
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { createE2eApp } from './app.e2e-helper';

const BASE = '/api/v1';

describe('Onboarding (e2e)', () => {
  let app: Awaited<ReturnType<typeof createE2eApp>>;
  let prisma: PrismaService;
  let token: string;
  let userId: string;

  beforeAll(async () => {
    app = await createE2eApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  const signupAndLogin = async () => {
    const email = `biotipo-${Date.now()}@e2e.test`;
    const password = 'senha12345';
    await request(app.getHttpServer())
      .post(`${BASE}/auth/signup`)
      .send({ email, password, name: 'E2E Biotipo' })
      .expect(HttpStatus.CREATED);

    const loginRes = await request(app.getHttpServer())
      .post(`${BASE}/auth/login`)
      .send({ email, password })
      .expect(HttpStatus.OK);
    token = loginRes.body.access_token;

    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    );
    userId = payload.sub;
  };

  it('SCN-ONB-BIOTIPO-VISUAL: body_fat_visual_id persiste em body_fat_percentage', async () => {
    await signupAndLogin();

    await request(app.getHttpServer())
      .put(`${BASE}/onboarding/profile`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'E2E Biotipo',
        sex: 'male',
        birth_date: '1990-05-15',
        weight_kg: 80,
        height_cm: 175,
        body_fat_visual_id: '25',
      })
      .expect(HttpStatus.OK);

    const profile = await prisma.userProfile.findFirst({
      where: { userId },
    });
    expect(profile).toBeDefined();
    expect(profile?.bodyFatPercentage).toBe(25);
  });
});
