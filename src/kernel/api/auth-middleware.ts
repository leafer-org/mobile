import { type Middleware } from "openapi-fetch";
import { Subject } from "rxjs";

import { getAccessToken } from "@/kernel/session";

export const authMiddlewareSubject = new Subject<{
  type: "unauthorized";
}>();

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      request.headers.set("authorization", `Bearer ${accessToken}`);
      return request;
    }
    authMiddlewareSubject.next({ type: "unauthorized" });
    return new Response("Unauthorized", { status: 401 });
  },
  async onResponse({ response }) {
    if (response.status === 401) {
      authMiddlewareSubject.next({ type: "unauthorized" });
    }
    return response;
  },
};
