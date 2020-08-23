#!/usr/bin/env node

const chalk = require('chalk')
const convict = require('convict')
const lib = require('./lib')
const fs = require('fs')
const yaml = require('yaml')
const beautyError = require('beauty-error')
const commandLineUsage = require('command-line-usage')

let cfg
let schema
try {
  const schemaFile = fs.readFileSync('./action.yml', 'utf8')
  schema = yaml.parse(schemaFile)
  cfg = convict(schema.inputs)
  cfg.validate()
} catch (e) {
  console.error(beautyError(e))
}

if (cfg.get('api-key') === '' || cfg.get('help') === true) {

  const header = `░██████╗██╗████████╗███████╗██╗░░░░░███████╗░█████╗░███████╗
██╔════╝██║╚══██╔══╝██╔════╝██║░░░░░██╔════╝██╔══██╗██╔════╝
╚█████╗░██║░░░██║░░░█████╗░░██║░░░░░█████╗░░███████║█████╗░░
░╚═══██╗██║░░░██║░░░██╔══╝░░██║░░░░░██╔══╝░░██╔══██║██╔══╝░░
██████╔╝██║░░░██║░░░███████╗███████╗███████╗██║░░██║██║░░░░░
╚═════╝░╚═╝░░░╚═╝░░░╚══════╝╚══════╝╚══════╝╚═╝░░╚═╝╚═╝░░░░░

██╗░░░██╗██████╗░██████╗░░█████╗░████████╗███████╗██████╗░
██║░░░██║██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
██║░░░██║██████╔╝██║░░██║███████║░░░██║░░░█████╗░░██████╔╝
██║░░░██║██╔═══╝░██║░░██║██╔══██║░░░██║░░░██╔══╝░░██╔══██╗
╚██████╔╝██║░░░░░██████╔╝██║░░██║░░░██║░░░███████╗██║░░██║
░╚═════╝░╚═╝░░░░░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝`

  const sections = [
    {
      header: chalk.blue(header),
      raw: true,
    },
    {
      header: 'siteleaf updater',
      content: schema.description
    },
    {
      header: 'Synopsis',
      content: [
        '$ siteleaf-updater --api-key "secret-key" --api-secret "secret" --site "siteid"'
      ]
    },
    {
      header: 'Options',
      optionList: Object.entries(schema.inputs)
        .map(([key, val]) => {
          const opt = {
            name: key,
            description: String(val.description),
            type: String,
            typeLabel: 'string'
          }
          if (val.format === 'Boolean') {
            opt.type = Boolean
            opt.typeLabel = ''
          }
          switch (key) {
            case 'file': { opt.typeLabel = 'file' }
          }
          return opt
      })
    }
  ]

  const usage = commandLineUsage(sections)
  console.log(usage)
  process.exitCode = 1

} else {

    lib(cfg.get('api-key'), cfg.get('api-secret'), cfg.get('site'), cfg.get('page'),
      cfg.get('file'), cfg.get('publish'))
      .then(name => {
        if (cfg.get('publish')) {
          console.info(`Page "${name}" was successfully updated and published`)
        } else {
          console.info(`Page "${name}" was successfully updated`)
        }
      })
      .catch(err => {
        console.error(beautyError(err))
      })

}
