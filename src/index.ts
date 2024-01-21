import { constructFormData, DEFAULT_USER_AGENT, getBda } from './utils'

export interface GetTokenOptions {
  pkey: string
  surl: string
  data?: { [key: string]: string }
  headers?: { [key: string]: string }
  site?: string
  location?: string
  language?: string
}

export interface GetTokenResult {
  challenge_url: string
  challenge_url_cdn: string
  challenge_url_cdn_sri: string
  disable_default_styling: boolean | null
  iframe_height: number | null
  iframe_width: number | null
  // Enable keyboard biometrics
  kbio: boolean
  // Enable mouse biometrics
  mbio: boolean
  noscript: string
  // Enable touch biometrics
  tbio: boolean
  // The token for the funcaptcha. Can be used 10 times before having to get a new token.
  token: string
}

export async function getToken(
  options: GetTokenOptions,
): Promise<GetTokenResult> {
  options = {
    headers: {},
    data: {},
    ...options,
  }

  options.headers['Sec-Fetch-Site'] = 'same-origin'
  options.headers['Accept'] = '*/*'
  options.headers['Content-Type'] =
    'application/x-www-form-urlencoded; charset=UTF-8'
  options.headers['sec-fetch-mode'] = 'cors'

  if (options.site) {
    options.headers['Origin'] = options.surl
    options.headers['Referer'] =
      `${options.surl}/v2/${options.pkey}/1.5.5/enforcement.fbfc14b0d793c6ef8359e0e4b4a91f67.html`
  }

  const ua = DEFAULT_USER_AGENT

  const res = await fetch(options.surl + '/fc/gt2/public_key/' + options.pkey, {
    method: 'POST',
    headers: options.headers,
    body: constructFormData({
      bda: getBda(ua, options),
      public_key: options.pkey,
      site: options.site ? new URL(options.site).origin : undefined,
      userbrowser: ua,
      capi_version: '1.5.5',
      capi_mode: 'inline',
      style_theme: 'default',
      rnd: Math.random().toString(),
      ...Object.fromEntries(
        Object.keys(options.data!).map((v) => [
          'data[' + v + ']',
          options.data![v],
        ]),
      ),
      language: options.language || 'en',
    }),
  })

  const data = await res.json()
  return data
}
