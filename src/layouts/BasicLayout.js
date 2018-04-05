import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message, Modal, Button, Card, Form, Input } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import Call from '../utils/call';

import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import md5 from 'md5';
const { Content } = Layout;
const { AuthorizedRoute } = Authorized;

//
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
    if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
            redirectData.push({
                from: `/${item.path}`,
                to: `/${item.children[0].path}`,
            });
            item.children.forEach((children) => {
                getRedirect(children);
            });
        }
    }
};
getMenuData().forEach(getRedirect);
const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
    },
};

let isMobile;
enquireScreen((b) => {
    isMobile = b;
});

@Form.create()
class BasicLayout extends React.PureComponent {
    static childContextTypes = {
        location: PropTypes.object,
        breadcrumbNameMap: PropTypes.object,
    }
    state = {
        isMobile,
        callVisible: false,
        reset: false,
        callInit: false
    };
    getChildContext() {
        const { location, routerData } = this.props;
        return {
            location,
            breadcrumbNameMap: routerData,
        };
    }
    componentDidMount() {
        enquireScreen((mobile) => {
            this.setState({
                isMobile: mobile,
            });
        });
        this.props.dispatch({
            type: 'user/fetchCurrent',
        });
        /**
         * 试试刷新的category, 需要场景自己发送请求，不能aop
         */
        /*
        // 问卷模版
        this.props.dispatch({
            type: 'category/fetchWJTpls',
        });
        // 短信模版
        this.props.dispatch({
            type: 'category/fetchSMSTpls',
        });

        */

        //人员
        this.props.dispatch({
            type: 'category/fetchUsers',
        });
        // 科室
        this.props.dispatch({
            type: 'category/fetchDepts',
        });


        // 病种
        this.props.dispatch({
            type: 'category/fetchDiseases',
        });
        //患者状态
        this.props.dispatch({
            type: 'category/fetchPStates',
        });
        //付费方式
        this.props.dispatch({
            type: 'category/fetchPays',
        });
        //麻醉方式
        this.props.dispatch({
            type: 'category/fetchAnesthesias',
        });
        //治疗方式
        this.props.dispatch({
            type: 'category/fetchCures',
        });
        //随访结果
        this.props.dispatch({
            type: 'category/fetchCallRes',
        });
        //医生
        this.props.dispatch({
            type: 'category/fetchDoctors',
        });
        //医院职务
        this.props.dispatch({
            type: 'category/fetchDuties',
        });
        //医生职称
        this.props.dispatch({
            type: 'category/fetchJobs',
        });
        //角色
        this.props.dispatch({
            type: 'category/fetchRoles',
        });

        if (!this.state.callInit) {
            Call.init();
            this.setState({
                callInit: true
            })
        }
        // 系统拨打电话
        // 系统接听电话
        // 系统挂断电话
        // TODO,系统拿到录音，上传
        // window.call = (to) => {
        //     if (url_StartDial(0, to) <= 0) {
        //         console.log("拨号错误");
        //     }
        //     else {
        //         console.log("拨号:" + to);
        //     }
        // }
        // window.answer = (phone) => {
        //     console.log("answer" + phone);
        //     if (url_DoAnswer(0) < 0) {
        //         console.log("usb设备应答错误");
        //     }
        //     else {
        //         console.log("usb设备应答");
        //     }
        // }
        // window.hangup = () => {
        //     console.log('hangup!!!')
        //     if (url_DoHang(0) < 0) {
        //         console.log("挂机错误");
        //     }
        //     else {
        //         console.log("挂机");
        //     }
        // }
        // call-event
        window.event_call_in = (phone) => {
            phone = +phone;
            // 弹屏
            this.props.dispatch({
                type: 'callRecord/getCallDataByPhone',
                payload: { phone },
                callback: data => {
                    if (!data.data) {
                        this.setState({
                            name: '未知号码',
                            phone,
                            callVisible: true
                        })
                    } else {
                        this.setState({
                            ...data.data,
                            phone,
                            callVisible: true
                        })
                    }

                }
            });
        }
    }
    answer() {
        this.setState({
            callVisible: false
        });
        const { patientCode, phone, name } = this.state;
        // window.answer(phone);
        Call.answer(phone);
        if (name == '未知号码') return false;
        location.hash = `#/task/call?patientCode=${patientCode}`;

    }
    hangup(phone) {
        Call.hangup();
        this.setState({
            callVisible: false
        });
    }
    getPageTitle() {
        const { routerData, location } = this.props;
        const { pathname } = location;
        let title = 'Ant Design Pro';
        if (routerData[pathname] && routerData[pathname].name) {
            title = `${routerData[pathname].name} - Ant Design Pro`;
        }
        return title;
    }
    getBashRedirect = () => {
        // According to the url parameter to redirect
        // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
        const urlParams = new URL(window.location.href);

        const redirect = urlParams.searchParams.get('redirect');
        // Remove the parameters in the url
        if (redirect) {
            urlParams.searchParams.delete('redirect');
            window.history.replaceState(null, 'redirect', urlParams.href);
        } else {
            return '/index';
        }
        console.log(redirect)
        return redirect;
    }
    handleMenuCollapse = (collapsed) => {
        this.props.dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    }
    handleNoticeClear = (type) => {
        message.success(`清空了${type}`);
        this.props.dispatch({
            type: 'global/clearNotices',
            payload: type,
        });
    }
    handleMenuClick = ({ key }) => {
        if (key === 'triggerError') {
            this.props.dispatch(routerRedux.push('/exception/trigger'));
            return;
        }
        if (key === 'logout') {
            this.props.dispatch({
                type: 'login/logout',
            });
        }
        if (key === 'reset') {
            this.setState({
                reset: true
            })
            return;
        }

    }
    handleNoticeVisibleChange = (visible) => {
        if (visible) {
            // this.props.dispatch({
            //     type: 'global/fetchNotices',
            // });
        }
    }
    handleReset = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('password: ', values, this.props);
                this.props.dispatch({
                    type: 'user/changePassword',
                    payload: {
                        ...values,
                        oldPassword: md5(values.oldPassword),
                        newPassword: md5(values.newPassword)
                    },
                    callback: (res) => {
                        if (res && !res.result) {
                            this.setState({
                                reset: false
                            })
                        }
                    }
                })
            }
        });
    }
    onCancelReset = () => {
        this.setState({
            reset: false
        })
    }
    render() {
        const {
            currentUser, collapsed, fetchingNotices, notices, routerData, match, location, form
        } = this.props;
        console.log(this.props);
        const { getFieldDecorator } = this.props.form;
        const {
            name,
            phone,
            callVisible,
            reset
        } = this.state;
        const bashRedirect = this.getBashRedirect();
        const FormItem = Form.Item;
        const formItemLayout = {
            labelCol: {
                span: 5,
            },
            wrapperCol: {
                span: 19,
            },
        };
        const submitFormLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 18,
                    offset: 6
                },
            },
        };
        const layout = (
            <Layout>
                <SiderMenu
                    logo={logo}
                    // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
                    // If you do not have the Authorized parameter
                    // you will be forced to jump to the 403 interface without permission
                    Authorized={Authorized}
                    menuData={getMenuData()}
                    collapsed={collapsed}
                    location={location}
                    isMobile={this.state.isMobile}
                    onCollapse={this.handleMenuCollapse}
                />
                <Layout>
                    <GlobalHeader
                        logo={logo}
                        currentUser={currentUser}
                        // fetchingNotices={fetchingNotices}
                        notices={notices}
                        collapsed={collapsed}
                        isMobile={this.state.isMobile}
                        onNoticeClear={this.handleNoticeClear}
                        onCollapse={this.handleMenuCollapse}
                        onMenuClick={this.handleMenuClick}
                        onNoticeVisibleChange={this.handleNoticeVisibleChange}
                    />
                    <Modal
                        visible={callVisible}
                        closable={false}
                        footer={null}
                        width={360}
                    >
                        <div style={{ textAlign: 'center', paddingTop: 20 }}>
                            <div style={{ fontSize: 32 }}>{name}</div>
                            <div style={{ fontSize: 16, color: '#1890ff', padding: 10 }}>{phone}</div>
                            <div>
                                <Button type="primary" icon="phone" onClick={this.answer.bind(this, phone)} style={{ margin: 16 }}>
                                    接听
                                </Button>
                                <Button type="primary" icon="poweroff" onClick={this.hangup.bind(this, phone)} style={{ margin: 16 }}>
                                    挂断
                                </Button>
                            </div>
                        </div>

                    </Modal>
                    <Modal
                        visible={reset}
                        closable={false}
                        footer={null}
                        width={360}
                    >
                        <Form onSubmit={this.handleReset} className="login-form">
                            <FormItem
                                {...formItemLayout}
                                label='旧密码'
                            >
                                {getFieldDecorator('oldPassword', {
                                    rules: [{
                                        required: true, message: '请输入旧密码',
                                    }],
                                })(
                                    <Input type="password" placeholder="旧密码" />
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="新密码"
                            >
                                {getFieldDecorator('newPassword', {
                                    rules: [{
                                        required: true, message: '请输入新密码',
                                    }],
                                })(
                                    <Input type="password" placeholder="新密码" />
                                )}
                            </FormItem>

                            <FormItem {...submitFormLayout}>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                                <Button onClick={this.onCancelReset} style={{ marginLeft: 16 }}>
                                    取消
                                </Button>
                            </FormItem>
                        </Form>

                    </Modal>
                    <Content style={{ margin: '24px 24px 0', height: '100%' }}>
                        <Switch>
                            {
                                redirectData.map(item =>
                                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                                )
                            }
                            {
                                getRoutes(match.path, routerData).map(item =>
                                    (
                                        <AuthorizedRoute
                                            key={item.key}
                                            path={item.path}
                                            component={item.component}
                                            exact={item.exact}
                                            authority={item.authority}
                                            redirectPath="/exception/403"
                                            isMobile={this.state.isMobile}
                                        />
                                    )
                                )
                            }
                            <Redirect exact from="/" to={bashRedirect} />
                            <Route render={NotFound} />
                        </Switch>
                    </Content>
                    <GlobalFooter
                        // links={[{
                        //     key: 'Pro 首页',
                        //     title: 'Pro 首页',
                        //     href: 'http://pro.ant.design',
                        //     blankTarget: true,
                        // }, {
                        //     key: 'github',
                        //     title: <Icon type="github" />,
                        //     href: 'https://github.com/ant-design/ant-design-pro',
                        //     blankTarget: true,
                        // }, {
                        //     key: 'Ant Design',
                        //     title: 'Ant Design',
                        //     href: 'http://ant.design',
                        //     blankTarget: true,
                        // }]}
                        copyright={
                            <div>
                                Copyright <Icon type="copyright" /> 2018 廊坊沙丁鱼科技有限公司
                            </div>
                        }
                    />
                </Layout>
            </Layout>
        );

        return (
            <DocumentTitle title={this.getPageTitle()}>
                <ContainerQuery query={query}>
                    {params => <div className={classNames(params)}>{layout}</div>}
                </ContainerQuery>
            </DocumentTitle>
        );
    }
}

export default connect(({ user, global, loading }) => ({
    currentUser: user.currentUser,
    collapsed: global.collapsed,
    fetchingNotices: loading.effects['global/fetchNotices'],
    notices: global.notices,
}))(BasicLayout);
