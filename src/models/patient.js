import { queryPatients, addPatient, getPatient, editPatient} from '../services/api';

export default {
  namespace: 'patient',

  state: {
    data: {
      list: [],
      pagination: {}
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
      // yield put({
      //   type: 'save',
      //   payload: payload,
      // });
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editPatient, payload);
      // yield put({
      //   type: 'save',
      //   payload: payload,
      // });
      if (callback) callback();
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getPatient, payload);
      if (callback) callback(response);
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
  },
};

