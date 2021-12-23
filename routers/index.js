import _ from 'lodash'
import express from 'express'
import Middleware, { extendResponse } from 'middlewares'
import Controllers from 'api/controllers'
import routes from 'routers/routes'
// import defaultMiddlewares from 'config/default-middlewares'

const Routers = (app) => {
  const router = express.Router()
  router.route('*').all(extendResponse)

  Object.keys(routes).map(key => {
    let object = routes[key]
    let [method, route] = key.split(' ')
    if (!route) {
      let err = Error(`Router setting error: ${key}`)
      console.error(`Router setting error: ${err.message}`)
      throw err
    }

    let actionPath
    if (_.isString(object)) {
      actionPath = object.split('.')
      let workerFunc = Controllers
      actionPath.forEach(p => {
        workerFunc = workerFunc[p]
      })

      workerFunc = workerFunc.bind({
        logHead: `[${object}] `
      })
      router.route(route)[method](workerFunc)
    } else if (_.isObject(object)) {
      let { controller, action, middleware } = object

      actionPath = controller.split('.')
      actionPath.push(action)
      let workerFunc = Controllers
      actionPath.forEach(p => {
        workerFunc = workerFunc[p]
      })

      if (_.isArray(middleware)) {
        middleware.forEach(m => {
          m = m.split('-')
          if (m.length > 1) {
            m = Middleware[m[0]](...m.slice(1))
          } else {
            m = Middleware[m]
          }
          router.route(route)[method](m)
        })
      }
      console.info('[routes] ', object)
      workerFunc = workerFunc.bind({
        logHead: `[${controller}.${action}] `
      })
      router.route(route)[method](workerFunc)
    }
  })

  return router
}

export default Routers
