const storeService = {
  state: {},
  reducers: {},

  listener: () => {},

  init({ initialState, reducers, listener }) {
    this.setState(initialState);
    this.reducers = reducers;
    this.listener = listener;
  },

  setState(newState) {
    this.state = {
      ...this.state,
      ...newState,
    };

    this.listener(this.state);
  },

  dispatch(action) {
    const newState = this.reducers[action.type](this.state, action);

    this.setState(newState);
  }
};