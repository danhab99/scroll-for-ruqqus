import {useState, useEffect} from 'react';
import {useRuqqusFetch} from './useRuqqusFetch';

export function useFeed(edge, args) {
  const [posts, setPosts] = useState();
  const [page, setPage] = useState(1);

  const {loading, data} = useRuqqusFetch(`/api/v1/${edge}/listing`, {
    ...args,
    page,
  });

  useEffect(() => {
    if (data) {
      setPosts((prev) => (page > 1 ? prev.concat(data) : data));
    }
  }, [page]);

  return {loading, posts, nextPage: setPage((x) => x + 1)};
}
