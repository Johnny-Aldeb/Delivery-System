import { User } from "../models";

const sessions = new Map();

export class SessionStrategy {
  generateToken(user: User) {
    const sessionId = `session-${Date.now()}-${user.id}`;
    sessions.set(sessionId, user);
    return sessionId;
  }

  verifyToken(token: string) {
    if (sessions.has(token)) {
      return sessions.get(token);
    }
    throw new Error("Invalid session");
  }
}
