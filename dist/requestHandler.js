"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uWsHTTPRequestHandler = void 0;
const server_1 = require("@trpc/server");
const utils_1 = require("./utils");
async function uWsHTTPRequestHandler(opts) {
    const resOverride = {
        headers: [],
        status: 0,
    };
    const wrappedRes = {
        setStatus: (status) => {
            resOverride.status = status;
        },
        setHeader: (name, value) => {
            resOverride.headers.push({ name, value });
            // resOverride.headers.set(key, value);
        },
    };
    const createContext = async function _createContext() {
        return await opts.createContext?.({
            req: opts.req,
            res: wrappedRes,
        });
    };
    const { path, router, uRes, req } = opts;
    let aborted = false;
    uRes.onAborted(() => {
        // console.log('request was aborted');
        aborted = true;
    });
    const bodyResult = await (0, utils_1.getPostBody)(req.method, uRes, opts.maxBodySize);
    const query = new URLSearchParams(opts.req.query);
    const requestObj = {
        method: opts.req.method,
        headers: opts.req.headers,
        query,
        body: bodyResult.ok ? bodyResult.data : undefined,
    };
    const result = await (0, server_1.resolveHTTPResponse)({
        batching: opts.batching,
        responseMeta: opts.responseMeta,
        path,
        createContext,
        router,
        req: requestObj,
        error: bodyResult.ok ? null : bodyResult.error,
        onError(o) {
            opts?.onError?.({
                ...o,
                req: opts.req,
            });
        },
    });
    if (aborted) {
        // TODO check this behavior
        return;
    }
    uRes.cork(() => {
        // if ('status' in result && (!res.statusCode || res.statusCode === 200)) {
        if (resOverride.status > 0) {
            uRes.writeStatus(resOverride.status.toString()); // TODO convert code to actual message
        }
        if ('status' in result) {
            uRes.writeStatus(result.status.toString());
        }
        //send our manual headers
        resOverride.headers.forEach((h) => {
            uRes.writeHeader(h.name, h.value);
        });
        for (const [key, value] of Object.entries(result.headers ?? {})) {
            if (typeof value === 'undefined') {
                continue;
            }
            if (Array.isArray(value))
                value.forEach((v) => {
                    uRes.writeHeader(key, v);
                });
            else
                uRes.writeHeader(key, value);
        }
        (0, utils_1.sendResponse)(uRes, result.body);
    });
}
exports.uWsHTTPRequestHandler = uWsHTTPRequestHandler;
//# sourceMappingURL=requestHandler.js.map