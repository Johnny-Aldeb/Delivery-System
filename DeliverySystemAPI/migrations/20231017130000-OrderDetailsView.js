module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE VIEW order_details_V AS
      SELECT 
          o."id",
          o."senderId",
          u."firstName" AS "senderFirstName",
          u."lastName" AS "senderLastName",
          u.email AS "senderEmail",
          o."senderAddress",
          u."phoneNumber" AS "senderPhoneNumber",
          o."driverId",
          d."firstName" AS "driverFirstName",
          d."lastName" AS "driverLastName",
          o."packageId",
          p."weight" AS "packageWeight",
          p."dimension" AS "packageDimension",
          p."declaredValue" AS "packageDeclaredValue",
          ts."statusName" AS "latestStatusName",
          o."recipientFirstName",
          o."recipientLastName",
          o."recipientAddress",
          o."trackingNumber",
        pay."amount",
        pay."currency",
        pay."method"
      FROM public."Orders" AS o
      LEFT JOIN public."Users" AS u ON u.id = o."senderId"
      LEFT JOIN public."Users" AS d ON d.id = o."driverId"
      LEFT JOIN public."Packages" p ON p.id = o."packageId"
      LEFT JOIN (
          SELECT osh."orderId", osh."statusId"
          FROM public."OrderStatusHistory" AS osh
          INNER JOIN (
              SELECT "orderId", MAX("createdAt") AS latest_change
              FROM public."OrderStatusHistory"
              GROUP BY "orderId"
          ) AS latest ON osh."orderId" = latest."orderId" AND osh."createdAt" = latest.latest_change
      ) AS latest_status ON latest_status."orderId" = o."id"
      LEFT JOIN public."TrackingStatus" ts ON ts."id" = latest_status."statusId"
      LEFT JOIN public."Payments" pay ON pay."id" = o."paymentId";
      `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "DROP VIEW IF EXISTS order_details_V;"
    );
  },
};
