import crypto from "crypto";
import { Request } from "express";

import { TWITCH_MESSAGE_ID, TWITCH_MESSAGE_SIGNATURE, TWITCH_MESSAGE_TIMESTAMP } from "./constants";

const getHmacMessage = (request: Request) => {
  const messageId = request.get(TWITCH_MESSAGE_ID) || "";
  const timestamp = request.get(TWITCH_MESSAGE_TIMESTAMP) || "";
  const body = request.body;

  return messageId + timestamp + body;
};

const getHmac = (secret: string, message: string) => {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
};

export const verifyMessage = (req: Request) => {
  const secret = process.env.APP_SECRET || ""; // TODO: Handle env validation
  const message = getHmacMessage(req);
  const hmac = `sha256=${getHmac(secret, message)}`;
  const signature = req.get(TWITCH_MESSAGE_SIGNATURE) || "";

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
};

export const getAccessToken = async () => {
  const url = "https://id.twitch.tv/oauth2/token";
  const headers = {
    "Content-Type": "application/json",
  };
  const data = {
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    grant_type: "client_credentials",
  };

  console.log("Fetching access token...");

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const json = await response.json();
  return json.access_token;
};
