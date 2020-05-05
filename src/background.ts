/// <reference types="chrome" />
import browser from 'webextension-polyfill'

import { openTab } from './utils/actions'

browser.browserAction.onClicked.addListener(async () => {
  await openTab(browser.extension.getURL('main.html'))
})
