import { User } from './User';

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create a user with valid data', () => {
      const userData = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: true
      };

      const user = new User(userData);

      expect(user.id).toBe('user-123');
      expect(user.email).toBe('test@example.com');
      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.organizationId).toBe('org-123');
      expect(user.roles).toEqual(['learner']);
      expect(user.isActive).toBe(true);
    });

    it('should throw error for invalid email', () => {
      const userData = {
        id: 'user-123',
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: true
      };

      expect(() => new User(userData)).toThrow('Invalid email format');
    });

    it('should throw error for empty roles array', () => {
      const userData = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: [],
        isActive: true
      };

      expect(() => new User(userData)).toThrow('User must have at least one role');
    });

    it('should throw error for missing required fields', () => {
      const userData = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: true
      };

      // Test missing id
      expect(() => new User({ ...userData, id: undefined })).toThrow('User ID is required');
      
      // Test missing email
      expect(() => new User({ ...userData, email: undefined })).toThrow('Email is required');
      
      // Test missing firstName
      expect(() => new User({ ...userData, firstName: undefined })).toThrow('First name is required');
      
      // Test missing lastName
      expect(() => new User({ ...userData, lastName: undefined })).toThrow('Last name is required');
      
      // Test missing organizationId
      expect(() => new User({ ...userData, organizationId: undefined })).toThrow('Organization ID is required');
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the role', () => {
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner', 'trainer'],
        isActive: true
      });

      expect(user.hasRole('learner')).toBe(true);
      expect(user.hasRole('trainer')).toBe(true);
    });

    it('should return false if user does not have the role', () => {
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: true
      });

      expect(user.hasRole('trainer')).toBe(false);
      expect(user.hasRole('org_admin')).toBe(false);
    });
  });

  describe('getFullName', () => {
    it('should return full name', () => {
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: true
      });

      expect(user.getFullName()).toBe('John Doe');
    });
  });

  describe('isActiveUser', () => {
    it('should return true for active user', () => {
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: true
      });

      expect(user.isActiveUser()).toBe(true);
    });

    it('should return false for inactive user', () => {
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: false
      });

      expect(user.isActiveUser()).toBe(false);
    });
  });

  describe('canAccessRole', () => {
    it('should return true if user can access the role', () => {
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner', 'trainer'],
        isActive: true
      });

      expect(user.canAccessRole('learner')).toBe(true);
      expect(user.canAccessRole('trainer')).toBe(true);
    });

    it('should return false if user cannot access the role', () => {
      const user = new User({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        organizationId: 'org-123',
        roles: ['learner'],
        isActive: true
      });

      expect(user.canAccessRole('trainer')).toBe(false);
      expect(user.canAccessRole('org_admin')).toBe(false);
    });
  });
});
