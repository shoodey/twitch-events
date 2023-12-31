import { NOTIFICATION_CHANNEL_UPDATE } from "./constants";
import { ChannelUpdateEvent, EventNotification } from "./types";
import { channelToCategory, channelToRewards } from "./store";
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

  if (didChannelCategoryChange(notification)) {
    handleChannelCategoryUpdate(notification);
  }
};

const handleChannelCategoryUpdate = (notification: EventNotification) => {
  const event = notification.event as ChannelUpdateEvent;

  console.log(`Channel ${event.broadcaster_user_id} category updated to ${event.category_id} - ${event.category_name}`);

  channelToCategory.set(event.broadcaster_user_id, {
    categoryId: event.category_id,
    categoryName: event.category_name,
  });

  updateChannelRewards(event.broadcaster_user_id, event.category_id);
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

const updateChannelRewards = (broadcasterId: string, categoryId: string) => {
  if (!channelToRewards.has(broadcasterId)) return;

  const rewards = channelToRewards.get(broadcasterId);
  if (!rewards) return;

  const rewardsToEnable = rewards
    .filter((reward) => reward.categories.includes("*") || reward.categories.includes(categoryId))
    .map((reward) => {
      toggleReward(broadcasterId, reward.id, "enable");
      return reward.id;
    });

  const rewardsToDisable = rewards
    .filter((reward) => !reward.categories.includes("*") && !reward.categories.includes(categoryId))
    .map((reward) => {
      toggleReward(broadcasterId, reward.id, "disable");
      return reward.id;
    });

  console.log({
    rewardsToEnable,
    rewardsToDisable,
  });
};

const toggleReward = (broadcasterId: string, rewardId: string, state: string) => {
  const url = `http://localhost:3333/rewards/${broadcasterId}/update/${rewardId}/${state}`;

  fetch(url, {
    method: "PATCH",
  });
};
