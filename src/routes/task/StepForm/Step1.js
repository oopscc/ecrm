import React from 'react';
import { connect } from 'dva';
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Divider,
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
    // let {id, patientCode, name }= qs.parse(location.search);
    
  }
  render() {
    const { patient, dispatch, data, form } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        values = {
          ...values,
          diagnoseStartTimeStr: values.diagnoseTimeStr ? values.diagnoseTimeStr[0].format('YYYY-MM-DD') : '',
          diagnoseEndTimeStr: values.diagnoseTimeStr ? values.diagnoseTimeStr[1].format('YYYY-MM-DD') : '',
          admissionStartTimeStr: values.admissionTimeStr ? values.admissionTimeStr[0].format('YYYY-MM-DD'): '',
          admissionEndTimeStr: values.admissionTimeStr ? values.admissionTimeStr[1].format('YYYY-MM-DD'): '',
          outStartTimeStr: values.diagnoseTimeStr ? values.outTimeStr[0].format('YYYY-MM-DD') : '',
          outEndTimeStr: values.diagnoseTimeStr ? values.outTimeStr[1].format('YYYY-MM-DD') : '',
          taskStartTimeStr: values.taskStartTimeStr ? values.taskStartTimeStr.format('YYYY-MM-DD') : '',
        };
        if (!err) {
          dispatch({
            type: 'task/search',
            payload: {
              data: values
            },
          });
          dispatch(routerRedux.push('/task/taskAdd/create'));
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
                rules: [{
                  required: true, message: '请输入病案号',
                }],
              })(
                <TextArea placeholder="可输入多个病案号批量查询，使用，隔开"/>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="性别"
            >
              <div>
                {getFieldDecorator('sex', {

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
              label="病种"
            >
              {getFieldDecorator('diseaseName', {
                rules: [{
                  required: true, message: '请选择病种',
                }],
              })(
                <Input placeholder="病种"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="年龄"
            >
              {getFieldDecorator('age', {
                rules: [{
                  required: true, message: '请输入病人年龄',
                }],
              })(
                <Input placeholder="年龄"/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="原发性诊断名称"
            >
              {getFieldDecorator('diagnoseName', {
                rules: [{
                }],
              })(
                <Input placeholder="diagnoseName" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="诊断时间"
            >
              {getFieldDecorator('diagnoseTimeStr', {

              })(
                  <RangePicker />
              )}
            </FormItem>
            
            <FormItem
              {...formItemLayout}
              label="入院时间"
            >
              {getFieldDecorator('admissionTimeStr', {

              })(
                  <RangePicker />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="出院时间"
            >
              {getFieldDecorator('outTimeStr', {

              })(
                  <RangePicker />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="出院科别"
            >
              {getFieldDecorator('outDept', {

              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="随访任务起始日期"
            >
              {getFieldDecorator('taskStartTimeStr', {

              })(
                  <DatePicker />
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

export default connect(({ task }) => ({

}))(Step1);
