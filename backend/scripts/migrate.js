const { PrismaClient } = require('@prisma/client');

class DatabaseMigration {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async migrate() {
    console.log('🚀 Starting database migration...');
    
    try {
      await this.prisma.$connect();
      console.log('✅ Connected to database');

      // Create initial organization
      const organization = await this.createInitialOrganization();
      console.log('✅ Created initial organization:', organization.id);

      // Create initial users
      const users = await this.createInitialUsers(organization.id);
      console.log('✅ Created initial users:', users.length);

      // Create sample analytics data
      const analytics = await this.createSampleAnalytics(users);
      console.log('✅ Created sample analytics:', analytics.length);

      console.log('🎉 Database migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async createInitialOrganization() {
    return await this.prisma.organization.upsert({
      where: { id: 'org-123' },
      update: {},
      create: {
        id: 'org-123',
        name: 'Learning Analytics Organization',
        settings: {
          timezone: 'UTC',
          analytics_retention_days: 365,
          features: {
            learner_analytics: true,
            trainer_analytics: true,
            organization_analytics: true
          }
        }
      }
    });
  }

  async createInitialUsers(organizationId) {
    const users = [
      {
        id: 'user-123',
        email: 'test@example.com',
        password_hash: process.env.TEST_USER_PASSWORD || 'test-password-123', // Use cloud variable
        role: 'learner',
        organization_id: organizationId,
        profile: {
          first_name: 'John',
          last_name: 'Doe',
          department: 'Engineering'
        }
      },
      {
        id: 'learner-456',
        email: 'learner@example.com',
        password_hash: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'learner',
        organization_id: organizationId,
        profile: {
          first_name: 'Jane',
          last_name: 'Smith',
          department: 'Marketing'
        }
      },
      {
        id: 'trainer-789',
        email: 'trainer@example.com',
        password_hash: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'trainer',
        organization_id: organizationId,
        profile: {
          first_name: 'Mike',
          last_name: 'Johnson',
          department: 'Education'
        }
      },
      {
        id: 'admin-101',
        email: 'admin@example.com',
        password_hash: process.env.TEST_USER_PASSWORD || 'test-password-123',
        role: 'org_admin',
        organization_id: organizationId,
        profile: {
          first_name: 'Sarah',
          last_name: 'Wilson',
          department: 'Administration'
        }
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await this.prisma.user.upsert({
        where: { id: userData.id },
        update: {},
        create: userData
      });
      createdUsers.push(user);
    }

    return createdUsers;
  }

  async createSampleAnalytics(users) {
    const analyticsData = [
      {
        id: 'analytics-learner-123',
        user_id: 'user-123',
        analytics_type: 'learner',
        data: {
          learning_velocity: 85.5,
          mastery_progress: 72.3,
          engagement_score: 91.2,
          assessment_performance: 78.5,
          content_effectiveness: 82.1,
          skill_gaps: [
            { skill: 'JavaScript', priority: 'high', gap_score: 0.3 },
            { skill: 'React', priority: 'medium', gap_score: 0.2 }
          ]
        },
        calculated_at: new Date()
      },
      {
        id: 'analytics-trainer-789',
        user_id: 'trainer-789',
        analytics_type: 'trainer',
        data: {
          course_performance: 88.5,
          course_health: 92.3,
          teaching_effectiveness: 85.7,
          student_distribution: {
            total_students: 150,
            active_students: 120,
            at_risk_students: 15
          }
        },
        calculated_at: new Date()
      },
      {
        id: 'analytics-org-123',
        user_id: 'admin-101',
        analytics_type: 'organization',
        data: {
          learning_velocity: 78.5,
          strategic_alignment: 85.2,
          learning_culture: 91.8,
          department_metrics: {
            engineering: { velocity: 82.1, engagement: 88.5 },
            marketing: { velocity: 75.3, engagement: 79.2 }
          }
        },
        calculated_at: new Date()
      }
    ];

    const createdAnalytics = [];
    for (const analytics of analyticsData) {
      const created = await this.prisma.analyticsData.upsert({
        where: { id: analytics.id },
        update: {},
        create: analytics
      });
      createdAnalytics.push(created);
    }

    return createdAnalytics;
  }

  async rollback() {
    console.log('🔄 Rolling back database migration...');
    
    try {
      await this.prisma.$connect();
      
      // Delete in reverse order to respect foreign key constraints
      await this.prisma.analyticsData.deleteMany();
      await this.prisma.user.deleteMany();
      await this.prisma.organization.deleteMany();
      
      console.log('✅ Database rollback completed');
      
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migration = new DatabaseMigration();
  
  const command = process.argv[2];
  
  if (command === 'rollback') {
    migration.rollback()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  } else {
    migration.migrate()
      .then(() => process.exit(0))
      .catch(() => process.exit(1));
  }
}

module.exports = DatabaseMigration;
