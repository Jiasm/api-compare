# api-compare

:yum: Optional comparator, compare multiple request results, highlight the diff.

由一次项目代码优化而产生的轮子，用于 diff 数个接口之间的返回值是否一致。  
自定义一些对比规则，来帮助验证确保升级不会影响到原有的数据结构。

## Install

```bash
npm i -D api-compare
```

## Usage

```javascript
const Comparator = require('api-compare')

async function main() {
  let c = new Comparator()
  c.append({
    urlList: [
      'https://postman-echo.com/get?name=Niko&age=18',
      'https://postman-echo.com/get?name=Bellic&age=18'
    ],
    validator(data) {
      data.login = 'Login must be equal'
      data.site_admin = 'Site_admin must be equal'
    }
  })
  console.log('start check')
  let results = await c.check()
  console.log('get results', results[0]) 
  //  [ { msg: 'Login must be equal', validate: true }, { msg: 'Age must be equal', validate: false } ]
}

main()
```

## Method

### init

> errorOnly? [Boolean]  Filter access log

```javascript
let c = new Comparator({
  errorOnly: true
})
```

### append

Add new request group.

> urlList     [Array]        List of request  
> optionList? [Array|Object] Request option  
> validator   [Function]     Custom validate  

```javascript
c.append({
  urlList: [
    'domain1',
    'domain2'
  ],
  validator(data) {
    // do some validate
  }
})
```

#### Pipeline

```javascript
c.append().append()
```

#### optionList

If `optionList` less than `urlList`, recycle `optionList` like `padStart`/`padEnd`.

```javascript
c.append({
  urlList: [
    'domain1', 'domain2',
    'domain3', 'domain4'
  ],
  optionList: [{
    option: 1
  }, {
    option: 2
  }]
})

// domain1 {option: 1}
// domain2 {option: 2}
// domain3 {option: 1}
// domain4 {option: 2}
```

### check

Run all task from `append`.

Return results, order of `append`.

```javascript
let results = await c.check() // results for validate
```