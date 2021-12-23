import { port, apiPrefix, winston } from 'config'
import { logger } from './lib'
import express from 'express'
import http from 'http'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// import _ from 'lodash'
// import fs from 'fs'
import multer from 'multer'
import routers from 'routers'

const start = async () => {
  const app = express()

  logger.init(winston)

  app.use(express.json({ limit: '10mb' }))
  app.use(multer().array())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('dev'))
  app.use(cookieParser())

  // 設置 routers
  app.use(`/${apiPrefix || ''}`, routers())
  const server = http.createServer(app)

  server.listen(port, () => {
    logger.debug(`http server listen on port ${port}.`)
  })
}

export default start
