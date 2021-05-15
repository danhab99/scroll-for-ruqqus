export interface RuqqusBadge {
  created_utc: Date | null;
  icon_url: string;
  text: string;
  url: string | null;
}

export interface RuqqusRatable {
  score: number;
  upvotes: number;
  downvotes: number;
  voted: RuqqusVote;
}

export interface RuqqusFlagged {
  is_archived: boolean;
  is_banned: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_nsfl: boolean;
  is_nsfw: boolean;
  is_offensive: boolean;
  is_pinned: boolean;
}

export interface RuqqusDateStamped {
  created_utc: Date;
  edited_utc: Date;
}

export interface RuqqusComment
  extends RuqqusRatable,
    RuqqusFlagged,
    RuqqusDateStamped {
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  fullname: string;
  guild_id: string;
  id: string;
  permalink: string;
  post_id: string;
  replies: RuqqusComments;
  deleted_utc: Date;
}

export type RuqqusComments = Array<RuqqusComment>;

export interface RuqqusUser extends RuqqusDateStamped {
  badges: Array<RuqqusBadge>;
  banner_url: string;
  bio: string;
  bio_html: string;
  comment_count: number;
  comment_rep: number;
  id: string;
  is_banned: boolean;
  is_premium: boolean;
  is_private: boolean;
  permalink: string;
  post_count: number;
  post_rep: number;
  profile_url: string;
  title: {
    color: string;
    id: number;
    kind: number;
    text: string;
  };
  username: string;
}

export type RuqqusVote = -1 | 0 | 1;

export interface RuqqusPost
  extends RuqqusRatable,
    RuqqusFlagged,
    RuqqusDateStamped {
  author: RuqqusUser;
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  comment_count: number;
  domain: string;
  fullname: string;
  guild: RuqqusGuild;
  guild_id: string;
  guild_name: string;
  id: string;
  meta_description: string;
  meta_title: string;
  original_guild: string;
  permalink: string;
  thumb_url: string;
  title: string;
  url: string;
  replies: RuqqusComments;
}

export interface RuqqusGuild extends RuqqusDateStamped {
  banner_url: string;
  color: string;
  description: string;
  description_html: string;
  fullname: string;
  guildmasters: Array<RuqqusUser>;
  id: string;
  is_banned: boolean;
  is_private: boolean;
  is_restricted: boolean;
  is_siege_protected: boolean;
  name: string;
  over_18: boolean;
  permalink: string;
  profile_url: string;
  subscriber_count: number;
}

export interface RuqqusNotification
  extends RuqqusRatable,
    RuqqusDateStamped,
    RuqqusFlagged {
  author: RuqqusUser;
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  fullname: string;
  guild: RuqqusGuild;
  guild_id: string;
  id: string;
  level: number;
  permalink: string;
  post: RuqqusPost;
}

export type RuqqusNotifications = Array<RuqqusNotification>;
