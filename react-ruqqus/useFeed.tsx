import {useState, useEffect} from 'react';
import {UseFetchOpts} from './useFetch';
import {useRuqqusFetch} from './useRuqqusFetch';

export function useFeed(edge: string, args: UseFetchOpts | undefined) {
  const [posts, setPosts] = useState<object[]>();
  const [page, setPage] = useState(1);

  const {loading, body} = useRuqqusFetch(`/api/v1/${edge}/listing`, {
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

  return {loading, posts, nextPage: setPage((x) => x + 1)};
}
