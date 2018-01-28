import { queryPatients, addPatient, getPatient, editPatient, queryDiagnoses} from '../services/api';

export default {
  namespace: 'patient',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    diagnosesData: {
      list: [],
      pagination: {}
    }
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
      if (callback) callback();
    },
    *edit({ payload, callback }, { call, put }) {
      const response = yield call(editPatient, payload);
      if (callback) callback();
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getPatient, payload);
      if (callback) callback(response);
    },
    *fetchDiagnose({ payload }, { call, put }) {
      const response = yield call(queryDiagnoses, payload);
      yield put({
        type: 'saveDiagnoses',
        payload: response,
      });
    },
    *addDiagnose({ payload, callback }, { call, put }) {
      const response = yield call(addPatient, payload);
      if (callback) callback();
    },
    *editDiagnose({ payload, callback }, { call, put }) {
      const response = yield call(editPatient, payload);
      if (callback) callback();
    },
    *getDiagnose({ payload, callback }, { call, put }) {
      const response = yield call(getPatient, payload);
      if (callback) callback(response);
    },

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
    saveDiagnose(state, action) {
      return {
        ...state,
        diagnosesData: {
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

