importScripts('src/services/groupService.js', 'src/constants.js');

chrome.runtime.onInstalled.addListener(async () => {
  await groupService.setStorage(groupService.TITLES_KEY, []);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const { groupId, status } = tab;

  if (groupId === GROUP_ID_NONE || status !== TAB_STATUSES.complete) {
    return;
  }

  const windowGroups = await groupService.getWindowGroups();
  const { title } = windowGroups.find((it) => it.id === groupId);
  const storageGroup = await groupService.getStorageGroup(title);

  if (storageGroup) {
    await groupService.saveGroup(title);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {

});