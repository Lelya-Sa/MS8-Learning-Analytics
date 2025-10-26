/**
 * @file OrganizationLearningVelocity Entity
 * @description OrganizationLearningVelocity domain entity following Onion Architecture
 */
export class OrganizationLearningVelocity {
  constructor(orgData) {
    this.organizationId = orgData.organizationId;
    this.averageVelocity = orgData.averageVelocity;
    this.departmentMetrics = orgData.departmentMetrics;
    this.lastUpdated = orgData.lastUpdated || new Date();
  }

  toJSON() {
    return {
      organizationId: this.organizationId,
      averageVelocity: this.averageVelocity,
      departmentMetrics: this.departmentMetrics,
      lastUpdated: this.lastUpdated
    };
  }
}
