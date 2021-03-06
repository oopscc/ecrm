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
    fetchSMSTpls,
    addSMSTpl,
    editSMSTpl,
    deleteSMSTpl,
    getSMSTpl,
    getSmsSign,
    setSmsSign,
    saveHospital,
    getHospital
} from '../services/user';
import {
    message
} from 'antd';

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
        },
        SMSTpls: {
            list: [],
            pagination: {}
        },
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
                type: 'updateDept',
                payload: response,
            });
            message.success('添加成功');
        },
        *editDept({ payload }, { call, put }) {
            const response = yield call(editDept, payload);
            yield put({
                type: 'updateDept',
                payload: response,
            });
            message.success('修改成功');

        },
        *deleteDept({ payload }, { call, put }) {
            yield call(deleteDept, payload);
            yield put({
                type: 'deleteDeptById',
                payload,
            });
            message.success('删除成功');

        },
        /*==============system diseases=================*/

        *fetchDiseases({ payload }, { call, put }) {
            const response = yield call(fetchDiseases, payload);
            yield put({
                type: 'saveDiseases',
                payload: response,
            });
        },
        *addDisease({ payload, callback }, { call, put }) {
            const response = yield call(addDisease, payload);
            callback && callback(response);
            // message.success('添加成功');

        },
        *getDisease({ payload, callback }, { call, put }) {
            const response = yield call(getDisease, payload);
            callback && callback(response);
        },
        *editDisease({ payload, callback }, { call, put }) {
            const response = yield call(editDisease, payload);
            callback && callback(response);
            // message.success('修改成功');

        },
        *deleteDisease({ payload }, { call, put }) {
            yield call(deleteDisease, payload);
            yield put({
                type: 'deleteDiseaseById',
                payload,
            });
            message.success('删除成功');
        },
        /*==============system icd-10=================*/

        *fetchICDs({ payload }, { call, put }) {
            const response = yield call(fetchICDs, payload);
            yield put({
                type: 'saveICDs',
                payload: response,
            });
        },
        *getICD({ payload,callback }, { call, put }) {
            const response = yield call(getICD, payload);
            callback && callback(response);
        },
        *addICD({ payload, callback }, { call, put }) {
            const response = yield call(addICD, payload);
            callback && callback(response);
        },
        *editICD({ payload, callback }, { call, put }) {
            const response = yield call(editICD, payload);
            callback && callback(response);
        },
        *deleteICD({ payload }, { call, put }) {
            yield call(deleteICD, payload);
            yield put({
                type: 'deleteICDById',
                payload,
            });
            message.success('删除成功');
        },
        /*==============system SMSTpl=================*/

        *fetchSMSTpls({ payload }, { call, put }) {
            const response = yield call(fetchSMSTpls, { smsType: 0, ...payload });
            yield put({
                type: 'saveSMSTpls',
                payload: response,
            });
        },
        *fetchWjSMSTpl({ payload, callback }, { call, put }) {
            const response = yield call(fetchSMSTpls, {
                currentPage: 1,
                pageSize: 1,
                smsType: 1
            });
            if (callback) callback(response);
        },

        *addSMSTpl({ payload }, { call, put }) {
            const response = yield call(addSMSTpl, payload);
            yield put({
                type: 'updateSMSTpl',
                payload: response,
            });
            message.success('添加成功');
        },
        *editSMSTpl({ payload }, { call, put }) {
            const response = yield call(editSMSTpl, payload);
            yield put({
                type: 'updateSMSTpl',
                payload: response,
            });
            message.success('修改成功');

        },
        *deleteSMSTpl({ payload }, { call, put }) {
            yield call(deleteSMSTpl, payload);
            yield put({
                type: 'deleteSMSTplById',
                payload,
            });
            message.success('删除成功');
        },
        *getSMSTpl({ payload, callback }, { call, put }) {
            const response = yield call(getSMSTpl, payload);
            if (callback) callback(response);
        },
        *getSmsSign({ payload, callback }, { call, put }) {
            const response = yield call(getSmsSign, payload);
            if (callback) callback(response);
        },
        *setSmsSign({ payload, callback }, { call, put }) {
            const response = yield call(setSmsSign, payload);
            if (callback) callback(response);
        },
        /*==============system hosptial=================*/
        *saveHospital({ payload,callback }, { call, put }) {
            const response = yield call(saveHospital, payload);
            callback && callback(response);
        },
        *getHospital({ payload, callback }, { call, put }) {
            const response = yield call(getHospital, payload);
            callback && callback(response);
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
        updateDept(state, action) {
            const { id } = action.payload.data;
            return {
                ...state,
                depts: {
                    ...state.depts,
                    list: [action.payload.data, ...state.depts.list.filter(item => item.id != id)],
                },
            };
        },
        deleteDeptById(state, action) {
            const { id } = action.payload;
            return {
                ...state,
                depts: {
                    ...state.depts,
                    list: [...state.depts.list.filter(item => item.id != id)],
                },
            };
        },
        saveSMSTpls(state, action) {
            return {
                ...state,
                SMSTpls: {
                    list: action.payload.data.rows,
                    pagination: {
                        pageSize: action.payload.data.pageSize,
                        currentPage: action.payload.data.currentPage,
                        total: action.payload.data.total
                    }
                },
            };
        },
        updateSMSTpl(state, action) {
            const { id } = action.payload.data;
            return {
                ...state,
                SMSTpls: {
                    ...state.SMSTpls,
                    list: [action.payload.data, ...state.SMSTpls.list.filter(item => item.id != id)],
                },
            };
        },
        deleteSMSTplById(state, action) {
            const { id } = action.payload;
            return {
                ...state,
                SMSTpls: {
                    ...state.SMSTpls,
                    list: [...state.SMSTpls.list.filter(item => item.id != id)],
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
        deleteICDById(state, action) {
            const { id } = action.payload;
            return {
                ...state,
                ICDs: {
                    ...state.ICDs,
                    list: [...state.ICDs.list.filter(item => item.id != id)],
                },
            };
        },
        deleteDiseaseById(state, action) {
            const { id } = action.payload;
            return {
                ...state,
                diseases: {
                    ...state.diseases,
                    list: [...state.diseases.list.filter(item => item.id != id)],
                },
            };
        },
    },
};
