export interface Store<State, Payload> {
  getState: GetState<State>;
  dispatch: Dispatch<Payload>;
  dispatchThunk: DispatchThunk<State, Payload>;
  subscribe: (listener: () => void) => void;
}

export interface GetState<State> {
  (): State;
}

export interface Dispatch<Payload> {
  (action: Action<Payload>): Action<Payload>;
}

export interface DispatchThunk<State, Payload> {
  (thunk: Thunk<State, Payload>): void;
}

export interface Reducer<State, Payload> {
  (state: State, action: Action<Payload>): State;
}

export interface Action<Payload> {
  type: string;
  payload: Payload;
}

export interface Slice<State, Payload> {
  reducer: Reducer<State, Payload>;
  actions: SliceActions<Payload>;
}

export interface SliceReducers<State> {
  [x: string]: Reducer<Partial<State>, any>;
}

export interface SliceActions<Payload> {
  [x: string]: (payload: Payload) => Action<Payload>;
}

export interface Thunk<State, Payload> {
  (dispatch: Dispatch<Payload>, getState: GetState<State>): void;
}
