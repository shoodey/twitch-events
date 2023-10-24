// Notification request headers
export const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
export const TWITCH_MESSAGE_TIMESTAMP = "Twitch-Eventsub-Message-Timestamp".toLowerCase();
export const TWITCH_MESSAGE_SIGNATURE = "Twitch-Eventsub-Message-Signature".toLowerCase();
export const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
export const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
export const MESSAGE_TYPE_NOTIFICATION = "notification";
export const MESSAGE_TYPE_REVOCATION = "revocation";

// Notification types
export const NOTIFICATION_CHANNEL_UPDATE = "channel.update";
