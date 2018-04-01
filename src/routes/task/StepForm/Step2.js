import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, Card, Row, Col, DatePicker, List } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';
import qs from 'query-string';
import moment from 'moment';
import C_Select from '../../../components/c_select';

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
    componentDidMount() {
        const { dispatch } = this.props;
        // 问卷模版
        this.props.dispatch({
            type: 'category/fetchWJTpls',
        });
        //人员
        this.props.dispatch({
            type: 'category/fetchUsers',
        });
        //短信模版
        this.props.dispatch({
            type: 'category/fetchSMSTpls',
        });
    }
    render() {
        const { form, task, dispatch, submitting, WJTpls, Users, SMSTpls, category } = this.props;
        const { getFieldDecorator, validateFields } = form;
        const onPrev = () => {
            dispatch(routerRedux.goBack());
        };
        const onValidateForm = (e) => {
            e.preventDefault();
            validateFields((err, values) => {
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
                        callback(res) {
                            dispatch(routerRedux.push(`/task/taskAdd/result?result=${(res && !res.result) ? 1 : 0}`));
                        }

                    });
                }
            });
        };

        const Info = ({ title, value, bordered }) => (
            <div className={styles.headerInfo}>
                <span>{title}:</span>
                <span>{value}</span>
                {bordered && <em />}
            </div>
        );

        return (
            <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
                <Alert
                    message={`待随访患者总数：${task.waitCallCount}`} type="info"
                    style={{margin: '0 auto 16px', width: '80%'}}
                />
                <Form.Item
                    {...formItemLayout}
                    label="任务患者人数"
                >
                    {getFieldDecorator('patientNum', {

                    })(
                        <Input style={{ width: '50%' }} />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="预计完成日期"
                >
                    {getFieldDecorator('estimateTime', {

                    })(
                        <DatePicker style={{ width: '50%' }}/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="随访人员"
                >
                    {getFieldDecorator('userId', {

                    })(
                        <C_Select data={Users} style={{ width: '50%' }}>
                        </C_Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="随访任务名"
                >
                    {getFieldDecorator('taskName', {

                    })(
                        <Input style={{ width: '50%' }} />
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="短信模版"
                >
                    {getFieldDecorator('smsArray', {

                    })(
                        <C_Select data={SMSTpls} kv={['id', 'smsName']}
                            mode="multiple"
                            style={{ width: '50%' }}>
                        </C_Select>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="问卷模版"
                >
                    {getFieldDecorator('questionnaireId', {

                    })(
                        <C_Select data={WJTpls}
                        kv={['id', 'questionnaireName']}
                        style={{ width: '50%' }}>
                        </C_Select>
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

export default connect(({ task, loading, category }) => ({
    submitting: loading.effects['task/saveTask'],
    task: task.taskNum,
    WJTpls: category.WJTpls,
    Users: category.Users,
    SMSTpls: category.SMSTpls
}))(Step2);
