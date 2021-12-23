import _ from 'lodash'

const verify = (cards) => {
  let groups = []
  let group = { arr: [], count: 0 }
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i]
    let nextCard = cards[i + 1]
    let preCard = cards[i - 1]
    let eqNext = nextCard === card
    let eqPre = preCard === card
    if (card >= 0) {
      if (eqPre) {
        group.arr[group.arr.length - 1] += 1
      } else {
        group.arr.push(1)
      }
      group.count += 1
    }

    if ((card > 26 && !eqNext) || (nextCard - card > 1 && card < 27) || ((card + 1) % 9 === 0 && !eqNext) || !nextCard) {
      if (group.count > 0) {
        groups.push(_.cloneDeep(group))
        group.arr = []
        group.count = 0
      }
    }
  }
  console.log('group:', JSON.stringify(groups))
  // 算出有無胡牌
  let hu = true
  let pairCount = 0
  let len = groups.length
  for (let i = 0; i < len; i++) {
    let g = groups[i]
    let { arr, count } = g
    let arrLen = arr.length
    if (count === 3 && arrLen !== 2) {
      // 順子或刻子，一定是三張一樣或三張不一樣
      continue
    } else if (count === 2 && arrLen === 1) {
      // pair，一定是兩張一樣
      pairCount += 1
    } else if (count === 1) {
      // 單隻
      pairCount += 1
      if (arrLen === count) return false
    } else if (count > 3) {
      // count > 3
      let check3 = checkHu(arr, pairCount)
      if (!check3.hu) check3 = checkHu(arr, pairCount, false, true)
      if (!check3.hu) check3 = checkHu(arr, pairCount, true, false)
      hu = check3.hu
      pairCount = check3.pairC
    } else {
      return false
    }

    if (pairCount > 1 || !hu) return false
  }

  // 沒有將牌
  if (pairCount !== 1) hu = false
  return hu
}

const checkHu = (arr, pairCount, pairFirst = false, threeFirst = false) => {
  let huObj = {}
  let arrLen = arr.length
  let gt4 = _.find(arr, e => e > 4)
  if (gt4) return { hu: false, pairC: pairCount }
  for (let i = 0; i < arrLen; i++) {
    let t = _.cloneDeep(arr)
    if (!t[i]) continue
    let pairC = 0
    let idx = i + 1
    huObj = {}
    while (idx !== i) {
      let card = t[idx - 1]
      if (card >= 3 && threeFirst) card = t[idx - 1] = card - 3
      if (card > 0) {
        if (t[idx] > 0 && t[idx - 2] > 0) {
          t[idx] -= 1
          t[idx - 2] -= 1
          card = t[idx - 1] = card - 1
        }
      }

      let changeIdx = !card || card <= 0 || !t[idx] || !t[idx - 2] || (pairFirst && !pairCount)
      if (changeIdx) {
        idx += 1
        if (idx >= arrLen) idx = 0
      }
    }

    console.log(t)
    let zeroCount = 0
    let threeCount = 0
    _.forEach(t, num => {
      switch (num) {
        case 0:
          zeroCount += 1
          break
        case 1:
          return { hu: false, pairC }
        case 3:
          threeCount += 1
          break
        case 4:
          threeCount += 1
          break
        default:
          pairC += 1
          break
      }
    })

    // console.log(pairC, zeroCount, threeCount, arrLen)
    if (_.size(huObj) && !huObj.hu) continue

    let huCount = zeroCount + threeCount + pairC
    if (huCount === arrLen && pairC <= 1) return { hu: true, pairC: pairCount + pairC }
  }

  if (!_.size(huObj)) huObj = { hu: false, pairC: pairCount }
  console.log(huObj)
  return huObj
}

export default {
  /**
   * 測試啦
   * @param {*} req
   * @param {*} res
   */
  async check (req, res) {
    const { body } = req
    const { hands } = body

    const huObj = verify(hands)
    const result = {
      status: 200,
      message: 'ok',
      result: huObj
    }

    return res.json(result)
  }
}

// const pai_cht = [
//   '一萬','二萬','三萬','四萬','五萬','六萬','七萬','八萬','九萬', //0~8
//   '一筒','二筒','三筒','四筒','五筒','六筒','七筒','八筒','九筒', //9~17
//   '一條','二條','三條','四條','五條','六條','七條','八條','九條', //18~26
//   '東風','南風','西風','北風','紅中','發財','白板', //27~33
//   '春一', '夏二', '秋三', '冬四', '梅一', '蘭二', '菊三', '竹四' //34~41
// ];

// function check_胡牌(holds){
//   let result = {
//       "胡":false,
//       "眼":-1,
//       "吃":[],
//       "輸入":[]
//   };
//   //enter code there

//   return result;
// }

// console.log(JSON.stringify(check_胡牌([1,2,3,3])));
// console.log(JSON.stringify(check_胡牌([3,1,1,1])));
// console.log(JSON.stringify(check_胡牌([1,2,3,3,3])));
// console.log(JSON.stringify(check_胡牌([3,3,1,2,3])));
// console.log(JSON.stringify(check_胡牌([8,9,10,11,11])));
// console.log(JSON.stringify(check_胡牌([17,18,19,11,11])));
// console.log(JSON.stringify(check_胡牌([26,27,28,11,11])));
// console.log(JSON.stringify(check_胡牌([0,1,1,2,2,2,3,3,4,4,5,6,32,32])));
// console.log(JSON.stringify(check_胡牌([0,1,1,2,3,2,6,7,8,4,5,6,33,33])));
// console.log(JSON.stringify(check_胡牌([9,10,11,12,13,14,15,16,17,34,34])));
// console.log(JSON.stringify(check_胡牌([0,1,1,2,2,2,3,3,4,4,5,6,35,35])));
