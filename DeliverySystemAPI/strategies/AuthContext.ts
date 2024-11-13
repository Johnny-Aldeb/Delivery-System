import { User } from "../models";

export interface AuthStrategy {
  generateToken(user: any): string;
  verifyToken(token: string): any;
}

class AuthContext {
  private strategy: AuthStrategy;

  constructor(strategy: AuthStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: AuthStrategy) {
    this.strategy = strategy;
  }

  generateToken(user: User) {
    return this.strategy.generateToken(user);
  }

  verifyToken(token: string) {
    return this.strategy.verifyToken(token);
  }
}

export default AuthContext;
