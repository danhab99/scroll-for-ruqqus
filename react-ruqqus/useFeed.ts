import {useState, useEffect} from 'react';
import {UseFetchOpts} from './useFetch';
import {useRuqqusFetch} from './useRuqqusFetch';

export function useFeed(edge: string, args?: UseFetchOpts) {
  const [posts, setPosts] = useState<object[]>();
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  const {loading, body, refresh} = useRuqqusFetch(`${edge}/listing`, {
    args: {
      ...args,
      page,
    },
  });

  useEffect(() => {
    if (body) {
      let {data} = body;
      setPosts((prev) => (page > 1 ? prev?.concat(data) : data));
      setMore(body.next_exists);
    }
  }, [page, body]);

  return {
    loading,
    posts,
    nextPage: () => setPage((x) => (more ? x + 1 : x)),
    refresh,
  };
}
