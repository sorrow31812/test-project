// @create-index this file is created by create-index.js.
import savePictrue from './save-pictrue'
import sendLineNotify from './send-line-notify'
import slugify from './slugify'

export { savePictrue, sendLineNotify, slugify }

const moduleList = {
  savePictrue,
  sendLineNotify,
  slugify
}

export default moduleList
