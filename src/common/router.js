import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
    // () => require('module')
    // transformed by babel-plugin-dynamic-import-node-sync
    if (component.toString().indexOf('.then(') < 0) {
        models.forEach((model) => {
            if (modelNotExisted(app, model)) {
                // eslint-disable-next-line
                app.model(require(`../models/${model}`).default);
            }
        });
        return (props) => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return createElement(component().default, {
                ...props,
                routerData: routerDataCache,
            });
        };
    }
    // () => import('module')
    return dynamic({
        app,
        models: () => models.filter(
            model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
            ),
        // add routerData prop
        component: () => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return component().then((raw) => {
                const Component = raw.default || raw;
                return props => createElement(Component, {
                    ...props,
                    routerData: routerDataCache,
                });
            });
        },
    });
};

function getFlatMenuData(menus) {
    let keys = {};
    menus.forEach((item) => {
        if (item.children) {
            keys[item.path] = { ...item };
            keys = { ...keys, ...getFlatMenuData(item.children) };
        } else {
            keys[item.path] = { ...item };
        }
    });
    return keys;
}

export const getRouterData = (app) => {
    const routerConfig = {
        '/': {
            component: dynamicWrapper(app, ['user', 'login', 'category'], () => import('../layouts/BasicLayout')),
        },
        '/index': {
            component: dynamicWrapper(app, ['task', 'count'], () => import('../routes/index/index')),
        },
        '/dashboard/analysis': {
            component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
        },
        '/dashboard/monitor': {
            component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
        },
        '/dashboard/workplace': {
            component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
            // hideInBreadcrumb: true,
            // name: '工作台',
            // authority: 'admin',
        },
        '/form/basic-form': {
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
        },
        '/form/step-form': {
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
        },
        '/form/step-form/info': {
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
        },
        '/form/step-form/confirm': {
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
        },
        '/form/step-form/result': {
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
        },
        '/form/advanced-form': {
            component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
        },
        '/list/table-list': {
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
        },
        '/list/card-list': {
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
        },
        '/list/search': {
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
        },
        '/list/search/projects': {
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
        },
        '/list/search/applications': {
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
        },
        '/list/search/articles': {
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
        },
        '/profile/basic': {
            component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
        },
        '/profile/advanced': {
            component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
        },
        '/result/success': {
            component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
        },
        '/result/fail': {
            component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
        },
        '/exception/403': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
        },
        '/exception/404': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
        },
        '/exception/500': {
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
        },
        '/exception/trigger': {
            component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
        },
        '/user': {
            component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        },
        '/user/login': {
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
        },
        '/user/register': {
            component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
        },
        '/user/register-result': {
            component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
        },
        // '/user/:id': {
        //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
        // },
        '/patient/list': {
            component: dynamicWrapper(app, ['patient'], () => import('../routes/Patient/List')),
        },
        '/patient/info': {
            component: dynamicWrapper(app, [], () => import('../routes/Patient/Info')),
        },
        '/patient/diagnoseList': {
            component: dynamicWrapper(app, ['patient'], () => import('../routes/Patient/diagnoseList')),
        },
        // '/patient/diagnoseInfo': {
        //   component: dynamicWrapper(app, [], () => import('../routes/Patient/diagnoseInfo')),
        // },
        '/patient/diagnoseInfo': {
            component: dynamicWrapper(app, ['patient'], () => import('../routes/Patient/StepForm')),
        },
        '/patient/diagnoseInfo/info': {
            component: dynamicWrapper(app, ['patient', 'category'], () => import('../routes/Patient/StepForm/Step1')),
        },
        '/patient/diagnoseInfo/diagnoseRecords': {
            component: dynamicWrapper(app, ['patient', 'category'], () => import('../routes/Patient/StepForm/Step2')),
        },
        '/patient/diagnoseInfo/operationRecords': {
            component: dynamicWrapper(app, ['patient', 'category'], () => import('../routes/Patient/StepForm/Step3')),
        },
        '/patient/diagnoseInfo/result': {
            component: dynamicWrapper(app, ['patient'], () => import('../routes/Patient/StepForm/Step4')),
        },


        '/patient/flupList': {
            component: dynamicWrapper(app, ['patient'], () => import('../routes/Patient/flupList')),
        },
        '/patient/flupInfo': {
            component: dynamicWrapper(app, ['patient'], () => import('../routes/Patient/flupInfo')),
        },
        '/patient/questList': {
            component: dynamicWrapper(app, ['quest'], () => import('../routes/Patient/questList')),
        },
        '/patient/willFlup': {
            component: dynamicWrapper(app, ['callRecord'], () => import('../routes/Patient/willFlup')),
        },
        '/patient/fluped': {
            component: dynamicWrapper(app, ['callRecord'], () => import('../routes/Patient/fluped')),
        },
        '/patient/todayFluped': {
            component: dynamicWrapper(app, ['callRecord'], () => import('../routes/Patient/todayFluped')),
        },
        '/task/list': {
            component: dynamicWrapper(app, ['task', 'user'], () => import('../routes/task/list')),
        },
        '/task/creat': {
            component: dynamicWrapper(app, ['task'], () => import('../routes/task/creat')),
        },
        '/task/taskAdd': {
            component: dynamicWrapper(app, ['task'], () => import('../routes/task/StepForm')),
        },
        '/task/taskAdd/search': {
            component: dynamicWrapper(app, ['task'], () => import('../routes/task/StepForm/Step1')),
        },
        '/task/taskAdd/create': {
            component: dynamicWrapper(app, ['task'], () => import('../routes/task/StepForm/Step2')),
        },
        '/task/taskAdd/result': {
            component: dynamicWrapper(app, ['task'], () => import('../routes/task/StepForm/Step3')),
        },

        '/task/detail': {
            component: dynamicWrapper(app, ['task'], () => import('../routes/task/detail')),
        },
        '/task/sms': {
            component: dynamicWrapper(app, ['sms'], () => import('../routes/task/sms')),
        },
        '/task/call': {
            component: dynamicWrapper(app, ['task', 'callRecord', 'sms'], () => import('../routes/task/call')),
        },
        '/count/scl': {
            component: dynamicWrapper(app, ['count'], () => import('../routes/count/scl')),
        },
        '/count/myd': {
            component: dynamicWrapper(app, ['count'], () => import('../routes/count/myd')),
        },
        '/system/user/list': {
            component: dynamicWrapper(app, ['user'], () => import('../routes/system/user/List')),
        },
        '/system/user/info': {
            component: dynamicWrapper(app, ['user'], () => import('../routes/system/user/Info')),
        },
        '/system/diagnoseList/list': {
            component: dynamicWrapper(app, ['system'], () => import('../routes/system/diagnoseList/List')),
        },
        '/system/diagnoseList/info': {
            component: dynamicWrapper(app, ['system'], () => import('../routes/system/diagnoseList/Info')),
        },
        '/system/icd-10/list': {
            component: dynamicWrapper(app, ['system'], () => import('../routes/system/icd-10/List')),
        },
        '/system/icd-10/info': {
            component: dynamicWrapper(app, ['system'], () => import('../routes/system/icd-10/Info')),
        },
        '/system/dept': {
            component: dynamicWrapper(app, ['system'], () => import('../routes/system/dept/List')),
        },
        '/system/tpl/smsTpl': {
            component: dynamicWrapper(app, ['system','task', 'category'], () => import('../routes/system/tpl/smsTpl')),
        },
        '/system/tpl/questionTpl': {
            component: dynamicWrapper(app, ['quest'], () => import('../routes/system/tpl/questTpl')),
        },
        '/system/tpl/questionInfo': {
            component: dynamicWrapper(app, ['quest'], () => import('../routes/quest')),
        },
        '/system/tpl/wj': {
            component: dynamicWrapper(app, ['quest'], () => import('../routes/quest/WJ')),
        },

    };
    // Get name from ./menu.js or just set it in the router data.
    const menuData = getFlatMenuData(getMenuData());

    // Route configuration data
    // eg. {name,authority ...routerConfig }
    const routerData = {};
    // The route matches the menu
    Object.keys(routerConfig).forEach((path) => {
        // Regular match item name
        // eg.  router /user/:id === /user/chen
        const pathRegexp = pathToRegexp(path);
        const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
        let menuItem = {};
        // If menuKey is not empty
        if (menuKey) {
            menuItem = menuData[menuKey];
        }
        let router = routerConfig[path];
        // If you need to configure complex parameter routing,
        // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
        // eg . /list/:type/user/info/:id
        router = {
            ...router,
            name: router.name || menuItem.name,
            authority: router.authority || menuItem.authority,
        };
        routerData[path] = router;
    });
    return routerData;
};
