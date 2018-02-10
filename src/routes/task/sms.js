import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, TimePicker
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './sms.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const listTem = [{
      id: 0,
      smsName: '短信模版0',
      smsContent: '短信内容1000'
    },{
      id: 1,
      smsName: '短信模版1',
      smsContent: '短信内容2000'
    },{
      id: 2,
      smsName: '短信模版2',
      smsContent: '短信内容3000'
    }]
@connect(({ loading, sms}) => ({
  sms,
  submitting: loading.effects['sms/send'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    // taskId: '',
    smsId: '0',
    smsContent: '',
    callIdArray: []
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    let self = this;
    let {id} = qs.parse(location.search);
    if (!id) {
      return
    }
    this.setState({callIdArray: [id]});
    dispatch({
      type: 'sms/fetch',
      payload: {
        
      },
      callback: data => {
        let smsList = data.smsArray || [];
        if(smsList.length > 0) {
          this.setState({
            smsId: smsList[0].id,
            smsContent: smsList[0].smsContent
          });
        }
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const sendDate = values.sendDate ? values.sendDate.format('YYYY-MM-DD') : '';
        const sendTime = values.sendTime.format('HH:mm:ss');
        console.log({sendDate, sendTime})
        const fieldsValue = {
          ...values,
          'sendTimeStr': `${sendDate} ${sendTime}`
        };
        this.props.dispatch({
          type: 'sms/send',
          payload: {
            ...fieldsValue,
            ...this.state
          },
          callback() {
            // 给一个确认页面，还是直接跳转
            alert('发送成功');
            // window.location.hash = '/patient/list';
          }
        });
      }
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  onTplChange = (smsId) => {
    const { sms: {data: {list}} } = this.props;
    const smsTpl = listTem.filter(sms => sms.id == smsId);
    this.setState({
      smsId,
      smsContent:  smsTpl[0] ? smsTpl[0].smsContent : ''
    })
  }
  render() {
    const { submitting, form, sms: {data: {list}} } = this.props;
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
      <PageHeaderLayout title={!patient ? '新增患者' : '修改患者信息'} content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark = {false}
            style={{ marginTop: 8 }}
          > 
            <FormItem {...formItemLayout}
              label="短信模版名称">
              {getFieldDecorator('smsId', {
                // initialValue: this.state.smsId,
                rules: [{ required: true, message: '请选择短信模版' }],
              })(
                <Select
                  mode="radio"
                  placeholder="请选择短信模版"
                  onChange={this.onTplChange}
                  style={{
                    margin: '8px 0'
                  }}
                >
                  {listTem.map((tpl) =>
                    <Option key={tpl.id} value={tpl.id}>{tpl.smsName}</Option>
                  )}
                </Select>
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="短信内容"
            >
              {getFieldDecorator('smsContent', {
                initialValue: this.state.smsContent,
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入死亡原因" rows={4} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='发送日期'
            >
              {getFieldDecorator('sendDate', {
                
              })(
                <DatePicker />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='发送时间'
            >
              {getFieldDecorator('sendTime', {
                initialValue: moment('00:00:00', 'HH:mm:ss'),
              })(
                <TimePicker />
              )}
            </FormItem>


            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                发送
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
