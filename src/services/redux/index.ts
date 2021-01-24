import { Reducer, Slice, SliceActions, SliceReducers, Store } from './entities';

export const createStore = <State, Payload>(
  reducer: Reducer<State, State, Payload>,
): Store<State, Payload> => {
  let state: State;
  let onStateChange = () => {};

  const store: Store<State, Payload> = {
    getState() {
      return state;
    },
    dispatch(action) {
      state = reducer(state, action);
      onStateChange();

      return action;
    },
    dispatchThunk(thunk) {
      thunk(this.dispatch, this.getState);
    },
    subscribe(listener) {
      onStateChange = listener;
    },
  };

  store.dispatchThunk = store.dispatchThunk.bind(store);

  return store;
};

export const createSlice = <State>(
  initialState: State,
  reducers: SliceReducers<State>,
): Slice<State> => {
  const actionTypes = Object.keys(reducers);

  const actionCreators = actionTypes.reduce<SliceActions>(
    (acc, type) => ({
      ...acc,
      [type]: (payload) => ({ type, payload }),
    }),
    {},
  );

  const mainReducer: Reducer<State> = (state = initialState, action) => {
    const newData = reducers[action.type](state, action);

    return {
      ...state,
      ...newData,
    };
  };

  return { actions: actionCreators, reducer: mainReducer };
};
