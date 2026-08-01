// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: 
        | `/`
        | `/_sitemap`
        | `/admin`
        | `/auth`
        | `/auth/login`
        | `/auth/login/password`
        | `/chat`
        | `/legal/privacy`
        | `/legal/terms`
        | `/settings`
        | `/ui`
      DynamicRoutes: `/auth/signup/${OneRouter.SingleRoutePart<T>}`
      DynamicRouteTemplate: `/auth/signup/[method]`
      IsTyped: true
      RouteTypes: {
        '/auth/signup/[method]': RouteInfo<{ method: string }>
      }
    }
  }
}

/**
 * Helper type for route information
 */
type RouteInfo<Params = Record<string, never>> = {
  Params: Params
  LoaderProps: { path: string; search?: string; subdomain?: string; params: Params; request?: Request }
}