import { useState, useEffect, useRef } from "react";
import { RuqqusPost } from "./types";
import { UseFetchOpts } from "./useFetch";
import { useRuqqusFetch } from "./useRuqqusFetch";
import * as _ from "lodash";
import { SortOptions, FeedOptions } from "./RuqqusFeed";

const pdebug = (msg: string, ...extras: any) =>
  console.debug(`useFeed | ${msg}`, ...extras);

type UseFeedOpts = UseFetchOpts<RuqqusPost[]> & { sort: SortOptions };

export type RuqqusFeedSequence = {
  data: RuqqusPost[];
  next_exists: boolean;
};

export function useFeed(edge: FeedOptions, args?: UseFeedOpts) {
  const [page, setPage] = useState(1);

  let ed = "";

  if (typeof edge === "string") {
    pdebug("Edge is a string", edge);
    ed = edge;
  } else if (typeof edge === "object") {
    pdebug("Edge is an object");
    if ("guild" in edge) {
      pdebug("Edge is a guild", edge);
      ed = "guild/" + edge.guild;
    } else if ("user" in edge) {
      pdebug("Edge is a user", edge);
      ed = "user/" + edge.user;
    }
  }

  if (!ed) {
    pdebug("No edge");
    throw new TypeError("edge is not a FeedOption");
  }

  const {
    loading,
    body,
    refresh,
    setBody,
  } = useRuqqusFetch<RuqqusFeedSequence>(`${ed}/listing`, {
    args: {
      ...args,
      page,
    },
    onBodyChange: (old, args, incoming): RuqqusFeedSequence => {
      pdebug("Body changed", old, args, incoming);
      if (args?.page > 1) {
        pdebug("Concating incoming");
        return {
          data: ([] as RuqqusPost[]).concat(old?.data || [], incoming.data),
          next_exists: incoming?.next_exists,
        };
      } else {
        pdebug("Returning incoming only");
        return incoming;
      }
    },
    disabled: (): boolean => {
      if (typeof body?.next_exists === "boolean") {
        pdebug("Testing if should disable", body.next_exists);
        return body.next_exists;
      } else {
        pdebug("Do not disable");
        return false;
      }
    },
  });

  useEffect(() => {
    pdebug("Sort changed, setting page to 1");
    setPage(1);
  }, [args?.sort]);

  const nextPage = () => {
    if (body?.next_exists) {
      pdebug("Next page", page)
      setPage((x) => x + 1);
    }
  };

  return {
    loading,
    posts: body?.data,
    nextPage,
    refresh,
    setPosts: setBody,
  };
}
