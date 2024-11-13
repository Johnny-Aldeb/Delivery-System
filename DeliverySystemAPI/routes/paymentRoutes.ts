import express from "express";
import { verifyToken } from "../middleware";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  createStripeSession,
  retrievePaymentMethod,
  retrieveSession,
} from "../Services";
import { accessTokenSecret } from "../config";
import { Order, Package, Payment } from "../models";
import { eventManager, generateTrackingNumber } from "../utils";

export const paymentRoutes = express.Router();

//Protected route
paymentRoutes.post("/checkout", verifyToken, async (req, res) => {
  try {
    const { amount, userEmail, productName } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({ error: "Invalid amount" });
    } else if (!userEmail || !productName) {
      return res.status(400).json({ error: "Missing attributes" });
    }

    const url = await createStripeSession(amount, userEmail, productName);
    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: "Failed to create a payment url" });
  }
});

paymentRoutes.post("/complete", async (req, res) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token!, accessTokenSecret) as JwtPayload;
    const { userId } = decoded;

    const {
      weight,
      dimension,
      declaredValue,
      recipientFirstName,
      recipientLastName,
      recipientAddress,
      senderAddress,
      sessionId,
    } = req.body;

    if (
      !weight ||
      !dimension ||
      !declaredValue ||
      !recipientFirstName ||
      !recipientLastName ||
      !recipientAddress ||
      !senderAddress ||
      !sessionId
    ) {
      return res.status(400).json({ error: "Required attributes missing" });
    }

    const sessionData = await retrieveSession(sessionId);
    const paymentMethod = await retrievePaymentMethod(
      sessionData.payment_intent
    );

    //create package first
    const p = await Package.create({
      weight,
      dimension,
      declaredValue,
    });

    //create payment
    const payment = await Payment.create({
      stripeId: sessionData.id,
      amount: sessionData.amount_total / 100,
      currency: sessionData.currency,
      method: paymentMethod.card.brand,
    });

    //generate tracking number
    const trackingNumber = generateTrackingNumber();

    await Order.create({
      packageId: p.id,
      paymentId: payment.id,
      senderId: userId,
      driverId: null,
      recipientFirstName,
      recipientLastName,
      recipientAddress,
      senderAddress,
      trackingNumber,
    });

    eventManager.emit("orderCreated", trackingNumber);

    res.status(200).json({ message: "Order created!" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
