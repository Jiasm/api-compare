const rp = require('request-promise')

const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
}

class Comparator {
  constructor({ errorOnly } = {}) {
    this.tasks = []
    this.errorOnly = errorOnly
  }
  append({ urlList, optionList, validator }) {
    this.tasks.push(
      new ComparatorWorker({
        urlList,
        optionList,
        validator,
        errorOnly: this.errorOnly
      })
    )

    return this
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
    errorOnly
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
    this.errorOnly = errorOnly
    this.messageList = []
  }

  async check() {
    let results = await Promise.all(
      this.urlList.map(({ url, option }) => rp(url, option))
    )

    results = results.map(item => JSON.parse(item))

    this.validator(
      proxyItem(
        ...results.splice(0, 1),
        results,
        this.validateHandler.bind(this)
      )
    )

    return this.messageList
  }

  validateHandler(message) {
    if (this.errorOnly && message.validate) return
    else this.messageList.push(message)
  }
}

function proxyItem(target, maps, validateHandler) {
  var proxyConfig = {
    get(target, key) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return proxyItem(
          target[key],
          maps.map(item => item[key]),
          validateHandler
        )
      } else {
        return target[key]
      }
    },
    set(target, key, msg) {
      let tagValue = target[key]

      validateHandler({
        msg,
        validate: maps.some(item => tagValue !== item[key])
      })
    }
  }

  return new Proxy(target, proxyConfig)
}

module.exports = Comparator
