import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import qs from 'query-string'
import {
  Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip,
} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './info.less';

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
    icd: false,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    let self = this;
    let id = qs.parse(location.search).id;
    if (!id) {
      return
    }
    dispatch({
      type: 'system/getICD',
      payload: {
        id
      },
      callback(data) {
        self.setState({
          icd: data.data
        });
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let type = 'system/addICD';
    if (this.state.user) {
      type = 'system/editICD';
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const fieldsValue = {
          ...values
        };
        this.props.dispatch({
          type,
          payload: fieldsValue,
          callback: () => {
            window.location.hash = '/system/icd-10/list';
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
      <PageHeaderLayout title={!user ? '添加疾病' : '修改疾病'} content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark = {false}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label='疾病名称'
            >
              {getFieldDecorator('illnessName', {
                initialValue: icd ? icd.illnessName : '',
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
                initialValue: icd ? icd.illnessCode : '',
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
                  initialValue: icd && icd.sexLimit ? icd.sexLimit : '0',
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
