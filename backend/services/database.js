const { PrismaClient } = require('@prisma/client');

class DatabaseService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  // User operations
  async createUser(userData) {
    return await this.prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email,
        password_hash: userData.password_hash,
        role: userData.role,
        organization_id: userData.organization_id,
        profile: userData.profile || {}
      }
    });
  }

  async findUserByEmail(email) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { organization: true }
    });
  }

  async findUserById(id) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { organization: true }
    });
  }

  async updateUser(id, data) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
  }

  async deleteUser(id) {
    return await this.prisma.user.delete({
      where: { id }
    });
  }

  // Organization operations
  async createOrganization(orgData) {
    return await this.prisma.organization.create({
      data: {
        id: orgData.id,
        name: orgData.name,
        settings: orgData.settings || {}
      }
    });
  }

  async findOrganizationById(id) {
    return await this.prisma.organization.findUnique({
      where: { id },
      include: { users: true }
    });
  }

  async updateOrganization(id, data) {
    return await this.prisma.organization.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date()
      }
    });
  }

  // Analytics operations
  async createAnalyticsData(analyticsData) {
    return await this.prisma.analyticsData.create({
      data: {
        id: analyticsData.id,
        user_id: analyticsData.user_id,
        analytics_type: analyticsData.analytics_type,
        data: analyticsData.data,
        calculated_at: analyticsData.calculated_at || new Date()
      }
    });
  }

  async findAnalyticsByUserId(userId, analyticsType = null) {
    const where = { user_id: userId };
    if (analyticsType) {
      where.analytics_type = analyticsType;
    }

    return await this.prisma.analyticsData.findMany({
      where,
      orderBy: { calculated_at: 'desc' },
      include: { user: true }
    });
  }

  async findLatestAnalyticsByUserId(userId, analyticsType) {
    return await this.prisma.analyticsData.findFirst({
      where: {
        user_id: userId,
        analytics_type: analyticsType
      },
      orderBy: { calculated_at: 'desc' },
      include: { user: true }
    });
  }

  async deleteAnalyticsData(id) {
    return await this.prisma.analyticsData.delete({
      where: { id }
    });
  }

  // Utility methods
  async cleanTestData() {
    await this.prisma.analyticsData.deleteMany();
    await this.prisma.user.deleteMany();
    await this.prisma.organization.deleteMany();
  }

  async getDatabaseStats() {
    const [userCount, orgCount, analyticsCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.organization.count(),
      this.prisma.analyticsData.count()
    ]);

    return {
      users: userCount,
      organizations: orgCount,
      analytics_records: analyticsCount
    };
  }
}

module.exports = DatabaseService;
