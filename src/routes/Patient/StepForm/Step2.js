import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Card } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import TableForm from './TableForm';


const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
// 诊断类型，是否设置为原发诊断，诊断名称，诊断疾病编码，诊断分期，操作
/*
  diagnoseMode
primaryFlag
diagnoseName
diagnoseCode
pathologyName
pathologyCode
admissionState
pathologyGist
diagnoseStages
diagnoseDesc
tumourPart
icdoCode
outCase
 */
const tableData = [{
  key: '1',
  diagnoseMode: 1,
  primaryFlag: 1,
  diagnoseName: '诊断名称',
  diagnoseCode: '诊断疾病编码',
  admissionState: '入院病情',
  diagnoseStages: '诊断分期'  
}, {
  key: '2',
  diagnoseMode: 2,
  primaryFlag: 2,
  diagnoseName: '诊断名称',
  diagnoseCode: '诊断疾病编码',
  admissionState: '入院病情',
  diagnoseStages: '诊断分期'  
}, {
  key: '3',
  diagnoseMode: 3,
  primaryFlag: 3,
  diagnoseName: '诊断名称',
  diagnoseCode: '诊断疾病编码',
  admissionState: '入院病情',
  diagnoseStages: '诊断分期'
}];

@Form.create()
class Step1 extends React.PureComponent {
  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/patient/diagnoseInfo'));
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'patient/saveDiagnoseInfo',
            payload: values,
          });
          dispatch(routerRedux.push('/patient/diagnoseInfo/operationRecords'));
        }
      });
    };
    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Card title="成员管理" className={styles.card} bordered={false}>
            {getFieldDecorator('diagnoseRecords', {
              initialValue: tableData,
            })(<TableForm />)}
          </Card>
          <Form.Item
            style={{ marginBottom: 8 }}
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
            <Button onClick={onPrev} style={{ marginLeft: 8 }}>
              上一步
            </Button>
          </Form.Item>
        </Form>
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
  patient: patient.diagnoseInfo
}))(Step2);

