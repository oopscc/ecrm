import { queryPatients, addPatient } from '../services/api';

export default {
  namespace: 'patient',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPatients, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addPatient, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

