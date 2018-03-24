import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import { Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './flupInfo.less';
import C_Select from '../../components/c_select';

/*
    三个catoysl。 随访人员（支持模糊查询），随访结果，随访方式（本地mock）
*/
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, category }) => ({
    submitting: loading.effects['patient/addFlup'],
    category
}))
@Form.create()
export default class BasicForms extends PureComponent {
    state = {
        patient: false,
        name: '',
        patientCode: '',
        id: ''
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let self = this;
        let { patientCode, name, id } = qs.parse(location.search);
        this.setState({ name, patientCode, id });
        if (!id) {
            return;
        }
        dispatch({
            type: 'patient/getFlup',
            payload: { id },
            callback(data) {
                self.setState({
                    patient: data.data
                });
            }
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const fieldsValue = {
                    ...values,
                    'callTimeStr': values['callTimeStr'] ? values['callTimeStr'].format('YYYY-MM-DD') : '',
                    'changeTimeStr': values['changeTimeStr'] ? values['changeTimeStr'].format('YYYY-MM-DD') : '',
                };
                const { patientCode, name, id } = this.state;
                let type = 'patient/addFlup';
                let payload = { ...fieldsValue, patientCode, name, id };
                if (this.state.patient) {
                    type = 'patient/editFlup';
                    payload = { ...fieldsValue, patientCode, name, id }
                }
                this.props.dispatch({
                    type,
                    payload,
                    callback() {
                        window.location.hash = `/patient/flupList?patientCode=${patientCode}&name=${name}`;
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
        const { patient, patientCode, name } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 7
                },
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 12
                },
                md: {
                    span: 10
                },
            },
        };

        const submitFormLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 10,
                    offset: 7
                },
            },
        };
        // 联系电话，随访时间，随访结果，转移部位，转移时间，随访方式，随访人员
        // patientCode
        /*name
        mobile
        callTimeStr
        callResult
        changePart
        changeTimeStr
        callMode
        callPerson*/
        return (
            <PageHeaderLayout title={!patient ? '新增随访信息' : '修改随访信息'}
                content={`病案号：  ${patientCode}   姓名： ${name}`}>
                <Card bordered={false}>
                    <Form
                        onSubmit={this.handleSubmit}
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem
                            {...formItemLayout}
                            label="联系电话"
                        >
                            {getFieldDecorator('mobile', {
                                initialValue: patient ? patient.mobile : '',
                                // rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="随访时间"
                        >
                            {getFieldDecorator('callTimeStr', {
                                initialValue: patient && patient.callTimeStr ? moment(patient.callTimeStr, 'YYYY-MM-DD') : '',
                                rules: [{ required: true, message: 'Please input your 随访时间!' }],
                            })(
                                <DatePicker />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout}
                            label="随访结果">
                            {getFieldDecorator('callResult', {
                                initialValue: patient ? patient.callResult.toString() : '',
                                rules: [{ required: true, message: '请选择随访结果' }],
                            })(

                                <C_Select data={category.callRes}
                                    placeholder="请选择随访结果"
                                    style={{margin: '8px 0'}}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout}
                            label="随访方式">
                            {getFieldDecorator('callMode', {
                                initialValue: patient ? +patient.callMode : '',
                                rules: [{ required: true, message: '请选择随访方式' }],
                            })(
                                <C_Select data={category.flupType}
                                    placeholder="请选择随访方式"
                                    style={{margin: '8px 0'}}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="随访人员"
                        >
                            {getFieldDecorator('callPerson', {
                                initialValue: patient.callPerson,
                                rules: [{ required: true, message: '请选择随访人员' }],
                            })(
                                <C_Select data={category.Users}
                                    placeholder="请选择随访人员"
                                    style={{margin: '8px 0'}}
                                />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="转移部位"
                        >
                            {getFieldDecorator('changePart', {
                                initialValue: patient.changePart,
                                // rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="转移时间"
                        >
                            {getFieldDecorator('changeTimeStr', {
                                initialValue: patient.changeTimeStr ? moment(patient.changeTimeStr, 'YYYY-MM-DD') : ''
                            })(
                                <DatePicker />
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
