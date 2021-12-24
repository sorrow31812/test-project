import _ from 'lodash'

const verify = async (cards) => {
  let eye = 0
  let chow = []
  let groups = []
  let compare = []
  let message = 'ok'
  let compareCard = []
  let group = { arr: [], count: 0 }
  if (_.size(cards) < 17) return { eye, chow: [], hu: false, message: '手牌數量不對，相公。' }
  cards = cards.sort((a, b) => { return Number(a) - Number(b) })
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i]
    if (Number(card) >= 34) return { eye, chow: [], hu: false, message: '請勿輸入花牌。' }
    let nextCard = cards[i + 1]
    let preCard = cards[i - 1]
    let eqNext = nextCard === card
    let eqPre = preCard === card
    if (card >= 0) {
      if (eqPre) {
        group.arr[group.arr.length - 1] += 1
      } else {
        group.arr.push(1)
        compareCard.push(card)
      }
      group.count += 1
    }

    if ((card > 26 && !eqNext) || (nextCard - card > 1 && card < 27) || ((card + 1) % 9 === 0 && !eqNext) || !nextCard) {
      if (group.count > 0) {
        groups.push(_.cloneDeep(group))
        compare.push(_.cloneDeep(compareCard))
        group.arr = []
        group.count = 0
        compareCard = []
      }
    }
  }

  // 算出有無胡牌
  const len = groups.length
  let hu = true
  let pairCount = 0
  for (let i = 0; i < len; i++) {
    const g = groups[i]
    const c = compare[i]
    const { arr, count } = g
    const arrLen = arr.length
    if (count === 3 && arrLen !== 2) {
      // 順子或刻子，一定是三張一樣或三張不一樣
      if (arrLen === 3) chow.push(c)
      continue
    } else if (count === 2 && arrLen === 1) {
      // pair，一定是兩張一樣
      pairCount += 1
      eye = _.head(c)
    } else if (count === 1) {
      // 單隻
      pairCount += 1
      if (arrLen === count) return { hu, eye, chow, message }
    } else if (count > 3) {
      // count > 3
      let check3 = checkHu(arr, c, pairCount)
      if (!check3.hu) check3 = checkHu(arr, c, pairCount, false, true)
      if (!check3.hu) check3 = checkHu(arr, c, pairCount, true, false)
      hu = check3.hu
      eye = check3.eye
      chow = _.concat(chow, check3.chow)
      pairCount = check3.pairC
    } else {
      return { hu, eye, chow, message }
    }

    if (pairCount > 1 || !hu) return { hu, eye, chow, message }
  }

  // 沒有將牌
  if (pairCount !== 1) hu = false
  return { hu, eye, chow, message }
}

const checkHu = (arr, compareCard, pairCount, pairFirst = false, threeFirst = false) => {
  const arrLen = arr.length
  let eye = 0
  let chow = []
  let huObj = {}
  let gt4 = _.find(arr, e => e > 4)
  if (gt4) return { eye, chow, hu: false, pairC: pairCount }
  for (let i = 0; i < arrLen; i++) {
    let t = _.cloneDeep(arr)
    if (!t[i]) continue
    let pairC = 0
    let idx = i + 1
    huObj = {}
    while (idx !== i) {
      let chowSet = []
      let card = t[idx - 1]
      if (card >= 3 && threeFirst) card = t[idx - 1] = card - 3
      if (card > 0) {
        if (t[idx] > 0 && t[idx - 2] > 0) {
          t[idx] -= 1
          t[idx - 2] -= 1
          card = t[idx - 1] = card - 1
          chowSet.push(compareCard[idx - 2], compareCard[idx - 1], compareCard[idx])
          chow.push(chowSet)
        }
      }

      let changeIdx = !card || card <= 0 || !t[idx] || !t[idx - 2] || (pairFirst && !pairCount)
      if (changeIdx) {
        idx += 1
        if (idx >= arrLen) idx = 0
      }
    }

    let zeroCount = 0
    let threeCount = 0
    for (let i = 0, tLen = t.length; i < tLen; i++) {
      const num = t[i]
      const c = compareCard[i]
      switch (num) {
        case 0:
          zeroCount += 1
          break
        case 1:
          pairC += 1
          break
        case 3:
          threeCount += 1
          break
        case 4:
          threeCount += 1
          break
        default:
          eye = c
          pairC += 1
          break
      }
    }

    if (_.size(huObj) && !huObj.hu) continue
    const huCount = zeroCount + threeCount + pairC
    if (huCount === arrLen && pairC <= 1) return { eye, chow, hu: true, pairC: pairCount + pairC }
    chow = []
  }

  if (!_.size(huObj)) huObj = { eye, chow, hu: false, pairC: pairCount }
  return huObj
}

const sample = [9, 10, 11, 12, 13, 14, 14, 14, 15, 16, 17, 18, 19, 20, 31, 31, 31]
export default {
  async check (req, res) {
    const { body } = req
    let { hands } = body
    if (!hands) hands = sample

    const huObj = await verify(hands)
    const result = {
      hands,
      ...huObj,
      status: 200
    }
    return res.json(result)
  }
}
