const rp = require('request-promise')

const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}

class Comparator {
  constructor() {
    this.tasks = []
    this.errorList = []
  }
  append({ urlList, optionList, validator }) {
    this.tasks.push(
      new ComparatorWorker({
        urlList,
        optionList,
        validator,
        errorList: this.errorList
      })
    )
  }
  async check() {
    let results = [...(await Promise.all(this.tasks.map(task => task.check())))]
    return results
  }
}

class ComparatorWorker {
  constructor({
    urlList,
    optionList = [defaultOptions],
    validator,
    errorList
  }) {
    if (!urlList || !urlList.length) throw new Error('[urlList] is required')
    if (!Array.isArray(optionList)) {
      optionList = [optionList]
    }

    let optionLen = optionList.length

    this.urlList = urlList.map((url, index) => ({
      url,
      option: optionList[index % optionLen]
    }))
    this.validator = validator
    this.errorList = []
  }

  async check() {
    let results = await Promise.all(
      this.urlList.map(({ url, option }) => rp(url, option))
    )

    results = results.map(item => JSON.parse(item))

    this.validator(
      proxyItem(...results.splice(0, 1), results, this.errorHandler.bind(this))
    )

    return this.errorList
  }

  errorHandler(message) {
    this.errorList.push(message)
  }
}

function proxyItem(target, maps, errHandler) {
  var proxyConfig = {
    get(target, key) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return proxyItem(target[key], maps.map(item => item[key]), errHandler)
      } else {
        return target[key]
      }
    },
    set(target, key, value) {
      let tagValue = target[key]

      if (maps.some(item => tagValue !== item[key])) {
        errHandler(value)
        // console.error('Check error:', value)
      }
    }
  }

  return new Proxy(target, proxyConfig)
}

module.exports = Comparator
