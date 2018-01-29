import {
  getSmsList,
  sendSms,
  getTplList
} from '../services/sms';


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
      const response = yield call(getSmsList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *send({ payload, callback }, { call, put }) {
      const response = yield call(sendSms, payload);
      if (callback) callback();
    },
    
    *fetchTpls({ payload }, { call, put }) {
      const response = yield call(getTplList, payload);
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

