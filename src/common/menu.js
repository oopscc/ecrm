import { isUrl } from '../utils/utils';

const menuData = [{
    name: '首页',
    icon: 'dashboard',
    path: 'index'
}, {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    hideInMenu: true,
    children: [{
        name: '分析页',
        path: 'analysis',
    }, {
        name: '监控页',
        path: 'monitor',
    }, {
        name: '工作台',
        path: 'workplace',
        hideInMenu: true,
    }],
}, {
    name: '表单页',
    icon: 'form',
    path: 'form',
    hideInMenu: true,
    children: [{
        name: '基础表单',
        path: 'basic-form',
    }, {
        name: '分步表单',
        path: 'step-form',
    }, {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
    }],
}, {
    name: '患者管理',
    icon: 'user',
    path: 'patient',
    children: [{
        name: '患者列表',
        path: 'list'
    }, {
        name: '患者信息',
        path: 'info',
        hideInMenu: true,
    }, {
        name: '住院信息列表',
        path: 'diagnoseList',
        hideInMenu: true,
    }, {
        name: '住院信息',
        path: 'diagnoseInfo',
        hideInMenu: true,
    }, {
        name: '随访历史记录列表',
        path: 'flupList',
        hideInMenu: true,
    }, {
        name: '随访信息',
        path: 'flupInfo',
        hideInMenu: true,
    }, {
        name: '患者历史问卷',
        path: 'questList',
        hideInMenu: true,
    }, {
        name: '待随访患者',
        path: 'willFlup',
    }, {
        name: '已随访患者',
        path: 'fluped',
    }, {
        name: '今日已随访患者',
        path: 'todayFluped',
    }],
}, {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    hideInMenu: true,
    children: [{
        name: '基础详情页',
        path: 'basic',
    }, {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
    }],
}, {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    hideInMenu: true,
    children: [{
        name: '成功',
        path: 'success',
    }, {
        name: '失败',
        path: 'fail',
    }],
}, {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    hideInMenu: true,
    children: [{
        name: '403',
        path: '403',
    }, {
        name: '404',
        path: '404',
    }, {
        name: '500',
        path: '500',
    }, {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
    }],
}, {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [{
        name: '登录',
        path: 'login',
    }, {
        name: '注册',
        path: 'register',
    }, {
        name: '注册结果',
        path: 'register-result',
    }],
}, {
    name: '随访任务管理',
    icon: 'user',
    path: 'task',
    children: [{
        name: '随访任务列表',
        path: 'list',
    }, {
        name: '分配随访任务',
        // 条件查询患者列表 －> 设置条件，新建任务
        path: 'taskAdd',
    }, {
        name: '随访任务详情',
        path: 'detail',
    }, {
        name: '短信随访页面',
        path: 'sms',
    }, {
        name: '电话随访页面',
        // 短信历史，问卷历史，随访历史
        path: 'call',
    }],
}, {
    name: '随访结果统计',
    icon: 'user',
    path: 'count',
    children: [{
        name: '生存率统计',
        path: 'scl',
    }, {
        name: '满意度统计',
        path: 'myd',
    }],
}, , {
    name: '系统管理',
    icon: 'user',
    path: 'system',
    children: [{
        name: '随访人员管理',
        path: 'user',
        children: [{
            name: '人员列表－分配权限',
            path: 'list',
        }, {
            name: '新增人员',
            path: 'info',
        }]
    }, {
        name: '模版管理',
        path: 'Tpl',
        children: [{
            name: '短信模版列表',
            path: 'smsTpl',
        }, {
            name: '问卷模版列表',
            path: 'questionTpl',
        }, {
            name: '新增问卷模版',
            path: 'questionInfo',
        }, {
            name: '问卷详情',
            path: 'wj',
        }]
    }, {
        name: '病种管理',
        path: 'diagnoseList',
        children: [{
            name: '列表',
            path: 'list',
        }, {
            name: '新增',
            path: 'info',
        }]
    }, {
        name: '疾病管理',
        path: 'icd-10',
        children: [{
            name: '列表',
            path: 'list',
        }, {
            name: '新增',
            path: 'info',
        }]
    }, {
        name: '科室管理',
        path: 'dept',
        children: [{
            name: '列表',
            path: 'list',
        }, {
            name: '新增',
            path: 'info',
        }]
    }],
}];

function formatter(data, parentPath = '', parentAuthority) {
    return data.map((item) => {
        let { path } = item;
        if (!isUrl(path)) {
            path = parentPath + item.path;
        }
        const result = {
            ...item,
            path,
            authority: item.authority || parentAuthority,
        };
        if (item.children) {
            result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
        }
        return result;
    });
}

export const getMenuData = () => formatter(menuData);
