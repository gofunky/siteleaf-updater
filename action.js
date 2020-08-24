#!/usr/bin/env node

const core = require('@actions/core')
const lib = require('./lib')

const publish = String(core.getInput('publish')).toLowerCase() === 'true'

lib(core.getInput('api-key'), core.getInput('api-secret'), core.getInput('site'),
  core.getInput('page'), core.getInput('file'), publish)
  .then(name => {
    core.setOutput('name', name)
    if (publish) {
      core.info(`Page "${name}" was successfully updated and published`)
    } else {
      core.info(`Page "${name}" was successfully updated`)
    }
  })
  .catch(core.setFailed)
