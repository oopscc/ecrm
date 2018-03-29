import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import {
    Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './info.less';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, system }) => ({
    icds: system.ICDs,
    submitting: loading.effects['system/addICD'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
    state = {
        icd: {},
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let id = qs.parse(location.search).id;
        if (!id) {
            return
        }
        dispatch({
            type: 'system/getICD',
            payload: { id },
            callback: data => {
                this.setState({
                    icd: data.data
                });
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let type = 'system/addICD';
        if (this.state.icd.id) {
            type = 'system/editICD';
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const fieldsValue = {
                    ...this.state.icd,
                    ...values
                };
                this.props.dispatch({
                    type,
                    payload: fieldsValue,
                    callback: (res) => {
                        if (res && !res.result) {
                            this.props.dispatch(routerRedux.goBack());
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
        const { icd } = this.state;
        console.log(icd)
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
            <PageHeaderLayout title={!icd.id ? '添加疾病' : '修改疾病'} content="编辑疾病信息的表单">
                <Card bordered={false}>
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem
                            {...formItemLayout}
                            label='疾病名称'
                        >
                            {getFieldDecorator('illnessName', {
                                initialValue: icd.illnessName,
                                rules: [{
                                    required: true, message: '请输入疾病名称',
                                }],
                            })(
                                <Input placeholder="请输入疾病名称" />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="疾病编码"
                        >
                            {getFieldDecorator('illnessCode', {
                                initialValue: icd.illnessCode,
                                rules: [{
                                    required: true, message: '请输入疾病编码',
                                }],
                            })(
                                <Input placeholder="请输入疾病编码" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="助记码"
                        >
                            {getFieldDecorator('memoryCode', {
                                initialValue: icd.memoryCode,
                                // rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="性别限制"
                        >
                            <div>
                                {getFieldDecorator('sexLimit', {
                                    initialValue: icd.sexLimit + '',
                                })(
                                    <Radio.Group>
                                        <Radio value="0">女</Radio>
                                        <Radio value="1">男</Radio>
                                    </Radio.Group>
                                )}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="疗效限制"
                        >
                            {getFieldDecorator('lxLimit', {
                                initialValue: icd.lxLimit,
                            })(
                                <Input style={{ width: '100%' }} />
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
