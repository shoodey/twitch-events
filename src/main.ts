import "dotenv/config";
import express from "express";

import { getAccessToken, verifyMessage } from "./utils";
import { handleNotification } from "./notifications";
import {
  MESSAGE_TYPE,
  MESSAGE_TYPE_NOTIFICATION,
  MESSAGE_TYPE_REVOCATION,
  MESSAGE_TYPE_VERIFICATION,
} from "./constants";

const app = express();
app.use(express.raw({ type: "application/json" }));

let accessToken = null;

const helix = {
  baseUrl: "https://api.twitch.tv/helix",
  headers: {
    "Content-Type": "application/json",
    "Client-ID": process.env.TWITCH_CLIENT_ID || "", // TODO: Handle env validation
    Authorization: `Bearer ${accessToken}`,
  },
};

// Fetch user data
app.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  const url = `${helix.baseUrl}/users?login=${username}`;

  const response = await fetch(url, {
    method: "GET",
    headers: helix.headers,
  });

  const json = await response.json();
  if (!("data" in json) || json["data"].length !== 1) {
    res.status(404).json(json);
    return;
  }

  res.status(200).json(json);
});

// Fetch all subscriptions tied to the application
app.get("/subscriptions", async (req, res) => {
  const url = `${helix.baseUrl}/eventsub/subscriptions`;

  const response = await fetch(url, {
    method: "GET",
    headers: helix.headers,
  });
  res.status(200).json(await response.json());
});

// Subscribe to a specific event
// TODO: Make endpoint use username for better UX
app.post("/subscriptions/create/:broadcaster_id", async (req, res) => {
  const url = `${helix.baseUrl}/eventsub/subscriptions`;

  const broadcasterId = req.params.broadcaster_id;
  const callbackUrl = "https://6193-2001-999-708-8241-9c0f-62ea-49fc-11bc.ngrok-free.app/webhook/callback";

  // TODO: Make subscription data dynamic
  const data = {
    type: "channel.update",
    version: "2",
    condition: {
      broadcaster_user_id: broadcasterId,
    },
    transport: {
      method: "webhook",
      callback: callbackUrl,
      secret: process.env.APP_SECRET || "", // TODO: Handle env validation
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: helix.headers,
    body: JSON.stringify(data),
  });
  res.status(200).json(await response.json());
});

// Delete a subscription
app.delete("/subscriptions/delete/:subscription_id", async (req, res) => {
  const subscriptionId = req.params.subscription_id;
  const url = `${helix.baseUrl}/eventsub/subscriptions?id=${subscriptionId}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: helix.headers,
  });
  res.status(response.status).end();
});

// Handle Twitch subscription callbacks
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

// Start server
app.listen(process.env.APP_PORT, async () => {
  accessToken = await getAccessToken();

  if (!accessToken) {
    console.log("Failed to get access token");
    return;
  }

  // TODO: Cleanup quick hack to set access token
  helix.headers.Authorization = `Bearer ${accessToken}`;

  console.log(`Webhook server listening at http://localhost:${process.env.APP_PORT}`);
});
