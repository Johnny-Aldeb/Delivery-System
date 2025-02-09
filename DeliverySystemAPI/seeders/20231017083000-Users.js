"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@example.com",
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
          firstName: "Michael",
          lastName: "Thompson",
          email: "mthompson@parceler.com",
          password:
            "$2a$10$B8GQ33PNoJy/rI3rR19twORY6xmhtxSECFAhlwCMklbkEPVWIoIai",
          userTypeId: 2,
          phoneNumber: "123456789",
          accessToken: null,
          accessTokenExpiry: null,
          issuedAt: null,
          revokedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Emily",
          lastName: "Davis",
          email: "edavis@parceler.com",
          password:
            "$2a$10$B8GQ33PNoJy/rI3rR19twORY6xmhtxSECFAhlwCMklbkEPVWIoIai",
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
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
