import { AnyRouter } from '@trpc/server';
import type { HttpRequest, HttpResponse, TemplatedApp } from 'uWebSockets.js';
import { uHTTPHandlerOptions } from './types';
export * from './types';
export declare const handler: <TRouter extends AnyRouter>(prefix: string, opts: uHTTPHandlerOptions<TRouter>) => (res: HttpResponse, req: HttpRequest) => void;
/**
 * @param uWsApp uWebsockets server instance
 * @param prefix The path to trpc without trailing slash (ex: "/trpc")
 * @param opts handler options
 */
export declare function createUWebSocketsHandler<TRouter extends AnyRouter>(uWsApp: TemplatedApp, prefix: string, opts: uHTTPHandlerOptions<TRouter>): void;
