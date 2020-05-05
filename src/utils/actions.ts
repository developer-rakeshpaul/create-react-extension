/// <reference types="web-ext-types" />
/// <reference types="chrome" />

import head from 'ramda/es/head'
import browser from 'webextension-polyfill'

export const activateChromeTab = async (id: number) => {
  await browser.tabs.update(id, { highlighted: true })
}

export const createChromeTab = async (url: string) => {
  await browser.tabs.create({ url })
}

export const closeTab = async (id: number) => {
  try {
    await browser.tabs.remove(id)
    return true
  } catch (e) {
    return false
  }
}

export const openTab = async (url: string) => {
  const tabs: Array<browser.tabs.Tab> = await browser.tabs.query({ url })
  const openTab: browser.tabs.Tab | undefined = head(tabs)
  if (!openTab) {
    // tslint:disable-next-line:no-empty
    createChromeTab(url)
  } else if (openTab.id) {
    activateChromeTab(openTab.id)
    browser.tabs.move(openTab.id, { index: -1, windowId: openTab.windowId })
  }
}
