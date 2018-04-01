import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider, Card } from 'antd';
import { routerRedux } from 'dva/router';
import { digitUppercase } from '../../../utils/utils';
import styles from './style.less';
import OperationRecords from './OperationRecords';
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

// 治疗方案，手术日期， 手术名称，cm3编码，手术者，一助，二助, 操作
/*
  operationScheme
  operationDate
  operationName
  cm3Code
  operativeDoctor
  oneAid
  twoAid
  anesthesiaMode
  anesthesiaDoctor
  incisionGrade
  incisionRecover
 */

@Form.create()
class Step3 extends React.PureComponent {

    render() {
        const { form, patient, dispatch, submitting, cures,  diseases, anesthesias, doctors } = this.props;
        const { getFieldDecorator, validateFields } = form;
        const onPrev = () => {
            dispatch(routerRedux.goBack());
        };
        const onValidateForm = (e) => {
            e.preventDefault();
            validateFields((err, values) => {
                if (!err) {
                    // dispatch({
                    //     type: 'patient/saveDiagnoseInfo',
                    //     payload: {
                    //         data: {
                    //             ...values,
                    //         }
                    //     },
                    // });
                    let type = patient.id ? 'patient/editDiagnose' : 'patient/addDiagnose';
                    dispatch({
                        type,
                        payload: patient,
                    });
                }
            });
        };
        const onChange = data => {
            dispatch({
                type: 'patient/saveDiagnoseInfo',
                payload: {
                    data: {
                        operationRecords: data
                    }
                },
            });
        }
        return (
            <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
                <Card title="手术信息" className={styles.card} bordered={false}>
                    {getFieldDecorator('operationRecords', {
                        initialValue: {
                            ...patient,
                            cures,
                            diseases,
                            doctors,
                            anesthesias
                        },
                    })(<OperationRecords onChange={onChange}/>)}
                </Card>
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

export default connect(({ patient, loading, category }) => ({
    submitting: loading.effects['patient/addDiagnose'],
    patient: patient.diagnoseInfo,
    diseases: category.Diseases,
    cures: category.Cures,
    anesthesias: category.Anesthesias,
    doctors: category.Doctors
}))(Step3);
