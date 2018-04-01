import React from 'react';
import { connect } from 'dva';
import {
    Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Divider,
} from 'antd';
import qs from 'query-string';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import moment from 'moment';
import C_Select from '../../../components/c_select';

const { Option } = Select;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 19,
    },
};

@Form.create()
class Step1 extends React.PureComponent {
    componentDidMount() {
        const { dispatch, location } = this.props;
        let { id, patientCode, name } = qs.parse(location.search);
        this.props.dispatch({
            type: 'category/fetchIcds',
        });
        if (!id) {
            dispatch({
                type: 'patient/clearDiagnoseInfo'
            });
            if (patientCode) {
                dispatch({
                    type: 'patient/saveDiagnoseInfo',
                    payload: {
                        data: { patientCode, name }
                    }
                });
            }
            return
        }
        dispatch({
            type: 'patient/getDiagnose',
            payload: {id}
        });
    }
    render() {
        const { patient, dispatch, data, form, depts, doctors, category } = this.props;
        const { getFieldDecorator, validateFields } = form;
        const onValidateForm = () => {
            validateFields((err, values) => {
                values = {
                    ...values,
                    diagnoseTimeStr: values.diagnoseTimeStr ? values.diagnoseTimeStr.format('YYYY-MM-DD') : '',
                    admissionTimeStr: values.admissionTimeStr ? values.admissionTimeStr.format('YYYY-MM-DD') : '',
                    outTimeStr: values.outTimeStr ? values.outTimeStr.format('YYYY-MM-DD') : '',
                    cureMode: values.cureMode ? values.cureMode.toString() : ''
                };
                if (!err) {
                    dispatch({
                        type: 'patient/saveDiagnoseInfo',
                        payload: {
                            data: values
                        },
                    });
                    dispatch(routerRedux.push('/patient/diagnoseInfo/diagnoseRecords'));
                }
            });
        };
        return (
            <div>
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
                                <Input style={{ width: '50%' }} placeholder="病案号" disabled={!!patient.patientCode} />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="病人姓名"
                        >
                            {getFieldDecorator('name', {
                                initialValue: patient.name,
                                rules: [{
                                    required: true, message: '请输入病人姓名',
                                }],
                            })(
                                <Input style={{ width: '50%' }} placeholder="病人姓名" disabled={!!patient.name} />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="患者第几次住院"
                        >
                            {getFieldDecorator('admissionNumber', {
                                initialValue: patient.admissionNumber,
                            })(
                                <InputNumber style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="诊断时间"
                        >
                            {getFieldDecorator('diagnoseTimeStr', patient && patient.diagnoseTimeStr && {
                                initialValue: moment(patient.diagnoseTimeStr, 'YYYY-MM-DD')
                            } || {})(
                                <DatePicker />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="诊断科别"
                        >
                            {getFieldDecorator('diagnoseDept', {
                                initialValue: patient.diagnoseDept,
                            })(
                                <C_Select data={depts} style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="主治医师"
                        >
                            {getFieldDecorator('treatmentDoctor', {
                                initialValue: patient.treatmentDoctor,
                            })(
                                <C_Select data={doctors} style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="入院时间"
                        >
                            {getFieldDecorator('admissionTimeStr', patient && patient.admissionTimeStr && {
                                initialValue: moment(patient.admissionTimeStr, 'YYYY-MM-DD')
                            } || {})(
                                <DatePicker />
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="入院科别"
                        >
                            {getFieldDecorator('admissionDept', {
                                initialValue: patient.admissionDept,
                            })(
                                <C_Select data={depts} style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="诊断病种"
                        >
                            {getFieldDecorator('diseaseId', {
                                initialValue: patient.diseaseId,
                            })(
                                <C_Select data={category.Diseases} style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="治疗方式"
                        >
                            {getFieldDecorator('cureMode', patient.cureMode && {
                                initialValue: patient.cureMode.split(',')
                            } || {})(
                                <C_Select data={category.Cures}
                                mode="multiple"
                                style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="出院时间"
                        >
                            {getFieldDecorator('outTimeStr', patient && patient.outTimeStr && {
                                initialValue: moment(patient.outTimeStr, 'YYYY-MM-DD')
                            } || {})(
                                <DatePicker />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="出院科别"
                        >
                            {getFieldDecorator('outDept', {
                                initialValue: patient.outDept,
                            })(
                                <C_Select data={depts} style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <Button type="primary" onClick={onValidateForm}>
                            下一步
                        </Button>
                    </Form>
                </Card>
                <Divider style={{ margin: '40px 0 24px' }} />
                <div className={styles.desc}>
                    <h3>说明</h3>
                    <h4>关于添加信息的一些注意事项</h4>
                </div>
            </div>
        );
    }
}

export default connect(({ patient, category }) => ({
    patient: patient.diagnoseInfo,
    depts: category.Depts,
    doctors: category.Doctors,
    category
}))(Step1);
