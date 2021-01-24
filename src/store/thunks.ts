import { distinct } from '../services/chrome/helpers';
import { TabGroup } from '../services/chrome/entities';
import {
  getStorageGroups,
  getWindowGroups,
  openGroup,
  removeStorageGroup,
  saveGroup,
} from '../services/chrome';
import { AppThunk } from './index';
import { actions, State } from './slice';

export const initStateAsync = (): AppThunk<State> => async (dispatch) => {
  try {
    const storageGroups = (await getStorageGroups()) as TabGroup[];
    const windowGroups = (await getWindowGroups()) as TabGroup[];

    const groups = distinct([...storageGroups, ...windowGroups]);
    const savedTitles = storageGroups.map((it) => it.title);

    dispatch(actions.setState({ groups, savedTitles }));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const saveGroupAsync = <T>(title: T): AppThunk<T> => async (
  dispatch,
) => {
  try {
    await saveGroup(title);
    dispatch(actions.saveGroup(title));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const removeGroupAsync = <T>(title: T): AppThunk<T> => async (
  dispatch,
) => {
  try {
    await removeStorageGroup(title);
    dispatch(actions.removeGroup(title));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const openGroupAsync = <T>(title: T): AppThunk<T> => async () => {
  try {
    await openGroup(title);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
