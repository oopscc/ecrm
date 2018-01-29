import {
  queryWJs,
  getQuestionnaire,
  getWJTplList,
} from '../services/questionnaire';


export default {
  namespace: 'sms',

  state: {
    data: {
      list: [],
      pagination: {}
    },
    tplList: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryWJs, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *get({ payload, callback }, { call, put }) {
      const response = yield call(getQuestionnaire, payload);
      if (callback) callback();
    },
    
    *fetchTpls({ payload }, { call, put }) {
      const response = yield call(getWJTplList, payload);
      yield put({
        type: 'saveTpls',
        payload: response,
      });
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
    saveTpls(state, action) {
      return {
        ...state,
        tplList: {
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

