"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = exports.getPostBody = void 0;
const server_1 = require("@trpc/server");
function getPostBody(method, res, maxBodySize) {
    return new Promise((resolve) => {
        if (method == 'GET') {
            // no body in get request
            resolve({
                ok: true,
                data: undefined,
            });
        }
        let buffer;
        res.onData((ab, isLast) => {
            //resolve right away if there is only one chunk
            if (buffer === undefined && isLast) {
                resolve({
                    ok: true,
                    data: Buffer.from(ab).toString(),
                });
                return;
            }
            const chunk = Buffer.from(ab);
            if (maxBodySize && buffer.length >= maxBodySize) {
                resolve({
                    ok: false,
                    error: new server_1.TRPCError({ code: 'PAYLOAD_TOO_LARGE' }),
                });
            }
            if (buffer)
                //else accumulate
                buffer = Buffer.concat([buffer, chunk]);
            else
                buffer = Buffer.concat([chunk]);
            if (isLast) {
                resolve({
                    ok: true,
                    data: buffer.toString(),
                });
            }
        });
        res.onAborted(() => {
            resolve({
                ok: false,
                error: new server_1.TRPCError({ code: 'CLIENT_CLOSED_REQUEST' }),
            });
        });
    });
}
exports.getPostBody = getPostBody;
// FIXME buffer the output with tryEnd instead
// https://github.com/uNetworking/uWebSockets.js/blob/master/examples/VideoStreamer.js
function sendResponse(res, payload) {
    res.end(payload);
}
exports.sendResponse = sendResponse;
//# sourceMappingURL=utils.js.map