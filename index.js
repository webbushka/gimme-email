#!/usr/bin/env node
const yarg = require('yargs')
const Configstore = require('configstore')
const chalk = require('chalk')
const clipboardy = require('clipboardy')
const format = require('date-fns/format')

const { log } = console

const currentDate = format(new Date(), 'YYYYMMDD')
const conf = new Configstore('gimmemail')

const argv = yarg
  .command('[username] [domain]', 'returns email with date')
  .option('set-username', {
    alias: 'u',
    describe: 'sets default username to use when not supplied (ex. jsnow)',
  })
  .option('set-domain', {
    alias: 'd',
    describe: 'sets default domain to use when not supplied (ex. targaryen.com)',
  })
  .option('last', {
    alias: 'l',
    describe: 'gets the last used email address',
    boolean: true,
  }).argv

const { setUsername, setDomain, last } = argv

if (setUsername) conf.set('username', setUsername)
if (setDomain) conf.set('domain', setDomain)

const storedDate = conf.get('date')
let version = conf.get('version')
const storedUsername = conf.get('username')
const storedDomain = conf.get('domain')

const username = argv._[0] || storedUsername
const domain = argv._[1] || storedDomain

if (!username) {
  return log(chalk.red('You must supply a username or set a default. Use --help for more information'))
}

if (!domain) {
  return log(chalk.red('You must supply a domain or set a default. Use --help for more information'))
}

if (!last || !storedDate) {
  if (storedDate !== currentDate) {
    conf.set('date', currentDate)
    conf.set('version', 1)
  } else {
    conf.set('version', version + 1)
  }
}

const date = conf.get('date')
version = conf.get('version')

const email = `${username}+${date}${version}@${domain}`

clipboardy.writeSync(email)
log(chalk.green(`${email} copied to clipboard`))
