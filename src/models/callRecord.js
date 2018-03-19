import {
    getWaitCallCount,
    getWillCallNum,
    getWillCallList,
    getTodayCallList,
    getCallList,
    saveCallRes,
    getCallData,
    getCallDataByPhone
} from '../services/callRecord';

export default {
    namespace: 'callRecord',
    state: {
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
        //
        *getCallData({ payload, callback }, { call, put }) {
            const response = yield call(getCallData, payload);
            if (callback) callback(response);
        },
        *getCallDataByPhone({ payload, callback }, { call, put }) {
            const response = yield call(getCallDataByPhone, payload);
            if (callback) callback(response);
        },
        *save({ payload, callback }, { call, put }) {
            const response = yield call(saveCallRes, payload);
            if (callback) callback(response);
        },
        *getWillNum({ payload, callback }, { call, put }) {
            const response = yield call(getWillCallNum, payload);
            if (callback) callback(response);
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

