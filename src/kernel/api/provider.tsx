import createFetchClient, { ClientOptions } from "openapi-fetch";
import { ReactNode } from "react";

import { env } from "../env";
import { authMiddleware } from "./auth-middleware";
import { normalizeServerUrl } from "./base-url";
import type { paths } from "./schema";
import { createApiContext } from "@/lib/api";

const ApiContext = createApiContext<paths>();
const ApiPublicContext = createApiContext<paths>();

const makeFetchClient = (options: ClientOptions = {}) =>
  createFetchClient<paths>({
    baseUrl: normalizeServerUrl(env.EXPO_PUBLIC_API_BASE_URL),
    ...options,
    credentials: "include",
  });

export const publicFetchClient = makeFetchClient();

const authFetchClient = makeFetchClient();
authFetchClient.use(authMiddleware);

export const PublicApiProvider = ({ children }: { children?: ReactNode }) => (
  <ApiContext.Provider fetchClient={authFetchClient}>
    <ApiPublicContext.Provider fetchClient={publicFetchClient}>
      {children}
    </ApiPublicContext.Provider>
  </ApiContext.Provider>
);

export const useApiPublic = ApiPublicContext.useApi;
export const usePublicFetchClient = ApiPublicContext.useFetchClient;
export const useApi = ApiContext.useApi;
export const useApiFetchClient = ApiContext.useFetchClient;

export type ApiFetchClient = ReturnType<typeof useApiFetchClient>;
