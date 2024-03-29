import {
  useCreator,
  useFilter,
  IRealmSavedPost,
  useDestroyer,
  IRealmAccount,
} from "@contexts";
import { useContextPost } from "@react-ruqqus";

export function useSaved(): [boolean, () => void] {
  const post = useContextPost();
  const predicator = `postID == "${post.id}"`;
  const filter = useFilter<IRealmSavedPost>("saved", predicator);
  const creator = useCreator<IRealmSavedPost>("saved");
  const deleter = useDestroyer<IRealmSavedPost>("saved");

  const saved = (filter?.length || 0) > 0;

  const toggle = () => {
    if (saved) {
      deleter(predicator);
    } else {
      creator({
        postID: post.id,
        savedAt: Date.now(),
        owner: {} as IRealmAccount, // TODO: figure out how to get account from db
      });
    }
  };

  return [saved, toggle];
}
