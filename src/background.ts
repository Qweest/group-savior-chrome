import {
  getStorage,
  getWindowGroups,
  saveGroup,
  setStorage,
} from './services/chrome';
import {
  GROUP_ID_NONE,
  TAB_STATUSES,
  TITLES_KEY,
} from './services/chrome/constants';

chrome.runtime.onInstalled.addListener(async () => {
  await setStorage(TITLES_KEY, []);
});

chrome.tabs.onUpdated.addListener(
  async (
    tabId: number,
    changeInfo: any,
    tab: { groupId: number; status: string },
  ) => {
    const { groupId, status } = tab;
    console.log(tab);

    if (groupId === GROUP_ID_NONE || status !== TAB_STATUSES.complete) {
      return;
    }

    const windowGroups = await getWindowGroups();
    const { title } = windowGroups.find((it) => it.id === groupId)!;
    const storageGroup = await getStorage(title);

    if (storageGroup) {
      await saveGroup(title);
    }
  },
);
