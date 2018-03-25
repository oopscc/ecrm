import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import {
    Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './info.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;


// 分布式demo
// 自定义增加item
// 分布式数据结构， 1，基本信息 2，诊断信息 3，手术信息
@connect(({ loading }) => ({
    submitting: loading.effects['patient/add'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
    state = {
        patient: false,
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let self = this;
        let patientCode = qs.parse(location.search).patientCode;
        if (!patientCode) {
            return
        }
        dispatch({
            type: 'patient/get',
            payload: {
                patientCode
            },
            callback(data) {
                self.setState({
                    patient: data.data
                });
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let type = 'patient/add';
        if (this.state.patient) {
            type = 'patient/edit';
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const fieldsValue = {
                    ...values,
                    'birthdayStr': values['birthdayStr'] ? values['birthdayStr'].format('YYYY-MM-DD') : '',
                    'diagnoseTimeStr': values['diagnoseTimeStr'] ? values['diagnoseTimeStr'].format('YYYY-MM-DD') : '',
                    'deathTimeStr': values['deathTimeStr'] ? values['deathTimeStr'].format('YYYY-MM-DD') : ''
                };
                this.props.dispatch({
                    type,
                    payload: fieldsValue,
                    callback() {
                        window.location.hash = '/patient/list';
                    }
                });
            }
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    goBack() {
        this.props.dispatch(routerRedux.goBack());
    }
    render() {
        const { submitting, form } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { patient } = this.state;
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
            <PageHeaderLayout title={!patient ? '新增患者' : '修改患者信息'} content="收录患者信息，用于建立患者数据库。">
                <Button onClick={this.goBack.bind(this)} />
                <Card bordered={false}>
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem
                            {...formItemLayout}
                            label='病案号'
                        >
                            {getFieldDecorator('patientCode', {
                                initialValue: patient ? patient.patientCode : '',
                                rules: [{
                                    required: true, message: '请输入病案号',
                                }],
                            })(
                                <Input placeholder="病案号" disabled={!!patient} />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="病人姓名"
                        >
                            {getFieldDecorator('name', {
                                initialValue: patient ? patient.name : '',
                                rules: [{
                                    required: true, message: '请输入病人姓名',
                                }],
                            })(
                                <Input placeholder="病人姓名" disabled={!!patient} />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="病人性别"
                        >
                            <div>
                                {getFieldDecorator('sex', {
                                    initialValue: patient && patient.sex ? patient.sex.toString() : '0',
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
                            label="电话号码"
                        >
                            {getFieldDecorator('mobile', {
                                initialValue: patient.mobile,
                                // rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="出生日期"
                        >
                            {getFieldDecorator('birthdayStr', {
                                initialValue: patient && patient.birthdayStr ? moment(patient.birthdayStr, 'YYYY-MM-DD') : ''
                            })(
                                <DatePicker />
                            )}
                        </FormItem>


                        <FormItem
                            {...formItemLayout}
                            label="国籍"
                        >
                            {getFieldDecorator('nationality', {
                                initialValue: patient.nationality,
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="地区"
                        >
                            {getFieldDecorator('region', {
                                initialValue: patient.region,
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="民族"
                        >
                            {getFieldDecorator('nation', {
                                initialValue: patient.nation,
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="婚姻状态"
                        >
                            <div>
                                {getFieldDecorator('marriage', {
                                    initialValue: patient && patient.marriage ? patient.marriage.toString() : '0',
                                })(
                                    <Radio.Group>
                                        <Radio value="0">未婚</Radio>
                                        <Radio value="1">已婚</Radio>
                                    </Radio.Group>
                                )}
                            </div>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="身份证号"
                        >
                            {getFieldDecorator('idNumber', {
                                initialValue: patient.idNumber,
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="家庭住址"
                        >
                            {getFieldDecorator('homeAddress', {
                                initialValue: patient.homeAddress,
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="籍贯"
                        >
                            {getFieldDecorator('hometown', {
                                initialValue: patient.hometown,
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="最近门诊时间"
                        >
                            {getFieldDecorator('diagnoseTimeStr', {
                                initialValue: patient && patient.diagnoseTimeStr ? moment(patient.diagnoseTimeStr, 'YYYY-MM-DD') : ''
                            })(
                                <DatePicker />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="是否可以随访"
                        >
                            <div>
                                {getFieldDecorator('canCall', patient && {
                                    initialValue: patient.canCall+'',
                                    rules: [{ required: true, message: '请选择是否可以随访' }],
                                } || {
                                    rules: [{ required: true, message: '请选择是否可以随访' }]
                                })(
                                    <Radio.Group>
                                        <Radio value="0">不可以</Radio>
                                        <Radio value="1">可以</Radio>
                                    </Radio.Group>
                                )}
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout}
                            label="生存状态">
                            {getFieldDecorator('patientState', {
                                initialValue: patient ? patient.patientState.toString() : '',
                                rules: [{ required: true, message: '请选择生存状态' }],
                            })(
                                <Select
                                    mode="radio"
                                    placeholder="请选择生存状态"
                                    style={{
                                        margin: '8px 0'
                                    }}
                                >
                                    <Option value="0">死亡</Option>
                                    <Option value="1">生存</Option>
                                    <Option value="2">毁灭</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="死亡时间"
                        >
                            {getFieldDecorator('deathTimeStr', {
                                initialValue: patient.deathTimeStr ? moment(patient.deathTimeStr, 'YYYY-MM-DD') : ''
                                // initialValue: moment(patient.deathTimeStr, 'YYYY-MM-DD'),
                            })(
                                <DatePicker />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="死亡原因"
                        >
                            {getFieldDecorator('deathDesc', {
                                initialValue: patient.deathDesc,
                                rules: [{
                                    // required: true, message: '死亡原因 deathDesc',
                                }],
                            })(
                                <TextArea style={{ minHeight: 32 }} placeholder="请输入死亡原因" rows={4} />
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
