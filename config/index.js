
import myconfigs from './configs'

var termProgram = myconfigs.termProgram
var initCwd = myconfigs.initCwd
var term = myconfigs.term
var shell = myconfigs.shell
var tmpdir = myconfigs.tmpdir
var termProgramVersion = myconfigs.termProgramVersion
var user = myconfigs.user
var commandMode = myconfigs.commandMode
var sshAuthSock = myconfigs.sshAuthSock
var cfUserTextEncoding = myconfigs.cfUserTextEncoding
var path = myconfigs.path
var cfbundleidentifier = myconfigs.cfbundleidentifier
var pwd = myconfigs.pwd
var lang = myconfigs.lang
var xpcFlags = myconfigs.xpcFlags
var xpcServiceName = myconfigs.xpcServiceName
var shlvl = myconfigs.shlvl
var home = myconfigs.home
var logname = myconfigs.logname
var colorterm = myconfigs.colorterm
var appName = myconfigs.appName
var port = myconfigs.port
var cluster = myconfigs.cluster
var logLevel = myconfigs.logLevel
var requestLog = myconfigs.requestLog
var apiPrefix = myconfigs.apiPrefix
var defaultLocale = myconfigs.defaultLocale
var systemLocales = myconfigs.systemLocales
var developerAccounts = myconfigs.developerAccounts
var developerEmail = myconfigs.developerEmail
var developerPw = myconfigs.developerPw
var redis = myconfigs.redis
var winston = myconfigs.winston
var reloadConfig = myconfigs.reloadConfig
var getConfigs = myconfigs.getConfigs
var configs = myconfigs.configs

export { termProgram, initCwd, term, shell, tmpdir, termProgramVersion, user, commandMode, sshAuthSock, cfUserTextEncoding, path, cfbundleidentifier, pwd, lang, xpcFlags, xpcServiceName, shlvl, home, logname, colorterm, appName, port, cluster, logLevel, requestLog, apiPrefix, defaultLocale, systemLocales, developerAccounts, developerEmail, developerPw, redis, winston, reloadConfig, getConfigs, configs }

const moduleList = {
  termProgram,
  initCwd,
  term,
  shell,
  tmpdir,
  termProgramVersion,
  user,
  commandMode,
  sshAuthSock,
  cfUserTextEncoding,
  path,
  cfbundleidentifier,
  pwd,
  lang,
  xpcFlags,
  xpcServiceName,
  shlvl,
  home,
  logname,
  colorterm,
  appName,
  port,
  cluster,
  logLevel,
  requestLog,
  apiPrefix,
  defaultLocale,
  systemLocales,
  developerAccounts,
  developerEmail,
  developerPw,
  redis,
  winston,
  reloadConfig,
  getConfigs,
  configs
}

export default moduleList
