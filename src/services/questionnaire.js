import { stringify } from 'qs';
import request from '../utils/request';

const req = (url, params) => request(url, {
    method: 'POST',
    body: {
        ...params
    },
});

// 问卷列表
export async function queryWJs(params) {
    return req('/hospitalCRM/questionnaire/callwjList.do', params);
}

// 问卷随访模版
export async function getWJTplList(params) {
    return req('/hospitalCRM/questionnaire/wjTemplatePageQuery.do', params);
}
// 问卷模版详情
export async function getQuestionnaireTpl(params) {
    return req('/hospitalCRM/questionnaire/wjTemplateInfo.do', params);
}
// 新增问卷模版
export async function addQuestionnaireTpl(params) {
    return req('/hospitalCRM/questionnaire/addwjTemplate.do', params);
}

// 编辑问卷模版
export async function editQuestionnaireTpl(params) {
    return req('/hospitalCRM/questionnaire/editwjTemplate.do', params);
}
// 删除问卷模版
export async function deleteQuestionnaireTpl(params) {
    return req('/hospitalCRM/questionnaire/deletewjTemplate.do', params);
}

// 问卷详情
export async function getWJ(params) {
    return req('/hospitalCRM/questionnaire/callQuestionInfo.do', params);
}

// 提交问卷
export async function submitWJ(params) {
    return req('/hospitalCRM/questionnaire/submitwjAnswer.do', params);
}

