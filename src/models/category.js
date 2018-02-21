import * as API from '../services/category';
// aop自定义前端字典
// 性别
const SEX = [{
    id: 0, name: '女'
},{
    id: 1, name: '男'
},]

export default {
    namespace: "category",
    state: {
        callRes: [],
        WJTpls: [],
        SMSTpls: [],
        Cures: [],
        Depts: [],
        Diseases: [],
        PStates: [],
        Users: [],
        Pays: [],
        Anesthesias: [],
    },
    effects: {
        // 问卷模版
        *fetchWJTpls({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchWJTpls, payload);
            yield put({
				type: 'saveWJTpls',
				payload: response.data.questionnaireArray,
            });
            if (callback) callback(response);
        },
        // 短信
        *fetchSMSTpls({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchSMSTpls, payload);
            yield put({
				type: 'saveSMSTpls',
				payload: response.data.smsArray,
            });
            if (callback) callback(response);
        },
        // 科室
        *fetchDepts({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchDepts, payload);
            yield put({
				type: 'saveDepts',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },
        // 病种
        *fetchDiseases({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchDiseases, payload);
            yield put({
				type: 'saveDiseases',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },
        //患者状态
        *fetchPStates({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchPStates, payload);
            yield put({
				type: 'savePStates',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },
        //人员
        *fetchUsers({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchUsers, payload);
            yield put({
				type: 'saveUsers',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },
        //付费方式
        *fetchPays({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchPays, payload);
            yield put({
				type: 'savePays',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },
        //麻醉方式
        *fetchAnesthesias({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchAnesthesias, payload);
            yield put({
				type: 'saveAnesthesias',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },
        //治疗方式
        *fetchCures({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchCures, payload);
            yield put({
				type: 'saveCures',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },
        //随访结果
        *fetchCallRes({ payload, callback }, { call, put }) {
            const response = yield call(API.fetchCallRes, payload);
            yield put({
				type: 'saveCallRes',
				payload: response.data.contentArray,
            });
            if (callback) callback(response);
        },

    },
    reducers: {
        save(state, action) {
            return {
                ...state,
            };
        },
        saveCallRes(state, { payload }) {
			return {
				...state,
				callRes: payload,
			};
        },
        saveWJTpls(state, { payload }) {
			return {
				...state,
				WJTpls: payload,
			};
        },
        saveSMSTpls(state, { payload }) {
			return {
				...state,
				SMSTpls: payload,
			};
        },
        saveCures(state, { payload }) {
			return {
				...state,
				Cures: payload,
			};
        },
        saveDepts(state, { payload }) {
			return {
				...state,
				Depts: payload,
			};
        },
        saveDiseases(state, { payload }) {
			return {
				...state,
				Diseases: payload,
			};
        },
        savePStates(state, { payload }) {
			return {
				...state,
				PStates: payload,
			};
        },
        saveUsers(state, { payload }) {
			return {
				...state,
				Users: payload,
			};
        },
        savePays(state, { payload }) {
			return {
				...state,
				Pays: payload,
			};
        },
        saveAnesthesias(state, { payload }) {
			return {
				...state,
				Anesthesias: payload,
			};
        },
        /**
         *
         * @param {*} state
         * @param {*} param1
         */
        // saveCumtomer(state, { payload }) {
		// 	return {
		// 		...state,
		// 		cumtomer: payload,
		// 	};
        // }
    },
};

