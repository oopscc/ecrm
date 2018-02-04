import React from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Divider
} from 'antd';
import qs from 'query-string';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import moment from 'moment';

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
    let {id, patientCode, name }= qs.parse(location.search);
    if (patientCode) {
      dispatch({
        type: 'patient/saveDiagnoseInfo',
        payload: {
          data: {patientCode, name}
        }
      });
    }
    if (!id) {
      return
    }
    dispatch({
      type: 'patient/getDiagnose',
      payload: {
        id
      }
    });
  }
  render() {
    const { patient, dispatch, data, form } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        values = {
          ...values,
          diagnoseTimeStr: values.diagnoseTimeStr ? values.diagnoseTimeStr.format('YYYY-MM-DD') : '',
          admissionTimeStr: values.admissionTimeStr ? values.admissionTimeStr.format('YYYY-MM-DD'): '',
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
            hideRequiredMark = {false}
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
                <Input placeholder="病案号"  disabled={!!patient.patientCode}/>
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
                <Input placeholder="病人姓名" disabled={!!patient.name}/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="患者第几次住院"
            >
              {getFieldDecorator('admissionNumber', {
                initialValue: patient ? patient.admissionNumber : '',
                // rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="诊断时间"
            >
              {getFieldDecorator('diagnoseTimeStr', {
                initialValue: patient && patient.diagnoseTimeStr ? moment(patient.diagnoseTimeStr, 'YYYY-MM-DD') : ''
              })(
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
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="主治医师"
            >
              {getFieldDecorator('treatmentDoctor', {
                initialValue: patient.treatmentDoctor,
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="入院时间"
            >
              {getFieldDecorator('admissionTimeStr', {
                initialValue: patient && patient.admissionTimeStr ? moment(patient.admissionTimeStr, 'YYYY-MM-DD') : ''
              })(
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
                <Input style={{ width: '100%' }} />
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
          <h4>转账到支付宝账户</h4>
          <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
          <h4>转账到银行卡</h4>
          <p>如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。</p>
        </div>
      </div>
    );
  }
}

export default connect(({ patient }) => ({
  patient: patient.diagnoseInfo,
}))(Step1);
