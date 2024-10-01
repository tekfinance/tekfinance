import { createContext } from "react";
import { useQuery } from "@tanstack/react-query";

import type { User } from "@/lib/api/models";
import { useApi } from "@/composables/useApi";

export type AuthContext = {
  user: User | null;
};

export const AuthContext = createContext<Partial<AuthContext>>({});

export default function AuthProvider({ children }: React.PropsWithChildren) {
  const { api } = useApi();

  const { data: user } = useQuery({
    queryKey: ["authenticate"],
    queryFn: () => api.user.get("me").then(({ data }) => data),
  });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
