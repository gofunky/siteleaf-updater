#!/usr/bin/env node

const convict = require('convict')
const lib = require('./lib')
const fs = require('fs')
const yaml = require('yaml')
const beautyError = require('beauty-error')

try {
  const schemaFile = fs.readFileSync('./action.yml', 'utf8')
  const schema = yaml.parse(schemaFile)

  const cfg = convict(schema.inputs)

  cfg.validate()

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
} catch (e) {
  console.error(beautyError(e))
}
