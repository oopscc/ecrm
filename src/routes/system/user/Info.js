import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import {
    Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './info.less';
import C_Select from '../../../components/c_select';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, user, category }) => ({
    user,
    submitting: loading.effects['user/addUser'],
    category
}))
@Form.create()
export default class BasicForms extends PureComponent {
    state = {
        user: {},
    };
    componentDidMount() {
        const { dispatch, location } = this.props;
        let self = this;
        let id = qs.parse(location.search).id;
        if (!id) {
            return
        }
        dispatch({
            type: 'user/getUser',
            payload: { id },
            callback(data) {
                self.setState({
                    user: data.data
                });
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let type = 'user/addUser';
        if (this.state.user.id) {
            type = 'user/editUser';
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const fieldsValue = {
                    ...this.state.user,
                    ...values
                };
                this.props.dispatch({
                    type,
                    payload: fieldsValue,
                    callback: () => {
                        window.location.hash = '/system/user/list';
                    }
                });
            }
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const { submitting, form, category } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { user } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 10 },
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 7 },
            },
        };

        return (
            <PageHeaderLayout title={!user.id ? '添加用户' : '修改用户'} content="编辑用户基本信息">
                <Card bordered={false}>
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem
                            {...formItemLayout}
                            label='用户名'
                        >
                            {getFieldDecorator('userName', {
                                initialValue: user.userName,
                                rules: [{
                                    required: true, message: '请输入用户名',
                                }],
                            })(
                                <Input placeholder="请输入用户名" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="姓名"
                        >
                            {getFieldDecorator('name', {
                                initialValue: user ? user.name : '',
                                rules: [{
                                    required: true, message: '请输入用户姓名',
                                }],
                            })(
                                <Input placeholder="请输入用户姓名" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="性别"
                        >
                            <div>
                                {getFieldDecorator('sex', {
                                    initialValue:  user.sex ? user.sex+'' : '',
                                })(
                                    <C_Select data={category.sex} style={{margin: '8px 0'}}/>
                                )}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="电话号码"
                        >
                            {getFieldDecorator('userPhone', {
                                initialValue: user.userPhone,
                                // rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="邮箱地址"
                        >
                            {getFieldDecorator('userEmail', {
                                initialValue: user.userEmail,
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout}
                            label="科室名称">
                            {getFieldDecorator('deptId', {
                                initialValue: user ? user.deptId : '',
                                rules: [{ required: true, message: '请选择科室' }],
                            })(
                                <C_Select data={category.Depts} style={{margin: '8px 0'}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout}
                            label="职称">
                            {getFieldDecorator('jobId', {
                                initialValue: user ? user.jobId : '',
                                rules: [{ required: true, message: '请选择职称' }],
                            })(
                                <C_Select data={category.Jobs} style={{margin: '8px 0'}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout}
                            label="职务">
                            {getFieldDecorator('dutyId', {
                                initialValue: user ? user.dutyId : '',
                                rules: [{ required: true, message: '请选择职务' }],
                            })(
                                <C_Select data={category.Duties} style={{margin: '8px 0'}}/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout}
                            label="角色">
                            {getFieldDecorator('roleId', {
                                initialValue: user ? user.roleId : '',
                                rules: [{ required: true, message: '请选择角色' }],
                            })(
                                <C_Select data={category.Roles} style={{margin: '8px 0'}}/>
                            )}
                        </FormItem>
                        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                提交
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderLayout>
        );
    }
}
