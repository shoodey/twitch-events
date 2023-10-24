import "dotenv/config";
import express from "express";

import { verifyMessage } from "./utils";
import { handleNotification } from "./notifications";
import {
  MESSAGE_TYPE,
  MESSAGE_TYPE_NOTIFICATION,
  MESSAGE_TYPE_REVOCATION,
  MESSAGE_TYPE_VERIFICATION,
} from "./constants";

const app = express();
app.use(express.raw({ type: "application/json" }));

app.post("/webhook/callback", async (req, res) => {
  if (verifyMessage(req)) {
    const notification = JSON.parse(req.body);
    const messageType = req.get(MESSAGE_TYPE);

    switch (messageType) {
      case MESSAGE_TYPE_VERIFICATION:
        res.set("Content-Type", "text/plain").status(200).send(notification.challenge);
        break;
      case MESSAGE_TYPE_NOTIFICATION:
        handleNotification(notification);
        res.sendStatus(204);
        break;
      case MESSAGE_TYPE_REVOCATION:
        console.log(`${notification.subscription.type} notifications revoked!`);
        console.log(`Reason: ${notification.subscription.status}`);
        console.log(`Condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
        res.sendStatus(204);
        break;
      default:
        console.log(`Unknown message type: ${messageType}`);
        res.sendStatus(204);
        break;
    }

    return;
  }

  console.log("Verification failed");
  res.sendStatus(403);
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Webhook server listening at http://localhost:${process.env.APP_PORT}`);
});
