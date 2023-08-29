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
    //allow cors
    res
        .writeHeader('Access-Control-Allow-Origin', '*')
        .writeHeader('Content-Security-Policy', // mitigates cross-site scripting
    "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests")
        .writeHeader('Cross-Origin-Opener-Policy', // helps process-isolate your page
    'same-origin')
        .writeHeader('Cross-Origin-Resource-Policy', // blocks others from loading your resources cross-origin in some cases
    'same-origin')
        .writeHeader('Origin-Agent-Cluster', // provides a mechanism to allow web applications to isolate their origins from other processes
    '?1')
        .writeHeader('Referrer-Policy', // controls what information is set in the Referer request header
    'no-referrer')
        .writeHeader('X-Content-Type-Options', // mitigates MIME type sniffing
    'nosniff')
        .writeHeader('X-DNS-Prefetch-Control', // helps control DNS prefetching, which can improve user privacy at the expense of performance
    'off')
        .writeHeader('X-Download-Options', // specific to Internet Explorer 8. It forces potentially-unsafe downloads to be saved, mitigating execution of HTML in your site’s context
    'noopen')
        .writeHeader('X-Frame-Options', // mitigate clickjacking attacks. for old browsers where CSP not available
    'SAMEORIGIN')
        .writeHeader('X-Permitted-Cross-Domain-Policies', //  tells some clients (mostly Adobe products) your domain’s policy for loading cross-domain content
    'none')
        .writeHeader('X-XSS-Protection', // disables browsers’ buggy cross-site scripting filter
    '0');
    res.end(payload);
}
exports.sendResponse = sendResponse;
//# sourceMappingURL=utils.js.map