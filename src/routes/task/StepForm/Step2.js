import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, Card, Row, Col, DatePicker} from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';
import qs from 'query-string';
import moment from 'moment';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};


@Form.create()
class Step2 extends React.PureComponent {

  render() {
    const { form, task, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/task/search'));
    };
    const onValidateForm = (e) => {
      e.preventDefault();
      validateFields((err, values) => {
        console.log(123, values)
        if (!err) {
          values = {
            ...values,
            estimateTime: values.estimateTime ? values.estimateTime.format('YYYY-MM-DD') : ''
          };
          dispatch({
            type: 'task/saveTask',
            payload: {
              ...values
            },
          });
        }
      });
    };
    
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    return (
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
        <Card bordered={false}>
          <Row>
            <Col sm={6} xs={24}>
              <Info title="待随访患者总数" value={task.willCount} bordered />
            </Col>
            <Col sm={6} xs={24}>
              <Info title="今日已随访人数" value={task.counted} bordered />
            </Col>
            
          </Row>
        </Card>
        <Form.Item
          {...formItemLayout}
          label="任务患者人数"
        >
          {getFieldDecorator('patientNum', {

          })(
            <Input style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="预计完成日期"
        >
          {getFieldDecorator('estimateTime', {

          })(
              <DatePicker />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="随访人员"
        >
          {getFieldDecorator('userId', {

          })(
            <Input style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="随访任务名"
        >
          {getFieldDecorator('taskName', {

          })(
            <Input style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="短信模版"
        >
          {getFieldDecorator('smsArray', {

          })(
            <Input style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="问卷模版"
        >
          {getFieldDecorator('questionnaireId', {

          })(
            <Input style={{ width: '100%' }} />
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ task, loading }) => ({
  submitting: loading.effects['task/saveTask'],
  task: task.taskNum
}))(Step2);