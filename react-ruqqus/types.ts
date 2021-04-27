export interface RuqqusBadge {
  created_utc: Date | null;
  icon_url: string;
  text: string;
  url: string | null;
}

interface RuqqusRatable {
  score: number;
  upvotes: number;
  downvotes: number;
}

interface RuqqusFlagged {
  is_archived: string;
  is_banned: string;
  is_bot: string;
  is_deleted: string;
  is_nsfl: string;
  is_nsfw: string;
  is_offensive: string;
}

export interface RuqqusComment extends RuqqusRatable, RuqqusFlagged {
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  created_utc: Date;
  edited_utc: Date;
  fullname: string;
  guild_id: string;
  id: string;
  permalink: string;
  post_id: string;
  replies: RuqqusComments;
}

export type RuqqusComments = Array<RuqqusComment>;

export interface RuqqusUser {
  badges: Array<RuqqusBadge>;
  banner_url: string;
  bio: string;
  bio_html: string;
  comment_count: number;
  comment_rep: number;
  created_utc: Date;
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

export interface RuqqusPost extends RuqqusRatable, RuqqusFlagged {
  author: RuqqusUser;
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  comment_count: number;
  created_utc: Date;
  domain: string;
  edited_utc: Date;
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
  voted: RuqqusVote;
  replies: RuqqusComments;
}

export interface RuqqusGuild {
  banner_url: string;
  color: string;
  created_utc: Date;
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
