import { BroadcasterId, RewardToCategory, StreamCategory } from "./types";

export const channelToCategory = new Map<BroadcasterId, StreamCategory>();

// Temp in-memory store for rewards to categories
// Categories: Just Chatting (509658), Software and Game Development (1469308723)
const always = "*";
const justChatting = "509658";
const softwareAndGameDevelopment = "1469308723";
export const channelToRewards = new Map<BroadcasterId, RewardToCategory[]>([
  [
    "39447376", // https://www.twitch.tv/shoodey
    [
      {
        id: "always_show_this_reward_1",
        categories: [always],
      },
      {
        id: "always_show_this_reward_2",
        categories: [always, justChatting],
      },
      {
        id: "always_show_this_reward_3",
        categories: [always, softwareAndGameDevelopment],
      },
      {
        id: "always_show_this_reward_4",
        categories: [always, justChatting, softwareAndGameDevelopment],
      },
      {
        id: "just_chatting_reward_1",
        categories: [justChatting],
      },
      {
        id: "just_chatting_reward_2",
        categories: [justChatting],
      },
      {
        id: "software_and_game_development_reward_1",
        categories: [softwareAndGameDevelopment],
      },
      {
        id: "software_and_game_development_reward_2",
        categories: [softwareAndGameDevelopment],
      },
    ],
  ],
]);
