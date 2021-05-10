import { fetcher } from "./fetcher";
import { useRuqqusClient } from "./useRuqqusClient";

type Post = {
  board: string;
  body: string;
  url: string;
  title: string;
};

export function useSubmit() {
  const client = useRuqqusClient();

  return (post: Post) =>
    fetcher(client.domain, "api/v1/submit", {
      access_token: client.access_token,
      body: post,
    });
}
