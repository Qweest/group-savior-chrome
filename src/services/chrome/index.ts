import { StorageGroup, TabGroup, WindowGroup, WindowTab } from './entities';
import { TITLES_KEY } from './constants';

export const toWindowGroup = ({
  id,
  title,
  color,
  collapsed,
}: WindowGroup): WindowGroup => ({
  id,
  title,
  color,
  collapsed,
});

export const getStorage = async <T>(key: string): Promise<T> => {
  return new Promise<T>((resolve) => {
    chrome.storage.sync.get(key, (result) => resolve(result[key]));
  });
};

export const setStorage = async (key: string, value: any): Promise<void> => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [key]: value }, resolve);
  });
};

export const removeStorage = async (key: string): Promise<void> => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.remove(key, resolve);
  });
};

export const clearStorage = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    chrome.storage.sync.clear(resolve);
  });
  await setStorage(TITLES_KEY, []);
};

export const setStorageGroup = async (group: StorageGroup): Promise<void[]> => {
  const { title } = group;
  const titles = await getStorage<string[]>(TITLES_KEY);
  const titlesSet = new Set([...titles, title]);

  return Promise.all([
    await setStorage(TITLES_KEY, Array.from(titlesSet)),
    await setStorage(title, group),
  ]);
};

export const removeStorageGroup = async (title: string): Promise<string[]> => {
  const titles = await getStorage<string[]>(TITLES_KEY);
  const newTitles = titles.filter((it) => it !== title);

  Promise.all([
    await setStorage(TITLES_KEY, newTitles),
    await removeStorage(title),
  ]);

  return newTitles;
};

export const getStorageGroups = async (): Promise<StorageGroup[]> => {
  const titles = await getStorage<string[]>(TITLES_KEY);

  return Promise.all(
    titles.map(async (title) => {
      return await getStorage<StorageGroup>(title);
    }),
  );
};

export const getWindowGroups = async (
  title?: string,
  windowId = chrome.windows.WINDOW_ID_CURRENT,
): Promise<WindowGroup[]> => {
  return new Promise((resolve) => {
    chrome.tabGroups.query({ title, windowId }, (groups: WindowGroup[]) => {
      const windowGroups = groups.map(toWindowGroup);

      resolve(windowGroups);
    });
  });
};

export const removeStorageGroups = async (): Promise<string[]> => {
  const storageGroups = await getStorageGroups();
  const windowGroups = await getWindowGroups();
  const windowGroupsTitles = windowGroups.map((it) => it.title);
  const storageTitlesToRemove = storageGroups
    .filter((it) => windowGroupsTitles.includes(it.title))
    .map((it) => it.title);

  for (let i = 0; i < storageTitlesToRemove.length; i++) {
    await removeStorageGroup(storageTitlesToRemove[i]);
  }

  return storageTitlesToRemove;
};

export const saveGroup = async (title: string): Promise<StorageGroup> => {
  const groups = await getWindowGroups(title);
  const color = groups[0].color;
  const groupIds = groups.map((it) => it.id);
  const windowTabs = await getWindowTabs();
  const urls = windowTabs
    .filter((it) => groupIds.includes(it.groupId))
    .map((it) => it.url);
  const newGroup = {
    title,
    color,
    urls,
  };

  await setStorageGroup(newGroup);

  return newGroup;
};

export const saveAllGroups = async (): Promise<StorageGroup[]> => {
  const windowGroups = await getWindowGroups();

  for (let i = 0; i < windowGroups.length; i++) {
    await saveGroup(windowGroups[i].title);
  }

  return await getStorageGroups();
};

export const openGroup = async (title: string): Promise<void> => {
  const storageGroup = await getStorage<StorageGroup>(title);
  const [windowGroup] = await getWindowGroups(title);

  if (windowGroup) {
    const { id, collapsed } = windowGroup;
    await updateGroup(id, { collapsed: !collapsed });
    return;
  }

  if (storageGroup) {
    const { title, color, urls } = storageGroup;
    const tabs = await createTabs(urls);
    const tabIds = tabs.map((it) => it.id);
    const groupId = await combineTabs(tabIds);
    await updateGroup(groupId, { title, color });
  }
};

export const getWindowTabs = async (
  windowId = chrome.windows.WINDOW_ID_CURRENT,
): Promise<WindowTab[]> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ windowId }, resolve);
  });
};

export const createTabs = async (urls: string[]): Promise<WindowTab[]> => {
  return Promise.all(
    urls.map((url) => {
      return new Promise<WindowTab>((resolve) => {
        chrome.tabs.create({ url, active: false }, resolve);
      });
    }),
  );
};

export const combineTabs = async (tabIds: number[]): Promise<number> => {
  return new Promise<number>((resolve) => {
    chrome.tabs.group({ tabIds }, resolve);
  });
};

export const updateGroup = async (
  groupId: number,
  options: TabGroup | { collapsed?: boolean },
): Promise<WindowGroup> => {
  return new Promise((resolve) => {
    chrome.tabGroups.update(groupId, options, resolve);
  });
};
