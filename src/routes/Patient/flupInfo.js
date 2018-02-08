import React, {
    PureComponent
} from 'react';
import moment from 'moment';
import {
    connect
} from 'dva';
import qs from 'query-string'
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Card,
    InputNumber,
    Radio,
    Icon,
    Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './flupInfo.less';

const FormItem = Form.Item;
const {
    Option
} = Select;
const {
    RangePicker
} = DatePicker;
const {
    TextArea
} = Input;

@connect(({
    loading
}) => ({
    submitting: loading.effects['patient/addFlup'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
    state = {
        patient: false,
        name: '',
        patientCode: ''
    };

    componentDidMount() {
        const {
            dispatch,
            location
        } = this.props;
        let self = this;
        let {
            patientCode,
            name
        } = qs.parse(location.search);
        if (!patientCode) {
            return
        }
        self.setState({
            name,
            patientCode
        });
        dispatch({
            type: 'patient/getFlup',
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
        let type = 'patient/addFlup';
        if (this.state.patient) {
            type = 'patient/editFlup';
        }
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const fieldsValue = {
                    ...values,
                    'callTimeStr': values['callTimeStr'].format('YYYY-MM-DD'),
                    'changeTimeStr': values['changeTimeStr'].format('YYYY-MM-DD'),
                    patientCode: this.state.patientCode
                };
                this.props.dispatch({
                    type,
                    payload: fieldsValue,
                    callback() {
                        window.history.go(-1);
                        // this.props.dispatch()
                    }
                });
            }
        });
    }
    handleReset = () => {
        this.props.form.resetFields();
    }
    render() {
        const {
            submitting,
            form
        } = this.props;
        const {
            getFieldDecorator,
            getFieldValue
        } = this.props.form;
        const {
            patient,
            patientCode,
            name
        } = this.state;
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
						hideRequiredMark = {false}
						style={{ marginTop: 8 }}
					>
						
						
						<FormItem
							{...formItemLayout}
							label="联系电话"
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
							label="随访时间"
						>
							{getFieldDecorator('callTimeStr', {
								initialValue: patient && patient.callTimeStr ? moment(patient.callTimeStr, 'YYYY-MM-DD') : ''
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

						<FormItem {...formItemLayout}
							label="随访方式">
							{getFieldDecorator('callMode', {
								initialValue: patient ? patient.callMode.toString() : '',
								rules: [{ required: true, message: '请选择随访方式' }],
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
							label="随访人员"
						>
							{getFieldDecorator('callPerson', {
								initialValue: patient.callPerson,
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