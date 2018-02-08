import {
    query as queryUsers,
    queryCurrent,
    fetchDepts,
    addDept,
    editDept,
    deleteDept,
    fetchDiseases,
    addDisease,
    editDisease,
    deleteDisease,
    getDisease,
    fetchICDs,
    addICD,
    editICD,
    deleteICD,
    getICD,
} from '../services/user';

export default {
    namespace: 'system',

    state: {
        list: [],
        currentUser: {},
        depts: {
            list: [],
            pagination: {}
        },
        ICDs: {
            list: [],
            pagination: {}
        },
        diseases: {
            list: [],
            pagination: {}
        }
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
        /*==============system depts=================*/

        *fetchDepts({ payload }, { call, put }) {
            const response = yield call(fetchDepts, payload);
            yield put({
                type: 'saveDepts',
                payload: response,
            });
        },
        *addDept({ payload }, { call, put }) {
            const response = yield call(addDept, payload);
            yield put({
                type: 'addDept',
                payload: response,
            });
            if (callback) callback();
        },
        *editDept({ payload }, { call, put }) {
            const response = yield call(editDept, payload);
        },
        *deleteDept({ payload }, { call, put }) {
            yield call(deleteDept, payload);
        },
        /*==============system diseases=================*/

        *fetchDiseases({ payload }, { call, put }) {
            const response = yield call(fetchDiseases, payload);
            yield put({
                type: 'saveDiseases',
                payload: response,
            });
        },
        *addDisease({ payload }, { call, put }) {
            const response = yield call(addDisease, payload);
            if (callback) callback();
        },
        *getDisease({ payload }, { call, put }) {
            const response = yield call(getDisease, payload);
            if (callback) callback(response);
        },
        *editDisease({ payload }, { call, put }) {
            const response = yield call(editDisease, payload);
        },
        *deleteDisease({ payload }, { call, put }) {
            yield call(deleteDisease, payload);
        },
        /*==============system icd-10=================*/

        *fetchICDs({ payload }, { call, put }) {
            const response = yield call(fetchICDs, payload);
            yield put({
                type: 'saveICDs',
                payload: response,
            });
        },
        *getICD({ payload }, { call, put }) {
            const response = yield call(getICD, payload);
        },
        *addICD({ payload }, { call, put }) {
            const response = yield call(addICD, payload);
        },
        *editICD({ payload }, { call, put }) {
            const response = yield call(editICD, payload);
        },
        *deleteICD({ payload }, { call, put }) {
            yield call(deleteICD, payload);
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
        saveDepts(state, action) {
            return {
                ...state,
                depts: {
                    list: action.payload.data.rows,
                    pagination: {
                        pageSize: action.payload.data.pageSize,
                        currentPage: action.payload.data.currentPage,
                        total: action.payload.data.total
                    }
                },
            };
        },
        addDept(state, action) {
            return {
                ...state,
                depts: {
                    ...state.depts,
                    list: [action.payload.data, ...state.depts.list],
                },
            };
        },
        saveDiseases(state, action) {
            return {
                ...state,
                diseases: {
                    list: action.payload.data.rows,
                    pagination: {
                        pageSize: action.payload.data.pageSize,
                        currentPage: action.payload.data.currentPage,
                        total: action.payload.data.total
                    }
                },
            };
        },
        saveICDs(state, action) {
            return {
                ...state,
                ICDs: {
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
