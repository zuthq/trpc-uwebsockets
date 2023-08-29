"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUWebSocketsHandler = exports.handler = void 0;
const requestHandler_1 = require("./requestHandler");
__exportStar(require("./types"), exports);
const handler = (prefix, opts) => (res, req) => {
    const prefixTrimLength = prefix.length + 1; // remove /* from url
    const method = req.getMethod().toUpperCase();
    const url = req.getUrl().substring(prefixTrimLength);
    const query = req.getQuery();
    const headers = {};
    req.forEach((key, value) => {
        // TODO handle headers with the same key, potential issue
        headers[key] = value;
    });
    // new request object needs to be created, because socket
    // can only be accessed synchronously, after await it cannot be accessed
    const wrappedReq = {
        headers,
        method,
        query,
        url,
    };
    (0, requestHandler_1.uWsHTTPRequestHandler)({
        req: wrappedReq,
        uRes: res,
        path: url,
        ...opts,
    });
};
exports.handler = handler;
/**
 * @param uWsApp uWebsockets server instance
 * @param prefix The path to trpc without trailing slash (ex: "/trpc")
 * @param opts handler options
 */
function createUWebSocketsHandler(uWsApp, prefix, opts) {
    uWsApp.get(prefix + '/*', (0, exports.handler)(prefix, opts));
    uWsApp.post(prefix + '/*', (0, exports.handler)(prefix, opts));
}
exports.createUWebSocketsHandler = createUWebSocketsHandler;
//# sourceMappingURL=index.js.map