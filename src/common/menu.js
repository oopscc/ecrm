import { isUrl } from '../utils/utils';

const menuData = [{
  name: 'dashboard',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: '分析页',
    path: 'analysis',
  }, {
    name: '监控页',
    path: 'monitor',
  }, {
    name: '工作台',
    path: 'workplace',
    // hideInMenu: true,
  }],
}, {
  name: '表单页',
  icon: 'form',
  path: 'form',
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
    name: '全部患者列表',
    path: 'list',
  }, {
    name: '患者信息',
    path: 'info',
  }, {
    name: '住院信息列表',
    path: 'diagnoseList',
  }, {
    name: '住院信息',
    path: 'diagnoseInfo',
  }, {
    name: '待随访患者',
    path: 'todo',
  }, {
    name: '已随访患者',
    path: 'todo',
  }],
}, {
  name: '详情页',
  icon: 'profile',
  path: 'profile',
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
},{
  name: '随访任务管理',
  icon: 'user',
  path: 'task',
  children: [{
    name: '随访任务列表',
    path: 'todo',
  }, {
    name: '分配随访任务(分步式)',
    // 条件查询患者列表 －> 设置条件，新建任务
    path: 'todo',
  }, {
    name: '随访任务详情',
    path: 'todo',
  }, {
    name: '短信随访页面',
    path: 'todo',
  }, {
    name: '电话随访页面',
    path: 'todo',
  }],
},, {
  name: '随访结果统计',
  icon: 'user',
  path: 'patient',
  children: [{
    name: '饼图',
    path: 'todo',
  }, {
    name: '折线图',
    path: 'todo',
  }],
},, {
  name: '系统管理',
  icon: 'user',
  path: 'systom',
  children: [{
    name: '随访人员管理',
    path: 'list',
    children: [{
      name: '人员列表－分配权限',
      path: 'todo',
    },{
      name: '新增人员',
      path: 'todo',
    }]
  }, {
    name: '模版管理',
    path: 'info',
    children: [{
      name: '短信模版',
      path: 'todo',
    },{
      name: '问卷模版',
      path: 'todo',
    }]
  }, {
    name: '病种管理',
    path: 'diagnoseList',
    children: [{
      name: '列表',
      path: 'todo',
    },{
      name: '新增',
      path: 'todo',
    }]
  }, {
    name: '科室管理',
    path: 'diagnoseInfo',
    children: [{
      name: '列表',
      path: 'todo',
    },{
      name: '新增',
      path: 'todo',
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
