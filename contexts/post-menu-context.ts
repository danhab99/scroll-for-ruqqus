import {createContext, useContext} from 'react';
import {RuqqusPost} from 'react-ruqqus/types';

type PostMenuType = [
  RuqqusPost | undefined,
  React.Dispatch<React.SetStateAction<RuqqusPost | undefined>>,
];

export const PostMenuContext = createContext<PostMenuType>({} as PostMenuType);
export const usePostMenuContext = () => useContext(PostMenuContext);
