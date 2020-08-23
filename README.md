# siteleaf-updater

[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/gofunky/siteleaf-updater/build/master?style=for-the-badge)](https://github.com/gofunky/siteleaf-updater/actions)
[![Renovate Status](https://img.shields.io/badge/renovate-enabled-green?style=for-the-badge&logo=renovatebot&color=1a1f6c)](https://app.renovatebot.com/dashboard#github/gofunky/siteleaf-updater)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/siteleaf-updater?style=for-the-badge)](https://libraries.io/npm/siteleaf-updater)
[![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/siteleaf-updater?style=for-the-badge)](https://snyk.io/test/github/gofunky/siteleaf-updater)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-purple.svg?style=for-the-badge)](https://standardjs.com)
[![CodeFactor](https://www.codefactor.io/repository/github/gofunky/siteleaf-updater/badge?style=for-the-badge)](https://www.codefactor.io/repository/github/gofunky/siteleaf-updater)
[![node-current](https://img.shields.io/node/v/siteleaf-updater?style=for-the-badge)](https://www.npmjs.com/package/siteleaf-updater)
[![NPM version](https://img.shields.io/npm/v/siteleaf-updater?style=for-the-badge)](https://www.npmjs.com/package/siteleaf-updater)
[![NPM Downloads](https://img.shields.io/npm/dm/siteleaf-updater?style=for-the-badge&color=ff69b4)](https://www.npmjs.com/package/siteleaf-updater)
[![GitHub License](https://img.shields.io/github/license/gofunky/siteleaf-updater.svg?style=for-the-badge)](https://github.com/gofunky/siteleaf-updater/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/gofunky/siteleaf-updater.svg?style=for-the-badge&color=9cf)](https://github.com/gofunky/siteleaf-updater/commits/master)

update your index file in your Siteleaf site using your project README file

## Why it is necessary

When hosting GitHub Pages, there is a common discrepancy one faces when choosing the place to host their page files.

### 1. Host it on the master branch

Hosting on the master branch has the advantage that files can be shared with the project (including the README).
However, pages usually stand alone without a dependency to or from the project files.
Hence, there might be numerous commits that cause an avoidable overhead to merges, CI, and pulls.

### 2. Host it on a dedicated branch

Hosting the pages on a dedicated branch (e.g., `gh-pages`) has the benefit that this beforementioned overhead is avoided.
Separate concerns are rooted in separate trees, just as it is supposed to be.
However, normally, developers only want to publish their README with a few additions.
There is no integrated way or known method in GitHub to sync the README file without hooks or different workarounds.
That circumstance impairs common maintenance and automation requirements.

## Solution

1. Use [Siteleaf](https://www.siteleaf.com/), and publish or sync to a dedicated branch on GitHub.
2. Create a page and assign it a path (by default, `index`).
3. Setup your CI to use `siteleaf-updater` for automated doc updates.

## Parameters

| Action Input | CLI Parameter | Environment Variable | Default | Description |  
| ------ | ------ | ------ | ------ | ------ |  
| api-key | api-key | SITELEAF_API_KEY | *required* | the siteleaf API key |   
| api-secret | api-secret | SITELEAF_API_SECRET | *required* | the siteleaf API secret |   
| site | site | SITE_ID | *required* | the siteleaf site id to be updated |   
| page | page | PAGE_NAME | `index` | the siteleaf page path to be updated |   
| file | file | MD_FILE | `README.md` | the name of the Markdown file to read |   
| publish | publish | - | `false` | publish the site after updating |

## Action Example

```yaml
steps:
  - name: update site
    uses: gofunky/siteleaf-updater@v1
    with:
      api-key: ${{ secrets.SITELEAF_KEY }}
      api-secret: ${{ secrets.SITELEAF_SECRET }}
      site: 'my-site'
      page: 'contribution'
      file: 'CONTRIBUTION.md'
      publish: true
```
