import { useState } from "react";
import { fetcher } from "./fetcher";
import { useRuqqusClient } from "./useRuqqusClient";
import { RuqqusComment } from "./types";

interface NewComment {
  parent_fullname: string;
  body: string;
}

export function useReplyPoster(replyID: string) {
  const client = useRuqqusClient();
  const [loading, setLoading] = useState(false);

  let postReply = (body: string) => {
    setLoading(true);
    return fetcher<RuqqusComment, NewComment>(client.domain, "api/v1/comment", {
      access_token: client.access_token,
      body: {
        parent_fullname: replyID,
        body,
      },
    }).then((resp) => {
      setLoading(false);
      if (resp.ok) {
        return resp.body;
      } else {
        throw Error(resp.body.error);
      }
    });
  };

  return { loading, postReply };
}
