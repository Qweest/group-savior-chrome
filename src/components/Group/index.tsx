import React, { useEffect, useState } from 'react';

import { TabGroup } from '../../services/chrome/entities';
import {
  getStorage,
  openGroup,
  removeStorageGroup,
  saveGroup,
} from '../../services/chrome';
import { Wrapper, Title, RemoveButton } from './styles';

interface Props {
  group: TabGroup;
  onRemoved: (title: string) => void;
  onSaved: (title: string) => void;
}

const Group: React.FC<Props> = (props) => {
  const { group, onRemoved, onSaved } = props;
  const { title, color } = group;
  const [saved, setSaved] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  useEffect(() => {
    const init = async () => {
      const storageGroup = await getStorage(title);

      setSaved(!!storageGroup);
    };

    init();
  }, [group]);

  const handleTitleClick = async () => {
    if (saved) {
      return await openGroup(title);
    }

    await saveGroup(title);
    setSaved(true);
    setShowRemove(true);
    onSaved(title);
  };

  const handleRemoveClick = async () => {
    await removeStorageGroup(title);
    setSaved(false);
    setShowRemove(false);
    onRemoved(title);
  };

  const handleMouseOver = () => {
    if (saved) {
      setShowRemove(true);
    }
  };

  const handleMouseLeave = () => {
    if (saved) {
      setShowRemove(false);
    }
  };

  return (
    <Wrapper onMouseEnter={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <Title onClick={handleTitleClick} color={color} saved={saved}>
        {title}
      </Title>
      <RemoveButton onClick={handleRemoveClick} $show={showRemove} />
    </Wrapper>
  );
};

export default Group;
