import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { USER_ROLE } from '../models/user.model';

class UserService {
  private static instance: UserService;
  private keycloak: KeycloakInstance | undefined;

  private constructor() {
    // Private constructor to enforce singleton
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  initKeycloak({
    realm,
    url,
    clientId,
    onAuthenticatedCallback,
  }: {
    realm: string;
    url: string;
    clientId: string;
    onAuthenticatedCallback: () => void;
  }) {
    this.keycloak = new Keycloak({
      realm,
      url,
      clientId,
    });

    this.keycloak
      .init({
        onLoad: 'login-required',
      })
      .then((authenticated) => {
        if (authenticated) {
          onAuthenticatedCallback();
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization error:', error);
      });
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }

  doLogin(): void {
    this.keycloak?.login();
  }

  doLogout(): void {
    this.keycloak?.logout();
  }

  async updateToken<T>(successCallback?: () => Promise<T>): Promise<T | void> {
    try {
      await this.keycloak?.updateToken(5);
      if (successCallback) {
        return successCallback();
      }
    } catch (error) {
      console.error('Token update error:', error);
      this.doLogin();
    }
  }

  getUsername(): string {
    return this.keycloak?.tokenParsed?.preferred_username ?? 'Guest';
  }

  getEmail(): string | undefined {
    return this.keycloak?.tokenParsed?.email;
  }

  hasRole(roles: USER_ROLE[]): boolean {
    return roles.some((role) => this.keycloak?.hasRealmRole(role));
  }

  isAdmin(): boolean {
    return this.hasRole([USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN]);
  }

  isSystemAdmin(): boolean {
    return this.hasRole([USER_ROLE.SYSTEM_ADMIN]);
  }

  isAppAdmin(): boolean {
    return this.hasRole([USER_ROLE.APP_ADMIN]);
  }

  isAppUser(): boolean {
    return this.hasRole([USER_ROLE.APP_USER]);
  }

  getCustomRoles(): USER_ROLE[] {
    const allRoles = this.keycloak?.realmAccess?.roles ?? [];
    return allRoles.filter(
      (role) => !['offline_access', 'uma_authorization'].includes(role)
    ) as USER_ROLE[];
  }
}

// Export a singleton instance
export default UserService.getInstance();
