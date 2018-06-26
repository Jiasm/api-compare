const Comparator = require('../')

async function main() {
  let c = new Comparator()
  c.append({
    urlList: [
      'https://api.github.com/users/jiasm',
      'https://api.github.com/users/alexinea'
    ],
    optionList: {
      headers: {
        'Postman-Token': '4a9ad815-f3e3-4d74-ad46-1eb5a18fe2ba',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'x-iris-version-code': '206020',
        'User-Agent':
          'Mozilla/5.0 (Linux; U; Android 6.0.1; SM919 Build/MXB48T) Android/000205_2.2.5_0652_0441 (Asia/Shanghai) Dalvik/2.1.0 app/1',
        Authorization: '{{authorization}}',
        method: 'GET'
      }
    },
    validator(data) {
      data.login = 'Login must be equal'
      data.site_admin = 'Site_admin must be equal'
    }
  })
  console.log('start check')
  let results = await c.check()
  console.log('get results', results[0])
}

main()
