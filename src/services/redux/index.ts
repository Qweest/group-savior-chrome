import { Reducer, Slice, SliceActions, SliceReducers, Store } from './entities';

export const createStore = <State, Payload>(
  reducer: Reducer<State, Payload>,
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

export const createSlice = <State, Payload>(
  initialState: State,
  reducers: SliceReducers<State>,
): Slice<State, Payload> => {
  const actionTypes = Object.keys(reducers);
  console.log(actionTypes);

  const actionCreators = actionTypes.reduce<SliceActions<Payload>>(
    (acc, type) => ({
      ...acc,
      [type]: (payload) => ({ type, payload }),
    }),
    {},
  );

  console.log(actionCreators);

  const mainReducer: Reducer<State, Payload> = (
    state = initialState,
    action,
  ) => {
    console.log(action);
    console.log(reducers[action.type]);
    const newData = reducers[action.type](state, action);

    return {
      ...state,
      ...newData,
    };
  };

  return { actions: actionCreators, reducer: mainReducer };
};
