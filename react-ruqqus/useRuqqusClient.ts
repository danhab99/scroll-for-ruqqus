import { useContext } from "react";
import { ClientContext } from "./ClientContext";

export function useRuqqusClient() {
  return useContext(ClientContext);
}
