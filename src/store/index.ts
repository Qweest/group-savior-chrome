import { Action, Thunk } from '../services/redux/entities';
import { createStore } from '../services/redux';
import reducer, { State } from './slice';

const store = createStore(reducer);

export type AppThunk<Payload> = Thunk<State, Action<Payload>>;

export default store;
