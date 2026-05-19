export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
  enrollmentFeeUsd: parseFloat(process.env.ENROLLMENT_FEE_USD ?? '100'),
  sessionDurationDays: parseInt(process.env.SESSION_DURATION_DAYS ?? '30', 10),
  superadminEmail: process.env.SUPERADMIN_EMAIL ?? 'superadmin@system.local',
  superadminPassword: process.env.SUPERADMIN_PASSWORD ?? 'SuperAdmin123!',
});
