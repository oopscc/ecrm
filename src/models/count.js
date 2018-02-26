import { fetchMyd, fetchScl} from '../services/count';
import { getTimeDistance } from '../utils/utils';

const data = {
    "survivalRate":{
            "titleName":"生存率统计",
            "survivalRateArr":[
                {
                    "resultCount":2,
                    "resultRate":1,
                    "stage":3,
                    "accordCount":2
                },
                {
                    "resultCount":3,
                    "resultRate":0.428571,
                    "stage":6,
                    "accordCount":7
                },
                {
                    "resultCount":1,
                    "resultRate":0.25,
                    "stage":18,
                    "accordCount":4
                }
            ],
            "reportMode":1
        },
        "diseaseRate":{
            "diseaseRateArr":[
                {
                    "resultRate":0.625,
                    "name":"霍乱"
                },
                {
                    "resultRate":0.375,
                    "name":"恶性肿瘤"
                }
            ],
            "titleName":"病种分布率统计",
            "reportMode":3
        },
        "cureModeRate":{
            "titleName":"疗效分布率统计",
            "cureModeRateArr":[
                {
                    "resultRate":0.64,
                    "name":"稳定,复发"
                },
                {
                    "resultRate":0.08,
                    "name":"手术治疗"
                },
                {
                    "resultRate":0.04,
                    "name":"手术治疗,化学治疗"
                },
                {
                    "resultRate":0.04,
                    "name":"手术治疗,靶向治疗"
                },
                {
                    "resultRate":0.04,
                    "name":"化学治疗"
                },
                {
                    "resultRate":0.04,
                    "name":"放射治疗"
                },
                {
                    "resultRate":0.04,
                    "name":"放射治疗,靶向治疗"
                },
                {
                    "resultRate":0.04,
                    "name":"靶向治疗,其他治疗"
                },
                {
                    "resultRate":0.04,
                    "name":"其他治疗"
                }
            ],
            "reportMode":3
        }
      }
export default {
    namespace: "count",
    state: {
        doctorData: {
            chartData: [],
            rankingData: []
        },
        deptData: {
            chartData: [],
            rankingData: []
        },
        hospitalData: {
            chartData: []
        },
        survivalLine: {
            titleName: '',
            data: []
        },
        survivalRate: {
            titleName: '',
            data: []
        },
        diseaseRate: {
            titleName: '',
            data: []
        },
        cureModeRate: {
            titleName: '',
            data: []
        }

    },
    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const year = getTimeDistance('year');
            const rangerTime = {
                beginTime: year[0].format('YYYY-MM-DD'),
                endTime: year[1].format('YYYY-MM-DD')
            }
            if (payload.currentDept) {
                yield put({
                    type: 'fetchMyd',
                    payload: {
                        mydType: 2,
                        id: payload.currentDept.id,
                        ...rangerTime
                    },
                });
            }
            if (payload.currentDoctor) {
                yield put({
                    type: 'fetchMyd',
                    payload: {
                        mydType: 3,
                        id: payload.currentDoctor.id,
                        ...rangerTime
                    },
                });
            }
            yield put({
                type: 'fetchMyd',
                payload: {
                    mydType: 1,
                    ...rangerTime
                },
            });
        },
        *fetchMyd({ payload, callback }, { call, put }) {
            const response = yield call(fetchMyd, payload);
            yield put({
                type: payload.mydType == 1? 'saveHospitalData': payload.mydType == 2 ? 'saveDeptData': 'saveDoctorData',
                payload: response.data,
            });
        },
        *fetchScl({ payload, callback }, { call, put }) {
            // const response = yield call(fetchScl, payload);
            const response = {data};
            yield put({
                type: 'saveSurvivalLine',
                payload: response.data.survivalRate,
            });
            yield put({
                type: 'saveSurvivalRate',
                payload: response.data.survivalRate,
            });
            yield put({
                type: 'saveDiseaseRate',
                payload: response.data.diseaseRate,
            });
            yield put({
                type: 'saveCureModeRate',
                payload: response.data.cureModeRate,
            });
        },
        *fetchDiseaseRate({ payload, callback }, { call, put }) {
            const response = yield call(fetchScl, payload);
            yield put({
                type: 'saveDiseaseRate',
                payload: response.data.diseaseRate,
            });
        },
        *fetchCureModeRate({ payload, callback }, { call, put }) {
            const response = yield call(fetchScl, payload);
            yield put({
                type: 'saveCureModeRate',
                payload: response.data.cureModeRate,
            });
        },
        
    },
    reducers: {
        saveHospitalData(state, { payload }) {
            return {
                ...state,
                hospitalData: {
                    ...state.hospitalData,
                    chartData: payload.chartArray.map(item => {
                        item.x = item.name;
                        item.y = item.score;
                        return item;
                    }),
                }
            };
        },
        saveDeptData(state, { payload }) {
            return {
                ...state,
                deptData: {
                    ...state.hospitalData,
                    chartData: payload.chartArray.map(item => {
                        item.x = item.name;
                        item.y = item.score;
                        return item;
                    }),
                    rankingData: [...payload.rankingArray]
                }
            };
        },
        saveDoctorData(state, { payload }) {
            return {
                ...state,
                doctorData: {
                    ...state.hospitalData,
                    chartData: payload.chartArray.map(item => {
                        item.x = item.name;
                        item.y = item.score;
                        return item;
                    }),
                    rankingData: [...payload.rankingArray]
                }
            };
        },
        saveSurvivalLine(state, { payload }) {
            return {
                ...state,
                survivalLine: {
                    ...state.survivalLine,
                    titleName: payload.titleName,
                    data: Array.from(payload.survivalRateArr, item => {
                        item.x = item.stage+'月';
                        item.y = item.resultRate * 100;
                        return item;
                    })
                }
            };
        },
        saveSurvivalRate(state, { payload }) {
            const res = [];
            const menu = {'accordCount': '符合人数', 'resultCount': '存活人数', 'resultRate': '生存率'};
            const data = {};
            payload.survivalRateArr.map(item => {
                data[`M${item.stage}`] = item;
            });
            for (let [key, title] of Object.entries(menu)) {
                const rObj = {
                    title,
                    M3: data.M3 && data.M3[key] || 0,
                    M6: data.M6 && data.M6[key] || 0,
                    M9: data.M9 && data.M9[key] || 0,
                    M12: data.M12 && data.M12[key] || 0,
                    M24: data.M24 && data.M24[key] || 0,
                    M36: data.M36 && data.M36[key] || 0,
                    M48: data.M48 && data.M48[key] || 0,
                    M60: data.M60 && data.M60[key] || 0,
                };
                res.push(rObj);
            }
            return {
                ...state,
                survivalRate: {
                    ...state.survivalRate,
                    titleName: payload.titleName,
                    data: [...res]
                }
            };
        },
        saveDiseaseRate(state, { payload }) {
            return {
                ...state,
                diseaseRate: {
                    ...state.diseaseRate,
                    titleName: payload.titleName,
                    data: payload.diseaseRateArr.map(item => {
                        item.x = item.name;
                        item.y = item.resultRate;
                        return item;
                    })
                }
            };
        },
        saveCureModeRate(state, { payload }) {
            return {
                ...state,
                cureModeRate: {
                    ...state.cureModeRate,
                    titleName: payload.titleName,
                    data: payload.cureModeRateArr.map(item => {
                        item.x = item.name;
                        item.y = item.resultRate;
                        return item;
                    })
                }
            };
        }
    },
};

