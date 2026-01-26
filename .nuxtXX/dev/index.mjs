globalThis._importMeta_={url:import.meta.url,env:process.env};import 'file://C:/KerisiAI/kerisi/node_modules/node-fetch-native/dist/polyfill.mjs';
import { Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, setResponseStatus, getRequestHeader, setResponseHeader, getRequestHeaders, createError, getQuery as getQuery$1, readBody, handleCors, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler, getRouterParam, getMethod, readMultipartFormData } from 'file://C:/KerisiAI/kerisi/node_modules/h3/dist/index.mjs';
import sha256 from 'file://C:/KerisiAI/kerisi/node_modules/crypto-js/sha256.js';
import jwt from 'file://C:/KerisiAI/kerisi/node_modules/jsonwebtoken/index.js';
import fs from 'fs';
import path, { dirname, resolve } from 'path';
import { ESLint } from 'file://C:/KerisiAI/kerisi/node_modules/eslint/lib/api.js';
import prettier from 'file://C:/KerisiAI/kerisi/node_modules/prettier/index.js';
import crypto from 'node:crypto';
import { exec, spawn } from 'node:child_process';
import { fileURLToPath } from 'url';
import os from 'os';
import { createRenderer } from 'file://C:/KerisiAI/kerisi/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { stringify, uneval } from 'file://C:/KerisiAI/kerisi/node_modules/devalue/index.js';
import { renderToString } from 'file://C:/KerisiAI/kerisi/node_modules/vue/server-renderer/index.mjs';
import { createFetch as createFetch$1, Headers } from 'file://C:/KerisiAI/kerisi/node_modules/ofetch/dist/node.mjs';
import destr from 'file://C:/KerisiAI/kerisi/node_modules/destr/dist/index.mjs';
import { createCall, createFetch } from 'file://C:/KerisiAI/kerisi/node_modules/unenv/runtime/fetch/index.mjs';
import { createHooks } from 'file://C:/KerisiAI/kerisi/node_modules/hookable/dist/index.mjs';
import { snakeCase } from 'file://C:/KerisiAI/kerisi/node_modules/scule/dist/index.mjs';
import { klona } from 'file://C:/KerisiAI/kerisi/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://C:/KerisiAI/kerisi/node_modules/defu/dist/defu.mjs';
import { hash } from 'file://C:/KerisiAI/kerisi/node_modules/ohash/dist/index.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery } from 'file://C:/KerisiAI/kerisi/node_modules/ufo/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://C:/KerisiAI/kerisi/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/KerisiAI/kerisi/node_modules/unstorage/drivers/fs.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/KerisiAI/kerisi/node_modules/radix3/dist/index.mjs';
import { PrismaClient } from 'file://C:/KerisiAI/kerisi/node_modules/@prisma/client/index.js';
import cache from 'file://C:/KerisiAI/kerisi/node_modules/memory-cache/index.js';
import { performance } from 'perf_hooks';
import { FilterXSS } from 'file://C:/KerisiAI/kerisi/node_modules/xss/lib/index.js';

const providers = [
  ["APPVEYOR"],
  ["AZURE_PIPELINES", "SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],
  ["AZURE_STATIC", "INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],
  ["APPCIRCLE", "AC_APPCIRCLE"],
  ["BAMBOO", "bamboo_planKey"],
  ["BITBUCKET", "BITBUCKET_COMMIT"],
  ["BITRISE", "BITRISE_IO"],
  ["BUDDY", "BUDDY_WORKSPACE_ID"],
  ["BUILDKITE"],
  ["CIRCLE", "CIRCLECI"],
  ["CIRRUS", "CIRRUS_CI"],
  ["CLOUDFLARE_PAGES", "CF_PAGES", { ci: true }],
  ["CODEBUILD", "CODEBUILD_BUILD_ARN"],
  ["CODEFRESH", "CF_BUILD_ID"],
  ["DRONE"],
  ["DRONE", "DRONE_BUILD_EVENT"],
  ["DSARI"],
  ["GITHUB_ACTIONS"],
  ["GITLAB", "GITLAB_CI"],
  ["GITLAB", "CI_MERGE_REQUEST_ID"],
  ["GOCD", "GO_PIPELINE_LABEL"],
  ["LAYERCI"],
  ["HUDSON", "HUDSON_URL"],
  ["JENKINS", "JENKINS_URL"],
  ["MAGNUM"],
  ["NETLIFY"],
  ["NETLIFY", "NETLIFY_LOCAL", { ci: false }],
  ["NEVERCODE"],
  ["RENDER"],
  ["SAIL", "SAILCI"],
  ["SEMAPHORE"],
  ["SCREWDRIVER"],
  ["SHIPPABLE"],
  ["SOLANO", "TDDIUM"],
  ["STRIDER"],
  ["TEAMCITY", "TEAMCITY_VERSION"],
  ["TRAVIS"],
  ["VERCEL", "NOW_BUILDER"],
  ["APPCENTER", "APPCENTER_BUILD_ID"],
  ["CODESANDBOX", "CODESANDBOX_SSE", { ci: false }],
  ["STACKBLITZ"],
  ["STORMKIT"],
  ["CLEAVR"]
];
function detectProvider(env) {
  for (const provider of providers) {
    const envName = provider[1] || provider[0];
    if (env[envName]) {
      return {
        name: provider[0].toLowerCase(),
        ...provider[2]
      };
    }
  }
  if (env.SHELL && env.SHELL === "/bin/jsh") {
    return {
      name: "stackblitz",
      ci: false
    };
  }
  return {
    name: "",
    ci: false
  };
}

const processShim = typeof process !== "undefined" ? process : {};
const envShim = processShim.env || {};
const providerInfo = detectProvider(envShim);
const nodeENV = typeof process !== "undefined" && process.env && "development" || "";
const platform = processShim.platform;
const provider = providerInfo.name;
const isCI = toBoolean(envShim.CI) || providerInfo.ci !== false;
const hasTTY = toBoolean(processShim.stdout && processShim.stdout.isTTY);
toBoolean(envShim.DEBUG);
const isTest = nodeENV === "test" || toBoolean(envShim.TEST);
toBoolean(envShim.MINIMAL) || isCI || isTest || !hasTTY;
const isWindows = /^win/i.test(platform);
function toBoolean(val) {
  return val ? val !== "false" : false;
}

const defineAppConfig = (config) => config;

const appConfig0 = defineAppConfig({
  nuxtIcon: {
    size: "24px",
    // default <Icon> size applied
    aliases: {
      nuxt: "logos:nuxt-icon"
    }
  }
});

const inlineAppConfig = {};

const appConfig = defuFn(appConfig0, inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/api/devtool/**": {
        "security": {
          "xssValidator": false,
          "requestSizeLimiter": false
        }
      },
      "/**": {
        "security": {
          "requestSizeLimiter": {
            "maxRequestSizeInBytes": 2000000,
            "maxUploadFileRequestInBytes": 8000000,
            "throwError": true
          },
          "rateLimiter": {
            "tokensPerInterval": 200,
            "interval": "minute",
            "fireImmediately": false,
            "throwError": true
          },
          "xssValidator": {
            "throwError": true
          },
          "corsHandler": {
            "origin": "http://localhost:3000",
            "methods": [
              "GET",
              "HEAD",
              "PUT",
              "PATCH",
              "POST",
              "DELETE"
            ],
            "preflight": {
              "statusCode": 204
            },
            "throwError": true
          },
          "allowedMethodsRestricter": {
            "0": "*"
          },
          "undefined": {}
        }
      }
    }
  },
  "public": {
    "persistedState": {
      "storage": "cookies",
      "debug": false,
      "cookieOptions": {}
    }
  },
  "auth": {
    "secretAccess": "D9kxw7VlRHN28BiSyW84yLeZVspct0uM",
    "secretRefresh": "Z61XQAow1f7GIoJxschM15JqVzJadM4D"
  },
  "metabase": {
    "secretKey": "c98a5b005450e699b6d420f46e0062912ac75268716f1298c11d8bb11c291eb0",
    "siteUrl": "http://mb.sena.my"
  },
  "private": {
    "basicAuth": false
  },
  "security": {
    "headers": false,
    "requestSizeLimiter": {
      "maxRequestSizeInBytes": 2000000,
      "maxUploadFileRequestInBytes": 8000000,
      "throwError": true
    },
    "rateLimiter": {
      "tokensPerInterval": 200,
      "interval": "minute",
      "fireImmediately": false,
      "throwError": true
    },
    "xssValidator": {
      "throwError": true
    },
    "corsHandler": {
      "origin": "http://localhost:3000",
      "methods": [
        "GET",
        "HEAD",
        "PUT",
        "PATCH",
        "POST",
        "DELETE"
      ],
      "preflight": {
        "statusCode": 204
      },
      "throwError": true
    },
    "allowedMethodsRestricter": "*",
    "hidePoweredBy": true,
    "enabled": true,
    "csrf": false
  }
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const serverAssets = [{"baseName":"server","dir":"C:/KerisiAI/kerisi/server/assets"}];

const assets = createStorage();

for (const asset of serverAssets) {
  assets.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir }));
}

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:\\KerisiAI\\kerisi","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:\\KerisiAI\\kerisi\\server","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:\\KerisiAI\\kerisi\\.nuxt","ignore":["**/node_modules/**","**/.git/**"]}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:\\KerisiAI\\kerisi\\.nuxt\\cache","ignore":["**/node_modules/**","**/.git/**"]}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const _63vrfwvjNs = (function(nitro) {
  nitro.hooks.hook("render:response", (response) => {
    if (response.headers["x-powered-by"]) {
      delete response.headers["x-powered-by"];
    } else if (response.headers["X-Powered-By"]) {
      delete response.headers["X-Powered-By"];
    }
  });
});

const plugins = [
  _63vrfwvjNs
];

function defineRenderHandler(handler) {
  return eventHandler(async (event) => {
    if (event.node.req.url.endsWith("/favicon.ico")) {
      if (!event.handled) {
        event.node.res.setHeader("Content-Type", "image/x-icon");
        event.node.res.end(
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      return;
    }
    const response = await handler(event);
    if (!response) {
      if (!event.handled) {
        event.node.res.statusCode = event.node.res.statusCode === 200 ? 500 : event.node.res.statusCode;
        event.node.res.end(
          "No response returned from render handler: " + event.node.req.url
        );
      }
      return;
    }
    const nitroApp = useNitroApp();
    await nitroApp.hooks.callHook("render:response", response, { event });
    if (!event.node.res.headersSent && response.headers) {
      for (const header in response.headers) {
        event.node.res.setHeader(header, response.headers[header]);
      }
      setResponseStatus(event, response.statusCode, response.statusMessage);
    }
    return typeof response.body === "string" ? response.body : JSON.stringify(response.body);
  });
}

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}
function trapUnhandledNodeErrors() {
  {
    process.on(
      "unhandledRejection",
      (err) => console.error("[nitro] [unhandledRejection]", err)
    );
    process.on(
      "uncaughtException",
      (err) => console.error("[nitro] [uncaughtException]", err)
    );
  }
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: statusCode !== 404 ? `<pre>${stack.map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n")}</pre>` : "",
    data: error.data
  };
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (event.handled) {
    return;
  }
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    if (event.handled) {
      return;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  const html = await res.text();
  if (event.handled) {
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(html);
});

var _a;
const prismaClientSingleton = () => {
  return new PrismaClient();
};
const prisma = (_a = globalThis.prisma) != null ? _a : prismaClientSingleton();
const prisma$1 = prisma;
globalThis.prisma = prisma;

const ENV$1 = useRuntimeConfig();
const _JnSmkc = defineEventHandler(async (event) => {
  try {
    const cookies = event.req.headers.cookie;
    if (!cookies)
      throw new Error("Cookie not found");
    let { accessToken, refreshToken, user } = parseCookie(cookies);
    if (!accessToken)
      accessToken = null;
    if (!refreshToken)
      refreshToken = null;
    let { subdomain } = JSON.parse(user);
    if (!subdomain)
      subdomain = null;
    let payloadUser = null;
    payloadUser = verifyAccessToken(accessToken);
    if (!payloadUser) {
      payloadUser = verifyRefreshToken(refreshToken);
      if (!payloadUser)
        throw new Error("Unauthorized Refresh Token");
      const accessToken2 = generateAccessToken$1({
        email: payloadUser.email,
        roles: payloadUser.roles
      });
      event.res.setHeader("Set-Cookie", [
        `accessToken=${accessToken2}; HttpOnly; Secure; SameSite=Lax; Path=/`
      ]);
    }
    const getUser = await getUserInfo(payloadUser.username);
    if (!getUser)
      throw new Error("User not found");
    event.context.user = {
      userID: getUser.userID || null,
      email: payloadUser.email || null,
      roles: payloadUser.roles || []
    };
    return;
  } catch (error) {
    event.context.user = {
      userID: null,
      email: null,
      roles: []
    };
    return;
  }
});
function parseCookie(str) {
  return str.split(";").map((v) => v.split("=")).reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});
}
function verifyAccessToken(accessToken) {
  try {
    const token = ENV$1.auth.secretAccess;
    return jwt.verify(accessToken, token);
  } catch (error) {
    return false;
  }
}
function verifyRefreshToken(refreshToken) {
  try {
    const token = ENV$1.auth.secretRefresh;
    return jwt.verify(refreshToken, token);
  } catch (error) {
    return false;
  }
}
function generateAccessToken$1(user) {
  try {
    const token = ENV$1.auth.secretAccess;
    return jwt.sign(user, token, { expiresIn: "1d" });
  } catch (error) {
    return false;
  }
}
async function getUserInfo(username) {
  try {
    const user = await prisma$1.user.findFirst({
      where: {
        userUsername: username
      }
    });
    if (!user)
      return null;
    return user;
  } catch (error) {
    console.log(error);
  }
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const publicBase = useRuntimeConfig().app.cdnURL || useRuntimeConfig().app.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
}

function buildNuxtTemplate({ title, name }) {
  const escapedTitle = title.replace(/"/g, '\\"').replace(/\n/g, "\\n");
  return `<script setup>
    definePageMeta({
      title: "${escapedTitle}",
      middleware: ["auth"],
      requiresAuth: true,
    });
    <\/script>
    
    <template>
      <div>
        <LayoutsBreadcrumb />
        <rs-card>
          <template #header>
            <div>
              ${title}
            </div>
          </template>
          <template #body>
            <div>
              Content for ${title}
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    `;
}

const FILE_UPLOAD_HEADER = "multipart/form-data";
const _hP22zj = defineEventHandler(async (event) => {
  const routeRules = getRouteRules(event);
  if (routeRules.security.requestSizeLimiter !== false) {
    if (["POST", "PUT", "DELETE"].includes(event.node.req.method)) {
      const contentLengthValue = getRequestHeader(event, "content-length");
      const contentTypeValue = getRequestHeader(event, "content-type");
      const isFileUpload = contentTypeValue?.includes(FILE_UPLOAD_HEADER);
      const requestLimit = isFileUpload ? routeRules.security.requestSizeLimiter.maxUploadFileRequestInBytes : routeRules.security.requestSizeLimiter.maxRequestSizeInBytes;
      if (parseInt(contentLengthValue) >= requestLimit) {
        const payloadTooLargeError = {
          statusCode: 413,
          statusMessage: "Payload Too Large"
        };
        if (routeRules.security.requestSizeLimiter.throwError === false) {
          return payloadTooLargeError;
        }
        throw createError(payloadTooLargeError);
      }
    }
  }
});

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp) {
    const clocktime = performance.now() * 1e-3;
    let seconds = Math.floor(clocktime);
    let nanoseconds = Math.floor((clocktime % 1) * 1e9);
    if (previousTimestamp != undefined) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds < 0) {
            seconds--;
            nanoseconds += 1e9;
        }
    }
    return [seconds, nanoseconds];
}
// The current timestamp in whole milliseconds
function getMilliseconds() {
    const [seconds, nanoseconds] = hrtime();
    return seconds * 1e3 + Math.floor(nanoseconds / 1e6);
}
// Wait for a specified number of milliseconds before fulfilling the returned promise.
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A hierarchical token bucket for rate limiting. See
 * http://en.wikipedia.org/wiki/Token_bucket for more information.
 *
 * @param options
 * @param options.bucketSize Maximum number of tokens to hold in the bucket.
 *  Also known as the burst rate.
 * @param options.tokensPerInterval Number of tokens to drip into the bucket
 *  over the course of one interval.
 * @param options.interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param options.parentBucket Optional. A token bucket that will act as
 *  the parent of this bucket.
 */
class TokenBucket {
    constructor({ bucketSize, tokensPerInterval, interval, parentBucket }) {
        this.bucketSize = bucketSize;
        this.tokensPerInterval = tokensPerInterval;
        if (typeof interval === "string") {
            switch (interval) {
                case "sec":
                case "second":
                    this.interval = 1000;
                    break;
                case "min":
                case "minute":
                    this.interval = 1000 * 60;
                    break;
                case "hr":
                case "hour":
                    this.interval = 1000 * 60 * 60;
                    break;
                case "day":
                    this.interval = 1000 * 60 * 60 * 24;
                    break;
                default:
                    throw new Error("Invalid interval " + interval);
            }
        }
        else {
            this.interval = interval;
        }
        this.parentBucket = parentBucket;
        this.content = 0;
        this.lastDrip = getMilliseconds();
    }
    /**
     * Remove the requested number of tokens. If the bucket (and any parent
     * buckets) contains enough tokens this will happen immediately. Otherwise,
     * the removal will happen when enough tokens become available.
     * @param count The number of tokens to remove.
     * @returns A promise for the remainingTokens count.
     */
    async removeTokens(count) {
        // Is this an infinite size bucket?
        if (this.bucketSize === 0) {
            return Number.POSITIVE_INFINITY;
        }
        // Make sure the bucket can hold the requested number of tokens
        if (count > this.bucketSize) {
            throw new Error(`Requested tokens ${count} exceeds bucket size ${this.bucketSize}`);
        }
        // Drip new tokens into this bucket
        this.drip();
        const comeBackLater = async () => {
            // How long do we need to wait to make up the difference in tokens?
            const waitMs = Math.ceil((count - this.content) * (this.interval / this.tokensPerInterval));
            await wait(waitMs);
            return this.removeTokens(count);
        };
        // If we don't have enough tokens in this bucket, come back later
        if (count > this.content)
            return comeBackLater();
        if (this.parentBucket != undefined) {
            // Remove the requested from the parent bucket first
            const remainingTokens = await this.parentBucket.removeTokens(count);
            // Check that we still have enough tokens in this bucket
            if (count > this.content)
                return comeBackLater();
            // Tokens were removed from the parent bucket, now remove them from
            // this bucket. Note that we look at the current bucket and parent
            // bucket's remaining tokens and return the smaller of the two values
            this.content -= count;
            return Math.min(remainingTokens, this.content);
        }
        else {
            // Remove the requested tokens from this bucket
            this.content -= count;
            return this.content;
        }
    }
    /**
     * Attempt to remove the requested number of tokens and return immediately.
     * If the bucket (and any parent buckets) contains enough tokens this will
     * return true, otherwise false is returned.
     * @param {Number} count The number of tokens to remove.
     * @param {Boolean} True if the tokens were successfully removed, otherwise
     *  false.
     */
    tryRemoveTokens(count) {
        // Is this an infinite size bucket?
        if (!this.bucketSize)
            return true;
        // Make sure the bucket can hold the requested number of tokens
        if (count > this.bucketSize)
            return false;
        // Drip new tokens into this bucket
        this.drip();
        // If we don't have enough tokens in this bucket, return false
        if (count > this.content)
            return false;
        // Try to remove the requested tokens from the parent bucket
        if (this.parentBucket && !this.parentBucket.tryRemoveTokens(count))
            return false;
        // Remove the requested tokens from this bucket and return
        this.content -= count;
        return true;
    }
    /**
     * Add any new tokens to the bucket since the last drip.
     * @returns {Boolean} True if new tokens were added, otherwise false.
     */
    drip() {
        if (this.tokensPerInterval === 0) {
            const prevContent = this.content;
            this.content = this.bucketSize;
            return this.content > prevContent;
        }
        const now = getMilliseconds();
        const deltaMS = Math.max(now - this.lastDrip, 0);
        this.lastDrip = now;
        const dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
        const prevContent = this.content;
        this.content = Math.min(this.content + dripAmount, this.bucketSize);
        return Math.floor(this.content) > Math.floor(prevContent);
    }
}

/**
 * A generic rate limiter. Underneath the hood, this uses a token bucket plus
 * an additional check to limit how many tokens we can remove each interval.
 *
 * @param options
 * @param options.tokensPerInterval Maximum number of tokens that can be
 *  removed at any given moment and over the course of one interval.
 * @param options.interval The interval length in milliseconds, or as
 *  one of the following strings: 'second', 'minute', 'hour', day'.
 * @param options.fireImmediately Whether or not the promise will resolve
 *  immediately when rate limiting is in effect (default is false).
 */
class RateLimiter {
    constructor({ tokensPerInterval, interval, fireImmediately }) {
        this.tokenBucket = new TokenBucket({
            bucketSize: tokensPerInterval,
            tokensPerInterval,
            interval,
        });
        // Fill the token bucket to start
        this.tokenBucket.content = tokensPerInterval;
        this.curIntervalStart = getMilliseconds();
        this.tokensThisInterval = 0;
        this.fireImmediately = fireImmediately !== null && fireImmediately !== void 0 ? fireImmediately : false;
    }
    /**
     * Remove the requested number of tokens. If the rate limiter contains enough
     * tokens and we haven't spent too many tokens in this interval already, this
     * will happen immediately. Otherwise, the removal will happen when enough
     * tokens become available.
     * @param count The number of tokens to remove.
     * @returns A promise for the remainingTokens count.
     */
    async removeTokens(count) {
        // Make sure the request isn't for more than we can handle
        if (count > this.tokenBucket.bucketSize) {
            throw new Error(`Requested tokens ${count} exceeds maximum tokens per interval ${this.tokenBucket.bucketSize}`);
        }
        const now = getMilliseconds();
        // Advance the current interval and reset the current interval token count
        // if needed
        if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
            this.curIntervalStart = now;
            this.tokensThisInterval = 0;
        }
        // If we don't have enough tokens left in this interval, wait until the
        // next interval
        if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) {
            if (this.fireImmediately) {
                return -1;
            }
            else {
                const waitMs = Math.ceil(this.curIntervalStart + this.tokenBucket.interval - now);
                await wait(waitMs);
                const remainingTokens = await this.tokenBucket.removeTokens(count);
                this.tokensThisInterval += count;
                return remainingTokens;
            }
        }
        // Remove the requested number of tokens from the token bucket
        const remainingTokens = await this.tokenBucket.removeTokens(count);
        this.tokensThisInterval += count;
        return remainingTokens;
    }
    /**
     * Attempt to remove the requested number of tokens and return immediately.
     * If the bucket (and any parent buckets) contains enough tokens and we
     * haven't spent too many tokens in this interval already, this will return
     * true. Otherwise, false is returned.
     * @param {Number} count The number of tokens to remove.
     * @param {Boolean} True if the tokens were successfully removed, otherwise
     *  false.
     */
    tryRemoveTokens(count) {
        // Make sure the request isn't for more than we can handle
        if (count > this.tokenBucket.bucketSize)
            return false;
        const now = getMilliseconds();
        // Advance the current interval and reset the current interval token count
        // if needed
        if (now < this.curIntervalStart || now - this.curIntervalStart >= this.tokenBucket.interval) {
            this.curIntervalStart = now;
            this.tokensThisInterval = 0;
        }
        // If we don't have enough tokens left in this interval, return false
        if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval)
            return false;
        // Try to remove the requested number of tokens from the token bucket
        const removed = this.tokenBucket.tryRemoveTokens(count);
        if (removed) {
            this.tokensThisInterval += count;
        }
        return removed;
    }
    /**
     * Returns the number of tokens remaining in the TokenBucket.
     * @returns {Number} The number of tokens remaining.
     */
    getTokensRemaining() {
        this.tokenBucket.drip();
        return this.tokenBucket.content;
    }
}

const _gKtDfw = defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, "x-forwarded-for");
  const routeRules = getRouteRules(event);
  if (routeRules.security.rateLimiter !== false) {
    if (!cache.get(ip)) {
      const cachedLimiter = new RateLimiter(routeRules.security.rateLimiter);
      cache.put(ip, cachedLimiter, 1e4);
    } else {
      const cachedLimiter = cache.get(ip);
      if (cachedLimiter.getTokensRemaining() > 1) {
        await cachedLimiter.removeTokens(1);
        cache.put(ip, cachedLimiter, 1e4);
      } else {
        const tooManyRequestsError = {
          statusCode: 429,
          statusMessage: "Too Many Requests"
        };
        if (routeRules.security.rateLimiter.throwError === false) {
          return tooManyRequestsError;
        }
        throw createError(tooManyRequestsError);
      }
    }
  }
});

const _9fvbw0 = defineEventHandler(async (event) => {
  const routeRules = getRouteRules(event);
  const xssValidator = new FilterXSS(routeRules.security.xssValidator);
  if (routeRules.security.xssValidator !== false) {
    if (["POST", "GET"].includes(event.node.req.method)) {
      const valueToFilter = event.node.req.method === "GET" ? getQuery$1(event) : await readBody(event);
      if (valueToFilter && Object.keys(valueToFilter).length) {
        if (valueToFilter.statusMessage && valueToFilter.statusMessage !== "Bad Request")
          return;
        const stringifiedValue = JSON.stringify(valueToFilter);
        const processedValue = xssValidator.process(JSON.stringify(valueToFilter));
        if (processedValue !== stringifiedValue) {
          const badRequestError = { statusCode: 400, statusMessage: "Bad Request" };
          if (routeRules.security.requestSizeLimiter.throwError === false) {
            return badRequestError;
          }
          throw createError(badRequestError);
        }
      }
    }
  }
});

const _PKi8Se = defineEventHandler((event) => {
  const routeRules = getRouteRules(event);
  handleCors(event, routeRules.security.corsHandler);
});

const _lazy_11lLaK = () => Promise.resolve().then(function () { return _id__delete$t; });
const _lazy_7iYDvs = () => Promise.resolve().then(function () { return _id__get$l; });
const _lazy_LzEj9I = () => Promise.resolve().then(function () { return _id__put$v; });
const _lazy_MZrFCP = () => Promise.resolve().then(function () { return index_get$2L; });
const _lazy_zrQ1hT = () => Promise.resolve().then(function () { return index_post$N; });
const _lazy_x1NMG2 = () => Promise.resolve().then(function () { return index_post$L; });
const _lazy_dhxdUX = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_lGCquO = () => Promise.resolve().then(function () { return logout_get$1; });
const _lazy_7BJqW2 = () => Promise.resolve().then(function () { return validate_get$1; });
const _lazy_DoX3mo = () => Promise.resolve().then(function () { return fundTypes_get$3; });
const _lazy_dN5UDM = () => Promise.resolve().then(function () { return reverseProcess_post$1; });
const _lazy_rIAzrt = () => Promise.resolve().then(function () { return startProcess_post$1; });
const _lazy_UrEHNS = () => Promise.resolve().then(function () { return index_get$2J; });
const _lazy_VnZ0V3 = () => Promise.resolve().then(function () { return detail_delete$7; });
const _lazy_8phHBw = () => Promise.resolve().then(function () { return detail_get$5; });
const _lazy_OL50sd = () => Promise.resolve().then(function () { return detail_post$7; });
const _lazy_8hppZG = () => Promise.resolve().then(function () { return detail_put$7; });
const _lazy_Lih8rp = () => Promise.resolve().then(function () { return getBudget_get$5; });
const _lazy_7uuD5G = () => Promise.resolve().then(function () { return get_get$b; });
const _lazy_gomDPX = () => Promise.resolve().then(function () { return budgetCodes_get$7; });
const _lazy_9iBcDv = () => Promise.resolve().then(function () { return master_get$7; });
const _lazy_HHUc9g = () => Promise.resolve().then(function () { return new_post$7; });
const _lazy_hdA5PU = () => Promise.resolve().then(function () { return processFlow_get$b; });
const _lazy_JHnpAF = () => Promise.resolve().then(function () { return submit_post$7; });
const _lazy_L9wvFb = () => Promise.resolve().then(function () { return index_get$2H; });
const _lazy_1XGflr = () => Promise.resolve().then(function () { return detail_delete$5; });
const _lazy_bnSzec = () => Promise.resolve().then(function () { return detail_get$3; });
const _lazy_378Rc8 = () => Promise.resolve().then(function () { return detail_post$5; });
const _lazy_ufQ6Cb = () => Promise.resolve().then(function () { return detail_put$5; });
const _lazy_Y1NC7q = () => Promise.resolve().then(function () { return getBudget_get$3; });
const _lazy_9wxj2w = () => Promise.resolve().then(function () { return get_get$9; });
const _lazy_2klYQR = () => Promise.resolve().then(function () { return budgetCodes_get$5; });
const _lazy_KDTwNN = () => Promise.resolve().then(function () { return quarters_get$5; });
const _lazy_XyesQ1 = () => Promise.resolve().then(function () { return master_get$5; });
const _lazy_3mnyKz = () => Promise.resolve().then(function () { return new_post$5; });
const _lazy_zxQSzt = () => Promise.resolve().then(function () { return processFlow_get$9; });
const _lazy_twLJxZ = () => Promise.resolve().then(function () { return submit_post$5; });
const _lazy_Uu6BBm = () => Promise.resolve().then(function () { return index_get$2F; });
const _lazy_Wvf64I = () => Promise.resolve().then(function () { return index_get$2D; });
const _lazy_sqsoaP = () => Promise.resolve().then(function () { return quarters_get$3; });
const _lazy_YCwx1f = () => Promise.resolve().then(function () { return statuses_get$3; });
const _lazy_X66lJo = () => Promise.resolve().then(function () { return years_get$5; });
const _lazy_cdmlkk = () => Promise.resolve().then(function () { return index_get$2B; });
const _lazy_WtzKYO = () => Promise.resolve().then(function () { return detail_delete$3; });
const _lazy_Mh9Be4 = () => Promise.resolve().then(function () { return detail_get$1; });
const _lazy_EyAytB = () => Promise.resolve().then(function () { return detail_post$3; });
const _lazy_bk8ctN = () => Promise.resolve().then(function () { return detail_put$3; });
const _lazy_oIOI0W = () => Promise.resolve().then(function () { return get_get$7; });
const _lazy_uDiTuv = () => Promise.resolve().then(function () { return activities_get$1; });
const _lazy_JjBJiv = () => Promise.resolve().then(function () { return budgetCodes_get$3; });
const _lazy_L7d99p = () => Promise.resolve().then(function () { return costCentres_get$1; });
const _lazy_wjJSU3 = () => Promise.resolve().then(function () { return fundTypes_get$1; });
const _lazy_IKrzGx = () => Promise.resolve().then(function () { return ptjs_get$1; });
const _lazy_FfOmko = () => Promise.resolve().then(function () { return quarters_get$1; });
const _lazy_8UExup = () => Promise.resolve().then(function () { return years_get$3; });
const _lazy_eIntaO = () => Promise.resolve().then(function () { return master_get$3; });
const _lazy_jfyMmb = () => Promise.resolve().then(function () { return new_post$3; });
const _lazy_Hv40dk = () => Promise.resolve().then(function () { return processFlow_get$7; });
const _lazy_oDOqfG = () => Promise.resolve().then(function () { return submit_post$3; });
const _lazy_H1aGP0 = () => Promise.resolve().then(function () { return index_get$2z; });
const _lazy_DJG3jW = () => Promise.resolve().then(function () { return index_get$2x; });
const _lazy_qRKX8F = () => Promise.resolve().then(function () { return _id__delete$r; });
const _lazy_x16lUd = () => Promise.resolve().then(function () { return _id__get$j; });
const _lazy_e3HuGV = () => Promise.resolve().then(function () { return index_get$2v; });
const _lazy_BjchFt = () => Promise.resolve().then(function () { return index_post$J; });
const _lazy_rAxic5 = () => Promise.resolve().then(function () { return index_get$2t; });
const _lazy_tfqQ2Z = () => Promise.resolve().then(function () { return index_get$2r; });
const _lazy_MqpySM = () => Promise.resolve().then(function () { return index_get$2p; });
const _lazy_oETRi1 = () => Promise.resolve().then(function () { return index_get$2n; });
const _lazy_iZiI3Z = () => Promise.resolve().then(function () { return index_get$2l; });
const _lazy_DB2wIS = () => Promise.resolve().then(function () { return fundType_get$1; });
const _lazy_DgGdq0 = () => Promise.resolve().then(function () { return ptj_get$1; });
const _lazy_akq79j = () => Promise.resolve().then(function () { return status_get$1; });
const _lazy_tDoLbL = () => Promise.resolve().then(function () { return votType_get$1; });
const _lazy_dg1uRQ = () => Promise.resolve().then(function () { return index_get$2j; });
const _lazy_9vJhqP = () => Promise.resolve().then(function () { return index_get$2h; });
const _lazy_W1SCx9 = () => Promise.resolve().then(function () { return index_get$2f; });
const _lazy_US1dFe = () => Promise.resolve().then(function () { return index_get$2d; });
const _lazy_CXnThR = () => Promise.resolve().then(function () { return years_get$1; });
const _lazy_CHRMEY = () => Promise.resolve().then(function () { return index_get$2b; });
const _lazy_4HmIhG = () => Promise.resolve().then(function () { return index_get$29; });
const _lazy_TPq10b = () => Promise.resolve().then(function () { return index_get$27; });
const _lazy_LvFzdG = () => Promise.resolve().then(function () { return index_get$25; });
const _lazy_N5r0gB = () => Promise.resolve().then(function () { return index_get$23; });
const _lazy_9omOGm = () => Promise.resolve().then(function () { return _id__delete$p; });
const _lazy_EpzM19 = () => Promise.resolve().then(function () { return _id__get$h; });
const _lazy_6ttsL7 = () => Promise.resolve().then(function () { return _id__put$t; });
const _lazy_jmSh2d = () => Promise.resolve().then(function () { return index_get$21; });
const _lazy_9OPCm4 = () => Promise.resolve().then(function () { return index_post$H; });
const _lazy_C0n078 = () => Promise.resolve().then(function () { return _id__delete$n; });
const _lazy_xqp3d8 = () => Promise.resolve().then(function () { return _id__get$f; });
const _lazy_K5vXOz = () => Promise.resolve().then(function () { return _id__put$r; });
const _lazy_eVYqQT = () => Promise.resolve().then(function () { return index_get$1$; });
const _lazy_v9lJfr = () => Promise.resolve().then(function () { return index_post$F; });
const _lazy_2qw2IW = () => Promise.resolve().then(function () { return _id__delete$l; });
const _lazy_hBTcA8 = () => Promise.resolve().then(function () { return _id__get$d; });
const _lazy_6gi9dl = () => Promise.resolve().then(function () { return _id__put$p; });
const _lazy_qEZOhm = () => Promise.resolve().then(function () { return index_get$1Z; });
const _lazy_6yordj = () => Promise.resolve().then(function () { return index_post$D; });
const _lazy_c9v1Pw = () => Promise.resolve().then(function () { return _id__delete$j; });
const _lazy_EXvK4w = () => Promise.resolve().then(function () { return _id__get$b; });
const _lazy_KHrZeu = () => Promise.resolve().then(function () { return _id__put$n; });
const _lazy_HDtJpK = () => Promise.resolve().then(function () { return index_get$1X; });
const _lazy_OSt7ZC = () => Promise.resolve().then(function () { return index_post$B; });
const _lazy_4fvx2o = () => Promise.resolve().then(function () { return detail_delete$1; });
const _lazy_rm16Mz = () => Promise.resolve().then(function () { return detail_post$1; });
const _lazy_1nnw9s = () => Promise.resolve().then(function () { return detail_put$1; });
const _lazy_8XmCNU = () => Promise.resolve().then(function () { return from_get$1; });
const _lazy_ZFYBM9 = () => Promise.resolve().then(function () { return getBudget_get$1; });
const _lazy_yX9iHX = () => Promise.resolve().then(function () { return get_get$5; });
const _lazy_XWiEH3 = () => Promise.resolve().then(function () { return to_get$1; });
const _lazy_IQkUoz = () => Promise.resolve().then(function () { return budgetCodes_get$1; });
const _lazy_rGaqL9 = () => Promise.resolve().then(function () { return currencyCodes_get$1; });
const _lazy_0n0XWY = () => Promise.resolve().then(function () { return movementTypes_get$1; });
const _lazy_8yOOdM = () => Promise.resolve().then(function () { return master_get$1; });
const _lazy_b97POi = () => Promise.resolve().then(function () { return new_post$1; });
const _lazy_BLdIU7 = () => Promise.resolve().then(function () { return processFlow_get$5; });
const _lazy_C6VaOX = () => Promise.resolve().then(function () { return submit_post$1; });
const _lazy_HPA0LO = () => Promise.resolve().then(function () { return index_get$1V; });
const _lazy_bNgXEb = () => Promise.resolve().then(function () { return _id__delete$h; });
const _lazy_GoNvhp = () => Promise.resolve().then(function () { return _id__put$l; });
const _lazy_in6Z4D = () => Promise.resolve().then(function () { return availablePages_get$1; });
const _lazy_cgAuiZ = () => Promise.resolve().then(function () { return helpers$3; });
const _lazy_XCnfNt = () => Promise.resolve().then(function () { return import_post$5; });
const _lazy_4UIxlx = () => Promise.resolve().then(function () { return index_get$1T; });
const _lazy_w4bnzk = () => Promise.resolve().then(function () { return index_post$z; });
const _lazy_sGbUQA = () => Promise.resolve().then(function () { return migrationFiles_get$5; });
const _lazy_3HbP3o = () => Promise.resolve().then(function () { return _id__delete$f; });
const _lazy_fZGEjC = () => Promise.resolve().then(function () { return _id__put$j; });
const _lazy_UUvKmz = () => Promise.resolve().then(function () { return helpers$1; });
const _lazy_9xhm0Q = () => Promise.resolve().then(function () { return import_post$3; });
const _lazy_YZDKoi = () => Promise.resolve().then(function () { return index_get$1R; });
const _lazy_JYCuvn = () => Promise.resolve().then(function () { return index_post$x; });
const _lazy_J4JL45 = () => Promise.resolve().then(function () { return migrationFiles_get$3; });
const _lazy_qQFKid = () => Promise.resolve().then(function () { return fileCode$5; });
const _lazy_MTxlIa = () => Promise.resolve().then(function () { return linter$3; });
const _lazy_ldwKlF = () => Promise.resolve().then(function () { return list$8; });
const _lazy_T636SD = () => Promise.resolve().then(function () { return prettierFormat$3; });
const _lazy_KGMN8L = () => Promise.resolve().then(function () { return save$3; });
const _lazy_L2IGzm = () => Promise.resolve().then(function () { return addCustomTheme$1; });
const _lazy_EZUFAq = () => Promise.resolve().then(function () { return env$1; });
const _lazy_rpKYn2 = () => Promise.resolve().then(function () { return loadingLogo$1; });
const _lazy_Q8NQPv = () => Promise.resolve().then(function () { return siteSettings$1; });
const _lazy_d12ypg = () => Promise.resolve().then(function () { return uploadFile$1; });
const _lazy_pBbcZe = () => Promise.resolve().then(function () { return fileCode$3; });
const _lazy_oSc8B3 = () => Promise.resolve().then(function () { return fileCode$1; });
const _lazy_6wiYsk = () => Promise.resolve().then(function () { return linter$1; });
const _lazy_HmkWW4 = () => Promise.resolve().then(function () { return prettierFormat$1; });
const _lazy_SL9TBs = () => Promise.resolve().then(function () { return save$1; });
const _lazy_zAZq9k = () => Promise.resolve().then(function () { return getList$1; });
const _lazy_mFbsPq = () => Promise.resolve().then(function () { return _import$1; });
const _lazy_qAKmQx = () => Promise.resolve().then(function () { return list$6; });
const _lazy_RbvpvC = () => Promise.resolve().then(function () { return tag$1; });
const _lazy_AXRmbP = () => Promise.resolve().then(function () { return list$4; });
const _lazy_2FCOrW = () => Promise.resolve().then(function () { return add$5; });
const _lazy_JCuVbI = () => Promise.resolve().then(function () { return _delete$5; });
const _lazy_zI8UKT = () => Promise.resolve().then(function () { return edit$5; });
const _lazy_w913au = () => Promise.resolve().then(function () { return newAdd$1; });
const _lazy_OlIqpJ = () => Promise.resolve().then(function () { return overwriteNavigation$1; });
const _lazy_MwxnIW = () => Promise.resolve().then(function () { return roleList$1; });
const _lazy_BPQlwD = () => Promise.resolve().then(function () { return userList$1; });
const _lazy_8IXniM = () => Promise.resolve().then(function () { return get_get$3; });
const _lazy_2C1kFt = () => Promise.resolve().then(function () { return schema_get$1; });
const _lazy_VoUftV = () => Promise.resolve().then(function () { return studio_get$1; });
const _lazy_fn36FZ = () => Promise.resolve().then(function () { return index_get$1P; });
const _lazy_KZn2pq = () => Promise.resolve().then(function () { return index_post$v; });
const _lazy_AnQKMn = () => Promise.resolve().then(function () { return index_delete$1; });
const _lazy_l9yFRq = () => Promise.resolve().then(function () { return get_get$1; });
const _lazy_XI0rLr = () => Promise.resolve().then(function () { return index_post$t; });
const _lazy_iZGbbR = () => Promise.resolve().then(function () { return add$3; });
const _lazy_rcPHFe = () => Promise.resolve().then(function () { return _delete$3; });
const _lazy_3ybZYM = () => Promise.resolve().then(function () { return edit$3; });
const _lazy_QvMjId = () => Promise.resolve().then(function () { return list$3; });
const _lazy_w5y7rW = () => Promise.resolve().then(function () { return add$1; });
const _lazy_YQTfP5 = () => Promise.resolve().then(function () { return _delete$1; });
const _lazy_E0yKnf = () => Promise.resolve().then(function () { return edit$1; });
const _lazy_8VYAn6 = () => Promise.resolve().then(function () { return list$1; });
const _lazy_7BvbP2 = () => Promise.resolve().then(function () { return _id__delete$d; });
const _lazy_CDSgDq = () => Promise.resolve().then(function () { return _id__put$h; });
const _lazy_k2i2sk = () => Promise.resolve().then(function () { return index_get$1N; });
const _lazy_9LQOlI = () => Promise.resolve().then(function () { return index_post$r; });
const _lazy_SlS9AQ = () => Promise.resolve().then(function () { return messageLog_post$1; });
const _lazy_HIvvD0 = () => Promise.resolve().then(function () { return token_get$1; });
const _lazy_Wmziju = () => Promise.resolve().then(function () { return _id__delete$b; });
const _lazy_QeOyiY = () => Promise.resolve().then(function () { return _id__put$f; });
const _lazy_fA0Xkh = () => Promise.resolve().then(function () { return availableMenus_get$1; });
const _lazy_FJGtUN = () => Promise.resolve().then(function () { return helpers$2; });
const _lazy_M4alr2 = () => Promise.resolve().then(function () { return import_post$1; });
const _lazy_KoEXGe = () => Promise.resolve().then(function () { return index_get$1L; });
const _lazy_DlQQif = () => Promise.resolve().then(function () { return index_post$p; });
const _lazy_gvMgXT = () => Promise.resolve().then(function () { return migrationFiles_get$1; });
const _lazy_T3pa5f = () => Promise.resolve().then(function () { return _id__delete$9; });
const _lazy_uejfYy = () => Promise.resolve().then(function () { return _id__put$d; });
const _lazy_wDM94C = () => Promise.resolve().then(function () { return helpers; });
const _lazy_NQFPSh = () => Promise.resolve().then(function () { return index_get$1J; });
const _lazy_YZ3B9T = () => Promise.resolve().then(function () { return index_post$n; });
const _lazy_sxxZjf = () => Promise.resolve().then(function () { return nextId_get$1; });
const _lazy_HQ5mNC = () => Promise.resolve().then(function () { return creditDetails_get$1; });
const _lazy_xjSv7w = () => Promise.resolve().then(function () { return debitDetails_get$1; });
const _lazy_jCF0gI = () => Promise.resolve().then(function () { return displayMaster_get$1; });
const _lazy_go6kTv = () => Promise.resolve().then(function () { return index_get$1H; });
const _lazy_DaA6x3 = () => Promise.resolve().then(function () { return statuses_get$1; });
const _lazy_kP6N7H = () => Promise.resolve().then(function () { return systemIds_get$1; });
const _lazy_ADo8uH = () => Promise.resolve().then(function () { return index_get$1F; });
const _lazy_Hvt1mc = () => Promise.resolve().then(function () { return index_get$1D; });
const _lazy_60HNR6 = () => Promise.resolve().then(function () { return index_get$1B; });
const _lazy_NA7o8T = () => Promise.resolve().then(function () { return index_get$1z; });
const _lazy_Eh2VHQ = () => Promise.resolve().then(function () { return index_get$1x; });
const _lazy_NBlLeR = () => Promise.resolve().then(function () { return index_get$1v; });
const _lazy_O7qDuw = () => Promise.resolve().then(function () { return index_get$1t; });
const _lazy_5htunS = () => Promise.resolve().then(function () { return index_get$1r; });
const _lazy_yoIKmh = () => Promise.resolve().then(function () { return _id__get$9; });
const _lazy_HBhQBp = () => Promise.resolve().then(function () { return _id__put$b; });
const _lazy_P5dLgi = () => Promise.resolve().then(function () { return prItems_get$1; });
const _lazy_OKGX9O = () => Promise.resolve().then(function () { return prList_get$1; });
const _lazy_gD2rlG = () => Promise.resolve().then(function () { return processFlow_get$3; });
const _lazy_dJMoWh = () => Promise.resolve().then(function () { return index_get$1p; });
const _lazy_0RrL22 = () => Promise.resolve().then(function () { return confirm_post$3; });
const _lazy_QPeeA6 = () => Promise.resolve().then(function () { return index_get$1n; });
const _lazy_52Bfxb = () => Promise.resolve().then(function () { return index_get$1l; });
const _lazy_JVqNu4 = () => Promise.resolve().then(function () { return _id__get$7; });
const _lazy_u3f7To = () => Promise.resolve().then(function () { return confirm_post$1; });
const _lazy_bmMbgt = () => Promise.resolve().then(function () { return index_get$1j; });
const _lazy_w0kGQA = () => Promise.resolve().then(function () { return process_post$1; });
const _lazy_c92f6Q = () => Promise.resolve().then(function () { return poProcess_post$1; });
const _lazy_bD37ZM = () => Promise.resolve().then(function () { return poReverse_post$1; });
const _lazy_kwjyLM = () => Promise.resolve().then(function () { return index_post$l; });
const _lazy_d0v0lT = () => Promise.resolve().then(function () { return index_get$1h; });
const _lazy_WQpmQQ = () => Promise.resolve().then(function () { return index_get$1f; });
const _lazy_QyiJ1P = () => Promise.resolve().then(function () { return index_get$1d; });
const _lazy_rygypV = () => Promise.resolve().then(function () { return index_get$1b; });
const _lazy_0RLNAr = () => Promise.resolve().then(function () { return _id__get$5; });
const _lazy_5wXAIt = () => Promise.resolve().then(function () { return _id__put$9; });
const _lazy_FVxlVK = () => Promise.resolve().then(function () { return processFlow_get$1; });
const _lazy_anWxxF = () => Promise.resolve().then(function () { return index_post$j; });
const _lazy_efoEM7 = () => Promise.resolve().then(function () { return index_get$19; });
const _lazy_EeuJ03 = () => Promise.resolve().then(function () { return index_get$17; });
const _lazy_UHngQK = () => Promise.resolve().then(function () { return index_get$15; });
const _lazy_aLuy8v = () => Promise.resolve().then(function () { return index_get$13; });
const _lazy_7EtXXM = () => Promise.resolve().then(function () { return index_get$11; });
const _lazy_Rnjhlc = () => Promise.resolve().then(function () { return index_get$$; });
const _lazy_MDOdAZ = () => Promise.resolve().then(function () { return index_get$Z; });
const _lazy_o6ZW0M = () => Promise.resolve().then(function () { return index_get$X; });
const _lazy_coxeoJ = () => Promise.resolve().then(function () { return index_get$V; });
const _lazy_oayfze = () => Promise.resolve().then(function () { return index_get$T; });
const _lazy_lRosVj = () => Promise.resolve().then(function () { return index_get$R; });
const _lazy_0Rj7tw = () => Promise.resolve().then(function () { return index_get$P; });
const _lazy_EHsshQ = () => Promise.resolve().then(function () { return index_get$N; });
const _lazy_58XMZP = () => Promise.resolve().then(function () { return groupLookup_get$1; });
const _lazy_A3zYSW = () => Promise.resolve().then(function () { return index_get$L; });
const _lazy_y1LtiN = () => Promise.resolve().then(function () { return itemMainList_get$1; });
const _lazy_VAlqt6 = () => Promise.resolve().then(function () { return mainCategory_get$1; });
const _lazy_4aJxgj = () => Promise.resolve().then(function () { return subcategory_get$1; });
const _lazy_YpCWm8 = () => Promise.resolve().then(function () { return subsiri_get$1; });
const _lazy_KPhtXp = () => Promise.resolve().then(function () { return index_get$J; });
const _lazy_BCDvO5 = () => Promise.resolve().then(function () { return index_get$H; });
const _lazy_I6ydRA = () => Promise.resolve().then(function () { return poStatusOptions_get$1; });
const _lazy_JrSyH5 = () => Promise.resolve().then(function () { return index_get$F; });
const _lazy_QbsSYT = () => Promise.resolve().then(function () { return index_get$D; });
const _lazy_S5IQYw = () => Promise.resolve().then(function () { return index_get$B; });
const _lazy_GFxIbK = () => Promise.resolve().then(function () { return index_get$z; });
const _lazy_VkwlpU = () => Promise.resolve().then(function () { return index_get$x; });
const _lazy_CZSMC7 = () => Promise.resolve().then(function () { return index_get$v; });
const _lazy_NSpeZv = () => Promise.resolve().then(function () { return index_get$t; });
const _lazy_t5JOui = () => Promise.resolve().then(function () { return index_get$r; });
const _lazy_l4u1gu = () => Promise.resolve().then(function () { return index_get$p; });
const _lazy_W3I1uN = () => Promise.resolve().then(function () { return index_get$n; });
const _lazy_rCdrIc = () => Promise.resolve().then(function () { return index_get$l; });
const _lazy_vLlX7G = () => Promise.resolve().then(function () { return index_get$j; });
const _lazy_foVBgo = () => Promise.resolve().then(function () { return index_get$h; });
const _lazy_pmSHDa = () => Promise.resolve().then(function () { return index_get$f; });
const _lazy_nDThRf = () => Promise.resolve().then(function () { return index_get$d; });
const _lazy_M4bLMw = () => Promise.resolve().then(function () { return _code__delete$9; });
const _lazy_q9BGKG = () => Promise.resolve().then(function () { return _code__put$9; });
const _lazy_8nAKfw = () => Promise.resolve().then(function () { return _id__delete$7; });
const _lazy_V1X1ny = () => Promise.resolve().then(function () { return _id__put$7; });
const _lazy_S7Ne2O = () => Promise.resolve().then(function () { return index_get$b; });
const _lazy_CJqQnf = () => Promise.resolve().then(function () { return index_post$h; });
const _lazy_vZpDmA = () => Promise.resolve().then(function () { return index_get$9; });
const _lazy_A4ZDRg = () => Promise.resolve().then(function () { return index_post$f; });
const _lazy_5Z5TiP = () => Promise.resolve().then(function () { return _id__delete$5; });
const _lazy_6WSYIF = () => Promise.resolve().then(function () { return _id__put$5; });
const _lazy_OtHoRj = () => Promise.resolve().then(function () { return index_post$d; });
const _lazy_ea9mAP = () => Promise.resolve().then(function () { return _code__delete$7; });
const _lazy_wDLUN0 = () => Promise.resolve().then(function () { return _code__put$7; });
const _lazy_nCQqNK = () => Promise.resolve().then(function () { return index_post$b; });
const _lazy_XmqL7P = () => Promise.resolve().then(function () { return index_get$7; });
const _lazy_uC9Hez = () => Promise.resolve().then(function () { return _code__delete$5; });
const _lazy_yZOBlY = () => Promise.resolve().then(function () { return _code__put$5; });
const _lazy_Idx7FA = () => Promise.resolve().then(function () { return index_post$9; });
const _lazy_JD34a3 = () => Promise.resolve().then(function () { return _code__delete$3; });
const _lazy_RGUBKD = () => Promise.resolve().then(function () { return _code__put$3; });
const _lazy_plLjzo = () => Promise.resolve().then(function () { return index_post$7; });
const _lazy_ExQn5H = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_BDKz5g = () => Promise.resolve().then(function () { return _id__get$3; });
const _lazy_afq2P1 = () => Promise.resolve().then(function () { return _id__put$3; });
const _lazy_kvHCDW = () => Promise.resolve().then(function () { return autosuggestActivity_get$1; });
const _lazy_USF8zw = () => Promise.resolve().then(function () { return autosuggestCostcentre_get$1; });
const _lazy_AhFE2T = () => Promise.resolve().then(function () { return autosuggestFund_get$1; });
const _lazy_YVWObS = () => Promise.resolve().then(function () { return autosuggestPtj_get$3; });
const _lazy_BI6GGC = () => Promise.resolve().then(function () { return index_get$5; });
const _lazy_Rc9ClJ = () => Promise.resolve().then(function () { return index_post$5; });
const _lazy_3VBqur = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_ftluMV = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_OhXZ5W = () => Promise.resolve().then(function () { return _id__put$1; });
const _lazy_ExksG5 = () => Promise.resolve().then(function () { return autosuggestCode_get$1; });
const _lazy_vQw8DS = () => Promise.resolve().then(function () { return autosuggestPtj_get$1; });
const _lazy_jssVug = () => Promise.resolve().then(function () { return index_get$3; });
const _lazy_CE5tSJ = () => Promise.resolve().then(function () { return index_post$3; });
const _lazy_P1eZEm = () => Promise.resolve().then(function () { return _code__delete$1; });
const _lazy_QZC8TM = () => Promise.resolve().then(function () { return _code__put$1; });
const _lazy_rijInL = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_KXnmuq = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_mycaF9 = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _JnSmkc, lazy: false, middleware: true, method: undefined },
  { route: '/api/accountcode/:id', handler: _lazy_11lLaK, lazy: true, middleware: false, method: "delete" },
  { route: '/api/accountcode/:id', handler: _lazy_7iYDvs, lazy: true, middleware: false, method: "get" },
  { route: '/api/accountcode/:id', handler: _lazy_LzEj9I, lazy: true, middleware: false, method: "put" },
  { route: '/api/accountcode', handler: _lazy_MZrFCP, lazy: true, middleware: false, method: "get" },
  { route: '/api/accountcode', handler: _lazy_zrQ1hT, lazy: true, middleware: false, method: "post" },
  { route: '/api/adm-message-log', handler: _lazy_x1NMG2, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_dhxdUX, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/logout', handler: _lazy_lGCquO, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/validate', handler: _lazy_7BJqW2, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/budget-closing/fund-types', handler: _lazy_DoX3mo, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/budget-closing/reverse-process', handler: _lazy_dN5UDM, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/budget-closing/start-process', handler: _lazy_rIAzrt, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/budget-listing', handler: _lazy_UrEHNS, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/decrement-v2-form/detail', handler: _lazy_VnZ0V3, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/decrement-v2-form/detail', handler: _lazy_8phHBw, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/decrement-v2-form/detail', handler: _lazy_OL50sd, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/decrement-v2-form/detail', handler: _lazy_8hppZG, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/decrement-v2-form/detail/get-budget', handler: _lazy_Lih8rp, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/decrement-v2-form/detail/get', handler: _lazy_7uuD5G, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/decrement-v2-form/lookups/budget-codes', handler: _lazy_gomDPX, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/decrement-v2-form/master', handler: _lazy_9iBcDv, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/decrement-v2-form/new', handler: _lazy_HHUc9g, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/decrement-v2-form/process-flow', handler: _lazy_hdA5PU, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/decrement-v2-form/submit', handler: _lazy_JHnpAF, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/decrement', handler: _lazy_L9wvFb, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/detail', handler: _lazy_1XGflr, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/increment-v2-form/detail', handler: _lazy_bnSzec, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/detail', handler: _lazy_378Rc8, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/increment-v2-form/detail', handler: _lazy_ufQ6Cb, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/increment-v2-form/detail/get-budget', handler: _lazy_Y1NC7q, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/detail/get', handler: _lazy_9wxj2w, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/lookups/budget-codes', handler: _lazy_2klYQR, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/lookups/quarters', handler: _lazy_KDTwNN, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/master', handler: _lazy_XyesQ1, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/new', handler: _lazy_3mnyKz, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/increment-v2-form/process-flow', handler: _lazy_zxQSzt, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/increment-v2-form/submit', handler: _lazy_twLJxZ, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/increment', handler: _lazy_Uu6BBm, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/initial', handler: _lazy_Wvf64I, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/initial/lookups/quarters', handler: _lazy_sqsoaP, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/initial/lookups/statuses', handler: _lazy_YCwx1f, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/initial/lookups/years', handler: _lazy_X66lJo, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/monitoring', handler: _lazy_cdmlkk, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/detail', handler: _lazy_WtzKYO, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/new-initial-v2/detail', handler: _lazy_Mh9Be4, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/detail', handler: _lazy_EyAytB, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/new-initial-v2/detail', handler: _lazy_bk8ctN, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/new-initial-v2/detail/get', handler: _lazy_oIOI0W, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/lookups/activities', handler: _lazy_uDiTuv, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/lookups/budget-codes', handler: _lazy_JjBJiv, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/lookups/cost-centres', handler: _lazy_L7d99p, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/lookups/fund-types', handler: _lazy_wjJSU3, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/lookups/ptjs', handler: _lazy_IKrzGx, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/lookups/quarters', handler: _lazy_FfOmko, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/lookups/years', handler: _lazy_8UExup, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/master', handler: _lazy_eIntaO, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/new', handler: _lazy_jfyMmb, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/new-initial-v2/process-flow', handler: _lazy_Hv40dk, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/new-initial-v2/submit', handler: _lazy_oDOqfG, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/planning/budget-planning-allocation-2-list', handler: _lazy_H1aGP0, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/budget-planning-allocation-3-list', handler: _lazy_DJG3jW, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/dasar-sedia-ada/:id', handler: _lazy_qRKX8F, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/planning/dasar-sedia-ada/:id', handler: _lazy_x16lUd, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/dasar-sedia-ada', handler: _lazy_e3HuGV, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/new-application', handler: _lazy_BjchFt, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/planning/report/abm-4', handler: _lazy_rAxic5, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/abm-5', handler: _lazy_tfqQ2Z, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/abm-7', handler: _lazy_MqpySM, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/abm-justfikasi', handler: _lazy_oETRi1, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/lampiran-abm-7', handler: _lazy_iZiI3Z, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/lookups/fund-type', handler: _lazy_DB2wIS, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/lookups/ptj', handler: _lazy_DgGdq0, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/lookups/status', handler: _lazy_akq79j, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/planning/report/lookups/vot-type', handler: _lazy_tDoLbL, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/budget-report-by-account/allocation-expenditure-balance-by-budget-code', handler: _lazy_dg1uRQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/budget-report-by-account/budget-summary-by-account-code-wbr072', handler: _lazy_9vJhqP, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/budget-report-by-ptj/variation-report-wbr074', handler: _lazy_W1SCx9, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/laporan-belanjawan', handler: _lazy_US1dFe, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/lookups/years', handler: _lazy_CXnThR, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/total-allocation-expenditure-balance', handler: _lazy_CHRMEY, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/warrant/warrant-decrement', handler: _lazy_4HmIhG, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/warrant/warrant-increment', handler: _lazy_TPq10b, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/warrant/warrant-initial', handler: _lazy_LvFzdG, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/report/warrant/warrant-virement', handler: _lazy_N5r0gB, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/allocation/:id', handler: _lazy_9omOGm, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/setup/allocation/:id', handler: _lazy_EpzM19, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/allocation/:id', handler: _lazy_6ttsL7, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/setup/allocation', handler: _lazy_jmSh2d, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/allocation', handler: _lazy_9OPCm4, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/setup/budget-code/:id', handler: _lazy_C0n078, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/setup/budget-code/:id', handler: _lazy_xqp3d8, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/budget-code/:id', handler: _lazy_K5vXOz, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/setup/budget-code', handler: _lazy_eVYqQT, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/budget-code', handler: _lazy_v9lJfr, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/setup/budget-planning-schedule/:id', handler: _lazy_2qw2IW, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/setup/budget-planning-schedule/:id', handler: _lazy_hBTcA8, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/budget-planning-schedule/:id', handler: _lazy_6gi9dl, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/setup/budget-planning-schedule', handler: _lazy_qEZOhm, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/budget-planning-schedule', handler: _lazy_6yordj, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/setup/budget-structure-list/:id', handler: _lazy_c9v1Pw, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/setup/budget-structure-list/:id', handler: _lazy_EXvK4w, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/budget-structure-list/:id', handler: _lazy_KHrZeu, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/setup/budget-structure-list', handler: _lazy_HDtJpK, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/setup/budget-structure-list', handler: _lazy_OSt7ZC, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/virement-v2-form/detail', handler: _lazy_4fvx2o, lazy: true, middleware: false, method: "delete" },
  { route: '/api/budget/virement-v2-form/detail', handler: _lazy_rm16Mz, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/virement-v2-form/detail', handler: _lazy_1nnw9s, lazy: true, middleware: false, method: "put" },
  { route: '/api/budget/virement-v2-form/detail/from', handler: _lazy_8XmCNU, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/detail/get-budget', handler: _lazy_ZFYBM9, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/detail/get', handler: _lazy_yX9iHX, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/detail/to', handler: _lazy_XWiEH3, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/lookups/budget-codes', handler: _lazy_IQkUoz, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/lookups/currency-codes', handler: _lazy_rGaqL9, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/lookups/movement-types', handler: _lazy_0n0XWY, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/master', handler: _lazy_8yOOdM, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/new', handler: _lazy_b97POi, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/virement-v2-form/process-flow', handler: _lazy_BLdIU7, lazy: true, middleware: false, method: "get" },
  { route: '/api/budget/virement-v2-form/submit', handler: _lazy_C6VaOX, lazy: true, middleware: false, method: "post" },
  { route: '/api/budget/virement', handler: _lazy_HPA0LO, lazy: true, middleware: false, method: "get" },
  { route: '/api/component-editor/:id', handler: _lazy_bNgXEb, lazy: true, middleware: false, method: "delete" },
  { route: '/api/component-editor/:id', handler: _lazy_GoNvhp, lazy: true, middleware: false, method: "put" },
  { route: '/api/component-editor/available-pages', handler: _lazy_in6Z4D, lazy: true, middleware: false, method: "get" },
  { route: '/api/component-editor/helpers', handler: _lazy_cgAuiZ, lazy: true, middleware: false, method: undefined },
  { route: '/api/component-editor/import', handler: _lazy_XCnfNt, lazy: true, middleware: false, method: "post" },
  { route: '/api/component-editor', handler: _lazy_4UIxlx, lazy: true, middleware: false, method: "get" },
  { route: '/api/component-editor', handler: _lazy_w4bnzk, lazy: true, middleware: false, method: "post" },
  { route: '/api/component-editor/migration-files', handler: _lazy_sGbUQA, lazy: true, middleware: false, method: "get" },
  { route: '/api/component-item-editor/:id', handler: _lazy_3HbP3o, lazy: true, middleware: false, method: "delete" },
  { route: '/api/component-item-editor/:id', handler: _lazy_fZGEjC, lazy: true, middleware: false, method: "put" },
  { route: '/api/component-item-editor/helpers', handler: _lazy_UUvKmz, lazy: true, middleware: false, method: undefined },
  { route: '/api/component-item-editor/import', handler: _lazy_9xhm0Q, lazy: true, middleware: false, method: "post" },
  { route: '/api/component-item-editor', handler: _lazy_YZDKoi, lazy: true, middleware: false, method: "get" },
  { route: '/api/component-item-editor', handler: _lazy_JYCuvn, lazy: true, middleware: false, method: "post" },
  { route: '/api/component-item-editor/migration-files', handler: _lazy_J4JL45, lazy: true, middleware: false, method: "get" },
  { route: '/api/devtool/api/file-code', handler: _lazy_qQFKid, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/api/linter', handler: _lazy_MTxlIa, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/api/list', handler: _lazy_ldwKlF, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/api/prettier-format', handler: _lazy_T636SD, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/api/save', handler: _lazy_KGMN8L, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/config/add-custom-theme', handler: _lazy_L2IGzm, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/config/env', handler: _lazy_EZUFAq, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/config/loading-logo', handler: _lazy_rpKYn2, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/config/site-settings', handler: _lazy_Q8NQPv, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/config/upload-file', handler: _lazy_d12ypg, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/canvas/file-code', handler: _lazy_pBbcZe, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/code/file-code', handler: _lazy_oSc8B3, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/code/linter', handler: _lazy_6wiYsk, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/code/prettier-format', handler: _lazy_HmkWW4, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/code/save', handler: _lazy_SL9TBs, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/template/get-list', handler: _lazy_zAZq9k, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/template/import', handler: _lazy_mFbsPq, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/template/list', handler: _lazy_qAKmQx, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/content/template/tag', handler: _lazy_RbvpvC, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/lookup/list', handler: _lazy_AXRmbP, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/menu/add', handler: _lazy_2FCOrW, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/menu/delete', handler: _lazy_JCuVbI, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/menu/edit', handler: _lazy_zI8UKT, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/menu/new-add', handler: _lazy_w913au, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/menu/overwrite-navigation', handler: _lazy_OlIqpJ, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/menu/role-list', handler: _lazy_MwxnIW, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/menu/user-list', handler: _lazy_BPQlwD, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/orm/data/get', handler: _lazy_8IXniM, lazy: true, middleware: false, method: "get" },
  { route: '/api/devtool/orm/schema', handler: _lazy_2C1kFt, lazy: true, middleware: false, method: "get" },
  { route: '/api/devtool/orm/studio', handler: _lazy_VoUftV, lazy: true, middleware: false, method: "get" },
  { route: '/api/devtool/orm/table/config', handler: _lazy_fn36FZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/devtool/orm/table/create', handler: _lazy_KZn2pq, lazy: true, middleware: false, method: "post" },
  { route: '/api/devtool/orm/table/delete/:table', handler: _lazy_AnQKMn, lazy: true, middleware: false, method: "delete" },
  { route: '/api/devtool/orm/table/modify/get', handler: _lazy_l9yFRq, lazy: true, middleware: false, method: "get" },
  { route: '/api/devtool/orm/table/modify', handler: _lazy_XI0rLr, lazy: true, middleware: false, method: "post" },
  { route: '/api/devtool/role/add', handler: _lazy_iZGbbR, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/role/delete', handler: _lazy_rcPHFe, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/role/edit', handler: _lazy_3ybZYM, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/role/list', handler: _lazy_QvMjId, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/user/add', handler: _lazy_w5y7rW, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/user/delete', handler: _lazy_YQTfP5, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/user/edit', handler: _lazy_E0yKnf, lazy: true, middleware: false, method: undefined },
  { route: '/api/devtool/user/list', handler: _lazy_8VYAn6, lazy: true, middleware: false, method: undefined },
  { route: '/api/fundtype/:id', handler: _lazy_7BvbP2, lazy: true, middleware: false, method: "delete" },
  { route: '/api/fundtype/:id', handler: _lazy_CDSgDq, lazy: true, middleware: false, method: "put" },
  { route: '/api/fundtype', handler: _lazy_k2i2sk, lazy: true, middleware: false, method: "get" },
  { route: '/api/fundtype', handler: _lazy_9LQOlI, lazy: true, middleware: false, method: "post" },
  { route: '/api/message-log', handler: _lazy_SlS9AQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/metabase/token', handler: _lazy_HIvvD0, lazy: true, middleware: false, method: "get" },
  { route: '/api/page-editor/:id', handler: _lazy_Wmziju, lazy: true, middleware: false, method: "delete" },
  { route: '/api/page-editor/:id', handler: _lazy_QeOyiY, lazy: true, middleware: false, method: "put" },
  { route: '/api/page-editor/available-menus', handler: _lazy_fA0Xkh, lazy: true, middleware: false, method: "get" },
  { route: '/api/page-editor/helpers', handler: _lazy_FJGtUN, lazy: true, middleware: false, method: undefined },
  { route: '/api/page-editor/import', handler: _lazy_M4alr2, lazy: true, middleware: false, method: "post" },
  { route: '/api/page-editor', handler: _lazy_KoEXGe, lazy: true, middleware: false, method: "get" },
  { route: '/api/page-editor', handler: _lazy_DlQQif, lazy: true, middleware: false, method: "post" },
  { route: '/api/page-editor/migration-files', handler: _lazy_gvMgXT, lazy: true, middleware: false, method: "get" },
  { route: '/api/penyuntingmuka/:id', handler: _lazy_T3pa5f, lazy: true, middleware: false, method: "delete" },
  { route: '/api/penyuntingmuka/:id', handler: _lazy_uejfYy, lazy: true, middleware: false, method: "put" },
  { route: '/api/penyuntingmuka/helpers', handler: _lazy_wDM94C, lazy: true, middleware: false, method: undefined },
  { route: '/api/penyuntingmuka', handler: _lazy_NQFPSh, lazy: true, middleware: false, method: "get" },
  { route: '/api/penyuntingmuka', handler: _lazy_YZ3B9T, lazy: true, middleware: false, method: "post" },
  { route: '/api/penyuntingmuka/next-id', handler: _lazy_sxxZjf, lazy: true, middleware: false, method: "get" },
  { route: '/api/posting-to-gl/credit-details', handler: _lazy_HQ5mNC, lazy: true, middleware: false, method: "get" },
  { route: '/api/posting-to-gl/debit-details', handler: _lazy_xjSv7w, lazy: true, middleware: false, method: "get" },
  { route: '/api/posting-to-gl/display-master', handler: _lazy_jCF0gI, lazy: true, middleware: false, method: "get" },
  { route: '/api/posting-to-gl', handler: _lazy_go6kTv, lazy: true, middleware: false, method: "get" },
  { route: '/api/posting-to-gl/statuses', handler: _lazy_DaA6x3, lazy: true, middleware: false, method: "get" },
  { route: '/api/posting-to-gl/system-ids', handler: _lazy_kP6N7H, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/advertisement/committee-report', handler: _lazy_ADo8uH, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/advertisement/duration-tender-quotation', handler: _lazy_Hvt1mc, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/advertisement/new-tender-quotation', handler: _lazy_60HNR6, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/advertisement/request-list', handler: _lazy_NA7o8T, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/agreement/list', handler: _lazy_Eh2VHQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/bank-guarantee/list', handler: _lazy_NBlLeR, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/good-receive-note/cancel', handler: _lazy_O7qDuw, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/good-receive-note/list', handler: _lazy_5htunS, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/:id', handler: _lazy_yoIKmh, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/:id', handler: _lazy_HBhQBp, lazy: true, middleware: false, method: "put" },
  { route: '/api/purchasing/purchase-order/:id/pr-items', handler: _lazy_P5dLgi, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/:id/pr-list', handler: _lazy_OKGX9O, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/:id/process-flow', handler: _lazy_gD2rlG, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/cancel-po-partial-listing', handler: _lazy_dJMoWh, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/closing/po-closed-reverse/confirm', handler: _lazy_0RrL22, lazy: true, middleware: false, method: "post" },
  { route: '/api/purchasing/purchase-order/closing/po-closed-reverse', handler: _lazy_QPeeA6, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/closing/po-confirmation-process-list', handler: _lazy_52Bfxb, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/closing/po-confirmation-process/:id', handler: _lazy_JVqNu4, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/closing/po-confirmation-process/confirm', handler: _lazy_u3f7To, lazy: true, middleware: false, method: "post" },
  { route: '/api/purchasing/purchase-order/closing/po-confirmation-process', handler: _lazy_bmMbgt, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/closing/po-confirmation-process/process', handler: _lazy_w0kGQA, lazy: true, middleware: false, method: "post" },
  { route: '/api/purchasing/purchase-order/closing/process-closing/po-process', handler: _lazy_c92f6Q, lazy: true, middleware: false, method: "post" },
  { route: '/api/purchasing/purchase-order/closing/process-closing/po-reverse', handler: _lazy_bD37ZM, lazy: true, middleware: false, method: "post" },
  { route: '/api/purchasing/purchase-order', handler: _lazy_kwjyLM, lazy: true, middleware: false, method: "post" },
  { route: '/api/purchasing/purchase-order/list-cancellation', handler: _lazy_d0v0lT, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/list', handler: _lazy_WQpmQQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/new-cancel-po-partial', handler: _lazy_QyiJ1P, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-order/new-cancellation', handler: _lazy_rygypV, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-requisition/:id', handler: _lazy_0RLNAr, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-requisition/:id', handler: _lazy_5wXAIt, lazy: true, middleware: false, method: "put" },
  { route: '/api/purchasing/purchase-requisition/:id/process-flow', handler: _lazy_FVxlVK, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-requisition', handler: _lazy_anWxxF, lazy: true, middleware: false, method: "post" },
  { route: '/api/purchasing/purchase-requisition/list-cancel-pr-partial', handler: _lazy_efoEM7, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-requisition/list-cancellation', handler: _lazy_EeuJ03, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-requisition/list-pr-to-be-cancel-partial', handler: _lazy_UHngQK, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-requisition/list-pr-to-be-cancel', handler: _lazy_aLuy8v, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/purchase-requisition/list', handler: _lazy_7EtXXM, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/report-po/bendahari', handler: _lazy_Rnjhlc, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/report-po/ptj', handler: _lazy_MDOdAZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/report/laporan-lppm-jpka-kpt/perolehan-melalui-kontrak-pusat-sistem-panel', handler: _lazy_o6ZW0M, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/report/laporan-perolehan-ptj-jpka-lppm/laporan-keseluruhan-perolehan', handler: _lazy_coxeoJ, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/report/laporan-perolehan-ptj-jpka-lppm/senarai-tempoh-masa-lpo', handler: _lazy_oayfze, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/report/vendor-assessment-grn', handler: _lazy_lRosVj, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/assessment-question', handler: _lazy_0Rj7tw, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/item-main-listing', handler: _lazy_EHsshQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/item-main/group-lookup', handler: _lazy_58XMZP, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/item-main', handler: _lazy_A3zYSW, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/item-main/item-main-list', handler: _lazy_y1LtiN, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/item-main/main-category', handler: _lazy_VAlqt6, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/item-main/subcategory', handler: _lazy_4aJxgj, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/item-main/subsiri', handler: _lazy_YpCWm8, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/setup/list-of-jobscope', handler: _lazy_KPhtXp, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/status-po-pr', handler: _lazy_BCDvO5, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/status-po-pr/po-status-options', handler: _lazy_I6ydRA, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/tender-quotation/advertisement-complete', handler: _lazy_JrSyH5, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/tender-quotation/cancellation', handler: _lazy_QbsSYT, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/tender-quotation/committee-participant', handler: _lazy_S5IQYw, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/tender-quotation/evaluation', handler: _lazy_GFxIbK, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/tender-quotation/generated-offer-letter', handler: _lazy_VkwlpU, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/tender-quotation/selection', handler: _lazy_CZSMC7, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/variation-order/list', handler: _lazy_NSpeZv, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/vendor-assessment/good-receive-note', handler: _lazy_t5JOui, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/vendor-assessment/work-progress-note', handler: _lazy_l4u1gu, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/vendor/bank-account-update', handler: _lazy_W3I1uN, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/vendor/list', handler: _lazy_rCdrIc, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/vendor/profile', handler: _lazy_vLlX7G, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/work-progress-note/cancel', handler: _lazy_foVBgo, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/work-progress-note/detail', handler: _lazy_pmSHDa, lazy: true, middleware: false, method: "get" },
  { route: '/api/purchasing/work-progress-note/list', handler: _lazy_nDThRf, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/account-code/:code', handler: _lazy_M4bLMw, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/account-code/:code', handler: _lazy_q9BGKG, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/account-code/activity/:id', handler: _lazy_8nAKfw, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/account-code/activity/:id', handler: _lazy_V1X1ny, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/account-code/activity', handler: _lazy_S7Ne2O, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/account-code/activity', handler: _lazy_CJqQnf, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/account-code', handler: _lazy_vZpDmA, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/account-code', handler: _lazy_A4ZDRg, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/activity-code/activity-type/:id', handler: _lazy_5Z5TiP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/activity-code/activity-type/:id', handler: _lazy_6WSYIF, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/activity-code/activity-type', handler: _lazy_OtHoRj, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/activity-code/group/:code', handler: _lazy_ea9mAP, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/activity-code/group/:code', handler: _lazy_wDLUN0, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/activity-code/group', handler: _lazy_nCQqNK, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/activity-code', handler: _lazy_XmqL7P, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/activity-code/subgroup/:code', handler: _lazy_uC9Hez, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/activity-code/subgroup/:code', handler: _lazy_yZOBlY, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/activity-code/subgroup', handler: _lazy_Idx7FA, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/activity-code/subsiri/:code', handler: _lazy_JD34a3, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/activity-code/subsiri/:code', handler: _lazy_RGUBKD, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/activity-code/subsiri', handler: _lazy_plLjzo, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/cascade-structure/:id', handler: _lazy_ExQn5H, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/cascade-structure/:id', handler: _lazy_BDKz5g, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cascade-structure/:id', handler: _lazy_afq2P1, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/cascade-structure/autosuggest-activity', handler: _lazy_kvHCDW, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cascade-structure/autosuggest-costcentre', handler: _lazy_USF8zw, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cascade-structure/autosuggest-fund', handler: _lazy_AhFE2T, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cascade-structure/autosuggest-ptj', handler: _lazy_YVWObS, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cascade-structure', handler: _lazy_BI6GGC, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cascade-structure', handler: _lazy_Rc9ClJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/cost-centre/:id', handler: _lazy_3VBqur, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/cost-centre/:id', handler: _lazy_ftluMV, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cost-centre/:id', handler: _lazy_OhXZ5W, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/cost-centre/autosuggest-code', handler: _lazy_ExksG5, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cost-centre/autosuggest-ptj', handler: _lazy_vQw8DS, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cost-centre', handler: _lazy_jssVug, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/cost-centre', handler: _lazy_CE5tSJ, lazy: true, middleware: false, method: "post" },
  { route: '/api/setup/ptj-code/:code', handler: _lazy_P1eZEm, lazy: true, middleware: false, method: "delete" },
  { route: '/api/setup/ptj-code/:code', handler: _lazy_QZC8TM, lazy: true, middleware: false, method: "put" },
  { route: '/api/setup/ptj-code', handler: _lazy_rijInL, lazy: true, middleware: false, method: "get" },
  { route: '/api/setup/ptj-code', handler: _lazy_KXnmuq, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_mycaF9, lazy: true, middleware: false, method: undefined },
  { route: '', handler: _hP22zj, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _gKtDfw, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _9fvbw0, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _PKi8Se, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_mycaF9, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(true),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const server = new Server(toNodeListener(nitroApp.h3App));
function getAddress() {
  if (provider === "stackblitz" || process.env.NITRO_NO_UNIX_SOCKET) {
    return "0";
  }
  const socketName = `worker-${process.pid}-${threadId}.sock`;
  if (isWindows) {
    return join("\\\\.\\pipe\\nitro", socketName);
  } else {
    const socketDir = join(tmpdir(), "nitro");
    mkdirSync(socketDir, { recursive: true });
    return join(socketDir, socketName);
  }
}
const listenAddress = getAddress();
server.listen(listenAddress, () => {
  const _address = server.address();
  parentPort.postMessage({
    event: "listen",
    address: typeof _address === "string" ? { socketPath: _address } : { host: "localhost", port: _address.port }
  });
});
trapUnhandledNodeErrors();
async function onShutdown(signal) {
  await nitroApp.hooks.callHook("close");
}
parentPort.on("message", async (msg) => {
  if (msg && msg.event === "shutdown") {
    await onShutdown();
    parentPort.postMessage({ event: "exit" });
  }
});

const _messages = {"appName":"Nuxt","version":"","statusCode":500,"statusMessage":"Server error","description":"An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.","stack":""};
const _render = function({ messages }) {
var __t, __p = '';
__p += '<!DOCTYPE html><html><head><title>' +
((__t = ( messages.statusCode )) == null ? '' : __t) +
' - ' +
((__t = ( messages.statusMessage )) == null ? '' : __t) +
' | ' +
((__t = ( messages.appName )) == null ? '' : __t) +
'</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1,minimum-scale=1" name="viewport"><style>.spotlight{background:linear-gradient(45deg, #00DC82 0%, #36E4DA 50%, #0047E1 100%);opacity:0.8;filter:blur(30vh);height:60vh;bottom:-40vh}*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e0e0e0}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p,pre{margin:0}h1{font-size:inherit;font-weight:inherit}pre{font-size:1em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.bg-white{--tw-bg-opacity:1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.bg-black\\/5{--tw-bg-opacity:.05;background-color:rgba(0,0,0,var(--tw-bg-opacity))}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.flex{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.flex-col{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.flex-1{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"}.font-medium{font-weight:500}.font-light{font-weight:300}.h-auto{height:auto}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-6xl{font-size:3.75rem;line-height:1}.leading-tight{line-height:1.25}.mb-8{margin-bottom:2rem}.mb-6{margin-bottom:1.5rem}.min-h-screen{min-height:100vh}.overflow-y-auto{overflow-y:auto}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.text-black{--tw-text-opacity:1;color:rgba(0,0,0,var(--tw-text-opacity))}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.z-10{z-index:10}@media (min-width: 640px){.sm\\:text-8xl{font-size:6rem;line-height:1}.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}}@media (prefers-color-scheme: dark){.dark\\:bg-black{--tw-bg-opacity:1;background-color:rgba(0,0,0,var(--tw-bg-opacity))}.dark\\:bg-white\\/10{--tw-bg-opacity:.1;background-color:rgba(255,255,255,var(--tw-bg-opacity))}.dark\\:text-white{--tw-text-opacity:1;color:rgba(255,255,255,var(--tw-text-opacity))}}</style><script>(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll(\'link[rel="modulepreload"]\'))i(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();</script></head><body class="font-sans antialiased bg-white px-10 pt-14 dark:bg-black text-black dark:text-white min-h-screen flex flex-col"><div class="fixed left-0 right-0 spotlight"></div><h1 class="text-6xl sm:text-8xl font-medium mb-6">' +
((__t = ( messages.statusCode )) == null ? '' : __t) +
'</h1><p class="text-xl sm:text-2xl font-light mb-8 leading-tight">' +
((__t = ( messages.description )) == null ? '' : __t) +
'</p><div class="bg-white rounded-t-md bg-black/5 dark:bg-white/10 flex-1 overflow-y-auto h-auto"><pre class="text-xl font-light leading-tight z-10 p-8">' +
((__t = ( messages.stack )) == null ? '' : __t) +
'</pre></div></body></html>';
return __p
};
const _template = (messages) => _render({ messages: { ..._messages, ...messages } });
const template$1 = _template;

const errorDev = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template$1
});

const _id__delete$s = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Account code ID is required"
      };
    }
    const existingAccountCode = await prisma$1.account_code.findUnique({
      where: {
        id: BigInt(id)
      }
    });
    if (!existingAccountCode) {
      return {
        statusCode: 404,
        message: "Account code not found"
      };
    }
    await prisma$1.account_code.delete({
      where: {
        id: BigInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Account code deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__delete$t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$s
});

const _id__get$k = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Account code ID is required"
      };
    }
    const accountCode = await prisma$1.account_code.findUnique({
      where: {
        id: BigInt(id)
      }
    });
    if (!accountCode) {
      return {
        statusCode: 404,
        message: "Account code not found"
      };
    }
    return {
      statusCode: 200,
      message: "Account code fetched successfully",
      data: {
        id: accountCode.id.toString(),
        fundTypeCode: accountCode.fund_type_code,
        accountCode: accountCode.account_code,
        accountDescription: accountCode.account_description,
        accountLevel: accountCode.account_level,
        accountType: accountCode.account_type,
        accountClass: accountCode.account_class,
        statementItem: accountCode.statement_item,
        accountStatus: accountCode.account_status
      }
    };
  } catch (error) {
    console.error("Error fetching account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__get$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$k
});

const _id__put$u = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "Account code ID is required"
      };
    }
    const existingAccountCode = await prisma$1.account_code.findUnique({
      where: {
        id: BigInt(id)
      }
    });
    if (!existingAccountCode) {
      return {
        statusCode: 404,
        message: "Account code not found"
      };
    }
    const validAccountTypes = ["ASET", "LIABILITI", "EKUITI", "HASIL", "BELANJA"];
    if (body.accountType && !validAccountTypes.includes(body.accountType)) {
      return {
        statusCode: 400,
        message: "Invalid account type"
      };
    }
    const validStatementItems = ["BS", "PL"];
    if (body.statementItem && !validStatementItems.includes(body.statementItem)) {
      return {
        statusCode: 400,
        message: "Invalid statement item"
      };
    }
    const validAccountStatuses = ["ACTIVE", "INACTIVE"];
    if (body.accountStatus && !validAccountStatuses.includes(body.accountStatus)) {
      return {
        statusCode: 400,
        message: "Invalid account status"
      };
    }
    if (body.accountCode && body.accountCode !== existingAccountCode.account_code) {
      const duplicateAccountCode = await prisma$1.account_code.findUnique({
        where: {
          account_code: body.accountCode
        }
      });
      if (duplicateAccountCode) {
        return {
          statusCode: 409,
          message: "Account code already exists"
        };
      }
    }
    const updateData = {};
    if (body.fundTypeCode !== void 0)
      updateData.fund_type_code = body.fundTypeCode;
    if (body.accountCode !== void 0)
      updateData.account_code = body.accountCode;
    if (body.accountDescription !== void 0)
      updateData.account_description = body.accountDescription;
    if (body.accountLevel !== void 0)
      updateData.account_level = parseInt(body.accountLevel);
    if (body.accountType !== void 0)
      updateData.account_type = body.accountType;
    if (body.accountClass !== void 0)
      updateData.account_class = body.accountClass;
    if (body.statementItem !== void 0)
      updateData.statement_item = body.statementItem;
    if (body.accountStatus !== void 0)
      updateData.account_status = body.accountStatus;
    updateData.updated_at = /* @__PURE__ */ new Date();
    const accountCode = await prisma$1.account_code.update({
      where: {
        id: BigInt(id)
      },
      data: updateData
    });
    return {
      statusCode: 200,
      message: "Account code updated successfully",
      data: {
        id: accountCode.id.toString(),
        fundTypeCode: accountCode.fund_type_code,
        accountCode: accountCode.account_code,
        accountDescription: accountCode.account_description,
        accountLevel: accountCode.account_level,
        accountType: accountCode.account_type,
        accountClass: accountCode.account_class,
        statementItem: accountCode.statement_item,
        accountStatus: accountCode.account_status
      }
    };
  } catch (error) {
    console.error("Error updating account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__put$v = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$u
});

const index_get$2K = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.fundType && query.fundType.trim() !== "") {
    }
    if (query.accountType && query.accountType.trim() !== "") {
      where.acm_acct_type = { contains: query.accountType.trim() };
    }
    if (query.accountClass && query.accountClass.trim() !== "") {
      where.acm_acct_group = { contains: query.accountClass.trim() };
    }
    if (query.accountStatus && query.accountStatus.trim() !== "") {
      where.acm_acct_status = query.accountStatus.trim();
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      where.OR = [
        { acm_acct_code: { contains: searchTerm } },
        { acm_acct_desc: { contains: searchTerm } },
        { acm_acct_desc_eng: { contains: searchTerm } },
        { acm_acct_type: { contains: searchTerm } },
        { acm_acct_group: { contains: searchTerm } },
        { acm_acct_activity: { contains: searchTerm } },
        { acm_acct_status: { contains: searchTerm } }
      ];
    }
    const accountCodes = await prisma$1.account_main.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        createddate: "desc"
      }
    });
    const formattedData = accountCodes.map((item, index) => ({
      id: item.acm_acct_code,
      no: index + 1,
      accountCode: item.acm_acct_code,
      accountCodeDescription: item.acm_acct_desc || "",
      accountLevel: item.acm_acct_level ? Number(item.acm_acct_level) : null,
      accountType: item.acm_acct_type || "",
      accountClass: item.acm_acct_group || "",
      fundType: "",
      // Not available in account_main directly
      statementItem: "",
      // Not available in account_main directly
      accountStatus: item.acm_acct_status || ""
    }));
    return {
      statusCode: 200,
      message: "Account codes fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching account codes:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    if (error.message && error.message.includes("model") && error.message.includes("not found")) {
      return {
        statusCode: 500,
        message: "Prisma model not found. Please check if 'account_code' model exists in schema.prisma",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      errorDetails: error.stack 
    };
  }
});

const index_get$2L = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2K
});

const index_post$M = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.fundTypeCode || !body.accountCode || !body.accountDescription) {
      return {
        statusCode: 400,
        message: "Fund type code, account code, and account description are required"
      };
    }
    const validAccountTypes = ["ASET", "LIABILITI", "EKUITI", "HASIL", "BELANJA"];
    if (body.accountType && !validAccountTypes.includes(body.accountType)) {
      return {
        statusCode: 400,
        message: "Invalid account type"
      };
    }
    const validStatementItems = ["BS", "PL"];
    if (body.statementItem && !validStatementItems.includes(body.statementItem)) {
      return {
        statusCode: 400,
        message: "Invalid statement item"
      };
    }
    const validAccountStatuses = ["ACTIVE", "INACTIVE"];
    if (body.accountStatus && !validAccountStatuses.includes(body.accountStatus)) {
      return {
        statusCode: 400,
        message: "Invalid account status"
      };
    }
    const existingAccountCode = await prisma$1.account_code.findUnique({
      where: {
        account_code: body.accountCode
      }
    });
    if (existingAccountCode) {
      return {
        statusCode: 409,
        message: "Account code already exists"
      };
    }
    const accountCode = await prisma$1.account_code.create({
      data: {
        fund_type_code: body.fundTypeCode,
        account_code: body.accountCode,
        account_description: body.accountDescription,
        account_level: parseInt(body.accountLevel) || 1,
        account_type: body.accountType || "ASET",
        account_class: body.accountClass || "",
        statement_item: body.statementItem || "BS",
        account_status: body.accountStatus || "ACTIVE"
      }
    });
    return {
      statusCode: 201,
      message: "Account code created successfully",
      data: {
        id: accountCode.id.toString(),
        fundTypeCode: accountCode.fund_type_code,
        accountCode: accountCode.account_code,
        accountDescription: accountCode.account_description,
        accountLevel: accountCode.account_level,
        accountType: accountCode.account_type,
        accountClass: accountCode.account_class,
        statementItem: accountCode.statement_item,
        accountStatus: accountCode.account_status
      }
    };
  } catch (error) {
    console.error("Error creating account code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_post$N = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$M
});

const index_post$K = defineEventHandler(async (event) => {
  var _a, _b;
  console.log("=== MESSAGE LOG API CALLED ===");
  console.log("Request method:", event.method);
  console.log("Request URL:", (_b = (_a = event.node) == null ? void 0 : _a.req) == null ? void 0 : _b.url);
  try {
    const body = await readBody(event);
    console.log("Message log request body:", JSON.stringify(body, null, 2));
    const {
      ml_user_id,
      ml_user_role,
      ml_page_name,
      ml_module_name,
      ml_page_breadcrumb
    } = body || {};
    const mesgCode = "TRX-CNF-002";
    const userAction = "CONFIRM";
    const createdBy = ml_user_id || "system";
    const now = /* @__PURE__ */ new Date();
    const dataToInsert = {
      mm_mesg_code: mesgCode,
      ml_user_id: ml_user_id || null,
      ml_user_role: ml_user_role || null,
      ml_page_name: ml_page_name || null,
      ml_user_action: userAction,
      ml_module_name: ml_module_name || null,
      ml_page_breadcrumb: ml_page_breadcrumb || null,
      ml_status: "OPEN",
      createddate: now,
      createdby: createdBy
    };
    console.log("Attempting to create message log with:", JSON.stringify(dataToInsert, null, 2));
    if (!prisma$1 || !prisma$1.adm_message_log) {
      console.error("Prisma client or adm_message_log model is not available");
      throw new Error("Database connection not available");
    }
    const record = await prisma$1.adm_message_log.create({
      data: dataToInsert
    });
    console.log("Message log created successfully:", record.ml_message_log_id);
    return {
      statusCode: 200,
      message: "Message log recorded",
      data: { id: record.ml_message_log_id }
    };
  } catch (error) {
    console.error("=== ERROR WRITING MESSAGE LOG ===");
    console.error("Error code:", error == null ? void 0 : error.code);
    console.error("Error message:", error == null ? void 0 : error.message);
    console.error("Error meta:", error == null ? void 0 : error.meta);
    console.error("Error stack:", error == null ? void 0 : error.stack);
    if ((error == null ? void 0 : error.code) && error.code.startsWith("P")) {
      setResponseStatus(event, 400);
      return {
        statusCode: 400,
        message: "Database error",
        error: error.message,
        code: error.code,
        meta: error.meta
      };
    }
    setResponseStatus(event, 500);
    return {
      statusCode: 500,
      message: "Failed to write message log",
      error: (error == null ? void 0 : error.message) || "Unknown error"
    };
  }
});

const index_post$L = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$K
});

const ENV = useRuntimeConfig();
const login_post = defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event);
    if (!username || !password) {
      return {
        statusCode: 400,
        message: "Username and password are required"
      };
    }
    const user = await prisma$1.user.findFirst({
      where: {
        userUsername: username
      }
    });
    if (!user) {
      return {
        statusCode: 404,
        message: "User does not exist"
      };
    }
    const hashedPassword = sha256(password).toString();
    if (user.userPassword !== hashedPassword) {
      return {
        statusCode: 401,
        message: "Invalid password"
      };
    }
    const roles = await prisma$1.userrole.findMany({
      where: {
        userRoleUserID: user.userID
      },
      select: {
        role: {
          select: {
            roleName: true
          }
        }
      }
    });
    const roleNames = roles.map((r) => r.role.roleName);
    const accessToken = generateAccessToken({
      username: user.userUsername,
      roles: roleNames
    });
    const refreshToken = generateRefreshToken({
      username: user.userUsername,
      roles: roleNames
    });
    event.res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Lax; Path=/`,
      `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/`
    ]);
    return {
      statusCode: 200,
      message: "Login success",
      data: {
        username: user.userUsername,
        roles: roleNames
      }
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error"
    };
  }
});
function generateAccessToken(user) {
  return jwt.sign(user, ENV.auth.secretAccess, { expiresIn: "1d" });
}
function generateRefreshToken(user) {
  return jwt.sign(user, ENV.auth.secretRefresh, { expiresIn: "30d" });
}

const login_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: login_post
});

const logout_get = defineEventHandler(async (event) => {
  try {
    event.res.setHeader("Set-Cookie", [
      `accessToken=; HttpOnly; Secure; SameSite=Lax; Path=/`,
      `refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/`
    ]);
    return {
      statusCode: 200,
      message: "Logout success"
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      message: "Server error"
    };
  }
});

const logout_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: logout_get
});

const validate_get = defineEventHandler(async (event) => {
  try {
    const { userID } = event.context.user;
    if (userID == null) {
      return {
        statusCode: 401,
        message: "Unauthorized"
      };
    }
    const validatedUser = await prisma$1.user.findFirst({
      where: {
        userID: parseInt(userID)
      }
    });
    if (!validatedUser) {
      return {
        statusCode: 401,
        message: "Unauthorized"
      };
    }
    return {
      statusCode: 200,
      message: "Authorized"
    };
  } catch (error) {
    return {
      statusCode: 401,
      message: "Unauthorized"
    };
  }
});

const validate_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: validate_get
});

const fundTypes_get$2 = defineEventHandler(async (event) => {
  try {
    const fundTypes = await prisma$1.fund_type.findMany({
      where: {
        NOT: {
          fty_basis: "ALLOCATION BASIS"
        }
      },
      orderBy: {
        fty_fund_type: "asc"
      }
    });
    const formattedData = fundTypes.map((item) => ({
      label: `${item.fty_fund_type} - ${item.fty_fund_desc || ""}`,
      value: item.fty_fund_type
    }));
    return {
      statusCode: 200,
      message: "Fund types fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching fund types:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching fund types",
      error: error.message
    };
  }
});

const fundTypes_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: fundTypes_get$2
});

const reverseProcess_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.year || !body.fundType) {
      return {
        statusCode: 400,
        message: "Year and Fund are required"
      };
    }
    return {
      statusCode: 200,
      message: `Budget closing process reversed successfully for Year: ${body.year}, Fund: ${body.fundType}`
    };
  } catch (error) {
    console.error("Error reversing budget closing process:", error);
    return {
      statusCode: 500,
      message: "An error occurred while reversing the budget closing process",
      error: error.message
    };
  }
});

const reverseProcess_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: reverseProcess_post
});

const startProcess_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.year || !body.fundType) {
      return {
        statusCode: 400,
        message: "Year and Fund are required"
      };
    }
    return {
      statusCode: 200,
      message: `Budget closing process started successfully for Year: ${body.year}, Fund: ${body.fundType}`
    };
  } catch (error) {
    console.error("Error starting budget closing process:", error);
    return {
      statusCode: 500,
      message: "An error occurred while starting the budget closing process",
      error: error.message
    };
  }
});

const startProcess_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: startProcess_post
});

const index_get$2I = defineEventHandler(async (event) => {
  try {
    const query2 = getQuery$1(event);
    const bgdID = query2.bgdID;
    const year = query2.year;
    const search = query2.search || "";
    const page2 = parseInt(query2.page) || 1;
    const pageSize = parseInt(query2.pageSize) || 10;
    const skip = (page2 - 1) * pageSize;
    if (!bgdID || !year) {
      return {
        statusCode: 400,
        message: "bgdID and year are required",
        data: []
      };
    }
    const budgetParts = bgdID.split("-");
    if (budgetParts.length < 5) {
      return {
        statusCode: 400,
        message: "Invalid bgdID format",
        data: []
      };
    }
    const [fundType, activityCode, ounCode, costCentre, budgetCode] = budgetParts;
    const structureBudgetWhere = {
      fty_fund_type: fundType,
      at_activity_code: activityCode,
      oun_code: ounCode,
      ccr_costcentre: costCentre,
      lbc_budget_code: budgetCode
    };
    if (query2.dt_initial) {
      return await getBudgetInitial(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query2.dt_increment_decrement) {
      return await getIncrementDecrement(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query2.dt_virement) {
      return await getVirement(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query2.prerequisition_v2) {
      return await getPreRequisition(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query2.dt_requisition_v2) {
      return await getRequisition(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query2.dt_comitment_v2) {
      return await getCommitment(structureBudgetWhere, year, search, skip, pageSize);
    } else if (query2.dt_expenses_v2) {
      return await getExpenses(structureBudgetWhere, year, search, skip, pageSize);
    }
    return {
      statusCode: 400,
      message: "Invalid query parameter",
      data: []
    };
  } catch (error) {
    console.error("Error in budget listing API:", error);
    console.error("Error stack:", error.stack);
    console.error("Query parameters:", {
      bgdID: query.bgdID,
      year: query.year,
      search: query.search,
      queryType: Object.keys(query).find((key) => key.startsWith("dt_") || key === "prerequisition_v2")
    });
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      data: []
    };
  }
});
async function getBudgetInitial(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const yearStr = String(year);
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const budgetAllocationDetls = await prisma$1.budget_allocation_detl.findMany({
      where: {
        bad_sbg_id: { in: sbgIds }
      },
      include: {
        budget_allocation_master: true
      }
    });
    const approvedDetls = budgetAllocationDetls.filter(
      (bad) => bad.budget_allocation_master && bad.budget_allocation_master.bam_status_cd === "APPROVE"
    );
    const masterIds = [...new Set(approvedDetls.map((bad) => bad.bad_master_id).filter(Boolean))];
    if (masterIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: yearStr,
        // Use string year
        bdg_status: "APPROVED"
      },
      include: {
        structure_budget: {
          select: {
            sbg_budget_id: true,
            fty_fund_type: true,
            at_activity_code: true,
            oun_code: true,
            ccr_costcentre: true,
            lbc_budget_code: true
          }
        }
      }
    });
    const quarterIds = budgets.map((b) => b.qbu_quarter_id).filter(Boolean);
    const quarterBudgets = quarterIds.length > 0 ? await prisma$1.quarter_budget.findMany({
      where: {
        qbu_quarter_id: { in: quarterIds }
      }
    }) : [];
    const quarterMap = new Map(
      quarterBudgets.map((qb) => [qb.qbu_quarter_id, qb])
    );
    const allocationMasters = await prisma$1.budget_allocation_master.findMany({
      where: {
        bam_id: { in: masterIds },
        bam_status_cd: "APPROVE"
      }
    });
    const data = budgets.map((budget) => {
      var _a;
      try {
        const allocation = allocationMasters.find(
          (am) => am.bam_allocation_no === budget.bdg_ref_id
        );
        if (!allocation)
          return null;
        const sb = budget.structure_budget;
        if (!sb) {
          console.warn("Structure budget not found for budget:", budget.bdg_budget_id);
          return null;
        }
        const budgetID = `${sb.fty_fund_type || ""}-${sb.at_activity_code || ""}-${sb.oun_code || ""}-${sb.ccr_costcentre || ""}-${sb.lbc_budget_code || ""}`;
        const quarter = budget.qbu_quarter_id ? quarterMap.get(budget.qbu_quarter_id) : null;
        return {
          bdg_year: budget.bdg_year || "",
          bdg_budget_id: budgetID,
          ALLOCATION: quarter ? `${quarter.qbu_quarter_id} - ${quarter.qbu_description}` : "",
          trans_date: allocation.createddate ? (() => {
            try {
              const date = new Date(allocation.createddate);
              if (isNaN(date.getTime()))
                return "";
              return date.toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
              });
            } catch (dateError) {
              console.warn("Error formatting date:", dateError, allocation.createddate);
              return "";
            }
          })() : "",
          bdg_initial_amt: ((_a = budget.bdg_initial_amt) == null ? void 0 : _a.toString()) || "0",
          bdg_ref_id: allocation.bam_allocation_no || "",
          bdg_status: allocation.bam_status_cd || ""
        };
      } catch (mapError) {
        console.error("Error mapping budget data:", mapError, budget);
        return null;
      }
    }).filter(Boolean);
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item).join(" ").toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);
    return {
      statusCode: 200,
      message: "Budget initial data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching budget initial:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      data: [],
      meta: { total: 0, page: 1, pageSize, totalPages: 0 }
    };
  }
}
async function getIncrementDecrement(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year
      },
      select: { bdg_budget_id: true, bdg_year: true }
    });
    const budgetIds = budgets.map((b) => b.bdg_budget_id);
    const transactions = await prisma$1.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: { in: ["DECREMENT", "INCREMENT"] },
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] }
      },
      include: {
        budget: {
          where: {
            bdg_year: year
          }
        },
        structure_budget: true
      }
    });
    const data = transactions.filter((t) => t.budget && t.budget.bdg_year === year).map((transaction) => {
      var _a, _b;
      const budgetID = transaction.structure_budget ? `${transaction.structure_budget.fty_fund_type}-${transaction.structure_budget.at_activity_code}-${transaction.structure_budget.oun_code}-${transaction.structure_budget.ccr_costcentre}-${transaction.structure_budget.lbc_budget_code}` : "";
      return {
        bdg_year: ((_a = transaction.budget) == null ? void 0 : _a.bdg_year) || year,
        bdg_budget_id: budgetID,
        bgt_trans_date: transaction.bgt_trans_date,
        bgt_ref: transaction.bgt_ref || "",
        bgt_trans_amt: ((_b = transaction.bgt_trans_amt) == null ? void 0 : _b.toString()) || "0"
      };
    });
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item).join(" ").toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);
    return {
      statusCode: 200,
      message: "Increment/Decrement data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching increment/decrement:", error);
    throw error;
  }
}
async function getVirement(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year
      },
      select: { bdg_budget_id: true }
    });
    const budgetIds = budgets.map((b) => b.bdg_budget_id);
    const transactions = await prisma$1.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "VIREMENT",
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] }
      },
      include: {
        budget: {
          where: {
            bdg_year: year
          }
        },
        structure_budget: true
      }
    });
    const data = transactions.filter((t) => t.budget && t.budget.bdg_year === year).map((transaction) => {
      var _a, _b;
      const budgetID = transaction.structure_budget ? `${transaction.structure_budget.fty_fund_type}-${transaction.structure_budget.at_activity_code}-${transaction.structure_budget.oun_code}-${transaction.structure_budget.ccr_costcentre}-${transaction.structure_budget.lbc_budget_code}` : "";
      return {
        bdg_year: ((_a = transaction.budget) == null ? void 0 : _a.bdg_year) || year,
        bdg_budget_id: budgetID,
        bgt_trans_date: transaction.bgt_trans_date,
        bgt_ref: transaction.bgt_ref || "",
        bgt_trans_amt: ((_b = transaction.bgt_trans_amt) == null ? void 0 : _b.toString()) || "0"
      };
    });
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item).join(" ").toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);
    return {
      statusCode: 200,
      message: "Virement data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching virement:", error);
    throw error;
  }
}
async function getPreRequisition(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const transactions = await prisma$1.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bgt_system_id: "PRE_REQUISITION"
      },
      include: {
        structure_budget: true
      }
    });
    const data = transactions.map((transaction) => {
      var _a, _b;
      const sb = transaction.structure_budget;
      return {
        sbg_budget_id: ((_a = transaction.sbg_budget_id) == null ? void 0 : _a.toString()) || "",
        fty_fund_type: (sb == null ? void 0 : sb.fty_fund_type) || "",
        at_activity_code: (sb == null ? void 0 : sb.at_activity_code) || "",
        oun_code: (sb == null ? void 0 : sb.oun_code) || "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        acm_acct_code: transaction.acm_acct_code || "",
        lbc_budget_code: (sb == null ? void 0 : sb.lbc_budget_code) || "",
        bgt_trans_date: transaction.bgt_trans_date,
        bgt_ref: transaction.bgt_ref || "",
        bgt_trans_amt: ((_b = transaction.bgt_trans_amt) == null ? void 0 : _b.toString()) || "0"
      };
    });
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item).join(" ").toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);
    return {
      statusCode: 200,
      message: "Pre Requisition data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching pre requisition:", error);
    throw error;
  }
}
async function getRequisition(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year
      },
      select: { bdg_budget_id: true }
    });
    const budgetIds = budgets.map((b) => b.bdg_budget_id);
    const transactions = await prisma$1.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "RQUISITION",
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] }
      },
      include: {
        budget: {
          where: {
            bdg_year: year
          }
        },
        structure_budget: true
      }
    });
    const data = transactions.filter((t) => t.budget && t.budget.bdg_year === year).map((transaction) => {
      var _a, _b, _c;
      const sb = transaction.structure_budget;
      const budgetID = sb ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}` : "";
      return {
        bdg_budget_id: ((_a = transaction.bdg_budget_id) == null ? void 0 : _a.toString()) || "",
        sbg_budget_id: ((_b = transaction.sbg_budget_id) == null ? void 0 : _b.toString()) || "",
        fty_fund_type: (sb == null ? void 0 : sb.fty_fund_type) || "",
        at_activity_code: (sb == null ? void 0 : sb.at_activity_code) || "",
        oun_code: (sb == null ? void 0 : sb.oun_code) || "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        acm_acct_code: transaction.acm_acct_code || "",
        bgt_trans_date: transaction.bgt_trans_date,
        bgt_ref: transaction.bgt_ref || "",
        rqm_requisition_no: transaction.bgt_ref || "",
        // Assuming requisition no is in bgt_ref
        bgt_trans_amt: ((_c = transaction.bgt_trans_amt) == null ? void 0 : _c.toString()) || "0"
      };
    });
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item).join(" ").toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);
    return {
      statusCode: 200,
      message: "Requisition data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching requisition:", error);
    throw error;
  }
}
async function getCommitment(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year
      },
      select: { bdg_budget_id: true }
    });
    const budgetIds = budgets.map((b) => b.bdg_budget_id);
    const transactions = await prisma$1.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "COMMITMENT",
        bgt_task_id: { in: ["05", "06", "APPROVE", "REJECT", "COMPLETE"] }
      },
      include: {
        budget: {
          where: {
            bdg_year: year
          }
        },
        structure_budget: true
      }
    });
    const data = transactions.filter((t) => t.budget && t.budget.bdg_year === year).map((transaction) => {
      var _a, _b, _c;
      const sb = transaction.structure_budget;
      const budgetID = sb ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}` : "";
      return {
        bdg_budget_id: ((_a = transaction.bdg_budget_id) == null ? void 0 : _a.toString()) || "",
        sbg_budget_id: ((_b = transaction.sbg_budget_id) == null ? void 0 : _b.toString()) || "",
        fty_fund_type: (sb == null ? void 0 : sb.fty_fund_type) || "",
        at_activity_code: (sb == null ? void 0 : sb.at_activity_code) || "",
        oun_code: (sb == null ? void 0 : sb.oun_code) || "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        lbc_budget_code: (sb == null ? void 0 : sb.lbc_budget_code) || "",
        bgt_trans_date: transaction.bgt_trans_date,
        bgt_ref: transaction.bgt_ref || "",
        bgt_trans_amt: ((_c = transaction.bgt_trans_amt) == null ? void 0 : _c.toString()) || "0"
      };
    });
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item).join(" ").toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);
    return {
      statusCode: 200,
      message: "Commitment data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching commitment:", error);
    throw error;
  }
}
async function getExpenses(structureBudgetWhere, year, search, skip, pageSize) {
  try {
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: structureBudgetWhere,
      select: { sbg_budget_id: true }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    if (sbgIds.length === 0) {
      return {
        statusCode: 200,
        message: "No data found",
        data: [],
        meta: { total: 0, page: 1, pageSize, totalPages: 0 }
      };
    }
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_year: year
      },
      select: { bdg_budget_id: true }
    });
    const budgetIds = budgets.map((b) => b.bdg_budget_id);
    const transactions = await prisma$1.budget_transaction.findMany({
      where: {
        sbg_budget_id: { in: sbgIds },
        bdg_budget_id: { in: budgetIds },
        bgt_system_id: "EXPENSES"
      },
      include: {
        budget: {
          where: {
            bdg_year: year
          }
        },
        structure_budget: true
      }
    });
    const data = transactions.filter((t) => t.budget && t.budget.bdg_year === year).map((transaction) => {
      var _a, _b, _c;
      const sb = transaction.structure_budget;
      const budgetID = sb ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}` : "";
      return {
        bdg_budget_id: ((_a = transaction.bdg_budget_id) == null ? void 0 : _a.toString()) || "",
        sbg_budget_id: ((_b = transaction.sbg_budget_id) == null ? void 0 : _b.toString()) || "",
        fty_fund_type: (sb == null ? void 0 : sb.fty_fund_type) || "",
        at_activity_code: (sb == null ? void 0 : sb.at_activity_code) || "",
        oun_code: (sb == null ? void 0 : sb.oun_code) || "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        acm_acct_code: transaction.acm_acct_code || "",
        bdg_budget_code: budgetID,
        bgt_trans_date: transaction.bgt_trans_date,
        bgt_ref: transaction.bgt_ref || "",
        bgt_trans_amt: ((_c = transaction.bgt_trans_amt) == null ? void 0 : _c.toString()) || "0"
      };
    });
    let filteredData = data;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = data.filter((item) => {
        const searchableText = Object.values(item).join(" ").toLowerCase();
        return searchableText.includes(searchLower);
      });
    }
    const total = filteredData.length;
    const paginatedData = filteredData.slice(skip, skip + pageSize);
    return {
      statusCode: 200,
      message: "Expenses data fetched successfully",
      data: paginatedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
}

const index_get$2J = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2I
});

const detail_delete$6 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);
    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required"
      };
    }
    await prisma$1.budget_movement_detl.delete({
      where: {
        bmd_bgt_movement_detl_id
      }
    });
    return {
      statusCode: 200,
      message: "Detail deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting detail:", error);
    return {
      statusCode: 500,
      message: "Failed to delete detail",
      error: error.message
    };
  }
});

const detail_delete$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_delete$6
});

const detail_get$4 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const details = await prisma$1.budget_movement_detl.findMany({
      where: {
        bmm_budget_movement_id
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        budget_movement_master: {
          include: {
            quarter_budget: true
          }
        }
      }
    });
    const budgetData = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: {
          in: details.map((d) => d.sbg_budget_id_to).filter(Boolean)
        },
        bdg_status: "APPROVED"
      },
      include: {
        quarter_budget: true
      },
      orderBy: {
        bdg_budget_id: "desc"
      }
    });
    const budgetMap = /* @__PURE__ */ new Map();
    budgetData.forEach((b) => {
      if (b.sbg_budget_id && !budgetMap.has(b.sbg_budget_id)) {
        budgetMap.set(b.sbg_budget_id, b);
      }
    });
    const formattedData = details.map((item) => {
      var _a, _b, _c;
      const sb = item.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
      const qb = (_a = item.budget_movement_master) == null ? void 0 : _a.quarter_budget;
      const budget = item.sbg_budget_id_to ? budgetMap.get(item.sbg_budget_id_to) : null;
      return {
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: (budget == null ? void 0 : budget.bdg_budget_id) || null,
        sbg_budget_id: item.sbg_budget_id_to,
        qbu_quarter_id: (budget == null ? void 0 : budget.quarter_budget) ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : qb ? `${qb.qbu_year} - ${qb.qbu_description}` : "",
        fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        bdg_balance_amt: ((_b = budget == null ? void 0 : budget.bdg_balance_amt) == null ? void 0 : _b.toString()) || "0.00",
        bmd_mvt_amt: ((_c = item.bmd_mvt_amt) == null ? void 0 : _c.toString()) || "0.00"
      };
    });
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching detail list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail list",
      error: error.message
    };
  }
});

const detail_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_get$4
});

const detail_post$6 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { bmm_budget_movement_id, fty_fund_type, oun_code, sbg_budget_code, bdg_budget_id, bmd_mvt_amt } = body;
    if (!bmm_budget_movement_id || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    const budget = await prisma$1.budget.findFirst({
      where: {
        bdg_budget_id: parseInt(bdg_budget_id)
      },
      include: {
        structure_budget: true,
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const maxDetail = await prisma$1.budget_movement_detl.findFirst({
      orderBy: {
        bmd_bgt_movement_detl_id: "desc"
      }
    });
    const nextDetailId = ((maxDetail == null ? void 0 : maxDetail.bmd_bgt_movement_detl_id) || 0) + 1;
    const detail = await prisma$1.budget_movement_detl.create({
      data: {
        bmd_bgt_movement_detl_id: nextDetailId,
        bmm_budget_movement_id: parseInt(bmm_budget_movement_id),
        sbg_budget_id_to: parseInt(sbg_budget_code),
        qbu_quarter_id: budget.qbu_quarter_id,
        bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
        bmd_mvt_status: "DRAFT",
        createdby: "system"
        // TODO: Get from auth
      }
    });
    return {
      statusCode: 200,
      message: "Detail created successfully",
      data: detail
    };
  } catch (error) {
    console.error("Error creating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to create detail",
      error: error.message
    };
  }
});

const detail_post$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_post$6
});

const detail_put$6 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { bmd_bgt_movement_detl_id, fty_fund_type, oun_code, sbg_budget_code, bdg_budget_id, bmd_mvt_amt } = body;
    if (!bmd_bgt_movement_detl_id || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    const budget = await prisma$1.budget.findFirst({
      where: {
        bdg_budget_id: parseInt(bdg_budget_id)
      },
      include: {
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const detail = await prisma$1.budget_movement_detl.update({
      where: {
        bmd_bgt_movement_detl_id: parseInt(bmd_bgt_movement_detl_id)
      },
      data: {
        sbg_budget_id_to: parseInt(sbg_budget_code),
        qbu_quarter_id: budget.qbu_quarter_id,
        bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
        updatedby: "system",
        // TODO: Get from auth
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Detail updated successfully",
      data: detail
    };
  } catch (error) {
    console.error("Error updating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to update detail",
      error: error.message
    };
  }
});

const detail_put$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_put$6
});

const getBudget_get$4 = defineEventHandler(async (event) => {
  var _a;
  try {
    const query = getQuery$1(event);
    const bdg_budget_id = parseInt(query.bdg_budget_id);
    if (!bdg_budget_id) {
      return {
        statusCode: 400,
        message: "bdg_budget_id is required"
      };
    }
    const budget = await prisma$1.budget.findUnique({
      where: {
        bdg_budget_id
      },
      include: {
        structure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const sb = budget.structure_budget;
    const formattedData = {
      bdg_budget_id: budget.bdg_budget_id,
      sbg_budget_id: budget.sbg_budget_id,
      qbu_quarter_id: budget.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
      fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
      at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
      oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
      ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
      sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
      bdg_balance_amt: ((_a = budget.bdg_balance_amt) == null ? void 0 : _a.toString()) || "0.00"
    };
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget",
      error: error.message
    };
  }
});

const getBudget_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: getBudget_get$4
});

const get_get$a = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const query = getQuery$1(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);
    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required"
      };
    }
    const detail = await prisma$1.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        budget: {
          include: {
            quarter_budget: true
          }
        }
      }
    });
    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found"
      };
    }
    const sb = detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
    const budget = detail.budget;
    const formattedData = {
      bmd_bgt_movement_detl_id: detail.bmd_bgt_movement_detl_id,
      new_fty_fund_type: (sb == null ? void 0 : sb.fty_fund_type) || "",
      new_oun_code2: (sb == null ? void 0 : sb.oun_code) || "",
      new_bdg_budget_id2: (budget == null ? void 0 : budget.bdg_budget_id) || null,
      qbu_quarter_id: (budget == null ? void 0 : budget.quarter_budget) ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
      fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
      at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
      oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
      ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
      sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
      bdg_balance_amt: ((_a = budget == null ? void 0 : budget.bdg_balance_amt) == null ? void 0 : _a.toString()) || "0.00",
      bmd_mvt_amt: ((_b = detail.bmd_mvt_amt) == null ? void 0 : _b.toString()) || "0.00",
      sbg_budget_id: detail.sbg_budget_id_to,
      bdg_budget_id: (budget == null ? void 0 : budget.bdg_budget_id) || null
    };
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching detail:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail",
      error: error.message
    };
  }
});

const get_get$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: get_get$a
});

const budgetCodes_get$6 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const { fty_fund_type, oun_code } = query;
    if (!fty_fund_type || !oun_code) {
      return {
        statusCode: 400,
        message: "fty_fund_type and oun_code are required"
      };
    }
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: {
        fty_fund_type,
        oun_code
      },
      include: {
        lkp_budget_code: {
          where: {
            lbc_status: 1
          }
        }
      }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: {
          in: sbgIds
        },
        bdg_status: "APPROVED"
      },
      include: {
        structure_budget: {
          include: {
            lkp_budget_code: true
          }
        },
        quarter_budget: true
      },
      orderBy: {
        bdg_budget_id: "desc"
      }
    });
    const budgetCodeMap = /* @__PURE__ */ new Map();
    budgets.forEach((budget) => {
      var _a;
      const sb = budget.structure_budget;
      const key = `${sb.sbg_budget_id}`;
      if (!budgetCodeMap.has(key) && sb.lkp_budget_code) {
        budgetCodeMap.set(key, {
          sbg_budget_id: sb.sbg_budget_id,
          lbc_budget_code: sb.lbc_budget_code,
          lbc_description: sb.lkp_budget_code.lbc_description,
          bdg_budget_id: budget.bdg_budget_id,
          qbu_quarter_id: budget.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
          bdg_balance_amt: ((_a = budget.bdg_balance_amt) == null ? void 0 : _a.toString()) || "0.00"
        });
      }
    });
    return {
      statusCode: 200,
      data: Array.from(budgetCodeMap.values())
    };
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget codes",
      error: error.message
    };
  }
});

const budgetCodes_get$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: budgetCodes_get$6
});

const master_get$6 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id
      }
    });
    if (!master) {
      return {
        statusCode: 404,
        message: "Budget movement master not found"
      };
    }
    return {
      statusCode: 200,
      data: master
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch master data",
      error: error.message
    };
  }
});

const master_get$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: master_get$6
});

const new_post$6 = defineEventHandler(async (event) => {
  try {
    const maxMaster = await prisma$1.budget_movement_master.findFirst({
      orderBy: {
        bmm_budget_movement_id: "desc"
      }
    });
    const movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
    const refNo = `DEC-${currentYear}-${String(movementId).padStart(6, "0")}`;
    const master = await prisma$1.budget_movement_master.create({
      data: {
        bmm_budget_movement_id: movementId,
        bmm_year: currentYear,
        bmm_budget_movement_no: refNo,
        bmm_trans_type: "DECREMENT",
        bmm_movement_type: "DECREMENT",
        bmm_total_amt: 0,
        bmm_status: "DRAFT",
        createdby: "system"
        // TODO: Get from auth
      }
    });
    return {
      statusCode: 200,
      message: "New decrement record created successfully",
      data: {
        bmm_budget_movement_id: master.bmm_budget_movement_id,
        bmm_budget_movement_no: master.bmm_budget_movement_no,
        bmm_year: master.bmm_year,
        bmm_status: master.bmm_status
      }
    };
  } catch (error) {
    console.error("Error creating new decrement:", error);
    return {
      statusCode: 500,
      message: "Failed to create new decrement record",
      error: error.message
    };
  }
});

const new_post$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: new_post$6
});

const processFlow_get$a = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id
      }
    });
    if (!master) {
      return {
        statusCode: 404,
        message: "Budget movement master not found"
      };
    }
    const processFlow = [];
    return {
      statusCode: 200,
      data: processFlow
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message
    };
  }
});

const processFlow_get$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: processFlow_get$a
});

const submit_post$6 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bmm_budget_movement_id,
      bmm_year,
      bmm_endorse_doc,
      bmm_description,
      bmm_total_amt,
      submitMode,
      workflow
    } = body;
    if (!bmm_year || !bmm_endorse_doc || !bmm_description || !bmm_total_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    let movementId = bmm_budget_movement_id;
    if (!movementId) {
      const maxMaster = await prisma$1.budget_movement_master.findFirst({
        orderBy: {
          bmm_budget_movement_id: "desc"
        }
      });
      movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
    }
    const refNo = `DEC-${bmm_year}-${String(movementId).padStart(6, "0")}`;
    const masterData = {
      bmm_year,
      bmm_budget_movement_no: refNo,
      bmm_trans_type: "DECREMENT",
      bmm_total_amt: parseFloat(bmm_total_amt.toString().replace(/,/g, "")),
      bmm_endorse_doc,
      bmm_description,
      bmm_reason: bmm_description,
      bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
      createdby: "system"
      // TODO: Get from auth
    };
    if (bmm_budget_movement_id) {
      await prisma$1.budget_movement_master.update({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id)
        },
        data: {
          ...masterData,
          updatedby: "system",
          updateddate: /* @__PURE__ */ new Date()
        }
      });
    } else {
      await prisma$1.budget_movement_master.create({
        data: {
          bmm_budget_movement_id: movementId,
          ...masterData
        }
      });
    }
    if (submitMode === "Submit" && bmm_budget_movement_id) {
      await prisma$1.budget_movement_detl.updateMany({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id)
        },
        data: {
          bmd_mvt_status: "ENTRY",
          updatedby: "system",
          updateddate: /* @__PURE__ */ new Date()
        }
      });
    }
    return {
      statusCode: 200,
      message: submitMode === "Submit" ? "Application submitted successfully" : "Application saved successfully",
      bmm_budget_movement_id: movementId,
      referenceNo: refNo
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    return {
      statusCode: 500,
      message: "Failed to submit application",
      error: error.message
    };
  }
});

const submit_post$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: submit_post$6
});

const index_get$2G = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {
      bmm_trans_type: "DECREMENT"
    };
    if (query.sm_bmm_year && query.sm_bmm_year.trim() !== "") {
      where.bmm_year = query.sm_bmm_year.trim();
    }
    if (query.sm_bmm_status && query.sm_bmm_status.trim() !== "") {
      where.bmm_status = query.sm_bmm_status.trim();
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ bmm_budget_movement_id: searchNum }],
        { bmm_year: { contains: searchTerm } },
        { bmm_budget_movement_no: { contains: searchTerm } },
        { bmm_endorse_doc: { contains: searchTerm } },
        { bmm_description: { contains: searchTerm } },
        { bmm_status: { contains: searchTerm } }
      ];
    }
    const records = await prisma$1.budget_movement_master.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        bmm_budget_movement_id: "desc"
      }
    });
    const formattedData = records.map((item, index) => {
      const date = item.updateddate || item.createddate;
      const dateStr = date ? new Date(date).toLocaleDateString("en-GB") : "";
      return {
        bmm_year: item.bmm_year || "",
        bmm_budget_movement_no: item.bmm_budget_movement_no || "",
        bmm_endorse_doc: item.bmm_endorse_doc || "",
        bmm_description: item.bmm_description || "",
        bmm_total_amt: item.bmm_total_amt ? parseFloat(item.bmm_total_amt.toString()) : 0,
        bmm_status: item.bmm_status || "",
        date: dateStr,
        bmm_budget_movement_id: item.bmm_budget_movement_id
        // Note: urlView and urlEdit are handled in frontend via sessionStorage, not URL parameters
      };
    });
    return {
      statusCode: 200,
      message: "Budget decrement records fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget decrement records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget decrement records",
      error: error.message
    };
  }
});

const index_get$2H = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2G
});

const detail_delete$4 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);
    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required"
      };
    }
    await prisma$1.budget_movement_detl.delete({
      where: {
        bmd_bgt_movement_detl_id
      }
    });
    return {
      statusCode: 200,
      message: "Detail deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting detail:", error);
    return {
      statusCode: 500,
      message: "Failed to delete detail",
      error: error.message
    };
  }
});

const detail_delete$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_delete$4
});

const detail_get$2 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const details = await prisma$1.budget_movement_detl.findMany({
      where: {
        bmm_budget_movement_id
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        budget_movement_master: {
          include: {
            quarter_budget: true
          }
        }
      }
    });
    const budgetData = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: {
          in: details.map((d) => d.sbg_budget_id_to).filter(Boolean)
        },
        bdg_status: "APPROVED"
      },
      include: {
        quarter_budget: true
      },
      orderBy: {
        bdg_budget_id: "desc"
      }
    });
    const budgetMap = /* @__PURE__ */ new Map();
    budgetData.forEach((b) => {
      if (b.sbg_budget_id && !budgetMap.has(b.sbg_budget_id)) {
        budgetMap.set(b.sbg_budget_id, b);
      }
    });
    const formattedData = details.map((item) => {
      var _a, _b, _c;
      const sb = item.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
      const qb = (_a = item.budget_movement_master) == null ? void 0 : _a.quarter_budget;
      const budget = item.sbg_budget_id_to ? budgetMap.get(item.sbg_budget_id_to) : null;
      return {
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: (budget == null ? void 0 : budget.bdg_budget_id) || null,
        sbg_budget_id: item.sbg_budget_id_to,
        qbu_quarter_id: (budget == null ? void 0 : budget.quarter_budget) ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : qb ? `${qb.qbu_year} - ${qb.qbu_description}` : "",
        fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        bdg_balance_amt: ((_b = budget == null ? void 0 : budget.bdg_balance_amt) == null ? void 0 : _b.toString()) || "0.00",
        bmd_mvt_amt: ((_c = item.bmd_mvt_amt) == null ? void 0 : _c.toString()) || "0.00"
      };
    });
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching detail list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail list",
      error: error.message
    };
  }
});

const detail_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_get$2
});

const detail_post$4 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { bmm_budget_movement_id, fty_fund_type, oun_code, sbg_budget_code, bdg_budget_id, bmd_mvt_amt } = body;
    if (!bmm_budget_movement_id || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    const budget = await prisma$1.budget.findFirst({
      where: {
        bdg_budget_id: parseInt(bdg_budget_id)
      },
      include: {
        structure_budget: true,
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const maxDetail = await prisma$1.budget_movement_detl.findFirst({
      orderBy: {
        bmd_bgt_movement_detl_id: "desc"
      }
    });
    const nextDetailId = ((maxDetail == null ? void 0 : maxDetail.bmd_bgt_movement_detl_id) || 0) + 1;
    const detail = await prisma$1.budget_movement_detl.create({
      data: {
        bmd_bgt_movement_detl_id: nextDetailId,
        bmm_budget_movement_id: parseInt(bmm_budget_movement_id),
        sbg_budget_id_to: parseInt(sbg_budget_code),
        qbu_quarter_id: budget.qbu_quarter_id,
        bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
        bmd_mvt_status: "DRAFT",
        createdby: "system"
        // TODO: Get from auth
      }
    });
    return {
      statusCode: 200,
      message: "Detail created successfully",
      data: detail
    };
  } catch (error) {
    console.error("Error creating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to create detail",
      error: error.message
    };
  }
});

const detail_post$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_post$4
});

const detail_put$4 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { bmd_bgt_movement_detl_id, fty_fund_type, oun_code, sbg_budget_code, bdg_budget_id, bmd_mvt_amt } = body;
    if (!bmd_bgt_movement_detl_id || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    const budget = await prisma$1.budget.findFirst({
      where: {
        bdg_budget_id: parseInt(bdg_budget_id)
      },
      include: {
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const detail = await prisma$1.budget_movement_detl.update({
      where: {
        bmd_bgt_movement_detl_id: parseInt(bmd_bgt_movement_detl_id)
      },
      data: {
        sbg_budget_id_to: parseInt(sbg_budget_code),
        qbu_quarter_id: budget.qbu_quarter_id,
        bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
        updatedby: "system",
        // TODO: Get from auth
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Detail updated successfully",
      data: detail
    };
  } catch (error) {
    console.error("Error updating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to update detail",
      error: error.message
    };
  }
});

const detail_put$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_put$4
});

const getBudget_get$2 = defineEventHandler(async (event) => {
  var _a;
  try {
    const query = getQuery$1(event);
    const bdg_budget_id = parseInt(query.bdg_budget_id);
    if (!bdg_budget_id) {
      return {
        statusCode: 400,
        message: "bdg_budget_id is required"
      };
    }
    const budget = await prisma$1.budget.findUnique({
      where: {
        bdg_budget_id
      },
      include: {
        structure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        quarter_budget: true
      }
    });
    if (!budget || !budget.structure_budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const sb = budget.structure_budget;
    return {
      statusCode: 200,
      data: {
        fty_fund_type: sb.fund_type ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        oun_code: sb.organization_unit ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        sbg_budget_code: sb.lkp_budget_code ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        qbu_quarter_id: budget.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
        at_activity_code: sb.activity_type ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        ccr_costcentre: sb.ccr_costcentre || "",
        bdg_balance_amt: ((_a = budget.bdg_balance_amt) == null ? void 0 : _a.toString()) || "0.00"
      }
    };
  } catch (error) {
    console.error("Error fetching budget details:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget details",
      error: error.message
    };
  }
});

const getBudget_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: getBudget_get$2
});

const get_get$8 = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const query = getQuery$1(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);
    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required"
      };
    }
    const detail = await prisma$1.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        }
      }
    });
    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found"
      };
    }
    const sb = detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
    return {
      statusCode: 200,
      data: {
        bmd_bgt_movement_detl_id: detail.bmd_bgt_movement_detl_id,
        new_fty_fund_type: (sb == null ? void 0 : sb.fty_fund_type) || "",
        new_oun_code2: (sb == null ? void 0 : sb.oun_code) || "",
        new_bdg_budget_id2: null,
        // Would need to join with budget table
        qbu_quarter_id: ((_a = detail.qbu_quarter_id) == null ? void 0 : _a.toString()) || "",
        fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) ? `${sb.ccr_costcentre} - ${sb.ccr_costcentre}` : "",
        sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        bdg_balance_amt: "0.00",
        // Would need to calculate from budget table
        bmd_mvt_amt: ((_b = detail.bmd_mvt_amt) == null ? void 0 : _b.toString()) || "0.00",
        sbg_budget_id: (sb == null ? void 0 : sb.sbg_budget_id) || null,
        bdg_budget_id: null
        // Would need to join with budget table
      }
    };
  } catch (error) {
    console.error("Error fetching detail:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail",
      error: error.message
    };
  }
});

const get_get$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: get_get$8
});

const budgetCodes_get$4 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const { fty_fund_type, oun_code } = query;
    if (!fty_fund_type || !oun_code) {
      return {
        statusCode: 400,
        message: "fty_fund_type and oun_code are required"
      };
    }
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: {
        fty_fund_type,
        oun_code,
        sbg_status: "ACTIVE"
      },
      include: {
        lkp_budget_code: true
      }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: {
          in: sbgIds
        },
        bdg_status: "APPROVED"
      },
      include: {
        quarter_budget: true
      },
      orderBy: {
        bdg_budget_id: "desc"
      }
    });
    const budgetMap = /* @__PURE__ */ new Map();
    budgets.forEach((b) => {
      if (b.sbg_budget_id && !budgetMap.has(b.sbg_budget_id)) {
        budgetMap.set(b.sbg_budget_id, b);
      }
    });
    const formattedData = structureBudgets.filter((sb) => budgetMap.has(sb.sbg_budget_id)).map((sb) => {
      var _a, _b, _c;
      const budget = budgetMap.get(sb.sbg_budget_id);
      return {
        sbg_budget_id: sb.sbg_budget_id,
        lbc_budget_code: ((_a = sb.lkp_budget_code) == null ? void 0 : _a.lbc_budget_code) || "",
        lbc_description: ((_b = sb.lkp_budget_code) == null ? void 0 : _b.lbc_description) || "",
        bdg_budget_id: budget.bdg_budget_id,
        qbu_quarter_id: budget.qbu_quarter_id,
        bdg_balance_amt: ((_c = budget.bdg_balance_amt) == null ? void 0 : _c.toString()) || "0.00"
      };
    });
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget codes",
      error: error.message
    };
  }
});

const budgetCodes_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: budgetCodes_get$4
});

const quarters_get$4 = defineEventHandler(async (event) => {
  try {
    const quarters = await prisma$1.quarter_budget.findMany({
      orderBy: [
        { qbu_year: "desc" },
        { qbu_quarter_id: "asc" }
      ]
    });
    return {
      statusCode: 200,
      data: quarters
    };
  } catch (error) {
    console.error("Error fetching quarters:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch quarters",
      error: error.message
    };
  }
});

const quarters_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: quarters_get$4
});

const master_get$4 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id
      }
    });
    if (!master) {
      return {
        statusCode: 404,
        message: "Budget movement master not found"
      };
    }
    return {
      statusCode: 200,
      data: master
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch master data",
      error: error.message
    };
  }
});

const master_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: master_get$4
});

const new_post$4 = defineEventHandler(async (event) => {
  try {
    const maxMaster = await prisma$1.budget_movement_master.findFirst({
      orderBy: {
        bmm_budget_movement_id: "desc"
      }
    });
    const movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
    const refNo = `INC-${currentYear}-${String(movementId).padStart(6, "0")}`;
    const master = await prisma$1.budget_movement_master.create({
      data: {
        bmm_budget_movement_id: movementId,
        bmm_year: currentYear,
        bmm_budget_movement_no: refNo,
        bmm_trans_type: "INCREMENT",
        bmm_movement_type: "INCREMENT",
        bmm_total_amt: 0,
        bmm_status: "DRAFT",
        createdby: "system"
        // TODO: Get from auth
      }
    });
    return {
      statusCode: 200,
      message: "New increment record created successfully",
      data: {
        bmm_budget_movement_id: master.bmm_budget_movement_id,
        bmm_budget_movement_no: master.bmm_budget_movement_no,
        bmm_year: master.bmm_year,
        bmm_status: master.bmm_status
      }
    };
  } catch (error) {
    console.error("Error creating new increment:", error);
    return {
      statusCode: 500,
      message: "Failed to create new increment record",
      error: error.message
    };
  }
});

const new_post$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: new_post$4
});

const processFlow_get$8 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id
      },
      select: {
        bmm_budget_movement_no: true
      }
    });
    if (!master || !master.bmm_budget_movement_no) {
      return {
        statusCode: 200,
        data: []
      };
    }
    return {
      statusCode: 200,
      data: []
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message
    };
  }
});

const processFlow_get$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: processFlow_get$8
});

const submit_post$4 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bmm_budget_movement_id,
      bmm_year,
      bmm_endorse_doc,
      bmm_description,
      bmm_total_amt,
      submitMode,
      workflow
    } = body;
    if (!bmm_year || !bmm_endorse_doc || !bmm_description || !bmm_total_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    let movementId = bmm_budget_movement_id;
    if (!movementId) {
      const maxMaster = await prisma$1.budget_movement_master.findFirst({
        orderBy: {
          bmm_budget_movement_id: "desc"
        }
      });
      movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
    }
    const refNo = `INC-${bmm_year}-${String(movementId).padStart(6, "0")}`;
    const masterData = {
      bmm_year,
      bmm_budget_movement_no: refNo,
      bmm_trans_type: "INCREMENT",
      bmm_total_amt: parseFloat(bmm_total_amt.toString().replace(/,/g, "")),
      bmm_endorse_doc,
      bmm_description,
      bmm_reason: bmm_description,
      bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
      createdby: "system"
      // TODO: Get from auth
    };
    if (bmm_budget_movement_id) {
      await prisma$1.budget_movement_master.update({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id)
        },
        data: {
          ...masterData,
          updatedby: "system",
          updateddate: /* @__PURE__ */ new Date()
        }
      });
    } else {
      await prisma$1.budget_movement_master.create({
        data: {
          bmm_budget_movement_id: movementId,
          ...masterData
        }
      });
    }
    if (submitMode === "Submit" && bmm_budget_movement_id) {
      await prisma$1.budget_movement_detl.updateMany({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id)
        },
        data: {
          bmd_mvt_status: "ENTRY",
          updatedby: "system",
          updateddate: /* @__PURE__ */ new Date()
        }
      });
    }
    return {
      statusCode: 200,
      message: submitMode === "Submit" ? "Application submitted successfully" : "Application saved successfully",
      bmm_budget_movement_id: movementId,
      referenceNo: refNo
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    return {
      statusCode: 500,
      message: "Failed to submit application",
      error: error.message
    };
  }
});

const submit_post$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: submit_post$4
});

const index_get$2E = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {
      bmm_trans_type: "INCREMENT"
    };
    if (query.sm_bmm_year && query.sm_bmm_year.trim() !== "") {
      where.bmm_year = query.sm_bmm_year.trim();
    }
    if (query.sm_bmm_status && query.sm_bmm_status.trim() !== "") {
      where.bmm_status = query.sm_bmm_status.trim();
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ bmm_budget_movement_id: searchNum }],
        { bmm_year: { contains: searchTerm } },
        { bmm_budget_movement_no: { contains: searchTerm } },
        { bmm_endorse_doc: { contains: searchTerm } },
        { bmm_description: { contains: searchTerm } },
        { bmm_status: { contains: searchTerm } }
      ];
    }
    const records = await prisma$1.budget_movement_master.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        bmm_budget_movement_id: "desc"
      }
    });
    const formattedData = records.map((item, index) => {
      const date = item.updateddate || item.createddate;
      const dateStr = date ? new Date(date).toLocaleDateString("en-GB") : "";
      return {
        bmm_year: item.bmm_year || "",
        bmm_budget_movement_no: item.bmm_budget_movement_no || "",
        bmm_endorse_doc: item.bmm_endorse_doc || "",
        bmm_description: item.bmm_description || "",
        bmm_total_amt: item.bmm_total_amt ? parseFloat(item.bmm_total_amt.toString()) : 0,
        bmm_status: item.bmm_status || "",
        date: dateStr,
        bmm_budget_movement_id: item.bmm_budget_movement_id
        // Note: urlView and urlEdit are handled in frontend via sessionStorage, not URL parameters
      };
    });
    return {
      statusCode: 200,
      message: "Budget increment records fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget increment records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget increment records",
      error: error.message
    };
  }
});

const index_get$2F = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2E
});

const index_get$2C = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.reference && query.reference !== "null" && query.reference.trim() !== "") {
      where.bam_allocation_no = { contains: query.reference.trim() };
    }
    if (query.year && query.year !== "null" && query.year.trim() !== "") {
      where.bam_year = query.year.trim();
    }
    if (query.quarter && query.quarter !== "null" && query.quarter.trim() !== "") {
      where.bam_quarter_id = { contains: query.quarter.trim() };
    }
    if (query.sm_year && query.sm_year.trim() !== "") {
      where.bam_year = query.sm_year.trim();
    }
    if (query.sm_quarter && query.sm_quarter.trim() !== "") {
      where.bam_quarter_id = { contains: query.sm_quarter.trim() };
    }
    if (query.sm_status && query.sm_status.trim() !== "") {
      where.bam_status_cd = query.sm_status.trim();
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ bam_id: searchNum }],
        { bam_year: { contains: searchTerm } },
        { bam_allocation_no: { contains: searchTerm } },
        { bam_endorse_doc: { contains: searchTerm } },
        { bam_status_cd: { contains: searchTerm } }
      ];
    }
    const records = await prisma$1.budget_allocation_master.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        createddate: "desc"
      }
    });
    const quarterIds = [...new Set(records.map((r) => r.bam_quarter_id).filter(Boolean))];
    const quarters = quarterIds.length > 0 ? await prisma$1.quarter_budget.findMany({
      where: {
        OR: [
          { qbu_quarter_id: { in: quarterIds.map((id) => parseInt(id) || 0).filter((id) => id > 0) } },
          { qbu_description: { in: quarterIds } }
        ]
      },
      select: {
        qbu_quarter_id: true,
        qbu_description: true
      }
    }) : [];
    const quarterMap = /* @__PURE__ */ new Map();
    quarters.forEach((q) => {
      quarterMap.set(q.qbu_quarter_id.toString(), q.qbu_description);
      quarterMap.set(q.qbu_description, q.qbu_description);
    });
    const formattedData = records.map((item, index) => {
      const date = item.createddate ? new Date(item.createddate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        ID: item.bam_id,
        YEARS: item.bam_year || "",
        DESCR: quarterMap.get(item.bam_quarter_id || "") || item.bam_quarter_id || "",
        ALLOCATE_NO: item.bam_allocation_no || "",
        ENDORSE: item.bam_endorse_doc || "",
        AMT: item.bam_total ? parseFloat(item.bam_total.toString()) : 0,
        STAT: item.bam_status_cd || "",
        date,
        PTJ: "",
        // PTJ is in detail table, not master
        // For action buttons
        urlEdit: `/budget/new-initial-v2?id=${item.bam_id}&mode=edit`,
        urlView: `/budget/new-initial-v2?id=${item.bam_id}&mode=view`
      };
    });
    return {
      statusCode: 200,
      message: "Budget initial records fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget initial records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget initial records",
      error: error.message
    };
  }
});

const index_get$2D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2C
});

const quarters_get$2 = defineEventHandler(async (event) => {
  try {
    const quarters = await prisma$1.quarter_budget.findMany({
      where: {
        qbu_year: {
          not: null
        }
      },
      orderBy: {
        qbu_quarter_id: "asc"
      }
    });
    return {
      statusCode: 200,
      message: "Quarters fetched successfully",
      data: quarters
    };
  } catch (error) {
    console.error("Error fetching quarters:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching quarters",
      error: error.message
    };
  }
});

const quarters_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: quarters_get$2
});

const statuses_get$2 = defineEventHandler(async (event) => {
  try {
    const statuses = await prisma$1.budget_allocation_master.findMany({
      where: {
        bam_status_cd: {
          not: null
        }
      },
      select: {
        bam_status_cd: true
      },
      distinct: ["bam_status_cd"],
      orderBy: {
        bam_status_cd: "asc"
      }
    });
    return {
      statusCode: 200,
      message: "Statuses fetched successfully",
      data: statuses
    };
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching statuses",
      error: error.message
    };
  }
});

const statuses_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: statuses_get$2
});

const years_get$4 = defineEventHandler(async (event) => {
  try {
    const years = await prisma$1.quarter_budget.findMany({
      where: {
        qbu_year: {
          not: null
        }
      },
      select: {
        qbu_year: true
      },
      distinct: ["qbu_year"],
      orderBy: {
        qbu_year: "desc"
      }
    });
    return {
      statusCode: 200,
      message: "Years fetched successfully",
      data: years
    };
  } catch (error) {
    console.error("Error fetching years:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching years",
      error: error.message
    };
  }
});

const years_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: years_get$4
});

const index_get$2A = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    const budgetWhere = {};
    if (query.year && query.year !== "null" && query.year.trim() !== "") {
      budgetWhere.bdg_year = query.year.trim();
    }
    if (query.sm_bdg_status && query.sm_bdg_status.trim() !== "") {
      budgetWhere.bdg_status = query.sm_bdg_status.trim();
    } else {
      budgetWhere.bdg_status = "APPROVED";
    }
    const structureBudgetWhere = {};
    if (query.fundType && query.fundType !== "null" && query.fundType.trim() !== "") {
      structureBudgetWhere.fty_fund_type = query.fundType.trim();
    }
    if (query.oun_code && query.oun_code !== "null" && query.oun_code.trim() !== "") {
      structureBudgetWhere.oun_code = query.oun_code.trim();
    }
    if (query.ccr_costcentre_top && query.ccr_costcentre_top !== "null" && query.ccr_costcentre_top.trim() !== "") {
      structureBudgetWhere.ccr_costcentre = query.ccr_costcentre_top.trim();
    }
    if (query.at_activity_code_top && query.at_activity_code_top !== "null" && query.at_activity_code_top.trim() !== "") {
      structureBudgetWhere.at_activity_code = query.at_activity_code_top.trim();
    }
    if (query.sm_acm_acct_code && query.sm_acm_acct_code.trim() !== "") {
      structureBudgetWhere.lbc_budget_code = query.sm_acm_acct_code.trim();
    }
    if (query.sm_kod_so && query.sm_kod_so.trim() !== "") {
      structureBudgetWhere.kod_so = query.sm_kod_so.trim();
    }
    if (query.sm_budgetcode && query.sm_budgetcode.trim() !== "") {
      structureBudgetWhere.lbc_budget_code = { contains: query.sm_budgetcode.trim() };
    }
    const records = await prisma$1.budget.findMany({
      where: Object.keys(budgetWhere).length > 0 ? budgetWhere : {},
      include: {
        structure_budget: {
          where: Object.keys(structureBudgetWhere).length > 0 ? structureBudgetWhere : void 0,
          include: {
            fund_type: {
              select: {
                fty_fund_desc: true
              }
            },
            activity_type: {
              select: {
                at_activity_description_bm: true
              }
            },
            organization_unit: {
              select: {
                oun_desc: true
              }
            },
            lkp_budget_code: {
              select: {
                lbc_description: true
              }
            }
          }
        }
      },
      orderBy: {
        bdg_budget_id: "asc"
      }
    });
    let filteredRecords = records;
    if (Object.keys(structureBudgetWhere).length > 0) {
      filteredRecords = records.filter((r) => r.structure_budget !== null);
    }
    const formattedData = filteredRecords.map((item, index) => {
      var _a, _b, _c, _d;
      const sb = item.structure_budget || {};
      const budgetId = sb.fty_fund_type && sb.at_activity_code && sb.oun_code && sb.ccr_costcentre && sb.lbc_budget_code ? `${sb.fty_fund_type}-${sb.at_activity_code}-${sb.oun_code}-${sb.ccr_costcentre}-${sb.lbc_budget_code}` : "";
      return {
        budgetid: budgetId,
        bdg_budget_id: item.bdg_budget_id,
        // Primary key for edit/view operations
        bdg_status: item.bdg_status || "",
        bdg_year: item.bdg_year || "",
        bdg_lock_amt: item.bdg_lock_amt ? parseFloat(item.bdg_lock_amt.toString()) : 0,
        bdg_bal_carryforward: item.bdg_bal_carryforward ? parseFloat(item.bdg_bal_carryforward.toString()) : 0,
        bdg_topup_amt: item.bdg_topup_amt ? parseFloat(item.bdg_topup_amt.toString()) : 0,
        bdg_initial_amt: item.bdg_initial_amt ? parseFloat(item.bdg_initial_amt.toString()) : 0,
        bdg_additional_amt: item.bdg_additional_amt ? parseFloat(item.bdg_additional_amt.toString()) : 0,
        bdg_virement_amt: item.bdg_virement_amt ? parseFloat(item.bdg_virement_amt.toString()) : 0,
        bdg_allocated_amt: item.bdg_allocated_amt ? parseFloat(item.bdg_allocated_amt.toString()) : 0,
        bdg_pre_request_amt: item.bdg_pre_request_amt ? parseFloat(item.bdg_pre_request_amt.toString()) : 0,
        bdg_request_amt: item.bdg_request_amt ? parseFloat(item.bdg_request_amt.toString()) : 0,
        bdg_commit_amt: item.bdg_commit_amt ? parseFloat(item.bdg_commit_amt.toString()) : 0,
        bdg_expenses_amt: item.bdg_expenses_amt ? parseFloat(item.bdg_expenses_amt.toString()) : 0,
        bdg_balance_amt: item.bdg_balance_amt ? parseFloat(item.bdg_balance_amt.toString()) : 0,
        fty_fund_type: sb.fty_fund_type || "",
        fty_fund_desc: ((_a = sb.fund_type) == null ? void 0 : _a.fty_fund_desc) || "",
        at_activity_code: sb.at_activity_code || "",
        at_activity_description_bm: ((_b = sb.activity_type) == null ? void 0 : _b.at_activity_description_bm) || "",
        oun_code: sb.oun_code || "",
        oun_desc: ((_c = sb.organization_unit) == null ? void 0 : _c.oun_desc) || "",
        ccr_costcentre: sb.ccr_costcentre || "",
        ccr_costcentre_desc: "",
        // Would need to join with costcentre table if needed
        lbc_budget_code: sb.lbc_budget_code || "",
        acm_acct_desc: ((_d = sb.lkp_budget_code) == null ? void 0 : _d.lbc_description) || "",
        bdg_closing: item.bdg_closing || "",
        bdg_closing_by: item.bdg_closing_by || "",
        urlViewBudget: `/budget/monitoring/view/${item.bdg_budget_id}`
      };
    });
    let finalData = formattedData;
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim().toLowerCase();
      finalData = formattedData.filter((item) => {
        const searchableText = [
          item.budgetid,
          item.bdg_year,
          item.bdg_status,
          item.fty_fund_type,
          item.fty_fund_desc,
          item.at_activity_code,
          item.at_activity_description_bm,
          item.oun_code,
          item.oun_desc,
          item.ccr_costcentre,
          item.lbc_budget_code,
          item.acm_acct_desc
        ].filter(Boolean).join(" ").toLowerCase();
        return searchableText.includes(searchTerm);
      });
    }
    if (query.sm_budgetid && query.sm_budgetid.trim() !== "") {
      const budgetIdFilter = query.sm_budgetid.trim().toLowerCase();
      finalData = finalData.filter(
        (item) => item.budgetid.toLowerCase().includes(budgetIdFilter)
      );
    }
    return {
      statusCode: 200,
      message: "Budget monitoring records fetched successfully",
      data: finalData
    };
  } catch (error) {
    console.error("Error fetching budget monitoring records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget monitoring records",
      error: error.message
    };
  }
});

const index_get$2B = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2A
});

const detail_delete$2 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bad_detl_id = parseInt(query.bad_detl_id);
    if (!bad_detl_id) {
      return {
        statusCode: 400,
        message: "bad_detl_id is required"
      };
    }
    const detail = await prisma$1.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id
      }
    });
    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found"
      };
    }
    const masterId = detail.bmm_budget_movement_id;
    await prisma$1.budget_movement_detl.delete({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id
      }
    });
    const master = await prisma$1.budget_movement_master.findUnique({
      where: { bmm_budget_movement_id: masterId },
      include: {
        budget_movement_detl: true
      }
    });
    if (master) {
      const totalAmt = master.budget_movement_detl.reduce(
        (sum, d) => sum + (parseFloat(d.bmd_mvt_amt) || 0),
        0
      );
      await prisma$1.budget_movement_master.update({
        where: { bmm_budget_movement_id: masterId },
        data: { bmm_total_amt: totalAmt }
      });
    }
    return {
      statusCode: 200,
      message: "Detail deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting detail:", error);
    return {
      statusCode: 500,
      message: "Failed to delete detail",
      error: error.message
    };
  }
});

const detail_delete$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_delete$2
});

const detail_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bam_id = parseInt(query.bam_id);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const search = query.search || "";
    if (!bam_id) {
      return {
        statusCode: 400,
        message: "bam_id is required"
      };
    }
    const where = {
      bmm_budget_movement_id: bam_id,
      budget_movement_master: {
        bmm_trans_type: "INITIAL"
      }
    };
    const total = await prisma$1.budget_movement_detl.count({
      where
    });
    const details = await prisma$1.budget_movement_detl.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            costcentre: true,
            lkp_budget_code: true
          }
        }
      },
      orderBy: {
        bmd_bgt_movement_detl_id: "asc"
      }
    });
    const formattedData = details.map((detail) => {
      const sb = detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
      return {
        ID: detail.bmd_bgt_movement_detl_id,
        BUDGET_ID: detail.sbg_budget_id_to,
        FUND: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        ACTIVITY: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        PTJ: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        CCR: (sb == null ? void 0 : sb.costcentre) ? `${sb.ccr_costcentre} - ${sb.costcentre.ccr_costcentre_desc}` : "",
        BUDGET_CODE: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        AMT: detail.bmd_mvt_amt ? parseFloat(detail.bmd_mvt_amt).toFixed(2) : "0.00",
        initial_amt: parseFloat(detail.bmd_mvt_amt) || 0,
        STAT: detail.bmd_mvt_status || "DRAFT"
      };
    });
    return {
      statusCode: 200,
      data: formattedData,
      meta: {
        total,
        page,
        pageSize
      }
    };
  } catch (error) {
    console.error("Error fetching detail list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail list",
      error: error.message
    };
  }
});

const detail_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_get
});

const detail_post$2 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bam_id,
      fty_fund_type,
      at_activity_code,
      oun_code,
      ccr_costcentre,
      budget_code,
      sbg_budget_id,
      initial_amt
    } = body;
    if (!bam_id || !fty_fund_type || !at_activity_code || !oun_code || !ccr_costcentre || !budget_code || !initial_amt) {
      return {
        statusCode: 400,
        message: "All required fields must be provided"
      };
    }
    let structureBudgetId = sbg_budget_id;
    if (!structureBudgetId) {
      const structureBudget = await prisma$1.structure_budget.findFirst({
        where: {
          fty_fund_type,
          at_activity_code,
          oun_code,
          ccr_costcentre,
          lbc_budget_code: budget_code
        }
      });
      if (!structureBudget) {
        return {
          statusCode: 404,
          message: "Structure budget not found"
        };
      }
      structureBudgetId = structureBudget.sbg_budget_id;
    }
    const maxDetail = await prisma$1.budget_movement_detl.findFirst({
      orderBy: {
        bmd_bgt_movement_detl_id: "desc"
      }
    });
    const detailId = ((maxDetail == null ? void 0 : maxDetail.bmd_bgt_movement_detl_id) || 0) + 1;
    const newDetail = await prisma$1.budget_movement_detl.create({
      data: {
        bmd_bgt_movement_detl_id: detailId,
        bmm_budget_movement_id: bam_id,
        sbg_budget_id_to: structureBudgetId,
        bmd_mvt_amt: parseFloat(initial_amt),
        bmd_mvt_status: "DRAFT",
        createdby: "system"
        // TODO: Get from auth
      }
    });
    const master = await prisma$1.budget_movement_master.findUnique({
      where: { bmm_budget_movement_id: bam_id },
      include: {
        budget_movement_detl: true
      }
    });
    if (master) {
      const totalAmt = master.budget_movement_detl.reduce(
        (sum, d) => sum + (parseFloat(d.bmd_mvt_amt) || 0),
        0
      );
      await prisma$1.budget_movement_master.update({
        where: { bmm_budget_movement_id: bam_id },
        data: { bmm_total_amt: totalAmt }
      });
    }
    return {
      statusCode: 200,
      message: "Detail created successfully",
      data: {
        bmd_bgt_movement_detl_id: newDetail.bmd_bgt_movement_detl_id
      }
    };
  } catch (error) {
    console.error("Error creating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to create detail",
      error: error.message
    };
  }
});

const detail_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_post$2
});

const detail_put$2 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bad_detl_id,
      fty_fund_type,
      at_activity_code,
      oun_code,
      ccr_costcentre,
      budget_code,
      sbg_budget_id,
      initial_amt
    } = body;
    if (!bad_detl_id || !fty_fund_type || !at_activity_code || !oun_code || !ccr_costcentre || !budget_code || !initial_amt) {
      return {
        statusCode: 400,
        message: "All required fields must be provided"
      };
    }
    let structureBudgetId = sbg_budget_id;
    if (!structureBudgetId) {
      const structureBudget = await prisma$1.structure_budget.findFirst({
        where: {
          fty_fund_type,
          at_activity_code,
          oun_code,
          ccr_costcentre,
          lbc_budget_code: budget_code
        }
      });
      if (!structureBudget) {
        return {
          statusCode: 404,
          message: "Structure budget not found"
        };
      }
      structureBudgetId = structureBudget.sbg_budget_id;
    }
    const updatedDetail = await prisma$1.budget_movement_detl.update({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id
      },
      data: {
        sbg_budget_id_to: structureBudgetId,
        bmd_mvt_amt: parseFloat(initial_amt),
        updatedby: "system"
        // TODO: Get from auth
      }
    });
    const master = await prisma$1.budget_movement_master.findUnique({
      where: { bmm_budget_movement_id: updatedDetail.bmm_budget_movement_id },
      include: {
        budget_movement_detl: true
      }
    });
    if (master) {
      const totalAmt = master.budget_movement_detl.reduce(
        (sum, d) => sum + (parseFloat(d.bmd_mvt_amt) || 0),
        0
      );
      await prisma$1.budget_movement_master.update({
        where: { bmm_budget_movement_id: updatedDetail.bmm_budget_movement_id },
        data: { bmm_total_amt: totalAmt }
      });
    }
    return {
      statusCode: 200,
      message: "Detail updated successfully",
      data: {
        bmd_bgt_movement_detl_id: updatedDetail.bmd_bgt_movement_detl_id
      }
    };
  } catch (error) {
    console.error("Error updating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to update detail",
      error: error.message
    };
  }
});

const detail_put$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_put$2
});

const get_get$6 = defineEventHandler(async (event) => {
  var _a;
  try {
    const query = getQuery$1(event);
    const bad_detl_id = parseInt(query.bad_detl_id);
    if (!bad_detl_id) {
      return {
        statusCode: 400,
        message: "bad_detl_id is required"
      };
    }
    const detail = await prisma$1.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id: bad_detl_id
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            costcentre: true,
            lkp_budget_code: true
          }
        },
        budget_movement_master: true
      }
    });
    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found"
      };
    }
    const sb = detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
    return {
      statusCode: 200,
      data: {
        BUDGET_ID: detail.sbg_budget_id_to,
        FUND: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        ACTIVITY: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        PTJ: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        CCR: (sb == null ? void 0 : sb.costcentre) ? `${sb.ccr_costcentre} - ${sb.costcentre.ccr_costcentre_desc}` : "",
        KODSO: (sb == null ? void 0 : sb.kod_so) || "",
        BUDGETCODE: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        AMT: detail.bmd_mvt_amt ? parseFloat(detail.bmd_mvt_amt).toFixed(2) : "0.00",
        initial_amt: parseFloat(detail.bmd_mvt_amt) || 0,
        STAT: ((_a = detail.budget_movement_master) == null ? void 0 : _a.bmm_status) || "DRAFT"
      }
    };
  } catch (error) {
    console.error("Error fetching detail:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail",
      error: error.message
    };
  }
});

const get_get$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: get_get$6
});

const activities_get = defineEventHandler(async (event) => {
  try {
    const activities = await prisma$1.activity_type.findMany({
      where: {
        at_status: 1
      },
      orderBy: {
        at_activity_code: "asc"
      }
    });
    return {
      statusCode: 200,
      data: activities
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch activities",
      error: error.message
    };
  }
});

const activities_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: activities_get
});

const budgetCodes_get$2 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const { fty_fund_type, oun_code, at_activity_code, ccr_costcentre } = query;
    if (!fty_fund_type || !oun_code) {
      return {
        statusCode: 400,
        message: "Fund type and PTJ are required"
      };
    }
    const where = {
      fty_fund_type,
      oun_code,
      sbg_status: "ACTIVE"
    };
    if (at_activity_code) {
      where.at_activity_code = at_activity_code;
    }
    if (ccr_costcentre) {
      where.ccr_costcentre = ccr_costcentre;
    }
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where,
      include: {
        lkp_budget_code: {
          where: {
            lbc_status: 1
          }
        }
      }
    });
    const formattedData = structureBudgets.filter((sb) => sb.lkp_budget_code).map((sb) => {
      var _a;
      return {
        sbg_budget_id: sb.sbg_budget_id,
        lbc_budget_code: sb.lbc_budget_code,
        lbc_description: ((_a = sb.lkp_budget_code) == null ? void 0 : _a.lbc_description) || ""
      };
    });
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget codes",
      error: error.message
    };
  }
});

const budgetCodes_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: budgetCodes_get$2
});

const costCentres_get = defineEventHandler(async (event) => {
  try {
    const costCentres = await prisma$1.costcentre.findMany({
      orderBy: {
        ccr_costcentre: "asc"
      }
    });
    return {
      statusCode: 200,
      data: costCentres
    };
  } catch (error) {
    console.error("Error fetching cost centres:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch cost centres",
      error: error.message
    };
  }
});

const costCentres_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: costCentres_get
});

const fundTypes_get = defineEventHandler(async (event) => {
  try {
    const fundTypes = await prisma$1.fund_type.findMany({
      where: {
        fty_status: 1
      },
      orderBy: {
        fty_fund_type: "asc"
      }
    });
    return {
      statusCode: 200,
      data: fundTypes
    };
  } catch (error) {
    console.error("Error fetching fund types:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch fund types",
      error: error.message
    };
  }
});

const fundTypes_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: fundTypes_get
});

const ptjs_get = defineEventHandler(async (event) => {
  try {
    const ptjs = await prisma$1.organization_unit.findMany({
      where: {
        oun_status: 1
      },
      orderBy: {
        oun_code: "asc"
      }
    });
    return {
      statusCode: 200,
      data: ptjs
    };
  } catch (error) {
    console.error("Error fetching PTJs:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PTJs",
      error: error.message
    };
  }
});

const ptjs_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: ptjs_get
});

const quarters_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const year = query.year;
    const where = {
      qbu_status: 1
    };
    if (year) {
      where.qbu_year = year;
    }
    const quarters = await prisma$1.quarter_budget.findMany({
      where,
      select: {
        qbu_quarter_id: true,
        qbu_year: true,
        qbu_description: true
      },
      orderBy: {
        qbu_quarter_id: "asc"
      }
    });
    const formattedQuarters = quarters.map((item) => ({
      id: item.qbu_quarter_id,
      text: `${item.qbu_year} - ${item.qbu_description}`
    }));
    return {
      statusCode: 200,
      data: formattedQuarters
    };
  } catch (error) {
    console.error("Error fetching quarters:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch quarters",
      error: error.message
    };
  }
});

const quarters_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: quarters_get
});

const years_get$2 = defineEventHandler(async (event) => {
  try {
    const years = await prisma$1.quarter_budget.findMany({
      select: {
        qbu_year: true
      },
      distinct: ["qbu_year"],
      orderBy: {
        qbu_year: "asc"
      }
    });
    const formattedYears = years.map((item) => ({
      FLC_ID: item.qbu_year,
      FLC_NAME: item.qbu_year
    }));
    return {
      statusCode: 200,
      data: formattedYears
    };
  } catch (error) {
    console.error("Error fetching years:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch years",
      error: error.message
    };
  }
});

const years_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: years_get$2
});

const master_get$2 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bam_id = parseInt(query.bam_id);
    if (!bam_id) {
      return {
        statusCode: 400,
        message: "bam_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id: bam_id
      },
      include: {
        quarter_budget: true
      }
    });
    if (!master || master.bmm_trans_type !== "INITIAL") {
      return {
        statusCode: 404,
        message: "Budget initial master not found"
      };
    }
    return {
      statusCode: 200,
      data: {
        REFERENCE: master.bmm_budget_movement_no || "",
        QUARTER: master.quarter_budget ? `${master.quarter_budget.qbu_year} - ${master.quarter_budget.qbu_description}` : "",
        ENDORSE_DOC: master.bmm_endorse_doc || "",
        FILENAMING: master.bmm_fileid || "",
        STAT: master.bmm_status || "DRAFT",
        YEAR: master.bmm_year || ""
      }
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch master data",
      error: error.message
    };
  }
});

const master_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: master_get$2
});

const new_post$2 = defineEventHandler(async (event) => {
  try {
    const maxMaster = await prisma$1.budget_movement_master.findFirst({
      orderBy: {
        bmm_budget_movement_id: "desc"
      }
    });
    const movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
    const newRecord = await prisma$1.budget_movement_master.create({
      data: {
        bmm_budget_movement_id: movementId,
        bmm_year: (/* @__PURE__ */ new Date()).getFullYear().toString(),
        bmm_trans_type: "INITIAL",
        bmm_status: "DRAFT",
        bmm_total_amt: 0,
        createdby: "system"
        // TODO: Get from auth
      }
    });
    return {
      statusCode: 200,
      message: "New initial record created successfully",
      data: {
        bam_id: newRecord.bmm_budget_movement_id
      }
    };
  } catch (error) {
    console.error("Error creating new initial record:", error);
    return {
      statusCode: 500,
      message: "Failed to create new initial record",
      error: error.message
    };
  }
});

const new_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: new_post$2
});

const processFlow_get$6 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bam_id = parseInt(query.bam_id);
    if (!bam_id) {
      return {
        statusCode: 400,
        message: "bam_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id: bam_id
      }
    });
    if (!master || !master.bmm_budget_movement_no) {
      return {
        statusCode: 200,
        data: []
      };
    }
    return {
      statusCode: 200,
      data: []
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message
    };
  }
});

const processFlow_get$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: processFlow_get$6
});

const submit_post$2 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bam_id,
      bam_year,
      bam_quarter_id,
      bam_endorse_doc,
      bam_file_name,
      submitMode,
      workflow
    } = body;
    if (!bam_year || !bam_quarter_id || !bam_endorse_doc) {
      return {
        statusCode: 400,
        message: "All required fields must be provided"
      };
    }
    let movementId = bam_id;
    if (!movementId) {
      const maxMaster = await prisma$1.budget_movement_master.findFirst({
        orderBy: {
          bmm_budget_movement_id: "desc"
        }
      });
      movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
      await prisma$1.budget_movement_master.create({
        data: {
          bmm_budget_movement_id: movementId,
          bmm_year: bam_year,
          qbu_quarter_id: parseInt(bam_quarter_id),
          bmm_trans_type: "INITIAL",
          bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
          bmm_endorse_doc: bam_endorse_doc,
          bmm_fileid: bam_file_name,
          bmm_total_amt: 0,
          createdby: "system"
          // TODO: Get from auth
        }
      });
    } else {
      await prisma$1.budget_movement_master.update({
        where: {
          bmm_budget_movement_id: movementId
        },
        data: {
          bmm_year: bam_year,
          qbu_quarter_id: parseInt(bam_quarter_id),
          bmm_endorse_doc: bam_endorse_doc,
          bmm_fileid: bam_file_name,
          bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
          updatedby: "system"
          // TODO: Get from auth
        }
      });
    }
    return {
      statusCode: 200,
      message: submitMode === "Submit" ? "Application submitted successfully" : "Application saved successfully",
      bam_id: movementId
    };
  } catch (error) {
    console.error("Error saving/submitting application:", error);
    return {
      statusCode: 500,
      message: "Failed to save/submit application",
      error: error.message
    };
  }
});

const submit_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: submit_post$2
});

const index_get$2y = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {
      bpm_type: "ALLOCATION 2"
    };
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search } },
        { bpm_year: { contains: query.search } },
        { bpm_remark: { contains: query.search } }
      ];
    }
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const [plannings, total] = await Promise.all([
      prisma$1.budget_planning_master.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          bpm_id: "desc"
        }
      }),
      prisma$1.budget_planning_master.count({ where })
    ]);
    const formattedData = plannings.map((item, index) => {
      var _a;
      return {
        bpm_id: item.bpm_id.toString(),
        bpm_planning_no: item.bpm_planning_no || "",
        bpm_year: item.bpm_year,
        bpm_oun_code: item.bpm_oun_code || "",
        bpm_ccr_costcentre: item.bpm_ccr_costcentre || "",
        ccr_costcentre_desc: "",
        bpm_remark: item.bpm_remark || "",
        bpm_total_amt: ((_a = item.bpm_total_amt) == null ? void 0 : _a.toString()) || "0",
        bpm_status: item.bpm_status,
        bdg_year: item.bdg_year || "",
        duplicate_count: item.duplicate_count || 0,
        no: skip + index + 1
      };
    });
    return {
      statusCode: 200,
      message: "Budget planning allocation 2 list fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching budget planning allocation 2:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$2z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2y
});

const index_get$2w = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {
      bpm_type: "ALLOCATION 3"
    };
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search } },
        { bpm_year: { contains: query.search } },
        { bpm_remark: { contains: query.search } }
      ];
    }
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const [plannings, total] = await Promise.all([
      prisma$1.budget_planning_master.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          bpm_id: "desc"
        }
      }),
      prisma$1.budget_planning_master.count({ where })
    ]);
    const formattedData = plannings.map((item, index) => {
      var _a;
      return {
        bpm_id: item.bpm_id.toString(),
        bpm_planning_no: item.bpm_planning_no || "",
        bpm_year: item.bpm_year,
        bpm_oun_code: item.bpm_oun_code || "",
        bpm_ccr_costcentre: item.bpm_ccr_costcentre || "",
        ccr_costcentre_desc: "",
        bpm_remark: item.bpm_remark || "",
        bpm_total_amt: ((_a = item.bpm_total_amt) == null ? void 0 : _a.toString()) || "0",
        bpm_status: item.bpm_status,
        bdg_year: item.bdg_year || "",
        duplicate_count: item.duplicate_count || 0,
        no: skip + index + 1
      };
    });
    return {
      statusCode: 200,
      message: "Budget planning allocation 3 list fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching budget planning allocation 3:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$2x = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2w
});

const _id__delete$q = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    await prisma$1.budget_planning_details.deleteMany({
      where: {
        bpm_id: BigInt(id)
      }
    });
    await prisma$1.budget_planning_master.delete({
      where: {
        bpm_id: BigInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Budget planning deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting budget planning:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Budget planning not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__delete$r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$q
});

const _id__get$i = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const planning = await prisma$1.budget_planning_master.findUnique({
      where: {
        bpm_id: BigInt(id)
      }
    });
    if (!planning) {
      return {
        statusCode: 404,
        message: "Budget planning not found"
      };
    }
    return {
      statusCode: 200,
      message: "Budget planning fetched successfully",
      data: {
        bpm_id: planning.bpm_id.toString(),
        bpm_planning_no: planning.bpm_planning_no,
        bpm_year: planning.bpm_year,
        bpm_oun_code: planning.bpm_oun_code,
        bpm_ccr_costcentre: planning.bpm_ccr_costcentre,
        bpm_remark: planning.bpm_remark,
        bpm_total_amt: (_a = planning.bpm_total_amt) == null ? void 0 : _a.toString(),
        bpm_status: planning.bpm_status
      }
    };
  } catch (error) {
    console.error("Error fetching budget planning:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__get$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$i
});

const index_get$2u = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.bpm_planning_no) {
      where.bpm_planning_no = { contains: query.bpm_planning_no };
    }
    if (query.bpm_year) {
      where.bpm_year = query.bpm_year;
    }
    if (query.bpm_oun_code) {
      where.bpm_oun_code = query.bpm_oun_code;
    }
    if (query.bpm_ccr_costcentre) {
      where.bpm_ccr_costcentre = query.bpm_ccr_costcentre;
    }
    if (query.bpm_status) {
      where.bpm_status = query.bpm_status;
    }
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search } },
        { bpm_year: { contains: query.search } },
        { bpm_oun_code: { contains: query.search } },
        { bpm_remark: { contains: query.search } }
      ];
    }
    where.bpm_type = { in: ["YEARLY", "02"] };
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const [plannings, total] = await Promise.all([
      prisma$1.budget_planning_master.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          bpm_id: "desc"
        }
      }),
      prisma$1.budget_planning_master.count({ where })
    ]);
    const formattedData = plannings.map((item, index) => {
      var _a;
      return {
        bpm_id: item.bpm_id.toString(),
        bpm_planning_no: item.bpm_planning_no || "",
        bpm_year: item.bpm_year,
        bpm_oun_code: item.bpm_oun_code || "",
        bpm_ccr_costcentre: item.bpm_ccr_costcentre || "",
        ccr_costcentre_desc: "",
        bpm_remark: item.bpm_remark || "",
        bpm_total_amt: ((_a = item.bpm_total_amt) == null ? void 0 : _a.toString()) || "0",
        bpm_status: item.bpm_status,
        bdg_year: item.bdg_year || "",
        duplicate_count: item.duplicate_count || 0,
        no: skip + index + 1
      };
    });
    return {
      statusCode: 200,
      message: "Budget plannings fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching budget plannings:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$2v = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2u
});

const index_post$I = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const planning = await prisma$1.budget_planning_master.create({
      data: {
        bpm_year: body.year || (/* @__PURE__ */ new Date()).getFullYear().toString(),
        bpm_oun_code: body.ptj_code || "",
        fty_fund_type: body.fund || "",
        at_activity_code: body.activity || "",
        bpm_type: "YEARLY",
        bpm_status: "DRAFT",
        bpm_total_amt: 0
      }
    });
    return {
      statusCode: 201,
      message: "New application created successfully",
      data: {
        bpm_id: planning.bpm_id.toString(),
        bpm_year: planning.bpm_year,
        bpm_oun_code: planning.bpm_oun_code,
        bpm_status: planning.bpm_status
      }
    };
  } catch (error) {
    console.error("Error creating new application:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_post$J = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$I
});

const index_get$2s = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {
      bpm_type: {
        in: ["01", "03"]
      }
    };
    if (query.tf_oun_code && query.tf_oun_code !== "null") {
      where.bpm_oun_code = query.tf_oun_code;
    }
    if (query.tf_year && query.tf_year !== "null") {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_status && query.tf_status !== "null") {
      where.bpm_status = query.tf_status;
    }
    if (query.sm_bpm_type && query.sm_bpm_type !== "null") {
      where.bpm_type = query.sm_bpm_type;
    }
    if (query.search) {
      where.OR = [
        { bpm_type: { contains: query.search, mode: "insensitive" } },
        { bpm_remark: { contains: query.search, mode: "insensitive" } },
        { bpm_oun_code: { contains: query.search, mode: "insensitive" } }
      ];
    }
    const total = await prisma$1.budget_planning_master.count({ where });
    const data = await prisma$1.budget_planning_master.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        budget_planning_details: true
      },
      orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || "asc" } : { bpm_id: "asc" }
    });
    const transformedData = data.map((item, index) => {
      var _a;
      return {
        index: skip + index + 1,
        bpm_id: item.bpm_id,
        bpm_type: item.bpm_type,
        lde_description: "",
        // Will be populated from lookup_details if needed
        oun_code_parent: item.bpm_oun_code,
        bpm_remark: item.bpm_remark,
        bpm_total_amtsemasa: ((_a = item.budget_planning_details) == null ? void 0 : _a.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0)) || 0,
        Perjawatansemasa: 0,
        // Placeholder
        A: 0,
        // Placeholder for Year-1 Amount
        B: 0,
        // Placeholder for Year-1 Perjawatan
        C: 0,
        // Placeholder for Year-2 Amount
        D: 0
        // Placeholder for Year-2 Perjawatan
      };
    });
    return {
      statusCode: 200,
      data: transformedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching ABM 4 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM 4 records",
      error: error.message
    };
  }
});

const index_get$2t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2s
});

const index_get$2q = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {
      bpm_status: {
        notIn: ["CANCEL", "REJECT"]
      },
      bpm_type: {
        not: "02"
      }
    };
    if (query.tf_planningno && query.tf_planningno !== "null") {
      where.bpm_planning_no = query.tf_planningno;
    }
    if (query.tf_year && query.tf_year !== "null") {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_status && query.tf_status !== "null") {
      where.bpm_status = query.tf_status;
    }
    if (query.sm_bpm_planning_no && query.sm_bpm_planning_no !== "null") {
      where.bpm_planning_no = query.sm_bpm_planning_no;
    }
    if (query.sm_bpm_type && query.sm_bpm_type !== "null") {
      where.bpm_type = query.sm_bpm_type;
    }
    if (query.sm_bpm_status && query.sm_bpm_status !== "null") {
      where.bpm_status = query.sm_bpm_status;
    }
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search, mode: "insensitive" } },
        { bpm_type: { contains: query.search, mode: "insensitive" } }
      ];
    }
    const total = await prisma$1.budget_planning_master.count({ where });
    const data = await prisma$1.budget_planning_master.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        budget_planning_details: {
          select: {
            bpd_amt: true
          }
        }
      },
      orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || "asc" } : { bpm_id: "asc" }
    });
    const transformedData = data.map((item, index) => {
      var _a;
      return {
        index: skip + index + 1,
        bpm_planning_no: item.bpm_planning_no,
        bpm_id: item.bpm_id,
        bpm_type: item.bpm_type,
        bpd_amt: ((_a = item.budget_planning_details) == null ? void 0 : _a.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0)) || 0,
        url_view: `/budget/planning/view/${item.bpm_id}`
      };
    });
    return {
      statusCode: 200,
      data: transformedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching ABM 5 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM 5 records",
      error: error.message
    };
  }
});

const index_get$2r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2q
});

const index_get$2o = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {
      bpm_status: {
        notIn: ["CANCEL", "REJECT"]
      }
    };
    if (query.tf_year && query.tf_year !== "null") {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_ptj && query.tf_ptj !== "null") {
      where.bpm_oun_code = query.tf_ptj;
    }
    if (query.tf_dasar && query.tf_dasar !== "null") {
      where.bpm_type = query.tf_dasar;
    }
    if (query.tf_status && query.tf_status !== "null") {
      where.bpm_status = query.tf_status;
    }
    if (query.sm_oun_region && query.sm_oun_region !== "null") {
    }
    if (query.sm_bpm_type && query.sm_bpm_type !== "null") {
      where.bpm_type = query.sm_bpm_type;
    }
    if (query.sm_bpm_status && query.sm_bpm_status !== "null") {
      where.bpm_status = query.sm_bpm_status;
    }
    const total = await prisma$1.budget_planning_master.count({ where });
    const data = await prisma$1.budget_planning_master.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        budget_planning_details: {
          select: {
            bpd_amt: true,
            oun_code: true
          }
        }
      },
      orderBy: query.sortBy ? { [query.sortBy]: query.sortOrder || "asc" } : { bpm_id: "asc" }
    });
    const transformedData = data.map((item, index) => {
      var _a;
      return {
        index: skip + index + 1,
        oun_code: item.bpm_oun_code,
        oun: item.bpm_oun_code,
        // Placeholder - would need to join with organization_unit
        bpm_type: item.bpm_type,
        bpm_total_amt: ((_a = item.budget_planning_details) == null ? void 0 : _a.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0)) || 0
      };
    });
    return {
      statusCode: 200,
      data: transformedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching ABM 7 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM 7 records",
      error: error.message
    };
  }
});

const index_get$2p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2o
});

const index_get$2m = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {
      bpm_type: {
        in: ["01", "03"]
      }
    };
    if (query.tf_planningno && query.tf_planningno !== "null") {
      where.bpm_planning_no = query.tf_planningno;
    }
    if (query.tf_year && query.tf_year !== "null") {
      where.bpm_year = query.tf_year;
    }
    if (query.tf_fty_fund_type && query.tf_fty_fund_type !== "null") {
      where.fty_fund_type = query.tf_fty_fund_type;
    }
    if (query.ft_bpm_oun_code && query.ft_bpm_oun_code !== "null") {
      where.bpm_oun_code = query.ft_bpm_oun_code;
    }
    if (query.ft_bpm_ccr_costcentre && query.ft_bpm_ccr_costcentre !== "null") {
      where.bpm_ccr_costcentre = query.ft_bpm_ccr_costcentre;
    }
    if (query.ft_at_activity_code && query.ft_at_activity_code !== "null") {
      where.at_activity_code = query.ft_at_activity_code;
    }
    if (query.ft_lbc_budget_code && query.ft_lbc_budget_code !== "null") {
      where.structure_budget = {
        lbc_budget_code: query.ft_lbc_budget_code
      };
    }
    if (query.sm_bpm_planning_no && query.sm_bpm_planning_no !== "null") {
      where.bpm_planning_no = query.sm_bpm_planning_no;
    }
    if (query.sm_bpm_type && query.sm_bpm_type !== "null") {
      where.bpm_type = query.sm_bpm_type;
    }
    if (query.sm_bpm_status && query.sm_bpm_status !== "null") {
      where.bpm_status = query.sm_bpm_status;
    }
    if (query.sm_bpm_oun_code && query.sm_bpm_oun_code !== "null") {
      where.bpm_oun_code = query.sm_bpm_oun_code;
    }
    if (query.sm_bpm_ccr_costcentre && query.sm_bpm_ccr_costcentre !== "null") {
      where.bpm_ccr_costcentre = query.sm_bpm_ccr_costcentre;
    }
    if (query.sm_at_activity_code && query.sm_at_activity_code !== "null") {
      where.at_activity_code = query.sm_at_activity_code;
    }
    if (query.sm_budget_code && query.sm_budget_code !== "null") {
      where.structure_budget = {
        ...where.structure_budget,
        lbc_budget_code: query.sm_budget_code
      };
    }
    if (query.search) {
      where.OR = [
        { bpm_planning_no: { contains: query.search, mode: "insensitive" } },
        { bpm_status: { contains: query.search, mode: "insensitive" } },
        { bpm_oun_code: { contains: query.search, mode: "insensitive" } },
        { fty_fund_type: { contains: query.search, mode: "insensitive" } },
        { at_activity_code: { contains: query.search, mode: "insensitive" } },
        { bpm_ccr_costcentre: { contains: query.search, mode: "insensitive" } },
        { acm_acct_code: { contains: query.search, mode: "insensitive" } }
      ];
    }
    const allMasters = await prisma$1.budget_planning_master.findMany({
      where,
      include: {
        budget_planning_details: true,
        structure_budget: {
          include: {
            lkp_budget_code: true
          }
        }
      },
      orderBy: {
        bpm_id: "desc"
      }
    });
    const uniqueMap = /* @__PURE__ */ new Map();
    allMasters.forEach((master) => {
      if (!uniqueMap.has(master.bpm_id)) {
        uniqueMap.set(master.bpm_id, master);
      }
    });
    const uniqueMasters = Array.from(uniqueMap.values());
    const masters = uniqueMasters.slice(skip, skip + pageSize);
    const total = uniqueMasters.length;
    const typeLookups = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "VOTTYPE",
        lde_status: 1
      }
    });
    const lookupMap = {};
    typeLookups.forEach((lookup) => {
      lookupMap[lookup.lde_value] = lookup.lde_description;
    });
    const formattedData = masters.map((item, index) => {
      var _a, _b;
      const sumAmt = item.budget_planning_details.reduce((sum, detail) => {
        return sum + (parseFloat(detail.bpd_amt) || 0);
      }, 0);
      const typeDesc = lookupMap[item.bpm_type] ? `${item.bpm_type} - ${lookupMap[item.bpm_type]}` : item.bpm_type || "";
      return {
        No: skip + index + 1,
        "Application No": item.bpm_planning_no || "",
        Type: typeDesc,
        PTJ: item.bpm_oun_code || "",
        "Cost Center": item.bpm_ccr_costcentre || "",
        Activity: item.at_activity_code || "",
        "Budget Code": ((_b = (_a = item.structure_budget) == null ? void 0 : _a.lkp_budget_code) == null ? void 0 : _b.lbc_budget_code) || "",
        Status: item.bpm_status || "",
        "Amount (RM)": sumAmt,
        Action: "",
        // Keep original data for actions
        bpm_id: item.bpm_id,
        url_view: `/budget/planning/report/abm-justfikasi/view/${item.bpm_id}`
      };
    });
    return {
      statusCode: 200,
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        lastPage: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching ABM Justfikasi records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch ABM Justfikasi records",
      error: error.message
    };
  }
});

const index_get$2n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2m
});

const index_get$2k = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {
      bpm_status: {
        notIn: ["REJECT", "CANCEL"]
      }
    };
    if (query.tf_region && query.tf_region !== "null") {
    }
    if (query.tf_ptj && query.tf_ptj !== "null") {
      where.bpm_oun_code = query.tf_ptj;
    }
    if (query.tf_status && query.tf_status !== "null") {
      where.bpm_status = query.tf_status;
    }
    if (query.sm_oun_region && query.sm_oun_region !== "null") {
    }
    if (query.sm_bpm_oun_code && query.sm_bpm_oun_code !== "null") {
      where.bpm_oun_code = query.sm_bpm_oun_code;
    }
    const total = await prisma$1.budget_planning_master.count({ where });
    const data = await prisma$1.budget_planning_master.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        budget_planning_details: {
          select: {
            bpd_amt: true,
            oun_code: true
          }
        }
      },
      orderBy: { bpm_id: "asc" }
    });
    const transformedData = data.map((item, index) => {
      var _a;
      return {
        index: skip + index + 1,
        oun_parent: item.bpm_oun_code,
        oun_region: "",
        // Placeholder
        ccr_costcentre: "",
        // Placeholder
        oun: item.bpm_oun_code,
        oun_code: item.bpm_oun_code,
        oun_code_parent: item.bpm_oun_code,
        total_amt: ((_a = item.budget_planning_details) == null ? void 0 : _a.reduce((sum, detail) => sum + (parseFloat(detail.bpd_amt) || 0), 0)) || 0
      };
    });
    return {
      statusCode: 200,
      data: transformedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching Lampiran ABM 7 records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Lampiran ABM 7 records",
      error: error.message
    };
  }
});

const index_get$2l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2k
});

const fundType_get = defineEventHandler(async (event) => {
  try {
    const fundTypes = await prisma$1.fund_type.findMany({
      orderBy: {
        fty_fund_type: "asc"
      }
    });
    const formattedData = fundTypes.map((item) => ({
      label: `${item.fty_fund_type} - ${item.fty_fund_desc || ""}`,
      value: item.fty_fund_type
    }));
    return {
      statusCode: 200,
      message: "Fund Type options fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching Fund Type options:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching Fund Type options",
      error: error.message
    };
  }
});

const fundType_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: fundType_get
});

const ptj_get = defineEventHandler(async (event) => {
  try {
    const organizationUnits = await prisma$1.organization_unit.findMany({
      where: {
        oun_level: 3
      },
      orderBy: {
        oun_code: "asc"
      }
    });
    const formattedData = organizationUnits.map((item) => ({
      label: `${item.oun_code} - ${item.oun_desc || ""}`,
      value: item.oun_code
    }));
    return {
      statusCode: 200,
      message: "PTJ options fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching PTJ options:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching PTJ options",
      error: error.message
    };
  }
});

const ptj_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: ptj_get
});

const status_get = defineEventHandler(async (event) => {
  try {
    const statuses = await prisma$1.budget_planning_master.findMany({
      where: {
        AND: [
          {
            bpm_status: {
              not: null
            }
          },
          {
            bpm_status: {
              not: "REJECT"
            }
          }
        ]
      },
      select: {
        bpm_status: true
      },
      distinct: ["bpm_status"],
      orderBy: {
        bpm_status: "desc"
      }
    });
    return {
      statusCode: 200,
      data: statuses
    };
  } catch (error) {
    console.error("Error fetching status options:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch status options",
      error: error.message
    };
  }
});

const status_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: status_get
});

const votType_get = defineEventHandler(async (event) => {
  try {
    const lookupDetails = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "VOTTYPE",
        lde_status: 1
      },
      orderBy: {
        lde_value: "asc"
      }
    });
    const formattedData = lookupDetails.map((item) => ({
      label: `${item.lde_value} - ${item.lde_description || ""}`,
      value: item.lde_value
    }));
    return {
      statusCode: 200,
      message: "VOT Type options fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching VOT Type options:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching VOT Type options",
      error: error.message
    };
  }
});

const votType_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: votType_get
});

const index_get$2i = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (query.year && query.year !== "null") {
    }
    if (query.Fund && query.Fund !== "null") {
    }
    if (query.date_from && query.date_from !== "null") {
    }
    if (query.date_to && query.date_to !== "null") {
    }
    if (query.tf_activity_group && query.tf_activity_group !== "null") {
    }
    if (query.tf_activity_subgroup && query.tf_activity_subgroup !== "null") {
    }
    const total = await prisma$1.structure_budget.count({ where });
    const data = await prisma$1.structure_budget.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        lkp_budget_code: true,
        activity_type: true
      },
      orderBy: { sbg_budget_id: "asc" }
    });
    const transformedData = data.map((item, index) => {
      var _a, _b;
      return {
        index: skip + index + 1,
        at_activity_code: item.at_activity_code || "",
        at_activity_description_bm: ((_a = item.activity_type) == null ? void 0 : _a.at_activity_description_bm) || "",
        lbc_budget_code: item.lbc_budget_code || "",
        lbc_description: ((_b = item.lkp_budget_code) == null ? void 0 : _b.lbc_description) || "",
        peruntukan: 0,
        lck: 0,
        request: 0,
        commitment: 0,
        Belanja: 0,
        Jumlah_Perbelanjaan: 0,
        Baki_Peruntukan: 0
      };
    });
    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    };
  } catch (error) {
    console.error("Error fetching Allocation, Expenditure & Balance of Allocation by Budget Code:", error);
    return { statusCode: 500, message: "Failed to fetch report", error: error.message };
  }
});

const index_get$2j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2i
});

const index_get$2g = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (query.year && query.year !== "null") {
    }
    if (query.fundType && query.fundType !== "null") {
    }
    if (query.ptj && query.ptj !== "null") {
    }
    const total = await prisma$1.lkp_budget_code.count({ where });
    const data = await prisma$1.lkp_budget_code.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { lbc_id: "asc" }
    });
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      acct_code: item.lbc_budget_code || "",
      PTJ: "",
      // Placeholder
      opening: 0,
      initial: 0,
      virement: 0,
      additional: 0,
      allocated: 0,
      locked: 0,
      request: 0,
      pre_request: 0,
      commit: 0,
      expenses: 0,
      balance: 0
    }));
    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    };
  } catch (error) {
    console.error("Error fetching Budget Summary By Account Code:", error);
    return { statusCode: 500, message: "Failed to fetch Budget Summary By Account Code", error: error.message };
  }
});

const index_get$2h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2g
});

const index_get$2e = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (query.year && query.year !== "null") {
    }
    if (query.fundType && query.fundType !== "null") {
    }
    if (query.ptj && query.ptj !== "null") {
    }
    const total = await prisma$1.structure_budget.count({ where });
    const data = await prisma$1.structure_budget.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { sbg_budget_id: "asc" }
    });
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      fty_fund_type: item.fty_fund_type || "",
      oun_code: item.oun_code || "",
      ccr_costcentre: item.ccr_costcentre || "",
      at_activity_code: item.at_activity_code || "",
      at_activity_description_bm: "",
      // Placeholder
      lbc_budget_code: item.lbc_budget_code || "",
      lbc_description: "",
      // Placeholder
      opening: 0,
      initial: 0,
      virement: 0,
      additional: 0,
      topup: 0,
      allocated: 0,
      pre_request: 0,
      request: 0,
      commit: 0,
      locked: 0,
      expenses: 0,
      balance: 0,
      expenses_percentage: 0
    }));
    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    };
  } catch (error) {
    console.error("Error fetching Variation Report:", error);
    return { statusCode: 500, message: "Failed to fetch Variation Report", error: error.message };
  }
});

const index_get$2f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2e
});

const index_get$2c = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.tf_year) {
      where.sby_year = query.tf_year;
    }
    if (query.tf_fund) {
      where.fty_fund_type = query.tf_fund;
    }
    if (query.tf_account) {
    }
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 5;
    const skip = (page - 1) * pageSize;
    const [structures, total] = await Promise.all([
      prisma$1.structure_budget.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          sbg_budget_id: "desc"
        }
      }),
      prisma$1.structure_budget.count({ where })
    ]);
    const formattedData = structures.map((item, index) => ({
      fund: item.fty_fund_type,
      activity: item.at_activity_code || "",
      costcentre: item.ccr_costcentre || "",
      account_siries: "",
      account: item.lbc_budget_code,
      glacct_code: "",
      opening: "0",
      initial: "0",
      additional: "0",
      virement: "0",
      topup: "0",
      allocated: "0",
      locked: "0",
      pre_request: "0",
      request: "0",
      commit: "0",
      expenses: "0",
      balance: "0",
      expenses_percentage: "0",
      no: skip + index + 1
    }));
    return {
      statusCode: 200,
      message: "Laporan Belanjawan data fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching laporan belanjawan:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$2d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2c
});

const years_get = defineEventHandler(async (event) => {
  try {
    const years = await prisma$1.budget.findMany({
      select: {
        bdg_year: true
      },
      distinct: ["bdg_year"],
      orderBy: {
        bdg_year: "desc"
      }
    });
    return {
      statusCode: 200,
      data: years
    };
  } catch (error) {
    console.error("Error fetching years:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch years",
      error: error.message
    };
  }
});

const years_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: years_get
});

const index_get$2a = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.bdg_year) {
      where.sby_year = query.bdg_year;
    }
    if (query.Fund) {
      where.fty_fund_type = query.Fund;
    }
    if (query.Activity) {
      where.at_activity_code = query.Activity;
    }
    if (query.oun_code) {
      where.oun_code = query.oun_code;
    }
    if (query.Cost_Center) {
      where.ccr_costcentre = query.Cost_Center;
    }
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const [structures, total] = await Promise.all([
      prisma$1.structure_budget.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          sbg_budget_id: "desc"
        }
      }),
      prisma$1.structure_budget.count({ where })
    ]);
    const formattedData = structures.map((item, index) => ({
      lbc_budget_code: item.lbc_budget_code,
      lbc_description: "",
      fty_fund_type: item.fty_fund_type,
      oun_code: item.oun_code || "",
      ccr_costcentre: item.ccr_costcentre || "",
      at_activity_code: item.at_activity_code || "",
      opening: "0",
      allocated: "0",
      commits: "0",
      expenses: "0",
      total_expenses: "0",
      balance: "0",
      no: skip + index + 1
    }));
    return {
      statusCode: 200,
      message: "Report data fetched successfully",
      data: formattedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching report data:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$2b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2a
});

const index_get$28 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (query.Reference && query.Reference !== "null") {
      where.bmm_budget_movement_no = query.Reference;
    }
    if (query.Year && query.Year !== "null") {
      where.bmm_year = query.Year;
    }
    if (query.PTJ && query.PTJ !== "null") {
    }
    const total = await prisma$1.budget_movement_master.count({ where });
    const data = await prisma$1.budget_movement_master.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { bmm_budget_movement_id: "asc" }
    });
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      bmm_budget_movement_id: item.bmm_budget_movement_id,
      bmm_year: item.bmm_year,
      bmm_budget_movement_no: item.bmm_budget_movement_no,
      oun_code: "",
      bmm_endorse_doc: item.bmm_endorse_doc || "",
      bmm_reason: item.bmm_reason || "",
      bmm_total_amt: parseFloat(item.bmm_total_amt) || 0,
      bmm_status: item.bmm_status || ""
    }));
    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    };
  } catch (error) {
    console.error("Error fetching Warrant Decrement records:", error);
    return { statusCode: 500, message: "Failed to fetch Warrant Decrement records", error: error.message };
  }
});

const index_get$29 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$28
});

const index_get$26 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (query.Reference && query.Reference !== "null") {
      where.bmm_budget_movement_no = query.Reference;
    }
    if (query.Year && query.Year !== "null") {
      where.bmm_year = query.Year;
    }
    if (query.PTJ && query.PTJ !== "null") {
    }
    const total = await prisma$1.budget_movement_master.count({ where });
    const data = await prisma$1.budget_movement_master.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { bmm_budget_movement_id: "asc" }
    });
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      bmm_budget_movement_id: item.bmm_budget_movement_id,
      bmm_year: item.bmm_year,
      bmm_budget_movement_no: item.bmm_budget_movement_no,
      oun_code: "",
      // Placeholder
      bmm_endorse_doc: item.bmm_endorse_doc || "",
      bmm_reason: item.bmm_reason || "",
      bmm_total_amt: parseFloat(item.bmm_total_amt) || 0,
      bmm_status: item.bmm_status || ""
    }));
    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    };
  } catch (error) {
    console.error("Error fetching Warrant Increment records:", error);
    return { statusCode: 500, message: "Failed to fetch Warrant Increment records", error: error.message };
  }
});

const index_get$27 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$26
});

const index_get$24 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (query.Reference && query.Reference !== "null") {
    }
    if (query.Year && query.Year !== "null") {
    }
    if (query.Quarter && query.Quarter !== "null") {
    }
    if (query.PTJ && query.PTJ !== "null") {
    }
    const total = await prisma$1.budget_allocation_master.count({ where });
    const data = await prisma$1.budget_allocation_master.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { bam_id: "asc" }
    });
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      ID: item.bam_id,
      PTJ: "",
      // Placeholder
      YEARS: "",
      // Placeholder
      DESCR: "",
      // Placeholder
      ALLOCATE_NO: item.bam_allocation_no || "",
      ENDORSE: "",
      // Placeholder
      AMT: parseFloat(item.bam_total_amt) || 0,
      STAT: ""
      // Placeholder
    }));
    return {
      statusCode: 200,
      data: transformedData,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error) {
    console.error("Error fetching Warrant Initial records:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Warrant Initial records",
      error: error.message
    };
  }
});

const index_get$25 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$24
});

const index_get$22 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    const where = {};
    if (query.Reference && query.Reference !== "null") {
      where.bmm_budget_movement_no = query.Reference;
    }
    if (query.Year && query.Year !== "null") {
      where.bmm_year = query.Year;
    }
    if (query.PTJ && query.PTJ !== "null") {
    }
    const total = await prisma$1.budget_movement_master.count({ where });
    const data = await prisma$1.budget_movement_master.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { bmm_budget_movement_id: "asc" }
    });
    const transformedData = data.map((item, index) => ({
      index: skip + index + 1,
      bmm_budget_movement_id: item.bmm_budget_movement_id,
      bmm_year: item.bmm_year,
      bmm_budget_movement_no: item.bmm_budget_movement_no,
      oun_code: "",
      bmm_endorse_doc: item.bmm_endorse_doc || "",
      bmm_reason: item.bmm_reason || "",
      bmm_total_amt: parseFloat(item.bmm_total_amt) || 0,
      bmm_status: item.bmm_status || ""
    }));
    return {
      statusCode: 200,
      data: transformedData,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
    };
  } catch (error) {
    console.error("Error fetching Warrant Virement records:", error);
    return { statusCode: 500, message: "Failed to fetch Warrant Virement records", error: error.message };
  }
});

const index_get$23 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$22
});

const _id__delete$o = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    await prisma$1.quarter_budget.delete({
      where: {
        qbu_quarter_id: BigInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Allocation deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting allocation:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Allocation not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__delete$p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$o
});

const _id__get$g = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const allocation = await prisma$1.quarter_budget.findUnique({
      where: {
        qbu_quarter_id: BigInt(id)
      }
    });
    if (!allocation) {
      return {
        statusCode: 404,
        message: "Allocation not found"
      };
    }
    const startDate = allocation.qbu_start_date ? new Date(allocation.qbu_start_date).toLocaleDateString("en-GB") : "";
    const endDate = allocation.qbu_end_date ? new Date(allocation.qbu_end_date).toLocaleDateString("en-GB") : "";
    return {
      statusCode: 200,
      message: "Allocation fetched successfully",
      data: {
        ID: allocation.qbu_quarter_id.toString(),
        YEARS: allocation.qbu_year,
        DESCS: allocation.qbu_description,
        SDATE: startDate,
        EDATE: endDate,
        STAT: allocation.qbu_status || "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error fetching allocation:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__get$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$g
});

const _id__put$s = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const updateData = {};
    if (body.YEARS)
      updateData.qbu_year = body.YEARS;
    if (body.DESCS)
      updateData.qbu_description = body.DESCS.toUpperCase();
    if (body.SDATE) {
      updateData.qbu_start_date = new Date(body.SDATE.split("/").reverse().join("-"));
    }
    if (body.EDATE) {
      updateData.qbu_end_date = new Date(body.EDATE.split("/").reverse().join("-"));
    }
    if (body.STAT) {
      updateData.qbu_status = body.STAT;
      updateData.qbu_extended_field = {
        statusDesc: body.STAT
      };
    }
    updateData.updateddate = /* @__PURE__ */ new Date();
    const allocation = await prisma$1.quarter_budget.update({
      where: {
        qbu_quarter_id: BigInt(id)
      },
      data: updateData
    });
    return {
      statusCode: 200,
      message: "Allocation updated successfully",
      data: {
        ID: allocation.qbu_quarter_id.toString(),
        YEARS: allocation.qbu_year,
        DESCS: allocation.qbu_description,
        SDATE: new Date(allocation.qbu_start_date).toLocaleDateString("en-GB"),
        EDATE: new Date(allocation.qbu_end_date).toLocaleDateString("en-GB"),
        STAT: allocation.qbu_status || "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error updating allocation:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Allocation not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__put$t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$s
});

const index_get$20 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ qbu_quarter_id: searchNum }],
        { qbu_year: { contains: searchTerm } },
        { qbu_description: { contains: searchTerm } }
      ];
    }
    if (query.qbu_year && query.qbu_year.trim() !== "") {
      where.qbu_year = query.qbu_year.trim();
    }
    if (query.qbu_description && query.qbu_description.trim() !== "") {
      where.qbu_description = {
        contains: query.qbu_description.trim()
      };
    }
    if (query.qbu_start_date && query.qbu_start_date.trim() !== "") {
      where.qbu_start_date = {
        gte: new Date(query.qbu_start_date)
      };
    }
    if (query.qbu_end_date && query.qbu_end_date.trim() !== "") {
      where.qbu_end_date = {
        lte: new Date(query.qbu_end_date)
      };
    }
    const allocations = await prisma$1.quarter_budget.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        qbu_year: "desc"
      }
    });
    const formattedData = allocations.map((item, index) => {
      let statusDesc = "INACTIVE";
      if (item.qbu_extended_field && typeof item.qbu_extended_field === "object" && "statusDesc" in item.qbu_extended_field) {
        statusDesc = item.qbu_extended_field.statusDesc;
      } else if (item.qbu_status) {
        statusDesc = item.qbu_status;
      }
      if (statusDesc === "1" || statusDesc === 1) {
        statusDesc = "ACTIVE";
      } else if (statusDesc === "0" || statusDesc === 0) {
        statusDesc = "INACTIVE";
      }
      const startDate = item.qbu_start_date ? new Date(item.qbu_start_date).toLocaleDateString("en-GB") : "";
      const endDate = item.qbu_end_date ? new Date(item.qbu_end_date).toLocaleDateString("en-GB") : "";
      const descFormatted = item.qbu_description || "";
      return {
        ID: item.qbu_quarter_id.toString(),
        YEARS: item.qbu_year,
        DESCS: item.qbu_description || "",
        DESCSFORMATTED: descFormatted,
        SDATE: startDate,
        EDATE: endDate,
        STAT: statusDesc,
        no: index + 1
      };
    });
    let finalData = formattedData;
    if (query.statusDesc && query.statusDesc.trim() !== "") {
      const statusFilter = query.statusDesc.trim();
      finalData = formattedData.filter((item) => item.STAT === statusFilter);
    }
    return {
      statusCode: 200,
      message: "Allocations fetched successfully",
      data: finalData
    };
  } catch (error) {
    console.error("Error fetching allocations:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$21 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$20
});

const index_post$G = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.YEARS || !body.DESCS || !body.SDATE || !body.EDATE || !body.STAT) {
      return {
        statusCode: 400,
        message: "Year, Description, Start Date, End Date, and Status are required"
      };
    }
    const startDate = new Date(body.SDATE.split("/").reverse().join("-"));
    const endDate = new Date(body.EDATE.split("/").reverse().join("-"));
    const allocation = await prisma$1.quarter_budget.create({
      data: {
        qbu_year: body.YEARS,
        qbu_description: body.DESCS.toUpperCase(),
        qbu_start_date: startDate,
        qbu_end_date: endDate,
        qbu_status: body.STAT,
        qbu_extended_field: {
          statusDesc: body.STAT
        }
      }
    });
    return {
      statusCode: 201,
      message: "Allocation created successfully",
      data: {
        ID: allocation.qbu_quarter_id.toString(),
        YEARS: allocation.qbu_year,
        DESCS: allocation.qbu_description,
        SDATE: new Date(allocation.qbu_start_date).toLocaleDateString("en-GB"),
        EDATE: new Date(allocation.qbu_end_date).toLocaleDateString("en-GB"),
        STAT: allocation.qbu_status || "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error creating allocation:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_post$H = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$G
});

const _id__delete$m = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const budgetCode = await prisma$1.lkp_budget_code.findUnique({
      where: {
        lbc_id: parseInt(id)
      },
      select: {
        lbc_budget_code: true
      }
    });
    if (!budgetCode) {
      return {
        statusCode: 404,
        message: "Budget code not found"
      };
    }
    const usedInStructure = await prisma$1.structure_budget.findFirst({
      where: {
        lbc_budget_code: budgetCode.lbc_budget_code
      }
    });
    if (usedInStructure) {
      return {
        statusCode: 400,
        message: "Cannot delete budget code. It is being used in budget structure."
      };
    }
    await prisma$1.lkp_budget_code.delete({
      where: {
        lbc_id: parseInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Budget code deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting budget code:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Budget code not found"
      };
    }
    if (error.code === "P2003") {
      return {
        statusCode: 400,
        message: "Cannot delete budget code. It is being used in budget structure."
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__delete$n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$m
});

const _id__get$e = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const budgetCode = await prisma$1.lkp_budget_code.findUnique({
      where: {
        lbc_id: parseInt(id)
      }
    });
    if (!budgetCode) {
      return {
        statusCode: 404,
        message: "Budget code not found"
      };
    }
    const status = budgetCode.lbc_status === "1" || budgetCode.lbc_status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
    return {
      statusCode: 200,
      message: "Budget code fetched successfully",
      data: {
        lbc_id: budgetCode.lbc_id.toString(),
        lbc_level: budgetCode.lbc_level,
        lbc_budget_code: budgetCode.lbc_budget_code,
        lbc_description: budgetCode.lbc_description || "",
        lbc_status: status
      }
    };
  } catch (error) {
    console.error("Error fetching budget code:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__get$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$e
});

const _id__put$q = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    if (body.lbc_level !== void 0 && !body.lbc_level) {
      return {
        statusCode: 400,
        message: "Level is required"
      };
    }
    if (body.lbc_budget_code !== void 0 && !body.lbc_budget_code) {
      return {
        statusCode: 400,
        message: "Budget Code is required"
      };
    }
    if (body.lbc_status !== void 0 && !body.lbc_status) {
      return {
        statusCode: 400,
        message: "Status is required"
      };
    }
    const existing = await prisma$1.lkp_budget_code.findUnique({
      where: {
        lbc_id: parseInt(id)
      }
    });
    if (!existing) {
      return {
        statusCode: 404,
        message: "Budget code not found"
      };
    }
    if (body.lbc_budget_code && body.lbc_budget_code !== existing.lbc_budget_code) {
      const codeExists = await prisma$1.lkp_budget_code.findUnique({
        where: {
          lbc_budget_code: body.lbc_budget_code
        }
      });
      if (codeExists) {
        return {
          statusCode: 400,
          message: "Budget code already exists"
        };
      }
    }
    const statusValue = body.lbc_status === "ACTIVE" ? "1" : body.lbc_status === "INACTIVE" ? "0" : body.lbc_status;
    const user = event.context.user || event.context.userId || "system";
    const username = typeof user === "string" ? user : (user == null ? void 0 : user.username) || (user == null ? void 0 : user.USERNAME) || "system";
    const updateData = {
      updateddate: /* @__PURE__ */ new Date(),
      updatedby: username
    };
    if (body.lbc_level !== void 0)
      updateData.lbc_level = body.lbc_level;
    if (body.lbc_budget_code !== void 0)
      updateData.lbc_budget_code = body.lbc_budget_code;
    if (body.lbc_description !== void 0)
      updateData.lbc_description = body.lbc_description || "";
    if (body.lbc_status !== void 0)
      updateData.lbc_status = statusValue;
    const budgetCode = await prisma$1.lkp_budget_code.update({
      where: {
        lbc_id: parseInt(id)
      },
      data: updateData
    });
    return {
      statusCode: 200,
      message: "Budget code updated successfully",
      data: {
        lbc_id: budgetCode.lbc_id.toString(),
        lbc_level: budgetCode.lbc_level,
        lbc_budget_code: budgetCode.lbc_budget_code,
        lbc_description: budgetCode.lbc_description || "",
        lbc_status: budgetCode.lbc_status === "1" ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error updating budget code:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Budget code not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__put$r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$q
});

const index_get$1_ = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ lbc_id: searchNum }],
        { lbc_level: { contains: searchTerm } },
        { lbc_budget_code: { contains: searchTerm } },
        { lbc_description: { contains: searchTerm } },
        { lbc_status: { contains: searchTerm } }
      ];
    }
    if (query.lbc_level_filter && query.lbc_level_filter.trim() !== "") {
      where.lbc_level = query.lbc_level_filter.trim();
    }
    if (query.lbc_budget_code_filter && query.lbc_budget_code_filter.trim() !== "") {
      where.lbc_budget_code = query.lbc_budget_code_filter.trim();
    }
    if (query.lbc_description_filter && query.lbc_description_filter.trim() !== "") {
      where.lbc_description = {
        contains: query.lbc_description_filter.trim()
      };
    }
    if (query.lbc_status_filter && query.lbc_status_filter.trim() !== "") {
      const statusFilter = query.lbc_status_filter === "ACTIVE" ? "1" : query.lbc_status_filter === "INACTIVE" ? "0" : query.lbc_status_filter;
      where.lbc_status = statusFilter;
    }
    const budgetCodes = await prisma$1.lkp_budget_code.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        lbc_id: "asc"
      }
    });
    const formattedData = budgetCodes.map((item, index) => {
      const status = item.lbc_status === "1" || item.lbc_status === "ACTIVE" ? "ACTIVE" : "INACTIVE";
      return {
        lbc_id: item.lbc_id.toString(),
        lbc_level: item.lbc_level,
        lbc_budget_code: item.lbc_budget_code,
        lbc_description: item.lbc_description || "",
        lbc_status: status,
        no: index + 1
      };
    });
    return {
      statusCode: 200,
      message: "Budget codes fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$1$ = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1_
});

const index_post$E = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.lbc_level || !body.lbc_budget_code || !body.lbc_status) {
      return {
        statusCode: 400,
        message: "Level, Budget Code, and Status are required"
      };
    }
    const existing = await prisma$1.lkp_budget_code.findFirst({
      where: {
        lbc_level: body.lbc_level,
        lbc_budget_code: body.lbc_budget_code
      }
    });
    if (existing) {
      return {
        statusCode: 400,
        message: `Budget code "${body.lbc_budget_code}" with level "${body.lbc_level}" already exists`
      };
    }
    const existingByCode = await prisma$1.lkp_budget_code.findUnique({
      where: {
        lbc_budget_code: body.lbc_budget_code
      }
    });
    if (existingByCode) {
      return {
        statusCode: 400,
        message: "Budget code already exists"
      };
    }
    const maxId = await prisma$1.lkp_budget_code.findFirst({
      orderBy: {
        lbc_id: "desc"
      },
      select: {
        lbc_id: true
      }
    });
    const nextId = maxId ? maxId.lbc_id + 1 : 1;
    const statusValue = body.lbc_status === "ACTIVE" ? "1" : body.lbc_status === "INACTIVE" ? "0" : body.lbc_status;
    const user = event.context.user || event.context.userId || "system";
    const username = typeof user === "string" ? user : (user == null ? void 0 : user.username) || (user == null ? void 0 : user.USERNAME) || "system";
    const budgetCode = await prisma$1.lkp_budget_code.create({
      data: {
        lbc_id: nextId,
        lbc_level: body.lbc_level,
        lbc_budget_code: body.lbc_budget_code,
        lbc_description: body.lbc_description || "",
        lbc_status: statusValue,
        createddate: /* @__PURE__ */ new Date(),
        createdby: username
      }
    });
    return {
      statusCode: 201,
      message: "Budget code created successfully",
      data: {
        lbc_id: budgetCode.lbc_id.toString(),
        lbc_level: budgetCode.lbc_level,
        lbc_budget_code: budgetCode.lbc_budget_code,
        lbc_description: budgetCode.lbc_description || "",
        lbc_status: budgetCode.lbc_status === "1" ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error creating budget code:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 400,
        message: "Budget code already exists"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_post$F = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$E
});

const _id__delete$k = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    await prisma$1.budget_planning_schedule.delete({
      where: {
        bps_id: parseInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Budget planning schedule deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting budget planning schedule:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Budget planning schedule not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__delete$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$k
});

const _id__get$c = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const schedule = await prisma$1.budget_planning_schedule.findUnique({
      where: {
        bps_id: parseInt(id)
      }
    });
    if (!schedule) {
      return {
        statusCode: 404,
        message: "Budget planning schedule not found"
      };
    }
    const startDate = schedule.bps_plan_startDate ? new Date(schedule.bps_plan_startDate).toLocaleDateString("en-GB") : "";
    const endDate = schedule.bps_plan_endDate ? new Date(schedule.bps_plan_endDate).toLocaleDateString("en-GB") : "";
    return {
      statusCode: 200,
      message: "Budget planning schedule fetched successfully",
      data: {
        bps_id: schedule.bps_id.toString(),
        bps_year_budget: schedule.bps_year_budget,
        bps_plan_startDate: startDate,
        bps_plan_endDate: endDate,
        bps_status: schedule.bps_status
      }
    };
  } catch (error) {
    console.error("Error fetching budget planning schedule:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__get$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$c
});

const _id__put$o = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const updateData = {};
    if (body.cmd_start_date) {
      if (body.cmd_start_date.includes("/")) {
        updateData.bps_plan_startDate = new Date(body.cmd_start_date.split("/").reverse().join("-"));
      } else {
        updateData.bps_plan_startDate = new Date(body.cmd_start_date);
      }
    }
    if (body.cmd_end_date) {
      if (body.cmd_end_date.includes("/")) {
        updateData.bps_plan_endDate = new Date(body.cmd_end_date.split("/").reverse().join("-"));
      } else {
        updateData.bps_plan_endDate = new Date(body.cmd_end_date);
      }
    }
    if (body.cmd_status) {
      updateData.bps_status = body.cmd_status;
    }
    if (body.cmd_year) {
      const yearInt = parseInt(body.cmd_year);
      if (!isNaN(yearInt)) {
        updateData.bps_year_budget = yearInt;
      }
    }
    updateData.updateddate = /* @__PURE__ */ new Date();
    const schedule = await prisma$1.budget_planning_schedule.update({
      where: {
        bps_id: parseInt(id)
      },
      data: updateData
    });
    return {
      statusCode: 200,
      message: `Schedule for Budget Planning Year ${schedule.bps_year_budget} successfully updated`,
      data: {
        bps_id: schedule.bps_id.toString(),
        bps_year_budget: schedule.bps_year_budget,
        bps_plan_startDate: new Date(schedule.bps_plan_startDate).toLocaleDateString("en-GB"),
        bps_plan_endDate: new Date(schedule.bps_plan_endDate).toLocaleDateString("en-GB"),
        bps_status: schedule.bps_status
      }
    };
  } catch (error) {
    console.error("Error updating budget planning schedule:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Budget planning schedule not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__put$p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$o
});

const index_get$1Y = defineEventHandler(async (event) => {
  try {
    try {
      if (!prisma$1.budget_planning_schedule || typeof prisma$1.budget_planning_schedule.findMany !== "function") {
        console.error("Prisma model 'budget_planning_schedule' not found in client");
        return {
          statusCode: 500,
          message: "Prisma model not found. Please ensure you have run 'npx prisma generate' and restarted the server.",
          error: "Model budget_planning_schedule does not exist in Prisma client",
          data: []
        };
      }
    } catch (checkError) {
      console.error("Error checking Prisma model:", checkError);
      return {
        statusCode: 500,
        message: "Prisma model not found. Please ensure you have run 'npx prisma generate' and restarted the server.",
        error: checkError.message,
        data: []
      };
    }
    const query = getQuery$1(event);
    const where = {};
    if (query.cm_filter_year && query.cm_filter_year.trim() !== "") {
      const yearInt = parseInt(query.cm_filter_year.trim());
      if (!isNaN(yearInt)) {
        where.bps_year_budget = yearInt;
      }
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ bps_id: searchNum }],
        ...isNaN(searchNum) ? [] : [{ bps_year_budget: searchNum }],
        { bps_status: { contains: searchTerm } }
      ];
    }
    const schedules = await prisma$1.budget_planning_schedule.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        bps_id: "desc"
      }
    });
    schedules.sort((a, b) => {
      if (!a.bps_year_budget && !b.bps_year_budget)
        return 0;
      if (!a.bps_year_budget)
        return 1;
      if (!b.bps_year_budget)
        return -1;
      return (b.bps_year_budget || 0) - (a.bps_year_budget || 0);
    });
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const formattedData = schedules.map((item, index) => {
      var _a;
      const startDate = item.bps_plan_startDate ? new Date(item.bps_plan_startDate).toLocaleDateString("en-GB") : "";
      const endDate = item.bps_plan_endDate ? new Date(item.bps_plan_endDate).toLocaleDateString("en-GB") : "";
      const planningDate = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || "";
      let status = "INACTIVE";
      if (item.bps_status === "1" || item.bps_status === 1 || item.bps_status === "ACTIVE") {
        status = "ACTIVE";
      } else if (item.bps_status === "0" || item.bps_status === 0 || item.bps_status === "INACTIVE") {
        status = "INACTIVE";
      }
      return {
        bps_id: item.bps_id.toString(),
        current_year: currentYear,
        bps_year_budget: ((_a = item.bps_year_budget) == null ? void 0 : _a.toString()) || "",
        planning_date: planningDate,
        bps_status: status,
        no: index + 1
      };
    });
    return {
      statusCode: 200,
      message: "Budget planning schedules fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget planning schedules:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    if (error.message && (error.message.includes("model") || error.message.includes("does not exist") || error.message.includes("Unknown arg") || error.message.includes("prisma.budget_planning_schedule") || error.code === "P2001")) {
      return {
        statusCode: 500,
        message: "Prisma model not found. Please stop the dev server, run 'npx prisma generate', then restart the server.",
        error: error.message,
        errorCode: error.code,
        data: []
      };
    }
    if (error.code === "P1001" || error.message.includes("connect") || error.message.includes("ECONNREFUSED")) {
      return {
        statusCode: 500,
        message: "Database connection error. Please check your database connection.",
        error: error.message,
        errorCode: error.code,
        data: []
      };
    }
    if (error.code === "P2025" || error.message.includes("Table") || error.message.includes("doesn't exist")) {
      return {
        statusCode: 404,
        message: "Table not found in database. Please ensure the table 'budget_planning_schedule' exists.",
        error: error.message,
        errorCode: error.code,
        data: []
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      errorCode: error.code,
      errorName: error.name,
      data: []
    };
  }
});

const index_get$1Z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1Y
});

const index_post$C = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.cmd_year || !body.cmd_start_date || !body.cmd_end_date || !body.cmd_status) {
      return {
        statusCode: 400,
        message: "Year, Start Date, End Date, and Status are required"
      };
    }
    const yearInt = parseInt(body.cmd_year);
    if (isNaN(yearInt)) {
      return {
        statusCode: 400,
        message: "Year must be a valid number"
      };
    }
    const existing = await prisma$1.budget_planning_schedule.findFirst({
      where: {
        bps_year_budget: yearInt
      }
    });
    if (existing) {
      return {
        statusCode: 400,
        message: `Year ${body.cmd_year} already exists with status ${existing.bps_status === "1" ? "ACTIVE" : "INACTIVE"}`
      };
    }
    let startDate, endDate;
    if (body.cmd_start_date.includes("/")) {
      startDate = new Date(body.cmd_start_date.split("/").reverse().join("-"));
    } else {
      startDate = new Date(body.cmd_start_date);
    }
    if (body.cmd_end_date.includes("/")) {
      endDate = new Date(body.cmd_end_date.split("/").reverse().join("-"));
    } else {
      endDate = new Date(body.cmd_end_date);
    }
    const schedule = await prisma$1.budget_planning_schedule.create({
      data: {
        bps_year_budget: yearInt,
        bps_plan_startDate: startDate,
        bps_plan_endDate: endDate,
        bps_status: body.cmd_status,
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 201,
      message: "New Schedule for Budget Planning successfully saved",
      data: {
        bps_id: schedule.bps_id.toString(),
        bps_year_budget: schedule.bps_year_budget,
        bps_plan_startDate: new Date(schedule.bps_plan_startDate).toLocaleDateString("en-GB"),
        bps_plan_endDate: new Date(schedule.bps_plan_endDate).toLocaleDateString("en-GB"),
        bps_status: schedule.bps_status
      }
    };
  } catch (error) {
    console.error("Error creating budget planning schedule:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_post$D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$C
});

const _id__delete$i = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    await prisma$1.structure_budget.delete({
      where: {
        sbg_budget_id: parseInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Budget structure deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting budget structure:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Budget structure not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__delete$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$i
});

const _id__get$a = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const structure = await prisma$1.structure_budget.findUnique({
      where: {
        sbg_budget_id: parseInt(id)
      }
    });
    if (!structure) {
      return {
        statusCode: 404,
        message: "Budget structure not found"
      };
    }
    return {
      statusCode: 200,
      message: "Budget structure fetched successfully",
      data: {
        ID: structure.sbg_budget_id.toString(),
        FUND: structure.fty_fund_type,
        ACTIVITY: structure.at_activity_code || "",
        OUN: structure.oun_code || "",
        CCR: structure.ccr_costcentre || "",
        PROJNO: structure.cpa_project_no || "",
        BUDGETCODE: structure.lbc_budget_code,
        STAT: structure.sbg_status,
        YEAR: structure.sby_year,
        DEFISIT: structure.acm_defisit
      }
    };
  } catch (error) {
    console.error("Error fetching budget structure:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__get$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$a
});

const _id__put$m = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "ID is required"
      };
    }
    const updateData = {};
    if (body.FUND)
      updateData.fty_fund_type = body.FUND;
    if (body.ACTIVITY)
      updateData.at_activity_code = body.ACTIVITY;
    if (body.OUN)
      updateData.oun_code = body.OUN;
    if (body.CCR)
      updateData.ccr_costcentre = body.CCR;
    if (body.BUDGETCODE)
      updateData.lbc_budget_code = body.BUDGETCODE;
    if (body.PROJNO !== void 0)
      updateData.cpa_project_no = body.PROJNO;
    if (body.YEAR)
      updateData.sby_year = body.YEAR;
    if (body.STAT)
      updateData.sbg_status = body.STAT;
    if (body.DEFISIT)
      updateData.acm_defisit = body.DEFISIT;
    updateData.updateddate = /* @__PURE__ */ new Date();
    const structure = await prisma$1.structure_budget.update({
      where: {
        sbg_budget_id: parseInt(id)
      },
      data: updateData
    });
    return {
      statusCode: 200,
      message: "Budget structure updated successfully",
      data: {
        ID: structure.sbg_budget_id.toString(),
        FUND: structure.fty_fund_type,
        ACTIVITY: structure.at_activity_code,
        OUN: structure.oun_code,
        CCR: structure.ccr_costcentre,
        PROJNO: structure.cpa_project_no,
        BUDGETCODE: structure.lbc_budget_code,
        STAT: structure.sbg_status,
        YEAR: structure.sby_year,
        DEFISIT: structure.acm_defisit
      }
    };
  } catch (error) {
    console.error("Error updating budget structure:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Budget structure not found"
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const _id__put$n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$m
});

const index_get$1W = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.tf_year && query.tf_year !== "null" && query.tf_year.trim() !== "") {
      where.sby_year = query.tf_year.trim();
    }
    if (query.tf_fund && query.tf_fund !== "null" && query.tf_fund.trim() !== "") {
      where.fty_fund_type = query.tf_fund.trim();
    }
    if (query.tf_ouncode && query.tf_ouncode !== "null" && query.tf_ouncode.trim() !== "") {
      where.oun_code = query.tf_ouncode.trim();
    }
    if (query.tf_costcentre && query.tf_costcentre !== "null" && query.tf_costcentre.trim() !== "") {
      where.ccr_costcentre = query.tf_costcentre.trim();
    }
    if (query.tf_activity && query.tf_activity !== "null" && query.tf_activity.trim() !== "") {
      where.at_activity_code = query.tf_activity.trim();
    }
    if (query.FUND && query.FUND.trim() !== "") {
      where.fty_fund_type = query.FUND.trim();
    }
    if (query.ACTIVITY && query.ACTIVITY.trim() !== "") {
      where.at_activity_code = query.ACTIVITY.trim();
    }
    if (query.OUN && query.OUN.trim() !== "") {
      where.oun_code = query.OUN.trim();
    }
    if (query.CCR && query.CCR.trim() !== "") {
      where.ccr_costcentre = query.CCR.trim();
    }
    if (query.BUDGETCODE && query.BUDGETCODE.trim() !== "") {
      where.lbc_budget_code = query.BUDGETCODE.trim();
    }
    if (query.YEAR && query.YEAR.trim() !== "") {
      where.sby_year = query.YEAR.trim();
    }
    if (query.STAT && query.STAT.trim() !== "") {
      where.sbg_status = query.STAT === "ACTIVE" ? "1" : "0";
    }
    if (query.DEFISIT && query.DEFISIT.trim() !== "") {
      where.acm_defisit = query.DEFISIT === "YES" ? "Y" : "N";
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ sbg_budget_id: searchNum }],
        { fty_fund_type: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { lbc_budget_code: { contains: searchTerm } },
        { sby_year: { contains: searchTerm } }
      ];
    }
    const structures = await prisma$1.structure_budget.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      include: {
        activity_type: {
          select: {
            at_activity_description_bm: true
          }
        },
        lkp_budget_code: {
          select: {
            lbc_description: true
          }
        },
        organization_unit: {
          select: {
            oun_desc: true
          }
        }
      },
      orderBy: {
        sbg_budget_id: "desc"
      }
    });
    const formattedData = structures.map((item, index) => {
      var _a, _b;
      const status = item.sbg_status === "1" ? "ACTIVE" : "INACTIVE";
      const deficit = item.acm_defisit === "Y" ? "YES" : "NO";
      return {
        ID: item.sbg_budget_id.toString(),
        FUND: item.fty_fund_type || "",
        OUN: item.oun_code || "",
        CCR: item.ccr_costcentre || "",
        ACTIVITY: item.at_activity_code || "",
        activity_desc: ((_a = item.activity_type) == null ? void 0 : _a.at_activity_description_bm) || "",
        BUDGETCODE: item.lbc_budget_code || "",
        lbc_description: ((_b = item.lkp_budget_code) == null ? void 0 : _b.lbc_description) || "",
        DEFISIT: deficit,
        STAT: status,
        YEAR: item.sby_year || "",
        no: index + 1
      };
    });
    return {
      statusCode: 200,
      message: "Budget structures fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget structures:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$1X = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1W
});

const index_post$A = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.FUND || !body.ACTIVITY || !body.OUN || !body.CCR || !body.BUDGETCODE || !body.YEAR || !body.STAT || !body.DEFISIT) {
      return {
        statusCode: 400,
        message: "All required fields must be filled"
      };
    }
    const maxId = await prisma$1.structure_budget.findFirst({
      orderBy: {
        sbg_budget_id: "desc"
      },
      select: {
        sbg_budget_id: true
      }
    });
    const nextId = maxId ? maxId.sbg_budget_id + 1 : 1;
    const structure = await prisma$1.structure_budget.create({
      data: {
        sbg_budget_id: nextId,
        fty_fund_type: body.FUND,
        oun_code: body.OUN,
        ccr_costcentre: body.CCR,
        at_activity_code: body.ACTIVITY,
        lbc_budget_code: body.BUDGETCODE,
        cpa_project_no: body.PROJNO || null,
        sby_year: body.YEAR,
        sbg_status: body.STAT,
        acm_defisit: body.DEFISIT,
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 201,
      message: "Budget structure created successfully",
      data: {
        ID: structure.sbg_budget_id.toString(),
        FUND: structure.fty_fund_type,
        ACTIVITY: structure.at_activity_code,
        OUN: structure.oun_code,
        CCR: structure.ccr_costcentre,
        PROJNO: structure.cpa_project_no,
        BUDGETCODE: structure.lbc_budget_code,
        STAT: structure.sbg_status,
        YEAR: structure.sby_year,
        DEFISIT: structure.acm_defisit
      }
    };
  } catch (error) {
    console.error("Error creating budget structure:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_post$B = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$A
});

const detail_delete = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);
    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required"
      };
    }
    await prisma$1.budget_movement_detl.delete({
      where: {
        bmd_bgt_movement_detl_id
      }
    });
    return {
      statusCode: 200,
      message: "Detail deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting detail:", error);
    return {
      statusCode: 500,
      message: "Failed to delete detail",
      error: error.message
    };
  }
});

const detail_delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_delete
});

const detail_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bmm_budget_movement_id,
      type,
      fty_fund_type,
      oun_code,
      sbg_budget_code,
      bdg_budget_id,
      bmd_mvt_amt,
      cym_currency_code,
      cyd_unit,
      cyd_conversation_rate,
      amt_currency
    } = body;
    if (!bmm_budget_movement_id || !type || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    const budget = await prisma$1.budget.findFirst({
      where: {
        bdg_budget_id: parseInt(bdg_budget_id)
      },
      include: {
        structure_budget: true,
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const maxDetail = await prisma$1.budget_movement_detl.findFirst({
      orderBy: {
        bmd_bgt_movement_detl_id: "desc"
      }
    });
    const nextDetailId = ((maxDetail == null ? void 0 : maxDetail.bmd_bgt_movement_detl_id) || 0) + 1;
    const detailData = {
      bmd_bgt_movement_detl_id: nextDetailId,
      bmm_budget_movement_id: parseInt(bmm_budget_movement_id),
      qbu_quarter_id: budget.qbu_quarter_id,
      bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
      bmd_mvt_status: "DRAFT",
      cym_currency_code: cym_currency_code || null,
      cyd_unit: cyd_unit || null,
      cyd_conversation_rate: cyd_conversation_rate ? parseFloat(cyd_conversation_rate) : null,
      bmd_currency_amt: amt_currency ? parseFloat(amt_currency.toString().replace(/,/g, "")) : null,
      createdby: "system"
      // TODO: Get from auth
    };
    if (type === "From") {
      detailData.sbg_budget_id_from = parseInt(sbg_budget_code);
    } else {
      detailData.sbg_budget_id_to = parseInt(sbg_budget_code);
    }
    const detail = await prisma$1.budget_movement_detl.create({
      data: detailData
    });
    return {
      statusCode: 200,
      message: "Detail created successfully",
      data: detail
    };
  } catch (error) {
    console.error("Error creating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to create detail",
      error: error.message
    };
  }
});

const detail_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_post
});

const detail_put = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bmd_bgt_movement_detl_id,
      type,
      fty_fund_type,
      oun_code,
      sbg_budget_code,
      bdg_budget_id,
      bmd_mvt_amt,
      cym_currency_code,
      cyd_unit,
      cyd_conversation_rate,
      amt_currency
    } = body;
    if (!bmd_bgt_movement_detl_id || !type || !fty_fund_type || !oun_code || !sbg_budget_code || !bmd_mvt_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    const budget = await prisma$1.budget.findFirst({
      where: {
        bdg_budget_id: parseInt(bdg_budget_id)
      },
      include: {
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const updateData = {
      qbu_quarter_id: budget.qbu_quarter_id,
      bmd_mvt_amt: parseFloat(bmd_mvt_amt.toString().replace(/,/g, "")),
      cym_currency_code: cym_currency_code || null,
      cyd_unit: cyd_unit || null,
      cyd_conversation_rate: cyd_conversation_rate ? parseFloat(cyd_conversation_rate) : null,
      bmd_currency_amt: amt_currency ? parseFloat(amt_currency.toString().replace(/,/g, "")) : null,
      updatedby: "system",
      // TODO: Get from auth
      updateddate: /* @__PURE__ */ new Date()
    };
    if (type === "From") {
      updateData.sbg_budget_id_from = parseInt(sbg_budget_code);
      updateData.sbg_budget_id_to = null;
    } else {
      updateData.sbg_budget_id_to = parseInt(sbg_budget_code);
      updateData.sbg_budget_id_from = null;
    }
    const detail = await prisma$1.budget_movement_detl.update({
      where: {
        bmd_bgt_movement_detl_id: parseInt(bmd_bgt_movement_detl_id)
      },
      data: updateData
    });
    return {
      statusCode: 200,
      message: "Detail updated successfully",
      data: detail
    };
  } catch (error) {
    console.error("Error updating detail:", error);
    return {
      statusCode: 500,
      message: "Failed to update detail",
      error: error.message
    };
  }
});

const detail_put$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: detail_put
});

const from_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const details = await prisma$1.budget_movement_detl.findMany({
      where: {
        bmm_budget_movement_id,
        sbg_budget_id_from: {
          not: null
        }
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_fromTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        budget_movement_master: {
          include: {
            quarter_budget: true
          }
        }
      }
    });
    const budgetData = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: {
          in: details.map((d) => d.sbg_budget_id_from).filter(Boolean)
        },
        bdg_status: "APPROVED"
      },
      include: {
        quarter_budget: true
      },
      orderBy: {
        bdg_budget_id: "desc"
      }
    });
    const budgetMap = /* @__PURE__ */ new Map();
    budgetData.forEach((b) => {
      if (b.sbg_budget_id && !budgetMap.has(b.sbg_budget_id)) {
        budgetMap.set(b.sbg_budget_id, b);
      }
    });
    const formattedData = details.map((item) => {
      var _a, _b, _c, _d, _e;
      const sb = item.structure_budget_budget_movement_detl_sbg_budget_id_fromTostructure_budget;
      const qb = (_a = item.budget_movement_master) == null ? void 0 : _a.quarter_budget;
      const budget = item.sbg_budget_id_from ? budgetMap.get(item.sbg_budget_id_from) : null;
      return {
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: (budget == null ? void 0 : budget.bdg_budget_id) || null,
        sbg_budget_id: item.sbg_budget_id_from,
        qbu_quarter_id: (budget == null ? void 0 : budget.quarter_budget) ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : qb ? `${qb.qbu_year} - ${qb.qbu_description}` : "",
        fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        bdg_balance_amt: ((_b = budget == null ? void 0 : budget.bdg_balance_amt) == null ? void 0 : _b.toString()) || "0.00",
        bmd_mvt_amt: ((_c = item.bmd_mvt_amt) == null ? void 0 : _c.toString()) || "0.00",
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: ((_d = item.cyd_conversation_rate) == null ? void 0 : _d.toString()) || "0.00",
        amt_currency: ((_e = item.bmd_currency_amt) == null ? void 0 : _e.toString()) || "0.00"
      };
    });
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching from list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch from list",
      error: error.message
    };
  }
});

const from_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: from_get
});

const getBudget_get = defineEventHandler(async (event) => {
  var _a;
  try {
    const query = getQuery$1(event);
    const bdg_budget_id = parseInt(query.bdg_budget_id);
    if (!bdg_budget_id) {
      return {
        statusCode: 400,
        message: "bdg_budget_id is required"
      };
    }
    const budget = await prisma$1.budget.findUnique({
      where: {
        bdg_budget_id
      },
      include: {
        structure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        quarter_budget: true
      }
    });
    if (!budget) {
      return {
        statusCode: 404,
        message: "Budget not found"
      };
    }
    const sb = budget.structure_budget;
    const formattedData = {
      bdg_budget_id: budget.bdg_budget_id,
      sbg_budget_id: budget.sbg_budget_id,
      qbu_quarter_id: budget.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
      fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
      at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
      oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
      ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
      sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
      bdg_balance_amt: ((_a = budget.bdg_balance_amt) == null ? void 0 : _a.toString()) || "0.00"
    };
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget",
      error: error.message
    };
  }
});

const getBudget_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: getBudget_get
});

const get_get$4 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  try {
    const query = getQuery$1(event);
    const bmd_bgt_movement_detl_id = parseInt(query.bmd_bgt_movement_detl_id);
    const type = query.type || "From";
    if (!bmd_bgt_movement_detl_id) {
      return {
        statusCode: 400,
        message: "bmd_bgt_movement_detl_id is required"
      };
    }
    const detail = await prisma$1.budget_movement_detl.findUnique({
      where: {
        bmd_bgt_movement_detl_id
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_fromTostructure_budget: type === "From" ? {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        } : false,
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: type === "To" ? {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        } : false,
        budget: {
          include: {
            quarter_budget: true
          }
        }
      }
    });
    if (!detail) {
      return {
        statusCode: 404,
        message: "Detail not found"
      };
    }
    const sb = type === "From" ? detail.structure_budget_budget_movement_detl_sbg_budget_id_fromTostructure_budget : detail.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
    const budget = detail.budget;
    const formattedData = {
      bmd_bgt_movement_detl_id: detail.bmd_bgt_movement_detl_id,
      fundType_virement1: (sb == null ? void 0 : sb.fty_fund_type) || "",
      ptj_virement1: (sb == null ? void 0 : sb.oun_code) || "",
      budgetCode_virement1: (budget == null ? void 0 : budget.bdg_budget_id) || null,
      qbu_quarter_id: (budget == null ? void 0 : budget.quarter_budget) ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
      fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
      at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
      oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
      ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
      sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
      bdg_balance_amt: ((_a = budget == null ? void 0 : budget.bdg_balance_amt) == null ? void 0 : _a.toString()) || "0.00",
      bmd_mvt_amt: ((_b = detail.bmd_mvt_amt) == null ? void 0 : _b.toString()) || "0.00",
      sbg_budget_id: type === "From" ? detail.sbg_budget_id_from : detail.sbg_budget_id_to,
      bdg_budget_id: (budget == null ? void 0 : budget.bdg_budget_id) || null,
      cym_currency_code: detail.cym_currency_code || "",
      cyd_unit: detail.cyd_unit || "",
      cyd_conversation_rate: ((_c = detail.cyd_conversation_rate) == null ? void 0 : _c.toString()) || "0.00",
      amt_currency: ((_d = detail.bmd_currency_amt) == null ? void 0 : _d.toString()) || "0.00"
    };
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching detail:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch detail",
      error: error.message
    };
  }
});

const get_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: get_get$4
});

const to_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const details = await prisma$1.budget_movement_detl.findMany({
      where: {
        bmm_budget_movement_id,
        sbg_budget_id_to: {
          not: null
        }
      },
      include: {
        structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget: {
          include: {
            fund_type: true,
            activity_type: true,
            organization_unit: true,
            lkp_budget_code: true
          }
        },
        budget_movement_master: {
          include: {
            quarter_budget: true
          }
        }
      }
    });
    const budgetData = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: {
          in: details.map((d) => d.sbg_budget_id_to).filter(Boolean)
        },
        bdg_status: "APPROVED"
      },
      include: {
        quarter_budget: true
      },
      orderBy: {
        bdg_budget_id: "desc"
      }
    });
    const budgetMap = /* @__PURE__ */ new Map();
    budgetData.forEach((b) => {
      if (b.sbg_budget_id && !budgetMap.has(b.sbg_budget_id)) {
        budgetMap.set(b.sbg_budget_id, b);
      }
    });
    const formattedData = details.map((item) => {
      var _a, _b, _c, _d, _e;
      const sb = item.structure_budget_budget_movement_detl_sbg_budget_id_toTostructure_budget;
      const qb = (_a = item.budget_movement_master) == null ? void 0 : _a.quarter_budget;
      const budget = item.sbg_budget_id_to ? budgetMap.get(item.sbg_budget_id_to) : null;
      return {
        bmd_bgt_movement_detl_id: item.bmd_bgt_movement_detl_id,
        bdg_budget_id: (budget == null ? void 0 : budget.bdg_budget_id) || null,
        sbg_budget_id: item.sbg_budget_id_to,
        qbu_quarter_id: (budget == null ? void 0 : budget.quarter_budget) ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : qb ? `${qb.qbu_year} - ${qb.qbu_description}` : "",
        fty_fund_type: (sb == null ? void 0 : sb.fund_type) ? `${sb.fty_fund_type} - ${sb.fund_type.fty_fund_desc}` : "",
        at_activity_code: (sb == null ? void 0 : sb.activity_type) ? `${sb.at_activity_code} - ${sb.activity_type.at_activity_description_bm}` : "",
        oun_code: (sb == null ? void 0 : sb.organization_unit) ? `${sb.oun_code} - ${sb.organization_unit.oun_desc}` : "",
        ccr_costcentre: (sb == null ? void 0 : sb.ccr_costcentre) || "",
        sbg_budget_code: (sb == null ? void 0 : sb.lkp_budget_code) ? `${sb.lbc_budget_code} - ${sb.lkp_budget_code.lbc_description}` : "",
        bdg_balance_amt: ((_b = budget == null ? void 0 : budget.bdg_balance_amt) == null ? void 0 : _b.toString()) || "0.00",
        bmd_mvt_amt: ((_c = item.bmd_mvt_amt) == null ? void 0 : _c.toString()) || "0.00",
        cym_currency_code: item.cym_currency_code || "",
        cyd_unit: item.cyd_unit || "",
        cyd_conversation_rate: ((_d = item.cyd_conversation_rate) == null ? void 0 : _d.toString()) || "0.00",
        amt_currency: ((_e = item.bmd_currency_amt) == null ? void 0 : _e.toString()) || "0.00"
      };
    });
    return {
      statusCode: 200,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching to list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch to list",
      error: error.message
    };
  }
});

const to_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: to_get
});

const budgetCodes_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const { fty_fund_type, oun_code } = query;
    if (!fty_fund_type || !oun_code) {
      return {
        statusCode: 400,
        message: "fty_fund_type and oun_code are required"
      };
    }
    const structureBudgets = await prisma$1.structure_budget.findMany({
      where: {
        fty_fund_type,
        oun_code
      },
      include: {
        lkp_budget_code: {
          where: {
            lbc_status: 1
          }
        }
      }
    });
    const sbgIds = structureBudgets.map((sb) => sb.sbg_budget_id);
    const budgets = await prisma$1.budget.findMany({
      where: {
        sbg_budget_id: {
          in: sbgIds
        },
        bdg_status: "APPROVED"
      },
      include: {
        structure_budget: {
          include: {
            lkp_budget_code: true
          }
        },
        quarter_budget: true
      },
      orderBy: {
        bdg_budget_id: "desc"
      }
    });
    const budgetCodeMap = /* @__PURE__ */ new Map();
    budgets.forEach((budget) => {
      var _a;
      const sb = budget.structure_budget;
      const key = `${sb.sbg_budget_id}`;
      if (!budgetCodeMap.has(key) && sb.lkp_budget_code) {
        budgetCodeMap.set(key, {
          sbg_budget_id: sb.sbg_budget_id,
          lbc_budget_code: sb.lbc_budget_code,
          lbc_description: sb.lkp_budget_code.lbc_description,
          bdg_budget_id: budget.bdg_budget_id,
          qbu_quarter_id: budget.quarter_budget ? `${budget.quarter_budget.qbu_year} - ${budget.quarter_budget.qbu_description}` : "",
          bdg_balance_amt: ((_a = budget.bdg_balance_amt) == null ? void 0 : _a.toString()) || "0.00"
        });
      }
    });
    return {
      statusCode: 200,
      data: Array.from(budgetCodeMap.values())
    };
  } catch (error) {
    console.error("Error fetching budget codes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch budget codes",
      error: error.message
    };
  }
});

const budgetCodes_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: budgetCodes_get
});

const currencyCodes_get = defineEventHandler(async (event) => {
  try {
    const currencyCodes = [
      {
        cym_currency_code: "MYR",
        cym_currency_desc: "Malaysian Ringgit",
        cyd_unit: "1",
        cyd_conversation_rate: 1
      },
      {
        cym_currency_code: "USD",
        cym_currency_desc: "US Dollar",
        cyd_unit: "1",
        cyd_conversation_rate: 4.5
        // Example rate
      },
      {
        cym_currency_code: "EUR",
        cym_currency_desc: "Euro",
        cyd_unit: "1",
        cyd_conversation_rate: 5
        // Example rate
      }
    ];
    return {
      statusCode: 200,
      data: currencyCodes
    };
  } catch (error) {
    console.error("Error fetching currency codes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch currency codes",
      error: error.message
    };
  }
});

const currencyCodes_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: currencyCodes_get
});

const movementTypes_get = defineEventHandler(async (event) => {
  try {
    const lookupDetails = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "VIREMENT_TYPE",
        lde_status: 1
      },
      orderBy: {
        lde_value: "asc"
      }
    });
    return {
      statusCode: 200,
      data: lookupDetails
    };
  } catch (error) {
    console.error("Error fetching movement types:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch movement types",
      error: error.message
    };
  }
});

const movementTypes_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: movementTypes_get
});

const master_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id
      }
    });
    if (!master) {
      return {
        statusCode: 404,
        message: "Budget movement master not found"
      };
    }
    return {
      statusCode: 200,
      data: master
    };
  } catch (error) {
    console.error("Error fetching master data:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch master data",
      error: error.message
    };
  }
});

const master_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: master_get
});

const new_post = defineEventHandler(async (event) => {
  try {
    const maxMaster = await prisma$1.budget_movement_master.findFirst({
      orderBy: {
        bmm_budget_movement_id: "desc"
      }
    });
    const movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear().toString();
    const refNo = `VIRE-${currentYear}-${String(movementId).padStart(6, "0")}`;
    const master = await prisma$1.budget_movement_master.create({
      data: {
        bmm_budget_movement_id: movementId,
        bmm_year: currentYear,
        bmm_budget_movement_no: refNo,
        bmm_trans_type: "VIREMENT",
        bmm_movement_type: "Within PTJ",
        // Default, can be changed
        bmm_total_amt: 0,
        bmm_status: "DRAFT",
        bmm_money_transfer: "N",
        createdby: "system"
        // TODO: Get from auth
      }
    });
    return {
      statusCode: 200,
      message: "New virement record created successfully",
      data: {
        bmm_budget_movement_id: master.bmm_budget_movement_id,
        bmm_budget_movement_no: master.bmm_budget_movement_no,
        bmm_year: master.bmm_year,
        bmm_status: master.bmm_status
      }
    };
  } catch (error) {
    console.error("Error creating new virement:", error);
    return {
      statusCode: 500,
      message: "Failed to create new virement record",
      error: error.message
    };
  }
});

const new_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: new_post
});

const processFlow_get$4 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const bmm_budget_movement_id = parseInt(query.bmm_budget_movement_id);
    if (!bmm_budget_movement_id) {
      return {
        statusCode: 400,
        message: "bmm_budget_movement_id is required"
      };
    }
    const master = await prisma$1.budget_movement_master.findUnique({
      where: {
        bmm_budget_movement_id
      }
    });
    if (!master) {
      return {
        statusCode: 404,
        message: "Budget movement master not found"
      };
    }
    const processFlow = [];
    return {
      statusCode: 200,
      data: processFlow
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message
    };
  }
});

const processFlow_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: processFlow_get$4
});

const submit_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      bmm_budget_movement_id,
      bmm_year,
      bmm_endorse_doc,
      bmm_movement_type,
      bmm_description,
      bmm_money_transfer,
      bmm_total_amt,
      submitMode,
      workflow,
      dataArraySource,
      dataArrayTarget
    } = body;
    if (!bmm_year || !bmm_endorse_doc || !bmm_movement_type || !bmm_description || !bmm_total_amt) {
      return {
        statusCode: 400,
        message: "Missing required fields"
      };
    }
    let movementId = bmm_budget_movement_id;
    if (!movementId) {
      const maxMaster = await prisma$1.budget_movement_master.findFirst({
        orderBy: {
          bmm_budget_movement_id: "desc"
        }
      });
      movementId = ((maxMaster == null ? void 0 : maxMaster.bmm_budget_movement_id) || 0) + 1;
    }
    const refNo = `VIRE-${bmm_year}-${String(movementId).padStart(6, "0")}`;
    const masterData = {
      bmm_year,
      bmm_budget_movement_no: refNo,
      bmm_trans_type: "VIREMENT",
      bmm_movement_type,
      bmm_total_amt: parseFloat(bmm_total_amt.toString().replace(/,/g, "")),
      bmm_endorse_doc,
      bmm_description,
      bmm_money_transfer: bmm_money_transfer || "N",
      bmm_status: submitMode === "Submit" ? "ENTRY" : "DRAFT",
      createdby: "system"
      // TODO: Get from auth
    };
    if (bmm_budget_movement_id) {
      await prisma$1.budget_movement_master.update({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id)
        },
        data: {
          ...masterData,
          updatedby: "system",
          updateddate: /* @__PURE__ */ new Date()
        }
      });
    } else {
      await prisma$1.budget_movement_master.create({
        data: {
          bmm_budget_movement_id: movementId,
          ...masterData
        }
      });
    }
    if (submitMode === "Submit" && bmm_budget_movement_id) {
      await prisma$1.budget_movement_detl.updateMany({
        where: {
          bmm_budget_movement_id: parseInt(bmm_budget_movement_id)
        },
        data: {
          bmd_mvt_status: "ENTRY",
          updatedby: "system",
          updateddate: /* @__PURE__ */ new Date()
        }
      });
    }
    return {
      statusCode: 200,
      message: submitMode === "Submit" ? "Application submitted successfully" : "Application saved successfully",
      bmm_budget_movement_id: movementId,
      referenceNo: refNo
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    return {
      statusCode: 500,
      message: "Failed to submit application",
      error: error.message
    };
  }
});

const submit_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: submit_post
});

const index_get$1U = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {
      bmm_trans_type: "VIREMENT"
    };
    if (query.sm_bmm_year && query.sm_bmm_year.trim() !== "") {
      where.bmm_year = query.sm_bmm_year.trim();
    }
    if (query.sm_bmm_status && query.sm_bmm_status.trim() !== "") {
      where.bmm_status = query.sm_bmm_status.trim();
    }
    if (query.sm_bmm_movement_type && query.sm_bmm_movement_type.trim() !== "") {
      where.bmm_movement_type = { contains: query.sm_bmm_movement_type.trim() };
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ bmm_budget_movement_id: searchNum }],
        { bmm_year: { contains: searchTerm } },
        { bmm_budget_movement_no: { contains: searchTerm } },
        { bmm_endorse_doc: { contains: searchTerm } },
        { bmm_description: { contains: searchTerm } },
        { bmm_status: { contains: searchTerm } },
        { bmm_movement_type: { contains: searchTerm } },
        { createdby: { contains: searchTerm } }
      ];
    }
    const records = await prisma$1.budget_movement_master.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      orderBy: {
        bmm_budget_movement_id: "desc"
      }
    });
    const detlRecords = records.length > 0 ? await prisma$1.budget_movement_detl.findMany({
      where: {
        bmm_budget_movement_id: { in: records.map((r) => r.bmm_budget_movement_id) },
        sbg_budget_id_from: { not: null }
      }
    }) : [];
    const sbgIds = detlRecords.map((d) => d.sbg_budget_id_from).filter(Boolean);
    const structureBudgets = sbgIds.length > 0 ? await prisma$1.structure_budget.findMany({
      where: { sbg_budget_id: { in: sbgIds } }
    }) : [];
    const sbMap = new Map(structureBudgets.map((sb) => [sb.sbg_budget_id, sb]));
    const detlMap = new Map(detlRecords.map((d) => [d.bmm_budget_movement_id, d]));
    const formattedData = records.map((item, index) => {
      const date = item.updateddate || item.createddate;
      const dateStr = date ? new Date(date).toLocaleDateString("en-GB") : "";
      const createdDateStr = item.createddate ? new Date(item.createddate).toLocaleDateString("en-GB") : "";
      const detl = detlMap.get(item.bmm_budget_movement_id);
      const sb = detl ? sbMap.get(detl.sbg_budget_id_from) : null;
      const duration = "";
      return {
        bmm_year: item.bmm_year || "",
        createdby: item.createdby || "",
        createddate: createdDateStr,
        bmm_budget_movement_no: item.bmm_budget_movement_no || "",
        oun_code: (sb == null ? void 0 : sb.oun_code) || "",
        bmm_endorse_doc: item.bmm_endorse_doc || "",
        bmm_movement_type: item.bmm_movement_type || "",
        bmm_total_amt: item.bmm_total_amt ? parseFloat(item.bmm_total_amt.toString()) : 0,
        bmm_status: item.bmm_status || "",
        updatedby: item.updatedby || "",
        date: dateStr || "not approve yet",
        duration,
        bmm_budget_movement_id: item.bmm_budget_movement_id
        // Note: urlView and urlEdit are handled in frontend via sessionStorage, not URL parameters
      };
    });
    return {
      statusCode: 200,
      message: "Budget virement records fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching budget virement records:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching budget virement records",
      error: error.message
    };
  }
});

const index_get$1V = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1U
});

const dbFilePath$3 = path.join(process.cwd(), "assets", "json", "component_editor.json");
const ensureDatabaseFile$3 = () => {
  if (!fs.existsSync(path.dirname(dbFilePath$3))) {
    fs.mkdirSync(path.dirname(dbFilePath$3), { recursive: true });
  }
  if (!fs.existsSync(dbFilePath$3)) {
    fs.writeFileSync(dbFilePath$3, "[]", "utf8");
  }
};
const readComponents = () => {
  ensureDatabaseFile$3();
  const raw = fs.readFileSync(dbFilePath$3, "utf8") || "[]";
  const components = JSON.parse(raw);
  return components.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0
  }));
};
const writeComponents = (data) => {
  ensureDatabaseFile$3();
  const normalizedData = data.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0
  }));
  fs.writeFileSync(dbFilePath$3, JSON.stringify(normalizedData, null, 2), "utf8");
};
const getNextComponentId = () => {
  const components = readComponents();
  if (components.length === 0) {
    return 1;
  }
  const maxId = Math.max(...components.map((item) => parseInt(item.id) || 0));
  return maxId + 1;
};
const buildResponseData$3 = (components) => components.map((item, index) => {
  const response = {
    no: index + 1,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    // pageId, queryMapping, and componentData are excluded from response to hide them from the table
    title: item.title || "",
    name: item.name || "",
    cssClass: item.cssClass || "",
    type: item.type || "custom",
    collapseEnable: item.collapseEnable || 0,
    collapseByDefault: item.collapseByDefault || 0,
    visible: item.visible !== void 0 ? item.visible : 1,
    active: item.active !== void 0 ? item.active : 1,
    order: item.order || 1,
    action: ""
  };
  return response;
});

const helpers$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  buildResponseData: buildResponseData$3,
  getNextComponentId: getNextComponentId,
  readComponents: readComponents,
  writeComponents: writeComponents
});

const _id__delete$g = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const components = readComponents();
    const componentIndex = components.findIndex((c) => parseInt(c.id) === id);
    if (componentIndex === -1) {
      return {
        statusCode: 404,
        message: "Component not found"
      };
    }
    components.splice(componentIndex, 1);
    writeComponents(components);
    return {
      statusCode: 200,
      message: "Component deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting component:", error);
    return {
      statusCode: 500,
      message: "Failed to delete component",
      error: error.message
    };
  }
});

const _id__delete$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$g
});

const _id__put$k = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    if (!body.title || !body.name || body.active === null || body.active === void 0) {
      return {
        statusCode: 400,
        message: "Title, Name, and Active are required fields"
      };
    }
    const components = readComponents();
    const componentIndex = components.findIndex((c) => parseInt(c.id) === id);
    if (componentIndex === -1) {
      return {
        statusCode: 404,
        message: "Component not found"
      };
    }
    const duplicateName = components.find(
      (c) => c.name === body.name && parseInt(c.pageId) === parseInt(body.pageId) && parseInt(c.id) !== id
    );
    if (duplicateName) {
      return {
        statusCode: 400,
        message: "Component with this name already exists for this page"
      };
    }
    const userId = ((_a = event.context.user) == null ? void 0 : _a.id) || event.context.userId || "system";
    const updatedComponent = {
      ...components[componentIndex],
      title: body.title,
      name: body.name,
      cssClass: body.cssClass || "",
      type: body.type || "custom",
      collapseEnable: body.collapseEnable || 0,
      collapseByDefault: body.collapseByDefault || 0,
      visible: body.visible !== void 0 ? body.visible : 1,
      active: body.active !== void 0 ? body.active : 1,
      order: body.order || 1,
      queryMapping: body.queryMapping || "",
      componentData: body.componentData || "",
      updateTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      updatedBy: userId
    };
    components[componentIndex] = updatedComponent;
    writeComponents(components);
    return {
      statusCode: 200,
      message: "Component updated successfully",
      data: updatedComponent
    };
  } catch (error) {
    console.error("Error updating component:", error);
    return {
      statusCode: 500,
      message: "Failed to update component",
      error: error.message
    };
  }
});

const _id__put$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$k
});

const dbFilePath$2 = path.join(process.cwd(), "assets", "json", "page_editor.json");
const ensureDatabaseFile$2 = () => {
  if (!fs.existsSync(path.dirname(dbFilePath$2))) {
    fs.mkdirSync(path.dirname(dbFilePath$2), { recursive: true });
  }
  if (!fs.existsSync(dbFilePath$2)) {
    fs.writeFileSync(dbFilePath$2, "[]", "utf8");
  }
};
const readPages$1 = () => {
  ensureDatabaseFile$2();
  const raw = fs.readFileSync(dbFilePath$2, "utf8") || "[]";
  const pages = JSON.parse(raw);
  return pages.map((item) => ({
    ...item,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0
  }));
};
const writePages$1 = (data) => {
  ensureDatabaseFile$2();
  const normalizedData = data.map((item) => ({
    ...item,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0
  }));
  fs.writeFileSync(dbFilePath$2, JSON.stringify(normalizedData, null, 2), "utf8");
};
const getNextPageId$1 = () => {
  const pages = readPages$1();
  if (pages.length === 0) {
    return 1;
  }
  const maxId = Math.max(...pages.map((item) => parseInt(item.pageId) || 0));
  return maxId + 1;
};
const buildResponseData$2 = (pages) => pages.map((item, index) => ({
  no: index + 1,
  pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
  pageTitle: item.pageTitle || "",
  menu: item.menu || "",
  status: item.status || "ACTIVE",
  createdTimestamp: item.createdTimestamp || "",
  updateTimestamp: item.updateTimestamp || "",
  action: ""
}));

const helpers$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  buildResponseData: buildResponseData$2,
  getNextPageId: getNextPageId$1,
  readPages: readPages$1,
  writePages: writePages$1
});

const availablePages_get = defineEventHandler(async (event) => {
  try {
    const pages = readPages$1();
    const pagesWithMenus = pages.filter((p) => p.menu && p.menu.trim() !== "");
    const pageOptions = pagesWithMenus.map((page) => ({
      pageId: typeof page.pageId === "number" ? page.pageId : parseInt(page.pageId) || 0,
      pageTitle: page.pageTitle || "",
      menu: page.menu || ""
    }));
    return {
      statusCode: 200,
      message: "Available pages fetched successfully",
      data: pageOptions
    };
  } catch (error) {
    console.error("Error fetching available pages:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch available pages",
      error: error.message
    };
  }
});

const availablePages_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: availablePages_get
});

function extractSQL(blContent) {
  if (!blContent) {
    return "";
  }
  if (typeof blContent !== "string") {
    if (typeof blContent === "object") {
      blContent = JSON.stringify(blContent);
    } else {
      blContent = String(blContent);
    }
  }
  if (blContent.trim() === "") {
    return "";
  }
  try {
    let extractVariable = function(content, varName) {
      if (!content)
        return "";
      const simplePatterns = [
        // Double quotes with semicolon
        new RegExp(`\\$${varName}\\s*=\\s*"([^"]*)"\\s*;`, "i"),
        // Single quotes with semicolon  
        new RegExp(`\\$${varName}\\s*=\\s*'([^']*)'\\s*;`, "i"),
        // Double quotes without semicolon
        new RegExp(`\\$${varName}\\s*=\\s*"([^"]*)"`, "i"),
        // Single quotes without semicolon
        new RegExp(`\\$${varName}\\s*=\\s*'([^']*)'`, "i")
      ];
      for (const pattern of simplePatterns) {
        const match = content.match(pattern);
        if (match && match[1] && match[1].trim()) {
          return match[1];
        }
      }
      const multilinePatterns = [
        new RegExp(`\\$${varName}\\s*=\\s*"([\\s\\S]*?)"\\s*;`, "i"),
        new RegExp(`\\$${varName}\\s*=\\s*'([\\s\\S]*?)'\\s*;`, "i"),
        new RegExp(`\\$${varName}\\s*=\\s*"([\\s\\S]*?)"`, "i"),
        new RegExp(`\\$${varName}\\s*=\\s*'([\\s\\S]*?)'`, "i")
      ];
      for (const pattern of multilinePatterns) {
        const match = content.match(pattern);
        if (match && match[1] && match[1].trim()) {
          const extracted = match[1].trim();
          if (varName === "sql" && extracted.toUpperCase().includes("SELECT")) {
            return extracted;
          }
          if (varName === "common" && extracted.toUpperCase().includes("FROM")) {
            return extracted;
          }
          if (varName === "filter" && (extracted.includes("WHERE") || extracted.includes("AND") || extracted.includes("OR"))) {
            return extracted;
          }
          if (extracted.length > 0) {
            return extracted;
          }
        }
      }
      return "";
    };
    let sql = extractVariable(blContent, "sql");
    let common = extractVariable(blContent, "common");
    let filter = extractVariable(blContent, "filter");
    if (blContent && blContent.length > 0 && !sql && !common && !filter) {
      console.log("BL content found but no variables extracted. BL length:", blContent.length);
      console.log("BL preview:", blContent.substring(0, 500));
    }
    const countPattern = /^\s*SELECT\s+COUNT\s*\([^)]*\)\s+C\s+FROM/gi;
    if (countPattern.test(sql.trim())) {
      return "";
    }
    if (!sql || sql.trim() === "") {
      return "";
    }
    if (common && filter) {
      common = common.replace(/\$filter/g, filter);
    }
    if (common && common.includes("$smartFilter")) {
      common = common.replace(/\$smartFilter/g, "");
    }
    if (sql && common) {
      const trimmedCommon = common.trim();
      sql = sql.replace(/\$common/g, " " + trimmedCommon + " ");
    }
    if (sql && filter) {
      const trimmedFilter = filter.trim();
      sql = sql.replace(/\$filter/g, " " + trimmedFilter + " ");
    }
    let combinedSQL = sql.trim();
    combinedSQL = combinedSQL.replace(/ORDER\s+BY\s+[^\n;]+/gi, "");
    combinedSQL = combinedSQL.replace(/LIMIT\s+[^\n;]+/gi, "");
    combinedSQL = combinedSQL.replace(/\.DB2\./g, "");
    combinedSQL = combinedSQL.replace(/\s*\.\s*DB2\s*\.\s*/g, "");
    combinedSQL = combinedSQL.replace(/DB2\./g, "");
    combinedSQL = combinedSQL.replace(/\$_POST\[['"][^'"]+['"]\]/g, "");
    combinedSQL = combinedSQL.replace(/\{?\$_POST\[['"][^'"]+['"]\]\}?/g, "");
    combinedSQL = combinedSQL.replace(/\.\$_POST\[['"][^'"]+['"]\]\./g, "");
    combinedSQL = combinedSQL.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n\s*\n\s*\n+/g, "\n\n").replace(/^\s+|\s+$/gm, "");
    combinedSQL = combinedSQL.replace(/[ \t]+/g, " ").replace(/\n /g, "\n").replace(/ \n/g, "\n").trim();
    return combinedSQL;
  } catch (error) {
    console.error("Error extracting SQL:", error);
    return "";
  }
}
const import_post$4 = defineEventHandler(async (event) => {
  var _a;
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    const body = await readBody(event);
    const selectedFiles = (body == null ? void 0 : body.files) || [];
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`
      };
    }
    let files = [];
    if (selectedFiles.length === 0) {
      files = fs.readdirSync(migrationFolder).filter(
        (file) => file.toLowerCase().endsWith(".json")
      );
    } else {
      files = selectedFiles.filter(
        (file) => file.toLowerCase().endsWith(".json") && fs.existsSync(path.join(migrationFolder, file))
      );
    }
    if (files.length === 0) {
      return {
        statusCode: 404,
        message: "No JSON files found to import",
        error: selectedFiles.length > 0 ? "Selected files not found or invalid" : `No .json files found in ${migrationFolder}`
      };
    }
    const existingComponents = readComponents();
    const existingPageIds = new Set(
      readPages$1().map((p) => parseInt(p.pageId) || 0)
    );
    const existingComponentIds = new Set(
      existingComponents.map((c) => parseInt(c.id) || 0)
    );
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    const nextComponentId = getNextComponentId();
    let currentComponentId = nextComponentId;
    const userId = ((_a = event.context.user) == null ? void 0 : _a.id) || event.context.userId || "system";
    for (const file of files) {
      try {
        const filePath = path.join(migrationFolder, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        let jsonData;
        try {
          jsonData = JSON.parse(fileContent);
        } catch (parseError) {
          errors.push(`File ${file}: Invalid JSON format - ${parseError.message}`);
          errorCount++;
          continue;
        }
        const componentsToImport = Array.isArray(jsonData) ? jsonData : [jsonData];
        for (const componentData of componentsToImport) {
          if (!componentData.Name || !componentData.Name.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Name`);
            skippedCount++;
            continue;
          }
          if (!componentData.Title || !componentData.Title.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Title`);
            skippedCount++;
            continue;
          }
          const pageId = componentData.pageId ? parseInt(componentData.pageId) : null;
          if (!pageId || !existingPageIds.has(pageId)) {
            errors.push(
              `File ${file}, Component "${componentData.Name}": Page ID ${pageId} does not exist, skipping`
            );
            skippedCount++;
            continue;
          }
          const name = componentData.Name.toString().trim();
          const title = componentData.Title.toString().trim();
          const duplicateComponent = existingComponents.find(
            (c) => c.name === name && parseInt(c.pageId) === pageId
          );
          if (duplicateComponent) {
            errors.push(
              `File ${file}, Component "${name}": Component with this name already exists for page ${pageId}, skipping`
            );
            skippedCount++;
            continue;
          }
          let blContent = "";
          if (componentData.BL !== void 0 && componentData.BL !== null) {
            if (typeof componentData.BL === "string") {
              blContent = componentData.BL;
            } else if (typeof componentData.BL === "object") {
              blContent = JSON.stringify(componentData.BL);
            } else {
              blContent = String(componentData.BL);
            }
          }
          const queryMapping = extractSQL(blContent);
          let componentDataField = "";
          if (componentData.componentData !== void 0 && componentData.componentData !== null) {
            if (typeof componentData.componentData === "object") {
              componentDataField = JSON.stringify(componentData.componentData);
            } else {
              componentDataField = componentData.componentData.toString();
            }
          }
          let componentId;
          if (componentData.ID !== void 0 && componentData.ID !== null) {
            const providedId = parseInt(componentData.ID);
            if (providedId > 0 && !existingComponentIds.has(providedId)) {
              componentId = providedId;
              existingComponentIds.add(componentId);
            } else {
              componentId = currentComponentId++;
              existingComponentIds.add(componentId);
            }
          } else {
            componentId = currentComponentId++;
            existingComponentIds.add(componentId);
          }
          const newComponent = {
            id: componentId,
            pageId,
            title,
            name,
            cssClass: (componentData["CSS Class"] || "").toString().trim(),
            type: (componentData.Type || "custom").toString().trim(),
            collapseEnable: componentData["Collapse Enable"] === 1 || componentData["Collapse Enable"] === true ? 1 : 0,
            collapseByDefault: componentData["Collapse By Default"] === 1 || componentData["Collapse By Default"] === true ? 1 : 0,
            visible: componentData.Visible !== void 0 ? componentData.Visible === 1 || componentData.Visible === true ? 1 : 0 : 1,
            active: componentData.Status === 1 || componentData.Status === true ? 1 : 0,
            order: componentData.Order ? parseInt(componentData.Order) || 1 : 1,
            queryMapping,
            componentData: componentDataField,
            createdTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
            createdBy: userId,
            updateTimestamp: null,
            updatedBy: null
          };
          existingComponents.push(newComponent);
          importedCount++;
        }
      } catch (fileError) {
        errors.push(`File ${file}: ${fileError.message}`);
        errorCount++;
      }
    }
    if (importedCount > 0) {
      writeComponents(existingComponents);
    }
    return {
      statusCode: 200,
      message: `Import completed: ${importedCount} components imported, ${skippedCount} skipped, ${errorCount} files with errors`,
      data: {
        imported: importedCount,
        skipped: skippedCount,
        errors: errorCount,
        totalFiles: files.length,
        errorsList: errors
      }
    };
  } catch (error) {
    console.error("Error importing components:", error);
    return {
      statusCode: 500,
      message: "Failed to import components",
      error: error.message
    };
  }
});

const import_post$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: import_post$4
});

const index_get$1S = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const pageId = query.pageId ? parseInt(query.pageId) : null;
    const id = query.id ? parseInt(query.id) : null;
    const components = readComponents();
    if (id) {
      const component = components.find((c) => parseInt(c.id) === id);
      if (!component) {
        return {
          statusCode: 404,
          message: "Component not found"
        };
      }
      return {
        statusCode: 200,
        message: "Component fetched successfully",
        data: component
      };
    }
    let filteredComponents = components;
    if (pageId) {
      filteredComponents = components.filter((c) => parseInt(c.pageId) === pageId);
    }
    const raw = query.raw === "true" || query.raw === true;
    if (raw) {
      return {
        statusCode: 200,
        message: "Components fetched successfully",
        data: filteredComponents
      };
    }
    const responseData = buildResponseData$3(filteredComponents);
    return {
      statusCode: 200,
      message: "Components fetched successfully",
      data: responseData
    };
  } catch (error) {
    console.error("Error fetching components:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch components",
      error: error.message
    };
  }
});

const index_get$1T = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1S
});

const index_post$y = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!body.title || !body.name || body.active === null || body.active === void 0) {
      return {
        statusCode: 400,
        message: "Title, Name, and Active are required fields"
      };
    }
    if (!body.pageId) {
      return {
        statusCode: 400,
        message: "Page ID is required"
      };
    }
    const components = readComponents();
    const duplicateName = components.find(
      (c) => c.name === body.name && parseInt(c.pageId) === parseInt(body.pageId)
    );
    if (duplicateName) {
      return {
        statusCode: 400,
        message: "Component with this name already exists for this page"
      };
    }
    const userId = ((_a = event.context.user) == null ? void 0 : _a.id) || event.context.userId || "system";
    const newComponent = {
      id: getNextComponentId(),
      pageId: parseInt(body.pageId),
      title: body.title,
      name: body.name,
      cssClass: body.cssClass || "",
      type: body.type || "custom",
      collapseEnable: body.collapseEnable || 0,
      collapseByDefault: body.collapseByDefault || 0,
      visible: body.visible !== void 0 ? body.visible : 1,
      active: body.active !== void 0 ? body.active : 1,
      order: body.order || 1,
      queryMapping: body.queryMapping || "",
      componentData: body.componentData || "",
      createdTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      createdBy: userId,
      updateTimestamp: null,
      updatedBy: null
    };
    components.push(newComponent);
    writeComponents(components);
    return {
      statusCode: 200,
      message: "Component created successfully",
      data: newComponent
    };
  } catch (error) {
    console.error("Error creating component:", error);
    return {
      statusCode: 500,
      message: "Failed to create component",
      error: error.message
    };
  }
});

const index_post$z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$y
});

const migrationFiles_get$4 = defineEventHandler(async (event) => {
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`,
        data: []
      };
    }
    const files = fs.readdirSync(migrationFolder).filter((file) => file.toLowerCase().endsWith(".json")).map((file) => {
      const filePath = path.join(migrationFolder, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    return {
      statusCode: 200,
      message: "Migration files fetched successfully",
      data: files
    };
  } catch (error) {
    console.error("Error fetching migration files:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch migration files",
      error: error.message,
      data: []
    };
  }
});

const migrationFiles_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: migrationFiles_get$4
});

const dbFilePath$1 = path.join(process.cwd(), "assets", "json", "componentItem_editor.json");
const ensureDatabaseFile$1 = () => {
  if (!fs.existsSync(path.dirname(dbFilePath$1))) {
    fs.mkdirSync(path.dirname(dbFilePath$1), { recursive: true });
  }
  if (!fs.existsSync(dbFilePath$1)) {
    fs.writeFileSync(dbFilePath$1, "[]", "utf8");
  }
};
const readComponentItems = () => {
  ensureDatabaseFile$1();
  const raw = fs.readFileSync(dbFilePath$1, "utf8") || "[]";
  const componentItems = JSON.parse(raw);
  return componentItems.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
    componentId: typeof item.componentId === "number" ? item.componentId : parseInt(item.componentId) || 0,
    order: typeof item.order === "number" ? item.order : parseInt(item.order) || 1
  }));
};
const writeComponentItems = (data) => {
  ensureDatabaseFile$1();
  const normalizedData = data.map((item) => ({
    ...item,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
    componentId: typeof item.componentId === "number" ? item.componentId : parseInt(item.componentId) || 0,
    order: typeof item.order === "number" ? item.order : parseInt(item.order) || 1
  }));
  fs.writeFileSync(dbFilePath$1, JSON.stringify(normalizedData, null, 2), "utf8");
};
const getNextComponentItemId = () => {
  const componentItems = readComponentItems();
  if (componentItems.length === 0) {
    return 1;
  }
  const maxId = Math.max(...componentItems.map((item) => parseInt(item.id) || 0));
  return maxId + 1;
};
const buildResponseData$1 = (componentItems) => componentItems.map((item, index) => {
  const response = {
    no: index + 1,
    id: typeof item.id === "number" ? item.id : parseInt(item.id) || 0,
    name: item.name || "",
    title: item.title || "",
    component: item.component || "",
    componentId: typeof item.componentId === "number" ? item.componentId : parseInt(item.componentId) || 0,
    type: item.type || "",
    visible: item.visible !== void 0 ? item.visible : 0,
    active: item.active !== void 0 ? item.active : 0,
    order: item.order || 1,
    action: ""
  };
  return response;
});

const helpers$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  buildResponseData: buildResponseData$1,
  getNextComponentItemId: getNextComponentItemId,
  readComponentItems: readComponentItems,
  writeComponentItems: writeComponentItems
});

const _id__delete$e = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const componentItems = readComponentItems();
    const componentItemIndex = componentItems.findIndex((c) => parseInt(c.id) === id);
    if (componentItemIndex === -1) {
      return {
        statusCode: 404,
        message: "Component Item not found"
      };
    }
    componentItems.splice(componentItemIndex, 1);
    writeComponentItems(componentItems);
    return {
      statusCode: 200,
      message: "Component Item deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting component item:", error);
    return {
      statusCode: 500,
      message: "Failed to delete component item",
      error: error.message
    };
  }
});

const _id__delete$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$e
});

const _id__put$i = defineEventHandler(async (event) => {
  var _a;
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    if (!body.title || !body.name || body.active === null || body.active === void 0) {
      return {
        statusCode: 400,
        message: "Title, Name, and Active are required fields"
      };
    }
    const componentItems = readComponentItems();
    const componentItemIndex = componentItems.findIndex((c) => parseInt(c.id) === id);
    if (componentItemIndex === -1) {
      return {
        statusCode: 404,
        message: "Component Item not found"
      };
    }
    const userId = ((_a = event.context.user) == null ? void 0 : _a.id) || event.context.userId || "system";
    const updatedComponentItem = {
      ...componentItems[componentItemIndex],
      name: body.name,
      title: body.title,
      component: body.component || "",
      componentId: body.componentId ? parseInt(body.componentId) : componentItems[componentItemIndex].componentId,
      type: body.type || "",
      cssClass: body.cssClass || "",
      additionalAttribute: body.additionalAttribute || "",
      defaultValue: body.defaultValue || "",
      lookup_queryMapping: body.lookup_queryMapping || "",
      visible: body.visible !== void 0 ? body.visible : 0,
      active: body.active !== void 0 ? body.active : 0,
      order: body.order || 1,
      updateTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      updatedBy: userId
    };
    componentItems[componentItemIndex] = updatedComponentItem;
    writeComponentItems(componentItems);
    return {
      statusCode: 200,
      message: "Component Item updated successfully",
      data: updatedComponentItem
    };
  } catch (error) {
    console.error("Error updating component item:", error);
    return {
      statusCode: 500,
      message: "Failed to update component item",
      error: error.message
    };
  }
});

const _id__put$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$i
});

const import_post$2 = defineEventHandler(async (event) => {
  var _a;
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    const body = await readBody(event);
    const selectedFiles = (body == null ? void 0 : body.files) || [];
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`
      };
    }
    let files = [];
    if (selectedFiles.length === 0) {
      files = fs.readdirSync(migrationFolder).filter(
        (file) => file.toLowerCase().endsWith(".json")
      );
    } else {
      files = selectedFiles.filter(
        (file) => file.toLowerCase().endsWith(".json") && fs.existsSync(path.join(migrationFolder, file))
      );
    }
    if (files.length === 0) {
      return {
        statusCode: 404,
        message: "No JSON files found to import",
        error: selectedFiles.length > 0 ? "Selected files not found or invalid" : `No .json files found in ${migrationFolder}`
      };
    }
    const existingComponentItems = readComponentItems();
    const existingPages = readPages$1();
    const existingPageIds = new Set(
      existingPages.map((p) => parseInt(p.pageId) || 0)
    );
    const existingComponents = readComponents();
    const existingComponentIds = new Set(
      existingComponents.map((c) => parseInt(c.id) || 0)
    );
    const existingComponentItemIds = new Set(
      existingComponentItems.map((ci) => parseInt(ci.id) || 0)
    );
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    const nextComponentItemId = getNextComponentItemId();
    let currentComponentItemId = nextComponentItemId;
    const userId = ((_a = event.context.user) == null ? void 0 : _a.id) || event.context.userId || "system";
    for (const file of files) {
      try {
        const filePath = path.join(migrationFolder, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        let jsonData;
        try {
          jsonData = JSON.parse(fileContent);
        } catch (parseError) {
          errors.push(`File ${file}: Invalid JSON format - ${parseError.message}`);
          errorCount++;
          continue;
        }
        const componentItemsToImport = Array.isArray(jsonData) ? jsonData : [jsonData];
        for (const itemData of componentItemsToImport) {
          if (!itemData.Name || !itemData.Name.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Name`);
            skippedCount++;
            continue;
          }
          if (!itemData.Title || !itemData.Title.toString().trim()) {
            errors.push(`File ${file}: Missing or empty Title`);
            skippedCount++;
            continue;
          }
          const pageId = itemData.pageId ? parseInt(itemData.pageId) : itemData.PageId ? parseInt(itemData.PageId) : null;
          if (!pageId || !existingPageIds.has(pageId)) {
            errors.push(
              `File ${file}, Component Item "${itemData.Name}": Page ID ${pageId} does not exist, skipping`
            );
            skippedCount++;
            continue;
          }
          const componentId = itemData.componentId ? parseInt(itemData.componentId) : itemData.ComponentId ? parseInt(itemData.ComponentId) : null;
          if (!componentId || !existingComponentIds.has(componentId)) {
            errors.push(
              `File ${file}, Component Item "${itemData.Name}": Component ID ${componentId} does not exist, skipping`
            );
            skippedCount++;
            continue;
          }
          const component = existingComponents.find((c) => parseInt(c.id) === componentId);
          const componentName = component ? component.name : "";
          const name = itemData.Name.toString().trim();
          const title = itemData.Title.toString().trim();
          const duplicateComponentItem = existingComponentItems.find(
            (ci) => ci.name === name && parseInt(ci.componentId) === componentId
          );
          if (duplicateComponentItem) {
            errors.push(
              `File ${file}, Component Item "${name}": Component Item with this name already exists for component ${componentId}, skipping`
            );
            skippedCount++;
            continue;
          }
          let componentItemId;
          if (itemData.ID !== void 0 && itemData.ID !== null) {
            const providedId = parseInt(itemData.ID);
            if (providedId > 0 && !existingComponentItemIds.has(providedId)) {
              componentItemId = providedId;
              existingComponentItemIds.add(componentItemId);
            } else {
              componentItemId = currentComponentItemId++;
              existingComponentItemIds.add(componentItemId);
            }
          } else {
            componentItemId = currentComponentItemId++;
            existingComponentItemIds.add(componentItemId);
          }
          const newComponentItem = {
            id: componentItemId,
            pageId,
            componentId,
            name,
            title,
            component: componentName,
            type: (itemData.Type || "").toString().trim(),
            cssClass: (itemData["CSS Class"] || itemData.cssClass || "").toString().trim(),
            additionalAttribute: (itemData["Additional Attribute"] || itemData.additionalAttribute || "").toString().trim(),
            defaultValue: (itemData["Default Value"] || itemData.defaultValue || "").toString().trim(),
            lookup_queryMapping: (itemData["lookup_queryMapping"] || itemData.lookup_queryMapping || "").toString().trim(),
            visible: itemData.Visible !== void 0 ? itemData.Visible === 1 || itemData.Visible === true ? 1 : 0 : 1,
            active: itemData.Status !== void 0 ? itemData.Status === 1 || itemData.Status === true ? 1 : 0 : itemData.Active !== void 0 ? itemData.Active === 1 || itemData.Active === true ? 1 : 0 : 1,
            order: itemData.Order ? parseInt(itemData.Order) || 1 : 1,
            createdTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
            createdBy: userId,
            updateTimestamp: null,
            updatedBy: null
          };
          existingComponentItems.push(newComponentItem);
          importedCount++;
        }
      } catch (fileError) {
        errors.push(`File ${file}: ${fileError.message}`);
        errorCount++;
      }
    }
    if (importedCount > 0) {
      writeComponentItems(existingComponentItems);
    }
    return {
      statusCode: 200,
      message: `Import completed: ${importedCount} component items imported, ${skippedCount} skipped, ${errorCount} files with errors`,
      data: {
        imported: importedCount,
        skipped: skippedCount,
        errors: errorCount,
        totalFiles: files.length,
        errorsList: errors
      }
    };
  } catch (error) {
    console.error("Error importing component items:", error);
    return {
      statusCode: 500,
      message: "Failed to import component items",
      error: error.message
    };
  }
});

const import_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: import_post$2
});

const index_get$1Q = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const pageId = query.pageId ? parseInt(query.pageId) : null;
    const componentId = query.componentId ? parseInt(query.componentId) : null;
    const id = query.id ? parseInt(query.id) : null;
    const componentItems = readComponentItems();
    if (id) {
      const componentItem = componentItems.find((c) => parseInt(c.id) === id);
      if (!componentItem) {
        return {
          statusCode: 404,
          message: "Component Item not found"
        };
      }
      return {
        statusCode: 200,
        message: "Component Item fetched successfully",
        data: componentItem
      };
    }
    let filteredComponentItems = componentItems;
    if (pageId) {
      filteredComponentItems = filteredComponentItems.filter((c) => parseInt(c.pageId) === pageId);
    }
    if (componentId) {
      filteredComponentItems = filteredComponentItems.filter((c) => parseInt(c.componentId) === componentId);
    }
    const responseData = buildResponseData$1(filteredComponentItems);
    return {
      statusCode: 200,
      message: "Component Items fetched successfully",
      data: responseData
    };
  } catch (error) {
    console.error("Error fetching component items:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch component items",
      error: error.message
    };
  }
});

const index_get$1R = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1Q
});

const index_post$w = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!body.title || !body.name || body.active === null || body.active === void 0) {
      return {
        statusCode: 400,
        message: "Title, Name, and Active are required fields"
      };
    }
    if (!body.pageId) {
      return {
        statusCode: 400,
        message: "Page ID is required"
      };
    }
    if (!body.componentId) {
      return {
        statusCode: 400,
        message: "Component ID is required"
      };
    }
    const componentItems = readComponentItems();
    const userId = ((_a = event.context.user) == null ? void 0 : _a.id) || event.context.userId || "system";
    const newComponentItem = {
      id: getNextComponentItemId(),
      pageId: parseInt(body.pageId),
      componentId: parseInt(body.componentId),
      name: body.name,
      title: body.title,
      component: body.component || "",
      type: body.type || "",
      cssClass: body.cssClass || "",
      additionalAttribute: body.additionalAttribute || "",
      defaultValue: body.defaultValue || "",
      lookup_queryMapping: body.lookup_queryMapping || "",
      visible: body.visible !== void 0 ? body.visible : 0,
      active: body.active !== void 0 ? body.active : 0,
      order: body.order || 1,
      createdTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      createdBy: userId,
      updateTimestamp: null,
      updatedBy: null
    };
    componentItems.push(newComponentItem);
    writeComponentItems(componentItems);
    return {
      statusCode: 200,
      message: "Component Item created successfully",
      data: newComponentItem
    };
  } catch (error) {
    console.error("Error creating component item:", error);
    return {
      statusCode: 500,
      message: "Failed to create component item",
      error: error.message
    };
  }
});

const index_post$x = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$w
});

const migrationFiles_get$2 = defineEventHandler(async (event) => {
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`,
        data: []
      };
    }
    const files = fs.readdirSync(migrationFolder).filter((file) => file.toLowerCase().endsWith(".json")).map((file) => {
      const filePath = path.join(migrationFolder, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    return {
      statusCode: 200,
      message: "Migration files fetched successfully",
      data: files
    };
  } catch (error) {
    console.error("Error fetching migration files:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch migration files",
      error: error.message,
      data: []
    };
  }
});

const migrationFiles_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: migrationFiles_get$2
});

const fileCode$4 = defineEventHandler(async (event) => {
  const query = await getQuery$1(event);
  try {
    const filePath = path.join(process.cwd() + "/server/", query.path + ".js");
    const code = fs.readFileSync(filePath, "utf8");
    return {
      statusCode: 200,
      message: "Code successfully loaded",
      data: code
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "File not found"
    };
  }
});

const fileCode$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: fileCode$4
});

const linter$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    if (body.code === void 0) {
      return {
        statusCode: 400,
        message: "Bad Request"
      };
    }
    const code = body.code;
    const validateNitroCode = (code2) => {
      const isServerRoute = code2.includes("defineEventHandler");
      if (isServerRoute) {
        let lineNumber = 1;
        if (!code2.includes("export default defineEventHandler")) {
          throw {
            message: "Nitro route handlers must use 'export default defineEventHandler'",
            line: 1,
            column: 0
          };
        }
        const hasRequestBody = code2.includes("await readBody(event)");
        const hasRequestQuery = code2.includes("getQuery(event)");
        const usesEventWithoutImport = code2.includes("event.") && !hasRequestBody && !hasRequestQuery;
        if (usesEventWithoutImport) {
          const lines = code2.split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("event.") && !lines[i].includes("readBody") && !lines[i].includes("getQuery")) {
              throw {
                message: "Use 'readBody(event)' for POST data or 'getQuery(event)' for query parameters",
                line: i + 1,
                column: lines[i].indexOf("event.")
              };
            }
          }
        }
        const responseRegex = /return\s+{([^}]+)}/g;
        let match;
        let lastIndex = 0;
        while ((match = responseRegex.exec(code2)) !== null) {
          lineNumber += (code2.slice(lastIndex, match.index).match(/\n/g) || []).length;
          lastIndex = match.index;
          const responseContent = match[1];
          if (!responseContent.includes("statusCode")) {
            throw {
              message: "API responses must include a 'statusCode' property",
              line: lineNumber,
              column: match.index - code2.lastIndexOf("\n", match.index)
            };
          }
          const statusMatch = responseContent.match(/statusCode:\s*(\d+)/);
          if (statusMatch) {
            const statusCode = parseInt(statusMatch[1]);
            if (![200, 201, 400, 401, 403, 404, 500].includes(statusCode)) {
              throw {
                message: `Invalid status code: ${statusCode}. Use standard HTTP status codes.`,
                line: lineNumber,
                column: statusMatch.index
              };
            }
          }
        }
        if (code2.includes("try") && !code2.includes("catch")) {
          throw {
            message: "Missing error handling. Add a catch block for try statements.",
            line: code2.split("\n").findIndex((line) => line.includes("try")) + 1,
            column: 0
          };
        }
        const asyncLines = code2.match(/async.*=>/g) || [];
        const awaitLines = code2.match(/await\s+/g) || [];
        if (awaitLines.length > 0 && asyncLines.length === 0) {
          throw {
            message: "Using 'await' requires an async function",
            line: code2.split("\n").findIndex((line) => line.includes("await")) + 1,
            column: 0
          };
        }
      }
    };
    try {
      validateNitroCode(code);
      const eslint = new ESLint({
        overrideConfig: {
          parser: "@babel/eslint-parser",
          extends: ["@kiwicom"],
          parserOptions: {
            requireConfigFile: false,
            ecmaVersion: 2020,
            sourceType: "module"
          }
        },
        useEslintrc: false
      });
      const results = await eslint.lintText(code);
      if (results[0].messages.length > 0) {
        const messages = results[0].messages[0];
        if (messages.fatal === true) {
          return {
            statusCode: 400,
            message: "Bad Linter Test",
            data: messages
          };
        }
        return {
          statusCode: 200,
          message: "Good Linter test",
          data: messages
        };
      }
    } catch (error) {
      console.log(error);
      return {
        statusCode: 400,
        message: "Bad Linter Test",
        data: {
          message: error.message,
          line: error.line || 1,
          column: error.column || 0
        }
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
      errror: error
    };
  }
});

const linter$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: linter$2
});

const list$7 = defineEventHandler(async (event) => {
  try {
    const apiFolderPath = path.join(process.cwd() + "/server/api");
    const apis = fs.readdirSync(apiFolderPath);
    const apiList = getFilesAndFolders(apiFolderPath);
    const apiUrls = getApiUrls(apiList);
    const jsonObject = JSON.parse(JSON.stringify(apiUrls));
    return {
      statusCode: 200,
      message: "API List successfully fetched",
      data: jsonObject
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});
function getFilesAndFolders(folderPath) {
  const folderFiles = fs.readdirSync(folderPath);
  const files = [];
  const folders = [];
  const apiURL = "/api";
  folderFiles.forEach((file) => {
    const filePath = path.join(folderPath + "/" + file);
    if (file == "devtool")
      return;
    if (fs.lstatSync(filePath).isDirectory()) {
      folders.push(getFilesAndFolders(filePath));
    } else {
      const processPath = path.join(process.cwd() + "/server/api");
      const apiUrl = filePath.replace(processPath, apiURL).replace(/\\/g, "/").replace(".js", "");
      const fileName = file.replace(".js", "");
      const parentFolder = folderPath.replace(processPath, "").replace(/\\/g, "");
      files.push({
        name: fileName,
        parentName: parentFolder,
        url: apiUrl
      });
    }
  });
  return { files, folders };
}
function getApiUrls(folder) {
  const apiUrls = [];
  folder.files.forEach((file) => {
    apiUrls.push({
      name: file.name,
      parentName: file.parentName,
      url: file.url
    });
  });
  folder.folders.forEach((nestedFolder) => {
    apiUrls.push(...getApiUrls(nestedFolder));
  });
  return apiUrls;
}

const list$8 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list$7
});

const prettierFormat$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    if (body.code === void 0) {
      return {
        statusCode: 400,
        message: "Bad Request"
      };
    }
    const code = prettier.format(body.code, { semi: false, parser: "babel" });
    return {
      statusCode: 200,
      message: "Code successfully formatted",
      data: code
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});

const prettierFormat$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: prettierFormat$2
});

const save$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const codeDefault = `
    export default defineEventHandler(async (event) => {
      
      // const query = await getQuery(event); // Get Params from URL
      // const body = await readBody(event); // Get Body Data

      return {
        statusCode: 200,
        message: "API Route Created",
      };

    });`;
    const filePath = path.join(process.cwd() + "/server/", body.path + ".js");
    if (body.type == "update") {
      fs.writeFileSync(filePath, body.code, "utf8");
    } else if (body.type == "add") {
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      fs.writeFileSync(filePath, codeDefault, "utf8");
    } else if (body.type == "edit") {
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }
      const oldPath = path.join(
        process.cwd() + "/server/",
        body.oldPath + ".js"
      );
      fs.copyFileSync(oldPath, filePath);
      fs.unlinkSync(oldPath);
    } else if (body.type == "delete") {
      fs.unlinkSync(filePath);
      return {
        statusCode: 200,
        message: "Code successfully deleted"
      };
    }
    return {
      statusCode: 200,
      message: "Code successfully saved"
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});

const save$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: save$2
});

const addCustomTheme = defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (method !== "POST") {
    return {
      statusCode: 405,
      message: "Method not allowed"
    };
  }
  try {
    const body = await readBody(event);
    const { themeName, themeCSS } = body;
    if (!themeName || !themeCSS) {
      return {
        statusCode: 400,
        message: "Theme name and CSS are required"
      };
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(themeName)) {
      return {
        statusCode: 400,
        message: "Theme name can only contain letters, numbers, hyphens, and underscores"
      };
    }
    const themeCSSPath = path.join(process.cwd(), "assets", "style", "css", "base", "theme.css");
    if (!fs.existsSync(themeCSSPath)) {
      return {
        statusCode: 404,
        message: "theme.css file not found"
      };
    }
    let currentContent = fs.readFileSync(themeCSSPath, "utf8");
    const themePattern = new RegExp(`html\\[data-theme="${themeName}"\\]`, "g");
    if (themePattern.test(currentContent)) {
      return {
        statusCode: 409,
        message: `Theme "${themeName}" already exists`
      };
    }
    const formattedThemeCSS = themeCSS.trim();
    let finalThemeCSS;
    if (!formattedThemeCSS.includes(`html[data-theme="${themeName}"]`)) {
      finalThemeCSS = `html[data-theme="${themeName}"] {
${formattedThemeCSS}
}`;
    } else {
      finalThemeCSS = formattedThemeCSS;
    }
    const newContent = currentContent + "\n\n" + finalThemeCSS + "\n";
    fs.writeFileSync(themeCSSPath, newContent, "utf8");
    return {
      statusCode: 200,
      message: "Custom theme added successfully",
      data: {
        themeName,
        success: true
      }
    };
  } catch (error) {
    console.error("Add custom theme error:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const addCustomTheme$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: addCustomTheme
});

const env = defineEventHandler(async (event) => {
  const envFile = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envFile)) {
    return {
      statusCode: 404,
      message: "File not found"
    };
  }
  const env = fs.readFileSync(envFile, "utf-8");
  return {
    statusCode: 200,
    message: "Success",
    data: env
  };
});

const env$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: env
});

const loadingLogo = defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (!prisma$1) {
    console.error("Prisma client is not available - import may have failed");
    return {
      statusCode: 500,
      message: "Database connection not available"
    };
  }
  if (!prisma$1.site_settings) {
    console.error("Prisma site_settings model is not available");
    return {
      statusCode: 500,
      message: "Database model not available"
    };
  }
  try {
    if (method === "GET") {
      const settings = await prisma$1.site_settings.findFirst({
        select: {
          siteLoadingLogo: true,
          siteName: true
        },
        orderBy: { settingID: "desc" }
      });
      return {
        statusCode: 200,
        message: "Success",
        data: {
          siteLoadingLogo: (settings == null ? void 0 : settings.siteLoadingLogo) || "",
          siteName: (settings == null ? void 0 : settings.siteName) || "corradAF"
        }
      };
    }
    return {
      statusCode: 405,
      message: "Method not allowed"
    };
  } catch (error) {
    console.error("Loading logo API error:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const loadingLogo$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: loadingLogo
});

const siteSettings = defineEventHandler(async (event) => {
  const method = getMethod(event);
  if (!prisma$1) {
    console.error("Prisma client is not available - import may have failed");
    return {
      statusCode: 500,
      message: "Database connection not available"
    };
  }
  if (!prisma$1.site_settings) {
    console.error("Prisma site_settings model is not available");
    return {
      statusCode: 500,
      message: "Database model not available"
    };
  }
  try {
    if (method === "GET") {
      let settings = await prisma$1.site_settings.findFirst({
        orderBy: { settingID: "desc" }
      });
      if (!settings) {
        settings = await prisma$1.site_settings.create({
          data: {
            siteName: "corradAF",
            siteDescription: "corradAF Base Project",
            themeMode: "biasa",
            showSiteNameInHeader: true,
            seoRobots: "index, follow",
            seoTwitterCard: "summary_large_image",
            settingCreatedDate: /* @__PURE__ */ new Date(),
            settingModifiedDate: /* @__PURE__ */ new Date()
          }
        });
      }
      const transformedSettings = {
        siteName: settings.siteName || "corradAF",
        siteNameFontSize: settings.siteNameFontSize || 18,
        siteDescription: settings.siteDescription || "corradAF Base Project",
        siteLogo: settings.siteLogo || "",
        siteLoadingLogo: settings.siteLoadingLogo || "",
        siteFavicon: settings.siteFavicon || "",
        siteLoginLogo: settings.siteLoginLogo || "",
        showSiteNameInHeader: settings.showSiteNameInHeader !== false,
        customCSS: settings.customCSS || "",
        selectedTheme: settings.themeMode || "biasa",
        // Use themeMode as selectedTheme
        customThemeFile: settings.customThemeFile || "",
        currentFont: settings.currentFont || "",
        fontSource: settings.fontSource || "",
        // SEO fields
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        seoKeywords: settings.seoKeywords || "",
        seoAuthor: settings.seoAuthor || "",
        seoOgImage: settings.seoOgImage || "",
        seoTwitterCard: settings.seoTwitterCard || "summary_large_image",
        seoCanonicalUrl: settings.seoCanonicalUrl || "",
        seoRobots: settings.seoRobots || "index, follow",
        seoGoogleAnalytics: settings.seoGoogleAnalytics || "",
        seoGoogleTagManager: settings.seoGoogleTagManager || "",
        seoFacebookPixel: settings.seoFacebookPixel || ""
      };
      return {
        statusCode: 200,
        message: "Success",
        data: transformedSettings
      };
    }
    if (method === "POST") {
      let body;
      try {
        body = await readBody(event);
      } catch (bodyError) {
        console.error("Error reading request body:", bodyError);
        return {
          statusCode: 400,
          message: "Invalid request body",
          error: bodyError.message
        };
      }
      if (!body || typeof body !== "object") {
        return {
          statusCode: 400,
          message: "Request body must be a valid JSON object"
        };
      }
      const existingSettings = await prisma$1.site_settings.findFirst();
      const dbData = {};
      if (body.siteName !== void 0)
        dbData.siteName = body.siteName;
      if (body.siteNameFontSize !== void 0)
        dbData.siteNameFontSize = body.siteNameFontSize;
      if (body.siteDescription !== void 0)
        dbData.siteDescription = body.siteDescription;
      if (body.siteLogo !== void 0)
        dbData.siteLogo = body.siteLogo;
      if (body.siteLoadingLogo !== void 0)
        dbData.siteLoadingLogo = body.siteLoadingLogo;
      if (body.siteFavicon !== void 0)
        dbData.siteFavicon = body.siteFavicon;
      if (body.siteLoginLogo !== void 0)
        dbData.siteLoginLogo = body.siteLoginLogo;
      if (body.showSiteNameInHeader !== void 0)
        dbData.showSiteNameInHeader = body.showSiteNameInHeader;
      if (body.customCSS !== void 0)
        dbData.customCSS = body.customCSS;
      if (body.selectedTheme !== void 0)
        dbData.themeMode = body.selectedTheme;
      if (body.customThemeFile !== void 0)
        dbData.customThemeFile = body.customThemeFile;
      if (body.currentFont !== void 0)
        dbData.currentFont = body.currentFont;
      if (body.fontSource !== void 0)
        dbData.fontSource = body.fontSource;
      if (body.seoTitle !== void 0)
        dbData.seoTitle = body.seoTitle;
      if (body.seoDescription !== void 0)
        dbData.seoDescription = body.seoDescription;
      if (body.seoKeywords !== void 0)
        dbData.seoKeywords = body.seoKeywords;
      if (body.seoAuthor !== void 0)
        dbData.seoAuthor = body.seoAuthor;
      if (body.seoOgImage !== void 0)
        dbData.seoOgImage = body.seoOgImage;
      if (body.seoTwitterCard !== void 0)
        dbData.seoTwitterCard = body.seoTwitterCard;
      if (body.seoCanonicalUrl !== void 0)
        dbData.seoCanonicalUrl = body.seoCanonicalUrl;
      if (body.seoRobots !== void 0)
        dbData.seoRobots = body.seoRobots;
      if (body.seoGoogleAnalytics !== void 0)
        dbData.seoGoogleAnalytics = body.seoGoogleAnalytics;
      if (body.seoGoogleTagManager !== void 0)
        dbData.seoGoogleTagManager = body.seoGoogleTagManager;
      if (body.seoFacebookPixel !== void 0)
        dbData.seoFacebookPixel = body.seoFacebookPixel;
      dbData.settingModifiedDate = /* @__PURE__ */ new Date();
      let settings;
      if (existingSettings) {
        settings = await prisma$1.site_settings.update({
          where: { settingID: existingSettings.settingID },
          data: dbData
        });
      } else {
        settings = await prisma$1.site_settings.create({
          data: {
            ...dbData,
            settingCreatedDate: /* @__PURE__ */ new Date()
          }
        });
      }
      const transformedSettings = {
        siteName: settings.siteName || "corradAF",
        siteNameFontSize: settings.siteNameFontSize || 18,
        siteDescription: settings.siteDescription || "corradAF Base Project",
        siteLogo: settings.siteLogo || "",
        siteLoadingLogo: settings.siteLoadingLogo || "",
        siteFavicon: settings.siteFavicon || "",
        siteLoginLogo: settings.siteLoginLogo || "",
        showSiteNameInHeader: settings.showSiteNameInHeader !== false,
        customCSS: settings.customCSS || "",
        selectedTheme: settings.themeMode || "biasa",
        // Use themeMode as selectedTheme
        customThemeFile: settings.customThemeFile || "",
        currentFont: settings.currentFont || "",
        fontSource: settings.fontSource || "",
        // SEO fields
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        seoKeywords: settings.seoKeywords || "",
        seoAuthor: settings.seoAuthor || "",
        seoOgImage: settings.seoOgImage || "",
        seoTwitterCard: settings.seoTwitterCard || "summary_large_image",
        seoCanonicalUrl: settings.seoCanonicalUrl || "",
        seoRobots: settings.seoRobots || "index, follow",
        seoGoogleAnalytics: settings.seoGoogleAnalytics || "",
        seoGoogleTagManager: settings.seoGoogleTagManager || "",
        seoFacebookPixel: settings.seoFacebookPixel || ""
      };
      return {
        statusCode: 200,
        message: "Settings updated successfully",
        data: transformedSettings
      };
    }
    return {
      statusCode: 405,
      message: "Method not allowed"
    };
  } catch (error) {
    console.error("Site settings API error:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 400,
        message: "Duplicate entry error",
        error: error.message
      };
    }
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Record not found",
        error: error.message
      };
    }
    if (error.code && error.code.startsWith("P")) {
      return {
        statusCode: 400,
        message: "Database error",
        error: error.message,
        code: error.code
      };
    }
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const siteSettings$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: siteSettings
});

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

const native = {
  randomUUID: crypto.randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}

const uploadFile = defineEventHandler(async (event) => {
  var _a, _b;
  const method = getMethod(event);
  if (method !== "POST") {
    return {
      statusCode: 405,
      message: "Method not allowed"
    };
  }
  try {
    const form = await readMultipartFormData(event);
    if (!form || form.length === 0) {
      return {
        statusCode: 400,
        message: "No file uploaded"
      };
    }
    const file = form[0];
    const fileType = ((_b = (_a = form.find((field) => field.name === "type")) == null ? void 0 : _a.data) == null ? void 0 : _b.toString()) || "logo";
    const allowedTypes = {
      logo: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"],
      "loading-logo": ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"],
      "login-logo": ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"],
      favicon: ["image/x-icon", "image/vnd.microsoft.icon", "image/png"],
      "og-image": ["image/jpeg", "image/jpg", "image/png"],
      theme: ["text/css", "application/octet-stream"]
    };
    if (!allowedTypes[fileType] || !allowedTypes[fileType].includes(file.type)) {
      return {
        statusCode: 400,
        message: `Invalid file type for ${fileType}. Allowed types: ${allowedTypes[fileType].join(", ")}`
      };
    }
    let uploadDir, fileUrl;
    if (fileType === "theme") {
      uploadDir = path.join(process.cwd(), "assets", "style", "css");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileExtension = path.extname(file.filename || "");
      const uniqueFilename = `custom-theme-${v4()}${fileExtension}`;
      const filePath = path.join(uploadDir, uniqueFilename);
      fs.writeFileSync(filePath, file.data);
      fileUrl = `/assets/style/css/${uniqueFilename}`;
    } else {
      uploadDir = path.join(process.cwd(), "public", "uploads", "site-settings");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileExtension = path.extname(file.filename || "");
      let baseFilename;
      switch (fileType) {
        case "logo":
          baseFilename = "site-logo";
          break;
        case "loading-logo":
          baseFilename = "loading-logo";
          break;
        case "login-logo":
          baseFilename = "login-logo";
          break;
        case "favicon":
          baseFilename = "favicon";
          break;
        case "og-image":
          baseFilename = "og-image";
          break;
        default:
          baseFilename = fileType;
      }
      const filenameWithExt = `${baseFilename}${fileExtension}`;
      const filePath = path.join(uploadDir, filenameWithExt);
      fs.writeFileSync(filePath, file.data);
      fileUrl = `/uploads/site-settings/${filenameWithExt}`;
    }
    return {
      statusCode: 200,
      message: "File uploaded successfully",
      data: {
        filename: path.basename(fileUrl),
        url: fileUrl,
        type: fileType,
        size: file.data.length
      }
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const uploadFile$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: uploadFile
});

const fileCode$2 = defineEventHandler(async (event) => {
  const query = await getQuery$1(event);
  let code = "";
  try {
    const filePath = path.join(process.cwd() + "/pages/", query.path + ".vue");
    try {
      code = fs.readFileSync(filePath, "utf8");
      return {
        statusCode: 200,
        message: "Code successfully loaded",
        data: code
      };
    } catch (error) {
    }
    const filePathIndex = path.join(
      process.cwd() + "/pages/",
      query.path + "/index.vue"
    );
    code = fs.readFileSync(filePathIndex, "utf8");
    code = code.substring(
      code.indexOf("<template>") + 10,
      code.lastIndexOf("</template>")
    );
    return {
      statusCode: 200,
      message: "Code successfully loaded",
      data: code,
      mode: "index"
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "File not found"
    };
  }
});

const fileCode$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: fileCode$2
});

const fileCode = defineEventHandler(async (event) => {
  const query = await getQuery$1(event);
  let code = "";
  try {
    const filePath = path.join(process.cwd() + "/pages/", query.path + ".vue");
    try {
      code = fs.readFileSync(filePath, "utf8");
      return {
        statusCode: 200,
        message: "Code successfully loaded",
        data: code
      };
    } catch (error) {
    }
    const filePathIndex = path.join(
      process.cwd() + "/pages/",
      query.path + "/index.vue"
    );
    code = fs.readFileSync(filePathIndex, "utf8");
    return {
      statusCode: 200,
      message: "Code successfully loaded",
      data: code,
      mode: "index"
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "File not found"
    };
  }
});

const fileCode$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: fileCode
});

const linter = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  try {
    if (body.code === void 0) {
      return {
        statusCode: 400,
        message: "Bad Request"
      };
    }
    const code = body.code;
    const scriptContent = ((_a = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)) == null ? void 0 : _a[1]) || "";
    const templateContent = (_b = code.match(/<template>([\s\S]*)<\/template>/)) == null ? void 0 : _b[1];
    const validateFormKit = (content) => {
      const validFormKitTypes = [
        "text",
        "email",
        "url",
        "tel",
        "password",
        "number",
        "date",
        "datetime-local",
        "time",
        "month",
        "week",
        "search",
        "color",
        "file",
        "range",
        "checkbox",
        "radio",
        "select",
        "textarea",
        "submit",
        "button",
        "mask",
        "form"
      ];
      const formKitRegex = /<FormKit[^>]*>/g;
      let formKitMatch;
      let lineNumber = content.slice(0, content.indexOf("<template")).split("\n").length;
      let lastIndex = 0;
      while ((formKitMatch = formKitRegex.exec(content)) !== null) {
        lineNumber += (content.slice(lastIndex, formKitMatch.index).match(/\n/g) || []).length;
        lastIndex = formKitMatch.index;
        const formKitTag = formKitMatch[0];
        const typeMatch = formKitTag.match(/type=["']([^"']+)["']/);
        if (!typeMatch) {
          throw {
            message: "FormKit component missing required 'type' attribute",
            line: lineNumber,
            column: formKitMatch.index - content.lastIndexOf("\n", formKitMatch.index)
          };
        }
        const inputType = typeMatch[1];
        if (!validFormKitTypes.includes(inputType)) {
          throw {
            message: `Invalid FormKit type: "${inputType}". Please use a valid input type.`,
            line: lineNumber,
            column: formKitMatch.index - content.lastIndexOf("\n", formKitMatch.index)
          };
        }
        if (["select", "radio", "checkbox"].includes(inputType)) {
          const hasOptions = formKitTag.includes(":options=") || formKitTag.includes("v-model=");
          const hasSlotContent = content.slice(
            formKitMatch.index,
            content.indexOf(">", formKitMatch.index)
          ).includes(">") && content.slice(
            formKitMatch.index,
            content.indexOf("</FormKit>", formKitMatch.index)
          ).includes("<option");
          if (!hasOptions && !hasSlotContent) {
            throw {
              message: `FormKit ${inputType} requires options. Add :options prop or option slots.`,
              line: lineNumber,
              column: formKitMatch.index - content.lastIndexOf("\n", formKitMatch.index)
            };
          }
        }
      }
    };
    const validateMustacheSyntax = (content) => {
      const stack = [];
      let lineNumber = 1;
      let lastIndex = 0;
      for (let i = 0; i < content.length; i++) {
        if (content[i] === "\n") {
          lineNumber++;
          lastIndex = i + 1;
        }
        if (content[i] === "{" && content[i + 1] === "{") {
          stack.push({
            position: i,
            line: lineNumber,
            column: i - lastIndex
          });
          i++;
        } else if (content[i] === "}" && content[i + 1] === "}") {
          if (stack.length === 0) {
            throw {
              message: "Unexpected closing mustache brackets '}}' without matching opening brackets",
              line: lineNumber,
              column: i - lastIndex
            };
          }
          stack.pop();
          i++;
        }
      }
      if (stack.length > 0) {
        const unclosed = stack[0];
        throw {
          message: "Unclosed mustache brackets '{{'. Missing closing brackets '}}",
          line: unclosed.line,
          column: unclosed.column
        };
      }
    };
    if (templateContent) {
      try {
        validateMustacheSyntax(templateContent);
        validateFormKit(templateContent);
      } catch (error) {
        return {
          statusCode: 400,
          message: "Template Syntax Error",
          data: {
            message: error.message,
            line: error.line,
            column: error.column
          }
        };
      }
      const definedVariables = /* @__PURE__ */ new Set();
      const commonVueVars = [
        "$route",
        "$router",
        "$refs",
        "$emit",
        "$slots",
        "$attrs"
      ];
      commonVueVars.forEach((v) => definedVariables.add(v));
      const refRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
      let varMatch;
      while ((varMatch = refRegex.exec(scriptContent)) !== null) {
        definedVariables.add(varMatch[1]);
      }
      const propsMatch = scriptContent.match(/defineProps\(\s*{([^}]+)}\s*\)/);
      if (propsMatch) {
        const propsContent = propsMatch[1];
        const propNames = propsContent.match(/(\w+)\s*:/g);
        propNames == null ? void 0 : propNames.forEach((prop) => {
          definedVariables.add(prop.replace(":", "").trim());
        });
      }
      const mustacheRegex = /{{([^}]+)}}/g;
      let lineNumber = 1;
      let lastIndex = 0;
      let mustacheMatch;
      while ((mustacheMatch = mustacheRegex.exec(templateContent)) !== null) {
        lineNumber += (templateContent.slice(lastIndex, mustacheMatch.index).match(/\n/g) || []).length;
        lastIndex = mustacheMatch.index;
        const expression = mustacheMatch[1].trim();
        const variables = expression.split(/[\s.()[\]]+/);
        for (const variable of variables) {
          if (!variable || variable.match(/^[\d+\-*/&|!%<>=?:]+$/) || variable === "true" || variable === "false") {
            continue;
          }
          if (!definedVariables.has(variable)) {
            return {
              statusCode: 400,
              message: "Template Reference Error",
              data: {
                message: `Variable "${variable}" is not defined`,
                line: lineNumber,
                column: mustacheMatch.index - templateContent.lastIndexOf("\n", mustacheMatch.index)
              }
            };
          }
        }
      }
    }
    const validateTemplateStructure = (code2) => {
      var _a2, _b2;
      const templateContent1 = (_a2 = code2.match(
        /<template>([\s\S]*)<\/template>/
      )) == null ? void 0 : _a2[1];
      if (templateContent1) {
        const scriptInTemplate = templateContent1.match(/<script\b[^>]*>/i);
        if (scriptInTemplate) {
          const lineNumber = templateContent1.slice(0, scriptInTemplate.index).split("\n").length;
          const column = scriptInTemplate.index - templateContent1.lastIndexOf("\n", scriptInTemplate.index);
          throw {
            message: "Script tags are not allowed inside template section",
            line: lineNumber,
            column
          };
        }
      }
      const rootTemplateCount = (code2.match(/^[\s\S]*<template>[\s\S]*<\/template>/g) || []).length;
      const rootScriptCount = (code2.match(/^[\s\S]*<script>[\s\S]*<\/script>/g) || []).length;
      if (rootTemplateCount > 1 || rootScriptCount > 1) {
        throw new Error(
          "Vue components must have only one root <template> and one <script> tag"
        );
      }
      const templateContent2 = (_b2 = code2.match(
        /<template>([\s\S]*)<\/template>/
      )) == null ? void 0 : _b2[1];
      if (templateContent2) {
        const tagStack = [];
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)\s*([^>]*?)(\/?)>/g;
        let match;
        let lineNumber = 1;
        let lastIndex = 0;
        while ((match = tagRegex.exec(templateContent2)) !== null) {
          const [fullTag, tagName, attributes, selfClosing] = match;
          lineNumber += (templateContent2.slice(lastIndex, match.index).match(/\n/g) || []).length;
          lastIndex = match.index;
          if (templateContent2.slice(match.index).startsWith("<!--")) {
            const commentEnd = templateContent2.indexOf("-->", match.index);
            if (commentEnd !== -1) {
              tagRegex.lastIndex = commentEnd + 3;
              continue;
            }
          }
          if (!fullTag.endsWith(">")) {
            throw {
              message: `Malformed tag found: ${fullTag}`,
              line: lineNumber,
              column: match.index - templateContent2.lastIndexOf("\n", match.index)
            };
          }
          if (selfClosing || fullTag.endsWith("/>"))
            continue;
          if (!fullTag.startsWith("</")) {
            tagStack.push({
              name: tagName,
              line: lineNumber,
              column: match.index - templateContent2.lastIndexOf("\n", match.index)
            });
          } else {
            if (tagStack.length === 0) {
              throw {
                message: `Unexpected closing tag </${tagName}> found without matching opening tag`,
                line: lineNumber,
                column: match.index - templateContent2.lastIndexOf("\n", match.index)
              };
            }
            const lastTag = tagStack[tagStack.length - 1];
            if (lastTag.name !== tagName) {
              throw {
                message: `Mismatched tags: expected closing tag for "${lastTag.name}" but found "${tagName}"`,
                line: lineNumber,
                column: match.index - templateContent2.lastIndexOf("\n", match.index)
              };
            }
            tagStack.pop();
          }
        }
        if (tagStack.length > 0) {
          const unclosedTag = tagStack[tagStack.length - 1];
          throw {
            message: `Unclosed tag: ${unclosedTag.name}`,
            line: unclosedTag.line,
            column: unclosedTag.column
          };
        }
      }
      return true;
    };
    try {
      validateTemplateStructure(code);
    } catch (structureError) {
      return {
        statusCode: 400,
        message: "Template Structure Error",
        data: {
          message: structureError.message,
          line: structureError.line || 1,
          column: structureError.column || 0
        }
      };
    }
    const eslint = new ESLint({
      overrideConfig: {
        extends: ["plugin:vue/vue3-recommended"],
        parserOptions: {
          parser: "espree",
          ecmaVersion: 2022,
          sourceType: "module"
        }
      },
      useEslintrc: false
    });
    const results = await eslint.lintText(code);
    if (results[0].messages.length > 0) {
      const message = results[0].messages[0];
      if (message.fatal === true) {
        return {
          statusCode: 400,
          message: "Bad Linter Test",
          data: {
            message: message.message,
            line: message.line,
            column: message.column
          }
        };
      }
      return {
        statusCode: 200,
        message: "Good Linter test",
        data: {
          message: message.message,
          line: message.line,
          column: message.column
        }
      };
    }
    return {
      statusCode: 200,
      message: "Code validation passed"
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message
    };
  }
});

const linter$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: linter
});

const prettierFormat = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    if (body.code === void 0) {
      return {
        statusCode: 400,
        message: "Bad Request"
      };
    }
    const code = prettier.format(body.code, { semi: false, parser: "vue" });
    return {
      statusCode: 200,
      message: "Code successfully formatted",
      data: code
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});

const prettierFormat$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: prettierFormat
});

const save = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const filePath = path.join(process.cwd() + "/pages/", body.path + ".vue");
    fs.writeFileSync(filePath, body.code, "utf8");
    return {
      statusCode: 200,
      message: "Code successfully saved"
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});

const save$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: save
});

const data = [
  {
    id: "dxtM4vP",
    title: "Form 1",
    description: "Basic form for contact details",
    filename: "form1",
    img: "/img/template/form1.jpg",
    tag: ["form", "formkit", "text", "radio", "phone", "date", "textarea"]
  }
];
const templates = {
  data
};

const getList = defineEventHandler(async (event) => {
  var _a;
  try {
    const query = await getQuery$1(event);
    const id = query.id;
    if (!templates || ((_a = templates) == null ? void 0 : _a.data.length) == 0)
      return {
        statusCode: 404,
        message: "Template data not found"
      };
    const template = templates.data.find((item) => item.id == id);
    return {
      statusCode: 200,
      message: "Template data successfully fetched",
      data: template
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error"
    };
  }
});

const getList$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: getList
});

const _import = defineEventHandler(async (event) => {
  try {
    const query = await getQuery$1(event);
    const pagePath = query.path;
    const templateId = query.templateId;
    const filePath = path.join(process.cwd() + "/pages/", pagePath + ".vue");
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 500,
        message: "File path not found"
      };
    }
    const template = templates.data.find(
      (template2) => template2.id === templateId
    );
    const templatePath = path.join(
      process.cwd() + "/templates/",
      template.filename + ".vue"
    );
    if (!fs.existsSync(templatePath)) {
      return {
        statusCode: 500,
        message: "Template not found"
      };
    }
    const templateCode = fs.readFileSync(templatePath, "utf8");
    fs.writeFileSync(filePath, templateCode, "utf8");
    return {
      statusCode: 200,
      message: "Template successfully imported"
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error"
    };
  }
});

const _import$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _import
});

const list$5 = defineEventHandler(async (event) => {
  var _a;
  try {
    if (!templates || ((_a = templates) == null ? void 0 : _a.data.length) == 0)
      return {
        statusCode: 404,
        message: "Template data not found"
      };
    return {
      statusCode: 200,
      message: "List template data successfully fetched",
      data: templates.data
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error"
    };
  }
});

const list$6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list$5
});

const tag = defineEventHandler(async (event) => {
  var _a;
  try {
    if (!templates || ((_a = templates) == null ? void 0 : _a.tags.length) == 0)
      return {
        statusCode: 404,
        message: "Template tags not found"
      };
    return {
      statusCode: 200,
      message: "List template tags successfully fetched",
      data: templates.tags
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal server error"
    };
  }
});

const tag$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: tag
});

const list$4 = /*#__PURE__*/Object.freeze({
  __proto__: null
});

const add$4 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    if (body.formData.path.slice(-1) != "/") {
      body.formData.path = body.formData.path + "/";
    }
    if (fs.existsSync(path.join(process.cwd(), "pages", body.formData.path))) {
      return {
        statusCode: 500,
        message: "Path already exists. Please choose another path."
      };
    }
    const newFilePath = path.join(
      process.cwd(),
      "pages",
      body.formData.path,
      "index.vue"
    );
    fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
    const templateContent = buildNuxtTemplate({
      title: body.formData.title || body.formData.name,
      name: body.formData.name
    });
    fs.writeFileSync(newFilePath, templateContent);
    return {
      statusCode: 200,
      message: "Menu successfully added!"
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const add$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: add$4
});

const Menu = [
  {
    "header": "KERISI",
    "description": "Financial Information System",
    "child": [
      {
        "title": "Setup",
        "path": "/setup",
        "icon": "zmdi:wrench",
        "child": [
          {
            "title": "GL Structure Setup",
            "path": "/glstructure",
            "icon": "",
            "child": [
              {
                "title": "Fund Type",
                "path": "/fundtype",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Activity Code",
                "path": "/setup/glstructure/activity",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "PTJ Code",
                "path": "/setup/glstructure/ptj-code",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Cost Centre",
                "path": "/setup/glstructure/cost-centre",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Cascade Structure",
                "path": "/setup/glstructure/cascade-structure",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Account Code",
                "path": "/setup/account-code",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "sample Form",
            "path": "/sampleform",
            "icon": "",
            "child": [],
            "meta": {
              "auth": {
                "user": [
                  "dev"
                ]
              }
            }
          },
          {
            "title": "Account Details",
            "path": "/accountdetails",
            "icon": "",
            "child": [],
            "meta": {
              "auth": {
                "user": [
                  "dev"
                ]
              }
            }
          }
        ],
        "meta": {}
      },
      {
        "title": "Budget",
        "path": "/budget",
        "icon": "fa6-solid:calendar-days",
        "child": [
          {
            "title": "Setup",
            "path": "/budget/setup",
            "icon": "",
            "child": [
              {
                "title": "Budget Code",
                "path": "/budget/setup/budget-code",
                "icon": "",
                "child": []
              },
              {
                "title": "Allocation",
                "path": "/budget/setup/allocation",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Structure List",
                "path": "/budget/setup/budget-structure-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Planning Schedule",
                "path": "/budget/setup/budget-planning-schedule",
                "icon": "",
                "child": []
              }
            ]
          },
          {
            "title": "Planning",
            "path": "/budget/planning",
            "icon": "",
            "child": [
              {
                "title": "New Application",
                "path": "/budget/planning/new-application",
                "icon": "",
                "child": []
              },
              {
                "title": "Dasar Sedia Ada",
                "path": "/budget/planning/dasar-sedia-ada",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Planning Allocation 2 List",
                "path": "/budget/planning/budget-planning-allocation-2-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Budget Planning Allocation 3 List",
                "path": "/budget/planning/budget-planning-allocation-3-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Dasar Baru / One Off",
                "path": "/budget/planning/dasar-baru-one-off",
                "icon": "",
                "child": []
              },
              {
                "title": "Planning to Initial",
                "path": "/budget/planning/planning-to-initial",
                "icon": "",
                "child": []
              },
              {
                "title": "Report",
                "path": "/budget/planning/report",
                "icon": "",
                "child": [
                  {
                    "title": "Grant Application by Type",
                    "path": "/budget/planning/report/grant-application-by-type",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM Justfikasi",
                    "path": "/budget/planning/report/abm-justfikasi",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM 4",
                    "path": "/budget/planning/report/abm-4",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM 5",
                    "path": "/budget/planning/report/abm-5",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "ABM 7",
                    "path": "/budget/planning/report/abm-7",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Lampiran ABM 7",
                    "path": "/budget/planning/report/lampiran-abm-7",
                    "icon": "",
                    "child": []
                  }
                ]
              }
            ]
          },
          {
            "title": "Initial",
            "path": "/budget/initial",
            "icon": "",
            "child": []
          },
          {
            "title": "Monitoring",
            "path": "/budget/monitoring",
            "icon": "",
            "child": []
          },
          {
            "title": "Budget Listing",
            "path": "/budget/budget-listing",
            "icon": "",
            "child": []
          },
          {
            "title": "Increment",
            "path": "/budget/increment",
            "icon": "",
            "child": []
          },
          {
            "title": "Decrement",
            "path": "/budget/decrement",
            "icon": "",
            "child": []
          },
          {
            "title": "Virement",
            "path": "/budget/virement",
            "icon": "",
            "child": []
          },
          {
            "title": "Report",
            "path": "/budget/report",
            "icon": "",
            "child": [
              {
                "title": "Total Allocation",
                "path": "/budget/report/total-allocation",
                "icon": "",
                "child": []
              },
              {
                "title": "Expenditure and Balance of Allocation",
                "path": "/budget/report/expenditure-and-balance-of-allocation",
                "icon": "",
                "child": []
              },
              {
                "title": "Laporan Belanjawan",
                "path": "/budget/report/laporan-belanjawan",
                "icon": "",
                "child": []
              },
              {
                "title": "Warrant",
                "path": "/budget/report/warrant",
                "icon": "",
                "child": [
                  {
                    "title": "Warrant Initial",
                    "path": "/budget/report/warrant/warrant-initial",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Warrant Increment",
                    "path": "/budget/report/warrant/warrant-increment",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Warrant Decrement",
                    "path": "/budget/report/warrant/warrant-decrement",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Warrant Virement",
                    "path": "/budget/report/warrant/warrant-virement",
                    "icon": "",
                    "child": []
                  }
                ]
              },
              {
                "title": "Budget Report By PTJ",
                "path": "/budget/report/budget-report-by-ptj",
                "icon": "",
                "child": [
                  {
                    "title": "Budget Summary By PTJ (WBR071)",
                    "path": "/budget/report/budget-report-by-ptj/budget-summary-by-ptj-wbr071",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Variation Report (WBR074)",
                    "path": "/budget/report/budget-report-by-ptj/variation-report-wbr074",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Vot Book Report (WBR051)",
                    "path": "/budget/report/budget-report-by-ptj/vot-book-report-wbr051",
                    "icon": "",
                    "child": []
                  }
                ]
              },
              {
                "title": "Budget Report By Account",
                "path": "/budget/report/budget-report-by-account",
                "icon": "",
                "child": [
                  {
                    "title": "Budget Summary By Account Code (WBR072)",
                    "path": "/budget/report/budget-report-by-account/budget-summary-by-account-code-wbr072",
                    "icon": "",
                    "child": []
                  },
                  {
                    "title": "Allocation, Expenditure & Balance of Allocation by Budget Code",
                    "path": "/budget/report/budget-report-by-account/allocation-expenditure-balance-by-budget-code",
                    "icon": "",
                    "child": []
                  }
                ]
              }
            ]
          },
          {
            "title": "Budget Closing",
            "path": "/budget/budget-closing",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Purchasing",
        "path": "/purchasing",
        "icon": "mdi:file-document-check-outline",
        "child": [
          {
            "title": "Setup",
            "path": "/purchasing/setup",
            "icon": "",
            "child": [
              {
                "title": "Item Main",
                "path": "/purchasing/setup/item-main",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Item Main Listing",
                "path": "/purchasing/setup/item-main-listing",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List Of Jobscope",
                "path": "/purchasing/setup/list-of-jobscope",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Assessment Question",
                "path": "/purchasing/setup/assessment-question",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Purchase Requisition",
            "path": "/purchasing/purchase-requisition",
            "icon": "",
            "child": [
              {
                "title": "New Purchase Requisition",
                "path": "/purchasing/purchase-requisition/new",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Requisition List",
                "path": "/purchasing/purchase-requisition/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Requisition Cancel",
                "path": "/purchasing/purchase-requisition/cancel",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Purchase Requisition Cancellation",
                "path": "/purchasing/purchase-requisition/list-cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of PR To Be Cancel",
                "path": "/purchasing/purchase-requisition/list-pr-to-be-cancel",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Requisition Cancel Partial",
                "path": "/purchasing/purchase-requisition/cancel-partial",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of PR To Be Cancel Partial",
                "path": "/purchasing/purchase-requisition/list-pr-to-be-cancel-partial",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Cancel PR Partial",
                "path": "/purchasing/purchase-requisition/list-cancel-pr-partial",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Purchase Order",
            "path": "/purchasing/purchase-order",
            "icon": "",
            "child": [
              {
                "title": "New Purchase Order",
                "path": "/purchasing/purchase-order/new",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Purchase Order List",
                "path": "/purchasing/purchase-order/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Purchase Order Cancellation",
                "path": "/purchasing/purchase-order/list-cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "New PO Cancellation",
                "path": "/purchasing/purchase-order/new-po-cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Cancel PO Partial Listing",
                "path": "/purchasing/purchase-order/cancel-po-partial-listing",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "New Cancel PO Partial",
                "path": "/purchasing/purchase-order/new-cancel-po-partial",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Closing",
                "path": "/purchasing/purchase-order/closing",
                "icon": "",
                "child": [
                  {
                    "title": "PO Confirmation Process",
                    "path": "/purchasing/purchase-order/closing/po-confirmation-process",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "PO Confirmation Process List",
                    "path": "/purchasing/purchase-order/closing/po-confirmation-process-list",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "PO Closed Reverse",
                    "path": "/purchasing/purchase-order/closing/po-closed-reverse",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Process Closing",
                    "path": "/purchasing/purchase-order/closing/process-closing",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Status PO & PR",
            "path": "/purchasing/status-po-pr",
            "icon": "",
            "child": [],
            "meta": {}
          },
          {
            "title": "Good Receive Note",
            "path": "/purchasing/good-receive-note",
            "icon": "",
            "child": [
              {
                "title": "Good Receive Note List",
                "path": "/purchasing/good-receive-note/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Good Receive Note Cancel",
                "path": "/purchasing/good-receive-note/cancel",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Work Progress Note",
            "path": "/purchasing/work-progress-note",
            "icon": "",
            "child": [
              {
                "title": "Work Progress Note Detail",
                "path": "/purchasing/work-progress-note/detail",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Work Progress Note List",
                "path": "/purchasing/work-progress-note/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Work Progress Note Cancel",
                "path": "/purchasing/work-progress-note/cancel",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Vendor",
            "path": "/purchasing/vendor",
            "icon": "",
            "child": [
              {
                "title": "Vendor Profile",
                "path": "/purchasing/vendor/profile",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Vendor",
                "path": "/purchasing/vendor/list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Bank Account No For Updated",
                "path": "/purchasing/vendor/bank-account-update",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Vendor Assessment",
            "path": "/purchasing/vendor-assessment",
            "icon": "",
            "child": [
              {
                "title": "Work Progress Note",
                "path": "/purchasing/vendor-assessment/work-progress-note",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Good Receive Note",
                "path": "/purchasing/vendor-assessment/good-receive-note",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Advertisement",
            "path": "/purchasing/advertisement",
            "icon": "",
            "child": [
              {
                "title": "New Tender/Quotation",
                "path": "/purchasing/advertisement/new-tender-quotation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Advertisement Request List",
                "path": "/purchasing/advertisement/request-list",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Duration Tender/Quotation",
                "path": "/purchasing/advertisement/duration-tender-quotation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Committee Report",
                "path": "/purchasing/advertisement/committee-report",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Tender/Quotation",
            "path": "/purchasing/tender-quotation",
            "icon": "",
            "child": [
              {
                "title": "Committe & Participant",
                "path": "/purchasing/tender-quotation/committee-participant",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Evaluation",
                "path": "/purchasing/tender-quotation/evaluation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Selection",
                "path": "/purchasing/tender-quotation/selection",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Tender/Quotation Cancellation",
                "path": "/purchasing/tender-quotation/cancellation",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Generated Offer Letter",
                "path": "/purchasing/tender-quotation/generated-offer-letter",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Advertisement Complete",
                "path": "/purchasing/tender-quotation/advertisement-complete",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Agreement",
            "path": "/purchasing/agreement",
            "icon": "",
            "child": [
              {
                "title": "List of Agreement",
                "path": "/purchasing/agreement/list",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Variation Order(VO)",
            "path": "/purchasing/variation-order",
            "icon": "",
            "child": [
              {
                "title": "New Variation Order (VO)",
                "path": "/purchasing/variation-order/new",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "List of Variation Order (VO)",
                "path": "/purchasing/variation-order/list",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Bank Guarantee",
            "path": "/purchasing/bank-guarantee",
            "icon": "",
            "child": [
              {
                "title": "List of Bank Guarantee",
                "path": "/purchasing/bank-guarantee/list",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Report",
            "path": "/purchasing/report",
            "icon": "",
            "child": [
              {
                "title": "Report Vendor Assessment (WPN)",
                "path": "/purchasing/report/vendor-assessment-wpn",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Report Vendor Assessment (GRN)",
                "path": "/purchasing/report/vendor-assessment-grn",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Laporan Perolehan PTJ JPKA: LPPM",
                "path": "/purchasing/report/laporan-perolehan-ptj-jpka-lppm",
                "icon": "",
                "child": [
                  {
                    "title": "Senarai Tempoh Masa LPO",
                    "path": "/purchasing/report/laporan-perolehan-ptj-jpka-lppm/senarai-tempoh-masa-lpo",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  },
                  {
                    "title": "Laporan Keseluruhan Perolehan",
                    "path": "/purchasing/report/laporan-perolehan-ptj-jpka-lppm/laporan-keseluruhan-perolehan",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              },
              {
                "title": "Laporan  LPPM JPKA: KPT",
                "path": "/purchasing/report/laporan-lppm-jpka-kpt",
                "icon": "",
                "child": [
                  {
                    "title": "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel",
                    "path": "/purchasing/report/laporan-lppm-jpka-kpt/perolehan-melalui-kontrak-pusat-sistem-panel",
                    "icon": "",
                    "child": [],
                    "meta": {}
                  }
                ],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Report PO",
            "path": "/purchasing/report-po",
            "icon": "",
            "child": [
              {
                "title": "Bendahari",
                "path": "/purchasing/report-po/bendahari",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "PTJ",
                "path": "/purchasing/report-po/ptj",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          }
        ],
        "meta": {}
      },
      {
        "title": "General Ledger",
        "path": "/generalledger",
        "icon": "simple-icons:hyperledger",
        "child": [
          {
            "title": "Posting to GL",
            "path": "/postingtogl",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      }
    ],
    "meta": {}
  },
  {
    "header": "System Administration",
    "description": "Manage your application",
    "child": [
      {
        "title": "User Management",
        "path": "/devtool/user-management",
        "icon": "ph:user-circle-gear",
        "child": [
          {
            "title": "User List",
            "path": "/devtool/user-management/user",
            "icon": "material-symbols:account-circle-full",
            "child": [],
            "meta": {}
          },
          {
            "title": "Role List",
            "path": "/devtool/user-management/role",
            "icon": "oui:app-users-roles",
            "child": [],
            "meta": {}
          },
          {
            "title": "User Setting",
            "path": "/usersetting",
            "icon": "flowbite:user-settings-outline",
            "child": [],
            "meta": {}
          }
        ],
        "meta": {}
      },
      {
        "title": "Workbence Editor",
        "path": "/workbencemanagement",
        "icon": "hugeicons:computer-desk-03",
        "child": [
          {
            "title": "Menu Editor",
            "icon": "ci:menu-alt-03",
            "path": "/devtool/menu-editor",
            "child": [],
            "meta": {}
          },
          {
            "title": "Page Editor",
            "path": "/pageeditor",
            "icon": "icon-park:editor",
            "child": [
              {
                "title": "Page List",
                "path": "/page-list",
                "icon": "",
                "child": []
              },
              {
                "title": "Page Creator",
                "path": "/page-creator",
                "icon": "",
                "child": [],
                "meta": {}
              },
              {
                "title": "Pengujian Muka",
                "path": "/pengujianmuka",
                "icon": "",
                "child": [],
                "meta": {}
              }
            ],
            "meta": {}
          },
          {
            "title": "Dashboard Editor",
            "path": "/dashboard",
            "icon": "ic:outline-dashboard",
            "child": [
              {
                "title": "Content Editor",
                "path": "/devtool/content-editor",
                "icon": "",
                "child": []
              }
            ],
            "meta": {}
          },
          {
            "title": "API Editor",
            "path": "/devtool/api-editor",
            "icon": "material-symbols:api-rounded",
            "child": [],
            "meta": {}
          }
        ],
        "meta": {}
      },
      {
        "title": "Workflow Management",
        "path": "/workflowmanagement",
        "icon": "carbon:workflow-automation",
        "child": [
          {
            "title": "Workflow Configuration",
            "path": "/workflowconfiguration",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Communication Management",
        "path": "/communicationmanagement",
        "icon": "roentgen:tower-communication",
        "child": [
          {
            "title": "setup",
            "path": "/communicationmanagement/setup",
            "icon": "",
            "child": []
          }
        ],
        "meta": {}
      },
      {
        "title": "Business Rule Management",
        "path": "/businessrulemanagement",
        "icon": "streamline-freehand-color:business-workflow-project-management",
        "child": [],
        "meta": {}
      },
      {
        "title": "Task Management",
        "path": "/taskmanagement",
        "icon": "fluent:clipboard-task-list-ltr-24-regular",
        "child": [],
        "meta": {}
      },
      {
        "title": "Panduan Pembangun",
        "path": "/devtool/guide",
        "icon": "material-symbols:menu-book-rounded",
        "child": []
      }
    ],
    "meta": {
      "auth": {
        "role": [
          "Developer"
        ]
      }
    }
  }
];

const _delete$4 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const filePath = path.join(process.cwd() + "/pages/", body.filePath);
    fs.rmSync(filePath, { recursive: true, force: true });
    removeMenuFromNavigation(body.filePath);
    return {
      statusCode: 200,
      message: "Menu successfully deleted and removed from navigation!"
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error.message
    };
  }
});
function removeMenuFromNavigation(menuPath) {
  const removeMenuItem = (items) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].path === menuPath) {
        items.splice(i, 1);
        return true;
      }
      if (items[i].child && items[i].child.length > 0) {
        if (removeMenuItem(items[i].child)) {
          return true;
        }
      }
    }
    return false;
  };
  Menu.forEach((section) => {
    if (section.child) {
      removeMenuItem(section.child);
    }
  });
  const navigationFilePath = path.join(process.cwd(), "navigation", "index.js");
  const navigationContent = `export default ${JSON.stringify(
    Menu,
    null,
    2
  )};`;
  fs.writeFileSync(navigationFilePath, navigationContent, "utf8");
}

const _delete$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _delete$4
});

const edit$4 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const oldPath = body.filePath.endsWith("/") ? body.filePath : body.filePath + "/";
  const newPath = body.formData.path.endsWith("/") ? body.formData.path : body.formData.path + "/";
  const oldFilePath = path.join(process.cwd(), "pages", oldPath, "index.vue");
  const newFilePath = path.join(process.cwd(), "pages", newPath, "index.vue");
  try {
    const templateContent = buildNuxtTemplate({
      title: body.formData.title || body.formData.name,
      name: body.formData.name
    });
    if (oldPath !== newPath) {
      fs.mkdirSync(path.dirname(newFilePath), { recursive: true });
      fs.writeFileSync(newFilePath, templateContent);
      fs.unlinkSync(oldFilePath);
      let dirToCheck = path.dirname(oldFilePath);
      while (dirToCheck !== path.join(process.cwd(), "pages")) {
        if (fs.readdirSync(dirToCheck).length === 0) {
          fs.rmdirSync(dirToCheck);
          dirToCheck = path.dirname(dirToCheck);
        } else {
          break;
        }
      }
    } else {
      fs.writeFileSync(oldFilePath, templateContent);
    }
    return {
      statusCode: 200,
      message: oldPath !== newPath ? "Menu successfully moved and updated" : "Menu successfully updated"
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const edit$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: edit$4
});

const newAdd = defineEventHandler(async (event) => {
  await readBody(event);
});

const newAdd$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: newAdd
});

const overwriteNavigation = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const menuPath = path.join(process.cwd() + "/navigation/", "index.js");
    fs.writeFileSync(
      menuPath,
      `export default ${JSON.stringify(body.menuData, null, 2)}`
    );
    return {
      statusCode: 200,
      message: "Menu successfully saved"
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const overwriteNavigation$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: overwriteNavigation
});

const roleList = defineEventHandler(async (event) => {
  try {
    const roles = await prisma$1.role.findMany({
      select: {
        roleID: true,
        roleName: true
      },
      where: {
        roleStatus: {
          not: "DELETED"
        }
      }
    });
    if (roles) {
      return {
        statusCode: 200,
        message: "Roles successfully fetched",
        data: roles
      };
    } else {
      return {
        statusCode: 404,
        message: "No Roles found"
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const roleList$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: roleList
});

const userList = defineEventHandler(async (event) => {
  try {
    const users = await prisma$1.user.findMany({
      select: {
        userID: true,
        userUsername: true
      },
      where: {
        userStatus: {
          not: "DELETED"
        }
      }
    });
    if (users) {
      return {
        statusCode: 200,
        message: "Users successfully fetched",
        data: users
      };
    } else {
      return {
        statusCode: 404,
        message: "No Users found"
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const userList$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: userList
});

const get_get$2 = defineEventHandler(async (event) => {
  try {
    const { tableName } = getQuery$1(event);
    if (!tableName) {
      return {
        statusCode: 400,
        message: "Table name is required"
      };
    }
    const getData = await prisma$1.$queryRawUnsafe(`SELECT * FROM ${tableName}`);
    if (getData.length === 0) {
      return {
        statusCode: 404,
        message: "Data not found"
      };
    }
    return {
      statusCode: 200,
      message: "Data successfully fetched",
      data: getData
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});

const get_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: get_get$2
});

const schema_get = defineEventHandler(async (event) => {
  try {
    const { type } = getQuery$1(event);
    if (!type) {
      return {
        statusCode: 400,
        message: "Type is required"
      };
    }
    if (type !== "table" && type !== "field") {
      return {
        statusCode: 400,
        message: "Invalid type"
      };
    }
    let schema = null;
    if (type == "table")
      schema = getPrismaSchemaTable();
    return {
      statusCode: 200,
      message: "Schema successfully fetched",
      data: schema
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});

const schema_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: schema_get
});

const studio_get = defineEventHandler(async (event) => {
  try {
    let error = false;
    exec("npx prisma studio", (error2, stdout, stderr) => {
      if (error2) {
        console.error(`exec error: ${error2}`);
        error2 = true;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });
    if (error)
      ;
    return {
      statusCode: 200,
      message: "Prisma Studio successfully launched"
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});

const studio_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: studio_get
});

var columnTypes = [
	{
		group: "Numbers",
		options: [
			"TINYINT",
			"SMALLINT",
			"MEDIUMINT",
			"INT",
			"BIGINT",
			"DECIMAL",
			"FLOAT",
			"DOUBLE"
		]
	},
	{
		group: "Date and Time",
		options: [
			"DATE",
			"TIME",
			"DATETIME",
			"TIMESTAMP",
			"YEAR"
		]
	},
	{
		group: "Strings",
		options: [
			"CHAR",
			"VARCHAR",
			"TINYTEXT",
			"TEXT",
			"MEDIUMTEXT",
			"LONGTEXT",
			"JSON"
		]
	},
	{
		group: "Lists",
		options: [
			"ENUM",
			"SET"
		]
	},
	{
		group: "Binary",
		options: [
			"BIT",
			"BINARY",
			"VARBINARY",
			"TINYBLOB",
			"BLOB",
			"MEDIUMBLOB",
			"LONGBLOB"
		]
	},
	{
		group: "Geometry",
		options: [
			"GEOMETRY",
			"POINT",
			"LINESTRING",
			"POLYGON",
			"MULTIPOINT",
			"MULTILINESTRING",
			"MULTIPOLYGON",
			"GEOMETRYCOLLECTION"
		]
	}
];
var dataTypes = [
	"",
	"INT",
	"TINYINT",
	"SMALLINT",
	"MEDIUMINT",
	"BIGINT",
	"DECIMAL",
	"NUMERIC",
	"FLOAT",
	"DOUBLE",
	"CHAR",
	"VARCHAR",
	"TEXT",
	"ENUM",
	"SET",
	"BINARY",
	"VARBINARY",
	"BLOB",
	"DATE",
	"TIME",
	"DATETIME",
	"TIMESTAMP",
	"YEAR",
	"BOOL",
	"BOOLEAN",
	"JSON",
	"JSONB",
	"XML",
	"UUID",
	"GEOMETRY",
	"POINT",
	"LINESTRING",
	"POLYGON"
];
var tableField = [
	"name",
	"type",
	"length",
	"defaultValue",
	"nullable",
	"primaryKey",
	"actions"
];
const fileConfig = {
	columnTypes: columnTypes,
	dataTypes: dataTypes,
	tableField: tableField
};

const index_get$1O = defineEventHandler(async (event) => {
  try {
    if (!fileConfig) {
      return {
        statusCode: 404,
        message: "Configuration file not found"
      };
    }
    const tables = await getAllTableWithPK();
    if (!tables) {
      return {
        statusCode: 500,
        message: "Please check your database connection"
      };
    }
    fileConfig.columnTypes = fileConfig.columnTypes.filter(
      (columnType) => columnType.group !== "Foreign Keys"
    );
    fileConfig.columnTypes.push({
      ...tables
    });
    return {
      statusCode: 200,
      message: "Configuration file successfully loaded",
      data: fileConfig
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});
async function getAllTableWithPK() {
  try {
    const tables = await prisma$1.$queryRaw` SELECT 
                                table_name,
                                column_name
                              FROM 
                                information_schema.columns
                              WHERE table_schema = DATABASE()
                              AND column_key = 'PRI'`;
    if (!tables)
      return false;
    const remapTables = tables.reduce((acc, table) => {
      const group = "Foreign Keys";
      const option = {
        label: `${table.TABLE_NAME} (${table.COLUMN_NAME})`,
        value: `[[${table.TABLE_NAME}]]`
      };
      const existingGroup = acc.find((item) => item.group === group);
      if (existingGroup) {
        existingGroup.options.push(option);
      } else {
        acc.push({ group, options: [option] });
      }
      return acc;
    }, []);
    return remapTables[0];
  } catch (error) {
    console.log(error.message);
    return false;
  }
}

const index_get$1P = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1O
});

const index_post$u = defineEventHandler(async (event) => {
  try {
    const { tableName, tableSchema, autoIncrementColumn } = await readBody(event);
    if (!tableName || !tableSchema) {
      return {
        statusCode: 400,
        message: "Bad Request"
      };
    }
    const isTableCreated = await createTable(
      tableName,
      tableSchema,
      autoIncrementColumn
    );
    if (isTableCreated.statusCode !== 200)
      return {
        statusCode: 500,
        message: isTableCreated.message
      };
    const isPrismaCommandRun = await runPrismaCommand$2();
    if (!isPrismaCommandRun)
      return {
        statusCode: 500,
        message: "Prisma Command Failed"
      };
    return {
      statusCode: 200,
      message: "Table Created"
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});
async function createTable(tableName, tableSchema) {
  try {
    let rawSchema = ``;
    for (let i = 0; i < tableSchema.length; i++) {
      const column = tableSchema[i];
      if (column.type.includes("[[") && column.type.includes("]]")) {
        const FKTableName = column.type.replace("[[", "").replace("]]", "");
        const primaryKey = await prisma$1.$queryRawUnsafe(
          "SHOW COLUMNS from " + FKTableName + " where `Key` = 'PRI'"
        );
        rawSchema += `${column.name} INT NOT NULL, FOREIGN KEY (${column.name}) REFERENCES ${FKTableName}(${primaryKey[0].Field})`;
      } else {
        rawSchema += `${column.name} 
        ${column.type}${column.length ? "(" + column.length + ")" : ""}
        ${column.defaultValue ? " DEFAULT " + column.defaultValue : ""} 
        ${column.nullable ? " NULL" : " NOT NULL "}
        ${column.primaryKey ? " PRIMARY KEY AUTO_INCREMENT" : ""}`;
      }
      if (i < tableSchema.length - 1)
        rawSchema += ", ";
    }
    const sqlStatement = `CREATE TABLE ${tableName} (${rawSchema})`;
    console.log(sqlStatement);
    const createTable2 = await prisma$1.$queryRawUnsafe(sqlStatement);
    if (!createTable2)
      return {
        statusCode: 500,
        message: "Table Creation Failed"
      };
    return {
      statusCode: 200,
      message: "Table Created"
    };
  } catch (error) {
    console.log(error.message);
    if (error.message.includes("already exists")) {
      return {
        statusCode: 500,
        message: `Table '${tableName}' already exists!`
      };
    }
    if (error.message.includes("1064")) {
      return {
        statusCode: 500,
        message: "Please ensure the SQL syntax is correct!"
      };
    }
    return {
      statusCode: 500,
      message: "Table Creation Failed"
    };
  }
}
async function runPrismaCommand$2() {
  try {
    console.log("---------- Run Prisma Command ----------");
    const __dirname = dirname(fileURLToPath(globalThis._importMeta_.url));
    const directory = resolve(__dirname, "../..");
    const command = "npx prisma db pull && npx prisma generate";
    let shellCommand;
    let spawnOptions;
    switch (os.platform()) {
      case "win32":
        shellCommand = `Start-Process cmd -ArgumentList '/c cd "${directory}" && ${command}' -Verb RunAs`;
        spawnOptions = {
          shell: "powershell.exe",
          args: ["-Command", shellCommand]
        };
        break;
      case "darwin":
      case "linux":
        shellCommand = `cd "${directory}" && ${command}`;
        spawnOptions = {
          shell: "sh",
          args: ["-c", shellCommand]
        };
        break;
      default:
        console.error("Unsupported platform:", os.platform());
        return false;
    }
    const childProcess = spawn(spawnOptions.shell, spawnOptions.args, {
      stdio: "inherit"
    });
    return new Promise((resolve2, reject) => {
      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Prisma commands executed successfully");
          resolve2(true);
        } else {
          console.error(`Child process exited with code ${code}`);
          reject(new Error(`Child process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error("Error running Prisma commands:", error);
    return false;
  }
}

const index_post$v = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$u
});

const index_delete = defineEventHandler(async (event) => {
  const tableName = event.context.params.table;
  try {
    await prisma$1.$executeRawUnsafe(`DROP TABLE IF EXISTS ${tableName}`);
    const isPrismaCommandRun = await runPrismaCommand$1();
    if (!isPrismaCommandRun) {
      return {
        statusCode: 500,
        message: "Prisma Command Failed after table deletion"
      };
    }
    return {
      statusCode: 200,
      message: `Table '${tableName}' has been successfully deleted.`
    };
  } catch (error) {
    console.error("Error deleting table:", error);
    return {
      statusCode: 500,
      message: `Failed to delete table '${tableName}'. Error: ${error.message}`
    };
  }
});
async function runPrismaCommand$1() {
  try {
    console.log("---------- Run Prisma Command ----------");
    const __dirname = dirname(fileURLToPath(globalThis._importMeta_.url));
    const directory = resolve(__dirname, "../..");
    const command = "npx prisma db pull && npx prisma generate";
    let shellCommand;
    let spawnOptions;
    switch (os.platform()) {
      case "win32":
        shellCommand = `Start-Process cmd -ArgumentList '/c cd "${directory}" && ${command}' -Verb RunAs`;
        spawnOptions = {
          shell: "powershell.exe",
          args: ["-Command", shellCommand]
        };
        break;
      case "darwin":
      case "linux":
        shellCommand = `cd "${directory}" && ${command}`;
        spawnOptions = {
          shell: "sh",
          args: ["-c", shellCommand]
        };
        break;
      default:
        console.error("Unsupported platform:", os.platform());
        return false;
    }
    const childProcess = spawn(spawnOptions.shell, spawnOptions.args, {
      stdio: "inherit"
    });
    return new Promise((resolve2, reject) => {
      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Prisma commands executed successfully");
          resolve2(true);
        } else {
          console.error(`Child process exited with code ${code}`);
          reject(new Error(`Child process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error("Error running Prisma commands:", error);
    return false;
  }
}

const index_delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_delete
});

const get_get = defineEventHandler(async (event) => {
  try {
    const { tableName } = getQuery$1(event);
    if (!tableName) {
      return {
        statusCode: 400,
        message: "Table name is required"
      };
    }
    const result = await prisma$1.$queryRaw`SELECT DATABASE() AS db_name`;
    if (result.length === 0) {
      return {
        statusCode: 500,
        message: "Please check your database connection"
      };
    }
    let sqlRaw = `  SELECT 
                        c.COLUMN_NAME, 
                        c.DATA_TYPE, 
                        c.CHARACTER_MAXIMUM_LENGTH, 
                        c.COLUMN_DEFAULT, 
                        c.IS_NULLABLE, 
                        c.COLUMN_KEY,
                        kcu.REFERENCED_TABLE_NAME,
                        kcu.REFERENCED_COLUMN_NAME
                    FROM 
                        INFORMATION_SCHEMA.COLUMNS c
                    LEFT JOIN 
                        INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON 
                        c.TABLE_SCHEMA = kcu.TABLE_SCHEMA AND 
                        c.TABLE_NAME = kcu.TABLE_NAME AND 
                        c.COLUMN_NAME = kcu.COLUMN_NAME
                    WHERE 
                        c.TABLE_SCHEMA = '${result[0].db_name}' AND 
                        c.TABLE_NAME = '${tableName}';`;
    const getTableDetails = await prisma$1.$queryRawUnsafe(sqlRaw);
    let tableDetailsData = [];
    for (let i = 0; i < getTableDetails.length; i++) {
      const table = getTableDetails[i];
      tableDetailsData.push({
        name: table.COLUMN_NAME,
        type: table.REFERENCED_TABLE_NAME ? `[[${table.REFERENCED_TABLE_NAME}]]` : table.DATA_TYPE.toUpperCase(),
        length: bigIntToNumber(table.CHARACTER_MAXIMUM_LENGTH),
        defaultValue: table.COLUMN_DEFAULT,
        nullable: table.IS_NULLABLE === "YES",
        primaryKey: table.COLUMN_KEY === "PRI",
        actions: {}
      });
    }
    return {
      statusCode: 200,
      message: "Success",
      data: tableDetailsData
    };
  } catch (error) {
    console.log(error.message);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});
function bigIntToNumber(bigInt) {
  if (bigInt === null)
    return null;
  return Number(bigInt.toString());
}

const get_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: get_get
});

const index_post$s = defineEventHandler(async (event) => {
  try {
    const { tableName, tableSchema, autoIncrementColumn } = await readBody(event);
    if (!tableName || !tableSchema) {
      return {
        statusCode: 400,
        message: "Bad Request"
      };
    }
    const existingColumns = await prisma$1.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${tableName}
    `;
    for (const column of tableSchema) {
      const existingColumn = existingColumns.find(
        (c) => c.COLUMN_NAME === column.name
      );
      if (existingColumn) {
        await modifyColumn(tableName, column, existingColumn);
      } else {
        await addColumn(tableName, column);
      }
    }
    for (const existingColumn of existingColumns) {
      if (!tableSchema.find((c) => c.name === existingColumn.COLUMN_NAME)) {
        await removeColumn(tableName, existingColumn.COLUMN_NAME);
      }
    }
    if (autoIncrementColumn) {
      await updateAutoIncrement(tableName, autoIncrementColumn);
    }
    const isPrismaCommandRun = await runPrismaCommand();
    if (!isPrismaCommandRun) {
      return {
        statusCode: 500,
        message: "Prisma Command Failed"
      };
    }
    return {
      statusCode: 200,
      message: "Table modified successfully"
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      message: "Internal Server Error"
    };
  }
});
async function modifyColumn(tableName, newColumn, existingColumn) {
  let alterStatement = `ALTER TABLE ${tableName} MODIFY COLUMN ${newColumn.name} ${newColumn.type}`;
  if (newColumn.length) {
    alterStatement += `(${newColumn.length})`;
  }
  alterStatement += newColumn.nullable ? " NULL" : " NOT NULL";
  if (newColumn.defaultValue) {
    alterStatement += ` DEFAULT ${newColumn.defaultValue}`;
  }
  await prisma$1.$executeRawUnsafe(alterStatement);
}
async function addColumn(tableName, column) {
  let alterStatement = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;
  if (column.length) {
    alterStatement += `(${column.length})`;
  }
  alterStatement += column.nullable ? " NULL" : " NOT NULL";
  if (column.defaultValue) {
    alterStatement += ` DEFAULT ${column.defaultValue}`;
  }
  await prisma$1.$executeRawUnsafe(alterStatement);
}
async function removeColumn(tableName, columnName) {
  await prisma$1.$executeRawUnsafe(
    `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`
  );
}
async function updateAutoIncrement(tableName, autoIncrementColumn) {
  await prisma$1.$executeRawUnsafe(
    `ALTER TABLE ${tableName} MODIFY ${autoIncrementColumn} INT AUTO_INCREMENT`
  );
}
async function runPrismaCommand(retries = 3) {
  try {
    console.log("---------- Run Prisma Command ----------");
    const __dirname = dirname(fileURLToPath(globalThis._importMeta_.url));
    const directory = resolve(__dirname, "../..");
    const command = "npx prisma db pull && npx prisma generate";
    let shellCommand;
    let spawnOptions;
    switch (os.platform()) {
      case "win32":
        shellCommand = `Start-Process cmd -ArgumentList '/c cd "${directory}" && ${command}' -Verb RunAs`;
        spawnOptions = {
          shell: "powershell.exe",
          args: ["-Command", shellCommand]
        };
        break;
      case "darwin":
      case "linux":
        shellCommand = `cd "${directory}" && ${command}`;
        spawnOptions = {
          shell: "sh",
          args: ["-c", shellCommand]
        };
        break;
      default:
        console.error("Unsupported platform:", os.platform());
        return false;
    }
    const childProcess = spawn(spawnOptions.shell, spawnOptions.args, {
      stdio: "inherit"
    });
    return new Promise((resolve2, reject) => {
      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Prisma commands executed successfully");
          resolve2(true);
        } else {
          console.error(`Child process exited with code ${code}`);
          reject(new Error(`Child process exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error("Error running Prisma commands:", error);
    return false;
  }
}

const index_post$t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$s
});

const add$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const allRole = await prisma$1.role.findMany({
      where: {
        roleStatus: "ACTIVE"
      }
    });
    const roleExist = allRole.find((role2) => {
      return (role2 == null ? void 0 : role2.roleName.toLowerCase()) === (body == null ? void 0 : body.name.toLowerCase());
    });
    if (roleExist) {
      return {
        statusCode: 400,
        message: "Role already exists"
      };
    }
    const role = await prisma$1.role.create({
      data: {
        roleName: body.name,
        roleDescription: body.description || "",
        roleStatus: "ACTIVE",
        roleCreatedDate: /* @__PURE__ */ new Date()
      }
    });
    if (role) {
      if (body.users && Array.isArray(body.users)) {
        const userRoles = await Promise.all(
          body.users.map(async (el) => {
            const user = await prisma$1.user.findFirst({
              where: {
                userUsername: el.value
              }
            });
            if (user) {
              return prisma$1.userrole.create({
                data: {
                  userRoleUserID: user.userID,
                  userRoleRoleID: role.roleID,
                  userRoleCreatedDate: /* @__PURE__ */ new Date()
                }
              });
            }
            return null;
          })
        );
        const validUserRoles = userRoles.filter(Boolean);
        return {
          statusCode: 200,
          message: "Role successfully added!",
          data: {
            role,
            assignedUsers: validUserRoles.length,
            totalUsers: body.users.length
          }
        };
      }
      return {
        statusCode: 200,
        message: "Role successfully added!",
        data: { role }
      };
    } else {
      return {
        statusCode: 500,
        message: "Something went wrong! Please contact your administrator."
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const add$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: add$2
});

const _delete$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const user = await prisma$1.role.updateMany({
      where: {
        roleID: body.id
      },
      data: {
        roleStatus: "DELETED",
        roleModifiedDate: /* @__PURE__ */ new Date()
      }
    });
    if (user) {
      return {
        statusCode: 200,
        message: "User deleted successfully"
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const _delete$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _delete$2
});

const edit$2 = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const role = await prisma$1.role.update({
      where: {
        roleID: body.id
      },
      data: {
        roleName: body.name,
        roleDescription: body.description,
        roleModifiedDate: /* @__PURE__ */ new Date()
      }
    });
    if (role) {
      await prisma$1.userrole.deleteMany({
        where: {
          userRoleRoleID: body.id
        }
      });
      if (body.users && Array.isArray(body.users)) {
        const userRoles = await Promise.all(
          body.users.map(async (el) => {
            const user = await prisma$1.user.findFirst({
              where: {
                userUsername: el.value
              }
            });
            if (user) {
              return prisma$1.userrole.create({
                data: {
                  userRoleUserID: user.userID,
                  userRoleRoleID: body.id,
                  userRoleCreatedDate: /* @__PURE__ */ new Date()
                }
              });
            }
            return null;
          })
        );
        const validUserRoles = userRoles.filter(Boolean);
        return {
          statusCode: 200,
          message: "Role successfully edited!",
          data: {
            role,
            assignedUsers: validUserRoles.length,
            totalUsers: body.users.length
          }
        };
      }
      return {
        statusCode: 200,
        message: "Role successfully edited!",
        data: { role }
      };
    } else {
      return {
        statusCode: 500,
        message: "Something went wrong! Please contact your administrator."
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const edit$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: edit$2
});

const list$2 = defineEventHandler(async (event) => {
  try {
    const roles = await prisma$1.role.findMany({
      select: {
        roleID: true,
        roleName: true,
        roleDescription: true,
        roleStatus: true,
        roleCreatedDate: true,
        roleModifiedDate: true
      },
      where: {
        roleStatus: {
          not: "DELETED"
        },
        roleID: {
          not: 1
        }
      }
    });
    if (roles) {
      for (let i = 0; i < roles.length; i++) {
        let userOfRole = await prisma$1.userrole.findMany({
          select: {
            user: {
              select: {
                userUsername: true
              }
            }
          },
          where: {
            userRoleRoleID: roles[i].roleID
          }
        });
        roles[i].users = userOfRole;
      }
      return {
        statusCode: 200,
        message: "Roles successfully fetched",
        data: roles
      };
    } else {
      return {
        statusCode: 404,
        message: "No Roles found"
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const list$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list$2
});

const add = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const password = sha256("abc123").toString();
  let secretKey = generateSecretKey();
  try {
    const allUser = await prisma$1.user.findMany({
      where: {
        userStatus: "ACTIVE"
      }
    });
    const userExist = allUser.find((user2) => {
      return (user2 == null ? void 0 : user2.userUsername.toLowerCase()) === (body == null ? void 0 : body.username.toLowerCase());
    });
    if (userExist)
      return {
        statusCode: 400,
        message: "Username already exists"
      };
    do {
      secretKey = generateSecretKey();
    } while (allUser.find((user2) => {
      return (user2 == null ? void 0 : user2.userSecretKey) === secretKey;
    }));
    const user = await prisma$1.user.create({
      data: {
        userSecretKey: secretKey,
        userUsername: body.username,
        userPassword: password,
        userFullName: (body == null ? void 0 : body.fullname) || "",
        userEmail: (body == null ? void 0 : body.email) || "",
        userPhone: (body == null ? void 0 : body.phone) || "",
        userStatus: "ACTIVE",
        userCreatedDate: /* @__PURE__ */ new Date()
      }
    });
    if (user) {
      if (body.role && Array.isArray(body.role)) {
        const userRoles = await Promise.all(
          body.role.map(async (role) => {
            const existingRole = await prisma$1.role.findFirst({
              where: {
                roleID: role.value
              }
            });
            if (existingRole) {
              return prisma$1.userrole.create({
                data: {
                  userRoleUserID: user.userID,
                  userRoleRoleID: role.value,
                  userRoleCreatedDate: /* @__PURE__ */ new Date()
                }
              });
            }
            return null;
          })
        );
        const validUserRoles = userRoles.filter(Boolean);
        return {
          statusCode: 200,
          message: "User successfully added!",
          data: {
            user,
            assignedRoles: validUserRoles.length,
            totalRoles: body.role.length
          }
        };
      }
      return {
        statusCode: 200,
        message: "User successfully added!",
        data: { user }
      };
    } else {
      return {
        statusCode: 500,
        message: "Something went wrong! Please contact your administrator."
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});
function generateSecretKey() {
  let secretKey = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      secretKey += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (i < 3) {
      secretKey += "-";
    }
  }
  return secretKey;
}

const add$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: add
});

const _delete = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const user = await prisma$1.user.updateMany({
      where: {
        userUsername: body.username
      },
      data: {
        userStatus: "DELETED",
        userModifiedDate: /* @__PURE__ */ new Date()
      }
    });
    if (user) {
      return {
        statusCode: 200,
        message: "User deleted successfully"
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const _delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _delete
});

const edit = defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const user = await prisma$1.user.updateMany({
      where: {
        userUsername: body.username
      },
      data: {
        userFullName: (body == null ? void 0 : body.fullname) || "",
        userEmail: (body == null ? void 0 : body.email) || "",
        userPhone: (body == null ? void 0 : body.phone) || "",
        userStatus: body.status,
        userModifiedDate: /* @__PURE__ */ new Date()
      }
    });
    if (user.count > 0) {
      const getUserID = await prisma$1.user.findFirst({
        where: {
          userUsername: body.username
        }
      });
      if (getUserID) {
        await prisma$1.userrole.deleteMany({
          where: {
            userRoleUserID: getUserID.userID
          }
        });
        if (body.role && Array.isArray(body.role)) {
          const userRoles = await Promise.all(
            body.role.map(async (role) => {
              const existingRole = await prisma$1.role.findFirst({
                where: {
                  roleID: role.value
                }
              });
              if (existingRole) {
                return prisma$1.userrole.create({
                  data: {
                    userRoleUserID: getUserID.userID,
                    userRoleRoleID: role.value,
                    userRoleCreatedDate: /* @__PURE__ */ new Date()
                  }
                });
              }
              return null;
            })
          );
          const validUserRoles = userRoles.filter(Boolean);
          return {
            statusCode: 200,
            message: "User updated successfully",
            data: {
              assignedRoles: validUserRoles.length,
              totalRoles: body.role.length
            }
          };
        }
        return {
          statusCode: 200,
          message: "User updated successfully"
        };
      }
    }
    return {
      statusCode: 404,
      message: "User not found"
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const edit$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: edit
});

const list = defineEventHandler(async (event) => {
  try {
    const users = await prisma$1.user.findMany({
      select: {
        userID: true,
        userUsername: true,
        userFullName: true,
        userEmail: true,
        userPhone: true,
        userStatus: true,
        userCreatedDate: true,
        userModifiedDate: true
      },
      where: {
        userStatus: {
          not: "DELETED"
        }
      }
    });
    if (users) {
      for (let i = 0; i < users.length; i++) {
        let roleOfUser = await prisma$1.userrole.findMany({
          select: {
            role: {
              select: {
                roleID: true,
                roleName: true
              }
            }
          },
          where: {
            userRoleUserID: users[i].userID
          }
        });
        users[i].roles = roleOfUser;
      }
      return {
        statusCode: 200,
        message: "Users successfully fetched",
        data: users
      };
    } else {
      return {
        statusCode: 404,
        message: "No users found"
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      message: error.message
    };
  }
});

const list$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: list
});

const _id__delete$c = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Fund type ID is required"
      };
    }
    const existingFundType = await prisma$1.fund_type.findUnique({
      where: {
        fty_fund_id: parseInt(id)
      }
    });
    if (!existingFundType) {
      return {
        statusCode: 404,
        message: "Fund type not found"
      };
    }
    await prisma$1.fund_type.delete({
      where: {
        fty_fund_id: parseInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Fund type deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting fund type:", error);
    if (error.code === "P2003" || error.message.includes("Foreign key constraint")) {
      return {
        statusCode: 409,
        message: "Cannot delete fund type because it is being used by other records",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while deleting fund type",
      error: error.message
    };
  }
});

const _id__delete$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$c
});

const _id__put$g = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "Fund type ID is required"
      };
    }
    const existingFundType = await prisma$1.fund_type.findUnique({
      where: {
        fty_fund_id: parseInt(id)
      }
    });
    if (!existingFundType) {
      return {
        statusCode: 404,
        message: "Fund type not found"
      };
    }
    if (body.fundType && body.fundType !== existingFundType.fty_fund_type) {
      const duplicateFundType = await prisma$1.fund_type.findUnique({
        where: {
          fty_fund_type: body.fundType
        }
      });
      if (duplicateFundType) {
        return {
          statusCode: 409,
          message: "Fund type code already exists"
        };
      }
    }
    const updatedFundType = await prisma$1.fund_type.update({
      where: {
        fty_fund_id: parseInt(id)
      },
      data: {
        fty_fund_type: body.fundType || existingFundType.fty_fund_type,
        fty_fund_desc: body.descriptionMalay || existingFundType.fty_fund_desc,
        fty_fund_desc_eng: body.descriptionEnglish !== void 0 ? body.descriptionEnglish : existingFundType.fty_fund_desc_eng,
        fty_basis: body.typeBasis !== void 0 ? body.typeBasis : existingFundType.fty_basis,
        fty_status: body.status || existingFundType.fty_status,
        fty_remark: body.remark !== void 0 ? body.remark : existingFundType.fty_remark,
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Fund type updated successfully",
      data: updatedFundType
    };
  } catch (error) {
    console.error("Error updating fund type:", error);
    return {
      statusCode: 500,
      message: "An error occurred while updating fund type",
      error: error.message
    };
  }
});

const _id__put$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$g
});

const index_get$1M = defineEventHandler(async (event) => {
  try {
    const fundTypes = await prisma$1.fund_type.findMany({
      orderBy: {
        fty_fund_type: "asc"
      }
    });
    const formattedData = fundTypes.map((item, index) => ({
      no: index + 1,
      fty_fund_id: item.fty_fund_id,
      fundType: item.fty_fund_type,
      descriptionMalay: item.fty_fund_desc,
      descriptionEnglish: item.fty_fund_desc_eng || "",
      typeBasis: item.fty_basis || "",
      status: (() => {
        const statusValue = item.fty_status;
        if (!statusValue)
          return "INACTIVE";
        const statusStr = String(statusValue).trim();
        return statusStr === "1" || statusStr === "ACTIVE" ? "ACTIVE" : "INACTIVE";
      })(),
      remark: item.fty_remark || "",
      action: ""
      // Empty string for action column
    }));
    return {
      statusCode: 200,
      message: "Fund types fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching fund types:", error);
    return {
      statusCode: 500,
      message: "An error occurred while fetching fund types",
      error: error.message
    };
  }
});

const index_get$1N = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1M
});

const index_post$q = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.fundType || !body.descriptionMalay || !body.typeBasis || !body.status) {
      return {
        statusCode: 400,
        message: "Missing required fields: fundType, descriptionMalay, typeBasis, and status are required"
      };
    }
    const existingFundType = await prisma$1.fund_type.findUnique({
      where: {
        fty_fund_type: body.fundType
      }
    });
    if (existingFundType) {
      return {
        statusCode: 409,
        message: "Fund type already exists"
      };
    }
    const newFundType = await prisma$1.fund_type.create({
      data: {
        fty_fund_type: body.fundType,
        fty_fund_desc: body.descriptionMalay,
        fty_fund_desc_eng: body.descriptionEnglish || null,
        fty_basis: body.typeBasis || null,
        fty_status: body.status,
        fty_remark: body.remark || null,
        createddate: /* @__PURE__ */ new Date(),
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Fund type created successfully",
      data: newFundType
    };
  } catch (error) {
    console.error("Error creating fund type:", error);
    return {
      statusCode: 500,
      message: "An error occurred while creating fund type",
      error: error.message
    };
  }
});

const index_post$r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$q
});

const messageLog_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      mm_mesg_code,
      ml_user_id,
      ml_user_role,
      ml_page_name,
      ml_module_name,
      ml_page_breadcrumb
    } = body || {};
    const mesgCode = mm_mesg_code || "TRX-CNF-002";
    const createdby = ml_user_id || "system";
    const record = await prisma$1.adm_message_log.create({
      data: {
        mm_mesg_code: mesgCode,
        ml_user_action: "CONFIRM",
        ml_root_cause: "TRANSACTION",
        ml_user_id: ml_user_id || null,
        ml_user_role: ml_user_role || null,
        ml_page_name: ml_page_name || null,
        ml_module_name: ml_module_name || null,
        ml_page_breadcrumb: ml_page_breadcrumb || null,
        createdby
      }
    });
    return {
      statusCode: 200,
      message: "Message log recorded",
      data: { id: record.ml_message_log_id }
    };
  } catch (error) {
    console.error("Error writing message log:", error);
    return {
      statusCode: 500,
      message: "Failed to write message log",
      error: (error == null ? void 0 : error.message) || "Unknown error"
    };
  }
});

const messageLog_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: messageLog_post
});

const token_get = defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const METABASE_SECRET_KEY = config.metabase.secretKey;
  const payload = {
    resource: { dashboard: 2 },
    params: {},
    exp: Math.round(Date.now() / 1e3) + 10 * 60
    // 10 minute expiration
  };
  try {
    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    return {
      success: true,
      token,
      siteUrl: config.metabase.siteUrl
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate Metabase token"
    });
  }
});

const token_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: token_get
});

const _id__delete$a = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const pages = readPages$1();
    const pageIndex = pages.findIndex((p) => parseInt(p.pageId) === id);
    if (pageIndex === -1) {
      return {
        statusCode: 404,
        message: "Page not found"
      };
    }
    pages.splice(pageIndex, 1);
    writePages$1(pages);
    return {
      statusCode: 200,
      message: "Page deleted successfully",
      data: buildResponseData$2(pages)
    };
  } catch (error) {
    console.error("Error deleting page:", error);
    return {
      statusCode: 500,
      message: "Failed to delete page",
      error: error.message
    };
  }
});

const _id__delete$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$a
});

const _id__put$e = defineEventHandler(async (event) => {
  var _a, _b, _c;
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    const pageTitle = (_a = body == null ? void 0 : body.pageTitle) == null ? void 0 : _a.toString().trim();
    const menu = ((_b = body == null ? void 0 : body.menu) == null ? void 0 : _b.toString().trim()) || "";
    const status = ((_c = body == null ? void 0 : body.status) == null ? void 0 : _c.toString().trim()) || "ACTIVE";
    if (!pageTitle) {
      return {
        statusCode: 400,
        message: "Page Title is required"
      };
    }
    if (!status || status !== "ACTIVE" && status !== "INACTIVE") {
      return {
        statusCode: 400,
        message: "Status must be either ACTIVE or INACTIVE"
      };
    }
    const pages = readPages$1();
    const pageIndex = pages.findIndex((p) => parseInt(p.pageId) === id);
    if (pageIndex === -1) {
      return {
        statusCode: 404,
        message: "Page not found"
      };
    }
    if (menu) {
      const existingPageWithMenu = pages.find((p) => p.menu === menu && parseInt(p.pageId) !== id);
      if (existingPageWithMenu) {
        return {
          statusCode: 400,
          message: "This menu is already attached to another page"
        };
      }
    }
    const existingPage = pages[pageIndex];
    pages[pageIndex] = {
      ...existingPage,
      pageTitle,
      menu,
      status,
      updateTimestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    writePages$1(pages);
    return {
      statusCode: 200,
      message: "Page updated successfully",
      data: buildResponseData$2(pages)
    };
  } catch (error) {
    console.error("Error updating page:", error);
    return {
      statusCode: 500,
      message: "Failed to update page",
      error: error.message
    };
  }
});

const _id__put$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$e
});

const extractMenuPaths = (items, paths = []) => {
  items.forEach((item) => {
    if (item.path && item.path !== "/") {
      paths.push(item.path);
    }
    if (item.child && item.child.length > 0) {
      extractMenuPaths(item.child, paths);
    }
  });
  return paths;
};
const availableMenus_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const excludePageId = query.excludePageId ? parseInt(query.excludePageId) : null;
    const pages = readPages$1();
    const attachedMenus = pages.filter((p) => {
      if (excludePageId && parseInt(p.pageId) === excludePageId) {
        return false;
      }
      return p.menu && p.menu.trim() !== "";
    }).map((p) => p.menu);
    const allMenuPaths = [];
    Menu.forEach((section) => {
      if (section.child) {
        extractMenuPaths(section.child, allMenuPaths);
      }
    });
    const availableMenus = allMenuPaths.filter((menuPath) => {
      if (attachedMenus.includes(menuPath)) {
        return false;
      }
      return true;
    });
    const menuOptions = availableMenus.map((path2) => ({
      label: path2,
      value: path2
    }));
    return {
      statusCode: 200,
      message: "Available menus fetched successfully",
      data: menuOptions
    };
  } catch (error) {
    console.error("Error fetching available menus:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch available menus",
      error: error.message
    };
  }
});

const availableMenus_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: availableMenus_get
});

const import_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    const body = await readBody(event);
    const selectedFiles = (body == null ? void 0 : body.files) || [];
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`
      };
    }
    let files = [];
    if (selectedFiles.length === 0) {
      files = fs.readdirSync(migrationFolder).filter(
        (file) => file.toLowerCase().endsWith(".json")
      );
    } else {
      files = selectedFiles.filter(
        (file) => file.toLowerCase().endsWith(".json") && fs.existsSync(path.join(migrationFolder, file))
      );
    }
    if (files.length === 0) {
      return {
        statusCode: 404,
        message: "No JSON files found to import",
        error: selectedFiles.length > 0 ? "Selected files not found or invalid" : `No .json files found in ${migrationFolder}`
      };
    }
    const existingPages = readPages$1();
    const existingPageIds = new Set(existingPages.map((p) => parseInt(p.pageId) || 0));
    const existingMenus = new Set(
      existingPages.filter((p) => p.menu && p.menu.trim() !== "").map((p) => p.menu)
    );
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors = [];
    const nextPageId = getNextPageId$1();
    let currentPageId = nextPageId;
    for (const file of files) {
      try {
        const filePath = path.join(migrationFolder, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        let jsonData;
        try {
          jsonData = JSON.parse(fileContent);
        } catch (parseError) {
          errors.push(`File ${file}: Invalid JSON format - ${parseError.message}`);
          errorCount++;
          continue;
        }
        const pagesToImport = Array.isArray(jsonData) ? jsonData : [jsonData];
        for (const pageData of pagesToImport) {
          if (!pageData.pageTitle || !pageData.pageTitle.toString().trim()) {
            errors.push(`File ${file}: Missing or empty pageTitle`);
            skippedCount++;
            continue;
          }
          const pageTitle = pageData.pageTitle.toString().trim();
          const menu = pageData.menu ? pageData.menu.toString().trim() : "";
          const status = ((_a = pageData.status) == null ? void 0 : _a.toString().trim()) || "ACTIVE";
          if (status !== "ACTIVE" && status !== "INACTIVE") {
            errors.push(`File ${file}, Page "${pageTitle}": Invalid status "${status}", defaulting to ACTIVE`);
          }
          let pageId;
          if (pageData.pageId !== void 0 && pageData.pageId !== null) {
            const providedPageId = parseInt(pageData.pageId);
            if (providedPageId > 0 && !existingPageIds.has(providedPageId)) {
              pageId = providedPageId;
              existingPageIds.add(pageId);
            } else {
              pageId = currentPageId++;
              existingPageIds.add(pageId);
            }
          } else {
            pageId = currentPageId++;
            existingPageIds.add(pageId);
          }
          if (menu && existingMenus.has(menu)) {
            errors.push(`File ${file}, Page "${pageTitle}": Menu "${menu}" is already attached to another page, skipping menu assignment`);
          } else if (menu) {
            existingMenus.add(menu);
          }
          const newPage = {
            pageId,
            pageTitle,
            menu: menu || "",
            status: status === "ACTIVE" || status === "INACTIVE" ? status : "ACTIVE",
            createdTimestamp: pageData.createdTimestamp || (/* @__PURE__ */ new Date()).toISOString(),
            updateTimestamp: pageData.updateTimestamp || null
          };
          existingPages.push(newPage);
          importedCount++;
        }
      } catch (fileError) {
        errors.push(`File ${file}: ${fileError.message}`);
        errorCount++;
      }
    }
    if (importedCount > 0) {
      writePages$1(existingPages);
    }
    return {
      statusCode: 200,
      message: `Import completed: ${importedCount} pages imported, ${skippedCount} skipped, ${errorCount} files with errors`,
      data: {
        imported: importedCount,
        skipped: skippedCount,
        errors: errorCount,
        totalFiles: files.length,
        errorsList: errors
      }
    };
  } catch (error) {
    console.error("Error importing pages:", error);
    return {
      statusCode: 500,
      message: "Failed to import pages",
      error: error.message
    };
  }
});

const import_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: import_post
});

const index_get$1K = defineEventHandler(async () => {
  try {
    const pages = readPages$1();
    return {
      statusCode: 200,
      message: "Pages fetched successfully",
      data: buildResponseData$2(pages)
    };
  } catch (error) {
    console.error("Error reading pages:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch pages",
      error: error.message
    };
  }
});

const index_get$1L = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1K
});

const index_post$o = defineEventHandler(async (event) => {
  var _a, _b, _c;
  try {
    const body = await readBody(event);
    const pageTitle = (_a = body == null ? void 0 : body.pageTitle) == null ? void 0 : _a.toString().trim();
    const menu = ((_b = body == null ? void 0 : body.menu) == null ? void 0 : _b.toString().trim()) || "";
    const status = ((_c = body == null ? void 0 : body.status) == null ? void 0 : _c.toString().trim()) || "ACTIVE";
    if (!pageTitle) {
      return {
        statusCode: 400,
        message: "Page Title is required"
      };
    }
    if (!status || status !== "ACTIVE" && status !== "INACTIVE") {
      return {
        statusCode: 400,
        message: "Status must be either ACTIVE or INACTIVE"
      };
    }
    const pages = readPages$1();
    const pageId = getNextPageId$1();
    if (menu) {
      const existingPageWithMenu = pages.find((p) => p.menu === menu && p.pageId !== pageId);
      if (existingPageWithMenu) {
        return {
          statusCode: 400,
          message: "This menu is already attached to another page"
        };
      }
    }
    const newPage = {
      pageId,
      pageTitle,
      menu,
      status,
      createdTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      updateTimestamp: null
    };
    pages.push(newPage);
    writePages$1(pages);
    return {
      statusCode: 200,
      message: "Page created successfully",
      data: buildResponseData$2(pages)
    };
  } catch (error) {
    console.error("Error creating page:", error);
    return {
      statusCode: 500,
      message: "Failed to create page",
      error: error.message
    };
  }
});

const index_post$p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$o
});

const migrationFiles_get = defineEventHandler(async (event) => {
  try {
    const migrationFolder = "C:\\KerisiAI\\Migration";
    if (!fs.existsSync(migrationFolder)) {
      return {
        statusCode: 404,
        message: "Migration folder not found",
        error: `Folder ${migrationFolder} does not exist`,
        data: []
      };
    }
    const files = fs.readdirSync(migrationFolder).filter((file) => file.toLowerCase().endsWith(".json")).map((file) => {
      const filePath = path.join(migrationFolder, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        modified: stats.mtime.toISOString()
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
    return {
      statusCode: 200,
      message: "Migration files fetched successfully",
      data: files
    };
  } catch (error) {
    console.error("Error fetching migration files:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch migration files",
      error: error.message,
      data: []
    };
  }
});

const migrationFiles_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: migrationFiles_get
});

const dbFilePath = path.join(process.cwd(), "database", "penyuntingmuka.json");
const ensureDatabaseFile = () => {
  if (!fs.existsSync(path.dirname(dbFilePath))) {
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  }
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, "[]", "utf8");
  }
};
const readPages = () => {
  ensureDatabaseFile();
  const raw = fs.readFileSync(dbFilePath, "utf8") || "[]";
  const pages = JSON.parse(raw);
  return pages.map((item) => ({
    ...item,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0
  }));
};
const writePages = (data) => {
  ensureDatabaseFile();
  const normalizedData = data.map((item) => ({
    ...item,
    pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0
  }));
  fs.writeFileSync(dbFilePath, JSON.stringify(normalizedData, null, 2), "utf8");
};
const getNextPageId = () => {
  const pages = readPages();
  if (pages.length === 0) {
    return 1;
  }
  const maxId = Math.max(...pages.map((item) => parseInt(item.pageId) || 0));
  return maxId + 1;
};
const buildResponseData = (pages) => pages.map((item, index) => ({
  no: index + 1,
  pageId: typeof item.pageId === "number" ? item.pageId : parseInt(item.pageId) || 0,
  pageTitle: item.pageTitle,
  action: ""
}));

const helpers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  buildResponseData: buildResponseData,
  getNextPageId: getNextPageId,
  readPages: readPages,
  writePages: writePages
});

const _id__delete$8 = defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params;
    const pageId = parseInt(id);
    if (isNaN(pageId)) {
      return {
        statusCode: 400,
        message: "Invalid page id"
      };
    }
    const pages = readPages();
    const filtered = pages.filter(
      (item) => parseInt(item.pageId) !== pageId
    );
    if (filtered.length === pages.length) {
      return {
        statusCode: 404,
        message: "Page not found"
      };
    }
    writePages(filtered);
    return {
      statusCode: 200,
      message: "Page deleted successfully",
      data: buildResponseData(filtered)
    };
  } catch (error) {
    console.error("Error deleting page:", error);
    return {
      statusCode: 500,
      message: "Failed to delete page",
      error: error.message
    };
  }
});

const _id__delete$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$8
});

const _id__put$c = defineEventHandler(async (event) => {
  var _a;
  try {
    const { id } = event.context.params;
    const body = await readBody(event);
    const pageTitle = (_a = body == null ? void 0 : body.pageTitle) == null ? void 0 : _a.toString().trim();
    if (!pageTitle) {
      return {
        statusCode: 400,
        message: "Page Title is required"
      };
    }
    const pages = readPages();
    const pageId = parseInt(id);
    if (isNaN(pageId)) {
      return {
        statusCode: 400,
        message: "Invalid page id"
      };
    }
    const index = pages.findIndex(
      (item) => parseInt(item.pageId) === pageId
    );
    if (index === -1) {
      return {
        statusCode: 404,
        message: "Page not found"
      };
    }
    pages[index] = { pageId, pageTitle };
    writePages(pages);
    return {
      statusCode: 200,
      message: "Page updated successfully",
      data: buildResponseData(pages)
    };
  } catch (error) {
    console.error("Error updating page:", error);
    return {
      statusCode: 500,
      message: "Failed to update page",
      error: error.message
    };
  }
});

const _id__put$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$c
});

const index_get$1I = defineEventHandler(async () => {
  try {
    const pages = readPages();
    return {
      statusCode: 200,
      message: "Pages fetched successfully",
      data: buildResponseData(pages)
    };
  } catch (error) {
    console.error("Error reading pages:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch pages",
      error: error.message
    };
  }
});

const index_get$1J = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1I
});

const index_post$m = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    const pageTitle = (_a = body == null ? void 0 : body.pageTitle) == null ? void 0 : _a.toString().trim();
    if (!pageTitle) {
      return {
        statusCode: 400,
        message: "Page Title is required"
      };
    }
    const pages = readPages();
    const pageId = getNextPageId();
    pages.push({ pageId, pageTitle });
    writePages(pages);
    return {
      statusCode: 200,
      message: "Page created successfully",
      data: buildResponseData(pages)
    };
  } catch (error) {
    console.error("Error creating page:", error);
    return {
      statusCode: 500,
      message: "Failed to create page",
      error: error.message
    };
  }
});

const index_post$n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$m
});

const nextId_get = defineEventHandler(async () => {
  try {
    const nextId = getNextPageId();
    return {
      statusCode: 200,
      message: "Next page id fetched successfully",
      data: { nextPageId: nextId }
    };
  } catch (error) {
    console.error("Error getting next page id:", error);
    return {
      statusCode: 500,
      message: "Failed to get next page id",
      error: error.message
    };
  }
});

const nextId_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: nextId_get
});

const creditDetails_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    if (!query.pmt_posting_id) {
      return {
        statusCode: 400,
        message: "pmt_posting_id is required"
      };
    }
    const postingId = parseInt(query.pmt_posting_id);
    const searchTerm = query.search ? query.search.trim() : "";
    const start = parseInt(query.start) || 0;
    const length = parseInt(query.length) || 10;
    const orderBy = query.orderBy || "pde_posting_detl_id";
    const orderDirection = query.orderDirection || "asc";
    const where = {
      pmt_posting_id: postingId,
      pde_trans_type: "CR",
      pde_status: "APPROVE"
    };
    if (searchTerm) {
      where.OR = [
        { fty_fund_type: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { acm_acct_code: { contains: searchTerm } },
        { pde_document_no: { contains: searchTerm } },
        { pde_reference: { contains: searchTerm } },
        { pde_reference1: { contains: searchTerm } },
        { pde_payto_id: { contains: searchTerm } },
        { pde_payto_name: { contains: searchTerm } }
      ];
    }
    const [count, sumResult] = await Promise.all([
      prisma$1.posting_details.count({ where }),
      prisma$1.posting_details.aggregate({
        where,
        _sum: {
          pde_trans_amt: true
        }
      })
    ]);
    const postingDetails = await prisma$1.posting_details.findMany({
      where,
      include: {
        fund_type: {
          select: {
            fty_fund_type: true,
            fty_fund_desc: true
          }
        },
        organization_unit: {
          select: {
            oun_code: true,
            oun_desc: true
          }
        },
        account_main: {
          select: {
            acm_acct_code: true,
            acm_acct_desc: true
          }
        }
      },
      orderBy: {
        [orderBy]: orderDirection
      },
      skip: start,
      take: length
    });
    const activityCodes = [...new Set(postingDetails.map((d) => d.at_activity_code).filter(Boolean))];
    const activityTypes = activityCodes.length > 0 ? await prisma$1.activity_type.findMany({
      where: {
        at_activity_code: { in: activityCodes }
      },
      select: {
        at_activity_code: true,
        at_activity_description_bm: true
      }
    }) : [];
    const activityTypeMap = new Map(
      activityTypes.map((at) => [at.at_activity_code, at.at_activity_description_bm || ""])
    );
    const formattedData = postingDetails.map((detail) => {
      const fundType = detail.fund_type ? `${detail.fty_fund_type || ""} - ${detail.fund_type.fty_fund_desc || ""}` : detail.fty_fund_type || "";
      const activityDesc = activityTypeMap.get(detail.at_activity_code) || "";
      const activityCode = detail.at_activity_code ? `${detail.at_activity_code} - ${activityDesc}` : "";
      const ounCode = detail.organization_unit ? `${detail.oun_code || ""} - ${detail.organization_unit.oun_desc || ""}` : detail.oun_code || "";
      const acctCode = detail.account_main ? `${detail.acm_acct_code || ""} - ${detail.account_main.acm_acct_desc || ""}` : detail.acm_acct_code || "";
      const paytoInfo = detail.pde_payto_id && detail.pde_payto_name ? `${detail.pde_payto_id} - ${detail.pde_payto_name}` : detail.pde_payto_id || detail.pde_payto_name || "";
      return {
        pmt_posting_id: detail.pmt_posting_id,
        fty_fund_type: fundType,
        at_activity_code: activityCode,
        oun_code: ounCode,
        acm_acct_code: acctCode,
        pde_document_no: detail.pde_document_no ? detail.pde_document_no.trim() : "",
        pde_reference: detail.pde_reference ? detail.pde_reference.trim() : "",
        pde_reference1: detail.pde_reference1 ? detail.pde_reference1.trim() : "",
        pde_trans_amt: detail.pde_trans_amt ? parseFloat(detail.pde_trans_amt).toFixed(2) : "0.00",
        ID: paytoInfo
      };
    });
    const sumCR = sumResult._sum.pde_trans_amt ? parseFloat(sumResult._sum.pde_trans_amt).toFixed(2) : "0.00";
    return {
      statusCode: 200,
      message: "Credit details fetched successfully",
      data: formattedData,
      recordsFiltered: count,
      sumCR
    };
  } catch (error) {
    console.error("Error fetching credit details:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const creditDetails_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: creditDetails_get
});

const debitDetails_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    if (!query.pmt_posting_id) {
      return {
        statusCode: 400,
        message: "pmt_posting_id is required"
      };
    }
    const postingId = parseInt(query.pmt_posting_id);
    const searchTerm = query.search ? query.search.trim() : "";
    const start = parseInt(query.start) || 0;
    const length = parseInt(query.length) || 10;
    const orderBy = query.orderBy || "pde_posting_detl_id";
    const orderDirection = query.orderDirection || "asc";
    const where = {
      pmt_posting_id: postingId,
      pde_trans_type: "DT",
      pde_status: "APPROVE"
    };
    if (searchTerm) {
      where.OR = [
        { fty_fund_type: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { acm_acct_code: { contains: searchTerm } },
        { pde_document_no: { contains: searchTerm } },
        { pde_reference: { contains: searchTerm } },
        { pde_reference1: { contains: searchTerm } },
        { pde_payto_id: { contains: searchTerm } },
        { pde_payto_name: { contains: searchTerm } }
      ];
    }
    const [count, sumResult] = await Promise.all([
      prisma$1.posting_details.count({ where }),
      prisma$1.posting_details.aggregate({
        where,
        _sum: {
          pde_trans_amt: true
        }
      })
    ]);
    const postingDetails = await prisma$1.posting_details.findMany({
      where,
      include: {
        fund_type: {
          select: {
            fty_fund_type: true,
            fty_fund_desc: true
          }
        },
        organization_unit: {
          select: {
            oun_code: true,
            oun_desc: true
          }
        },
        account_main: {
          select: {
            acm_acct_code: true,
            acm_acct_desc: true
          }
        }
      },
      orderBy: {
        [orderBy]: orderDirection
      },
      skip: start,
      take: length
    });
    const activityCodes = [...new Set(postingDetails.map((d) => d.at_activity_code).filter(Boolean))];
    const activityTypes = activityCodes.length > 0 ? await prisma$1.activity_type.findMany({
      where: {
        at_activity_code: { in: activityCodes }
      },
      select: {
        at_activity_code: true,
        at_activity_description_bm: true
      }
    }) : [];
    const activityTypeMap = new Map(
      activityTypes.map((at) => [at.at_activity_code, at.at_activity_description_bm || ""])
    );
    const formattedData = postingDetails.map((detail) => {
      const fundType = detail.fund_type ? `${detail.fty_fund_type || ""} - ${detail.fund_type.fty_fund_desc || ""}` : detail.fty_fund_type || "";
      const activityDesc = activityTypeMap.get(detail.at_activity_code) || "";
      const activityCode = detail.at_activity_code ? `${detail.at_activity_code} - ${activityDesc}` : "";
      const ounCode = detail.organization_unit ? `${detail.oun_code || ""} - ${detail.organization_unit.oun_desc || ""}` : detail.oun_code || "";
      const acctCode = detail.account_main ? `${detail.acm_acct_code || ""} - ${detail.account_main.acm_acct_desc || ""}` : detail.acm_acct_code || "";
      const paytoInfo = detail.pde_payto_id && detail.pde_payto_name ? `${detail.pde_payto_id} - ${detail.pde_payto_name}` : detail.pde_payto_id || detail.pde_payto_name || "";
      return {
        pmt_posting_id: detail.pmt_posting_id,
        fty_fund_type: fundType,
        at_activity_code: activityCode,
        oun_code: ounCode,
        acm_acct_code: acctCode,
        pde_document_no: detail.pde_document_no ? detail.pde_document_no.trim() : "",
        pde_reference: detail.pde_reference ? detail.pde_reference.trim() : "",
        pde_reference1: detail.pde_reference1 ? detail.pde_reference1.trim() : "",
        pde_trans_amt: detail.pde_trans_amt ? parseFloat(detail.pde_trans_amt).toFixed(2) : "0.00",
        ID: paytoInfo
      };
    });
    const sumDT = sumResult._sum.pde_trans_amt ? parseFloat(sumResult._sum.pde_trans_amt).toFixed(2) : "0.00";
    return {
      statusCode: 200,
      message: "Debit details fetched successfully",
      data: formattedData,
      recordsFiltered: count,
      sumDT
    };
  } catch (error) {
    console.error("Error fetching debit details:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const debitDetails_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: debitDetails_get
});

const displayMaster_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    if (!query.pmt_posting_id) {
      return {
        statusCode: 400,
        message: "pmt_posting_id is required"
      };
    }
    const postingId = parseInt(query.pmt_posting_id);
    const postingMaster = await prisma$1.posting_master.findUnique({
      where: {
        pmt_posting_id: postingId
      },
      select: {
        pmt_posting_id: true,
        pmt_total_amt: true,
        pmt_posting_no: true,
        pmt_system_id: true
      }
    });
    if (!postingMaster) {
      return {
        statusCode: 404,
        message: "Posting master not found"
      };
    }
    return {
      statusCode: 200,
      message: "Posting master details fetched successfully",
      data: {
        SEQID: postingMaster.pmt_posting_id.toString(),
        AMOUNT: postingMaster.pmt_total_amt ? parseFloat(postingMaster.pmt_total_amt).toFixed(2) : "0.00",
        POSTINGNO: postingMaster.pmt_posting_no || "",
        SYSTEMID: postingMaster.pmt_system_id || "",
        count: 1
      }
    };
  } catch (error) {
    console.error("Error fetching posting master details:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const displayMaster_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: displayMaster_get
});

const index_get$1G = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const whereConditions = [];
    const params = [];
    whereConditions.push("pm.pmt_status = ?");
    params.push("APPROVE");
    whereConditions.push("PD.pde_status = ?");
    params.push("APPROVE");
    whereConditions.push("pm.pmt_posting_id = PD.pmt_posting_id");
    if (query.pmt_system_id && query.pmt_system_id !== "null" && query.pmt_system_id.trim() !== "") {
      whereConditions.push("pm.pmt_system_id = ?");
      params.push(query.pmt_system_id.trim());
    }
    if (query.pmt_total_amt && query.pmt_total_amt !== "null" && query.pmt_total_amt.trim() !== "") {
      whereConditions.push("pm.pmt_total_amt = ?");
      params.push(parseFloat(query.pmt_total_amt));
    }
    if (query.date_from && query.date_from.trim() !== "") {
      let startDate;
      if (query.date_from.includes("/")) {
        const [day, month, year] = query.date_from.split("/");
        startDate = `${year}-${month}-${day}`;
      } else {
        startDate = query.date_from;
      }
      whereConditions.push("PD.pde_trans_date >= ?");
      params.push(startDate);
    }
    if (query.date_to && query.date_to.trim() !== "") {
      let endDate;
      if (query.date_to.includes("/")) {
        const [day, month, year] = query.date_to.split("/");
        endDate = `${year}-${month}-${day} 23:59:59`;
      } else {
        endDate = query.date_to + " 23:59:59";
      }
      whereConditions.push("PD.pde_trans_date <= ?");
      params.push(endDate);
    }
    if (query.smartFilter_pmt_posting_no && query.smartFilter_pmt_posting_no.trim() !== "") {
      whereConditions.push("pm.pmt_posting_no = ?");
      params.push(query.smartFilter_pmt_posting_no.trim());
    }
    if (query.smartFilter_pmt_system_id && query.smartFilter_pmt_system_id.trim() !== "") {
      whereConditions.push("pm.pmt_system_id = ?");
      params.push(query.smartFilter_pmt_system_id.trim());
    }
    if (query.smartFilter_pmt_status && query.smartFilter_pmt_status.trim() !== "") {
      whereConditions.push("pm.pmt_status = ?");
      params.push(query.smartFilter_pmt_status.trim());
    }
    if (query.smartFilter_date_from && query.smartFilter_date_from.trim() !== "") {
      let startDate;
      if (query.smartFilter_date_from.includes("/")) {
        const [day, month, year] = query.smartFilter_date_from.split("/");
        startDate = `${year}-${month}-${day}`;
      } else {
        startDate = query.smartFilter_date_from;
      }
      whereConditions.push("PD.pde_trans_date >= ?");
      params.push(startDate);
    }
    if (query.smartFilter_date_to && query.smartFilter_date_to.trim() !== "") {
      let endDate;
      if (query.smartFilter_date_to.includes("/")) {
        const [day, month, year] = query.smartFilter_date_to.split("/");
        endDate = `${year}-${month}-${day} 23:59:59`;
      } else {
        endDate = query.smartFilter_date_to + " 23:59:59";
      }
      whereConditions.push("PD.pde_trans_date <= ?");
      params.push(endDate);
    }
    if (query.smartFilter_pde_reference && query.smartFilter_pde_reference.trim() !== "") {
      whereConditions.push("PD.pde_reference = ?");
      params.push(query.smartFilter_pde_reference.trim());
    }
    if (query.smartFilter_pde_reference1 && query.smartFilter_pde_reference1.trim() !== "") {
      whereConditions.push("PD.pde_reference1 = ?");
      params.push(query.smartFilter_pde_reference1.trim());
    }
    if (query.smartFilter_pde_document_no && query.smartFilter_pde_document_no.trim() !== "") {
      whereConditions.push("PD.pde_document_no = ?");
      params.push(query.smartFilter_pde_document_no.trim());
    }
    if (query.search && query.search.trim() !== "") {
      const searchTerm = `%${query.search.trim()}%`;
      const searchNum = parseInt(query.search.trim());
      if (!isNaN(searchNum)) {
        whereConditions.push(`(
          pm.pmt_posting_id = ? OR
          pm.pmt_posting_no LIKE ? OR
          pm.pmt_system_id LIKE ? OR
          pm.pmt_status LIKE ? OR
          PD.pde_document_no LIKE ? OR
          PD.pde_reference LIKE ? OR
          PD.pde_reference1 LIKE ?
        )`);
        params.push(searchNum, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      } else {
        whereConditions.push(`(
          pm.pmt_posting_no LIKE ? OR
          pm.pmt_system_id LIKE ? OR
          pm.pmt_status LIKE ? OR
          PD.pde_document_no LIKE ? OR
          PD.pde_reference LIKE ? OR
          PD.pde_reference1 LIKE ?
        )`);
        params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }
    }
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
    const start = parseInt(query.start) || 0;
    const length = parseInt(query.length) || 10;
    const sortColumn = query.orderBy || "pmt_posting_no";
    const sortDirection = query.orderDirection || "asc";
    const allowedSortColumns = [
      "pmt_posting_id",
      "pmt_posting_no",
      "pde_document_no",
      "pmt_system_id",
      "amountDT",
      "amountCR",
      "pmt_status",
      "pde_reference",
      "pde_reference1",
      "pde_trans_date"
    ];
    const safeSortColumn = allowedSortColumns.includes(sortColumn) ? sortColumn : "pmt_posting_no";
    const safeSortDirection = sortDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const mainQuery = `
      SELECT
        pm.pmt_posting_id,
        pm.pmt_posting_no,
        PD.pde_document_no,
        pm.pmt_system_id,
        SUM(CASE WHEN PD.pde_trans_type = 'DT' THEN PD.pde_trans_amt ELSE 0 END) as amountDT,
        SUM(CASE WHEN PD.pde_trans_type = 'CR' THEN PD.pde_trans_amt ELSE 0 END) as amountCR,
        pm.pmt_status,
        PD.pde_reference as Reference1,
        PD.pde_reference1 as Reference2,
        DATE_FORMAT(PD.pde_trans_date, '%d/%m/%Y') as postedDate
      FROM posting_master pm, posting_details PD
      ${whereClause}
      GROUP BY pm.pmt_posting_id, pm.pmt_posting_no, PD.pde_document_no, pm.pmt_system_id, 
               pm.pmt_status, PD.pde_reference, PD.pde_reference1, PD.pde_trans_date
      ORDER BY ${safeSortColumn} ${safeSortDirection}
      LIMIT ? OFFSET ?
    `;
    const countQuery = `
      SELECT COUNT(*) as total
      FROM (
        SELECT pm.pmt_posting_id
        FROM posting_master pm, posting_details PD
        ${whereClause}
        GROUP BY pm.pmt_posting_id, pm.pmt_posting_no, PD.pde_document_no, pm.pmt_system_id, 
                 pm.pmt_status, PD.pde_reference, PD.pde_reference1, PD.pde_trans_date
      ) as grouped_data
    `;
    const totalsQuery = `
      SELECT
        FORMAT(SUM(CASE WHEN PD.pde_trans_type = 'DT' THEN PD.pde_trans_amt ELSE 0 END), 2) as grandTotalDT,
        FORMAT(SUM(CASE WHEN PD.pde_trans_type = 'CR' THEN PD.pde_trans_amt ELSE 0 END), 2) as grandTotalCR
      FROM posting_master pm, posting_details PD
      ${whereClause}
    `;
    const allParams = [...params, length, start];
    const [data, countResult, totalsResult] = await Promise.all([
      prisma$1.$queryRawUnsafe(mainQuery, ...allParams),
      prisma$1.$queryRawUnsafe(countQuery, ...params),
      prisma$1.$queryRawUnsafe(totalsQuery, ...params)
    ]);
    const formattedResult = (data || []).map((item, index) => ({
      pmt_posting_id: item.pmt_posting_id,
      pmt_posting_no: item.pmt_posting_no || "",
      pde_document_no: item.pde_document_no ? String(item.pde_document_no).trim() : "",
      pmt_system_id: item.pmt_system_id || "",
      amountDT: parseFloat(item.amountDT || 0),
      amountCR: parseFloat(item.amountCR || 0),
      pmt_status: item.pmt_status || "",
      pde_reference: item.Reference1 ? String(item.Reference1).trim() : "",
      pde_reference1: item.Reference2 ? String(item.Reference2).trim() : "",
      pde_trans_date: item.postedDate || "",
      no: start + index + 1
    }));
    const recordsFiltered = countResult && countResult[0] ? parseInt(countResult[0].total) : 0;
    const grandTotalDT = totalsResult && totalsResult[0] ? totalsResult[0].grandTotalDT : "0.00";
    const grandTotalCR = totalsResult && totalsResult[0] ? totalsResult[0].grandTotalCR : "0.00";
    return {
      statusCode: 200,
      message: "Posting records fetched successfully",
      data: formattedResult,
      recordsFiltered,
      footer: {
        amountDT: grandTotalDT,
        amountCR: grandTotalCR
      }
    };
  } catch (error) {
    console.error("Error fetching posting to GL records:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$1H = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1G
});

const statuses_get = defineEventHandler(async (event) => {
  try {
    const statuses = await prisma$1.posting_master.findMany({
      where: {
        pmt_status: {
          not: null
        }
      },
      select: {
        pmt_status: true
      },
      distinct: ["pmt_status"],
      orderBy: {
        pmt_status: "asc"
      }
    });
    const options = statuses.filter((item) => item.pmt_status).map((item) => ({
      label: item.pmt_status,
      value: item.pmt_status
    }));
    return {
      statusCode: 200,
      message: "Statuses fetched successfully",
      data: options
    };
  } catch (error) {
    console.error("Error fetching statuses:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const statuses_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: statuses_get
});

const systemIds_get = defineEventHandler(async (event) => {
  try {
    const systemIds = await prisma$1.posting_master.findMany({
      where: {
        pmt_system_id: {
          not: null
        }
      },
      select: {
        pmt_system_id: true
      },
      distinct: ["pmt_system_id"],
      orderBy: {
        pmt_system_id: "asc"
      }
    });
    const options = systemIds.filter((item) => item.pmt_system_id).map((item) => ({
      label: item.pmt_system_id,
      value: item.pmt_system_id
    }));
    return {
      statusCode: 200,
      message: "System IDs fetched successfully",
      data: options
    };
  } catch (error) {
    console.error("Error fetching system IDs:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const systemIds_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: systemIds_get
});

const index_get$1E = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Submission list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching submission list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch submission list",
      error: error.message
    };
  }
});

const index_get$1F = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1E
});

const index_get$1C = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Duration tender/quotation list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching duration tender/quotation list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch duration tender/quotation list",
      error: error.message
    };
  }
});

const index_get$1D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1C
});

const index_get$1A = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { jsc_jobscope_code: { contains: searchTerm } },
        { jsc_category: { contains: searchTerm } },
        { jsc_logic: { contains: searchTerm } }
      ];
    }
    const jobscopes = await prisma$1.jobscope.findMany({
      where: whereClause,
      orderBy: {
        jsc_jobscope_id: "desc"
      }
    });
    const data = jobscopes.map((jobscope) => {
      return {
        jsc_jobscope_id: jobscope.jsc_jobscope_id,
        jsc_jobscope_code: jobscope.jsc_jobscope_code || "",
        jsc_category: jobscope.jsc_category || "",
        jsc_logic: jobscope.jsc_logic || "",
        urlEdit: `/purchasing/advertisement/new-tender-quotation/edit/${jobscope.jsc_jobscope_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Jobscope list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching jobscope list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch jobscope list",
      error: error.message
    };
  }
});

const index_get$1B = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1A
});

const index_get$1y = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { tdm_tender_no: { contains: searchTerm } },
        { tdm_briefing_ref_no: { contains: searchTerm } },
        { tdm_tender_type: { contains: searchTerm } },
        { tdm_title: { contains: searchTerm } },
        { tdm_requisition_no: { contains: searchTerm } },
        { tdm_status: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.tdm_status = query.smartFilter_Status;
    }
    if (query.smartFilter_Type) {
      whereClause.tdm_tender_type = query.smartFilter_Type;
    }
    if (query.smartFilter_StartDate) {
      const [day, month, year] = query.smartFilter_StartDate.split("/");
      const startDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}`);
      whereClause.tdm_start_date = {
        ...whereClause.tdm_start_date || {},
        gte: startDate
      };
    }
    if (query.smartFilter_EndDate) {
      const [day, month, year] = query.smartFilter_EndDate.split("/");
      const endDate = /* @__PURE__ */ new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.tdm_end_date = {
        ...whereClause.tdm_end_date || {},
        lte: endDate
      };
    }
    const tenderRequests = await prisma$1.tender_master.findMany({
      where: whereClause,
      orderBy: {
        tdm_tender_id: "desc"
      }
    });
    const data = tenderRequests.map((tender) => {
      const startDate = tender.tdm_start_date ? new Date(tender.tdm_start_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      const endDate = tender.tdm_end_date ? new Date(tender.tdm_end_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        tdm_tender_id: tender.tdm_tender_id,
        tdm_tender_no: tender.tdm_tender_no || "",
        tdm_briefing_ref_no: tender.tdm_briefing_ref_no || "",
        tdm_tender_type: tender.tdm_tender_type || "",
        tdm_start_date: startDate,
        tdm_end_date: endDate,
        tdm_title: tender.tdm_title || "",
        tdm_estimated_amount: tender.tdm_estimated_amount ? parseFloat(tender.tdm_estimated_amount.toString()) : 0,
        tdm_requisition_no: tender.tdm_requisition_no || "",
        tdm_status: tender.tdm_status || "",
        urlEdit: `/purchasing/advertisement/edit/${tender.tdm_tender_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Advertisement requests fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching advertisement requests:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch advertisement requests",
      error: error.message
    };
  }
});

const index_get$1z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1y
});

const index_get$1w = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { agr_agreement_no: { contains: searchTerm } },
        { agr_agreement_ref: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { agr_description: { contains: searchTerm } },
        { agr_status: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.agr_status = query.smartFilter_Status;
    }
    if (query.smartFilter_VendorCode) {
      whereClause.vcs_vendor_code = { contains: query.smartFilter_VendorCode };
    }
    if (query.smartFilter_StartDate) {
      const [day, month, year] = query.smartFilter_StartDate.split("/");
      const startDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}`);
      whereClause.agr_start_date = {
        ...whereClause.agr_start_date || {},
        gte: startDate
      };
    }
    if (query.smartFilter_EndDate) {
      const [day, month, year] = query.smartFilter_EndDate.split("/");
      const endDate = /* @__PURE__ */ new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.agr_end_date = {
        ...whereClause.agr_end_date || {},
        lte: endDate
      };
    }
    const agreements = [];
    const data = agreements.map((agr) => {
      var _a, _b;
      const startDate = agr.agr_start_date ? new Date(agr.agr_start_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      const endDate = agr.agr_end_date ? new Date(agr.agr_end_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        AgreementID: agr.agr_agreement_id,
        AgreementNo: agr.agr_agreement_no || "",
        AgreementRef: agr.agr_agreement_ref || "",
        VendorCode: agr.vcs_vendor_code || "",
        VendorName: ((_a = agr.vend_customer_supplier) == null ? void 0 : _a.vcs_vendor_name) || "",
        Address: ((_b = agr.vend_customer_supplier) == null ? void 0 : _b.vcs_address) || "",
        Description: agr.agr_description || "",
        StartDate: startDate,
        EndDate: endDate,
        Amount: agr.agr_amount ? parseFloat(agr.agr_amount.toString()) : 0,
        AmountBalance: agr.agr_balance_amount ? parseFloat(agr.agr_balance_amount.toString()) : 0,
        AmountMonthly: agr.agr_monthly_amount ? parseFloat(agr.agr_monthly_amount.toString()) : 0,
        Duration: agr.agr_duration || "",
        Type: agr.agr_duration_type || "",
        Status: agr.agr_status || "",
        urlEdit: `/purchasing/agreement/edit/${agr.agr_agreement_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Agreements fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching agreements:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch agreements",
      error: error.message
    };
  }
});

const index_get$1x = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1w
});

const index_get$1u = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { vcs_vendor_code: { contains: searchTerm } },
        { cbg_issuer_bank: { contains: searchTerm } },
        { cbg_branch_name: { contains: searchTerm } },
        { cbg_bog_no: { contains: searchTerm } },
        { cbg_agreement_no: { contains: searchTerm } },
        { cbg_po_no: { contains: searchTerm } },
        { cbg_status: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.cbg_status = query.smartFilter_Status;
    }
    if (query.smartFilter_VendorCode) {
      whereClause.vcs_vendor_code = { contains: query.smartFilter_VendorCode };
    }
    const bankGuarantees = await prisma$1.ccontroller_bank_guarantee.findMany({
      where: whereClause,
      orderBy: {
        cbg_id: "desc"
      }
    });
    const vendorCodes = [...new Set(bankGuarantees.map((bg) => bg.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes }
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true
      }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const data = bankGuarantees.map((bg) => {
      const bgDate = bg.cbg_bog_date ? new Date(bg.cbg_bog_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      const bgExpired = bg.cbg_bog_expired ? new Date(bg.cbg_bog_expired).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      const poDate = bg.cbg_po_date ? new Date(bg.cbg_po_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      const agreementDate = bg.cbg_agreement_end_date ? new Date(bg.cbg_agreement_end_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      const vendor = vendorMap.get(bg.vcs_vendor_code);
      return {
        vcs_vendor_code: bg.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        cbg_issuer_bank: bg.cbg_issuer_bank || "",
        cbg_branch_name: bg.cbg_branch_name || "",
        cbg_bog_no: bg.cbg_bog_no || "",
        cbg_bog_date: bgDate,
        cbg_bog_expired: bgExpired,
        cbg_agreement_no: bg.cbg_agreement_no || "",
        cbg_amount: bg.cbg_amount ? parseFloat(bg.cbg_amount.toString()) : 0,
        cbg_po_no: bg.cbg_po_no || "",
        cbg_po_date: poDate,
        cbg_agreement_end_date: agreementDate,
        cbg_status: bg.cbg_status || "",
        cbg_remark: bg.cbg_remark || "",
        urlEdit: `/purchasing/bank-guarantee/edit/${bg.cbg_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Bank guarantees fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching bank guarantees:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch bank guarantees",
      error: error.message
    };
  }
});

const index_get$1v = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1u
});

const index_get$1s = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      grm_status: { contains: "CANCEL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { grm_receive_no: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } }
      ];
    }
    const grnList = await prisma$1.goods_receive_master.findMany({
      where: whereClause,
      include: {
        goods_receive_details: {
          select: {
            grd_total_amtrm: true
          }
        }
      },
      orderBy: {
        grm_receive_id: "desc"
      }
    });
    const vendorCodes = [...new Set(grnList.map((grn) => grn.vcs_vendor_code).filter(Boolean))];
    const poNumbers = [...new Set(grnList.map((grn) => grn.pom_order_no).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const purchaseOrders = poNumbers.length > 0 ? await prisma$1.purchase_order_master.findMany({
      where: { pom_order_no: { in: poNumbers } },
      select: { pom_order_no: true, pom_description: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const poMap = new Map(purchaseOrders.map((po) => [po.pom_order_no, po]));
    const data = grnList.map((grn) => {
      const vendor = vendorMap.get(grn.vcs_vendor_code);
      const po = poMap.get(grn.pom_order_no);
      const amount = grn.goods_receive_details.reduce((sum, detail) => {
        return sum + (detail.grd_total_amtrm ? parseFloat(detail.grd_total_amtrm.toString()) : 0);
      }, 0);
      const grnDate = grn.grm_receive_date ? new Date(grn.grm_receive_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        grm_receive_id: grn.grm_receive_id,
        grm_receive_no: grn.grm_receive_no || "",
        pom_order_no: (po == null ? void 0 : po.pom_order_no) || "",
        vcs_vendor_code: grn.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_description: (po == null ? void 0 : po.pom_description) || "",
        grm_receive_date: grnDate,
        amount,
        urlEdit: `/purchasing/good-receive-note/edit/${grn.grm_receive_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Good receive note cancel list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching good receive note cancel list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch good receive note cancel list",
      error: error.message
    };
  }
});

const index_get$1t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1s
});

const index_get$1q = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { grm_receive_no: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { grm_status: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.grm_status = query.smartFilter_Status;
    }
    const grnList = await prisma$1.goods_receive_master.findMany({
      where: whereClause,
      include: {
        goods_receive_details: {
          select: {
            grd_taxamt: true
          }
        }
      },
      orderBy: {
        grm_receive_id: "desc"
      }
    });
    const vendorCodes = [...new Set(grnList.map((grn) => grn.vcs_vendor_code).filter(Boolean))];
    const poNumbers = [...new Set(grnList.map((grn) => grn.pom_order_no).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes }
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true
      }
    }) : [];
    const purchaseOrders = poNumbers.length > 0 ? await prisma$1.purchase_order_master.findMany({
      where: {
        pom_order_no: { in: poNumbers }
      },
      select: {
        pom_order_no: true,
        pom_description: true
      }
    }) : [];
    const bills = await prisma$1.bills_master.findMany({
      where: {
        grm_receive_no: { in: grnList.map((grn) => grn.grm_receive_no).filter(Boolean) }
      },
      select: {
        grm_receive_no: true,
        bim_bills_no: true
      }
    });
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const poMap = new Map(purchaseOrders.map((po) => [po.pom_order_no, po]));
    const billMap = new Map(bills.map((b) => [b.grm_receive_no, b]));
    const data = grnList.map((grn) => {
      const vendor = vendorMap.get(grn.vcs_vendor_code);
      const po = poMap.get(grn.pom_order_no);
      const bill = billMap.get(grn.grm_receive_no);
      const taxAmount = grn.goods_receive_details.reduce((sum, detail) => {
        return sum + (detail.grd_taxamt ? parseFloat(detail.grd_taxamt.toString()) : 0);
      }, 0);
      const createdDate = grn.createddate ? new Date(grn.createddate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        grm_receive_no: grn.grm_receive_no || "",
        pom_order_no: grn.pom_order_no || "",
        vcs_vendor_code: grn.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_description: (po == null ? void 0 : po.pom_description) || "",
        sum_grd_taxamt: taxAmount,
        grm_total_amt: grn.grm_total_amt ? parseFloat(grn.grm_total_amt.toString()) : 0,
        grm_status: grn.grm_status || "",
        bim_bills_no: (bill == null ? void 0 : bill.bim_bills_no) || "",
        vam_status: "",
        // TODO: Get from vendor assessment
        createddate: createdDate,
        urlEdit: `/purchasing/good-receive-note/edit/${grn.grm_receive_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Good receive notes fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching good receive notes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch good receive notes",
      error: error.message
    };
  }
});

const index_get$1r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1q
});

const _id__get$8 = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: null
      };
    }
    const purchaseOrder = await prisma$1.purchase_order_master.findUnique({
      where: {
        pom_order_id: id
      },
      include: {
        purchase_order_details: {
          orderBy: {
            pod_line_no: "asc"
          }
        }
      }
    });
    if (!purchaseOrder) {
      return {
        statusCode: 404,
        message: "Purchase order not found",
        data: null
      };
    }
    const formattedData = {
      pom_order_id: purchaseOrder.pom_order_id,
      pom_order_no: purchaseOrder.pom_order_no || "",
      pom_requisition_no: purchaseOrder.pom_requisition_no || "",
      pom_retrieve_type: purchaseOrder.pom_retrieve_type || "",
      org_code: purchaseOrder.org_code || "",
      vcs_vendor_code: purchaseOrder.vcs_vendor_code || "",
      pom_deliver_address: purchaseOrder.pom_address || "",
      pom_request_by: purchaseOrder.pom_request_by || "",
      pom_estimate_delivery_date: purchaseOrder.pom_available_date ? purchaseOrder.pom_available_date.toISOString().split("T")[0] : "",
      pom_request_date: purchaseOrder.pom_request_date ? purchaseOrder.pom_request_date.toISOString().split("T")[0] : "",
      pom_document_no: purchaseOrder.pom_ref_doc || "",
      pom_description: purchaseOrder.pom_description || "",
      pom_document_received_date: purchaseOrder.pom_doc_receive_date ? purchaseOrder.pom_doc_receive_date.toISOString().split("T")[0] : "",
      pom_purchase_method: purchaseOrder.pom_method || "",
      pom_purchase_type: purchaseOrder.pom_order_type || "",
      pom_contact_person: purchaseOrder.pom_contact_person || "",
      pom_order_status: purchaseOrder.pom_order_status || "DRAFT",
      pom_total_amount: purchaseOrder.pom_order_amt_rm ? parseFloat(purchaseOrder.pom_order_amt_rm.toString()) : 0,
      pom_discount_amount: purchaseOrder.pom_discount_amt ? parseFloat(purchaseOrder.pom_discount_amt.toString()) : 0,
      pom_gross_amt: purchaseOrder.pom_gross_amt ? parseFloat(purchaseOrder.pom_gross_amt.toString()) : 0,
      pom_order_amt: purchaseOrder.pom_order_amt ? parseFloat(purchaseOrder.pom_order_amt.toString()) : 0,
      pom_total_paid: purchaseOrder.pom_total_paid ? parseFloat(purchaseOrder.pom_total_paid.toString()) : 0,
      pom_total_invoiced: purchaseOrder.pom_total_invoiced ? parseFloat(purchaseOrder.pom_total_invoiced.toString()) : 0,
      pom_total_tax: purchaseOrder.pom_total_tax ? parseFloat(purchaseOrder.pom_total_tax.toString()) : 0,
      pom_currency_unit: purchaseOrder.pom_currency_unit ? parseFloat(purchaseOrder.pom_currency_unit.toString()) : 0,
      pom_currency_code: purchaseOrder.pom_currency_code || "",
      pom_conversion_rate: purchaseOrder.pom_conversion_rate ? parseFloat(purchaseOrder.pom_conversion_rate.toString()) : 0,
      pom_rate_type: purchaseOrder.pom_rate_type || "",
      pom_rate_date: purchaseOrder.pom_rate_date ? purchaseOrder.pom_rate_date.toISOString().split("T")[0] : "",
      pom_ent_amt: purchaseOrder.pom_ent_amt ? parseFloat(purchaseOrder.pom_ent_amt.toString()) : 0,
      pom_exchange_type_code: purchaseOrder.pom_exchange_type_code || "",
      pom_shipto_id: purchaseOrder.pom_shipto_id || null,
      pom_aggrement_no: purchaseOrder.pom_aggrement_no || "",
      pom_order_ref: purchaseOrder.pom_order_ref || "",
      cpa_project_no: purchaseOrder.cpa_project_no || "",
      pom_wflow_sts: purchaseOrder.pom_wflow_sts || "",
      pom_wflow_type: purchaseOrder.pom_wflow_type || "",
      pom_approve_by: purchaseOrder.pom_approve_by || "",
      pom_approve_date: purchaseOrder.pom_approve_date ? purchaseOrder.pom_approve_date.toISOString().split("T")[0] : "",
      pom_verify_by: purchaseOrder.pom_verify_by || "",
      pom_verify_date: purchaseOrder.pom_verify_date ? purchaseOrder.pom_verify_date.toISOString().split("T")[0] : "",
      pom_cancel_by: purchaseOrder.pom_cancel_by || "",
      pom_cancel_date: purchaseOrder.pom_cancel_date ? purchaseOrder.pom_cancel_date.toISOString().split("T")[0] : "",
      pom_cancel_remark: purchaseOrder.pom_cancel_remark || "",
      // Details
      purchase_order_details: purchaseOrder.purchase_order_details.map((detail) => ({
        pod_order_detl_id: detail.pod_order_detl_id,
        pod_line_no: detail.pod_line_no ? parseFloat(detail.pod_line_no.toString()) : 0,
        rqm_requisition_no: detail.rqm_requisition_no || "",
        bdg_budget_code: detail.bdg_budget_code || "",
        am_account_code: detail.am_account_code || "",
        itm_item_code: detail.itm_item_code || "",
        oun_code: detail.oun_code || "",
        pod_order_qty: detail.pod_order_qty ? parseFloat(detail.pod_order_qty.toString()) : 0,
        pod_unit_price: detail.pod_unit_price ? parseFloat(detail.pod_unit_price.toString()) : 0,
        pod_gross_amt: detail.pod_gross_amt ? parseFloat(detail.pod_gross_amt.toString()) : 0,
        pod_discount: detail.pod_discount ? parseFloat(detail.pod_discount.toString()) : 0,
        pod_total_amt: detail.pod_total_amt ? parseFloat(detail.pod_total_amt.toString()) : 0,
        pod_total_invoiced: detail.pod_total_invoiced ? parseFloat(detail.pod_total_invoiced.toString()) : 0,
        pod_total_paid: detail.pod_total_paid ? parseFloat(detail.pod_total_paid.toString()) : 0,
        pod_item_spec: detail.pod_item_spec || "",
        pod_status: detail.pod_status || "",
        pod_request_no: detail.pod_request_no || "",
        pod_received_qty: detail.pod_received_qty ? parseFloat(detail.pod_received_qty.toString()) : 0,
        pod_uom: detail.pod_uom || "",
        pod_crnote_amt: detail.pod_crnote_amt ? parseFloat(detail.pod_crnote_amt.toString()) : 0,
        pod_lib_seq: detail.pod_lib_seq || "",
        so_code: detail.so_code || "",
        cpa_project_no: detail.cpa_project_no || "",
        pod_pakej_no: detail.pod_pakej_no ? parseFloat(detail.pod_pakej_no.toString()) : 0,
        itm_item_no: detail.itm_item_no ? parseFloat(detail.itm_item_no.toString()) : 0,
        pod_brand: detail.pod_brand || "",
        cny_country_code: detail.cny_country_code || "",
        pod_taxcode: detail.pod_taxcode || "",
        pod_taxpct: detail.pod_taxpct ? parseFloat(detail.pod_taxpct.toString()) : 0,
        pod_taxamt: detail.pod_taxamt ? parseFloat(detail.pod_taxamt.toString()) : 0,
        ccr_costcentre: detail.ccr_costcentre || "",
        pod_ccr_costcentre_budget: detail.pod_ccr_costcentre_budget || "",
        fty_fund_type: detail.fty_fund_type || "",
        at_activity_code: detail.at_activity_code || "",
        pod_at_activity_code_budget: detail.pod_at_activity_code_budget || "",
        sbg_budget_id: detail.sbg_budget_id || null,
        pod_ent_amt: detail.pod_ent_amt ? parseFloat(detail.pod_ent_amt.toString()) : 0,
        pod_total_amtrm: detail.pod_total_amtrm ? parseFloat(detail.pod_total_amtrm.toString()) : 0,
        pod_req_no: detail.pod_req_no || "",
        rqd_requisition_id: detail.rqd_requisition_id || null,
        pod_flag_manual: detail.pod_flag_manual || "",
        pod_cn_amount_ent: detail.pod_cn_amount_ent ? parseFloat(detail.pod_cn_amount_ent.toString()) : 0,
        pod_cn_amount: detail.pod_cn_amount ? parseFloat(detail.pod_cn_amount.toString()) : 0
      }))
    };
    return {
      statusCode: 200,
      message: "Purchase order fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching purchase order:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase order",
      error: error.message
    };
  }
});

const _id__get$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$8
});

const _id__put$a = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: null
      };
    }
    const existingPO = await prisma$1.purchase_order_master.findUnique({
      where: {
        pom_order_id: id
      }
    });
    if (!existingPO) {
      return {
        statusCode: 404,
        message: "Purchase order not found",
        data: null
      };
    }
    const user = event.context.user || { username: "system" };
    const purchaseOrder = await prisma$1.purchase_order_master.update({
      where: {
        pom_order_id: id
      },
      data: {
        pom_requisition_no: body.pom_requisition_no !== void 0 ? body.pom_requisition_no : existingPO.pom_requisition_no,
        pom_retrieve_type: body.pom_retrieve_type !== void 0 ? body.pom_retrieve_type : existingPO.pom_retrieve_type,
        org_code: body.org_code !== void 0 ? body.org_code : existingPO.org_code,
        vcs_vendor_code: body.vcs_vendor_code !== void 0 ? body.vcs_vendor_code : existingPO.vcs_vendor_code,
        pom_address: body.pom_deliver_address !== void 0 ? body.pom_deliver_address : existingPO.pom_address,
        pom_request_by: body.pom_request_by !== void 0 ? body.pom_request_by : existingPO.pom_request_by,
        pom_request_date: body.pom_request_date !== void 0 ? body.pom_request_date ? new Date(body.pom_request_date) : null : existingPO.pom_request_date,
        pom_available_date: body.pom_estimate_delivery_date !== void 0 ? body.pom_estimate_delivery_date ? new Date(body.pom_estimate_delivery_date) : null : existingPO.pom_available_date,
        pom_ref_doc: body.pom_document_no !== void 0 ? body.pom_document_no : existingPO.pom_ref_doc,
        pom_description: body.pom_description !== void 0 ? body.pom_description : existingPO.pom_description,
        pom_doc_receive_date: body.pom_document_received_date !== void 0 ? body.pom_document_received_date ? new Date(body.pom_document_received_date) : null : existingPO.pom_doc_receive_date,
        pom_method: body.pom_purchase_method !== void 0 ? body.pom_purchase_method : existingPO.pom_method,
        pom_order_type: body.pom_purchase_type !== void 0 ? body.pom_purchase_type : existingPO.pom_order_type,
        pom_contact_person: body.pom_contact_person !== void 0 ? body.pom_contact_person : existingPO.pom_contact_person,
        pom_order_status: body.pom_order_status !== void 0 ? body.pom_order_status : existingPO.pom_order_status,
        pom_order_amt_rm: body.pom_total_amount !== void 0 ? body.pom_total_amount ? parseFloat(body.pom_total_amount) : null : existingPO.pom_order_amt_rm,
        pom_discount_amt: body.pom_discount_amount !== void 0 ? body.pom_discount_amount ? parseFloat(body.pom_discount_amount) : null : existingPO.pom_discount_amt,
        pom_gross_amt: body.pom_gross_amt !== void 0 ? body.pom_gross_amt ? parseFloat(body.pom_gross_amt) : null : existingPO.pom_gross_amt,
        pom_order_amt: body.pom_order_amt !== void 0 ? body.pom_order_amt ? parseFloat(body.pom_order_amt) : null : existingPO.pom_order_amt,
        pom_total_paid: body.pom_total_paid !== void 0 ? body.pom_total_paid ? parseFloat(body.pom_total_paid) : null : existingPO.pom_total_paid,
        pom_total_invoiced: body.pom_total_invoiced !== void 0 ? body.pom_total_invoiced ? parseFloat(body.pom_total_invoiced) : null : existingPO.pom_total_invoiced,
        pom_total_tax: body.pom_total_tax !== void 0 ? body.pom_total_tax ? parseFloat(body.pom_total_tax) : null : existingPO.pom_total_tax,
        pom_currency_unit: body.pom_currency_unit !== void 0 ? body.pom_currency_unit ? parseFloat(body.pom_currency_unit) : null : existingPO.pom_currency_unit,
        pom_currency_code: body.pom_currency_code !== void 0 ? body.pom_currency_code : existingPO.pom_currency_code,
        pom_conversion_rate: body.pom_conversion_rate !== void 0 ? body.pom_conversion_rate ? parseFloat(body.pom_conversion_rate) : null : existingPO.pom_conversion_rate,
        pom_rate_type: body.pom_rate_type !== void 0 ? body.pom_rate_type : existingPO.pom_rate_type,
        pom_rate_date: body.pom_rate_date !== void 0 ? body.pom_rate_date ? new Date(body.pom_rate_date) : null : existingPO.pom_rate_date,
        pom_ent_amt: body.pom_ent_amt !== void 0 ? body.pom_ent_amt ? parseFloat(body.pom_ent_amt) : null : existingPO.pom_ent_amt,
        pom_exchange_type_code: body.pom_exchange_type_code !== void 0 ? body.pom_exchange_type_code : existingPO.pom_exchange_type_code,
        pom_shipto_id: body.pom_shipto_id !== void 0 ? body.pom_shipto_id : existingPO.pom_shipto_id,
        pom_aggrement_no: body.pom_aggrement_no !== void 0 ? body.pom_aggrement_no : existingPO.pom_aggrement_no,
        pom_order_ref: body.pom_order_ref !== void 0 ? body.pom_order_ref : existingPO.pom_order_ref,
        cpa_project_no: body.cpa_project_no !== void 0 ? body.cpa_project_no : existingPO.cpa_project_no,
        pom_wflow_sts: body.pom_wflow_sts !== void 0 ? body.pom_wflow_sts : existingPO.pom_wflow_sts,
        pom_wflow_type: body.pom_wflow_type !== void 0 ? body.pom_wflow_type : existingPO.pom_wflow_type,
        updatedby: user.username || "system",
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    if (body.purchase_order_details && Array.isArray(body.purchase_order_details)) {
      await prisma$1.purchase_order_details.deleteMany({
        where: {
          pom_order_id: id
        }
      });
      if (body.purchase_order_details.length > 0) {
        const detailsData = body.purchase_order_details.map((detail) => ({
          pom_order_id: id,
          rqm_requisition_no: detail.rqm_requisition_no || null,
          bdg_budget_code: detail.bdg_budget_code || "",
          am_account_code: detail.am_account_code || "",
          pod_line_no: detail.pod_line_no ? parseFloat(detail.pod_line_no) : 0,
          itm_item_code: detail.itm_item_code || null,
          oun_code: detail.oun_code || null,
          pod_order_qty: detail.pod_order_qty ? parseFloat(detail.pod_order_qty) : null,
          pod_unit_price: detail.pod_unit_price ? parseFloat(detail.pod_unit_price) : null,
          pod_gross_amt: detail.pod_gross_amt ? parseFloat(detail.pod_gross_amt) : null,
          pod_discount: detail.pod_discount ? parseFloat(detail.pod_discount) : null,
          pod_total_amt: detail.pod_total_amt ? parseFloat(detail.pod_total_amt) : null,
          pod_total_invoiced: detail.pod_total_invoiced ? parseFloat(detail.pod_total_invoiced) : null,
          pod_total_paid: detail.pod_total_paid ? parseFloat(detail.pod_total_paid) : null,
          pod_item_spec: detail.pod_item_spec || null,
          pod_status: detail.pod_status || null,
          pod_request_no: detail.pod_request_no || null,
          pod_received_qty: detail.pod_received_qty ? parseFloat(detail.pod_received_qty) : null,
          pod_uom: detail.pod_uom || null,
          pod_crnote_amt: detail.pod_crnote_amt ? parseFloat(detail.pod_crnote_amt) : null,
          pod_lib_seq: detail.pod_lib_seq || null,
          so_code: detail.so_code || null,
          cpa_project_no: detail.cpa_project_no || null,
          pod_pakej_no: detail.pod_pakej_no ? parseFloat(detail.pod_pakej_no) : null,
          itm_item_no: detail.itm_item_no ? parseFloat(detail.itm_item_no) : null,
          pod_brand: detail.pod_brand || null,
          cny_country_code: detail.cny_country_code || null,
          pod_taxcode: detail.pod_taxcode || null,
          pod_taxpct: detail.pod_taxpct ? parseFloat(detail.pod_taxpct) : null,
          pod_taxamt: detail.pod_taxamt ? parseFloat(detail.pod_taxamt) : null,
          ccr_costcentre: detail.ccr_costcentre || null,
          pod_ccr_costcentre_budget: detail.pod_ccr_costcentre_budget || null,
          fty_fund_type: detail.fty_fund_type || null,
          at_activity_code: detail.at_activity_code || null,
          pod_at_activity_code_budget: detail.pod_at_activity_code_budget || null,
          sbg_budget_id: detail.sbg_budget_id || null,
          pod_ent_amt: detail.pod_ent_amt ? parseFloat(detail.pod_ent_amt) : null,
          pod_total_amtrm: detail.pod_total_amtrm ? parseFloat(detail.pod_total_amtrm) : null,
          pod_req_no: detail.pod_req_no || null,
          rqd_requisition_id: detail.rqd_requisition_id || null,
          pod_flag_manual: detail.pod_flag_manual || null,
          pod_cn_amount_ent: detail.pod_cn_amount_ent ? parseFloat(detail.pod_cn_amount_ent) : null,
          pod_cn_amount: detail.pod_cn_amount ? parseFloat(detail.pod_cn_amount) : null,
          createdby: user.username || "system",
          updatedby: user.username || "system"
        }));
        await prisma$1.purchase_order_details.createMany({
          data: detailsData
        });
      }
    }
    return {
      statusCode: 200,
      message: "Purchase order updated successfully",
      data: {
        pom_order_id: purchaseOrder.pom_order_id,
        pom_order_no: purchaseOrder.pom_order_no
      }
    };
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return {
      statusCode: 500,
      message: "Failed to update purchase order",
      error: error.message
    };
  }
});

const _id__put$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$a
});

const prItems_get = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const query = getQuery$1(event);
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: []
      };
    }
    if (!query.rqm_requisition_no) {
      return {
        statusCode: 400,
        message: "rqm_requisition_no is required",
        data: []
      };
    }
    const requisition = await prisma$1.requisition_master.findUnique({
      where: {
        rqm_requisition_no: query.rqm_requisition_no
      },
      include: {
        requisition_details: {
          orderBy: {
            rqd_line_no: "asc"
          }
        }
      }
    });
    if (!requisition) {
      return {
        statusCode: 404,
        message: "Requisition not found",
        data: []
      };
    }
    const formattedData = requisition.requisition_details.map((detail, index) => ({
      no: index + 1,
      rqd_requisition_id: detail.rqd_requisition_id,
      rqd_line_no: detail.rqd_line_no ? parseFloat(detail.rqd_line_no.toString()) : 0,
      itm_item_code: detail.itm_item_code || "",
      "Item Description": detail.rqd_spec_desc || "",
      rqd_qty: detail.rqd_qty || "",
      rqd_uom: detail.rqd_uom || "",
      rqd_price: detail.rqd_price ? parseFloat(detail.rqd_price.toString()) : 0,
      rqd_gross_amt: detail.rqd_gross_amt ? parseFloat(detail.rqd_gross_amt.toString()) : 0,
      rqd_total_price: detail.rqd_total_price ? parseFloat(detail.rqd_total_price.toString()) : 0,
      rqd_total_price_rm: detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm.toString()) : 0,
      rqd_status: detail.rqd_status || "",
      acm_acct_code: detail.acm_acct_code || "",
      ccr_costcentre: detail.ccr_costcentre || "",
      at_activity_code: detail.at_activity_code || "",
      bdg_budget_code: detail.bdg_budget_code || ""
    }));
    return {
      statusCode: 200,
      message: "PR Items fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching PR items:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PR items",
      error: error.message
    };
  }
});

const prItems_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: prItems_get
});

const prList_get = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: []
      };
    }
    const poDetails = await prisma$1.purchase_order_details.findMany({
      where: {
        pom_order_id: id
      },
      select: {
        rqm_requisition_no: true
      },
      distinct: ["rqm_requisition_no"]
    });
    const requisitionNos = poDetails.map((d) => d.rqm_requisition_no).filter(Boolean);
    if (requisitionNos.length === 0) {
      return {
        statusCode: 200,
        message: "PR List fetched successfully",
        data: []
      };
    }
    const requisitions = await prisma$1.requisition_master.findMany({
      where: {
        rqm_requisition_no: { in: requisitionNos }
      },
      select: {
        rqm_requisition_id: true,
        rqm_requisition_no: true,
        rqm_requisition_title: true,
        rqm_amount: true,
        rqm_status: true,
        rqm_request_date: true,
        oun_code: true
      },
      orderBy: {
        rqm_requisition_no: "asc"
      }
    });
    const formattedData = requisitions.map((req, index) => ({
      no: index + 1,
      rqm_requisition_id: req.rqm_requisition_id,
      "Requisition No": req.rqm_requisition_no || "",
      Title: req.rqm_requisition_title || "",
      Amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
      Status: req.rqm_status || "",
      "Request Date": req.rqm_request_date ? req.rqm_request_date.toISOString().split("T")[0] : "",
      "PTJ Code": req.oun_code || ""
    }));
    return {
      statusCode: 200,
      message: "PR List fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching PR list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PR list",
      error: error.message
    };
  }
});

const prList_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: prList_get
});

const processFlow_get$2 = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase order ID",
        data: []
      };
    }
    const purchaseOrder = await prisma$1.purchase_order_master.findUnique({
      where: {
        pom_order_id: id
      },
      select: {
        pom_order_no: true,
        pom_wflow_type: true
      }
    });
    if (!purchaseOrder || !purchaseOrder.pom_order_no) {
      return {
        statusCode: 200,
        message: "Process flow fetched successfully",
        data: []
      };
    }
    const workflowCode = purchaseOrder.pom_wflow_type || "PO";
    const processes = await prisma$1.wf_process.findMany({
      where: {
        wfp_workflow_code: workflowCode,
        wfp_status: "1"
      },
      select: {
        wfp_process_id: true,
        wfp_process_name: true,
        wfp_sequence: true
      },
      orderBy: {
        wfp_sequence: "asc"
      }
    });
    if (processes.length === 0) {
      return {
        statusCode: 200,
        message: "Process flow fetched successfully",
        data: []
      };
    }
    const processIds = processes.map((p) => p.wfp_process_id);
    const applicationStatuses = await prisma$1.wf_application_status.findMany({
      where: {
        was_process_id: { in: processIds },
        was_application_id: purchaseOrder.pom_order_no
      },
      select: {
        was_process_id: true,
        was_notes: true,
        createddate: true,
        createdby: true,
        was_extended_field: true
      }
    });
    const statusMap = new Map(
      applicationStatuses.map((status) => [status.was_process_id, status])
    );
    const usernames = applicationStatuses.map((s) => s.createdby).filter(Boolean);
    const staffList = usernames.length > 0 ? await prisma$1.staff.findMany({
      where: {
        stf_ad_username: { in: usernames }
      },
      select: {
        stf_ad_username: true,
        stf_staff_id: true,
        stf_email_addr: true,
        stf_telno_work: true
      }
    }) : [];
    const staffMap = new Map(
      staffList.map((staff) => [staff.stf_ad_username, staff])
    );
    const staffIds = staffList.map((s) => s.stf_staff_id);
    const staffServices = staffIds.length > 0 ? await prisma$1.staff_service.findMany({
      where: {
        stf_staff_id: { in: staffIds },
        sts_job_flag: "1"
      },
      select: {
        stf_staff_id: true,
        sts_oun_code: true,
        sts_extended_field: true
      }
    }) : [];
    const staffServiceMap = /* @__PURE__ */ new Map();
    staffServices.forEach((ss) => {
      if (!staffServiceMap.has(ss.stf_staff_id)) {
        staffServiceMap.set(ss.stf_staff_id, ss);
      }
    });
    const formattedData = processes.map((process, index) => {
      const status = statusMap.get(process.wfp_process_id);
      const staff = (status == null ? void 0 : status.createdby) ? staffMap.get(status.createdby) : null;
      const staffService = (staff == null ? void 0 : staff.stf_staff_id) ? staffServiceMap.get(staff.stf_staff_id) : null;
      const wasExtendedField = (status == null ? void 0 : status.was_extended_field) || {};
      const stsExtendedField = (staffService == null ? void 0 : staffService.sts_extended_field) || {};
      const ptjDesc = staffService ? [staffService.sts_oun_code, stsExtendedField.sts_oun_desc].filter(Boolean).join("-") : "";
      return {
        no: index + 1,
        Process: process.wfp_process_name || "",
        By: wasExtendedField.createdby_name || (status == null ? void 0 : status.createdby) || "",
        PTJ: ptjDesc,
        Email: (staff == null ? void 0 : staff.stf_email_addr) || "",
        "No Telefon": (staff == null ? void 0 : staff.stf_telno_work) || "",
        Status: wasExtendedField.was_status_desc ? wasExtendedField.was_status_desc.toUpperCase() : (status == null ? void 0 : status.was_status) || "",
        Comment: (status == null ? void 0 : status.was_notes) || "",
        Date: (status == null ? void 0 : status.createddate) ? new Date(status.createddate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }).replace(/\//g, "/") : ""
      };
    });
    formattedData.sort((a, b) => {
      const processA = processes.find((p) => p.wfp_process_name === a.Process);
      const processB = processes.find((p) => p.wfp_process_name === b.Process);
      if (processA && processB) {
        if (processA.wfp_sequence !== processB.wfp_sequence) {
          return processA.wfp_sequence - processB.wfp_sequence;
        }
        const dateA = a.Date ? new Date(a.Date.split("/").reverse().join("-")).getTime() : 0;
        const dateB = b.Date ? new Date(b.Date.split("/").reverse().join("-")).getTime() : 0;
        return dateA - dateB;
      }
      return 0;
    });
    return {
      statusCode: 200,
      message: "Process flow fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message
    };
  }
});

const processFlow_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: processFlow_get$2
});

const index_get$1o = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      pom_order_status: { contains: "PARTIAL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } }
      ];
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereClause,
      include: {
        purchase_order_details: {
          select: {
            pod_total_amtrm: true
          }
        }
      },
      orderBy: {
        pom_order_id: "desc"
      }
    });
    const vendorCodes = [...new Set(purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const data = purchaseOrders.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      const partialAmount = po.purchase_order_details.reduce((sum, detail) => {
        return sum + (detail.pod_total_amtrm ? parseFloat(detail.pod_total_amtrm.toString()) : 0);
      }, 0);
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || "",
        oun_code: po.pom_order_ref || "",
        pom_description: po.pom_description || "",
        vcs_vendor_code: po.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        partial_amount: partialAmount,
        pom_order_status: po.pom_order_status || "",
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Cancel PO partial listing fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching cancel PO partial listing:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch cancel PO partial listing",
      error: error.message
    };
  }
});

const index_get$1p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1o
});

const confirm_post$2 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { poData, tf_fund } = body;
    if (!poData || Object.keys(poData).length === 0) {
      return {
        status: "ko",
        errorMessage: "No PO selected. Please select at least one PO."
      };
    }
    const selectedPOs = Object.keys(poData);
    const poNumbers = [];
    const ppcIds = [];
    selectedPOs.forEach((key) => {
      const parts = key.split("_");
      poNumbers.push(parts[0]);
      ppcIds.push(parseInt(parts[1]));
    });
    let poRecords = [];
    try {
      poRecords = await prisma$1.po_process_closing.findMany({
        where: {
          ppc_id: { in: ppcIds }
        },
        select: {
          ppc_id: true,
          pod_order_detl_id: true,
          pom_order_no: true,
          ppc_year: true,
          opening_status: true
        }
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        status: "ko",
        errorMessage: "Table not found. Please ensure the database is set up correctly."
      };
    }
    if (poRecords.length === 0) {
      return {
        status: "ko",
        errorMessage: "No valid records found for selected POs."
      };
    }
    const years = [...new Set(poRecords.map((po) => {
      const openingYear = po.opening_status ? parseInt(po.opening_status) : null;
      return openingYear ? openingYear - 1 : null;
    }).filter(Boolean))];
    if (years.length > 1) {
      return {
        status: "ko",
        errorMessage: "Selected POs have different closing years. Please select POs from the same year only."
      };
    }
    if (years.length === 0) {
      return {
        status: "ko",
        errorMessage: "Unable to determine closing year for selected POs."
      };
    }
    const p_year = years[0];
    const lv_new_year = p_year + 1;
    const podOrderDetlIds = [...new Set(poRecords.map((po) => po.pod_order_detl_id).filter(Boolean))];
    const uniquePONumbers = [...new Set(poRecords.map((po) => po.pom_order_no).filter(Boolean))];
    let pchRecords = [];
    try {
      pchRecords = await prisma$1.po_closing_history.findMany({
        where: {
          pod_order_detl_id: { in: podOrderDetlIds },
          pom_order_no: { in: uniquePONumbers },
          pch_closing_year: p_year
        },
        select: {
          pch_id: true
        }
      });
    } catch (tableError) {
      console.log("po_closing_history table may not exist:", tableError.message);
      return {
        status: "ko",
        errorMessage: "Closing history table not found."
      };
    }
    if (pchRecords.length === 0) {
      return {
        status: "ko",
        errorMessage: "No closing history found for selected POs."
      };
    }
    const pchIds = pchRecords.map((pch) => pch.pch_id);
    return {
      status: "ok",
      successmessage: `PO Closing Reverse completed successfully. ${pchIds.length} record(s) processed.`,
      processedCount: pchIds.length,
      year: p_year
    };
  } catch (error) {
    console.error("Error reversing PO closing:", error);
    return {
      status: "ko",
      errorMessage: `PO Closing Reverse failed: ${error.message}`
    };
  }
});

const confirm_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: confirm_post$2
});

const index_get$1m = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const fund = query.fund;
    const search = query.search;
    let whereClause = {
      opening_status: { not: null }
    };
    if (fund === "E01") {
      whereClause.fty_fund_type = "E01";
    } else if (fund === "other") {
      whereClause.fty_fund_type = { not: "E01" };
    }
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    whereClause.opening_status = currentYear.toString();
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { ppc_id: { contains: searchTerm } },
        { ppc_year: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { pod_order_detl_id: { contains: searchTerm } },
        { pod_line_no: { contains: searchTerm } },
        { fty_fund_type: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
        { am_account_code: { contains: searchTerm } },
        { cpa_project_no: { contains: searchTerm } },
        { remark: { contains: searchTerm } }
      ];
    }
    let poList = [];
    try {
      const allPOs = await prisma$1.po_process_closing.findMany({
        where: whereClause,
        orderBy: {
          ppc_id: "desc"
        },
        take: 1e3
      });
      const poIdsToCheck = allPOs.map((po) => ({
        pom_order_no: po.pom_order_no,
        sbg_budget_id_NEW: po.sbg_budget_id_NEW
      }));
      const bills = poIdsToCheck.length > 0 ? await prisma$1.bills_master.findMany({
        where: {
          pom_order_no: { in: [...new Set(poIdsToCheck.map((p) => p.pom_order_no))] },
          bim_status: { notIn: ["CANCEL", "REJECT", "ERROR"] }
        },
        include: {
          bills_details: {
            select: {
              sbg_budget_id: true
            }
          }
        }
      }) : [];
      const poBudgetWithBills = /* @__PURE__ */ new Set();
      bills.forEach((bill) => {
        bill.bills_details.forEach((detail) => {
          poBudgetWithBills.add(`${bill.pom_order_no}_${detail.sbg_budget_id}`);
        });
      });
      poList = allPOs.filter((po) => {
        if (!po.sbg_budget_id_NEW)
          return false;
        const key = `${po.pom_order_no}_${po.sbg_budget_id_NEW}`;
        return !poBudgetWithBills.has(key);
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 200,
        message: "PO Closed Reverse data fetched successfully",
        data: [],
        recordsFiltered: 0,
        checkboxMonitoring: []
      };
    }
    const oldBudgetIds = [...new Set(poList.map((po) => po.sbg_budget_id).filter(Boolean))];
    const newBudgetIds = [...new Set(poList.map((po) => po.sbg_budget_id_NEW).filter(Boolean))];
    const allBudgetIds = [.../* @__PURE__ */ new Set([...oldBudgetIds, ...newBudgetIds])];
    const structureBudgets = allBudgetIds.length > 0 ? await prisma$1.structure_budget.findMany({
      where: { sbg_budget_id: { in: allBudgetIds } },
      select: {
        sbg_budget_id: true,
        fty_fund_type: true,
        at_activity_code: true,
        oun_code: true,
        ccr_costcentre: true,
        lbc_budget_code: true
      }
    }) : [];
    const budgetMap = new Map(structureBudgets.map((sb) => [sb.sbg_budget_id, sb]));
    const data = poList.map((po, index) => {
      const oldBudget = budgetMap.get(po.sbg_budget_id);
      const newBudget = budgetMap.get(po.sbg_budget_id_NEW);
      const oldStructure = oldBudget ? `${oldBudget.fty_fund_type}-${oldBudget.at_activity_code}-${oldBudget.oun_code}-${oldBudget.ccr_costcentre}-${oldBudget.lbc_budget_code || ""}`.toUpperCase() : "";
      const newStructure = newBudget ? `${newBudget.fty_fund_type}-${newBudget.at_activity_code}-${newBudget.oun_code}-${newBudget.ccr_costcentre}-${newBudget.lbc_budget_code || ""}`.toUpperCase() : "";
      const poDetailAccount = `${po.fty_fund_type || ""}-${po.at_activity_code || ""}-${po.oun_code || ""}-${po.ccr_costcentre || ""}-${po.am_account_code || ""}`.toUpperCase();
      return {
        no: index + 1,
        ID: `${po.pom_order_no}_${po.ppc_id}`,
        "PO No": po.pom_order_no || "",
        "PO Detail Account": poDetailAccount,
        "Fund Type": po.fty_fund_type || "",
        Activity: po.at_activity_code || "",
        "Cost Center": po.ccr_costcentre || "",
        "Account Code": po.am_account_code || "",
        "Cpa Project No": po.cpa_project_no || "",
        Balance: po.ppc_balance_amount ? parseFloat(po.ppc_balance_amount.toString()) : 0,
        "Old Structure Budget": oldStructure,
        "Activity Budget": po.pod_at_activity_code_budget || "",
        "Cost Center Budget": po.pod_ccr_costcentre_budget || "",
        "Sbg Budget Id": po.sbg_budget_id || "",
        "Activity Budget New": po.pod_at_activity_code_budget_NEW || "",
        "Cost Center Budget New": po.pod_ccr_costcentre_budget_NEW || "",
        "Sbg Budget Id New": po.sbg_budget_id_NEW || "",
        "New Structure Budget": newStructure,
        Remark: po.remark || "",
        // Keep original data
        ppc_id: po.ppc_id,
        ppc_balance_amount: po.ppc_balance_amount
      };
    });
    const checkboxMonitoring = poList.map((po) => `${po.pom_order_no}_${po.ppc_id}`);
    return {
      statusCode: 200,
      message: "PO Closed Reverse data fetched successfully",
      data,
      recordsFiltered: data.length,
      checkboxMonitoring
    };
  } catch (error) {
    console.error("Error fetching PO Closed Reverse:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO Closed Reverse data",
      error: error.message
    };
  }
});

const index_get$1n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1m
});

const index_get$1k = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search;
    const fty_fund_type = query.fty_fund_type;
    const ppc_year = query.ppc_year;
    let whereClause = {
      opening_status: { not: null }
    };
    if (fty_fund_type === "E01") {
      whereClause.fty_fund_type = "E01";
    } else if (fty_fund_type === "other") {
      whereClause.fty_fund_type = { not: "E01" };
    }
    if (ppc_year) {
      whereClause.ppc_year = ppc_year;
    }
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { fty_fund_type: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
        { am_account_code: { contains: searchTerm } },
        { remark: { contains: searchTerm } }
      ];
    }
    let poList = [];
    try {
      poList = await prisma$1.po_process_closing.findMany({
        where: whereClause,
        orderBy: {
          ppc_id: "desc"
        },
        take: 1e3
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 200,
        message: "PO Confirmation Process List data fetched successfully",
        data: [],
        recordsFiltered: 0
      };
    }
    const oldBudgetIds = [...new Set(poList.map((po) => po.sbg_budget_id).filter(Boolean))];
    const newBudgetIds = [...new Set(poList.map((po) => po.sbg_budget_id_NEW).filter(Boolean))];
    const allBudgetIds = [.../* @__PURE__ */ new Set([...oldBudgetIds, ...newBudgetIds])];
    const structureBudgets = allBudgetIds.length > 0 ? await prisma$1.structure_budget.findMany({
      where: { sbg_budget_id: { in: allBudgetIds } },
      select: {
        sbg_budget_id: true,
        fty_fund_type: true,
        at_activity_code: true,
        oun_code: true,
        ccr_costcentre: true,
        lbc_budget_code: true
      }
    }) : [];
    const budgetMap = new Map(structureBudgets.map((sb) => [sb.sbg_budget_id, sb]));
    const data = poList.map((po, index) => {
      const oldBudget = budgetMap.get(po.sbg_budget_id);
      const newBudget = budgetMap.get(po.sbg_budget_id_NEW);
      const oldStructure = oldBudget ? `${oldBudget.fty_fund_type}-${oldBudget.at_activity_code}-${oldBudget.oun_code}-${oldBudget.ccr_costcentre}-${oldBudget.lbc_budget_code || ""}`.toUpperCase() : "";
      const newStructure = newBudget ? `${newBudget.fty_fund_type}-${newBudget.at_activity_code}-${newBudget.oun_code}-${newBudget.ccr_costcentre}-${newBudget.lbc_budget_code || ""}`.toUpperCase() : "";
      const poDetailAccount = `${po.fty_fund_type || ""}-${po.at_activity_code || ""}-${po.oun_code || ""}-${po.ccr_costcentre || ""}-${po.am_account_code || ""}`.toUpperCase();
      return {
        no: index + 1,
        "PO No": po.pom_order_no || "",
        "PO Detail Account": poDetailAccount,
        "Fund Type": po.fty_fund_type || "",
        Activity: po.at_activity_code || "",
        "Cost Center": po.ccr_costcentre || "",
        "Account Code": po.am_account_code || "",
        "Cpa Project No": po.cpa_project_no || "",
        Balance: po.ppc_balance_amount ? parseFloat(po.ppc_balance_amount.toString()) : 0,
        "Old Structure Budget": oldStructure,
        "Activity Budget": po.pod_at_activity_code_budget || "",
        "Cost Center Budget": po.pod_ccr_costcentre_budget || "",
        "Sbg Budget Id": po.sbg_budget_id || "",
        "Activity Budget New": po.pod_at_activity_code_budget_NEW || "",
        "Cost Center Budget New": po.pod_ccr_costcentre_budget_NEW || "",
        "Sbg Budget Id New": po.sbg_budget_id_NEW || "",
        "New Structure Budget": newStructure,
        Remark: po.remark || ""
      };
    });
    return {
      statusCode: 200,
      message: "PO Confirmation Process List data fetched successfully",
      data,
      recordsFiltered: data.length
    };
  } catch (error) {
    console.error("Error fetching PO Confirmation Process List:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO Confirmation Process List data",
      error: error.message
    };
  }
});

const index_get$1l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1k
});

const _id__get$6 = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "PO ID is required"
      };
    }
    let poData = null;
    try {
      poData = await prisma$1.po_process_closing.findUnique({
        where: { ppc_id: parseInt(id) }
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 404,
        message: "PO not found"
      };
    }
    if (!poData) {
      return {
        statusCode: 404,
        message: "PO not found"
      };
    }
    return {
      statusCode: 200,
      message: "PO details fetched successfully",
      data: {
        ppc_id: poData.ppc_id,
        ppc_year: poData.ppc_year,
        pom_order_no: poData.pom_order_no,
        pod_order_detl_id: poData.pod_order_detl_id,
        pod_line_no: poData.pod_line_no,
        at_activity_code: poData.at_activity_code,
        ccr_costcentre: poData.ccr_costcentre,
        am_account_code: poData.am_account_code,
        cpa_project_no: poData.cpa_project_no,
        ppc_balance_amount: poData.ppc_balance_amount ? parseFloat(poData.ppc_balance_amount.toString()) : 0,
        pod_ccr_costcentre_budget: poData.pod_ccr_costcentre_budget,
        pod_at_activity_code_budget: poData.pod_at_activity_code_budget,
        sbg_budget_id: poData.sbg_budget_id,
        pod_at_activity_code_budget_NEW: poData.pod_at_activity_code_budget_NEW,
        pod_ccr_costcentre_budget_NEW: poData.pod_ccr_costcentre_budget_NEW,
        sbg_budget_id_NEW: poData.sbg_budget_id_NEW,
        fty_fund_type: poData.fty_fund_type,
        oun_code: poData.oun_code
      }
    };
  } catch (error) {
    console.error("Error fetching PO details:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO details",
      error: error.message
    };
  }
});

const _id__get$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$6
});

const confirm_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { poData, tf_fund } = body;
    if (!poData || Object.keys(poData).length === 0) {
      return {
        status: "ko",
        errorMessage: "No PO selected. Please select at least one PO."
      };
    }
    const selectedPOs = Object.keys(poData);
    const poNumbers = [...new Set(selectedPOs.map((key) => {
      const parts = key.split("_");
      return parts[0];
    }))];
    let poRecords = [];
    try {
      poRecords = await prisma$1.po_process_closing.findMany({
        where: {
          pom_order_no: { in: poNumbers },
          opening_status: null
        },
        select: {
          closing_status: true
        },
        distinct: ["closing_status"]
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        status: "ko",
        errorMessage: "Table not found. Please ensure the database is set up correctly."
      };
    }
    if (poRecords.length > 1) {
      return {
        status: "ko",
        errorMessage: "Selected POs have different years. Please select POs from the same year only."
      };
    }
    if (poRecords.length === 0) {
      return {
        status: "ko",
        errorMessage: "No valid records found for selected POs."
      };
    }
    return {
      status: "ok",
      successmessage: `Process completed successfully. ${selectedPOs.length} record(s) processed.`,
      processedCount: selectedPOs.length,
      processedPOs: poNumbers,
      errors: {}
    };
  } catch (error) {
    console.error("Error confirming PO:", error);
    return {
      status: "ko",
      errorMessage: `Process failed: ${error.message}`
    };
  }
});

const confirm_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: confirm_post
});

const index_get$1i = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const fund = query.fund;
    const search = query.search;
    let whereClause = {
      opening_status: null
    };
    if (fund === "E01") {
      whereClause.fty_fund_type = "E01";
    } else if (fund === "other") {
      whereClause.fty_fund_type = { not: "E01" };
    }
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { ppc_id: { contains: searchTerm } },
        { ppc_year: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { pod_order_detl_id: { contains: searchTerm } },
        { pod_line_no: { contains: searchTerm } },
        { fty_fund_type: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } },
        { am_account_code: { contains: searchTerm } },
        { cpa_project_no: { contains: searchTerm } },
        { remark: { contains: searchTerm } }
      ];
    }
    let poList = [];
    try {
      poList = await prisma$1.po_process_closing.findMany({
        where: whereClause,
        orderBy: {
          ppc_id: "desc"
        },
        take: 1e3
        // Limit results
      });
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 200,
        message: "PO Confirmation Process data fetched successfully",
        data: [],
        recordsFiltered: 0,
        checkboxMonitoring: []
      };
    }
    const oldBudgetIds = [...new Set(poList.map((po) => po.sbg_budget_id).filter(Boolean))];
    const newBudgetIds = [...new Set(poList.map((po) => po.sbg_budget_id_NEW).filter(Boolean))];
    const allBudgetIds = [.../* @__PURE__ */ new Set([...oldBudgetIds, ...newBudgetIds])];
    const structureBudgets = allBudgetIds.length > 0 ? await prisma$1.structure_budget.findMany({
      where: { sbg_budget_id: { in: allBudgetIds } },
      select: {
        sbg_budget_id: true,
        fty_fund_type: true,
        at_activity_code: true,
        oun_code: true,
        ccr_costcentre: true,
        lbc_budget_code: true
      }
    }) : [];
    const budgetMap = new Map(structureBudgets.map((sb) => [sb.sbg_budget_id, sb]));
    const activityCodes = [...new Set(poList.map((po) => po.at_activity_code).filter(Boolean))];
    const activityTypes = activityCodes.length > 0 ? await prisma$1.activity_type.findMany({
      where: { at_activity_code: { in: activityCodes } },
      select: {
        at_activity_code: true,
        at_activity_description_bm: true
      }
    }) : [];
    const activityMap = new Map(activityTypes.map((at) => [at.at_activity_code, at]));
    const ounCodes = [...new Set(poList.map((po) => po.oun_code).filter(Boolean))];
    const orgUnits = ounCodes.length > 0 ? await prisma$1.organization_unit.findMany({
      where: { oun_code: { in: ounCodes } },
      select: {
        oun_code: true,
        oun_desc: true
      }
    }) : [];
    const orgUnitMap = new Map(orgUnits.map((ou) => [ou.oun_code, ou]));
    const costCentreCodes = [...new Set(poList.map((po) => po.ccr_costcentre).filter(Boolean))];
    const costCentres = costCentreCodes.length > 0 ? await prisma$1.costcentre.findMany({
      where: { ccr_costcentre: { in: costCentreCodes } },
      select: {
        ccr_costcentre: true,
        ccr_costcentre_desc: true
      }
    }) : [];
    const costCentreMap = new Map(costCentres.map((cc) => [cc.ccr_costcentre, cc]));
    const data = poList.map((po, index) => {
      const oldBudget = budgetMap.get(po.sbg_budget_id);
      const newBudget = budgetMap.get(po.sbg_budget_id_NEW);
      const oldStructure = oldBudget ? `${oldBudget.fty_fund_type}-${oldBudget.at_activity_code}-${oldBudget.oun_code}-${oldBudget.ccr_costcentre}-${oldBudget.lbc_budget_code || ""}`.toUpperCase() : "";
      const newStructure = newBudget ? `${newBudget.fty_fund_type}-${newBudget.at_activity_code}-${newBudget.oun_code}-${newBudget.ccr_costcentre}-${newBudget.lbc_budget_code || ""}`.toUpperCase() : "";
      const poDetailAccount = `${po.fty_fund_type || ""}-${po.at_activity_code || ""}-${po.oun_code || ""}-${po.ccr_costcentre || ""}-${po.am_account_code || ""}`.toUpperCase();
      return {
        no: index + 1,
        ID: `${po.pom_order_no}_${po.ppc_id}`,
        ppc_id: po.ppc_id,
        Year: po.ppc_year || "",
        "Pod Order No": po.pom_order_no || "",
        "Pod Order ID": po.pod_order_detl_id || "",
        "Pod Line No": po.pod_line_no || "",
        "PO Detail Account": poDetailAccount,
        "Fund Type": po.fty_fund_type || "",
        "Activity Code": po.at_activity_code || "",
        PTJ: po.oun_code || "",
        "Cost Centre": po.ccr_costcentre || "",
        "Account Code": po.am_account_code || "",
        "Cpa Project No": po.cpa_project_no || "",
        "Balance Amount": po.ppc_balance_amount ? parseFloat(po.ppc_balance_amount.toString()) : 0,
        "Old Structure Budget": oldStructure,
        "Activity Code Budget": po.pod_at_activity_code_budget || "",
        "Cost Centre Budget": po.pod_ccr_costcentre_budget || "",
        "Sbg Budget ID": po.sbg_budget_id || "",
        "New Activity Code Budget": po.pod_at_activity_code_budget_NEW || "",
        "New Cost Centre Budget": po.pod_ccr_costcentre_budget_NEW || "",
        "New Sbg Budget ID": po.sbg_budget_id_NEW || "",
        "New Structure Budget": newStructure,
        Remark: po.remark || "",
        "Closing Status": po.closing_status === "Y" ? "YES" : "NO",
        "Opening Status": po.opening_status === "Y" ? "YES" : "NO",
        Action: "",
        // Keep original data
        ppc_balance_amount: po.ppc_balance_amount,
        sbg_budget_id_NEW: po.sbg_budget_id_NEW
      };
    });
    const checkboxMonitoring = poList.filter((po) => po.sbg_budget_id_NEW !== null).map((po) => `${po.pom_order_no}_${po.ppc_id}`);
    return {
      statusCode: 200,
      message: "PO Confirmation Process data fetched successfully",
      data,
      recordsFiltered: data.length,
      checkboxMonitoring
    };
  } catch (error) {
    console.error("Error fetching PO Confirmation Process:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO Confirmation Process data",
      error: error.message
    };
  }
});

const index_get$1j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1i
});

const process_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    const { modal_ppcid, modal_budget_code } = body;
    if (!modal_ppcid || !modal_budget_code) {
      return {
        statusCode: 400,
        message: "PPC ID and Budget Code are required"
      };
    }
    let structureBudget = null;
    try {
      structureBudget = await prisma$1.structure_budget.findUnique({
        where: { sbg_budget_id: parseInt(modal_budget_code) },
        select: {
          at_activity_code: true,
          ccr_costcentre: true
        }
      });
    } catch (error) {
      console.log("Error fetching structure budget:", error.message);
      return {
        statusCode: 404,
        message: "Budget code not found"
      };
    }
    if (!structureBudget) {
      return {
        statusCode: 404,
        message: "Budget code not found"
      };
    }
    try {
      await prisma$1.po_process_closing.update({
        where: { ppc_id: parseInt(modal_ppcid) },
        data: {
          sbg_budget_id_NEW: parseInt(modal_budget_code),
          pod_at_activity_code_budget_NEW: structureBudget.at_activity_code,
          pod_ccr_costcentre_budget_NEW: structureBudget.ccr_costcentre,
          updateddate: /* @__PURE__ */ new Date(),
          updatedby: ((_a = event.context.user) == null ? void 0 : _a.username) || "system"
        }
      });
      return {
        statusCode: 200,
        message: "Budget updated successfully",
        status: "ok"
      };
    } catch (tableError) {
      console.log("po_process_closing table may not exist:", tableError.message);
      return {
        statusCode: 500,
        message: "Failed to update PO process closing",
        error: tableError.message
      };
    }
  } catch (error) {
    console.error("Error processing PO:", error);
    return {
      statusCode: 500,
      message: "Failed to process PO",
      error: error.message
    };
  }
});

const process_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: process_post
});

const poProcess_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { year } = body;
    if (!year) {
      return {
        status: "ko",
        errorMessage: "Year is required"
      };
    }
    return {
      status: "ok",
      successmessage: `PO Process completed successfully for year ${year}`
    };
  } catch (error) {
    console.error("Error processing PO:", error);
    return {
      status: "ko",
      errorMessage: `PO Process failed: ${error.message}`
    };
  }
});

const poProcess_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: poProcess_post
});

const poReverse_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { year } = body;
    if (!year) {
      return {
        status: "ko",
        errorMessage: "Year is required"
      };
    }
    return {
      status: "ok",
      successmessage: `PO Reverse completed successfully for year ${year}`
    };
  } catch (error) {
    console.error("Error reversing PO:", error);
    return {
      status: "ko",
      errorMessage: `PO Reverse failed: ${error.message}`
    };
  }
});

const poReverse_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: poReverse_post
});

const index_post$k = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.vcs_vendor_code || !body.pom_request_by || !body.pom_request_date || !body.pom_document_no || !body.pom_description) {
      return {
        statusCode: 400,
        message: "Required fields are missing",
        data: null
      };
    }
    const user = event.context.user || { username: "system" };
    const purchaseOrder = await prisma$1.purchase_order_master.create({
      data: {
        pom_order_no: null,
        // Will be generated by database or sequence
        pom_requisition_no: body.pom_requisition_no || null,
        pom_retrieve_type: body.pom_retrieve_type || null,
        org_code: body.org_code || null,
        vcs_vendor_code: body.vcs_vendor_code,
        pom_address: body.pom_deliver_address || null,
        pom_request_by: body.pom_request_by,
        pom_request_date: body.pom_request_date ? new Date(body.pom_request_date) : /* @__PURE__ */ new Date(),
        pom_available_date: body.pom_estimate_delivery_date ? new Date(body.pom_estimate_delivery_date) : null,
        pom_ref_doc: body.pom_document_no,
        pom_description: body.pom_description,
        pom_doc_receive_date: body.pom_document_received_date ? new Date(body.pom_document_received_date) : null,
        pom_method: body.pom_purchase_method || null,
        pom_order_type: body.pom_purchase_type || null,
        pom_contact_person: body.pom_contact_person || null,
        pom_order_status: body.pom_order_status || "DRAFT",
        pom_order_amt_rm: body.pom_total_amount ? parseFloat(body.pom_total_amount) : null,
        pom_discount_amt: body.pom_discount_amount ? parseFloat(body.pom_discount_amount) : null,
        pom_gross_amt: body.pom_gross_amt ? parseFloat(body.pom_gross_amt) : null,
        pom_order_amt: body.pom_order_amt ? parseFloat(body.pom_order_amt) : null,
        pom_total_paid: body.pom_total_paid ? parseFloat(body.pom_total_paid) : null,
        pom_total_invoiced: body.pom_total_invoiced ? parseFloat(body.pom_total_invoiced) : null,
        pom_total_tax: body.pom_total_tax ? parseFloat(body.pom_total_tax) : null,
        pom_currency_unit: body.pom_currency_unit ? parseFloat(body.pom_currency_unit) : null,
        pom_currency_code: body.pom_currency_code || null,
        pom_conversion_rate: body.pom_conversion_rate ? parseFloat(body.pom_conversion_rate) : null,
        pom_rate_type: body.pom_rate_type || null,
        pom_rate_date: body.pom_rate_date ? new Date(body.pom_rate_date) : null,
        pom_ent_amt: body.pom_ent_amt ? parseFloat(body.pom_ent_amt) : null,
        pom_exchange_type_code: body.pom_exchange_type_code || null,
        pom_shipto_id: body.pom_shipto_id || null,
        pom_aggrement_no: body.pom_aggrement_no || null,
        pom_order_ref: body.pom_order_ref || null,
        cpa_project_no: body.cpa_project_no || null,
        pom_wflow_sts: body.pom_wflow_sts || null,
        pom_wflow_type: body.pom_wflow_type || null,
        createdby: user.username || "system",
        updatedby: user.username || "system"
      }
    });
    if (body.purchase_order_details && Array.isArray(body.purchase_order_details) && body.purchase_order_details.length > 0) {
      const detailsData = body.purchase_order_details.map((detail) => ({
        pom_order_id: purchaseOrder.pom_order_id,
        rqm_requisition_no: detail.rqm_requisition_no || null,
        bdg_budget_code: detail.bdg_budget_code || "",
        am_account_code: detail.am_account_code || "",
        pod_line_no: detail.pod_line_no ? parseFloat(detail.pod_line_no) : 0,
        itm_item_code: detail.itm_item_code || null,
        oun_code: detail.oun_code || null,
        pod_order_qty: detail.pod_order_qty ? parseFloat(detail.pod_order_qty) : null,
        pod_unit_price: detail.pod_unit_price ? parseFloat(detail.pod_unit_price) : null,
        pod_gross_amt: detail.pod_gross_amt ? parseFloat(detail.pod_gross_amt) : null,
        pod_discount: detail.pod_discount ? parseFloat(detail.pod_discount) : null,
        pod_total_amt: detail.pod_total_amt ? parseFloat(detail.pod_total_amt) : null,
        pod_total_invoiced: detail.pod_total_invoiced ? parseFloat(detail.pod_total_invoiced) : null,
        pod_total_paid: detail.pod_total_paid ? parseFloat(detail.pod_total_paid) : null,
        pod_item_spec: detail.pod_item_spec || null,
        pod_status: detail.pod_status || null,
        pod_request_no: detail.pod_request_no || null,
        pod_received_qty: detail.pod_received_qty ? parseFloat(detail.pod_received_qty) : null,
        pod_uom: detail.pod_uom || null,
        pod_crnote_amt: detail.pod_crnote_amt ? parseFloat(detail.pod_crnote_amt) : null,
        pod_lib_seq: detail.pod_lib_seq || null,
        so_code: detail.so_code || null,
        cpa_project_no: detail.cpa_project_no || null,
        pod_pakej_no: detail.pod_pakej_no ? parseFloat(detail.pod_pakej_no) : null,
        itm_item_no: detail.itm_item_no ? parseFloat(detail.itm_item_no) : null,
        pod_brand: detail.pod_brand || null,
        cny_country_code: detail.cny_country_code || null,
        pod_taxcode: detail.pod_taxcode || null,
        pod_taxpct: detail.pod_taxpct ? parseFloat(detail.pod_taxpct) : null,
        pod_taxamt: detail.pod_taxamt ? parseFloat(detail.pod_taxamt) : null,
        ccr_costcentre: detail.ccr_costcentre || null,
        pod_ccr_costcentre_budget: detail.pod_ccr_costcentre_budget || null,
        fty_fund_type: detail.fty_fund_type || null,
        at_activity_code: detail.at_activity_code || null,
        pod_at_activity_code_budget: detail.pod_at_activity_code_budget || null,
        sbg_budget_id: detail.sbg_budget_id || null,
        pod_ent_amt: detail.pod_ent_amt ? parseFloat(detail.pod_ent_amt) : null,
        pod_total_amtrm: detail.pod_total_amtrm ? parseFloat(detail.pod_total_amtrm) : null,
        pod_req_no: detail.pod_req_no || null,
        rqd_requisition_id: detail.rqd_requisition_id || null,
        pod_flag_manual: detail.pod_flag_manual || null,
        pod_cn_amount_ent: detail.pod_cn_amount_ent ? parseFloat(detail.pod_cn_amount_ent) : null,
        pod_cn_amount: detail.pod_cn_amount ? parseFloat(detail.pod_cn_amount) : null,
        createdby: user.username || "system",
        updatedby: user.username || "system"
      }));
      await prisma$1.purchase_order_details.createMany({
        data: detailsData
      });
    }
    return {
      statusCode: 201,
      message: "Purchase order created successfully",
      data: {
        pom_order_id: purchaseOrder.pom_order_id,
        pom_order_no: purchaseOrder.pom_order_no
      }
    };
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return {
      statusCode: 500,
      message: "Failed to create purchase order",
      error: error.message
    };
  }
});

const index_post$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$k
});

const index_get$1g = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      pom_order_status: { contains: "CANCEL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } }
      ];
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereClause,
      orderBy: {
        pom_order_id: "desc"
      }
    });
    const vendorCodes = [...new Set(purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const data = purchaseOrders.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || "",
        pom_description: po.pom_description || "",
        oun_code: po.pom_order_ref || "",
        vcs_vendor_code: po.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        pom_order_status: po.pom_order_status || "",
        pom_cancel_remark: po.pom_cancel_remark || "",
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Purchase order cancellations fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching purchase order cancellations:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase order cancellations",
      error: error.message
    };
  }
});

const index_get$1h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1g
});

const index_get$1e = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      pom_order_status: { not: null }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_requisition_no: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.pom_order_status = query.smartFilter_Status;
    }
    if (query.smartFilter_DateFrom) {
      const [day, month, year] = query.smartFilter_DateFrom.split("/");
      const startDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}`);
      whereClause.pom_approve_date = {
        ...whereClause.pom_approve_date || {},
        gte: startDate
      };
    }
    if (query.smartFilter_DateTo) {
      const [day, month, year] = query.smartFilter_DateTo.split("/");
      const endDate = /* @__PURE__ */ new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.pom_approve_date = {
        ...whereClause.pom_approve_date || {},
        lte: endDate
      };
    }
    if (query.smartFilter_Description) {
      whereClause.pom_description = { contains: query.smartFilter_Description };
    }
    if (query.smartFilter_PoNo) {
      whereClause.pom_order_no = query.smartFilter_PoNo;
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereClause,
      include: {
        purchase_order_details: {
          select: {
            pom_order_id: true,
            rqm_requisition_no: true,
            oun_code: true
          }
        }
      },
      orderBy: {
        createddate: "desc"
      }
    });
    const vendorCodes = [...new Set(purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean))];
    const requisitionNos = [...new Set(purchaseOrders.flatMap(
      (po) => po.purchase_order_details.map((pod) => pod.rqm_requisition_no).filter(Boolean)
    ))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes }
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true,
        vcs_addr3: true
      }
    }) : [];
    const requisitions = requisitionNos.length > 0 ? await prisma$1.requisition_master.findMany({
      where: {
        rqm_requisition_no: { in: requisitionNos }
      },
      select: {
        rqm_requisition_no: true,
        oun_code: true
      }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const requisitionMap = new Map(requisitions.map((r) => [r.rqm_requisition_no, r]));
    let filteredPOs = purchaseOrders;
    if (query.smartFilter_Cancellation || query.smartFilter_VenName) {
      filteredPOs = purchaseOrders.filter((po) => {
        var _a, _b;
        const vendor = vendorMap.get(po.vcs_vendor_code);
        if (!vendor)
          return false;
        if (query.smartFilter_Cancellation && !((_a = vendor.vcs_addr3) == null ? void 0 : _a.includes(query.smartFilter_Cancellation))) {
          return false;
        }
        if (query.smartFilter_VenName && !((_b = vendor.vcs_vendor_name) == null ? void 0 : _b.includes(query.smartFilter_VenName))) {
          return false;
        }
        return true;
      });
    }
    const data = filteredPOs.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      let ounCode = po.pom_order_ref || null;
      const requisitionNosFromPO = po.purchase_order_details.map((pod) => pod.rqm_requisition_no).filter(Boolean);
      if (requisitionNosFromPO.length > 0) {
        const firstReq = requisitionMap.get(requisitionNosFromPO[0]);
        if (firstReq == null ? void 0 : firstReq.oun_code) {
          ounCode = firstReq.oun_code;
        }
      }
      const prlno = requisitionNosFromPO.join(",");
      const approveDate = po.pom_approve_date || po.updateddate || po.createddate;
      const formattedDate = approveDate ? new Date(approveDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      const createdDate = po.updateddate || po.createddate;
      const formattedCreatedDate = createdDate ? new Date(createdDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || "",
        pom_description: po.pom_description || "",
        oun_code: ounCode || "",
        vcs_vendor_code: po.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        pom_order_status: po.pom_order_status || "",
        prlno: prlno || "",
        createddate: formattedCreatedDate,
        APPROVE_UPDATEDATE: formattedDate,
        pom_approve_by: po.pom_approve_by || "",
        // urlEdit is kept for backward compatibility but not used for navigation
        urlEdit: `/purchasing/purchase-order/new`,
        was_notes: ""
        // Will be populated if needed from wf_application_status
      };
    });
    return {
      statusCode: 200,
      message: "Purchase orders fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase orders",
      error: error.message
    };
  }
});

const index_get$1f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1e
});

const index_get$1c = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      pom_order_status: { not: { in: ["CANCEL", "PARTIAL"] } }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } }
      ];
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereClause,
      orderBy: {
        pom_order_id: "desc"
      }
    });
    const vendorCodes = [...new Set(purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const data = purchaseOrders.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || "",
        pom_description: po.pom_description || "",
        oun_code: po.pom_order_ref || "",
        vcs_vendor_code: po.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Purchase orders for cancel partial fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching purchase orders for cancel partial:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase orders for cancel partial",
      error: error.message
    };
  }
});

const index_get$1d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1c
});

const index_get$1a = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      pom_order_status: { not: "CANCEL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } }
      ];
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereClause,
      orderBy: {
        pom_order_id: "desc"
      }
    });
    const vendorCodes = [...new Set(purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const data = purchaseOrders.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || "",
        pom_description: po.pom_description || "",
        vcs_vendor_code: po.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        pom_order_status: po.pom_order_status || "",
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Purchase orders for cancellation fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching purchase orders for cancellation:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase orders for cancellation",
      error: error.message
    };
  }
});

const index_get$1b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$1a
});

const _id__get$4 = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid requisition ID",
        data: null
      };
    }
    const requisition = await prisma$1.requisition_master.findUnique({
      where: {
        rqm_requisition_id: id
      },
      include: {
        requisition_details: {
          orderBy: {
            rqd_line_no: "asc"
          }
        }
      }
    });
    if (!requisition) {
      return {
        statusCode: 404,
        message: "Requisition not found",
        data: null
      };
    }
    const formattedData = {
      rqm_requisition_id: requisition.rqm_requisition_id,
      rqm_requisition_no: requisition.rqm_requisition_no || "",
      rqm_request_by: requisition.rqm_request_by || "",
      rqm_request_date: requisition.rqm_request_date ? requisition.rqm_request_date.toISOString().split("T")[0] : "",
      rqm_status: requisition.rqm_status || "DRAFT",
      rqm_requisition_title: requisition.rqm_requisition_title || "",
      rqm_justification: requisition.rqm_tender_scope || "",
      rqm_agreement: requisition.rqm_isagreement_exist || "N",
      rqm_agg_no: requisition.rqm_agg_no || "",
      rqm_contact_person: requisition.rqm_contact_person || "",
      rqm_vendor: requisition.rqm_payee_code || "",
      rqm_enter_amount: requisition.rqm_ent_amt ? parseFloat(requisition.rqm_ent_amt.toString()) : 0,
      rqm_total_amount: requisition.rqm_amount ? parseFloat(requisition.rqm_amount.toString()) : 0,
      rqm_rate_date: requisition.rqm_rate_date ? requisition.rqm_rate_date.toISOString().split("T")[0] : "",
      rqm_currency_code: requisition.rqm_currency_code || "",
      rqm_rate_type: requisition.rqm_rate_type || "",
      rqm_conversion_unit: requisition.rqm_currency_unit ? parseFloat(requisition.rqm_currency_unit.toString()) : 0,
      rqm_conversion_rate: requisition.rqm_conversion_rate ? parseFloat(requisition.rqm_conversion_rate.toString()) : 0,
      rqm_document_no: requisition.rqm_ref_no || "",
      rqm_requisition_type: requisition.rqm_tender_type || "",
      // Additional fields
      org_code: requisition.org_code || "",
      oun_code: requisition.oun_code || "",
      fty_fund_type: requisition.fty_fund_type || "",
      ccr_costcentre: requisition.ccr_costcentre || "",
      at_activity_code: requisition.at_activity_code || "",
      so_code: requisition.so_code || "",
      cpa_project_no: requisition.cpa_project_no || "",
      rqm_total_gst: requisition.rqm_total_gst ? parseFloat(requisition.rqm_total_gst.toString()) : 0,
      rqm_balance_bdgt: requisition.rqm_balance_bdgt ? parseFloat(requisition.rqm_balance_bdgt.toString()) : 0,
      rqm_wflow_sts: requisition.rqm_wflow_sts || "",
      rqm_wflow_type: requisition.rqm_wflow_type || "",
      rqm_jenis_tender: requisition.rqm_jenis_tender || "",
      rqm_start_date: requisition.rqm_start_date ? requisition.rqm_start_date.toISOString().split("T")[0] : "",
      rqm_end_date: requisition.rqm_end_date ? requisition.rqm_end_date.toISOString().split("T")[0] : "",
      rqm_shipto_id: requisition.rqm_shipto_id || null,
      rqm_flag_bill: requisition.rqm_flag_bill || "",
      rqm_open: requisition.rqm_open || "",
      rqm_bumiputera: requisition.rqm_bumiputera || "",
      rqm_reg_no: requisition.rqm_reg_no || "",
      rqm_cctr_type: requisition.rqm_cctr_type || "",
      rqm_multi_cctr: requisition.rqm_multi_cctr || "",
      // Details
      requisition_details: requisition.requisition_details.map((detail) => ({
        rqd_requisition_id: detail.rqd_requisition_id,
        rqd_line_no: detail.rqd_line_no ? parseFloat(detail.rqd_line_no.toString()) : 0,
        rqd_spec_desc: detail.rqd_spec_desc || "",
        rqd_pakej_no: detail.rqd_pakej_no || "",
        rqd_item_no: detail.rqd_item_no ? parseFloat(detail.rqd_item_no.toString()) : 0,
        rqd_spec_level: detail.rqd_spec_level || "",
        rqd_spec_head: detail.rqd_spec_head || "",
        itm_item_code: detail.itm_item_code || "",
        rqd_qty: detail.rqd_qty || "",
        rqd_uom: detail.rqd_uom || "",
        rqd_price: detail.rqd_price ? parseFloat(detail.rqd_price.toString()) : 0,
        rqd_gross_amt: detail.rqd_gross_amt ? parseFloat(detail.rqd_gross_amt.toString()) : 0,
        rqd_ent_amt: detail.rqd_ent_amt ? parseFloat(detail.rqd_ent_amt.toString()) : 0,
        rqd_total_price: detail.rqd_total_price ? parseFloat(detail.rqd_total_price.toString()) : 0,
        rqd_total_price_rm: detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm.toString()) : 0,
        org_code: detail.org_code || "",
        fty_fund_type: detail.fty_fund_type || "",
        oun_code: detail.oun_code || "",
        at_activity_code: detail.at_activity_code || "",
        ccr_costcentre: detail.ccr_costcentre || "",
        so_code: detail.so_code || "",
        cpa_project_no: detail.cpa_project_no || "",
        bdg_budget_code: detail.bdg_budget_code || "",
        acm_acct_code: detail.acm_acct_code || "",
        rqd_ccr_costcentre_budget: detail.rqd_ccr_costcentre_budget || "",
        sbg_budget_id: detail.sbg_budget_id || null,
        rqd_at_activity_code_budget: detail.rqd_at_activity_code_budget || "",
        rqd_commit_amt: detail.rqd_commit_amt ? parseFloat(detail.rqd_commit_amt.toString()) : 0,
        rqd_vot: detail.rqd_vot || "",
        rqd_taxcode: detail.rqd_taxcode || "",
        rqd_taxpct: detail.rqd_taxpct ? parseFloat(detail.rqd_taxpct.toString()) : 0,
        rqd_taxamt: detail.rqd_taxamt ? parseFloat(detail.rqd_taxamt.toString()) : 0,
        rqd_status: detail.rqd_status || ""
      }))
    };
    return {
      statusCode: 200,
      message: "Requisition fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching requisition:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch requisition",
      error: error.message
    };
  }
});

const _id__get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$4
});

const _id__put$8 = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid requisition ID",
        data: null
      };
    }
    const existingRequisition = await prisma$1.requisition_master.findUnique({
      where: {
        rqm_requisition_id: id
      }
    });
    if (!existingRequisition) {
      return {
        statusCode: 404,
        message: "Requisition not found",
        data: null
      };
    }
    const user = event.context.user || { username: "system" };
    const requisition = await prisma$1.requisition_master.update({
      where: {
        rqm_requisition_id: id
      },
      data: {
        org_code: body.org_code !== void 0 ? body.org_code : existingRequisition.org_code,
        oun_code: body.oun_code !== void 0 ? body.oun_code : existingRequisition.oun_code,
        fty_fund_type: body.fty_fund_type !== void 0 ? body.fty_fund_type : existingRequisition.fty_fund_type,
        ccr_costcentre: body.ccr_costcentre !== void 0 ? body.ccr_costcentre : existingRequisition.ccr_costcentre,
        at_activity_code: body.at_activity_code !== void 0 ? body.at_activity_code : existingRequisition.at_activity_code,
        so_code: body.so_code !== void 0 ? body.so_code : existingRequisition.so_code,
        cpa_project_no: body.cpa_project_no !== void 0 ? body.cpa_project_no : existingRequisition.cpa_project_no,
        rqm_requisition_title: body.rqm_requisition_title !== void 0 ? body.rqm_requisition_title : existingRequisition.rqm_requisition_title,
        rqm_tender_scope: body.rqm_justification !== void 0 ? body.rqm_justification : existingRequisition.rqm_tender_scope,
        rqm_tender_type: body.rqm_requisition_type !== void 0 ? body.rqm_requisition_type : existingRequisition.rqm_tender_type,
        rqm_jenis_tender: body.rqm_jenis_tender !== void 0 ? body.rqm_jenis_tender : existingRequisition.rqm_jenis_tender,
        rqm_conversion_rate: body.rqm_conversion_rate !== void 0 ? body.rqm_conversion_rate ? parseFloat(body.rqm_conversion_rate) : null : existingRequisition.rqm_conversion_rate,
        rqm_currency_unit: body.rqm_conversion_unit !== void 0 ? body.rqm_conversion_unit ? parseFloat(body.rqm_conversion_unit) : null : existingRequisition.rqm_currency_unit,
        rqm_currency_code: body.rqm_currency_code !== void 0 ? body.rqm_currency_code : existingRequisition.rqm_currency_code,
        rqm_rate_type: body.rqm_rate_type !== void 0 ? body.rqm_rate_type : existingRequisition.rqm_rate_type,
        rqm_rate_date: body.rqm_rate_date !== void 0 ? body.rqm_rate_date ? new Date(body.rqm_rate_date) : null : existingRequisition.rqm_rate_date,
        rqm_ent_amt: body.rqm_enter_amount !== void 0 ? body.rqm_enter_amount ? parseFloat(body.rqm_enter_amount) : null : existingRequisition.rqm_ent_amt,
        rqm_amount: body.rqm_total_amount !== void 0 ? body.rqm_total_amount ? parseFloat(body.rqm_total_amount) : null : existingRequisition.rqm_amount,
        rqm_total_gst: body.rqm_total_gst !== void 0 ? body.rqm_total_gst ? parseFloat(body.rqm_total_gst) : null : existingRequisition.rqm_total_gst,
        rqm_balance_bdgt: body.rqm_balance_bdgt !== void 0 ? body.rqm_balance_bdgt ? parseFloat(body.rqm_balance_bdgt) : null : existingRequisition.rqm_balance_bdgt,
        rqm_status: body.rqm_status !== void 0 ? body.rqm_status : existingRequisition.rqm_status,
        rqm_wflow_sts: body.rqm_wflow_sts !== void 0 ? body.rqm_wflow_sts : existingRequisition.rqm_wflow_sts,
        rqm_wflow_type: body.rqm_wflow_type !== void 0 ? body.rqm_wflow_type : existingRequisition.rqm_wflow_type,
        rqm_request_by: body.rqm_request_by !== void 0 ? body.rqm_request_by : existingRequisition.rqm_request_by,
        rqm_request_date: body.rqm_request_date !== void 0 ? body.rqm_request_date ? new Date(body.rqm_request_date) : null : existingRequisition.rqm_request_date,
        rqm_ref_no: body.rqm_document_no !== void 0 ? body.rqm_document_no : existingRequisition.rqm_ref_no,
        rqm_shipto_id: body.rqm_shipto_id !== void 0 ? body.rqm_shipto_id : existingRequisition.rqm_shipto_id,
        rqm_contact_person: body.rqm_contact_person !== void 0 ? body.rqm_contact_person : existingRequisition.rqm_contact_person,
        rqm_flag_bill: body.rqm_flag_bill !== void 0 ? body.rqm_flag_bill : existingRequisition.rqm_flag_bill,
        rqm_open: body.rqm_open !== void 0 ? body.rqm_open : existingRequisition.rqm_open,
        rqm_bumiputera: body.rqm_bumiputera !== void 0 ? body.rqm_bumiputera : existingRequisition.rqm_bumiputera,
        rqm_reg_no: body.rqm_reg_no !== void 0 ? body.rqm_reg_no : existingRequisition.rqm_reg_no,
        rqm_cctr_type: body.rqm_cctr_type !== void 0 ? body.rqm_cctr_type : existingRequisition.rqm_cctr_type,
        rqm_multi_cctr: body.rqm_multi_cctr !== void 0 ? body.rqm_multi_cctr : existingRequisition.rqm_multi_cctr,
        rqm_isagreement_exist: body.rqm_agreement !== void 0 ? body.rqm_agreement : existingRequisition.rqm_isagreement_exist,
        rqm_agg_no: body.rqm_agg_no !== void 0 ? body.rqm_agg_no : existingRequisition.rqm_agg_no,
        rqm_payee_code: body.rqm_vendor !== void 0 ? body.rqm_vendor : existingRequisition.rqm_payee_code,
        updatedby: user.username || "system",
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    if (body.requisition_details && Array.isArray(body.requisition_details)) {
      await prisma$1.requisition_details.deleteMany({
        where: {
          rqm_requisition_id: id
        }
      });
      if (body.requisition_details.length > 0) {
        const detailsData = body.requisition_details.map((detail, index) => ({
          rqd_requisition_id: index + 1,
          rqm_requisition_id: id,
          rqd_line_no: detail.rqd_line_no ? parseFloat(detail.rqd_line_no) : index + 1,
          rqd_spec_desc: detail.rqd_spec_desc || null,
          rqd_pakej_no: detail.rqd_pakej_no || null,
          rqd_item_no: detail.rqd_item_no ? parseFloat(detail.rqd_item_no) : null,
          rqd_spec_level: detail.rqd_spec_level || null,
          rqd_spec_head: detail.rqd_spec_head || null,
          itm_item_code: detail.itm_item_code || null,
          rqd_qty: detail.rqd_qty || null,
          rqd_uom: detail.rqd_uom || null,
          rqd_price: detail.rqd_price ? parseFloat(detail.rqd_price) : null,
          rqd_gross_amt: detail.rqd_gross_amt ? parseFloat(detail.rqd_gross_amt) : null,
          rqd_ent_amt: detail.rqd_ent_amt ? parseFloat(detail.rqd_ent_amt) : null,
          rqd_total_price: detail.rqd_total_price ? parseFloat(detail.rqd_total_price) : null,
          rqd_total_price_rm: detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm) : null,
          org_code: detail.org_code || null,
          fty_fund_type: detail.fty_fund_type || null,
          oun_code: detail.oun_code || null,
          at_activity_code: detail.at_activity_code || null,
          ccr_costcentre: detail.ccr_costcentre || null,
          so_code: detail.so_code || null,
          cpa_project_no: detail.cpa_project_no || null,
          bdg_budget_code: detail.bdg_budget_code || null,
          acm_acct_code: detail.acm_acct_code || null,
          rqd_ccr_costcentre_budget: detail.rqd_ccr_costcentre_budget || null,
          sbg_budget_id: detail.sbg_budget_id || null,
          rqd_at_activity_code_budget: detail.rqd_at_activity_code_budget || null,
          rqd_commit_amt: detail.rqd_commit_amt ? parseFloat(detail.rqd_commit_amt) : null,
          rqd_vot: detail.rqd_vot || null,
          rqd_taxcode: detail.rqd_taxcode || null,
          rqd_taxpct: detail.rqd_taxpct ? parseFloat(detail.rqd_taxpct) : null,
          rqd_taxamt: detail.rqd_taxamt ? parseFloat(detail.rqd_taxamt) : null,
          rqd_status: detail.rqd_status || null,
          createdby: user.username || "system",
          updatedby: user.username || "system"
        }));
        await prisma$1.requisition_details.createMany({
          data: detailsData
        });
      }
    }
    return {
      statusCode: 200,
      message: "Requisition updated successfully",
      data: {
        rqm_requisition_id: requisition.rqm_requisition_id,
        rqm_requisition_no: requisition.rqm_requisition_no
      }
    };
  } catch (error) {
    console.error("Error updating requisition:", error);
    return {
      statusCode: 500,
      message: "Failed to update requisition",
      error: error.message
    };
  }
});

const _id__put$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$8
});

const processFlow_get = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    if (!id || isNaN(id)) {
      return {
        statusCode: 400,
        message: "Invalid purchase requisition ID",
        data: []
      };
    }
    const requisition = await prisma$1.requisition_master.findUnique({
      where: {
        rqm_requisition_id: id
      },
      select: {
        rqm_requisition_no: true,
        rqm_wflow_type: true
      }
    });
    if (!requisition || !requisition.rqm_requisition_no) {
      return {
        statusCode: 200,
        message: "Process flow fetched successfully",
        data: []
      };
    }
    const workflowCode = requisition.rqm_wflow_type || "PR";
    const processes = await prisma$1.wf_process.findMany({
      where: {
        wfp_workflow_code: workflowCode,
        wfp_status: "1"
      },
      select: {
        wfp_process_id: true,
        wfp_process_name: true,
        wfp_sequence: true
      },
      orderBy: {
        wfp_sequence: "asc"
      }
    });
    if (processes.length === 0) {
      return {
        statusCode: 200,
        message: "Process flow fetched successfully",
        data: []
      };
    }
    const processIds = processes.map((p) => p.wfp_process_id);
    const applicationStatuses = await prisma$1.wf_application_status.findMany({
      where: {
        was_process_id: { in: processIds },
        was_application_id: requisition.rqm_requisition_no
      },
      select: {
        was_process_id: true,
        was_notes: true,
        createddate: true,
        createdby: true,
        was_extended_field: true
      }
    });
    const statusMap = new Map(
      applicationStatuses.map((status) => [status.was_process_id, status])
    );
    const usernames = applicationStatuses.map((s) => s.createdby).filter(Boolean);
    const staffList = usernames.length > 0 ? await prisma$1.staff.findMany({
      where: {
        stf_ad_username: { in: usernames }
      },
      select: {
        stf_ad_username: true,
        stf_staff_id: true,
        stf_email_addr: true,
        stf_telno_work: true
      }
    }) : [];
    const staffMap = new Map(
      staffList.map((staff) => [staff.stf_ad_username, staff])
    );
    const staffIds = staffList.map((s) => s.stf_staff_id);
    const staffServices = staffIds.length > 0 ? await prisma$1.staff_service.findMany({
      where: {
        stf_staff_id: { in: staffIds },
        sts_job_flag: "1"
      },
      select: {
        stf_staff_id: true,
        sts_oun_code: true,
        sts_extended_field: true
      }
    }) : [];
    const staffServiceMap = /* @__PURE__ */ new Map();
    staffServices.forEach((ss) => {
      if (!staffServiceMap.has(ss.stf_staff_id)) {
        staffServiceMap.set(ss.stf_staff_id, ss);
      }
    });
    const formattedData = processes.map((process, index) => {
      const status = statusMap.get(process.wfp_process_id);
      const staff = (status == null ? void 0 : status.createdby) ? staffMap.get(status.createdby) : null;
      const staffService = (staff == null ? void 0 : staff.stf_staff_id) ? staffServiceMap.get(staff.stf_staff_id) : null;
      const wasExtendedField = (status == null ? void 0 : status.was_extended_field) || {};
      const stsExtendedField = (staffService == null ? void 0 : staffService.sts_extended_field) || {};
      const ptjDesc = staffService ? [staffService.sts_oun_code, stsExtendedField.sts_oun_desc].filter(Boolean).join("-") : "";
      return {
        no: index + 1,
        Process: process.wfp_process_name || "",
        By: wasExtendedField.createdby_name || (status == null ? void 0 : status.createdby) || "",
        PTJ: ptjDesc,
        Email: (staff == null ? void 0 : staff.stf_email_addr) || "",
        "No Telefon": (staff == null ? void 0 : staff.stf_telno_work) || "",
        Status: wasExtendedField.was_status_desc ? wasExtendedField.was_status_desc.toUpperCase() : (status == null ? void 0 : status.was_status) || "",
        Comment: (status == null ? void 0 : status.was_notes) || "",
        Date: (status == null ? void 0 : status.createddate) ? new Date(status.createddate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }).replace(/\//g, "/") : ""
      };
    });
    formattedData.sort((a, b) => {
      const processA = processes.find((p) => p.wfp_process_name === a.Process);
      const processB = processes.find((p) => p.wfp_process_name === b.Process);
      if (processA && processB) {
        if (processA.wfp_sequence !== processB.wfp_sequence) {
          return processA.wfp_sequence - processB.wfp_sequence;
        }
        const dateA = a.Date ? new Date(a.Date.split("/").reverse().join("-")).getTime() : 0;
        const dateB = b.Date ? new Date(b.Date.split("/").reverse().join("-")).getTime() : 0;
        return dateA - dateB;
      }
      return 0;
    });
    return {
      statusCode: 200,
      message: "Process flow fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching process flow:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch process flow",
      error: error.message
    };
  }
});

const processFlow_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: processFlow_get
});

const index_post$i = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.rqm_request_by || !body.rqm_request_date || !body.rqm_requisition_title) {
      return {
        statusCode: 400,
        message: "Required fields are missing",
        data: null
      };
    }
    const user = event.context.user || { username: "system" };
    const requisition = await prisma$1.requisition_master.create({
      data: {
        rqm_requisition_no: null,
        // Will be generated by database or sequence
        org_code: body.org_code || null,
        oun_code: body.oun_code || null,
        fty_fund_type: body.fty_fund_type || null,
        ccr_costcentre: body.ccr_costcentre || "",
        at_activity_code: body.at_activity_code || null,
        so_code: body.so_code || null,
        cpa_project_no: body.cpa_project_no || null,
        rqm_requisition_title: body.rqm_requisition_title,
        rqm_tender_scope: body.rqm_justification || null,
        rqm_tender_type: body.rqm_requisition_type || null,
        rqm_jenis_tender: body.rqm_jenis_tender || null,
        rqm_conversion_rate: body.rqm_conversion_rate ? parseFloat(body.rqm_conversion_rate) : null,
        rqm_currency_unit: body.rqm_conversion_unit ? parseFloat(body.rqm_conversion_unit) : null,
        rqm_currency_code: body.rqm_currency_code || null,
        rqm_rate_type: body.rqm_rate_type || null,
        rqm_rate_date: body.rqm_rate_date ? new Date(body.rqm_rate_date) : null,
        rqm_ent_amt: body.rqm_enter_amount ? parseFloat(body.rqm_enter_amount) : null,
        rqm_amount: body.rqm_total_amount ? parseFloat(body.rqm_total_amount) : null,
        rqm_total_gst: body.rqm_total_gst ? parseFloat(body.rqm_total_gst) : null,
        rqm_balance_bdgt: body.rqm_balance_bdgt ? parseFloat(body.rqm_balance_bdgt) : null,
        rqm_status: body.rqm_status || "DRAFT",
        rqm_wflow_sts: body.rqm_wflow_sts || null,
        rqm_wflow_type: body.rqm_wflow_type || null,
        rqm_request_by: body.rqm_request_by,
        rqm_request_date: body.rqm_request_date ? new Date(body.rqm_request_date) : /* @__PURE__ */ new Date(),
        rqm_ref_no: body.rqm_document_no || null,
        rqm_shipto_id: body.rqm_shipto_id || null,
        rqm_contact_person: body.rqm_contact_person || null,
        rqm_flag_bill: body.rqm_flag_bill || null,
        rqm_open: body.rqm_open || null,
        rqm_bumiputera: body.rqm_bumiputera || null,
        rqm_reg_no: body.rqm_reg_no || null,
        rqm_cctr_type: body.rqm_cctr_type || null,
        rqm_multi_cctr: body.rqm_multi_cctr || null,
        rqm_isagreement_exist: body.rqm_agreement || "N",
        rqm_agg_no: body.rqm_agg_no || null,
        rqm_payee_code: body.rqm_vendor || null,
        createdby: user.username || "system",
        updatedby: user.username || "system"
      }
    });
    if (body.requisition_details && Array.isArray(body.requisition_details) && body.requisition_details.length > 0) {
      const detailsData = body.requisition_details.map((detail, index) => ({
        rqd_requisition_id: index + 1,
        rqm_requisition_id: requisition.rqm_requisition_id,
        rqd_line_no: detail.rqd_line_no ? parseFloat(detail.rqd_line_no) : index + 1,
        rqd_spec_desc: detail.rqd_spec_desc || null,
        rqd_pakej_no: detail.rqd_pakej_no || null,
        rqd_item_no: detail.rqd_item_no ? parseFloat(detail.rqd_item_no) : null,
        rqd_spec_level: detail.rqd_spec_level || null,
        rqd_spec_head: detail.rqd_spec_head || null,
        itm_item_code: detail.itm_item_code || null,
        rqd_qty: detail.rqd_qty || null,
        rqd_uom: detail.rqd_uom || null,
        rqd_price: detail.rqd_price ? parseFloat(detail.rqd_price) : null,
        rqd_gross_amt: detail.rqd_gross_amt ? parseFloat(detail.rqd_gross_amt) : null,
        rqd_ent_amt: detail.rqd_ent_amt ? parseFloat(detail.rqd_ent_amt) : null,
        rqd_total_price: detail.rqd_total_price ? parseFloat(detail.rqd_total_price) : null,
        rqd_total_price_rm: detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm) : null,
        org_code: detail.org_code || null,
        fty_fund_type: detail.fty_fund_type || null,
        oun_code: detail.oun_code || null,
        at_activity_code: detail.at_activity_code || null,
        ccr_costcentre: detail.ccr_costcentre || null,
        so_code: detail.so_code || null,
        cpa_project_no: detail.cpa_project_no || null,
        bdg_budget_code: detail.bdg_budget_code || null,
        acm_acct_code: detail.acm_acct_code || null,
        rqd_ccr_costcentre_budget: detail.rqd_ccr_costcentre_budget || null,
        sbg_budget_id: detail.sbg_budget_id || null,
        rqd_at_activity_code_budget: detail.rqd_at_activity_code_budget || null,
        rqd_commit_amt: detail.rqd_commit_amt ? parseFloat(detail.rqd_commit_amt) : null,
        rqd_vot: detail.rqd_vot || null,
        rqd_taxcode: detail.rqd_taxcode || null,
        rqd_taxpct: detail.rqd_taxpct ? parseFloat(detail.rqd_taxpct) : null,
        rqd_taxamt: detail.rqd_taxamt ? parseFloat(detail.rqd_taxamt) : null,
        rqd_status: detail.rqd_status || null,
        createdby: user.username || "system",
        updatedby: user.username || "system"
      }));
      await prisma$1.requisition_details.createMany({
        data: detailsData
      });
    }
    return {
      statusCode: 201,
      message: "Requisition created successfully",
      data: {
        rqm_requisition_id: requisition.rqm_requisition_id,
        rqm_requisition_no: requisition.rqm_requisition_no
      }
    };
  } catch (error) {
    console.error("Error creating requisition:", error);
    return {
      statusCode: 500,
      message: "Failed to create requisition",
      error: error.message
    };
  }
});

const index_post$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$i
});

const index_get$18 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      rqm_status: { contains: "PARTIAL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } }
      ];
    }
    const requisitions = await prisma$1.requisition_master.findMany({
      where: whereClause,
      include: {
        requisition_details: {
          select: {
            rqd_total_price_rm: true
          }
        }
      },
      orderBy: {
        rqm_requisition_id: "desc"
      }
    });
    const data = requisitions.map((req) => {
      const partialAmount = req.requisition_details.reduce((sum, detail) => {
        return sum + (detail.rqd_total_price_rm ? parseFloat(detail.rqd_total_price_rm.toString()) : 0);
      }, 0);
      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || "",
        rqm_requisition_title: req.rqm_requisition_title || "",
        rqm_amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
        partial_amount: partialAmount,
        oun_code: req.oun_code || "",
        urlEdit: `/purchasing/purchase-requisition/edit/${req.rqm_requisition_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Cancel partial PR list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching cancel partial PR list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch cancel partial PR list",
      error: error.message
    };
  }
});

const index_get$19 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$18
});

const index_get$16 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      rqm_status: { contains: "CANCEL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } }
      ];
    }
    const requisitions = await prisma$1.requisition_master.findMany({
      where: whereClause,
      orderBy: {
        rqm_requisition_id: "desc"
      }
    });
    const data = requisitions.map((req) => {
      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || "",
        rqm_requisition_title: req.rqm_requisition_title || "",
        rqm_amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
        oun_code: req.oun_code || "",
        fty_fund_type: req.fty_fund_type || "",
        ccr_costcentre: req.ccr_costcentre || "",
        urlEdit: `/purchasing/purchase-requisition/edit/${req.rqm_requisition_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Purchase requisition cancellations fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching purchase requisition cancellations:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase requisition cancellations",
      error: error.message
    };
  }
});

const index_get$17 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$16
});

const index_get$14 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      rqm_status: { not: "CANCEL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } },
        { rqm_request_by: { contains: searchTerm } }
      ];
    }
    const requisitions = await prisma$1.requisition_master.findMany({
      where: whereClause,
      orderBy: {
        rqm_requisition_id: "desc"
      }
    });
    const data = requisitions.map((req) => {
      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || "",
        rqm_request_by: req.rqm_request_by || "",
        fty_fund_type: req.fty_fund_type || "",
        ccr_costcentre: req.ccr_costcentre || "",
        at_activity_code: req.at_activity_code || "",
        rqm_requisition_title: req.rqm_requisition_title || "",
        urlEdit: `/purchasing/purchase-requisition/edit/${req.rqm_requisition_id}`
      };
    });
    return {
      statusCode: 200,
      message: "PR to be cancel partial list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching PR to be cancel partial list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PR to be cancel partial list",
      error: error.message
    };
  }
});

const index_get$15 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$14
});

const index_get$12 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      rqm_status: { not: "CANCEL" }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } },
        { rqm_request_by: { contains: searchTerm } }
      ];
    }
    const requisitions = await prisma$1.requisition_master.findMany({
      where: whereClause,
      orderBy: {
        rqm_requisition_id: "desc"
      }
    });
    const data = requisitions.map((req) => {
      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || "",
        rqm_request_by: req.rqm_request_by || "",
        fty_fund_type: req.fty_fund_type || "",
        ccr_costcentre: req.ccr_costcentre || "",
        at_activity_code: req.at_activity_code || "",
        rqm_requisition_title: req.rqm_requisition_title || "",
        urlEdit: `/purchasing/purchase-requisition/edit/${req.rqm_requisition_id}`
      };
    });
    return {
      statusCode: 200,
      message: "PR to be cancel list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching PR to be cancel list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PR to be cancel list",
      error: error.message
    };
  }
});

const index_get$13 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$12
});

const index_get$10 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {
      rqm_status: { not: null }
    };
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_requisition_title: { contains: searchTerm } },
        { rqm_status: { contains: searchTerm } },
        { rqm_agg_no: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.rqm_status = query.smartFilter_Status;
    }
    if (query.smartFilter_DateFrom) {
      const [day, month, year] = query.smartFilter_DateFrom.split("/");
      const startDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}`);
      whereClause.updateddate = {
        ...whereClause.updateddate || {},
        gte: startDate
      };
    }
    if (query.smartFilter_DateTo) {
      const [day, month, year] = query.smartFilter_DateTo.split("/");
      const endDate = /* @__PURE__ */ new Date(`${year}-${month}-${day} 23:59:59`);
      whereClause.updateddate = {
        ...whereClause.updateddate || {},
        lte: endDate
      };
    }
    if (query.smartFilter_RequisitionNo) {
      whereClause.rqm_requisition_no = { contains: query.smartFilter_RequisitionNo };
    }
    if (query.smartFilter_Title) {
      whereClause.rqm_requisition_title = { contains: query.smartFilter_Title };
    }
    if (query.smartFilter_AgreementNo) {
      whereClause.rqm_agg_no = { contains: query.smartFilter_AgreementNo };
    }
    const requisitions = await prisma$1.requisition_master.findMany({
      where: whereClause,
      orderBy: {
        updateddate: "desc"
      }
    });
    const data = requisitions.map((req) => {
      const createdDate = req.updateddate || req.createddate;
      const formattedDate = createdDate ? new Date(createdDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        rqm_requisition_id: req.rqm_requisition_id,
        rqm_requisition_no: req.rqm_requisition_no || "",
        rqm_requisition_title: req.rqm_requisition_title || "",
        rqm_amount: req.rqm_amount ? parseFloat(req.rqm_amount.toString()) : 0,
        rqm_agg_no: req.rqm_agg_no || "",
        rqm_status: req.rqm_status || "",
        updateddate: formattedDate,
        // urlEdit is kept for backward compatibility but not used for navigation
        urlEdit: `/purchasing/purchase-requisition/new`
      };
    });
    return {
      statusCode: 200,
      message: "Purchase requisitions fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching purchase requisitions:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch purchase requisitions",
      error: error.message
    };
  }
});

const index_get$11 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$10
});

const index_get$_ = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } }
      ];
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereClause,
      orderBy: {
        pom_order_id: "desc"
      }
    });
    const vendorCodes = [...new Set(purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const data = purchaseOrders.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || "",
        pom_description: po.pom_description || "",
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        vcs_vendor_code: po.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_order_status: po.pom_order_status || "",
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`
      };
    });
    return {
      statusCode: 200,
      message: "PO report listing (Bendahari) fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching PO report listing (Bendahari):", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO report listing (Bendahari)",
      error: error.message
    };
  }
});

const index_get$$ = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$_
});

const index_get$Y = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } }
      ];
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereClause,
      orderBy: {
        pom_order_id: "desc"
      }
    });
    const vendorCodes = [...new Set(purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const data = purchaseOrders.map((po) => {
      const vendor = vendorMap.get(po.vcs_vendor_code);
      return {
        pom_order_id: po.pom_order_id,
        pom_order_no: po.pom_order_no || "",
        pom_description: po.pom_description || "",
        pom_order_amt_rm: po.pom_order_amt_rm ? parseFloat(po.pom_order_amt_rm.toString()) : 0,
        vcs_vendor_code: po.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_order_status: po.pom_order_status || "",
        urlEdit: `/purchasing/purchase-order/edit/${po.pom_order_id}`
      };
    });
    return {
      statusCode: 200,
      message: "PO report listing (PTJ) fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching PO report listing (PTJ):", error);
    return {
      statusCode: 500,
      message: "Failed to fetch PO report listing (PTJ)",
      error: error.message
    };
  }
});

const index_get$Z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$Y
});

const index_get$W = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search;
    const updateddateFromRM = query.updateddateFromRM;
    const updateddateToRM = query.updateddateToRM;
    const updateddateFrom = query.updateddateFrom;
    const updateddateTo = query.updateddateTo;
    const vendorName = query.vendorName;
    const status = query.status;
    const oun_code = query.oun_code;
    let whereClause = {};
    if (oun_code) {
      whereClause.oun_code = oun_code;
    }
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } },
        { rqm_agg_no: { contains: searchTerm } }
      ];
    }
    let data = [];
    try {
      let podList = await prisma$1.purchase_order_details.findMany({
        where: whereClause,
        include: {
          purchase_order_master: {
            include: {
              vend_customer_supplier: {
                select: {
                  vcs_vendor_name: true,
                  vcs_bumi_status: true,
                  vcs_addr1: true,
                  vcs_addr2: true,
                  vcs_addr3: true
                }
              }
            }
          },
          requisition_master: {
            select: {
              rqm_requisition_no: true,
              rqm_requisition_title: true,
              rqm_status: true,
              rqm_tender_type: true,
              rqm_agg_no: true,
              updateddate: true
            }
          },
          item_main: {
            select: {
              itm_item_code: true,
              itm_item_desc: true
            }
          }
        },
        take: 1e3
      });
      if (vendorName || status) {
        podList = podList.filter((pod) => {
          var _a;
          const vendor = (_a = pod.purchase_order_master) == null ? void 0 : _a.vend_customer_supplier;
          if (!vendor)
            return false;
          if (vendorName && vendor.vcs_vendor_name !== vendorName)
            return false;
          if (status && vendor.vcs_bumi_status !== status)
            return false;
          return true;
        });
      }
      if (search) {
        const searchTerm = search.toLowerCase().trim();
        podList = podList.filter((pod) => {
          var _a, _b, _c, _d, _e;
          const searchableFields = [
            (_a = pod.purchase_order_master) == null ? void 0 : _a.pom_order_no,
            (_b = pod.purchase_order_master) == null ? void 0 : _b.pom_description,
            (_d = (_c = pod.purchase_order_master) == null ? void 0 : _c.vend_customer_supplier) == null ? void 0 : _d.vcs_vendor_name,
            (_e = pod.requisition_master) == null ? void 0 : _e.rqm_tender_type
          ].filter(Boolean).map((f) => f.toString().toLowerCase());
          return searchableFields.some((field) => field.includes(searchTerm));
        });
      }
      const vendorStatuses = [...new Set(podList.map((pod) => {
        var _a, _b;
        return (_b = (_a = pod.purchase_order_master) == null ? void 0 : _a.vend_customer_supplier) == null ? void 0 : _b.vcs_bumi_status;
      }).filter(Boolean))];
      const lookupDetails = vendorStatuses.length > 0 ? await prisma$1.lookup_details.findMany({
        where: {
          lma_code_name: "TARAF_VENDOR",
          lde_value: { in: vendorStatuses }
        },
        select: {
          lde_value: true,
          lde_description: true
        }
      }) : [];
      const statusMap = new Map(lookupDetails.map((ld) => [ld.lde_value, ld.lde_description]));
      const formatDate = (date) => {
        if (!date)
          return "";
        try {
          const d = new Date(date);
          return d.toLocaleDateString("en-GB");
        } catch {
          return "";
        }
      };
      data = podList.map((pod, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const vendor = (_a = pod.purchase_order_master) == null ? void 0 : _a.vend_customer_supplier;
        const vendorStatus = (vendor == null ? void 0 : vendor.vcs_bumi_status) || "";
        const statusDesc = statusMap.get(vendorStatus) || "";
        const address = [vendor == null ? void 0 : vendor.vcs_addr1, vendor == null ? void 0 : vendor.vcs_addr2, vendor == null ? void 0 : vendor.vcs_addr3].filter(Boolean).join(",");
        const item = pod.item_main ? `${pod.item_main.itm_item_code}-${pod.item_main.itm_item_desc}` : "";
        return {
          no: index + 1,
          "Item Kontrak": item,
          "No.Rujukan PRE": pod.rqm_requisition_no || "",
          "Tarikh Kelulusan PRE": formatDate((_b = pod.requisition_master) == null ? void 0 : _b.updateddate),
          "Perkara PRE": ((_c = pod.requisition_master) == null ? void 0 : _c.rqm_requisition_title) || "",
          "Status Pembekal": statusDesc,
          "Jenis Pembelian": ((_d = pod.requisition_master) == null ? void 0 : _d.rqm_tender_type) || "",
          "No. Perjanjian": ((_e = pod.requisition_master) == null ? void 0 : _e.rqm_agg_no) || "",
          "Status PRE": ((_f = pod.requisition_master) == null ? void 0 : _f.rqm_status) || "",
          "No.Rujukan POR": ((_g = pod.purchase_order_master) == null ? void 0 : _g.pom_order_no) || "",
          "Tarikh Kelulusan POR": formatDate(pod.updateddate || pod.createddate),
          "Perkara POR": ((_h = pod.purchase_order_master) == null ? void 0 : _h.pom_description) || "",
          "Amaun POR (RM)": pod.pod_total_amt ? parseFloat(pod.pod_total_amt.toString()) : 0,
          "Status POR": ((_i = pod.purchase_order_master) == null ? void 0 : _i.pom_order_status) || "",
          "Nama Pembekal": (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
          "Alamat Pembekal": address,
          "Amaun PRE (RM)": ((_j = pod.purchase_order_master) == null ? void 0 : _j.pom_order_amt) ? parseFloat(pod.purchase_order_master.pom_order_amt.toString()) : 0,
          PTJ: pod.oun_code || ""
        };
      });
    } catch (tableError) {
      console.log("Error fetching data:", tableError.message);
      return {
        statusCode: 200,
        message: "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel data fetched successfully",
        data: [],
        recordsFiltered: 0,
        footer: {
          pom_order_amt: 0,
          pod_total_amt: 0
        }
      };
    }
    const footer = {
      pom_order_amt: data.reduce((sum, item) => {
        var _a;
        return sum + parseFloat(((_a = item["Amaun PRE (RM)"]) == null ? void 0 : _a.toString()) || "0");
      }, 0),
      pod_total_amt: data.reduce((sum, item) => {
        var _a;
        return sum + parseFloat(((_a = item["Amaun POR (RM)"]) == null ? void 0 : _a.toString()) || "0");
      }, 0)
    };
    return {
      statusCode: 200,
      message: "Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel data fetched successfully",
      data,
      recordsFiltered: data.length,
      footer
    };
  } catch (error) {
    console.error("Error fetching Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Perolehan Melalui Kontrak Pusat & Kontrak Pusat Sistem Panel data",
      error: error.message
    };
  }
});

const index_get$X = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$W
});

const index_get$U = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search;
    const updateddateFromRM = query.updateddateFromRM;
    const updateddateToRM = query.updateddateToRM;
    const updateddateFrom = query.updateddateFrom;
    const updateddateTo = query.updateddateTo;
    const acm_acct_desc = query.acm_acct_desc;
    const rqm_requisition_no = query.rqm_requisition_no;
    const pom_order_no = query.pom_order_no;
    const status = query.status;
    let whereClause = {};
    if (updateddateFromRM || updateddateToRM) {
    }
    if (updateddateFrom || updateddateTo) {
    }
    if (acm_acct_desc) {
      whereClause.am_account_code = acm_acct_desc;
    }
    if (rqm_requisition_no) {
      whereClause.rqm_requisition_no = rqm_requisition_no;
    }
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { am_account_code: { contains: searchTerm } },
        { rqm_requisition_no: { contains: searchTerm } }
      ];
    }
    let data = [];
    try {
      const podList = await prisma$1.purchase_order_details.findMany({
        where: whereClause,
        include: {
          purchase_order_master: {
            include: {
              vend_customer_supplier: {
                select: {
                  vcs_bumi_status: true
                }
              }
            }
          },
          requisition_master: {
            select: {
              rqm_requisition_no: true,
              rqm_requisition_title: true,
              rqm_status: true,
              updateddate: true
            }
          },
          account_main: {
            select: {
              acm_acct_code: true,
              acm_acct_parent: true
            }
          }
        },
        take: 1e3
      });
      const accountParents = [...new Set(podList.map((pod) => {
        var _a;
        return (_a = pod.account_main) == null ? void 0 : _a.acm_acct_parent;
      }).filter(Boolean))];
      const accountMainList = accountParents.length > 0 ? await prisma$1.account_main.findMany({
        where: { acm_acct_code: { in: accountParents } },
        select: {
          acm_acct_code: true,
          acm_acct_desc: true
        }
      }) : [];
      const accountMap = new Map(accountMainList.map((am) => [am.acm_acct_code, am]));
      const vendorStatuses = [...new Set(podList.map((pod) => {
        var _a, _b;
        return (_b = (_a = pod.purchase_order_master) == null ? void 0 : _a.vend_customer_supplier) == null ? void 0 : _b.vcs_bumi_status;
      }).filter(Boolean))];
      const lookupDetails = vendorStatuses.length > 0 ? await prisma$1.lookup_details.findMany({
        where: {
          lma_code_name: "TARAF_VENDOR",
          lde_value: { in: vendorStatuses }
        },
        select: {
          lde_value: true,
          lde_description: true
        }
      }) : [];
      const statusMap = new Map(lookupDetails.map((ld) => [ld.lde_value, ld.lde_description]));
      let groupedData = /* @__PURE__ */ new Map();
      podList.forEach((pod) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        const accountParent = ((_a = pod.account_main) == null ? void 0 : _a.acm_acct_parent) || "";
        const accountDesc = ((_b = accountMap.get(accountParent)) == null ? void 0 : _b.acm_acct_desc) || "";
        const vendorStatus = ((_d = (_c = pod.purchase_order_master) == null ? void 0 : _c.vend_customer_supplier) == null ? void 0 : _d.vcs_bumi_status) || "";
        const statusDesc = statusMap.get(vendorStatus) || "";
        const pomStatus = ((_e = pod.purchase_order_master) == null ? void 0 : _e.pom_order_status) || "";
        const rqmStatus = ((_f = pod.requisition_master) == null ? void 0 : _f.rqm_status) || "";
        const rqdId = pod.rqd_requisition_id || "";
        const key = `${accountParent}_${statusDesc}_${pomStatus}_${rqmStatus}_${rqdId}`;
        if (!groupedData.has(key)) {
          groupedData.set(key, {
            rqd_requisition_id: rqdId,
            acm_acct_parent: accountParent,
            acm_desc: accountDesc,
            vcs_bumi_status: statusDesc,
            pom_order_status: pomStatus,
            rqm_status: rqmStatus,
            rqm_requisition_no: [],
            pom_order_no: [],
            pod_total_amt: 0,
            pom_order_id: 0,
            pom_order_amt: 0,
            billPR: 0
          });
        }
        const group = groupedData.get(key);
        if (pod.rqm_requisition_no && !group.rqm_requisition_no.includes(pod.rqm_requisition_no)) {
          group.rqm_requisition_no.push(pod.rqm_requisition_no);
        }
        if (((_g = pod.purchase_order_master) == null ? void 0 : _g.pom_order_no) && !group.pom_order_no.includes(pod.purchase_order_master.pom_order_no)) {
          group.pom_order_no.push(pod.purchase_order_master.pom_order_no);
        }
        group.pod_total_amt += parseFloat(((_h = pod.pod_total_amt) == null ? void 0 : _h.toString()) || "0");
        group.pom_order_amt += parseFloat(((_j = (_i = pod.purchase_order_master) == null ? void 0 : _i.pom_order_amt) == null ? void 0 : _j.toString()) || "0");
        group.pom_order_id += 1;
        if (pod.rqm_requisition_no) {
          group.billPR += 1;
        }
      });
      if (pom_order_no) {
        const filteredGrouped = /* @__PURE__ */ new Map();
        groupedData.forEach((item, key) => {
          if (item.pom_order_no.includes(pom_order_no)) {
            filteredGrouped.set(key, item);
          }
        });
        groupedData = filteredGrouped;
      }
      data = Array.from(groupedData.values()).map((item, index) => ({
        no: index + 1,
        rqd_requisition_id: item.rqd_requisition_id,
        "Kod Akaun": item.acm_acct_parent,
        "Jenis Perbelanjaan": item.acm_desc,
        "No PRE": item.rqm_requisition_no.join(","),
        "Bill PRE": item.billPR,
        "Amaun  PRE (RM)": item.pom_order_amt,
        "Status PRE": item.rqm_status,
        "No POR": item.pom_order_no.join(","),
        "Bill POR": item.pom_order_id,
        "Amaun POR (RM)": item.pod_total_amt,
        "Status POR": item.pom_order_status,
        "Status Pembekal": item.vcs_bumi_status
      }));
    } catch (tableError) {
      console.log("Error fetching data:", tableError.message);
      return {
        statusCode: 200,
        message: "Laporan Keseluruhan Perolehan data fetched successfully",
        data: [],
        recordsFiltered: 0,
        footer: {
          pod_total_amt: 0,
          pom_order_id: 0,
          rqm_requisition_no: 0,
          pom_order_amt: 0
        }
      };
    }
    const footer = {
      pod_total_amt: data.reduce((sum, item) => {
        var _a;
        return sum + parseFloat(((_a = item["Amaun POR (RM)"]) == null ? void 0 : _a.toString()) || "0");
      }, 0),
      pom_order_id: data.reduce((sum, item) => {
        var _a;
        return sum + parseInt(((_a = item["Bill POR"]) == null ? void 0 : _a.toString()) || "0");
      }, 0),
      rqm_requisition_no: data.reduce((sum, item) => {
        var _a;
        return sum + parseInt(((_a = item["Bill PRE"]) == null ? void 0 : _a.toString()) || "0");
      }, 0),
      pom_order_amt: data.reduce((sum, item) => {
        var _a;
        return sum + parseFloat(((_a = item["Amaun  PRE (RM)"]) == null ? void 0 : _a.toString()) || "0");
      }, 0)
    };
    return {
      statusCode: 200,
      message: "Laporan Keseluruhan Perolehan data fetched successfully",
      data,
      recordsFiltered: data.length,
      footer
    };
  } catch (error) {
    console.error("Error fetching Laporan Keseluruhan Perolehan:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Laporan Keseluruhan Perolehan data",
      error: error.message
    };
  }
});

const index_get$V = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$U
});

const index_get$S = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search;
    const updateddateFromRM = query.updateddateFromRM;
    const updateddateToRM = query.updateddateToRM;
    const updateddateFrom = query.updateddateFrom;
    const updateddateTo = query.updateddateTo;
    const vendorName = query.vendorName;
    const status = query.status;
    const oun_code = query.oun_code;
    let whereClause = {};
    if (oun_code) {
      whereClause.oun_code = oun_code;
    }
    const pomFilter = {};
    if (vendorName || status) {
      const vendorFilter = {};
      if (vendorName) {
        vendorFilter.vcs_vendor_name = vendorName;
      }
      if (status) {
        vendorFilter.vcs_bumi_status = status;
      }
      if (Object.keys(vendorFilter).length > 0) {
        pomFilter.vend_customer_supplier = vendorFilter;
      }
    }
    if (search) {
      const searchTerm = search.trim();
      whereClause.OR = [
        { rqm_requisition_no: { contains: searchTerm } }
      ];
    }
    let data = [];
    try {
      let podList = await prisma$1.purchase_order_details.findMany({
        where: whereClause,
        include: {
          purchase_order_master: {
            include: {
              vend_customer_supplier: {
                select: {
                  vcs_vendor_name: true,
                  vcs_bumi_status: true,
                  vcs_addr1: true,
                  vcs_addr2: true,
                  vcs_addr3: true
                }
              }
            }
          },
          requisition_master: {
            select: {
              rqm_requisition_no: true,
              rqm_requisition_title: true,
              rqm_status: true,
              updateddate: true
            }
          }
        },
        take: 1e3
      });
      if (vendorName || status) {
        podList = podList.filter((pod) => {
          var _a;
          const vendor = (_a = pod.purchase_order_master) == null ? void 0 : _a.vend_customer_supplier;
          if (!vendor)
            return false;
          if (vendorName && vendor.vcs_vendor_name !== vendorName)
            return false;
          if (status && vendor.vcs_bumi_status !== status)
            return false;
          return true;
        });
      }
      const vendorStatuses = [...new Set(podList.map((pod) => {
        var _a, _b;
        return (_b = (_a = pod.purchase_order_master) == null ? void 0 : _a.vend_customer_supplier) == null ? void 0 : _b.vcs_bumi_status;
      }).filter(Boolean))];
      const lookupDetails = vendorStatuses.length > 0 ? await prisma$1.lookup_details.findMany({
        where: {
          lma_code_name: "TARAF_VENDOR",
          lde_value: { in: vendorStatuses }
        },
        select: {
          lde_value: true,
          lde_description: true
        }
      }) : [];
      const statusMap = new Map(lookupDetails.map((ld) => [ld.lde_value, ld.lde_description]));
      const formatDate = (date) => {
        if (!date)
          return "";
        try {
          const d = new Date(date);
          return d.toLocaleDateString("en-GB");
        } catch {
          return "";
        }
      };
      data = podList.map((pod, index) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const vendor = (_a = pod.purchase_order_master) == null ? void 0 : _a.vend_customer_supplier;
        const vendorStatus = (vendor == null ? void 0 : vendor.vcs_bumi_status) || "";
        const statusDesc = statusMap.get(vendorStatus) || "";
        const address = [vendor == null ? void 0 : vendor.vcs_addr1, vendor == null ? void 0 : vendor.vcs_addr2, vendor == null ? void 0 : vendor.vcs_addr3].filter(Boolean).join(",");
        return {
          no: index + 1,
          "No.Rujukan PRE": pod.rqm_requisition_no || "",
          "Tarikh Kelulusan PRE": formatDate((_b = pod.requisition_master) == null ? void 0 : _b.updateddate),
          "Perkara PRE": ((_c = pod.requisition_master) == null ? void 0 : _c.rqm_requisition_title) || "",
          "Amaun PRE (RM)": ((_d = pod.purchase_order_master) == null ? void 0 : _d.pom_order_amt) ? parseFloat(pod.purchase_order_master.pom_order_amt.toString()) : 0,
          "Status PRE": ((_e = pod.requisition_master) == null ? void 0 : _e.rqm_status) || "",
          "No.Rujukan POR": ((_f = pod.purchase_order_master) == null ? void 0 : _f.pom_order_no) || "",
          "Tarikh Kelulusan POR": formatDate(pod.updateddate || pod.createddate),
          "Perkara POR": ((_g = pod.purchase_order_master) == null ? void 0 : _g.pom_description) || "",
          "Amaun POR (RM)": pod.pod_total_amt ? parseFloat(pod.pod_total_amt.toString()) : 0,
          "Status POR": ((_h = pod.purchase_order_master) == null ? void 0 : _h.pom_order_status) || "",
          "Nama Pembekal": (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
          "Alamat Pembekal": address,
          "Status Pembekal": statusDesc,
          OU: pod.oun_code || ""
        };
      });
    } catch (tableError) {
      console.log("Error fetching data:", tableError.message);
      return {
        statusCode: 200,
        message: "Senarai Tempoh Masa LPO data fetched successfully",
        data: [],
        recordsFiltered: 0,
        footer: {
          pom_order_amt: 0,
          pod_total_amt: 0
        }
      };
    }
    const footer = {
      pom_order_amt: data.reduce((sum, item) => {
        var _a;
        return sum + parseFloat(((_a = item["Amaun PRE (RM)"]) == null ? void 0 : _a.toString()) || "0");
      }, 0),
      pod_total_amt: data.reduce((sum, item) => {
        var _a;
        return sum + parseFloat(((_a = item["Amaun POR (RM)"]) == null ? void 0 : _a.toString()) || "0");
      }, 0)
    };
    return {
      statusCode: 200,
      message: "Senarai Tempoh Masa LPO data fetched successfully",
      data,
      recordsFiltered: data.length,
      footer
    };
  } catch (error) {
    console.error("Error fetching Senarai Tempoh Masa LPO:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch Senarai Tempoh Masa LPO data",
      error: error.message
    };
  }
});

const index_get$T = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$S
});

const index_get$Q = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { grm_receive_no: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { vcs_vendor_name: { contains: searchTerm } }
      ];
    }
    const grns = await prisma$1.goods_receive_master.findMany({
      where: whereClause,
      include: {
        purchase_order_master: {
          select: {
            pom_order_no: true,
            pom_order_ref: true
          }
        },
        vend_customer_supplier: {
          select: {
            vcs_vendor_code: true,
            vcs_vendor_name: true
          }
        },
        vendor_assessment_master: {
          select: {
            vam_assessment_date: true
          }
        }
      },
      orderBy: {
        grm_receive_id: "desc"
      }
    });
    const data = grns.map((grn) => {
      var _a, _b, _c, _d, _e, _f;
      const assessmentDate = ((_a = grn.vendor_assessment_master) == null ? void 0 : _a.vam_assessment_date) ? new Date(grn.vendor_assessment_master.vam_assessment_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }) : "";
      return {
        grm_receive_id: grn.grm_receive_id,
        pre_no: ((_b = grn.pom_order_master) == null ? void 0 : _b.pom_order_ref) || "",
        por_no: ((_c = grn.pom_order_master) == null ? void 0 : _c.pom_order_no) || "",
        grn_bil_no: grn.grm_receive_no || "",
        ptj: ((_d = grn.pom_order_master) == null ? void 0 : _d.pom_order_ref) || "",
        tarikh_penilaian: assessmentDate,
        nama_pembekal: ((_e = grn.vend_customer_supplier) == null ? void 0 : _e.vcs_vendor_name) || "",
        kod_pembekal: ((_f = grn.vend_customer_supplier) == null ? void 0 : _f.vcs_vendor_code) || "",
        urlEdit: `/purchasing/report/vendor-assessment-grn/view/${grn.grm_receive_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Vendor assessment (GRN) list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching vendor assessment (GRN) list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch vendor assessment (GRN) list",
      error: error.message
    };
  }
});

const index_get$R = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$Q
});

const index_get$O = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {};
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ vas_assessment_item_no: searchNum }],
        { vas_assessment_item_code: { contains: searchTerm } },
        { vas_assessment_item_desc: { contains: searchTerm } },
        { vas_yn_flag: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status && query.smartFilter_Status.trim() !== "") {
      where.vas_yn_flag = query.smartFilter_Status.trim();
    }
    const assessmentQuestions = await prisma$1.vendor_assessment_setup.findMany({
      where: Object.keys(where).length > 0 ? where : {},
      select: {
        vas_assessment_item_no: true,
        vas_assessment_item_code: true,
        vas_assessment_item_desc: true,
        vas_yn_flag: true
      },
      orderBy: {
        vas_assessment_item_no: "asc"
      }
    });
    const formattedData = assessmentQuestions.map((item) => ({
      id: item.vas_assessment_item_no,
      code: item.vas_assessment_item_code || "",
      description: item.vas_assessment_item_desc || "",
      status: item.vas_yn_flag || "",
      // Keep original fields for reference
      vas_assessment_item_no: item.vas_assessment_item_no,
      vas_assessment_item_code: item.vas_assessment_item_code,
      vas_assessment_item_desc: item.vas_assessment_item_desc,
      vas_yn_flag: item.vas_yn_flag
    }));
    return {
      statusCode: 200,
      message: "Assessment questions fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching assessment questions:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch assessment questions",
      error: error.message
    };
  }
});

const index_get$P = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$O
});

const index_get$M = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { itm_item_code: { contains: searchTerm } },
        { itm_item_desc: { contains: searchTerm } },
        { acm_acct_code: { contains: searchTerm } },
        { itm_category_code: { contains: searchTerm } }
      ];
    }
    const items = await prisma$1.item_main.findMany({
      where: whereClause,
      include: {
        account_main: {
          select: {
            acm_acct_code: true,
            acm_acct_desc: true
          }
        }
      },
      orderBy: {
        itm_item_id: "desc"
      }
    });
    const data = items.map((item) => {
      return {
        itm_item_id: item.itm_item_id,
        ItemCode: item.itm_item_code || "",
        ItemDescription: item.itm_item_desc || "",
        AccountCode: item.acm_acct_code || "",
        CategoryCode: item.itm_category_code || "",
        Description: item.itm_item_desc || "",
        SubcategoryCode: item.isc_subcategory_code || "",
        SubsiriCode: item.iss_subsiri_code || "",
        Category: item.itm_category_code || "",
        Level: item.itm_level ? item.itm_level.toString() : "",
        urlEdit: `/purchasing/setup/item-main/edit/${item.itm_item_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Item main listing fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching item main listing:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item main listing",
      error: error.message
    };
  }
});

const index_get$N = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$M
});

const groupLookup_get = defineEventHandler(async (event) => {
  try {
    const groups = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "ITEM_CATEGORY"
      },
      select: {
        lde_group: true
      },
      distinct: ["lde_group"],
      orderBy: {
        lde_group: "asc"
      }
    });
    const options = groups.filter((item) => item.lde_group).map((item) => ({
      label: item.lde_group,
      value: item.lde_group
    }));
    return {
      statusCode: 200,
      message: "Group lookup options fetched successfully",
      data: options
    };
  } catch (error) {
    console.error("Error fetching group lookup options:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch group lookup options",
      error: error.message
    };
  }
});

const groupLookup_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: groupLookup_get
});

const index_get$K = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { im_item_main_code: { contains: searchTerm } },
        { im_item_main_desc: { contains: searchTerm } }
      ];
    }
    const itemMains = await prisma$1.item_main.findMany({
      where: whereClause,
      orderBy: {
        im_item_main_id: "desc"
      }
    });
    const data = itemMains.map((item) => {
      return {
        im_item_main_id: item.im_item_main_id,
        im_item_main_code: item.im_item_main_code || "",
        im_item_main_desc: item.im_item_main_desc || "",
        im_status: item.im_status ? "ACTIVE" : "INACTIVE",
        urlEdit: `/purchasing/setup/item-main/edit/${item.im_item_main_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Item main list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching item main list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item main list",
      error: error.message
    };
  }
});

const index_get$L = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$K
});

const itemMainList_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    if (!query.itm_category_code || !query.isc_subcategory_code || !query.iss_subsiri_code) {
      return {
        statusCode: 400,
        message: "itm_category_code, isc_subcategory_code, and iss_subsiri_code are required",
        data: []
      };
    }
    const where = {
      itm_category_code: query.itm_category_code,
      isc_subcategory_code: query.isc_subcategory_code,
      iss_subsiri_code: query.iss_subsiri_code
    };
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ itm_item_id: searchNum }],
        { itm_item_code: { contains: searchTerm } },
        { itm_item_desc: { contains: searchTerm } },
        { acm_acct_code: { contains: searchTerm } },
        { itm_status: { contains: searchTerm } }
      ];
    }
    const itemMains = await prisma$1.item_main.findMany({
      where,
      include: {
        account_main: {
          select: {
            acm_acct_code: true,
            acm_acct_desc: true
          }
        }
      },
      orderBy: {
        itm_item_code: "asc"
      }
    });
    const formattedData = itemMains.map((item) => ({
      itm_item_id: item.itm_item_id,
      itm_item_code: item.itm_item_code || "",
      itm_item_desc: item.itm_item_desc || "",
      itm_category_code: item.itm_category_code || "",
      isc_subcategory_code: item.isc_subcategory_code || "",
      iss_subsiri_code: item.iss_subsiri_code || "",
      acm_acct_code: item.account_main ? `${item.acm_acct_code || ""} - ${item.account_main.acm_acct_desc || ""}` : item.acm_acct_code || "",
      itm_myfislite_flag: item.itm_myfislite_flag === "Y" ? "YES" : "NO",
      itm_status: item.itm_status === "1" ? "ACTIVE" : "INACTIVE"
    }));
    return {
      statusCode: 200,
      message: "Item mains fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching item mains:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item mains",
      error: error.message
    };
  }
});

const itemMainList_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: itemMainList_get
});

const mainCategory_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {
      lma_code_name: "ITEM_CATEGORY",
      lde_group: query.grouplookup || "PO"
      // Default to 'PO' if not provided
    };
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ lde_id: searchNum }],
        { lde_value: { contains: searchTerm } },
        { lde_description: { contains: searchTerm } },
        { lde_status: { contains: searchTerm } }
      ];
    }
    const mainCategories = await prisma$1.lookup_details.findMany({
      where,
      select: {
        lde_id: true,
        lde_value: true,
        lde_description: true,
        lde_status: true
      },
      orderBy: {
        lde_value: "asc"
      }
    });
    const formattedData = mainCategories.map((item) => ({
      lde_id: item.lde_id,
      lde_value: item.lde_value || "",
      lde_description: item.lde_description || "",
      lde_status: item.lde_status === "1" ? "ACTIVE" : "INACTIVE"
    }));
    return {
      statusCode: 200,
      message: "Main categories fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching main categories:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch main categories",
      error: error.message
    };
  }
});

const mainCategory_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: mainCategory_get
});

const subcategory_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    if (!query.isc_category_code) {
      return {
        statusCode: 400,
        message: "isc_category_code is required",
        data: []
      };
    }
    const where = {
      isc_category_code: query.isc_category_code
    };
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ isc_subcategory_id: searchNum }],
        { isc_subcategory_code: { contains: searchTerm } },
        { isc_subcategory_desc: { contains: searchTerm } },
        { isc_status: { contains: searchTerm } }
      ];
    }
    const subcategories = await prisma$1.item_subcategory.findMany({
      where,
      select: {
        isc_subcategory_id: true,
        isc_subcategory_code: true,
        isc_subcategory_desc: true,
        isc_category_code: true,
        isc_status: true
      },
      orderBy: {
        isc_subcategory_code: "asc"
      }
    });
    const formattedData = subcategories.map((item) => ({
      isc_subcategory_id: item.isc_subcategory_id,
      isc_subcategory_code: item.isc_subcategory_code || "",
      isc_subcategory_desc: item.isc_subcategory_desc || "",
      isc_category_code: item.isc_category_code || "",
      isc_status: item.isc_status === "1" ? "ACTIVE" : "INACTIVE"
    }));
    return {
      statusCode: 200,
      message: "Item subcategories fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching item subcategories:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item subcategories",
      error: error.message
    };
  }
});

const subcategory_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: subcategory_get
});

const subsiri_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    if (!query.iss_category_code || !query.isc_subcategory_code) {
      return {
        statusCode: 400,
        message: "iss_category_code and isc_subcategory_code are required",
        data: []
      };
    }
    const where = {
      iss_category_code: query.iss_category_code,
      isc_subcategory_code: query.isc_subcategory_code
    };
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      const searchNum = parseInt(searchTerm);
      where.OR = [
        ...isNaN(searchNum) ? [] : [{ iss_subsiri_id: searchNum }],
        { iss_subsiri_code: { contains: searchTerm } },
        { iss_subsiri_desc: { contains: searchTerm } },
        { iss_status: { contains: searchTerm } }
      ];
    }
    const subsiris = await prisma$1.item_subsiri.findMany({
      where,
      select: {
        iss_subsiri_id: true,
        iss_subsiri_code: true,
        iss_subsiri_desc: true,
        isc_subcategory_code: true,
        iss_category_code: true,
        iss_status: true
      },
      orderBy: {
        iss_subsiri_code: "asc"
      }
    });
    const formattedData = subsiris.map((item) => ({
      iss_subsiri_id: item.iss_subsiri_id,
      iss_subsiri_code: item.iss_subsiri_code || "",
      iss_subsiri_desc: item.iss_subsiri_desc || "",
      isc_subcategory_code: item.isc_subcategory_code || "",
      iss_category_code: item.iss_category_code || "",
      iss_status: item.iss_status === "1" ? "ACTIVE" : "INACTIVE"
    }));
    return {
      statusCode: 200,
      message: "Item subsiris fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching item subsiris:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch item subsiris",
      error: error.message
    };
  }
});

const subsiri_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: subsiri_get
});

const index_get$I = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { jbs_jobscope_code: { contains: searchTerm } },
        { jbs_job_name: { contains: searchTerm } },
        { jbs_job_type: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.jbs_status = query.smartFilter_Status;
    }
    const jobscopes = await prisma$1.jobscope.findMany({
      where: whereClause,
      orderBy: {
        jbs_id: "desc"
      }
    });
    const categoryCodes = [...new Set(jobscopes.map((j) => j.jbc_category).filter(Boolean))];
    const categories = categoryCodes.length > 0 ? await prisma$1.jobscope_category.findMany({
      where: { jbc_category: { in: categoryCodes } },
      select: { jbc_category: true, jbc_desc: true }
    }) : [];
    const categoryMap = new Map(categories.map((c) => [c.jbc_category, c.jbc_desc]));
    const data = jobscopes.map((job) => {
      const categoryDesc = job.jbc_category ? categoryMap.get(job.jbc_category) : null;
      const categoryDisplay = categoryDesc ? `${job.jbc_category} - ${categoryDesc}` : job.jbc_category || "";
      return {
        jbs_id: job.jbs_id,
        Code: job.jbs_jobscope_code || "",
        Name: job.jbs_job_name || "",
        Level: job.jbs_level ? job.jbs_level.toString() : "",
        Type: job.jbs_job_type || "",
        Category: categoryDisplay,
        Parent: job.jbs_job_code_parent || "",
        Status: job.jbs_status || "",
        urlEdit: `/purchasing/setup/jobscope/edit/${job.jbs_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Jobscope list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching jobscope list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch jobscope list",
      error: error.message
    };
  }
});

const index_get$J = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$I
});

const index_get$G = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let dateFilter = {};
    if (query.date_start && query.date_end) {
      const [day, month, year] = query.date_start.split("/");
      const startDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}`);
      const [day2, month2, year2] = query.date_end.split("/");
      const endDate = /* @__PURE__ */ new Date(`${year2}-${month2}-${day2}`);
      dateFilter = {
        pom_request_date: {
          gte: startDate,
          lte: endDate
        }
      };
    } else if (query.date_start) {
      const [day, month, year] = query.date_start.split("/");
      const startDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}`);
      dateFilter = {
        pom_request_date: {
          gte: startDate
        }
      };
    } else if (query.date_end) {
      const [day, month, year] = query.date_end.split("/");
      const endDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}`);
      dateFilter = {
        pom_request_date: {
          lte: endDate
        }
      };
    }
    let whereMaster = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereMaster.OR = [
        { pom_order_no: { contains: searchTerm } },
        { pom_description: { contains: searchTerm } },
        { pom_order_status: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_pom_order_no) {
      whereMaster.pom_order_no = { contains: query.smartFilter_pom_order_no };
    }
    if (query.smartFilter_vcs_vendor_code) {
      whereMaster.vcs_vendor_code = { contains: query.smartFilter_vcs_vendor_code };
    }
    if (query.smartFilter_pom_order_status) {
      whereMaster.pom_order_status = query.smartFilter_pom_order_status;
    }
    if (Object.keys(dateFilter).length > 0) {
      whereMaster = { ...whereMaster, ...dateFilter };
    }
    const purchaseOrders = await prisma$1.purchase_order_master.findMany({
      where: whereMaster,
      include: {
        purchase_order_details: true
      },
      orderBy: {
        pom_order_id: "asc"
      }
    });
    const requisitionNos = purchaseOrders.flatMap(
      (po) => po.purchase_order_details.map((pod) => pod.rqm_requisition_no).filter(Boolean)
    );
    const requisitions = requisitionNos.length > 0 ? await prisma$1.requisition_master.findMany({
      where: {
        rqm_requisition_no: { in: requisitionNos }
      },
      select: {
        rqm_requisition_id: true,
        rqm_requisition_no: true
      }
    }) : [];
    const requisitionMap = {};
    requisitions.forEach((req) => {
      requisitionMap[req.rqm_requisition_no] = req;
    });
    const vendorCodes = purchaseOrders.map((po) => po.vcs_vendor_code).filter(Boolean);
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes }
      },
      select: {
        vcs_vendor_code: true,
        vcs_vendor_name: true
      }
    }) : [];
    const vendorMap = {};
    vendors.forEach((vendor) => {
      vendorMap[vendor.vcs_vendor_code] = vendor;
    });
    const poNumbers = purchaseOrders.map((po) => po.pom_order_no).filter(Boolean);
    const prNumbers = purchaseOrders.flatMap(
      (po) => po.purchase_order_details.map((pod) => pod.rqm_requisition_no).filter(Boolean)
    );
    const bills = await prisma$1.bills_master.findMany({
      where: {
        OR: [
          { pom_order_no: { in: poNumbers } },
          { rqm_requisition_no: { in: prNumbers } }
        ]
      },
      select: {
        bim_bills_no: true,
        pom_order_no: true,
        rqm_requisition_no: true
      }
    });
    const billsMap = {};
    bills.forEach((bill) => {
      if (bill.pom_order_no) {
        if (!billsMap[bill.pom_order_no]) {
          billsMap[bill.pom_order_no] = [];
        }
        billsMap[bill.pom_order_no].push(bill.bim_bills_no);
      }
      if (bill.rqm_requisition_no) {
        if (!billsMap[bill.rqm_requisition_no]) {
          billsMap[bill.rqm_requisition_no] = [];
        }
        billsMap[bill.rqm_requisition_no].push(bill.bim_bills_no);
      }
    });
    let filteredOrders = purchaseOrders;
    if (query.smartFilter_rqm_requisition_no) {
      filteredOrders = purchaseOrders.filter(
        (po) => po.purchase_order_details.some(
          (pod) => {
            var _a;
            return (_a = pod.rqm_requisition_no) == null ? void 0 : _a.includes(query.smartFilter_rqm_requisition_no);
          }
        )
      );
    }
    const data = [];
    filteredOrders.forEach((po) => {
      po.purchase_order_details.forEach((pod) => {
        let billsNo = "";
        const poBills = billsMap[po.pom_order_no] || [];
        const prBills = billsMap[pod.rqm_requisition_no] || [];
        billsNo = poBills[0] || prBills[0] || "";
        const requestDate = po.pom_request_date ? new Date(po.pom_request_date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";
        const requisition = requisitionMap[pod.rqm_requisition_no] || null;
        const vendor = vendorMap[po.vcs_vendor_code] || null;
        data.push({
          no: data.length + 1,
          pom_order_id: po.pom_order_id,
          rqm_requisition_id: (requisition == null ? void 0 : requisition.rqm_requisition_id) || null,
          "PO No": po.pom_order_no || "",
          "PR": pod.rqm_requisition_no || "",
          "Description": po.pom_description || "",
          "Request Date": requestDate,
          "Item Code": pod.itm_item_code || "",
          "Item Desc": pod.pod_item_spec || "",
          "PO Status": po.pom_order_status || "",
          "Vendor ID": po.vcs_vendor_code || "",
          "Vendor Name": (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
          "Bill No": billsNo,
          "Action": "",
          // Keep original data for actions
          urlViewPO: `/purchasing/view-po/${po.pom_order_id}`,
          urlViewPR: (requisition == null ? void 0 : requisition.rqm_requisition_id) ? `/purchasing/view-pr/${requisition.rqm_requisition_id}` : ""
        });
      });
    });
    return {
      statusCode: 200,
      message: "Status PO & PR fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error in status-po-pr API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      data: [],
      error: error.stack 
    };
  }
});

const index_get$H = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$G
});

const poStatusOptions_get = defineEventHandler(async (event) => {
  try {
    const statuses = await prisma$1.purchase_order_master.findMany({
      select: {
        pom_order_status: true
      },
      distinct: ["pom_order_status"],
      where: {
        pom_order_status: { not: null }
      },
      orderBy: {
        pom_order_status: "asc"
      }
    });
    const options = statuses.map((status) => ({
      label: status.pom_order_status,
      value: status.pom_order_status
    }));
    return {
      statusCode: 200,
      message: "PO status options fetched successfully",
      data: options
    };
  } catch (error) {
    console.error("Error in po-status-options API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      data: [],
      error: error.stack 
    };
  }
});

const poStatusOptions_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: poStatusOptions_get
});

const index_get$E = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Advertisement list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching advertisement list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch advertisement list",
      error: error.message
    };
  }
});

const index_get$F = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$E
});

const index_get$C = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Quotation/DP to be cancel list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching quotation/DP to be cancel list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch quotation/DP to be cancel list",
      error: error.message
    };
  }
});

const index_get$D = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$C
});

const index_get$A = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Tender/quotation list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching tender/quotation list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch tender/quotation list",
      error: error.message
    };
  }
});

const index_get$B = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$A
});

const index_get$y = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Tender/quotation for evaluation list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching tender/quotation for evaluation list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch tender/quotation for evaluation list",
      error: error.message
    };
  }
});

const index_get$z = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$y
});

const index_get$w = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Tender/quotation list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching tender/quotation list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch tender/quotation list",
      error: error.message
    };
  }
});

const index_get$x = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$w
});

const index_get$u = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Tender/quotation/DP for selection list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching tender/quotation/DP for selection list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch tender/quotation/DP for selection list",
      error: error.message
    };
  }
});

const index_get$v = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$u
});

const index_get$s = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Variation orders fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching variation orders:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch variation orders",
      error: error.message
    };
  }
});

const index_get$t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$s
});

const index_get$q = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { grm_receive_no: { contains: searchTerm } },
        { pom_order_no: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } }
      ];
    }
    const allGRNs = await prisma$1.goods_receive_master.findMany({
      where: whereClause,
      include: {
        goods_receive_details: {
          select: {
            grd_total_amtrm: true
          }
        }
      },
      orderBy: {
        grm_receive_id: "desc"
      }
    });
    const vendorAssessments = await prisma$1.vendor_assessment_master.findMany({
      where: {
        vam_grn_no: { not: null }
      },
      select: {
        vam_grn_no: true
      }
    });
    const grnNumbersWithAssessment = new Set(
      vendorAssessments.map((va) => va.vam_grn_no).filter(Boolean)
    );
    const grnList = allGRNs.filter(
      (grn) => !grnNumbersWithAssessment.has(grn.grm_receive_no)
    );
    console.log(`Total GRNs found: ${allGRNs.length}`);
    console.log(`GRNs with vendor assessment: ${grnNumbersWithAssessment.size}`);
    console.log(`GRNs without vendor assessment: ${grnList.length}`);
    const vendorCodes = [...new Set(grnList.map((grn) => grn.vcs_vendor_code).filter(Boolean))];
    const poNumbers = [...new Set(grnList.map((grn) => grn.pom_order_no).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const purchaseOrders = poNumbers.length > 0 ? await prisma$1.purchase_order_master.findMany({
      where: { pom_order_no: { in: poNumbers } },
      select: { pom_order_no: true, pom_description: true }
    }) : [];
    const bills = await prisma$1.bills_master.findMany({
      where: {
        grm_receive_no: { in: grnList.map((grn) => grn.grm_receive_no).filter(Boolean) }
      },
      select: {
        grm_receive_no: true,
        bim_bills_no: true
      }
    });
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const poMap = new Map(purchaseOrders.map((po) => [po.pom_order_no, po]));
    const billMap = new Map(bills.map((b) => [b.grm_receive_no, b]));
    const data = grnList.map((grn) => {
      const vendor = vendorMap.get(grn.vcs_vendor_code);
      const po = poMap.get(grn.pom_order_no);
      const bill = billMap.get(grn.grm_receive_no);
      const amount = grn.goods_receive_details.reduce((sum, detail) => {
        return sum + (detail.grd_total_amtrm ? parseFloat(detail.grd_total_amtrm.toString()) : 0);
      }, 0);
      return {
        grm_receive_id: grn.grm_receive_id,
        grm_receive_no: grn.grm_receive_no || "",
        pom_order_no: (po == null ? void 0 : po.pom_order_no) || "",
        vcs_vendor_code: grn.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_description: (po == null ? void 0 : po.pom_description) || "",
        amount,
        grm_status: grn.grm_status || "",
        bim_bills_no: (bill == null ? void 0 : bill.bim_bills_no) || "",
        vam_status: "",
        // TODO: Get from vendor assessment
        urlEdit: `/purchasing/good-receive-note/edit/${grn.grm_receive_id}`
      };
    });
    return {
      statusCode: 200,
      message: "GRN without vendor assessment fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching GRN without vendor assessment:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch GRN without vendor assessment",
      error: error.message
    };
  }
});

const index_get$r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$q
});

const index_get$o = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let wpnList = [];
    try {
      const vendorAssessments = await prisma$1.vendor_assessment_master.findMany({
        where: {
          wpm_progress_no: { not: null }
        },
        select: {
          wpm_progress_no: true
        }
      });
      const wpnNumbersWithAssessment = new Set(
        vendorAssessments.map((va) => va.wpm_progress_no).filter(Boolean)
      );
      let whereClause = {};
      if (query.search) {
        const searchTerm = query.search.trim();
        whereClause.OR = [
          { wpm_progress_no: { contains: searchTerm } },
          { pom_order_no: { contains: searchTerm } },
          { vcs_vendor_code: { contains: searchTerm } }
        ];
      }
      const allWPNs = await prisma$1.work_progress_note_master.findMany({
        where: whereClause,
        include: {
          work_progress_note_details: {
            select: {
              wpd_total_amtrm: true
            }
          }
        },
        orderBy: {
          wpm_progress_id: "desc"
        }
      });
      wpnList = allWPNs.filter(
        (wpn) => !wpnNumbersWithAssessment.has(wpn.wpm_progress_no)
      );
      console.log(`Total WPNs found: ${allWPNs.length}`);
      console.log(`WPNs with vendor assessment: ${wpnNumbersWithAssessment.size}`);
      console.log(`WPNs without vendor assessment: ${wpnList.length}`);
    } catch (tableError) {
      console.log("Work progress note table may not exist or error occurred:", tableError.message);
      wpnList = [];
    }
    if (wpnList.length === 0) {
      return {
        statusCode: 200,
        message: "WPN without vendor assessment fetched successfully",
        data: []
      };
    }
    const vendorCodes = [...new Set(wpnList.map((wpn) => wpn.vcs_vendor_code).filter(Boolean))];
    const poNumbers = [...new Set(wpnList.map((wpn) => wpn.pom_order_no).filter(Boolean))];
    const vendors = vendorCodes.length > 0 ? await prisma$1.vend_customer_supplier.findMany({
      where: { vcs_vendor_code: { in: vendorCodes } },
      select: { vcs_vendor_code: true, vcs_vendor_name: true }
    }) : [];
    const purchaseOrders = poNumbers.length > 0 ? await prisma$1.purchase_order_master.findMany({
      where: { pom_order_no: { in: poNumbers } },
      select: { pom_order_no: true, pom_description: true }
    }) : [];
    const vendorMap = new Map(vendors.map((v) => [v.vcs_vendor_code, v]));
    const poMap = new Map(purchaseOrders.map((po) => [po.pom_order_no, po]));
    const data = wpnList.map((wpn) => {
      var _a;
      const vendor = vendorMap.get(wpn.vcs_vendor_code);
      const po = poMap.get(wpn.pom_order_no);
      const amount = ((_a = wpn.work_progress_note_details) == null ? void 0 : _a.reduce((sum, detail) => {
        return sum + (detail.wpd_total_amtrm ? parseFloat(detail.wpd_total_amtrm.toString()) : 0);
      }, 0)) || 0;
      return {
        wpn_no: wpn.wpm_progress_no || "",
        pom_order_no: (po == null ? void 0 : po.pom_order_no) || "",
        vcs_vendor_code: wpn.vcs_vendor_code || "",
        vcs_vendor_name: (vendor == null ? void 0 : vendor.vcs_vendor_name) || "",
        pom_description: (po == null ? void 0 : po.pom_description) || "",
        amount,
        status: wpn.wpm_status || "",
        assessment_status: "",
        urlEdit: `/purchasing/work-progress-note/edit/${wpn.wpm_progress_id}`
      };
    });
    return {
      statusCode: 200,
      message: "WPN without vendor assessment fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching WPN without vendor assessment:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch WPN without vendor assessment",
      error: error.message
    };
  }
});

const index_get$p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$o
});

const index_get$m = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { vba_account_id: { contains: searchTerm } },
        { vcs_vendor_code: { contains: searchTerm } },
        { vba_bank_name: { contains: searchTerm } },
        { vba_account_no: { contains: searchTerm } },
        { vba_reason: { contains: searchTerm } }
      ];
    }
    const bankAccounts = await prisma$1.vend_bank_account.findMany({
      where: whereClause,
      orderBy: {
        vba_account_id: "desc"
      }
    });
    const data = bankAccounts.map((account) => {
      return {
        vba_account_id: account.vba_account_id,
        vcs_vendor_code: account.vcs_vendor_code || "",
        vba_bank_name: account.vba_bank_name || "",
        vba_account_no: account.vba_account_no || "",
        vba_reason: account.vba_reason || "",
        vba_status: account.vba_status ? "ACTIVE" : "INACTIVE",
        urlEdit: `/purchasing/vendor/bank-account-updated/edit/${account.vba_account_id}`
      };
    });
    return {
      statusCode: 200,
      message: "Bank account list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching bank account list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch bank account list",
      error: error.message
    };
  }
});

const index_get$n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$m
});

const index_get$k = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { vcs_vendor_code: { contains: searchTerm } },
        { vcs_vendor_name: { contains: searchTerm } },
        { vcs_address: { contains: searchTerm } },
        { vcs_registration_no: { contains: searchTerm } },
        { vcs_kk_regno: { contains: searchTerm } },
        { vcs_contact_person: { contains: searchTerm } }
      ];
    }
    let vendors;
    try {
      vendors = await prisma$1.vend_customer_supplier.findMany({
        where: whereClause,
        select: {
          vcs_id: true,
          vcs_vendor_code: true,
          vcs_vendor_name: true,
          vcs_address: true,
          vcs_registration_no: true,
          vcs_reg_date: true,
          vcs_reg_exp_date: true,
          vcs_kk_regno: true,
          vcs_kk_expired_date: true,
          vcs_bumi_status: true,
          vcs_company_category: true,
          vcs_tel_no: true,
          vcs_fax_no: true,
          vcs_contact_person: true,
          vcs_tax_regno: true,
          vcs_iscreditor: true,
          vcs_isdebtor: true,
          vcs_vendor_status: true
        },
        orderBy: {
          vcs_id: "desc"
        }
      });
    } catch (dateError) {
      if (dateError.code === "P2020" && ((_b = (_a = dateError.meta) == null ? void 0 : _a.details) == null ? void 0 : _b.includes("datetime"))) {
        console.log("Date parsing error detected, fetching without date fields...");
        vendors = await prisma$1.vend_customer_supplier.findMany({
          where: whereClause,
          select: {
            vcs_id: true,
            vcs_vendor_code: true,
            vcs_vendor_name: true,
            vcs_address: true,
            vcs_registration_no: true,
            vcs_kk_regno: true,
            vcs_bumi_status: true,
            vcs_company_category: true,
            vcs_tel_no: true,
            vcs_fax_no: true,
            vcs_contact_person: true,
            vcs_tax_regno: true,
            vcs_iscreditor: true,
            vcs_isdebtor: true,
            vcs_vendor_status: true
          },
          orderBy: {
            vcs_id: "desc"
          }
        });
        vendors = vendors.map((v) => ({
          ...v,
          vcs_reg_date: null,
          vcs_reg_exp_date: null,
          vcs_kk_expired_date: null
        }));
      } else {
        throw dateError;
      }
    }
    const vendorCodes = vendors.map((v) => v.vcs_vendor_code).filter(Boolean);
    const activeAccounts = vendorCodes.length > 0 ? await prisma$1.vend_supplier_account.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
        vsa_status: "1"
      }
    }) : [];
    const accountMap = {};
    activeAccounts.forEach((acc) => {
      if (!accountMap[acc.vcs_vendor_code]) {
        accountMap[acc.vcs_vendor_code] = acc;
      }
    });
    const tarafVendorLookup = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "TARAF_VENDOR"
      }
    });
    const vendorStatusLookup = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "VENDORSTATUS"
      }
    });
    const tarafMap = {};
    tarafVendorLookup.forEach((item) => {
      tarafMap[item.lde_value] = item.lde_description;
    });
    const statusMap = {};
    vendorStatusLookup.forEach((item) => {
      statusMap[item.lde_value] = item.lde_description;
    });
    const formatDate = (date) => {
      if (!date || date === null) {
        return "";
      }
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
          return "";
        }
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        if (year < 1900 || month === 0 || day === 0) {
          return "";
        }
        const dayStr = String(day).padStart(2, "0");
        const monthStr = String(month).padStart(2, "0");
        return `${dayStr}/${monthStr}/${year}`;
      } catch (e) {
        return "";
      }
    };
    const seen = /* @__PURE__ */ new Set();
    const uniqueVendors = vendors.filter((vendor) => {
      const key = `${vendor.vcs_id}_${vendor.vcs_vendor_code}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    const data = uniqueVendors.map((vendor) => {
      const account = accountMap[vendor.vcs_vendor_code];
      return {
        vcs_id: vendor.vcs_id,
        VendorId: vendor.vcs_id,
        VendorCode: vendor.vcs_vendor_code || "",
        VendorName: vendor.vcs_vendor_name || "",
        Address: vendor.vcs_address || "",
        RegistrationNoSSM: vendor.vcs_registration_no || "",
        RegistrationDateSSM: formatDate(vendor.vcs_reg_date),
        RegistrationExpiryDateSSM: formatDate(vendor.vcs_reg_exp_date),
        RegistrationNoMOF: vendor.vcs_kk_regno || "",
        RegistrationExpiryDateMOF: formatDate(vendor.vcs_kk_expired_date),
        vcs_bumi_status: tarafMap[vendor.vcs_bumi_status] || vendor.vcs_bumi_status || "",
        vcs_company_category: vendor.vcs_company_category || "",
        vcs_tel_no: vendor.vcs_tel_no || "",
        vcs_fax_no: vendor.vcs_fax_no || "",
        vcs_contact_person: vendor.vcs_contact_person || "",
        vcs_tax_regno: vendor.vcs_tax_regno || "",
        vcs_iscreditor: vendor.vcs_iscreditor === "Y" ? "YES" : "NO",
        vcs_isdebtor: vendor.vcs_isdebtor === "Y" ? "YES" : "NO",
        vcs_vendor_status: statusMap[vendor.vcs_vendor_status] || vendor.vcs_vendor_status || "",
        vsa_status: (account == null ? void 0 : account.vsa_status) === "1" ? "ACTIVE" : "",
        urlEdit: `/purchasing/vendor/edit/${vendor.vcs_id}?vcs_vendor_code=${vendor.vcs_vendor_code}&mode=edit`
      };
    });
    return {
      statusCode: 200,
      message: "Vendors fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching vendors:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Failed to fetch vendors",
      error: error.message || String(error),
      details: error.stack
    };
  }
});

const index_get$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$k
});

const index_get$i = defineEventHandler(async (event) => {
  var _a, _b;
  try {
    const query = getQuery$1(event);
    let whereClause = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      whereClause.OR = [
        { vcs_vendor_code: { contains: searchTerm } },
        { vcs_vendor_name: { contains: searchTerm } },
        { vcs_registration_no: { contains: searchTerm } },
        { vcs_kk_regno: { contains: searchTerm } },
        { vcs_contact_person: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_Status) {
      whereClause.vcs_vendor_status = query.smartFilter_Status;
    }
    let vendors;
    try {
      vendors = await prisma$1.vend_customer_supplier.findMany({
        where: whereClause,
        select: {
          vcs_id: true,
          vcs_vendor_code: true,
          vcs_vendor_name: true,
          vcs_address: true,
          vcs_registration_no: true,
          vcs_reg_date: true,
          vcs_reg_exp_date: true,
          vcs_kk_regno: true,
          vcs_kk_expired_date: true,
          vcs_unv_reg_date: true,
          vcs_unv_req_exp_date: true,
          vcs_bumi_status: true,
          vcs_company_category: true,
          vcs_authorize_capital: true,
          vcs_paid_up_capital: true,
          vcs_tel_no: true,
          vcs_fax_no: true,
          vcs_contact_person: true,
          vcs_tax_regno: true,
          vcs_iscreditor: true,
          vcs_isdebtor: true,
          vcs_vendor_status: true
        },
        orderBy: {
          vcs_id: "desc"
        }
      });
    } catch (dateError) {
      if (dateError.code === "P2020" && ((_b = (_a = dateError.meta) == null ? void 0 : _a.details) == null ? void 0 : _b.includes("datetime"))) {
        console.log("Date parsing error detected, fetching without date fields...");
        vendors = await prisma$1.vend_customer_supplier.findMany({
          where: whereClause,
          select: {
            vcs_id: true,
            vcs_vendor_code: true,
            vcs_vendor_name: true,
            vcs_address: true,
            vcs_registration_no: true,
            // Skip date fields that cause errors
            vcs_kk_regno: true,
            vcs_bumi_status: true,
            vcs_company_category: true,
            vcs_authorize_capital: true,
            vcs_paid_up_capital: true,
            vcs_tel_no: true,
            vcs_fax_no: true,
            vcs_contact_person: true,
            vcs_tax_regno: true,
            vcs_iscreditor: true,
            vcs_isdebtor: true,
            vcs_vendor_status: true
          },
          orderBy: {
            vcs_id: "desc"
          }
        });
        vendors = vendors.map((v) => ({
          ...v,
          vcs_reg_date: null,
          vcs_reg_exp_date: null,
          vcs_kk_expired_date: null,
          vcs_unv_reg_date: null,
          vcs_unv_req_exp_date: null
        }));
      } else {
        throw dateError;
      }
    }
    console.log("Vendors query result:", vendors ? vendors.length : 0);
    const vendorCodes = vendors.map((v) => v.vcs_vendor_code).filter(Boolean);
    const activeAccounts = vendorCodes.length > 0 ? await prisma$1.vend_supplier_account.findMany({
      where: {
        vcs_vendor_code: { in: vendorCodes },
        vsa_status: "1"
      }
    }) : [];
    const accountMap = {};
    activeAccounts.forEach((acc) => {
      if (!accountMap[acc.vcs_vendor_code]) {
        accountMap[acc.vcs_vendor_code] = acc;
      }
    });
    const tarafVendorLookup = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "TARAF_VENDOR"
      }
    });
    const vendorStatusLookup = await prisma$1.lookup_details.findMany({
      where: {
        lma_code_name: "VENDORSTATUS"
      }
    });
    const tarafMap = {};
    tarafVendorLookup.forEach((item) => {
      tarafMap[item.lde_value] = item.lde_description;
    });
    const statusMap = {};
    vendorStatusLookup.forEach((item) => {
      statusMap[item.lde_value] = item.lde_description;
    });
    const formatDate = (date) => {
      if (!date || date === null) {
        return "";
      }
      if (typeof date === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
        return date;
      }
      try {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
          return "";
        }
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        if (year < 1900 || month === 0 || day === 0) {
          return "";
        }
        const dayStr = String(day).padStart(2, "0");
        const monthStr = String(month).padStart(2, "0");
        return `${dayStr}/${monthStr}/${year}`;
      } catch (e) {
        return "";
      }
    };
    const data = vendors.map((vendor) => {
      const vcsId = vendor.vcs_id;
      const vcsVendorCode = vendor.vcs_vendor_code || "";
      const account = accountMap[vcsVendorCode];
      return {
        vcs_id: vcsId,
        vcs_vendor_code: vcsVendorCode,
        vcs_vendor_name: vendor.vcs_vendor_name || "",
        vcs_address: vendor.vcs_address || "",
        vcs_registration_no: vendor.vcs_registration_no || "",
        vcs_reg_date: formatDate(vendor.vcs_reg_date),
        vcs_reg_exp_date: formatDate(vendor.vcs_reg_exp_date),
        vcs_kk_regno: vendor.vcs_kk_regno || "",
        vcs_kk_expired_date: formatDate(vendor.vcs_kk_expired_date),
        vcs_unv_reg_date: formatDate(vendor.vcs_unv_reg_date),
        vcs_unv_req_exp_date: formatDate(vendor.vcs_unv_req_exp_date),
        vcs_bumi_status: tarafMap[vendor.vcs_bumi_status] || vendor.vcs_bumi_status || "",
        vcs_company_category: vendor.vcs_company_category || "",
        vcs_authorize_capital: vendor.vcs_authorize_capital ? Number(vendor.vcs_authorize_capital) : null,
        vcs_paid_up_capital: vendor.vcs_paid_up_capital ? Number(vendor.vcs_paid_up_capital) : null,
        vcs_tel_no: vendor.vcs_tel_no || "",
        vcs_fax_no: vendor.vcs_fax_no || "",
        vcs_contact_person: vendor.vcs_contact_person || "",
        vcs_tax_regno: vendor.vcs_tax_regno || "",
        vcs_iscreditor: vendor.vcs_iscreditor === "Y" ? "YES" : "NO",
        vcs_isdebtor: vendor.vcs_isdebtor === "Y" ? "YES" : "NO",
        vcs_vendor_status: statusMap[vendor.vcs_vendor_status] || vendor.vcs_vendor_status || "",
        vsa_status: (account == null ? void 0 : account.vsa_status) === "1" ? "ACTIVE" : "",
        urlEdit: `/purchasing/vendor/edit/${vcsId}?vcs_vendor_code=${vcsVendorCode}&mode=edit`,
        urlView: `/purchasing/vendor/edit/${vcsId}?vcs_vendor_code=${vcsVendorCode}&mode=view`
      };
    });
    console.log("Vendors found:", vendors.length);
    console.log("Data mapped:", data.length);
    if (data.length > 0) {
      console.log("First item:", JSON.stringify(data[0], null, 2));
    }
    return {
      statusCode: 200,
      message: "Vendor profile list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching vendor profile list:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Failed to fetch vendor profile list",
      error: error.message || String(error),
      details: error.stack
    };
  }
});

const index_get$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$i
});

const index_get$g = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Work progress note cancel list fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching work progress note cancel list:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch work progress note cancel list",
      error: error.message
    };
  }
});

const index_get$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$g
});

const index_get$e = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Work progress note details fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching work progress note details:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch work progress note details",
      error: error.message
    };
  }
});

const index_get$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$e
});

const index_get$c = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const data = [];
    return {
      statusCode: 200,
      message: "Work progress notes fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error fetching work progress notes:", error);
    return {
      statusCode: 500,
      message: "Failed to fetch work progress notes",
      error: error.message
    };
  }
});

const index_get$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$c
});

const _code__delete$8 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    if (!code) {
      return {
        statusCode: 400,
        message: "Account code is required"
      };
    }
    const existing = await prisma$1.account_main.findUnique({
      where: {
        acm_acct_code: code
      }
    });
    if (!existing) {
      return {
        statusCode: 404,
        message: "Account code not found"
      };
    }
    const hasChildren = await prisma$1.account_main.findFirst({
      where: {
        acm_acct_parent: code
      }
    });
    if (hasChildren) {
      return {
        statusCode: 409,
        message: "Cannot delete account code because it has child accounts"
      };
    }
    await prisma$1.account_main.delete({
      where: {
        acm_acct_code: code
      }
    });
    return {
      statusCode: 200,
      message: "Account code deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting account:", error);
    if (error.code === "P2003" || error.message.includes("Foreign key constraint")) {
      return {
        statusCode: 409,
        message: "Cannot delete account code because it is being used by other records",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while deleting account code",
      error: error.message
    };
  }
});

const _code__delete$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__delete$8
});

const _code__put$8 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    if (!code) {
      return {
        statusCode: 400,
        message: "Account code is required"
      };
    }
    const existing = await prisma$1.account_main.findUnique({
      where: {
        acm_acct_code: code
      }
    });
    if (!existing) {
      return {
        statusCode: 404,
        message: "Account code not found"
      };
    }
    if (body.acm_acct_code && body.acm_acct_code !== code) {
      const duplicate = await prisma$1.account_main.findUnique({
        where: {
          acm_acct_code: body.acm_acct_code
        }
      });
      if (duplicate) {
        return {
          statusCode: 409,
          message: "Account code already exists"
        };
      }
    }
    if (body.acm_acct_parent && body.acm_acct_parent !== existing.acm_acct_parent) {
      const parent = await prisma$1.account_main.findUnique({
        where: {
          acm_acct_code: body.acm_acct_parent
        }
      });
      if (!parent) {
        return {
          statusCode: 404,
          message: "Parent account code not found"
        };
      }
    }
    if (body.acm_acct_activity && body.acm_acct_activity !== existing.acm_acct_activity) {
      const activity = await prisma$1.lookup_details.findFirst({
        where: {
          lma_code_name: "ACCOUNT_ACTIVITY",
          lde_value: body.acm_acct_activity
        }
      });
      if (!activity) {
        return {
          statusCode: 404,
          message: "Account activity not found"
        };
      }
    }
    const updated = await prisma$1.account_main.update({
      where: {
        acm_acct_code: code
      },
      data: {
        acm_acct_code: body.acm_acct_code || existing.acm_acct_code,
        acm_acct_desc: body.acm_acct_desc || existing.acm_acct_desc,
        acm_acct_desc_eng: body.acm_acct_desc_eng !== void 0 ? body.acm_acct_desc_eng : existing.acm_acct_desc_eng,
        acm_acct_activity: body.acm_acct_activity !== void 0 ? body.acm_acct_activity : existing.acm_acct_activity,
        acm_acct_group: body.acm_acct_group !== void 0 ? body.acm_acct_group : existing.acm_acct_group,
        acm_acct_status: body.acm_acct_status ? body.acm_acct_status === "ACTIVE" ? "1" : "0" : existing.acm_acct_status,
        acm_acct_parent: body.acm_acct_parent !== void 0 ? body.acm_acct_parent : existing.acm_acct_parent,
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Account updated successfully",
      data: {
        acm_acct_code: updated.acm_acct_code,
        acm_acct_desc: updated.acm_acct_desc,
        acm_acct_desc_eng: updated.acm_acct_desc_eng,
        acm_acct_activity: updated.acm_acct_activity,
        acm_acct_group: updated.acm_acct_group,
        acm_acct_status: updated.acm_acct_status === "1" || updated.acm_acct_status === 1 ? "ACTIVE" : "INACTIVE",
        acm_acct_level: updated.acm_acct_level ? Number(updated.acm_acct_level) : null,
        acm_acct_parent: updated.acm_acct_parent
      }
    };
  } catch (error) {
    console.error("Error updating account:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 409,
        message: "Account code already exists",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while updating account",
      error: error.message
    };
  }
});

const _code__put$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__put$8
});

const _id__delete$6 = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Account activity ID is required"
      };
    }
    const existing = await prisma$1.lookup_details.findUnique({
      where: {
        lde_id: parseInt(id)
      }
    });
    if (!existing || existing.lma_code_name !== "ACCOUNT_ACTIVITY") {
      return {
        statusCode: 404,
        message: "Account activity not found"
      };
    }
    const usedInAccounts = await prisma$1.account_main.findFirst({
      where: {
        acm_acct_activity: existing.lde_value,
        acm_acct_level: "1"
      }
    });
    if (usedInAccounts) {
      return {
        statusCode: 409,
        message: "Cannot delete account activity because it is being used by account classes"
      };
    }
    await prisma$1.lookup_details.delete({
      where: {
        lde_id: parseInt(id)
      }
    });
    return {
      statusCode: 200,
      message: "Account activity deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting account activity:", error);
    if (error.code === "P2003" || error.message.includes("Foreign key constraint")) {
      return {
        statusCode: 409,
        message: "Cannot delete account activity because it is being used by other records",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while deleting account activity",
      error: error.message
    };
  }
});

const _id__delete$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$6
});

const _id__put$6 = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "Account activity ID is required"
      };
    }
    const existing = await prisma$1.lookup_details.findUnique({
      where: {
        lde_id: parseInt(id)
      }
    });
    if (!existing || existing.lma_code_name !== "ACCOUNT_ACTIVITY") {
      return {
        statusCode: 404,
        message: "Account activity not found"
      };
    }
    if (body.lde_value && body.lde_value !== existing.lde_value) {
      const duplicate = await prisma$1.lookup_details.findFirst({
        where: {
          lma_code_name: "ACCOUNT_ACTIVITY",
          lde_value: body.lde_value,
          lde_id: { not: parseInt(id) }
        }
      });
      if (duplicate) {
        return {
          statusCode: 409,
          message: "Account activity code already exists"
        };
      }
    }
    const updated = await prisma$1.lookup_details.update({
      where: {
        lde_id: parseInt(id)
      },
      data: {
        lde_value: body.lde_value || existing.lde_value,
        lde_description: body.lde_description || existing.lde_description,
        lde_description2: body.lde_description2 !== void 0 ? body.lde_description2 : existing.lde_description2,
        lde_status: body.lde_status ? body.lde_status === "ACTIVE" ? "1" : "0" : existing.lde_status,
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Account activity updated successfully",
      data: {
        lde_id: updated.lde_id,
        lde_value: updated.lde_value,
        lde_description: updated.lde_description,
        lde_description2: updated.lde_description2,
        lde_status: updated.lde_status === "1" || updated.lde_status === 1 ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error updating account activity:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 409,
        message: "Account activity code already exists",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while updating account activity",
      error: error.message
    };
  }
});

const _id__put$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$6
});

const index_get$a = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const where = {
      lma_code_name: "ACCOUNT_ACTIVITY"
      // Account Activity lookup code
    };
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      where.OR = [
        { lde_value: { contains: searchTerm } },
        { lde_description: { contains: searchTerm } },
        { lde_description2: { contains: searchTerm } }
      ];
    }
    if (query.lde_status) {
      const statusValue = query.lde_status === "ACTIVE" ? "1" : query.lde_status === "INACTIVE" ? "0" : query.lde_status;
      where.lde_status = statusValue;
    }
    const activities = await prisma$1.lookup_details.findMany({
      where,
      orderBy: {
        lde_sorting: "asc"
      }
    });
    const formattedData = activities.map((item, index) => ({
      no: index + 1,
      lde_value: item.lde_value,
      lde_description: item.lde_description,
      lde_description2: item.lde_description2 || "",
      lde_status: item.lde_status === "1" || item.lde_status === 1 ? "ACTIVE" : "INACTIVE",
      lde_id: item.lde_id,
      lde_sorting: item.lde_sorting
    }));
    return {
      statusCode: 200,
      message: "Account activities fetched successfully",
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching account activities:", error);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message
    };
  }
});

const index_get$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$a
});

const index_post$g = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.lde_value || !body.lde_description || !body.lde_status) {
      return {
        statusCode: 400,
        message: "Missing required fields: lde_value, lde_description, and lde_status are required"
      };
    }
    const existing = await prisma$1.lookup_details.findFirst({
      where: {
        lma_code_name: "ACCOUNT_ACTIVITY",
        lde_group: null,
        lde_value: body.lde_value
      }
    });
    if (existing) {
      return {
        statusCode: 409,
        message: "Account activity code already exists"
      };
    }
    const maxId = await prisma$1.lookup_details.findFirst({
      where: {
        lma_code_name: "ACCOUNT_ACTIVITY"
      },
      orderBy: {
        lde_id: "desc"
      },
      select: {
        lde_id: true
      }
    });
    const nextId = maxId ? maxId.lde_id + 1 : 1;
    const maxSorting = await prisma$1.lookup_details.findFirst({
      where: {
        lma_code_name: "ACCOUNT_ACTIVITY"
      },
      orderBy: {
        lde_sorting: "desc"
      },
      select: {
        lde_sorting: true
      }
    });
    const nextSorting = (maxSorting == null ? void 0 : maxSorting.lde_sorting) ? maxSorting.lde_sorting + 1 : 1;
    const newActivity = await prisma$1.lookup_details.create({
      data: {
        lde_id: nextId,
        lma_code_name: "ACCOUNT_ACTIVITY",
        lde_value: body.lde_value,
        lde_description: body.lde_description,
        lde_description2: body.lde_description2 || null,
        lde_status: body.lde_status === "ACTIVE" ? "1" : "0",
        lde_sorting: nextSorting,
        createddate: /* @__PURE__ */ new Date(),
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Account activity created successfully",
      data: {
        lde_id: newActivity.lde_id,
        lde_value: newActivity.lde_value,
        lde_description: newActivity.lde_description,
        lde_description2: newActivity.lde_description2,
        lde_status: newActivity.lde_status === "1" || newActivity.lde_status === 1 ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error creating account activity:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 409,
        message: "Account activity code already exists",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while creating account activity",
      error: error.message
    };
  }
});

const index_post$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$g
});

const index_get$8 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    console.log("[API] Received query:", JSON.stringify(query, null, 2));
    let level = null;
    if (query.level !== void 0 && query.level !== null) {
      level = parseInt(query.level);
    } else if (query.level_1) {
      level = 1;
    } else if (query.level2) {
      level = 2;
    } else if (query.level3) {
      level = 3;
    } else if (query.level4) {
      level = 4;
    } else if (query.level5) {
      level = 5;
    } else if (query.dt_accountactvty) {
      level = 0;
    }
    console.log("[API] Determined level:", level, "from query:", JSON.stringify(query));
    if (level === null) {
      return {
        statusCode: 400,
        message: "Please specify a level parameter"
      };
    }
    if (level === 0) {
      const where2 = {
        lma_code_name: "ACCOUNT_ACTIVITY"
      };
      if (query.search && query.search.trim() !== "") {
        const searchTerm = query.search.trim();
        where2.OR = [
          { lde_value: { contains: searchTerm } },
          { lde_description: { contains: searchTerm } },
          { lde_description2: { contains: searchTerm } }
        ];
      }
      if (query.lde_status) {
        const statusValue = query.lde_status === "ACTIVE" ? "1" : query.lde_status === "INACTIVE" ? "0" : query.lde_status;
        where2.lde_status = statusValue;
      }
      if (query.smartFilter_lde_status) {
        const statusValue = query.smartFilter_lde_status === "ACTIVE" ? "1" : query.smartFilter_lde_status === "INACTIVE" ? "0" : query.smartFilter_lde_status;
        where2.lde_status = statusValue;
      }
      let activities = await prisma$1.lookup_details.findMany({
        where: where2
      });
      activities = activities.sort((a, b) => {
        if (a.lde_sorting === null && b.lde_sorting === null) {
          return a.lde_id - b.lde_id;
        }
        if (a.lde_sorting === null)
          return 1;
        if (b.lde_sorting === null)
          return -1;
        if (a.lde_sorting !== b.lde_sorting) {
          return a.lde_sorting - b.lde_sorting;
        }
        return a.lde_id - b.lde_id;
      });
      console.log(`Found ${activities.length} account activities for ACCOUNT_ACTIVITY`);
      const formattedActivities = activities.map((item, index) => ({
        no: index + 1,
        lde_value: item.lde_value || "",
        lde_description: item.lde_description || "",
        lde_description2: item.lde_description2 || "",
        lde_status: item.lde_status === "1" || item.lde_status === 1 ? "ACTIVE" : "INACTIVE",
        lde_id: item.lde_id
      }));
      return {
        statusCode: 200,
        message: "Account activities fetched successfully",
        data: formattedActivities
      };
    }
    const levelNum = parseInt(level);
    const where = {
      acm_acct_level: levelNum
    };
    if (level === 1) {
      const activityValue = query.activity || query.parent;
      if (activityValue) {
        where.acm_acct_activity = activityValue;
        console.log(`[Level 1] Filtering by acm_acct_activity = '${activityValue}'`);
      } else {
        console.log(`[Level 1] No activity filter provided - query.activity: ${query.activity}, query.parent: ${query.parent}`);
        return {
          statusCode: 400,
          message: "Activity code is required for Account Class"
        };
      }
    } else {
      if (query.parent) {
        where.acm_acct_parent = query.parent;
        console.log(`[Level ${level}] Filtering by acm_acct_parent = '${query.parent}'`);
      } else {
        console.log(`[Level ${level}] No parent filter provided`);
        return {
          statusCode: 400,
          message: `Parent code is required for level ${level}`
        };
      }
    }
    console.log(`[Level ${level}] WHERE clause:`, JSON.stringify(where, null, 2));
    if (query.search && query.search.trim() !== "") {
      const searchTerm = query.search.trim();
      where.OR = [
        { acm_acct_code: { contains: searchTerm } },
        { acm_acct_desc: { contains: searchTerm } },
        { acm_acct_desc_eng: { contains: searchTerm } },
        { acm_acct_activity: { contains: searchTerm } },
        { acm_acct_group: { contains: searchTerm } }
      ];
    }
    if (query.acm_acct_status) {
      const statusValue = query.acm_acct_status === "ACTIVE" ? "1" : query.acm_acct_status === "INACTIVE" ? "0" : query.acm_acct_status;
      where.acm_acct_status = statusValue;
    }
    if (query.smartFilter_acm_acct_status) {
      const statusValue = query.smartFilter_acm_acct_status === "ACTIVE" ? "1" : query.smartFilter_acm_acct_status === "INACTIVE" ? "0" : query.smartFilter_acm_acct_status;
      where.acm_acct_status = statusValue;
    }
    console.log(`[Level ${level}] Executing Prisma query with WHERE:`, JSON.stringify(where, null, 2));
    const accounts = await prisma$1.account_main.findMany({
      where,
      select: {
        acm_acct_code: true,
        acm_acct_desc: true,
        acm_acct_desc_eng: true,
        acm_acct_activity: true,
        acm_acct_group: true,
        acm_acct_status: true,
        createddate: true,
        acm_acct_level: true,
        acm_acct_parent: true
      },
      orderBy: {
        acm_acct_code: "asc"
      }
    });
    console.log(`[Level ${level}] Prisma query completed. Found ${accounts.length} records`);
    if (accounts.length > 0) {
      console.log(`[Level ${level}] First record sample:`, {
        acm_acct_code: accounts[0].acm_acct_code,
        acm_acct_desc: accounts[0].acm_acct_desc,
        acm_acct_activity: accounts[0].acm_acct_activity,
        acm_acct_level: accounts[0].acm_acct_level,
        acm_acct_status: accounts[0].acm_acct_status,
        createddate: accounts[0].createddate
      });
    } else {
      console.log(`[Level ${level}] No records found. WHERE clause was:`, JSON.stringify(where, null, 2));
    }
    const formattedData = accounts.map((item, index) => {
      const acctLevel = item.acm_acct_level ? typeof item.acm_acct_level === "object" ? Number(item.acm_acct_level) : Number(item.acm_acct_level) : null;
      return {
        no: index + 1,
        acm_acct_code: item.acm_acct_code || "",
        acm_acct_desc: item.acm_acct_desc || "",
        acm_acct_desc_eng: item.acm_acct_desc_eng || "",
        acm_acct_activity: item.acm_acct_activity || "",
        acm_acct_status: item.acm_acct_status === "1" || item.acm_acct_status === 1 ? "ACTIVE" : "INACTIVE",
        datecreate: item.createddate ? item.createddate instanceof Date ? item.createddate.toISOString().split("T")[0] : item.createddate : null,
        // Additional fields for internal use
        acm_acct_group: item.acm_acct_group || "",
        acm_acct_level: acctLevel,
        acm_acct_parent: item.acm_acct_parent || ""
      };
    });
    return {
      statusCode: 200,
      message: `Account level ${level} fetched successfully`,
      data: formattedData
    };
  } catch (error) {
    console.error("Error fetching account codes:", error);
    console.error("Error stack:", error.stack);
    return {
      statusCode: 500,
      message: "Internal server error",
      error: error.message,
      details: error.stack 
    };
  }
});

const index_get$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$8
});

const index_post$e = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const query = getQuery$1(event);
    const level = query.level || body.acm_acct_level ? parseInt(body.acm_acct_level) : null;
    if (level === null || level < 1 || level > 5) {
      return {
        statusCode: 400,
        message: "Please specify a valid level (1-5)"
      };
    }
    if (!body.acm_acct_code || !body.acm_acct_desc || !body.acm_acct_status) {
      return {
        statusCode: 400,
        message: "Missing required fields: acm_acct_code, acm_acct_desc, and acm_acct_status are required"
      };
    }
    const existing = await prisma$1.account_main.findUnique({
      where: {
        acm_acct_code: body.acm_acct_code
      }
    });
    if (existing) {
      return {
        statusCode: 409,
        message: "Account code already exists"
      };
    }
    if (level > 1 && body.acm_acct_parent) {
      const parent = await prisma$1.account_main.findUnique({
        where: {
          acm_acct_code: body.acm_acct_parent
        }
      });
      if (!parent) {
        return {
          statusCode: 404,
          message: "Parent account code not found"
        };
      }
    }
    if (level === 1 && body.acm_acct_activity) {
      const activity = await prisma$1.lookup_details.findFirst({
        where: {
          lma_code_name: "ACCOUNT_ACTIVITY",
          lde_value: body.acm_acct_activity
        }
      });
      if (!activity) {
        return {
          statusCode: 404,
          message: "Account activity not found"
        };
      }
    }
    const newAccount = await prisma$1.account_main.create({
      data: {
        acm_acct_code: body.acm_acct_code,
        acm_acct_desc: body.acm_acct_desc,
        acm_acct_desc_eng: body.acm_acct_desc_eng || null,
        acm_acct_activity: body.acm_acct_activity || null,
        acm_acct_group: body.acm_acct_group || null,
        acm_acct_status: body.acm_acct_status === "ACTIVE" ? "1" : "0",
        acm_acct_level: level.toString(),
        acm_acct_parent: body.acm_acct_parent || null,
        createddate: /* @__PURE__ */ new Date(),
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: `Account level ${level} created successfully`,
      data: {
        acm_acct_code: newAccount.acm_acct_code,
        acm_acct_desc: newAccount.acm_acct_desc,
        acm_acct_desc_eng: newAccount.acm_acct_desc_eng,
        acm_acct_activity: newAccount.acm_acct_activity,
        acm_acct_group: newAccount.acm_acct_group,
        acm_acct_status: newAccount.acm_acct_status === "1" || newAccount.acm_acct_status === 1 ? "ACTIVE" : "INACTIVE",
        acm_acct_level: newAccount.acm_acct_level ? Number(newAccount.acm_acct_level) : null,
        acm_acct_parent: newAccount.acm_acct_parent
      }
    };
  } catch (error) {
    console.error("Error creating account:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 409,
        message: "Account code already exists",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while creating account",
      error: error.message
    };
  }
});

const index_post$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$e
});

const _id__delete$4 = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    if (!id) {
      return {
        statusCode: 400,
        message: "Activity type ID is required"
      };
    }
    await prisma$1.activity_type.delete({
      where: { at_activity_id: id }
    });
    return {
      statusCode: 200,
      message: "Activity type deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting activity type:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity type not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__delete$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$4
});

const _id__put$4 = defineEventHandler(async (event) => {
  try {
    const id = parseInt(getRouterParam(event, "id"));
    const body = await readBody(event);
    const {
      at_activity_description_bm,
      at_activity_description_en,
      at_status
    } = body;
    if (!id) {
      return {
        statusCode: 400,
        message: "Activity type ID is required"
      };
    }
    if (!at_activity_description_bm || !at_status) {
      return {
        statusCode: 400,
        message: "at_activity_description_bm and at_status are required"
      };
    }
    const updated = await prisma$1.activity_type.update({
      where: { at_activity_id: id },
      data: {
        at_activity_description_bm,
        at_activity_description_en: at_activity_description_en || null,
        at_status: at_status === "ACTIVE" ? "1" : "0",
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Activity type updated successfully",
      data: updated
    };
  } catch (error) {
    console.error("Error updating activity type:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity type not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__put$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$4
});

const index_post$c = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const {
      activity_group_code,
      activity_subgroup_code,
      activity_subsiri_code,
      at_activity_code,
      at_activity_description_bm,
      at_activity_description_en,
      at_status
    } = body;
    if (!activity_group_code || !activity_subgroup_code || !activity_subsiri_code || !at_activity_code || !at_activity_description_bm || !at_status) {
      return {
        statusCode: 400,
        message: "All required fields must be provided"
      };
    }
    const existing = await prisma$1.activity_type.findUnique({
      where: { at_activity_code }
    });
    if (existing) {
      return {
        statusCode: 400,
        message: "Activity type code already exists"
      };
    }
    const maxId = await prisma$1.activity_type.findFirst({
      orderBy: { at_activity_id: "desc" },
      select: { at_activity_id: true }
    });
    const nextId = maxId ? maxId.at_activity_id + 1 : 1;
    const newActivityType = await prisma$1.activity_type.create({
      data: {
        at_activity_id: nextId,
        at_activity_code,
        activity_group_code,
        activity_subgroup_code,
        activity_subsiri_code,
        at_activity_description_bm,
        at_activity_description_en: at_activity_description_en || null,
        at_status: at_status === "ACTIVE" ? "1" : "0",
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 201,
      message: "Activity type created successfully",
      data: newActivityType
    };
  } catch (error) {
    console.error("Error creating activity type:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const index_post$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$c
});

const _code__delete$6 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    if (!code) {
      return {
        statusCode: 400,
        message: "Activity group code is required"
      };
    }
    const hasSubgroups = await prisma$1.activity_subgroup.findFirst({
      where: { activity_group_code: code }
    });
    if (hasSubgroups) {
      return {
        statusCode: 400,
        message: "Cannot delete activity group with existing subgroups"
      };
    }
    await prisma$1.activity_group.delete({
      where: { activity_group_code: code }
    });
    return {
      statusCode: 200,
      message: "Activity group deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting activity group:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity group not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__delete$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__delete$6
});

const _code__put$6 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    const { activity_group_desc } = body;
    if (!code) {
      return {
        statusCode: 400,
        message: "Activity group code is required"
      };
    }
    if (!activity_group_desc) {
      return {
        statusCode: 400,
        message: "activity_group_desc is required"
      };
    }
    const updated = await prisma$1.activity_group.update({
      where: { activity_group_code: code },
      data: {
        activity_group_desc,
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Activity group updated successfully",
      data: updated
    };
  } catch (error) {
    console.error("Error updating activity group:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity group not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__put$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__put$6
});

const index_post$a = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { activity_group_code, activity_group_desc } = body;
    if (!activity_group_code || !activity_group_desc) {
      return {
        statusCode: 400,
        message: "activity_group_code and activity_group_desc are required"
      };
    }
    const existing = await prisma$1.activity_group.findUnique({
      where: { activity_group_code }
    });
    if (existing) {
      return {
        statusCode: 400,
        message: "Activity group code already exists"
      };
    }
    const newGroup = await prisma$1.activity_group.create({
      data: {
        activity_group_code,
        activity_group_desc,
        activity_group_flag_kodso: "0",
        // Default value
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 201,
      message: "Activity group created successfully",
      data: newGroup
    };
  } catch (error) {
    console.error("Error creating activity group:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const index_post$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$a
});

const index_get$6 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const level = query.level ? parseInt(query.level) : null;
    let where = {};
    let data = [];
    if (level === 0 || level === null) {
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { activity_group_code: { contains: searchTerm } },
          { activity_group_desc: { contains: searchTerm } }
        ];
      }
      const groups = await prisma$1.activity_group.findMany({
        where,
        select: {
          activity_group_code: true,
          activity_group_desc: true
        },
        orderBy: {
          activity_group_code: "asc"
        }
      });
      data = groups.map((item, index) => ({
        no: index + 1,
        Group: item.activity_group_code || "",
        Description: item.activity_group_desc || "",
        Action: "",
        // Keep original data
        activity_group_code: item.activity_group_code,
        activity_group_desc: item.activity_group_desc
      }));
      return {
        statusCode: 200,
        message: "Activity groups fetched successfully",
        data
      };
    }
    if (level === 1) {
      if (!query.activity_group_code) {
        return {
          statusCode: 400,
          message: "activity_group_code is required for level 1",
          data: []
        };
      }
      where.activity_group_code = query.activity_group_code;
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { activity_subgroup_code: { contains: searchTerm } },
          { activity_subgroup_desc: { contains: searchTerm } }
        ];
      }
      const subgroups = await prisma$1.activity_subgroup.findMany({
        where,
        select: {
          activity_group_code: true,
          activity_subgroup_code: true,
          activity_subgroup_desc: true
        },
        orderBy: {
          activity_subgroup_code: "asc"
        }
      });
      data = subgroups.map((item, index) => ({
        no: index + 1,
        "Code Activity": item.activity_subgroup_code || "",
        Description: item.activity_subgroup_desc || "",
        Action: "",
        // Keep original data
        activity_group_code: item.activity_group_code,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subgroup_desc: item.activity_subgroup_desc
      }));
      return {
        statusCode: 200,
        message: "Activity subgroups fetched successfully",
        data
      };
    }
    if (level === 2) {
      if (!query.activity_group_code || !query.activity_subgroup_code) {
        return {
          statusCode: 400,
          message: "activity_group_code and activity_subgroup_code are required for level 2",
          data: []
        };
      }
      where.activity_group = query.activity_group_code;
      where.activity_subgroup_code = query.activity_subgroup_code;
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { activity_subsiri_code: { contains: searchTerm } },
          { activity_subsiri_desc: { contains: searchTerm } },
          { activity_subsiri_desc_eng: { contains: searchTerm } }
        ];
      }
      const subsiris = await prisma$1.activity_subsiri.findMany({
        where,
        select: {
          activity_group: true,
          activity_subgroup_code: true,
          activity_subsiri_code: true,
          activity_subsiri_desc: true,
          activity_subsiri_desc_eng: true
        },
        orderBy: {
          activity_subsiri_code: "asc"
        }
      });
      data = subsiris.map((item, index) => ({
        no: index + 1,
        "Code Activity": item.activity_subsiri_code || "",
        "Description (Malay)": item.activity_subsiri_desc || "",
        "Description (English)": item.activity_subsiri_desc_eng || "",
        Action: "",
        // Keep original data
        activity_group: item.activity_group,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subsiri_code: item.activity_subsiri_code,
        activity_subsiri_desc: item.activity_subsiri_desc,
        activity_subsiri_desc_eng: item.activity_subsiri_desc_eng
      }));
      return {
        statusCode: 200,
        message: "Activity subsiris fetched successfully",
        data
      };
    }
    if (level === 3) {
      if (!query.activity_group_code || !query.activity_subgroup_code || !query.activity_subsiri_code) {
        return {
          statusCode: 400,
          message: "activity_group_code, activity_subgroup_code, and activity_subsiri_code are required for level 3",
          data: []
        };
      }
      where.activity_group_code = query.activity_group_code;
      where.activity_subgroup_code = query.activity_subgroup_code;
      where.activity_subsiri_code = query.activity_subsiri_code;
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { at_activity_code: { contains: searchTerm } },
          { at_activity_description_bm: { contains: searchTerm } },
          { at_activity_description_en: { contains: searchTerm } }
        ];
      }
      if (query.smartFilter_at_status) {
        if (query.smartFilter_at_status === "ACTIVE") {
          where.at_status = "1";
        } else if (query.smartFilter_at_status === "INACTIVE") {
          where.at_status = { not: "1" };
        }
      }
      const activityTypes = await prisma$1.activity_type.findMany({
        where,
        select: {
          at_activity_id: true,
          activity_group_code: true,
          activity_subgroup_code: true,
          activity_subsiri_code: true,
          at_activity_code: true,
          at_activity_description_bm: true,
          at_activity_description_en: true,
          at_status: true
        },
        orderBy: {
          at_activity_code: "asc"
        }
      });
      data = activityTypes.map((item, index) => ({
        no: index + 1,
        "Activity Code": item.at_activity_code || "",
        "Description (Malay)": item.at_activity_description_bm || "",
        "Description (English)": item.at_activity_description_en || "",
        Status: item.at_status === "1" ? "ACTIVE" : "INACTIVE",
        Action: "",
        // Keep original data
        at_activity_id: item.at_activity_id,
        activity_group_code: item.activity_group_code,
        activity_subgroup_code: item.activity_subgroup_code,
        activity_subsiri_code: item.activity_subsiri_code,
        at_activity_code: item.at_activity_code,
        at_activity_description_bm: item.at_activity_description_bm,
        at_activity_description_en: item.at_activity_description_en,
        at_status: item.at_status
      }));
      return {
        statusCode: 200,
        message: "Activity types fetched successfully",
        data
      };
    }
    return {
      statusCode: 400,
      message: "Invalid level parameter",
      data: []
    };
  } catch (error) {
    console.error("Error in activity-code API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      data: [],
      error: error.stack 
    };
  }
});

const index_get$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$6
});

const _code__delete$4 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const query = getQuery$1(event);
    const activity_group_code = query.activity_group_code;
    if (!code || !activity_group_code) {
      return {
        statusCode: 400,
        message: "activity_subgroup_code and activity_group_code are required"
      };
    }
    const hasSubsiris = await prisma$1.activity_subsiri.findFirst({
      where: {
        activity_group: activity_group_code,
        activity_subgroup_code: code
      }
    });
    if (hasSubsiris) {
      return {
        statusCode: 400,
        message: "Cannot delete activity subgroup with existing subsiris"
      };
    }
    await prisma$1.activity_subgroup.delete({
      where: {
        activity_subgroup_code_activity_group_code: {
          activity_subgroup_code: code,
          activity_group_code
        }
      }
    });
    return {
      statusCode: 200,
      message: "Activity subgroup deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting activity subgroup:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity subgroup not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__delete$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__delete$4
});

const _code__put$4 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    const { activity_group_code, activity_subgroup_desc } = body;
    if (!code || !activity_group_code) {
      return {
        statusCode: 400,
        message: "activity_subgroup_code and activity_group_code are required"
      };
    }
    if (!activity_subgroup_desc) {
      return {
        statusCode: 400,
        message: "activity_subgroup_desc is required"
      };
    }
    const updated = await prisma$1.activity_subgroup.update({
      where: {
        activity_subgroup_code_activity_group_code: {
          activity_subgroup_code: code,
          activity_group_code
        }
      },
      data: {
        activity_subgroup_desc,
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Activity subgroup updated successfully",
      data: updated
    };
  } catch (error) {
    console.error("Error updating activity subgroup:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity subgroup not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__put$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__put$4
});

const index_post$8 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { activity_group_code, activity_subgroup_code, activity_subgroup_desc } = body;
    if (!activity_group_code || !activity_subgroup_code || !activity_subgroup_desc) {
      return {
        statusCode: 400,
        message: "activity_group_code, activity_subgroup_code, and activity_subgroup_desc are required"
      };
    }
    const existing = await prisma$1.activity_subgroup.findUnique({
      where: {
        activity_subgroup_code_activity_group_code: {
          activity_subgroup_code,
          activity_group_code
        }
      }
    });
    if (existing) {
      return {
        statusCode: 400,
        message: "Activity subgroup code already exists for this group"
      };
    }
    const newSubgroup = await prisma$1.activity_subgroup.create({
      data: {
        activity_group_code,
        activity_subgroup_code,
        activity_subgroup_desc,
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 201,
      message: "Activity subgroup created successfully",
      data: newSubgroup
    };
  } catch (error) {
    console.error("Error creating activity subgroup:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const index_post$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$8
});

const _code__delete$2 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const query = getQuery$1(event);
    const activity_group = query.activity_group;
    const activity_subgroup_code = query.activity_subgroup_code;
    if (!code || !activity_group || !activity_subgroup_code) {
      return {
        statusCode: 400,
        message: "activity_subsiri_code, activity_group, and activity_subgroup_code are required"
      };
    }
    const hasActivityTypes = await prisma$1.activity_type.findFirst({
      where: {
        activity_group_code: activity_group,
        activity_subgroup_code,
        activity_subsiri_code: code
      }
    });
    if (hasActivityTypes) {
      return {
        statusCode: 400,
        message: "Cannot delete activity subsiri with existing activity types"
      };
    }
    await prisma$1.activity_subsiri.delete({
      where: {
        activity_subsiri_code_activity_subgroup_code_activity_group: {
          activity_subsiri_code: code,
          activity_subgroup_code,
          activity_group
        }
      }
    });
    return {
      statusCode: 200,
      message: "Activity subsiri deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting activity subsiri:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity subsiri not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__delete$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__delete$2
});

const _code__put$2 = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    const { activity_group, activity_subgroup_code, activity_subsiri_desc, activity_subsiri_desc_eng } = body;
    if (!code || !activity_group || !activity_subgroup_code) {
      return {
        statusCode: 400,
        message: "activity_subsiri_code, activity_group, and activity_subgroup_code are required"
      };
    }
    if (!activity_subsiri_desc) {
      return {
        statusCode: 400,
        message: "activity_subsiri_desc is required"
      };
    }
    const updated = await prisma$1.activity_subsiri.update({
      where: {
        activity_subsiri_code_activity_subgroup_code_activity_group: {
          activity_subsiri_code: code,
          activity_subgroup_code,
          activity_group
        }
      },
      data: {
        activity_subsiri_desc,
        activity_subsiri_desc_eng: activity_subsiri_desc_eng || null,
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Activity subsiri updated successfully",
      data: updated
    };
  } catch (error) {
    console.error("Error updating activity subsiri:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Activity subsiri not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__put$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__put$2
});

const index_post$6 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { activity_group, activity_subgroup_code, activity_subsiri_code, activity_subsiri_desc, activity_subsiri_desc_eng } = body;
    if (!activity_group || !activity_subgroup_code || !activity_subsiri_code || !activity_subsiri_desc) {
      return {
        statusCode: 400,
        message: "activity_group, activity_subgroup_code, activity_subsiri_code, and activity_subsiri_desc are required"
      };
    }
    const existing = await prisma$1.activity_subsiri.findUnique({
      where: {
        activity_subsiri_code_activity_subgroup_code_activity_group: {
          activity_subsiri_code,
          activity_subgroup_code,
          activity_group
        }
      }
    });
    if (existing) {
      return {
        statusCode: 400,
        message: "Activity subsiri code already exists for this group and subgroup"
      };
    }
    const newSubsiri = await prisma$1.activity_subsiri.create({
      data: {
        activity_group,
        activity_subgroup_code,
        activity_subsiri_code,
        activity_subsiri_desc,
        activity_subsiri_desc_eng: activity_subsiri_desc_eng || null,
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 201,
      message: "Activity subsiri created successfully",
      data: newSubsiri
    };
  } catch (error) {
    console.error("Error creating activity subsiri:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const index_post$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$6
});

const _id__delete$2 = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Cascade structure ID is required"
      };
    }
    await prisma$1.org_unit_costcentre.delete({
      where: { ouc_ounit_costcentre_id: parseInt(id) }
    });
    return {
      statusCode: 200,
      message: "Cascade structure deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting cascade structure:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cascade structure not found"
      };
    }
    if (error.code === "P2003") {
      return {
        statusCode: 400,
        message: "Cannot delete cascade structure with existing dependencies"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__delete$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete$2
});

const _id__get$2 = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Cascade structure ID is required"
      };
    }
    const record = await prisma$1.org_unit_costcentre.findUnique({
      where: {
        ouc_ounit_costcentre_id: parseInt(id)
      },
      include: {
        fund_type: {
          select: {
            fty_fund_type: true,
            fty_fund_desc: true
          }
        },
        activity_type: {
          select: {
            at_activity_code: true,
            at_activity_description_bm: true
          }
        },
        organization_unit: {
          select: {
            oun_code: true,
            oun_desc: true
          }
        },
        costcentre: {
          select: {
            ccr_costcentre: true,
            ccr_costcentre_desc: true
          }
        }
      }
    });
    if (!record) {
      return {
        statusCode: 404,
        message: "Cascade structure not found"
      };
    }
    return {
      statusCode: 200,
      message: "Cascade structure fetched successfully",
      data: {
        ouc_ounit_costcentre_id: record.ouc_ounit_costcentre_id,
        fty_fund_type: record.fty_fund_type || "",
        fty_fund_desc: ((_a = record.fund_type) == null ? void 0 : _a.fty_fund_desc) || "",
        at_activity_code: record.at_activity_code || "",
        at_activity_description_bm: ((_b = record.activity_type) == null ? void 0 : _b.at_activity_description_bm) || "",
        oun_code: record.oun_code || "",
        oun_desc: ((_c = record.organization_unit) == null ? void 0 : _c.oun_desc) || "",
        ccr_costcentre: record.ccr_costcentre || "",
        ccr_costcentre_desc: ((_d = record.costcentre) == null ? void 0 : _d.ccr_costcentre_desc) || "",
        ouc_status: record.ouc_status === "1" || record.ouc_status === 1 ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error in cascade-structure get by ID API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get$2
});

const _id__put$2 = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "Cascade structure ID is required"
      };
    }
    if (!body.fty_fund_type || !body.at_activity_code || !body.oun_code || !body.ccr_costcentre || !body.ouc_status) {
      return {
        statusCode: 400,
        message: "All required fields must be provided"
      };
    }
    const existing = await prisma$1.org_unit_costcentre.findUnique({
      where: { ouc_ounit_costcentre_id: parseInt(id) }
    });
    if (!existing) {
      return {
        statusCode: 404,
        message: "Cascade structure not found"
      };
    }
    const duplicate = await prisma$1.org_unit_costcentre.findFirst({
      where: {
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status,
        ouc_ounit_costcentre_id: { not: parseInt(id) }
      }
    });
    if (duplicate) {
      return {
        statusCode: 409,
        message: "The data you selected already exists."
      };
    }
    const updated = await prisma$1.org_unit_costcentre.update({
      where: { ouc_ounit_costcentre_id: parseInt(id) },
      data: {
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status === "ACTIVE" ? "1" : "0",
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    const fundType = await prisma$1.fund_type.findUnique({
      where: {
        fty_fund_type: body.fty_fund_type
      },
      select: {
        fty_basis: true
      }
    });
    if ((fundType == null ? void 0 : fundType.fty_basis) && (fundType.fty_basis.includes("CASH BASIS") || fundType.fty_basis.includes("PROJECT BASIS"))) {
      const capitalProject = await prisma$1.capital_project.findFirst({
        where: {
          fty_fund_type: existing.fty_fund_type,
          ccr_costcentre: existing.ccr_costcentre,
          lat_activity_code: existing.at_activity_code,
          oun_code: existing.oun_code,
          so_code: "00000"
        }
      });
      if (capitalProject) {
        const projectNo = `${body.fty_fund_type}${body.at_activity_code}${body.ccr_costcentre}00000`;
        const statusProject = body.ouc_status === "ACTIVE" ? "OPEN" : "0";
        await prisma$1.capital_project.update({
          where: { cpa_project_id: capitalProject.cpa_project_id },
          data: {
            cpa_project_no: projectNo,
            fty_fund_type: body.fty_fund_type,
            ccr_costcentre: body.ccr_costcentre,
            lat_activity_code: body.at_activity_code,
            oun_code: body.oun_code,
            cpa_project_status: statusProject,
            cpa_project_no_old: capitalProject.cpa_project_no,
            updateddate: /* @__PURE__ */ new Date()
          }
        });
      }
    }
    return {
      statusCode: 200,
      message: "Cascade structure updated successfully",
      data: updated
    };
  } catch (error) {
    console.error("Error updating cascade structure:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cascade structure not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__put$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put$2
});

const autosuggestActivity_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search || "";
    let where = {
      at_status: "1",
      at_activity_code: { not: null }
    };
    if (search) {
      where.OR = [
        { at_activity_code: { contains: search } },
        { at_activity_description_bm: { contains: search } }
      ];
    }
    const activities = await prisma$1.activity_type.findMany({
      where,
      select: {
        at_activity_code: true,
        at_activity_description_bm: true
      },
      take: 50,
      orderBy: {
        at_activity_code: "asc"
      }
    });
    const results = activities.map((at) => ({
      id: at.at_activity_code,
      text: `${at.at_activity_code} - ${at.at_activity_description_bm}`,
      _Desc: at.at_activity_description_bm
    }));
    return {
      statusCode: 200,
      message: "Activity types fetched successfully",
      results
    };
  } catch (error) {
    console.error("Error in autosuggest activity API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      results: [],
      error: error.stack 
    };
  }
});

const autosuggestActivity_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: autosuggestActivity_get
});

const autosuggestCostcentre_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search || "";
    const ptjCode = query.PTJCode || "";
    let where = {
      ccr_costcentre: { not: null }
    };
    if (ptjCode) {
      where.oun_code = ptjCode;
    }
    if (search) {
      where.OR = [
        { ccr_costcentre: { contains: search } },
        { ccr_costcentre_desc: { contains: search } }
      ];
    }
    const costCentres = await prisma$1.costcentre.findMany({
      where,
      select: {
        ccr_costcentre: true,
        ccr_costcentre_desc: true
      },
      take: 50,
      orderBy: {
        ccr_costcentre: "asc"
      }
    });
    const results = costCentres.map((cc) => ({
      id: cc.ccr_costcentre,
      text: `${cc.ccr_costcentre} - ${cc.ccr_costcentre_desc}`,
      _Desc: cc.ccr_costcentre_desc
    }));
    return {
      statusCode: 200,
      message: "Cost centres fetched successfully",
      results
    };
  } catch (error) {
    console.error("Error in autosuggest cost centre API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      results: [],
      error: error.stack 
    };
  }
});

const autosuggestCostcentre_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: autosuggestCostcentre_get
});

const autosuggestFund_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search || "";
    let where = {};
    if (search) {
      where.OR = [
        { fty_fund_type: { contains: search } },
        { fty_fund_desc: { contains: search } }
      ];
    }
    const fundTypes = await prisma$1.fund_type.findMany({
      where,
      select: {
        fty_fund_type: true,
        fty_fund_desc: true
      },
      take: 50,
      orderBy: {
        fty_fund_type: "asc"
      }
    });
    const results = fundTypes.map((ft) => ({
      id: ft.fty_fund_type,
      text: `${ft.fty_fund_type} - ${ft.fty_fund_desc}`,
      _Desc: ft.fty_fund_desc
    }));
    return {
      statusCode: 200,
      message: "Fund types fetched successfully",
      results
    };
  } catch (error) {
    console.error("Error in autosuggest fund API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      results: [],
      error: error.stack 
    };
  }
});

const autosuggestFund_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: autosuggestFund_get
});

const autosuggestPtj_get$2 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search || "";
    let where = {
      oun_code: { not: null }
    };
    if (search) {
      where.OR = [
        { oun_code: { contains: search } },
        { oun_desc: { contains: search } }
      ];
    }
    const orgUnits = await prisma$1.organization_unit.findMany({
      where,
      select: {
        oun_code: true,
        oun_desc: true
      },
      take: 50,
      orderBy: {
        oun_code: "asc"
      }
    });
    const results = orgUnits.map((ou) => ({
      id: ou.oun_code,
      text: `${ou.oun_code} - ${ou.oun_desc}`,
      _Desc: ou.oun_desc
    }));
    return {
      statusCode: 200,
      message: "Organization units fetched successfully",
      results
    };
  } catch (error) {
    console.error("Error in autosuggest PTJ API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      results: [],
      error: error.stack 
    };
  }
});

const autosuggestPtj_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: autosuggestPtj_get$2
});

const index_get$4 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let where = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { fty_fund_type: { contains: searchTerm } },
        { at_activity_code: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { ccr_costcentre: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_fty_fund_type_sm) {
      where.fty_fund_type = query.smartFilter_fty_fund_type_sm;
    }
    if (query.smartFilter_activity_smptj) {
      where.at_activity_code = query.smartFilter_activity_smptj;
    }
    if (query.smartFilter_activity_smou) {
      where.at_activity_code = query.smartFilter_activity_smou;
    }
    if (query.smartFilter_oun_codePTJ) {
      where.oun_code = query.smartFilter_oun_codePTJ;
    }
    if (query.smartFilter_costcenter_sm) {
      where.ccr_costcentre = query.smartFilter_costcenter_sm;
    }
    if (query.smartFilter_ouc_status) {
      if (query.smartFilter_ouc_status === "ACTIVE") {
        where.ouc_status = "1";
      } else if (query.smartFilter_ouc_status === "INACTIVE") {
        where.ouc_status = { not: "1" };
      }
    }
    const records = await prisma$1.org_unit_costcentre.findMany({
      where,
      include: {
        fund_type: {
          select: {
            fty_fund_type: true,
            fty_fund_desc: true
          }
        },
        activity_type: {
          select: {
            at_activity_code: true,
            at_activity_description_bm: true
          }
        },
        organization_unit: {
          select: {
            oun_code: true,
            oun_desc: true
          }
        },
        costcentre: {
          select: {
            ccr_costcentre: true,
            ccr_costcentre_desc: true
          }
        }
      },
      orderBy: {
        ouc_ounit_costcentre_id: "desc"
      }
    });
    const data = records.map((item, index) => {
      var _a, _b, _c, _d, _e;
      return {
        no: index + 1,
        "Costcentre ID": item.ouc_ounit_costcentre_id,
        "Fund": item.fty_fund_type || "",
        "Fund Desc": ((_a = item.fund_type) == null ? void 0 : _a.fty_fund_desc) || "",
        "Activity": item.at_activity_code || "",
        "Activity Description": ((_b = item.activity_type) == null ? void 0 : _b.at_activity_description_bm) || "",
        "PTJ": item.oun_code || "",
        "OU Code": item.oun_code || "",
        "PTJ Description": ((_c = item.organization_unit) == null ? void 0 : _c.oun_desc) || "",
        "OU Description": ((_d = item.organization_unit) == null ? void 0 : _d.oun_desc) || "",
        "Cost Center": item.ccr_costcentre || "",
        "Cost Center Description": ((_e = item.costcentre) == null ? void 0 : _e.ccr_costcentre_desc) || "",
        "Status": item.ouc_status === "1" || item.ouc_status === 1 ? "ACTIVE" : "INACTIVE",
        "Action": "",
        // Keep original data
        ouc_ounit_costcentre_id: item.ouc_ounit_costcentre_id,
        fty_fund_type: item.fty_fund_type,
        at_activity_code: item.at_activity_code,
        oun_code: item.oun_code,
        ccr_costcentre: item.ccr_costcentre,
        ouc_status: item.ouc_status
      };
    });
    return {
      statusCode: 200,
      message: "Cascade structure fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error in cascade-structure API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      data: [],
      error: error.stack 
    };
  }
});

const index_get$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$4
});

const index_post$4 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.fty_fund_type || !body.at_activity_code || !body.oun_code || !body.ccr_costcentre || !body.ouc_status) {
      return {
        statusCode: 400,
        message: "Missing required fields: Fund Type, Activity Code, PTJ Code, Cost Centre, and Status are required"
      };
    }
    const existing = await prisma$1.org_unit_costcentre.findFirst({
      where: {
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status
      }
    });
    if (existing) {
      return {
        statusCode: 409,
        message: "The data you selected already exists."
      };
    }
    const maxId = await prisma$1.org_unit_costcentre.findFirst({
      orderBy: { ouc_ounit_costcentre_id: "desc" },
      select: { ouc_ounit_costcentre_id: true }
    });
    const nextId = maxId ? maxId.ouc_ounit_costcentre_id + 1 : 1;
    const newRecord = await prisma$1.org_unit_costcentre.create({
      data: {
        ouc_ounit_costcentre_id: nextId,
        fty_fund_type: body.fty_fund_type,
        at_activity_code: body.at_activity_code,
        oun_code: body.oun_code,
        ccr_costcentre: body.ccr_costcentre,
        ouc_status: body.ouc_status === "ACTIVE" ? "1" : "0",
        createddate: /* @__PURE__ */ new Date()
      }
    });
    const fundType = await prisma$1.fund_type.findUnique({
      where: {
        fty_fund_type: body.fty_fund_type
      },
      select: {
        fty_basis: true
      }
    });
    if ((fundType == null ? void 0 : fundType.fty_basis) && (fundType.fty_basis.includes("CASH BASIS") || fundType.fty_basis.includes("PROJECT BASIS"))) {
      const projectNo = `${body.fty_fund_type}${body.at_activity_code}${body.ccr_costcentre}00000`;
      const maxCpId = await prisma$1.capital_project.findFirst({
        orderBy: { cpa_project_id: "desc" },
        select: { cpa_project_id: true }
      });
      const nextCpId = maxCpId ? maxCpId.cpa_project_id + 1 : 1;
      await prisma$1.capital_project.create({
        data: {
          cpa_project_id: nextCpId,
          cpa_project_no: projectNo,
          fty_fund_type: body.fty_fund_type,
          ccr_costcentre: body.ccr_costcentre,
          lat_activity_code: body.at_activity_code,
          oun_code: body.oun_code,
          so_code: "00000",
          cpa_project_status: "OPEN",
          createddate: /* @__PURE__ */ new Date()
        }
      });
    }
    return {
      statusCode: 200,
      message: "Cascade structure created successfully",
      data: {
        ouc_ounit_costcentre_id: newRecord.ouc_ounit_costcentre_id,
        fty_fund_type: newRecord.fty_fund_type,
        ouc_status: newRecord.ouc_status === "1" || newRecord.ouc_status === 1 ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error creating cascade structure:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 409,
        message: "The data you selected already exists.",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while creating cascade structure",
      error: error.message
    };
  }
});

const index_post$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$4
});

const _id__delete = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Cost centre ID is required"
      };
    }
    const hasDependencies = await prisma$1.org_unit_costcentre.findFirst({
      where: { ccr_costcentre: { not: null } }
    });
    await prisma$1.costcentre.delete({
      where: { ccr_costcentre_id: parseInt(id) }
    });
    return {
      statusCode: 200,
      message: "Cost centre deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting cost centre:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cost centre not found"
      };
    }
    if (error.code === "P2003") {
      return {
        statusCode: 400,
        message: "Cannot delete cost centre with existing dependencies"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__delete
});

const _id__get = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return {
        statusCode: 400,
        message: "Cost centre ID is required"
      };
    }
    const costCentre = await prisma$1.costcentre.findUnique({
      where: {
        ccr_costcentre_id: parseInt(id)
      }
    });
    if (!costCentre) {
      return {
        statusCode: 404,
        message: "Cost centre not found"
      };
    }
    let ounDesc = "";
    if (costCentre.oun_code) {
      const orgUnit = await prisma$1.organization_unit.findUnique({
        where: {
          oun_code: costCentre.oun_code
        },
        select: {
          oun_desc: true
        }
      });
      ounDesc = (orgUnit == null ? void 0 : orgUnit.oun_desc) || "";
    }
    return {
      statusCode: 200,
      message: "Cost centre fetched successfully",
      data: {
        ccr_costcentre_id: costCentre.ccr_costcentre_id,
        ccr_costcentre: costCentre.ccr_costcentre,
        ccr_costcentre_desc: costCentre.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: costCentre.ccr_costcentre_desc_eng || "",
        oun_code: costCentre.oun_code || "",
        oun_desc: ounDesc,
        ccr_address: costCentre.ccr_address || "",
        ccr_hostel_code: costCentre.ccr_hostel_code || "",
        ccr_status: costCentre.ccr_status === "1" || costCentre.ccr_status === 1 ? "ACTIVE" : "INACTIVE",
        ccr_flag_salary: costCentre.ccr_flag_salary || "N"
      }
    };
  } catch (error) {
    console.error("Error in cost-centre get by ID API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__get
});

const _id__put = defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);
    if (!id) {
      return {
        statusCode: 400,
        message: "Cost centre ID is required"
      };
    }
    if (!body.ccr_costcentre_desc || !body.oun_code) {
      return {
        statusCode: 400,
        message: "ccr_costcentre_desc and oun_code are required"
      };
    }
    const updated = await prisma$1.costcentre.update({
      where: { ccr_costcentre_id: parseInt(id) },
      data: {
        ccr_costcentre_desc: body.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: body.ccr_costcentre_desc_eng || null,
        oun_code: body.oun_code,
        ccr_address: body.ccr_address || null,
        ccr_hostel_code: body.ccr_hostel_code || null,
        ccr_status: body.ccr_status === "ACTIVE" ? "1" : "0",
        ccr_flag_salary: body.ccr_flag_salary || "N",
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Cost centre updated successfully",
      data: updated
    };
  } catch (error) {
    console.error("Error updating cost centre:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "Cost centre not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _id__put$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _id__put
});

const autosuggestCode_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search || "";
    let where = {};
    if (search) {
      where.OR = [
        { ccr_costcentre: { contains: search } },
        { ccr_costcentre_desc: { contains: search } }
      ];
    }
    const costCentres = await prisma$1.costcentre.findMany({
      where,
      select: {
        ccr_costcentre: true,
        ccr_costcentre_desc: true
      },
      take: 50,
      orderBy: {
        ccr_costcentre: "asc"
      }
    });
    const results = costCentres.map((cc) => ({
      id: cc.ccr_costcentre,
      text: `${cc.ccr_costcentre} - ${cc.ccr_costcentre_desc}`
    }));
    return {
      statusCode: 200,
      message: "Cost centres fetched successfully",
      results
    };
  } catch (error) {
    console.error("Error in autosuggest code API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      results: [],
      error: error.stack 
    };
  }
});

const autosuggestCode_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: autosuggestCode_get
});

const autosuggestPtj_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const search = query.search || "";
    let where = {};
    if (search) {
      where.OR = [
        { oun_code: { contains: search } },
        { oun_desc: { contains: search } }
      ];
    }
    const orgUnits = await prisma$1.organization_unit.findMany({
      where,
      select: {
        oun_code: true,
        oun_desc: true,
        oun_address: true
      },
      take: 50,
      orderBy: {
        oun_code: "asc"
      }
    });
    const results = orgUnits.map((ou) => ({
      id: ou.oun_code,
      text: `${ou.oun_code} - ${ou.oun_desc}`,
      _Desc: ou.oun_desc,
      _Add: ou.oun_address || ""
    }));
    return {
      statusCode: 200,
      message: "Organization units fetched successfully",
      results
    };
  } catch (error) {
    console.error("Error in autosuggest PTJ API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      results: [],
      error: error.stack 
    };
  }
});

const autosuggestPtj_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: autosuggestPtj_get
});

const index_get$2 = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    let where = {};
    if (query.search) {
      const searchTerm = query.search.trim();
      where.OR = [
        { ccr_costcentre: { contains: searchTerm } },
        { ccr_costcentre_desc: { contains: searchTerm } },
        { ccr_costcentre_desc_eng: { contains: searchTerm } },
        { oun_code: { contains: searchTerm } },
        { ccr_address: { contains: searchTerm } },
        { ccr_hostel_code: { contains: searchTerm } }
      ];
    }
    if (query.smartFilter_ccr_costcentre) {
      where.ccr_costcentre = query.smartFilter_ccr_costcentre;
    }
    if (query.smartFilter_PTJCodesm) {
      where.oun_code = query.smartFilter_PTJCodesm;
    }
    if (query.smartFilter_OUcodesm) {
      where.oun_code = query.smartFilter_OUcodesm;
    }
    if (query.smartFilter_statussm) {
      if (query.smartFilter_statussm === "ACTIVE") {
        where.ccr_status = "1";
      } else if (query.smartFilter_statussm === "INACTIVE") {
        where.ccr_status = { not: "1" };
      }
    }
    const costCentres = await prisma$1.costcentre.findMany({
      where,
      select: {
        ccr_costcentre_id: true,
        ccr_costcentre: true,
        ccr_costcentre_desc: true,
        ccr_costcentre_desc_eng: true,
        oun_code: true,
        ccr_address: true,
        ccr_hostel_code: true,
        ccr_status: true,
        ccr_flag_salary: true
      },
      orderBy: {
        ccr_costcentre: "asc"
      }
    });
    const ounCodes = [...new Set(costCentres.map((cc) => cc.oun_code).filter(Boolean))];
    const orgUnits = ounCodes.length > 0 ? await prisma$1.organization_unit.findMany({
      where: {
        oun_code: { in: ounCodes }
      },
      select: {
        oun_code: true,
        oun_desc: true
      }
    }) : [];
    const orgUnitMap = {};
    orgUnits.forEach((ou) => {
      orgUnitMap[ou.oun_code] = ou.oun_desc;
    });
    const data = costCentres.map((item, index) => ({
      no: index + 1,
      "Code": item.ccr_costcentre || "",
      "Description (Malay)": item.ccr_costcentre_desc || "",
      "Description (English)": item.ccr_costcentre_desc_eng || "",
      "PTJ": item.oun_code || "",
      "OU": item.oun_code || "",
      "PTJ Description": orgUnitMap[item.oun_code] || "",
      "OU Description": orgUnitMap[item.oun_code] || "",
      "Address": item.ccr_address || "",
      "Hostel Code": item.ccr_hostel_code || "",
      "Status": item.ccr_status === "1" || item.ccr_status === 1 ? "ACTIVE" : "INACTIVE",
      "Action": "",
      // Keep original data
      ccr_costcentre_id: item.ccr_costcentre_id,
      ccr_costcentre: item.ccr_costcentre,
      ccr_costcentre_desc: item.ccr_costcentre_desc,
      ccr_costcentre_desc_eng: item.ccr_costcentre_desc_eng,
      oun_code: item.oun_code,
      ccr_address: item.ccr_address,
      ccr_hostel_code: item.ccr_hostel_code,
      ccr_status: item.ccr_status,
      ccr_flag_salary: item.ccr_flag_salary,
      oun_desc: orgUnitMap[item.oun_code] || ""
    }));
    return {
      statusCode: 200,
      message: "Cost centres fetched successfully",
      data
    };
  } catch (error) {
    console.error("Error in cost-centre API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      data: [],
      error: error.stack 
    };
  }
});

const index_get$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get$2
});

const index_post$2 = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!body.ccr_costcentre || !body.ccr_costcentre_desc || !body.oun_code) {
      return {
        statusCode: 400,
        message: "Missing required fields: Cost Centre Code, Description (Malay), and PTJ are required"
      };
    }
    const lengthParam = await prisma$1.lookup_parameter_main.findFirst({
      where: {
        lpm_code: "FINAL_COSTCENTRE_LENGTH"
      },
      select: {
        lpm_value: true
      }
    });
    const requiredLength = (lengthParam == null ? void 0 : lengthParam.lpm_value) ? parseInt(lengthParam.lpm_value) : null;
    if (requiredLength && body.ccr_costcentre.length !== requiredLength) {
      return {
        statusCode: 400,
        message: `Please make sure you insert ${requiredLength} digit number to continue.`
      };
    }
    const existing = await prisma$1.costcentre.findUnique({
      where: {
        ccr_costcentre: body.ccr_costcentre
      }
    });
    if (existing) {
      return {
        statusCode: 409,
        message: `CostCentre Code for ${existing.ccr_costcentre} - ${existing.ccr_costcentre_desc} already exist. Please fill in another code.`
      };
    }
    const maxId = await prisma$1.costcentre.findFirst({
      orderBy: { ccr_costcentre_id: "desc" },
      select: { ccr_costcentre_id: true }
    });
    const nextId = maxId ? maxId.ccr_costcentre_id + 1 : 1;
    const newCostCentre = await prisma$1.costcentre.create({
      data: {
        ccr_costcentre_id: nextId,
        ccr_costcentre: body.ccr_costcentre,
        ccr_costcentre_desc: body.ccr_costcentre_desc,
        ccr_costcentre_desc_eng: body.ccr_costcentre_desc_eng || null,
        oun_code: body.oun_code,
        ccr_address: body.ccr_address || null,
        ccr_hostel_code: body.ccr_hostel_code || null,
        ccr_status: body.ccr_status === "ACTIVE" ? "1" : "0",
        ccr_flag_salary: body.ccr_flag_salary || "N",
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "Cost centre created successfully",
      data: {
        ccr_costcentre_id: newCostCentre.ccr_costcentre_id,
        ccr_costcentre: newCostCentre.ccr_costcentre,
        ccr_costcentre_desc: newCostCentre.ccr_costcentre_desc,
        ccr_status: newCostCentre.ccr_status === "1" || newCostCentre.ccr_status === 1 ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error creating cost centre:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 409,
        message: "Cost centre code already exists",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while creating cost centre",
      error: error.message
    };
  }
});

const index_post$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post$2
});

const _code__delete = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    if (!code) {
      return {
        statusCode: 400,
        message: "PTJ code is required"
      };
    }
    const hasChildren = await prisma$1.organization_unit.findFirst({
      where: { oun_code_parent: code }
    });
    if (hasChildren) {
      return {
        statusCode: 400,
        message: "Cannot delete PTJ code with existing child units"
      };
    }
    await prisma$1.organization_unit.delete({
      where: { oun_code: code }
    });
    return {
      statusCode: 200,
      message: "PTJ code deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting PTJ code:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "PTJ code not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__delete$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__delete
});

const _code__put = defineEventHandler(async (event) => {
  try {
    const code = getRouterParam(event, "code");
    const body = await readBody(event);
    if (!code) {
      return {
        statusCode: 400,
        message: "PTJ code is required"
      };
    }
    if (!body.oun_desc || !body.oun_status) {
      return {
        statusCode: 400,
        message: "oun_desc and oun_status are required"
      };
    }
    const updated = await prisma$1.organization_unit.update({
      where: { oun_code: code },
      data: {
        oun_desc: body.oun_desc,
        oun_desc_bi: body.oun_desc_bi || null,
        org_desc: body.org_desc || null,
        oun_address: body.oun_address || null,
        oun_state: body.oun_state || null,
        st_staff_id_head: body.st_staff_id_head || null,
        oun_tel_no: body.oun_tel_no || null,
        oun_fax_no: body.oun_fax_no || null,
        oun_status: body.oun_status === "ACTIVE" ? "1" : "0",
        st_staff_id_superior: body.st_staff_id_superior || null,
        tanggung_start_date: body.tanggung_start_date ? new Date(body.tanggung_start_date) : null,
        tanggung_end_date: body.tanggung_end_date ? new Date(body.tanggung_end_date) : null,
        oun_shortname: body.oun_shortname || null,
        oun_region: body.oun_region || null,
        cny_country_code: body.cny_country_code || null,
        updateddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: "PTJ code updated successfully",
      data: updated
    };
  } catch (error) {
    console.error("Error updating PTJ code:", error);
    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "PTJ code not found"
      };
    }
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      error: error.stack 
    };
  }
});

const _code__put$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _code__put
});

const index_get = defineEventHandler(async (event) => {
  try {
    const query = getQuery$1(event);
    const level = query.level ? parseInt(query.level) : null;
    let where = {};
    let data = [];
    if (level === 1 || level === null && !query.oun_code_parent) {
      where.oun_level = 1;
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } }
        ];
      }
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === "ACTIVE") {
          where.oun_status = "1";
        } else if (query.smartFilter_oun_status === "INACTIVE") {
          where.oun_status = { not: "1" };
        }
      }
      const units = await prisma$1.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true
        },
        orderBy: {
          oun_code: "asc"
        }
      });
      const countryCodes = [...new Set(units.map((u) => u.cny_country_code).filter(Boolean))];
      const countries = await prisma$1.country.findMany({
        where: {
          cny_country_code: { in: countryCodes }
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true
        }
      });
      const countryMap = {};
      countries.forEach((c) => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });
      data = units.map((item, index) => ({
        no: index + 1,
        "PTJ Code": item.oun_code || "",
        "PTJ Desc (Malay)": item.oun_desc || "",
        "Country": countryMap[item.cny_country_code] || "",
        "Status": item.oun_status === "1" ? "ACTIVE" : "INACTIVE",
        "Action": "",
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code
      }));
      return {
        statusCode: 200,
        message: "PTJ Code Level 1 fetched successfully",
        data
      };
    }
    if (level === 2) {
      if (!query.oun_code_parent) {
        return {
          statusCode: 400,
          message: "oun_code_parent is required for level 2",
          data: []
        };
      }
      where.oun_level = 2;
      where.oun_code_parent = query.oun_code_parent;
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } }
        ];
      }
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === "ACTIVE") {
          where.oun_status = "1";
        } else if (query.smartFilter_oun_status === "INACTIVE") {
          where.oun_status = { not: "1" };
        }
      }
      const units = await prisma$1.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true
        },
        orderBy: {
          oun_code: "asc"
        }
      });
      const countryCodes = [...new Set(units.map((u) => u.cny_country_code).filter(Boolean))];
      const countries = countryCodes.length > 0 ? await prisma$1.country.findMany({
        where: {
          cny_country_code: { in: countryCodes }
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true
        }
      }) : [];
      const countryMap = {};
      countries.forEach((c) => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });
      data = units.map((item, index) => ({
        no: index + 1,
        "PTJ Code": item.oun_code || "",
        "PTJ Desc (Malay)": item.oun_desc || "",
        "Code Parent": item.oun_code_parent || "",
        "Country": countryMap[item.cny_country_code] || "",
        "Status": item.oun_status === "1" ? "ACTIVE" : "INACTIVE",
        "Action": "",
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code
      }));
      return {
        statusCode: 200,
        message: "PTJ Code Level 2 fetched successfully",
        data
      };
    }
    if (level === 3) {
      if (!query.oun_code_parent) {
        return {
          statusCode: 400,
          message: "oun_code_parent is required for level 3",
          data: []
        };
      }
      where.oun_level = 3;
      where.oun_code_parent = query.oun_code_parent;
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } }
        ];
      }
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === "ACTIVE") {
          where.oun_status = "1";
        } else if (query.smartFilter_oun_status === "INACTIVE") {
          where.oun_status = { not: "1" };
        }
      }
      const units = await prisma$1.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true
        },
        orderBy: {
          oun_code: "asc"
        }
      });
      const countryCodes = [...new Set(units.map((u) => u.cny_country_code).filter(Boolean))];
      const regionCodes = [...new Set(units.map((u) => u.oun_region).filter(Boolean))];
      const countries = countryCodes.length > 0 ? await prisma$1.country.findMany({
        where: {
          cny_country_code: { in: countryCodes }
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true
        }
      }) : [];
      const regions = regionCodes.length > 0 ? await prisma$1.lkp_region.findMany({
        where: {
          lrg_region: { in: regionCodes }
        },
        select: {
          lrg_region: true,
          lrg_region_desc: true
        }
      }) : [];
      const countryMap = {};
      countries.forEach((c) => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });
      const regionMap = {};
      regions.forEach((r) => {
        regionMap[r.lrg_region] = r.lrg_region_desc;
      });
      data = units.map((item, index) => ({
        no: index + 1,
        "PTJ Code": item.oun_code || "",
        "PTJ Desc (Malay)": item.oun_desc || "",
        "Code Parent": item.oun_code_parent || "",
        "Region": regionMap[item.oun_region] || "",
        "Country": countryMap[item.cny_country_code] || "",
        "Status": item.oun_status === "1" ? "ACTIVE" : "INACTIVE",
        "Action": "",
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code
      }));
      return {
        statusCode: 200,
        message: "PTJ Code Level 3 fetched successfully",
        data
      };
    }
    if (level === 4) {
      if (!query.oun_code_parent) {
        return {
          statusCode: 400,
          message: "oun_code_parent is required for level 4",
          data: []
        };
      }
      where.oun_level = 4;
      where.oun_code_parent = query.oun_code_parent;
      if (query.search) {
        const searchTerm = query.search.trim();
        where.OR = [
          { oun_code: { contains: searchTerm } },
          { oun_desc: { contains: searchTerm } },
          { oun_desc_bi: { contains: searchTerm } }
        ];
      }
      if (query.smartFilter_oun_status) {
        if (query.smartFilter_oun_status === "ACTIVE") {
          where.oun_status = "1";
        } else if (query.smartFilter_oun_status === "INACTIVE") {
          where.oun_status = { not: "1" };
        }
      }
      const units = await prisma$1.organization_unit.findMany({
        where,
        select: {
          oun_id: true,
          oun_code: true,
          oun_desc: true,
          oun_desc_bi: true,
          org_code: true,
          org_desc: true,
          oun_address: true,
          oun_state: true,
          st_staff_id_head: true,
          oun_tel_no: true,
          oun_fax_no: true,
          oun_code_parent: true,
          oun_level: true,
          oun_status: true,
          st_staff_id_superior: true,
          tanggung_start_date: true,
          tanggung_end_date: true,
          oun_shortname: true,
          oun_region: true,
          cny_country_code: true
        },
        orderBy: {
          oun_code: "asc"
        }
      });
      const countryCodes = [...new Set(units.map((u) => u.cny_country_code).filter(Boolean))];
      const regionCodes = [...new Set(units.map((u) => u.oun_region).filter(Boolean))];
      const countries = countryCodes.length > 0 ? await prisma$1.country.findMany({
        where: {
          cny_country_code: { in: countryCodes }
        },
        select: {
          cny_country_code: true,
          cny_country_desc: true
        }
      }) : [];
      const regions = regionCodes.length > 0 ? await prisma$1.lkp_region.findMany({
        where: {
          lrg_region: { in: regionCodes }
        },
        select: {
          lrg_region: true,
          lrg_region_desc: true
        }
      }) : [];
      const countryMap = {};
      countries.forEach((c) => {
        countryMap[c.cny_country_code] = c.cny_country_desc;
      });
      const regionMap = {};
      regions.forEach((r) => {
        regionMap[r.lrg_region] = r.lrg_region_desc;
      });
      data = units.map((item, index) => ({
        no: index + 1,
        "PTJ Code": item.oun_code || "",
        "PTJ Desc (Malay)": item.oun_desc || "",
        "Code Parent": item.oun_code_parent || "",
        "Region": regionMap[item.oun_region] || "",
        "Country": countryMap[item.cny_country_code] || "",
        "Status": item.oun_status === "1" ? "ACTIVE" : "INACTIVE",
        "Action": "",
        // Keep original data
        oun_id: item.oun_id,
        oun_code: item.oun_code,
        oun_desc: item.oun_desc,
        oun_desc_bi: item.oun_desc_bi,
        org_code: item.org_code,
        org_desc: item.org_desc,
        oun_address: item.oun_address,
        oun_state: item.oun_state,
        st_staff_id_head: item.st_staff_id_head,
        oun_tel_no: item.oun_tel_no,
        oun_fax_no: item.oun_fax_no,
        oun_code_parent: item.oun_code_parent,
        oun_level: item.oun_level,
        oun_status: item.oun_status,
        st_staff_id_superior: item.st_staff_id_superior,
        tanggung_start_date: item.tanggung_start_date,
        tanggung_end_date: item.tanggung_end_date,
        oun_shortname: item.oun_shortname,
        oun_region: item.oun_region,
        cny_country_code: item.cny_country_code
      }));
      return {
        statusCode: 200,
        message: "PTJ Code Level 4 fetched successfully",
        data
      };
    }
    return {
      statusCode: 400,
      message: "Invalid level parameter",
      data: []
    };
  } catch (error) {
    console.error("Error in ptj-code API:", error);
    return {
      statusCode: 500,
      message: error.message || "Internal server error",
      data: [],
      error: error.stack 
    };
  }
});

const index_get$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_get
});

const index_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const query = getQuery$1(event);
    const level = query.level || body.oun_level ? parseInt(body.oun_level) : null;
    if (level === null || level < 1 || level > 4) {
      return {
        statusCode: 400,
        message: "Please specify a valid level (1-4)"
      };
    }
    if (!body.oun_code || !body.oun_desc || !body.oun_status || !body.org_code) {
      return {
        statusCode: 400,
        message: "Missing required fields: oun_code, oun_desc, oun_status, and org_code are required"
      };
    }
    const existing = await prisma$1.organization_unit.findUnique({
      where: {
        oun_code: body.oun_code
      }
    });
    if (existing) {
      return {
        statusCode: 409,
        message: "PTJ code already exists"
      };
    }
    if (level > 1 && body.oun_code_parent) {
      const parent = await prisma$1.organization_unit.findUnique({
        where: {
          oun_code: body.oun_code_parent
        }
      });
      if (!parent) {
        return {
          statusCode: 404,
          message: "Parent PTJ code not found"
        };
      }
    }
    const maxId = await prisma$1.organization_unit.findFirst({
      orderBy: { oun_id: "desc" },
      select: { oun_id: true }
    });
    const nextId = maxId ? maxId.oun_id + 1 : 1;
    const newUnit = await prisma$1.organization_unit.create({
      data: {
        oun_id: nextId,
        oun_code: body.oun_code,
        oun_desc: body.oun_desc,
        oun_desc_bi: body.oun_desc_bi || null,
        org_code: body.org_code,
        org_desc: body.org_desc || null,
        oun_address: body.oun_address || null,
        oun_state: body.oun_state || null,
        st_staff_id_head: body.st_staff_id_head || null,
        oun_tel_no: body.oun_tel_no || null,
        oun_fax_no: body.oun_fax_no || null,
        oun_code_parent: body.oun_code_parent || null,
        oun_level: level,
        oun_status: body.oun_status === "ACTIVE" ? "1" : "0",
        st_staff_id_superior: body.st_staff_id_superior || null,
        tanggung_start_date: body.tanggung_start_date ? new Date(body.tanggung_start_date) : null,
        tanggung_end_date: body.tanggung_end_date ? new Date(body.tanggung_end_date) : null,
        oun_shortname: body.oun_shortname || null,
        oun_region: body.oun_region || null,
        cny_country_code: body.cny_country_code || null,
        createddate: /* @__PURE__ */ new Date()
      }
    });
    return {
      statusCode: 200,
      message: `PTJ Code level ${level} created successfully`,
      data: {
        oun_id: newUnit.oun_id,
        oun_code: newUnit.oun_code,
        oun_desc: newUnit.oun_desc,
        oun_status: newUnit.oun_status === "1" || newUnit.oun_status === 1 ? "ACTIVE" : "INACTIVE"
      }
    };
  } catch (error) {
    console.error("Error creating PTJ code:", error);
    if (error.code === "P2002") {
      return {
        statusCode: 409,
        message: "PTJ code already exists",
        error: error.message
      };
    }
    return {
      statusCode: 500,
      message: "An error occurred while creating PTJ code",
      error: error.message
    };
  }
});

const index_post$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: index_post
});

const appRootId = "__nuxt";

const appRootTag = "div";

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const getClientManifest = () => import('file://C:/KerisiAI/kerisi/.nuxt/dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getStaticRenderedHead = () => Promise.resolve().then(function () { return _virtual__headStatic$1; }).then((r) => r.default || r);
const getServerEntry = () => import('file://C:/KerisiAI/kerisi/.nuxt/dist/server/server.mjs').then((r) => r.default || r);
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return `<${appRootTag} id="${appRootId}">${html}</${appRootTag}>`;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "");
  const options = {
    manifest,
    renderToString: () => `<${appRootTag} id="${appRootId}">${spaTemplate}</${appRootTag}>`,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig();
    ssrContext.modules = ssrContext.modules || /* @__PURE__ */ new Set();
    ssrContext.payload = {
      _errors: {},
      serverRendered: false,
      data: {},
      state: {}
    };
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    ssrContext.renderMeta = ssrContext.renderMeta ?? getStaticRenderedHead;
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
const PAYLOAD_URL_RE = /\/_payload(\.[a-zA-Z0-9]+)?.json(\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.node.req.url?.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && ssrError.statusCode) {
    ssrError.statusCode = parseInt(ssrError.statusCode);
  }
  if (ssrError && event.node.req.socket.readyState !== "readOnly") {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const islandContext = void 0;
  let url = ssrError?.url || islandContext?.url || event.node.req.url;
  const isRenderingPayload = PAYLOAD_URL_RE.test(url) && !islandContext;
  if (isRenderingPayload) {
    url = url.substring(0, url.lastIndexOf("/")) || "/";
    event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  const ssrContext = {
    url,
    event,
    runtimeConfig: useRuntimeConfig(),
    noSSR: event.context.nuxt?.noSSR || routeOptions.ssr === false || (false),
    error: !!ssrError,
    nuxt: void 0,
    /* NuxtApp */
    payload: ssrError ? { error: ssrError } : {},
    _payloadReducers: {},
    islandContext
  };
  const renderer = ssrContext.noSSR ? await getSPARenderer() : await getSSRRenderer();
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response2 = renderPayloadResponse(ssrContext);
    return response2;
  }
  const renderedMeta = await ssrContext.renderMeta?.() ?? {};
  const inlinedStyles = Boolean(islandContext) ? await renderInlineStyles(ssrContext.modules ?? ssrContext._registeredComponents ?? []) : "";
  const NO_SCRIPTS = routeOptions.experimentalNoScripts;
  const htmlContext = {
    island: Boolean(islandContext),
    htmlAttrs: normalizeChunks([renderedMeta.htmlAttrs]),
    head: normalizeChunks([
      renderedMeta.headTags,
      null ,
      NO_SCRIPTS ? null : _rendered.renderResourceHints(),
      _rendered.renderStyles(),
      inlinedStyles,
      ssrContext.styles
    ]),
    bodyAttrs: normalizeChunks([renderedMeta.bodyAttrs]),
    bodyPrepend: normalizeChunks([
      renderedMeta.bodyScriptsPrepend,
      ssrContext.teleports?.body
    ]),
    body: [_rendered.html],
    bodyAppend: normalizeChunks([
      NO_SCRIPTS ? void 0 : renderPayloadJsonScript({ id: "__NUXT_DATA__", ssrContext, data: ssrContext.payload }) ,
      routeOptions.experimentalNoScripts ? void 0 : _rendered.renderScripts(),
      // Note: bodyScripts may contain tags other than <script>
      renderedMeta.bodyScripts
    ])
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  const response = {
    body: renderHTMLDocument(htmlContext),
    statusCode: event.node.res.statusCode,
    statusMessage: event.node.res.statusMessage,
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
  return response;
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  return chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html>
<html ${joinAttrs(html.htmlAttrs)}>
<head>${joinTags(html.head)}</head>
<body ${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>
</html>`;
}
async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(`<style>${style}</style>`);
      }
    }
  }
  return Array.from(inlinedStyles).join("");
}
function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: ssrContext.event.node.res.statusCode,
    statusMessage: ssrContext.event.node.res.statusMessage,
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const attrs = [
    'type="application/json"',
    `id="${opts.id}"`,
    `data-ssr="${!(opts.ssrContext.noSSR)}"`,
    opts.src ? `data-src="${opts.src}"` : ""
  ].filter(Boolean);
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  return `<script ${attrs.join(" ")}>${contents}<\/script><script>window.__NUXT__={};window.__NUXT__.config=${uneval(opts.ssrContext.config)}<\/script>`;
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const renderer$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: renderer
});

const _virtual__headStatic = {"headTags":"<meta charset=\"utf-8\">\n<title>corradAF - corradAF</title>\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<meta name=\"description\" content=\"corradAF Admin Portal\">\n<meta name=\"apple-mobile-web-app-title\" content=\"corradAF\">\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css\">","bodyTags":"","bodyTagsOpen":"","htmlAttrs":"","bodyAttrs":""};

const _virtual__headStatic$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: _virtual__headStatic
});

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  default: styles
});

const template = "<svg class=\"nuxt-spa-loading\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 37 25\" fill=\"none\" width=\"80\"><path d=\"M24.236 22.006h10.742L25.563 5.822l-8.979 14.31a4 4 0 0 1-3.388 1.874H2.978l11.631-20 5.897 10.567\"/></svg><style>.nuxt-spa-loading {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.nuxt-spa-loading>path {\n  fill: none;\n  stroke: #00DC82;\n  stroke-width: 4px;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n  stroke-dasharray: 128;\n  stroke-dashoffset: 128;\n  animation: nuxt-spa-loading-move 3s linear infinite;\n}\n@keyframes nuxt-spa-loading-move {\n  100% {\n    stroke-dashoffset: -128;\n  }\n}</style>";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: template
});
//# sourceMappingURL=index.mjs.map
