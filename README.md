# chatgpt-arkose-token-generator
arkose_token generator for making ChatGPT 4 protected API calls 

## Usage And Documentation
Require the library like any other
```js
  const token = await getToken({
    pkey: '3D86FBBA-9D22-402A-B512-3420086BA6CC',
    surl: 'https://tcr9i.chat.openai.com',
    site: 'https://chat.openai.com'
  })
  console.log(token)
```
