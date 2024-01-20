import murmur from './murmur'
import crypt from './crypt'
import fingerprint from './fingerprint'
export const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'

function random(): string {
  return Array(32)
    .fill(0)
    .map(() => '0123456789abcdef'[Math.floor(Math.random() * 16)])
    .join('')
}

export function getBda(userAgent: string, opts: object): string {
  let fp = fingerprint.getFingerprint()
  let fe = fingerprint.prepareFe(fp)

  let bda = [
    { key: 'api_type', value: 'js' },
    { key: 'p', value: 1 },
    { key: 'f', value: murmur(fingerprint.prepareF(fingerprint), 31) },
    {
      key: 'n',
      value: Buffer.from(
        Math.round(Date.now() / (1000 - 0)).toString(),
      ).toString('base64'),
    },
    { key: 'wh', value: `${random()}|${random()}` },
    {
      key: 'enhanced_fp',
      value: fingerprint.getEnhancedFingerprint(fp, userAgent, opts),
    },
    { key: 'fe', value: fe },
    { key: 'ife_hash', value: murmur(fe.join(', '), 38) },
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
  ]

  let time = new Date().getTime() / 1000
  let key = userAgent + Math.round(time - (time % 21600))

  let s = JSON.stringify(bda)
  let encrypted = crypt.encrypt(s, key)
  return Buffer.from(encrypted).toString('base64')
}

export function constructFormData(data: {}): string {
  return Object.keys(data)
    .filter((v) => data[v] !== undefined)
    .map((k) => `${k}=${encodeURIComponent(data[k])}`)
    .join('&')
}
