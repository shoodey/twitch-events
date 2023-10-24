export interface EventNotification {
  subscription: Subscription;
  event: unknown;
}

export interface Subscription {
  id: string;
  status: string;
  type: string;
  version: string;
  condition: {
    broadcaster_user_id: string;
  };
  transport: {
    method: string;
    callback: string;
  };
  created_at: string;
  cost: number;
}

export interface ChannelUpdateEvent {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  title: string;
  language: string;
  category_id: string;
  category_name: string;
  content_classification_labels: string[];
}

export type BroadcasterId = string;

export interface StreamCategory {
  categoryId: string;
  categoryName: string;
}

export interface RewardToCategory {
  id: string;
  categories: string[];
}
