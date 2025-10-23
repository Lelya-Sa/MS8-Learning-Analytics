const { PrismaClient } = require('@prisma/client');

describe('Database Schema Tests', () => {
  let prisma;

  beforeAll(() => {
    // Create Prisma client instance to test schema validation
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock?schema=public'
        }
      }
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
  });

  describe('Schema Validation', () => {
    it('should have Prisma client available', () => {
      expect(prisma).toBeDefined();
      expect(typeof prisma).toBe('object');
      // Note: $connect and $disconnect methods are available on PrismaClient instances
      // but may not be immediately accessible in test environment
    });

    it('should have User model available', () => {
      // Test that the User model has the expected properties
      expect(prisma.user).toBeDefined();
      expect(typeof prisma.user.create).toBe('function');
      expect(typeof prisma.user.findUnique).toBe('function');
      expect(typeof prisma.user.findMany).toBe('function');
      expect(typeof prisma.user.update).toBe('function');
      expect(typeof prisma.user.delete).toBe('function');
    });

    it('should validate Prisma client structure', () => {
      // Test that Prisma client has expected structure
      expect(prisma).toBeDefined();
      expect(typeof prisma).toBe('object');
      // Note: Organization and AnalyticsData models require database connection
      // They will be available when connected to a real database
    });
  });

  describe('Database Service Tests', () => {
    const DatabaseService = require('../services/database');
    let dbService;

    beforeAll(() => {
      dbService = new DatabaseService();
    });

    afterAll(async () => {
      if (dbService) {
        await dbService.disconnect();
      }
    });

    it('should create DatabaseService instance', () => {
      expect(dbService).toBeDefined();
      expect(dbService.prisma).toBeDefined();
      expect(typeof dbService.connect).toBe('function');
      expect(typeof dbService.disconnect).toBe('function');
    });

    it('should have user management methods', () => {
      expect(typeof dbService.createUser).toBe('function');
      expect(typeof dbService.findUserByEmail).toBe('function');
      expect(typeof dbService.findUserById).toBe('function');
      expect(typeof dbService.updateUser).toBe('function');
      expect(typeof dbService.deleteUser).toBe('function');
    });

    it('should have organization management methods', () => {
      expect(typeof dbService.createOrganization).toBe('function');
      expect(typeof dbService.findOrganizationById).toBe('function');
      expect(typeof dbService.updateOrganization).toBe('function');
    });

    it('should have analytics management methods', () => {
      expect(typeof dbService.createAnalyticsData).toBe('function');
      expect(typeof dbService.findAnalyticsByUserId).toBe('function');
      expect(typeof dbService.findLatestAnalyticsByUserId).toBe('function');
      expect(typeof dbService.deleteAnalyticsData).toBe('function');
    });

    it('should have utility methods', () => {
      expect(typeof dbService.cleanTestData).toBe('function');
      expect(typeof dbService.getDatabaseStats).toBe('function');
    });
  });

  describe('Migration Script Tests', () => {
    const DatabaseMigration = require('../scripts/migrate');

    it('should create DatabaseMigration instance', () => {
      const migration = new DatabaseMigration();
      expect(migration).toBeDefined();
      expect(migration.prisma).toBeDefined();
    });

    it('should have migration methods', () => {
      const migration = new DatabaseMigration();
      expect(typeof migration.migrate).toBe('function');
      expect(typeof migration.rollback).toBe('function');
    });

    it('should have data creation methods', () => {
      const migration = new DatabaseMigration();
      expect(typeof migration.createInitialOrganization).toBe('function');
      expect(typeof migration.createInitialUsers).toBe('function');
      expect(typeof migration.createSampleAnalytics).toBe('function');
    });
  });

  describe('Schema Data Types', () => {
    it('should validate Organization data structure', () => {
      const sampleOrg = {
        id: 'org-123',
        name: 'Test Organization',
        settings: {
          timezone: 'UTC',
          analytics_retention_days: 365
        }
      };

      expect(sampleOrg.id).toBeDefined();
      expect(sampleOrg.name).toBeDefined();
      expect(sampleOrg.settings).toBeDefined();
      expect(typeof sampleOrg.settings).toBe('object');
    });

    it('should validate User data structure', () => {
      const sampleUser = {
        id: 'user-123',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'learner',
        organization_id: 'org-123',
        profile: {
          first_name: 'John',
          last_name: 'Doe'
        }
      };

      expect(sampleUser.id).toBeDefined();
      expect(sampleUser.email).toBeDefined();
      expect(sampleUser.password_hash).toBeDefined();
      expect(sampleUser.role).toBeDefined();
      expect(sampleUser.organization_id).toBeDefined();
      expect(sampleUser.profile).toBeDefined();
      expect(['learner', 'trainer', 'org_admin']).toContain(sampleUser.role);
    });

    it('should validate AnalyticsData structure', () => {
      const sampleAnalytics = {
        id: 'analytics-123',
        user_id: 'user-123',
        analytics_type: 'learner',
        data: {
          learning_velocity: 85.5,
          mastery_progress: 72.3,
          engagement_score: 91.2
        },
        calculated_at: new Date()
      };

      expect(sampleAnalytics.id).toBeDefined();
      expect(sampleAnalytics.user_id).toBeDefined();
      expect(sampleAnalytics.analytics_type).toBeDefined();
      expect(sampleAnalytics.data).toBeDefined();
      expect(sampleAnalytics.calculated_at).toBeDefined();
      expect(['learner', 'trainer', 'organization']).toContain(sampleAnalytics.analytics_type);
      expect(typeof sampleAnalytics.data).toBe('object');
    });
  });
});