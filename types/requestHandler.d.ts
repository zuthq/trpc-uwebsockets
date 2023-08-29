import { AnyRouter } from '@trpc/server';
import { uHTTPRequestHandlerOptions } from './types';
export declare function uWsHTTPRequestHandler<TRouter extends AnyRouter>(opts: uHTTPRequestHandlerOptions<TRouter>): Promise<void>;
