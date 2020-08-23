#!/usr/bin/env node

const core = require('@actions/core')
const lib = require('./lib')

lib(core.getInput('key'), core.getInput('secret'), core.getInput('site'),
  core.getInput('page'), core.getInput('file'), core.getInput('publish'))
  .then(name => {
    core.setOutput('name', name)
    if (core.getInput('publish')) {
      console.info(`Page "${name}" was successfully updated and published`)
    } else {
      console.info(`Page "${name}" was successfully updated`)
    }
  })
  .catch(core.setFailed)
