import { useState, useEffect, useRef } from "react";
import { RuqqusPost } from "./types";
import { UseFetchOpts } from "./useFetch";
import { useRuqqusFetch } from "./useRuqqusFetch";
import * as _ from "lodash";
import { SortOptions, FeedOptions } from "./RuqqusFeed";

type UseFeedOpts = UseFetchOpts<RuqqusPost[]> & { sort: SortOptions };

type RuqqusFeed = {
  data: RuqqusPost[];
  next_exists: boolean;
};

export function useFeed(edge: FeedOptions, args?: UseFeedOpts) {
  const [page, setPage] = useState(1);

  let ed = "";

  if (typeof edge === "string") {
    ed = edge;
  } else if (typeof edge === "object") {
    if ("guild" in edge) {
      ed = "guild/" + edge.guild;
    } else if ("user" in edge) {
      ed = "user/" + edge.user;
    }
  }

  if (!ed) {
    throw new TypeError("edge is not a FeedOption");
  }

  const { loading, body, refresh, setBody } = useRuqqusFetch<RuqqusFeed>(
    `${ed}/listing`,
    {
      args: {
        ...args,
        page,
      },
      onBodyChange: (old, args, incoming) =>
        args?.page > 1
          ? {
              data: [].concat(old?.data || [], incoming?.data || []),
              next_exists: incoming?.next_exists,
            }
          : incoming,
    },
  );

  useEffect(() => setPage(1), [args?.sort]);

  return {
    loading,
    posts: body?.data,
    nextPage: () => (body?.next_exists ? setPage((x) => x + 1) : null),
    refresh,
    setPosts: setBody,
  };
}
