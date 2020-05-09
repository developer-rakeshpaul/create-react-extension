/// <reference types="web-ext-types" />
/// <reference types="chrome" />

import browser from 'webextension-polyfill'
import head from 'ramda/es/head'
import findIndex from 'ramda/es/findIndex'
import isNil from 'ramda/es/isNil'
import reject from 'ramda/es/reject'
import map from 'ramda/es/map'
import propEq from 'ramda/es/propEq'
import whereEq from 'ramda/es/whereEq'
import { openTab } from './utils/actions'

let previousFiles = []

const filesInDirectory = async dir => {
  const entries: any = await new Promise(resolve =>
    dir.createReader().readEntries(resolve),
  )

  const files: any = await Promise.all(
    entries
      .filter(e => e.name[0] !== '.')
      .map(e =>
        e.isDirectory
          ? filesInDirectory(e)
          : new Promise(resolve => e.file(resolve)),
      ),
  )

  return [].concat(...files)
}

const changedFilesInDirectory = async files => {
  let changedFiles: any = []
  const isDifferent = x =>
    findIndex(
      whereEq({ name: x.name, lastModifiedDate: x.lastModifiedDate }),
      files,
    ) === -1
      ? x
      : null
  if (previousFiles.length !== 0) {
    changedFiles = reject(isNil, map(isDifferent, previousFiles))
  }
  previousFiles = files
  const timestamp = files.map((f: any) => f.name + f.lastModifiedDate).join()
  return { changedFiles, timestamp }
}

const reload = async (reloadRuntime: boolean) => {
  const tabs: Array<browser.tabs.Tab> = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })

  // NB: see https://github.com/xpl/crx-hotreload/issues/5
  const tab: browser.tabs.Tab = head(tabs)
  if (reloadRuntime) {
    await browser.runtime.reload()
    await openTab(browser.extension.getURL('main.html'))
  } else {
    await browser.tabs.reload(tab.id)
  }
}

const watchChanges = async (dir: any) => {
  const files = await filesInDirectory(dir)
  const { changedFiles } = await changedFilesInDirectory(files)
  setTimeout(() => watchChanges(dir), 1000) // retry after 1s
  if (changedFiles.length > 0) {
    const manifestChanged =
      findIndex(propEq('name', 'manifest.json'), changedFiles) !== -1
    reload(manifestChanged)
  }
}

;(async function () {
  const self = await browser.management.getSelf()
  if (self.installType === 'development') {
    browser.runtime.getPackageDirectoryEntry(dir => watchChanges(dir))
  }
})()
