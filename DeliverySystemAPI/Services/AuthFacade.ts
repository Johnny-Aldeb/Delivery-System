import { User } from "../models";
import { comparePassword, hashPassword } from "../utils";
import { ACCESS_TOKEN_EXPIRATION_TIME } from "../constants";
import { JWTStrategy, SessionStrategy } from "../strategies";
import AuthContext from "../strategies/AuthContext";

const authStrategy =
  process.env.AUTH_TYPE === "session"
    ? new SessionStrategy()
    : new JWTStrategy();
const authContext = new AuthContext(authStrategy);

class AuthFacade {
  async register(userData: any) {
    const { email, password, firstName, lastName, userTypeId, phoneNumber } =
      userData;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !userTypeId ||
      !phoneNumber
    ) {
      throw new Error("Missing attributes");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = hashPassword(password);
    return User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userTypeId,
      phoneNumber,
    });
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user || !comparePassword(password, user.password)) {
      throw new Error("Invalid credentials");
    }

    const accessToken = authContext.generateToken(user);
    const issuedAt = new Date();
    const accessTokenExpiry = new Date(
      issuedAt.getTime() + ACCESS_TOKEN_EXPIRATION_TIME
    );

    await user.update({ accessToken, accessTokenExpiry, issuedAt });
    return { accessToken, user };
  }

  async logout(accessToken: string) {
    const user = await User.findOne({ where: { accessToken } });
    if (!user) {
      throw new Error("User not found");
    }

    await user.update({
      accessToken: null,
      accessTokenExpiry: null,
      issuedAt: null,
      revokedAt: new Date(),
    });
  }
}

export default new AuthFacade();
