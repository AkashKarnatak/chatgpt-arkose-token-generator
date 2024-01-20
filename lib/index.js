"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const utils_1 = require("./utils");
async function getToken(options) {
    options = {
        data: {},
        ...options,
    };
    if (!options.headers)
        options.headers = { 'User-Agent': utils_1.DEFAULT_USER_AGENT };
    else if (!Object.keys(options.headers)
        .map((v) => v.toLowerCase())
        .includes('user-agent'))
        options.headers['User-Agent'] = utils_1.DEFAULT_USER_AGENT;
    options.headers['Accept-Language'] = 'en-US,en;q=0.9';
    options.headers['Sec-Fetch-Site'] = 'same-origin';
    options.headers['Accept'] = '*/*';
    options.headers['Content-Type'] =
        'application/x-www-form-urlencoded; charset=UTF-8';
    options.headers['sec-fetch-mode'] = 'cors';
    if (options.site) {
        options.headers['Origin'] = options.surl;
        options.headers['Referer'] =
            `${options.surl}/v2/${options.pkey}/1.5.5/enforcement.fbfc14b0d793c6ef8359e0e4b4a91f67.html`;
    }
    const ua = options.headers[Object.keys(options.headers).find((v) => v.toLowerCase() == 'user-agent')];
    const body = {
        bda: (0, utils_1.getBda)(ua, options),
        public_key: options.pkey,
        site: options.site ? new URL(options.site).origin : undefined,
        userbrowser: ua,
        capi_version: '1.5.5',
        capi_mode: 'inline',
        style_theme: 'default',
        rnd: Math.random().toString(),
        ...Object.fromEntries(Object.keys(options.data).map((v) => [
            'data[' + v + ']',
            options.data[v],
        ])),
        language: options.language || 'en',
    };
    const res = await fetch(options.surl + '/fc/gt2/public_key/' + options.pkey, {
        method: 'POST',
        headers: options.headers,
        body: (0, utils_1.constructFormData)({
            bda: (0, utils_1.getBda)(ua, options),
            public_key: options.pkey,
            site: options.site ? new URL(options.site).origin : undefined,
            userbrowser: ua,
            capi_version: '1.5.5',
            capi_mode: 'inline',
            style_theme: 'default',
            rnd: Math.random().toString(),
            ...Object.fromEntries(Object.keys(options.data).map((v) => [
                'data[' + v + ']',
                options.data[v],
            ])),
            language: options.language || 'en',
        }),
    });
    const data = await res.json();
    return data;
}
exports.getToken = getToken;
