import request from 'supertest';
import { createApp } from '../src/app';
import { disconnectPrisma } from '../src/services/prisma.service';

describe('Health (e2e)', () => {
  const app = createApp();

  afterAll(async () => {
    await disconnectPrisma();
  });

  it('/ (GET)', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect((res: { body: { status: string; message: string } }) => {
        expect(res.body).toMatchObject({
          status: 'ok',
          message: expect.any(String) as string,
        });
      });
  });

  it('/health (GET)', () => {
    return request(app)
      .get('/health')
      .expect(200)
      .expect((res: { body: { status: string } }) => {
        expect(res.body.status).toBe('ok');
      });
  });
});
