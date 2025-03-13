interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  isAdmin: boolean;
  token: string;
}

class UserService {
  private static instance: UserService;
  private user: User | null = null;

  private constructor() {
    // Private constructor to enforce singleton
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  setUser(userData: User): void {
    this.user = userData;
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  }

  getToken(): string | undefined {
    return this.user?.token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  doLogout(): void {
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUsername(): string {
    return this.user?.username ?? 'Guest';
  }

  getEmail(): string | undefined {
    return this.user?.email;
  }

  isAdmin(): boolean {
    return this.user?.isAdmin ?? false;
  }

  getUser(): User | null {
    return this.user;
  }
}

// Export a singleton instance
export default UserService.getInstance();
