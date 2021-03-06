export interface TabGroup {
  title: string;
  color: string;
}

export interface WindowGroup extends TabGroup {
  id: number;
  collapsed: boolean;
}

export interface StorageGroup extends TabGroup {
  urls: string[];
}

export interface WindowTab {
  id: number;
  groupId: number;
  url: string;
}
