import { HttpResponse } from 'uWebSockets.js';
import { WrappedHTTPRequest, WrappedHTTPResponse } from './types';
import { AnyRouter, TRPCError } from '@trpc/server';
export declare function getPostBody<TRouter extends AnyRouter, TRequest extends WrappedHTTPRequest, TResponse extends WrappedHTTPResponse>(method: any, res: HttpResponse, maxBodySize?: number): Promise<{
    ok: true;
    data: unknown;
} | {
    ok: false;
    error: TRPCError;
}>;
export declare function sendResponse(res: HttpResponse, payload?: string): void;
