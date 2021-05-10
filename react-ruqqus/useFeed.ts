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
  const [posts, setPosts] = useState<RuqqusPost[]>();
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const pageHistory = useRef<Number[]>([]);

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

  const { loading, body, refresh } = useRuqqusFetch<RuqqusFeed>(
    `${ed}/listing`,
    {
      args: {
        ...args,
        page,
      },
    },
  );

  useEffect(() => {
    if (body) {
      let data = body.data;

      setPosts((prev) => {
        pageHistory.current[page] = data.length;
        let next = _.cloneDeep(prev);

        if (page > 1) {
          let offset = next?.reduce(
            (acc, _, i) => (i === next?.length ? acc : acc + i),
            0,
          );
          next?.splice(offset || 0, data.length, ...data);
        } else {
          next = data;
        }

        if (data.length < 1) {
          console.warn("RUQQUS may have not retrieved new posts");
        }
        return next;
      });
      setMore(body.next_exists);
    }
  }, [body]);

  useEffect(() => setPage(1), [args?.sort]);

  return {
    loading,
    posts,
    nextPage: () => setPage((x) => (more ? x + 1 : x)),
    refresh,
    setPosts,
  };
}
