import React, { useEffect, useState } from 'react';

import { distinct } from '../../services/chrome/helpers';
import { TabGroup } from '../../services/chrome/entities';
import {
  clearStorage,
  getStorageGroups,
  getWindowGroups,
  saveAllGroups,
} from '../../services/chrome';
import Group from '../Group';
import {
  Wrapper,
  GroupsWrapper,
  Separator,
  ActionsWrapper,
  AddAll,
  RemoveAll,
} from './styles';

const App: React.FC = () => {
  const [groups, setGroups] = useState<TabGroup[]>([]);
  const [allSaved, setAllSaved] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storageGroups = (await getStorageGroups()) as TabGroup[];
      const windowGroups = (await getWindowGroups()) as TabGroup[];

      const groups = distinct([...storageGroups, ...windowGroups]);

      setGroups(groups);
      setAllSaved(storageGroups.length === groups.length);
    };

    init();
  }, []);

  const handleRemoved = async (title: string) => {
    const [windowGroup] = await getWindowGroups(title);

    if (!windowGroup) {
      setGroups(groups.filter((it) => it.title !== title));
    }

    setAllSaved(false);
  };

  const handleSaved = async () => {
    const storageGroups = (await getStorageGroups()) as TabGroup[];

    setAllSaved(storageGroups.length === groups.length);
  };

  const handleSaveAll = async () => {
    const storageGroups = (await saveAllGroups()) as TabGroup[];

    setGroups(storageGroups);
    setAllSaved(true);
  };

  const handleRemoveAll = async () => {
    await clearStorage();
    const windowGroups = (await getWindowGroups()) as TabGroup[];

    setGroups(windowGroups);
    setAllSaved(false);
  };

  return (
    <Wrapper>
      <GroupsWrapper>
        {groups.map((group) => {
          return (
            <Group
              key={group.title}
              group={group}
              onRemoved={handleRemoved}
              onSaved={handleSaved}
            />
          );
        })}
      </GroupsWrapper>
      <Separator />
      <ActionsWrapper>
        <AddAll
          size={32}
          title="Save all groups"
          $saved={allSaved}
          onClick={handleSaveAll}
        />
        <RemoveAll
          size={32}
          title="Remove all groups"
          onClick={handleRemoveAll}
        />
      </ActionsWrapper>
    </Wrapper>
  );
};

export default App;
