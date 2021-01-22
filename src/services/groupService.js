const groupService = {
  TITLES_KEY: 'titles',
  COLORS: {
    red: '#FF8C76',
    yellow: '#FFE79F',
    blue: '#7CBBFF',
    grey: '#d9d8d8',
    green: '#AEFFD1',
    pink: '#FF9FE7',
    purple: '#E8D2FF',
    cyan: '#A2E9FF',
  },

  /**
   * Converts TabGroup object to window group object info
   * @param id: number
   * @param title: string
   * @param color: string
   * @returns {{color, id, title}}
   */
  toWindowGroup: ({ id, title, color }) => ({
    id,
    title,
    color,
  }),

  /**
   * Get item from storage by key
   * @param key: string
   * @returns {Promise<any>}
   */
  async getStorage(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, resolve);
    });
  },

  /**
   * Set item to the storage by key
   * @param key: string
   * @param value: any
   * @returns {Promise<undefined>}
   */
  async setStorage(key, value) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => resolve());
    });
  },

  /**
   * Removes item from storage by item's key
   * @param key: string
   * @returns {Promise<undefined>}
   */
  async removeStorage(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.remove(key, () => resolve());
    });
  },

  /**
   * Set group and it's title to the storage
   * @param group: { title, color, urls }
   * @returns {Promise<undefined[]>}
   */
  async setStorageGroup(group) {
    const { title } = group;
    const { titles } = await this.getStorage(this.TITLES_KEY);
    const titlesSet = new Set([...titles, title]);

    return Promise.all([
      await this.setStorage(this.TITLES_KEY, Array.from(titlesSet)),
      await this.setStorage(title, group),
    ]);
  },

  /**
   * Remove group and it's title from the storage
   * @param title: string
   * @returns {Promise<undefined[]>}
   */
  async removeStorageGroup(title) {
    const { titles } = await this.getStorage(this.TITLES_KEY);
    const newTitles = titles.filter((it) => it !== title);

    return Promise.all([
      await this.setStorage(this.TITLES_KEY, newTitles),
      await this.removeStorage(title),
    ]);
  },

  /**
   * Get tab group from the storage by title
   * @param title: string
   * @returns {Promise<{ title, color, urls }>}
   */
  async getStorageGroup(title) {
    const { [title]: group } = await this.getStorage(title);

    return group;
  },

  /**
   * Get tab groups from the storage by titles
   * @returns {Promise<{ title, color, urls }[]>}
   */
  async getStorageGroups() {
    const { titles } = await this.getStorage(this.TITLES_KEY);

    return Promise.all(titles.map(async (title) => {
      return await this.getStorageGroup(title);
    }));
  },

  /**
   * Get window tab groups info by title (or all groups if title is undefined)
   * @param title: string | undefined
   * @param windowId: number
   * @returns {Promise<{ id, title, color }[]>}
   */
  async getWindowGroups(title = undefined, windowId = chrome.windows.WINDOW_ID_CURRENT) {
    return new Promise((resolve) => {
      chrome.tabGroups.query({ title, windowId }, (groups) => {
        const windowGroups = groups.map(this.toWindowGroup);

        resolve(windowGroups);
      });
    });
  },

  /**
   * Save window group to storage
   * @param title: string
   * @returns {Promise<{ title: string, color: string, urls: string[] }>}
   */
  async saveGroup(title) {
    const groups = await this.getWindowGroups(title);
    const color = groups[0].color;
    const groupIds = groups.map((it) => it.id);
    const windowTabs = await this.getWindowTabs();
    const urls = windowTabs
      .filter((it) => groupIds.includes(it.groupId))
      .map((it) => it.url);
    const newGroup = {
      title,
      color,
      urls,
    };

    await this.setStorageGroup(newGroup);

    return newGroup;
  },

  /**
   * Open storage group by its title with all of the urls in it
   * @param title: string
   * @returns {Promise<void>}
   */
  async openGroup(title) {
    const storageGroup = await this.getStorageGroup(title);

    if (storageGroup) {
      const { title, color, urls } = storageGroup;
      const tabs = await this.createTabs(urls);
      const tabIds = tabs.map((it) => it.id);
      const groupId = await this.combineTabs(tabIds);
      await this.updateGroup(groupId, { title, color, });
    }
  },

  /**
   * Get all window tabs
   * @param windowId: number
   * @returns {Promise<{ id, url, groupId }[]>}
   */
  async getWindowTabs(windowId = chrome.windows.WINDOW_ID_CURRENT) {
    return new Promise((resolve) => {
      chrome.tabs.query({ windowId }, resolve);
    });
  },

  /**
   * Create tabs from urls
   * @param urls: string[];
   * @returns {Promise<{ id, url, groupId }[]>}
   */
  async createTabs(urls) {
    return Promise.all(
      urls.map((url) => {
        return new Promise((resolve) => {
          chrome.tabs.create({ url, active: false }, resolve);
        });
      })
    );
  },

  /**
   * Create a tab group from tabIds
   * @param tabIds: number[]
   * @returns {Promise<number>}
   */
  async combineTabs(tabIds) {
    return new Promise((resolve) => {
      chrome.tabs.group({ tabIds }, resolve);
    });
  },

  /**
   * Update group
   * @param groupId: number
   * @param options: { title, color }
   * @returns {Promise<{ id, title, color }>}
   */
  async updateGroup(groupId, options) {
    return new Promise((resolve) => {
      chrome.tabGroups.update(groupId, options, resolve);
    });
  },
};
