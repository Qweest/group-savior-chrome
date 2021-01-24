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

export interface Reducer<State, PartialState = State, Payload = any> {
  (state: State, action: Action<Payload>): PartialState;
}

export interface Action<Payload> {
  type: string;
  payload: Payload;
}

export interface Slice<State> {
  reducer: Reducer<State>;
  actions: SliceActions;
}

export interface SliceReducers<State> {
  [x: string]: Reducer<State, Partial<State>>;
}

export interface SliceActions<Payload = any> {
  [x: string]: (payload: Payload) => Action<Payload>;
}

export interface Thunk<State, Payload = any> {
  (dispatch: Dispatch<Payload>, getState: GetState<State>): void;
}
