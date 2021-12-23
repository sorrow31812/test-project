import _ from 'lodash'
import { logger } from 'lib'
import to from 'await-to-js'
import request from 'superagent'

export default {
  /**
   * 測試啦
   * @param {*} req
   * @param {*} res
   */
  async check (req, res) {
    // const { body } = req
    // const { content } = body
    const levelUrl = 'http://test.sub.sakawa.com.tw/api.php?r=test_account'
    const [lErr, levelData] = await to(request.get(levelUrl))
    if (lErr || !levelData) logger.error(`${lErr.message}`)
    let { text: levelText } = levelData
    levelText = JSON.parse(levelText)

    const ruleUrl = 'http://test.sub.sakawa.com.tw/api.php?r=test_gift'
    const [pErr, ruleData] = await to(request.get(ruleUrl))
    if (pErr || !ruleData) logger.error(`${pErr.message}`)
    let { text: ruleText } = ruleData
    ruleText = JSON.parse(ruleText)

    const dispenseUrl = 'http://test.sub.sakawa.com.tw/api.php?r=test_gift_log'
    const [dErr, dispenseData] = await to(request.get(dispenseUrl))
    if (dErr || !dispenseData) logger.error(`${lErr.message}`)
    let { text: dispenseText } = dispenseData
    dispenseText = JSON.parse(dispenseText)

    let levelLen = levelText.length
    let dispenseLen = dispenseText.length
    if (levelLen !== dispenseLen) {
      const message = `資料數量對不上 ${levelLen} / ${dispenseLen}`
      logger.error(message)
      return res.json({ status: 500, message })
    }

    let rule = {}
    _.forEach(ruleText, r => {
      let { level, point } = r
      rule[`${level}`] = point
    })

    console.log(rule)

    levelText.sort((a, b) => {
      return Number(a.id) - Number(b.id)
    })

    dispenseText.sort((a, b) => {
      return Number(a.id) - Number(b.id)
    })

    let error = []
    let message = []
    for (let i = 0; i < levelLen; i++) {
      const user = levelText[i]
      const userPoint = dispenseText[i]
      const { account, level: lv } = user
      const { account: ac, get_point: getPoint } = userPoint
      const correctPoint = rule[`${lv}`]

      if (account !== ac) {
        message.push(`帳號與id不符`)
        logger.error(message + `${account} / ${ac}`)
        error.push(user, userPoint)
        break
      }

      if (Number(getPoint) !== Number(correctPoint)) {
        message.push(`點數給錯了`)
        logger.error(message + `${account} / LV: ${lv}`)
        error.push(user)
      }
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
