import { TabGroup } from './entities';

export const distinct = (groups: TabGroup[]): TabGroup[] => {
  return groups.reduce<TabGroup[]>((acc, it) => {
    const accTitles = acc.map((it) => it.title);

    if (accTitles.includes(it.title)) {
      return acc;
    }

    return [...acc, it];
  }, []);
};
