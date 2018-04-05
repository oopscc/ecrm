import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import {
    Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, message
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './info.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;


// 分布式demo
// 自定义增加item
// 分布式数据结构， 1，基本信息 2，诊断信息 3，手术信息
@connect(({ loading }) => ({
    submitting: loading.effects['system/saveHospital'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
    state = {
        hospital: false,
    };

    componentDidMount() {
        const { dispatch, location } = this.props;

        dispatch({
            type: 'system/getHospital',
            payload: {},
            callback: (data) => {
                this.setState({
                    hospital: data.data
                });
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let type = 'system/saveHospital';
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                this.props.dispatch({
                    type,
                    payload: {
                        ...this.state.hospital,
                        ...values
                    },
                    callback(res) {
                        // window.location.hash = '/patient/list';
                        if (res && !res.result) {
                            message.success('保存成功');
                        }
                    }
                });
            }
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const { submitting, form } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { hospital } = this.state;
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
            <PageHeaderLayout title={'医院基础信息'} content="收集保存医院基础信息。">
                <Card bordered={false}>
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem
                            {...formItemLayout}
                            label='医院名称'
                        >
                            {getFieldDecorator('hospitalName', {
                                initialValue: hospital.hospitalName,
                                rules: [{
                                    required: true, message: '请输入医院名称',
                                }],
                            })(
                                <Input placeholder="医院名称" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="医院电话"
                        >
                            {getFieldDecorator('phone', {
                                initialValue: hospital.phone,
                                rules: [{
                                    required: true, message: '请输入医院电话',
                                }],
                            })(
                                <Input placeholder="医院电话" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="医院传真"
                        >
                            {getFieldDecorator('fax', {
                                initialValue: hospital.fax,
                                rules: [{
                                    required: true, message: '请输入医院传真',
                                }],
                            })(
                                <Input placeholder="医院传真" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="所在市区号"
                        >
                            {getFieldDecorator('areaCode', {
                                initialValue: hospital.areaCode,
                                rules: [{
                                    required: true, message: '请输入所在市区号',
                                }],
                            })(
                                <Input placeholder="所在市区号" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="医院地址"
                        >
                            {getFieldDecorator('address', {
                                initialValue: hospital.address,
                                rules: [{
                                    required: true, message: '请输入医院地址',
                                }],
                            })(
                                <TextArea style={{ minHeight: 32 }} placeholder="请输入医院地址" rows={4} />
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
