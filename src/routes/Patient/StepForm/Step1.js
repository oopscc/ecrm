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
                {getFieldDecorator('canCall', {
                  initialValue: patient && patient.canCall ? patient.canCall.toString() : '',
                  rules: [{ required: true, message: '请选择是否可以随访' }],
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
                initialValue: patient && patient.patientState ? patient.patientState.toString() : '',
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
