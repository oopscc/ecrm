import {
  // queryCallRecords,
  // addCallRecord,
  // getCallRecord,
  // editCallRecord,
  getWaitCallCount,
  getWillCallNum,
  getWillCallList,
  getTodayCallList,
  getCallList,
  saveCallRes
} from '../services/callRecord';

export default {
  namespace: 'callRecord',

  state: {
    // data: {
    //   list: [],
    //   pagination: {}
    // },
    callList: {
      list: [],
      pagination: {}
    },
    todayCallList: {
      list: [],
      pagination: {}
    },
    willCallList: {
      list: [],
      pagination: {}
    },
    waitCallList: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    // *fetch({ payload }, { call, put }) {
    //   const response = yield call(queryCallRecords, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addCallRecord, payload);
    //   if (callback) callback();
    // },
    // *edit({ payload, callback }, { call, put }) {
    //   const response = yield call(editCallRecord, payload);
    //   if (callback) callback();
    // },

    // *get({ payload, callback }, { call, put }) {
    //   const response = yield call(getCallRecord, payload);
    //   if (callback) callback(response);
    // },


    *fetchWillCalls({ payload }, { call, put }) {
      const response = yield call(getWillCallList, payload);
      yield put({
        type: 'saveWillCallList',
        payload: response,
      });
    },
    *fetchWaitCalls({ payload }, { call, put }) {
      const response = yield call(getWaitCallList, payload);
      yield put({
        type: 'saveWaitCallList',
        payload: response,
      });
    },
    *fetchToadyCalls({ payload }, { call, put }) {
      const response = yield call(getTodayCallList, payload);
      yield put({
        type: 'saveTodayCallList',
        payload: response,
      });
    },
    *fetchCalls({ payload }, { call, put }) {
      const response = yield call(getCallList, payload);
      yield put({
        type: 'saveCallList',
        payload: response,
      });
    },

    *save({ payload, callback }, { call, put }) {
      const response = yield call(saveCallRes, payload);
      if (callback) callback();
    },
    *getWillNum({ payload, callback }, { call, put }) {
      const response = yield call(getWillCallNum, payload);
      if (callback) callback();
    },
    *getWaitNum({ payload, callback }, { call, put }) {
      const response = yield call(getWaitCallCount, payload);
      if (callback) callback(response);
    },

  },

  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //     data: {
    //       list: action.payload.data.rows,
    //       pagination: {
    //          pageSize: action.payload.data.pageSize,
    //          currentPage: action.payload.data.currentPage,
    //          total: action.payload.data.total
    //       }
    //     },
    //   };
    // },
    saveCallList(state, action) {
      return {
        ...state,
        callList: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
    saveTodayCallList(state, action) {
      return {
        ...state,
        todayCallList: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
    saveWillCallList(state, action) {
      return {
        ...state,
        willCallList: {
          list: action.payload.data.rows,
          pagination: {
             pageSize: action.payload.data.pageSize,
             currentPage: action.payload.data.currentPage,
             total: action.payload.data.total
          }
        },
      };
    },
    saveWaitCallList(state, action) {
      return {
        ...state,
        waitCallList: {
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

