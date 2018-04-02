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

@connect(({ loading, user }) => ({
  user,
  submitting: loading.effects['user/addUser'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {
    user: false,
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    let self = this;
    let userId = qs.parse(location.search).userId;
    if (!userId) {
      return
    }
    dispatch({
      type: 'user/getUser',
      payload: {
        userId
      },
      callback(data) {
        self.setState({
          user: data.data
        });
      }
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let type = 'user/addUser';
    if (this.state.user) {
      type = 'user/editUser';
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
            window.location.hash = '/system/user/list';
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
    const { user } = this.state;
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
      <PageHeaderLayout title={!user ? '添加用户' : '修改用户'} content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark = {false}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label='用户名'
            >
              {getFieldDecorator('userId', {
                initialValue: user ? user.userId : '',
                rules: [{
                  required: true, message: '请输入用户名',
                }],
              })(
                <Input placeholder="请输入用户名" />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="姓名"
            >
              {getFieldDecorator('userName', {
                initialValue: user ? user.userName : '',
                rules: [{
                  required: true, message: '请输入用户姓名',
                }],
              })(
                <Input placeholder="请输入用户姓名" />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="性别"
            >
              <div>
                {getFieldDecorator('sex', {
                  initialValue: user && user.sex ? user.sex : '0',
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
              {getFieldDecorator('userPhone', {
                initialValue: user.userPhone,
                // rules: [{ required: true, message: 'Please input your phone number!' }],
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="邮箱地址"
            >
              {getFieldDecorator('userEmail', {
                initialValue: user.userEmail,
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>

            <FormItem {...formItemLayout}
              label="科室名称">
              {getFieldDecorator('deptId', {
                initialValue: user ? user.deptId : '',
                rules: [{ required: true, message: '请选择科室' }],
              })(
                <Select
                  mode="radio"
                  placeholder="请选择科室"
                  style={{
                    margin: '8px 0'
                  }}
                >
                  <Option value="0">1科科</Option>
                  <Option value="1">2科科</Option>
                  <Option value="2">3科科</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
              label="职称">
              {getFieldDecorator('jobId', {
                initialValue: user ? user.jobId : '',
                rules: [{ required: true, message: '请选择职称' }],
              })(
                <Select
                  mode="radio"
                  placeholder="请选择职称"
                  style={{
                    margin: '8px 0'
                  }}
                >
                  <Option value="0">1科科</Option>
                  <Option value="1">2科科</Option>
                  <Option value="2">3科科</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
              label="职务">
              {getFieldDecorator('dutyId', {
                initialValue: user ? user.dutyId : '',
                rules: [{ required: true, message: '请选择职务' }],
              })(
                <Select
                  mode="radio"
                  placeholder="请选择职务"
                  style={{
                    margin: '8px 0'
                  }}
                >
                  <Option value="0">1科科</Option>
                  <Option value="1">2科科</Option>
                  <Option value="2">3科科</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout}
              label="角色">
              {getFieldDecorator('roleId', {
                initialValue: user ? user.roleId : '',
                rules: [{ required: true, message: '请选择角色' }],
              })(
                <Select
                  mode="radio"
                  placeholder="请选择角色"
                  style={{
                    margin: '8px 0'
                  }}
                >
                  <Option value="0">1科科</Option>
                  <Option value="1">2科科</Option>
                  <Option value="2">3科科</Option>
                </Select>
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
