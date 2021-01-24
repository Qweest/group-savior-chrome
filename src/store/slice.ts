import { TabGroup } from '../services/chrome/entities';
import { Action } from '../services/redux/entities';
import { createSlice } from '../services/redux';

export interface State {
  groups: TabGroup[];
  savedTitles: string[];
}

const initialState: State = {
  groups: [],
  savedTitles: [],
};

const slice = createSlice(initialState, {
  setState(state, action: Action<State>) {
    const { groups, savedTitles } = action.payload;

    return {
      groups,
      savedTitles,
    };
  },
  saveGroup(state, action: Action<string>) {
    const title = action.payload;

    return {
      savedTitles: [...state.savedTitles, title],
    };
  },
  removeGroup(state, action: Action<string>) {
    const title = action.payload;

    return {
      savedTitles: state.savedTitles.filter((it) => it !== title),
    };
  },
});

export const { actions } = slice;

export default slice.reducer;
