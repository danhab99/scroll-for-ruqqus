import {useState, useEffect} from 'react';
import {UseFetchOpts} from './useFetch';
import {useRuqqusFetch} from './useRuqqusFetch';

export function useFeed(edge: string, args?: UseFetchOpts) {
  const [posts, setPosts] = useState<object[]>();
  const [page, setPage] = useState(1);

  const {loading, body} = useRuqqusFetch(`${edge}/listing`, {
    args: {
      ...args,
      page,
    },
  });

  useEffect(() => {
    if (body) {
      setPosts((prev) => (page > 1 ? prev?.concat(body) : body));
    }
  }, [page]);

  return {
    loading,
    posts,
    nextPage: () => setPage((x) => x + 1),
    refresh: () => setPage(0),
  };
}
