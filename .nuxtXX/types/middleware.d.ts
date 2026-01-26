import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "auth" | "dashboard" | "forbidden" | "main"
declare module "C:/KerisiAI/kerisi/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}