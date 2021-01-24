import {
  initStateAsync,
  saveGroupAsync,
  removeGroupAsync,
  openGroupAsync,
} from './store/thunks';
import store from './store';
import { COLORS } from './services/chrome/constants';

(() => {
  const root = document.getElementById('root')!;
  const { dispatchThunk, subscribe, getState } = store;

  subscribe(render);
  dispatchThunk(initStateAsync());

  const handleTitleClick = (title: string) => () => {
    const { savedTitles } = getState();

    if (savedTitles.includes(title)) {
      dispatchThunk(openGroupAsync(title));
      return;
    }

    dispatchThunk(saveGroupAsync(title));
  };

  const handleDotClick = (title: string) => () => {
    const { savedTitles } = getState();

    if (savedTitles.includes(title)) {
      dispatchThunk(removeGroupAsync(title));
      return;
    }

    dispatchThunk(saveGroupAsync(title));
  };

  const renderGroups = (): Node[] => {
    const { groups, savedTitles } = getState();

    return groups.map((group) => {
      const { title, color } = group;
      const isSaved = savedTitles.includes(title);

      const groupWrapper = document.createElement('div');
      groupWrapper.classList.add('group-wrapper');

      const groupTitle = document.createElement('span');
      groupTitle.innerText = title;
      groupTitle.classList.add('group-title');
      groupTitle.classList.add('scale-anim');
      groupTitle.classList.toggle('group-title-saved', isSaved);
      groupTitle.style.backgroundColor = COLORS[color];
      groupTitle.addEventListener('click', handleTitleClick(title));

      const saveDot = document.createElement('div');
      saveDot.classList.add('save-dot', 'scale-anim');
      saveDot.style.backgroundColor = COLORS[color];
      saveDot.title = 'Click to save/remove group';
      saveDot.addEventListener('click', handleDotClick(title));

      groupWrapper.append(groupTitle, saveDot);

      return groupWrapper;
    });
  };

  function render() {
    const groups = renderGroups();

    root.innerText = '';
    root.append(...groups);
  }
})();
