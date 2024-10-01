import { useContext } from "react";
import { ApiContext } from "@/providers/ApiProvider";

export const useApi = () =>
  useContext(ApiContext) as import("../providers/ApiProvider").ApiContext;
