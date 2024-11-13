"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Orders",
      [
        {
          id: 1,
          packageId: 1,
          paymentId: 1,
          senderId: 1,
          driverId: 2,
          recipientFirstName: "Test",
          recipientLastName: "test",
          recipientAddress: "Canada",
          senderAddress: "Montreal",
          trackingNumber: "G5K8F1L2M3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
