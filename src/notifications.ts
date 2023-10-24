import { NOTIFICATION_CHANNEL_UPDATE } from "./constants";
import { ChannelUpdateEvent, EventNotification } from "./types";
import { channelToCategory } from "./store";
// cf. https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types/
export const handleNotification = (notification: EventNotification) => {
  const notificationType = notification.subscription.type;

  switch (notificationType) {
    case NOTIFICATION_CHANNEL_UPDATE:
      handleChannelUpdate(notification);
      break;
    default:
      break;
  }
};

const handleChannelUpdate = (notification: EventNotification) => {
  const event = notification.event as ChannelUpdateEvent;
  const broadcasterId = event.broadcaster_user_id;
  const categoryId = event.category_id;

  if (didChannelCategoryChange(notification)) {
    handleChannelCategoryUpdate(notification);
  }
};

const handleChannelCategoryUpdate = (notification: EventNotification) => {
  const event = notification.event as ChannelUpdateEvent;

  channelToCategory.set(event.broadcaster_user_id, {
    categoryId: event.category_id,
    categoryName: event.category_name,
  });

  console.log(`Channel ${event.broadcaster_user_id} category updated to ${event.category_id} - ${event.category_name}`);
};

const didChannelCategoryChange = (notification: EventNotification) => {
  const event = notification.event as ChannelUpdateEvent;
  const broadcasterId = event.broadcaster_user_id;
  const categoryId = event.category_id;

  // If the channel already has a category, check if it's the same as the new category
  if (channelToCategory.has(broadcasterId)) {
    return channelToCategory.get(broadcasterId)?.categoryId !== categoryId;
  }

  // First time setting the category, consider it changed
  return true;
};
