import express from "express";
import {
  Order,
  OrderDetailsView,
  OrderStatusHistory,
  OrderStatusHistoryView,
  Package,
} from "../models";
import { isAdmin, verifyToken } from "../middleware";

export const orderRoutes = express.Router();

//get order by tracking number
orderRoutes.get("/trackingNumber/:trackingNumber", async (req, res) => {
  try {
    const trackingNumber = req.params.trackingNumber;
    const order = await OrderDetailsView.findOne({
      where: { trackingNumber },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const statusHistory = await OrderStatusHistoryView.findAll({
      where: { orderId: order.id },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ order, statusHistory });
  } catch (error) {
    res.status(500).json({ error });
  }
});

//get order by id
orderRoutes.get("/id/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const order = await OrderDetailsView.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const statusHistory = await OrderStatusHistoryView.findAll({
      where: { orderId: order.id },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ order, statusHistory });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

//get orders by senderId
orderRoutes.get("/sender/:senderId", async (req, res) => {
  try {
    const senderId = parseInt(req.params.senderId, 10);
    const orders = await OrderDetailsView.findAll({ where: { senderId } });

    if (!orders) {
      return res.status(404).json({ error: "Order not found" });
    }

    const ordersWithHistory = await Promise.all(
      orders.map(async (order) => {
        const statusHistory = await OrderStatusHistoryView.findAll({
          where: { orderId: order.id },
          order: [["createdAt", "ASC"]],
        });
        return {
          ...order.toJSON(),
          statusHistory,
        };
      })
    );

    res.status(200).json(ordersWithHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Get all orders
orderRoutes.get("/", isAdmin, async (req, res) => {
  try {
    const orders = await OrderDetailsView.findAll();

    const ordersWithHistory = await Promise.all(
      orders.map(async (order) => {
        const statusHistory = await OrderStatusHistoryView.findAll({
          where: { orderId: order.id },
          order: [["createdAt", "ASC"]],
        });
        return {
          ...order.toJSON(),
          statusHistory,
        };
      })
    );
    res.status(200).json(ordersWithHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

orderRoutes.get("/driver/:driverId", async (req, res) => {
  try {
    const driverId = parseInt(req.params.driverId, 10);
    const orders = await OrderDetailsView.findAll({ where: { driverId } });

    if (!orders) {
      return res.status(404).json({ error: "Order not found" });
    }

    const ordersWithHistory = await Promise.all(
      orders.map(async (order) => {
        const statusHistory = await OrderStatusHistoryView.findAll({
          where: { orderId: order.id },
          order: [["createdAt", "ASC"]],
        });
        return {
          ...order.toJSON(),
          statusHistory,
        };
      })
    );

    res.status(200).json(ordersWithHistory);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

orderRoutes.put("/status", verifyToken, async (req, res) => {
  try {
    let { orderId, statusId } = req.body;

    orderId = parseInt(orderId, 10);
    statusId = parseInt(statusId, 10);

    if (!orderId || !statusId) {
      return res.status(404).json({ error: "Missing data" });
    }

    const order = await OrderStatusHistory.findOne({
      where: { orderId },
      order: [["createdAt", "DESC"]],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.statusId === statusId) {
      return res
        .status(404)
        .json({ error: "The order is already in the requested status." });
    }

    await OrderStatusHistory.create({
      orderId,
      statusId,
    });

    const updatedOrder = await OrderDetailsView.findOne({
      where: { id: orderId },
    });

    const statusHistory = await OrderStatusHistoryView.findAll({
      where: { orderId },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ updatedOrder, statusHistory });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Update order
//soon
