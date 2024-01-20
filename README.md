# chatgpt-arkose-token-generator
arkose_token generator for making ChatGPT 4 protected API calls 

## Usage And Documentation
Require the library like any other
```js
  const token = await getToken({
    pkey: '35536E1E-65B4-4D96-9D97-6ADB7EFF8147',
    surl: 'https://tcr9i.chat.openai.com',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    },
    site: 'https://chat.openai.com'
  })
  console.log(token)
```
