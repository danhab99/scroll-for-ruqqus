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
  is_heralded: boolean;
}

export interface RuqqusDateStamped {
  created_utc: Date;
  edited_utc: Date;
}

export interface RuqqusID {
  // name: string;
  fullname: string;
  id: string;
}

export interface RuqqusComment
  extends RuqqusRatable,
    RuqqusFlagged,
    RuqqusDateStamped,
    RuqqusID {
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  guild_id: string;
  permalink: string;
  post_id: string;
  replies: RuqqusComments;
  deleted_utc: Date;
}

export type RuqqusComments = Array<RuqqusComment>;

export interface RuqqusUser extends RuqqusDateStamped, RuqqusID {
  badges: Array<RuqqusBadge>;
  banner_url: string;
  bio: string;
  bio_html: string;
  comment_count: number;
  comment_rep: number;
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
    RuqqusDateStamped,
    RuqqusGuildPart,
    RuqqusID {
  author: RuqqusUser;
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  comment_count: number;
  domain: string;
  meta_description: string;
  meta_title: string;
  original_guild: string;
  permalink: string;
  thumb_url: string;
  title: string;
  url: string;
  replies: RuqqusComments;
}

export interface RuqqusGuildPart {
  guild: RuqqusGuild;
  guild_id: string;
  herald_guild: RuqqusGuild;
}

export interface RuqqusGuild extends RuqqusDateStamped, RuqqusID {
  banner_url: string;
  color: string;
  description: string;
  description_html: string;
  guildmasters: Array<RuqqusUser>;
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
    RuqqusFlagged,
    RuqqusGuildPart,
    RuqqusID {
  author: RuqqusUser;
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  level: number;
  permalink: string;
  post: RuqqusPost;
}

export type RuqqusNotifications = Array<RuqqusNotification>;
