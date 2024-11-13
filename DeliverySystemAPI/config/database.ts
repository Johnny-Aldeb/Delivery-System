import { Sequelize } from "sequelize";

class Database {
  private static instance: Sequelize;

  private constructor() {}

  static getInstance(): Sequelize {
    if (!Database.instance) {
      Database.instance = new Sequelize("parceler_db", "postgres", "password", {
        host: "localhost",
        dialect: "postgres",
        logging: false,
      });
    }
    return Database.instance;
  }
}

export const sequelize = Database.getInstance();
