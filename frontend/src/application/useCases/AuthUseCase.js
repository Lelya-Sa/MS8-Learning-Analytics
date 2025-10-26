/**
 * @class AuthUseCase
 * @description Use case for authentication operations
 */
export class AuthUseCase {
  constructor(authRepository, tokenService) {
    this.authRepository = authRepository;
    this.tokenService = tokenService;
  }

  async login(credentials) {
    try {
      const result = await this.authRepository.login(credentials);
      return result;
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async logout(refreshToken) {
    try {
      const result = await this.authRepository.logout(refreshToken);
      return result;
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async refreshToken(refreshToken) {
    try {
      const result = await this.authRepository.refreshToken(refreshToken);
      return result;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.authRepository.getCurrentUser();
      return user;
    } catch (error) {
      throw new Error(`Get current user failed: ${error.message}`);
    }
  }

  async validateToken(token) {
    try {
      const isValid = await this.tokenService.validateToken(token);
      return isValid;
    } catch (error) {
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }
}
