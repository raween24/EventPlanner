import express from "express";

const router = express.Router();

// Stripe webhook endpoint (test simple)
router.post("/", (req, res) => {
  console.log("Webhook received");
  res.status(200).send("OK");
});

export default router;