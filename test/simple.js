const Comparator = require('../')

async function main() {
  let c = new Comparator({ errorOnly: true })
  c.append({
    urlList: [
      'https://postman-echo.com/get?name=Niko&age=18',
      'https://postman-echo.com/get?name=Bellic&age=18'
    ],
    validator(data) {
      data.args.name = 'Login must be equal'
      data.args.age = 'Age must be equal'
    }
  })
  console.log('start check')
  let results = await c.check()
  console.log('get results', results[0])
}

main()
