"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructFormData = exports.getBda = exports.DEFAULT_USER_AGENT = void 0;
const murmur_1 = require("./murmur");
const crypt_1 = require("./crypt");
const fingerprint_1 = require("./fingerprint");
exports.DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36';
function random() {
    return Array(32)
        .fill(0)
        .map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)])
        .join('');
}
function getBda(userAgent, opts) {
    let fp = fingerprint_1.default.getFingerprint();
    let fe = fingerprint_1.default.prepareFe(fp);
    let bda = [
        { key: 'api_type', value: 'js' },
        { key: 'p', value: 1 },
        { key: 'f', value: (0, murmur_1.default)(fingerprint_1.default.prepareF(fingerprint_1.default), 31) },
        {
            key: 'n',
            value: Buffer.from(Math.round(Date.now() / (1000 - 0)).toString()).toString('base64'),
        },
        { key: 'wh', value: `${random()}|${random()}` },
        {
            key: 'enhanced_fp',
            value: fingerprint_1.default.getEnhancedFingerprint(fp, userAgent, opts),
        },
        { key: 'fe', value: fe },
        { key: 'ife_hash', value: (0, murmur_1.default)(fe.join(', '), 38) },
        { key: 'cs', value: 1 },
        {
            key: 'jsbd',
            value: JSON.stringify({
                HL: 4,
                DT: '',
                NWD: 'false',
                DOTO: 1,
                DMTO: 1,
            }),
        },
    ];
    let time = new Date().getTime() / 1000;
    let key = userAgent + Math.round(time - (time % 21600));
    let s = JSON.stringify(bda);
    let encrypted = crypt_1.default.encrypt(s, key);
    return Buffer.from(encrypted).toString('base64');
}
exports.getBda = getBda;
function constructFormData(data) {
    return Object.keys(data)
        .filter((v) => data[v] !== undefined)
        .map((k) => `${k}=${encodeURIComponent(data[k])}`)
        .join('&');
}
exports.constructFormData = constructFormData;
