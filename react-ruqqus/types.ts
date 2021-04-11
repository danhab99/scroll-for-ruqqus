export interface RuqqusBadge {
  created_utc: Date | null;
  icon_url: string;
  text: string;
  url: string | null;
}

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

type RuqqusVote = -1 | 0 | 1;

export interface RuqqusPost {
  author: RuqqusUser;
  author_name: string;
  award_count: number;
  body: string;
  body_html: string;
  comment_count: number;
  created_utc: Date;
  domain: string;
  downvotes: 1;
  edited_utc: 0;
  fullname: string;
  guild: RuqqusGuild;
  guild_id: string;
  guild_name: string;
  id: string;
  is_archived: boolean;
  is_banned: boolean;
  is_bot: boolean;
  is_deleted: boolean;
  is_nsfl: boolean;
  is_nsfw: boolean;
  is_offensive: boolean;
  meta_description: string;
  meta_title: string;
  original_guild: string;
  permalink: string;
  score: number;
  thumb_url: string;
  title: string;
  upvotes: number;
  url: string;
  voted: RuqqusVote;
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
