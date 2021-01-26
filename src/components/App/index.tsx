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
  InfoText,
  Header,
  GroupsWrapper,
  Separator,
  ActionsWrapper,
  AddAll,
} from './styles';
import { REPO_URL } from './constants';

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
    if (!allSaved) {
      const storageGroups = (await saveAllGroups()) as TabGroup[];

      setGroups(storageGroups);
      setAllSaved(true);
      return;
    }

    await clearStorage();
    const windowGroups = (await getWindowGroups()) as TabGroup[];

    setGroups(windowGroups);
    setAllSaved(false);
  };

  return (
    <Wrapper>
      <Header href={REPO_URL} target="_blank">
        Group Saviour
      </Header>
      {groups.length ? (
        <React.Fragment>
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
              size={24}
              title="Save all groups"
              $saved={allSaved}
              onClick={handleSaveAll}
            />
          </ActionsWrapper>
        </React.Fragment>
      ) : (
        <InfoText>
          No groups detected. Please create at least one tab group to manage
          it...
        </InfoText>
      )}
    </Wrapper>
  );
};

export default App;
