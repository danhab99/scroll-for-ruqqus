import { useState, useEffect } from "react";
import { RuqqusPost } from "./types";
import { UseFetchOpts } from "./useFetch";
import { useRuqqusFetch } from "./useRuqqusFetch";
import * as _ from "lodash";
import { SortOptions } from "./RuqqusFeed";

type UseFeedOpts = UseFetchOpts<RuqqusPost[]> & { sort: SortOptions };

export function useFeed(edge: string, args?: UseFeedOpts) {
  const [posts, setPosts] = useState<RuqqusPost[]>();
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const { loading, body, refresh } = useRuqqusFetch(`${edge}/listing`, {
    args: {
      ...args,
      page,
    },
  });

  useEffect(() => {
    if (body) {
      let data = body.data;
      setPosts((prev) => {
        let next = page > 1 ? prev?.concat(data) : data;
        next = _.uniqBy(next, (x) => x.id);
        if (next.length < 1) {
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
