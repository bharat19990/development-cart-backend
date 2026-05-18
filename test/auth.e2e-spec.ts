import request from 'supertest';
import { createApp } from '../src/app';
import { Role } from '../src/enums/role.enum';
import { disconnectPrisma } from '../src/services/prisma.service';

describe('Auth (e2e)', () => {
  const app = createApp();
  let accessToken: string;

  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'password123',
    role: Role.ADMIN,
  };

  afterAll(async () => {
    await disconnectPrisma();
  });

  it('POST /auth/register', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const body = res.body as {
      accessToken: string;
      user: { email: string; role: Role };
    };

    expect(body).toMatchObject({
      accessToken: expect.any(String) as string,
      user: {
        email: testUser.email,
        role: Role.ADMIN,
      },
    });

    accessToken = body.accessToken;
  });

  it('POST /auth/login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    const body = res.body as { accessToken: string };

    expect(body.accessToken).toBeDefined();
    accessToken = body.accessToken;
  });

  it('GET /users/me (protected)', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res: { body: { user: { email: string } } }) => {
        expect(res.body.user.email).toBe(testUser.email);
      });
  });

  it('GET /users/me without token returns 401', async () => {
    await request(app).get('/users/me').expect(401);
  });

  it('GET /users/admin (role-protected)', async () => {
    await request(app)
      .get('/users/admin')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('GET /users/organization returns 403 for ADMIN', async () => {
    await request(app)
      .get('/users/organization')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});
