const urllib = require('urllib')

let url1 = 'http://localhost:8080/live/overseas/onair'
let url2 = 'http://localhost:8081/live/overseas/onair'

let data = {
  page: 2
}

let headers = {
  'Postman-Token': '06904b0d-a84f-4d94-bcc0-c6d91ea9ef3f',
  'Cache-Control': 'no-cache',
  'x-iris-version-code': '206020',
  'Content-Type': 'application/json',
  'User-Agent':
    'Mozilla/5.0 (Linux; U; Android 6.0.1; SM919 Build/MXB48T) Android/000205_2.2.5_0652_0441 (Asia/Shanghai) Dalvik/2.1.0 app/1'
}

async function main() {
  let [resutls1, results2] = await Promise.all([
    urllib.request(url1, {
      method: 'GET',
      headers,
      data
    }),
    urllib.request(url2, {
      method: 'GET',
      headers,
      data
    })
  ])

  let res1 = JSON.parse(resutls1.data.toString())
  let res2 = JSON.parse(results2.data.toString())

  console.info('Check data length.', res1.data.length)
  console.assert('Length must be equal', res1.data.length === res2.data.length)
  console.assert(
    'All data [uid, anchor.name, anchor.avatar] must be equal',
    res1.data.every((item, index) => {
      if (!item || !item.anchor) return true

      let target = res2.data[index]

      console.log(
        `check name: [${item.anchor.name.padEnd(
          20,
          ' '
        )}] with: [${target.anchor.name.padEnd(20, ' ')}]`
      )
      return item.anchor && target.anchor
        ? item.uid === target.uid &&
            item.anchor.name === target.anchor.name &&
            item.anchor.avatar === target.anchor.avatar
        : true
    })
  )

  if (!res1.extra.fresh_beans_list) return
  console.info(
    'Check extra.fresh_beans_list length.',
    res1.extra.fresh_beans_list.length
  )
  console.assert(
    'Length must be equal',
    res1.extra.fresh_beans_list.length === res2.extra.fresh_beans_list.length
  )
  console.assert(
    'All data [uid, anchor.name, anchor.avatar] must be equal',
    res1.extra.fresh_beans_list.every((item, index) => {
      if (!item || !item.anchor) return true

      let target = res2.extra.fresh_beans_list[index]

      console.log(
        `check name: [${item.anchor.name.padEnd(
          20,
          ' '
        )}] with: [${target.anchor.name.padEnd(20, ' ')}]`
      )
      return item.anchor && target.anchor
        ? item.uid === target.uid &&
            item.anchor.name === target.anchor.name &&
            item.anchor.avatar === target.anchor.avatar
        : true
    })
  )
}

main()
