import React from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Divider
} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

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
  render() {
    const { patient, dispatch, data, form } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'patient/saveDiagnoseInfo',
            payload: values,
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
                <Input placeholder="病人姓名" disabled={!!patient.patientCode}/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="患者第几次住院"
            >
              {getFieldDecorator('admissionNumber', {
                initialValue: patient.admissionNumber,
                // rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="入院时间，"
            >
              {getFieldDecorator('admissionTime', {
                initialValue: patient && patient.admissionTime ? moment(patient.admissionTime, 'YYYY-MM-DD') : ''
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
