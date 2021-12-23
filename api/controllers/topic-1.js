import _ from 'lodash'
import { logger } from 'lib'
import to from 'await-to-js'
import request from 'superagent'

// const logHead = `[Test] `
export default {
  /**
   * 測試啦
   * @param {*} req
   * @param {*} res
   */
  async check (req, res) {
    // const { body } = req
    // const { content } = body
    const url = 'http://test.sub.sakawa.com.tw/api.php?r=transfer_log'
    const [err, data] = await to(request.get(url))
    if (err || !data) logger.error(`${err.message}`)
    let { text } = data
    text = JSON.parse(text) || []

    let tempResult = 0
    let error = []
    let message = []
    for (let i = 0, len = text.length; i < len; i++) {
      const record = text[i]
      const { orig, add, new: result } = record
      const check = Number(orig) + Number(add) === Number(result)
      if (tempResult !== Number(orig)) {
        message.push(`前後交易紀錄數字對不上`)
        logger.error(message)
        error.push(record)
      }
      if (!check) {
        message.push(`交易紀錄算錯`)
        logger.error(message)
        error.push(record)
      }
      tempResult = Number(result)
    }

    message = _.uniq(message)
    const result = {
      status: 200,
      message,
      error
    }

    return res.json(result)
  }
}
