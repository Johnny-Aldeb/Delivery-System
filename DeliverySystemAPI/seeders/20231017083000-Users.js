"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 1,
          firstName: "Danny",
          lastName: "Mousa",
          email: "test@test.com",
          password:
            "$2a$10$B8GQ33PNoJy/rI3rR19twORY6xmhtxSECFAhlwCMklbkEPVWIoIai",
          userTypeId: 1,
          phoneNumber: "1234567890",
          accessToken: null,
          accessTokenExpiry: null,
          issuedAt: null,
          revokedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: "Danny",
          lastName: "Mousa",
          email: "test1@test.com",
          password:
            "$2a$10$KiZjidNIlH8F5xwA4yOwOOX28bl8bK8ZL8zu4yyoZHJY4Q4M15lMm",
          userTypeId: 3,
          phoneNumber: "123456789",
          accessToken: null,
          accessTokenExpiry: null,
          issuedAt: null,
          revokedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
