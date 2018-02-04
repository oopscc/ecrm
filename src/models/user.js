import { query as queryUsers, queryCurrent,
  addUser,
  editUser,
  getUser,
} from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    
    *getUser({ payload, callback }, { call, put }) {
      const response = yield call(getUser, payload);
      if (callback) callback(response);
    },
    *addUser({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      if (callback) callback(response);
    },
    *editUser({ payload, callback }, { call, put }) {
      const response = yield call(editUser, payload);
      if (callback) callback(response);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
