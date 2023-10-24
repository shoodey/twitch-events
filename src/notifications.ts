// cf. https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/
export const handleNotification = (notification: Record<string, unknown>) => {
  console.log(notification);
};
