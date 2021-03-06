import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Card } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import TableForm from './TableForm';
import qs from 'query-string';
import moment from 'moment';
import C_Select from '../../../components/c_select';
import category from '../../../models/category';


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
    admissionState: 1,
    diagnoseStages: '诊断分期'
}, {
    key: '2',
    diagnoseMode: 2,
    primaryFlag: 2,
    diagnoseName: '诊断名称',
    diagnoseCode: '诊断疾病编码',
    admissionState: 2,
    diagnoseStages: '诊断分期'
}, {
    key: '3',
    diagnoseMode: 3,
    primaryFlag: 3,
    diagnoseName: '诊断名称',
    diagnoseCode: '诊断疾病编码',
    admissionState: 3,
    diagnoseStages: '诊断分期'
}];

@Form.create()
class Step2 extends React.PureComponent {
    componentDidMount() {
        const { dispatch } = this.props;
        this.props.dispatch({
            type: 'category/fetchIcds',
        });
    }
    render() {
        const { form, dispatch, data, patient, cures, diseases, category } = this.props;
        const { getFieldDecorator, validateFields } = form;
        const onPrev = () => {
            dispatch(routerRedux.goBack());
        };
        const onValidateForm = () => {
            validateFields((err, values) => {

                if (!err) {
                    // dispatch({
                    //     type: 'patient/saveDiagnoseInfo',
                    //     payload: values,
                    // });
                    dispatch(routerRedux.push('/patient/diagnoseInfo/operationRecords'));
                }
            });
        };
        const onChange = data => {
            dispatch({
                type: 'patient/saveDiagnoseInfo',
                payload: {
                    data: {
                        diagnoseRecords: data
                    }
                },
            });
        }
        return (
            <div>
                <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
                    <Card title="诊断信息" className={styles.card} bordered={false}>
                        {getFieldDecorator('diagnoseRecords', {
                            initialValue: {
                                ...patient,
                                cures,
                                diseases,
                                icds: category.Icds
                            },
                        })(<TableForm onChange={onChange} />)}
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
                    <p>步骤2一些重要的说明</p>
                </div>
            </div>
        );
    }
}

export default connect(({ patient, category }) => ({
    patient: patient.diagnoseInfo,
    diseases: category.Diseases,
    cures: category.Cures,
    category
}))(Step2);

