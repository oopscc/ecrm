English | [简体中文](./README.zh-CN.md)

# Ant Design Pro

[![](https://img.shields.io/travis/ant-design/ant-design-pro/master.svg?style=flat-square)](https://travis-ci.org/ant-design/ant-design-pro) [![Build status](https://ci.appveyor.com/api/projects/status/67fxu2by3ibvqtat/branch/master?svg=true)](https://ci.appveyor.com/project/afc163/ant-design-pro/branch/master)  [![Gitter](https://badges.gitter.im/ant-design/ant-design-pro.svg)](https://gitter.im/ant-design/ant-design-pro?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

An out-of-box UI solution for enterprise applications as a React boilerplate.

![](https://gw.alipayobjects.com/zos/rmsportal/xEdBqwSzvoSapmnSnYjU.png)

- Preview: http://preview.pro.ant.design
- Home Page: http://pro.ant.design
- Documentation: http://pro.ant.design/docs/getting-started
- ChangeLog: http://pro.ant.design/docs/changelog
- FAQ: http://pro.ant.design/docs/faq

## Translation Recruitment :loudspeaker:

We need your help: https://github.com/ant-design/ant-design-pro/issues/120

## Features

- :gem: **Neat Design**: Follow [Ant Design specification](http://ant.design/)
- :triangular_ruler: **Common Templates**: Typical templates for enterprise applications
- :rocket: **State of The Art Development**: Newest development stack of React/dva/antd
- :iphone: **Responsive**: Designed for varies of screen size
- :art: **Themeing**: Customizable theme with simple config
- :globe_with_meridians: **International**: Built-in i18n solution
- :gear: **Best Practice**: Solid workflow make your code health
- :1234: **Mock development**: Easy to use mock development solution
- :white_check_mark: **UI Test**: Fly safely with unit test and e2e test

## Templates

```
- Dashboard
  - Analytic
  - Monitor
  - Workspace
- Form
  - Basic Form
  - Step Form
  - Advanced From
- List
  - Standard Table
  - Standard List
  - Card List
  - Search List (Project/Applications/Article)
- Profile
  - Simple Profile
  - Advanced Profile
- Result
  - Success
  - Failed
- Exception
  - 403
  - 404
  - 500
- User
  - Login
  - Register
  - Register Result
```

## Usage

```bash
$ git clone https://github.com/ant-design/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # visit http://localhost:8000
```

Or you can use the command tool: [ant-design-pro-cli](https://github.com/ant-design/ant-design-pro-cli)

```bash
$ npm install ant-design-pro-cli -g
$ mkdir pro-demo && cd pro-demo
$ pro new
```

More instruction at [documentation](http://pro.ant.design/docs/getting-started).

## Compatibility

Modern browsers and IE11.

## Contributing

Any Contribution of following ways will be welcome:

- Use Ant Design Pro in your daily work.
- Submit [issue](http://github.com/ant-design/ant-design-pro/issues) to report bug or ask questions.
- Propose [pull request](http://github.com/ant-design/ant-design-pro/pulls) to improve our code.


### 医院随访
0. 首页
1. 常用功能
  1. 全部患者列表
  2. 待随访列表
  3. 已随访列表
  4. 分配随访任务

2. 随访患者管理
  1. 全部患者列表
    2. 新增患者
    3. 患者列表（excel批量导入）
    4. 住院信息列表
    5. 新增住院信息
    6. 患者历史随访信息列表
    7. 新增、修改随访信息
    8. 查看患者随访问卷列表
    9. 患者问卷详情
  2. 随访患者管理
    0. title 今日已随访患者，总随访患者，我的待随访任务    action：分配随访任务，查看任务进展
    1. 我的待随访患者列表
      1. title 已随访人数、随访总人数、待随访任务
      2. 我的待随访患者列表
      2. 发送短信页面（单个，批量）。
      3. 电话随访页面
    2. 已随访患者列表
    3. 总随访患者列表
   
3. 随访任务管理
  1. 分配随访任务
    1. 随访任务列表
    2. 新增随访任务（分步）
      3. 条件查询患者列表
      4. 设置条件，新建任务
     
  2. 我的待随访任务列表
    3. 我的随访任务列表
    4. 我的随访任务详情
    5. 短信随访页面（一个或者批量）
    6. 电话随访页面
      7. 随访历史列表
      8. 诊断历史列表
      9. 随访问卷列表
      10. 调查问卷，生成调查问卷，可以操作帮助填写调查问卷。
      11. 短信交互历史
      12. 患者信息
      13. 随访结果
  3. 查看随访任务进展，我权限内的所有任务列表
    4. 随访任务列表，删除任务
    5. 新建随访任务（同分配随访任务）
    5. 任务详情
4.随访结果统计
  2. 随访结果统计
  
5. 系统管理
  2. 随访人员管理
    3. 新增随访人员
    4. 随访人员列表
    5. 分配角色
  3. 模版管理
    1. 短信模版
    2. 调查问卷模版
  4. 病种管理
  5. 科室管理

