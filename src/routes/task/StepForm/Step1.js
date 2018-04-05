import React from 'react';
import { connect } from 'dva';
import {
    Form, Input, DatePicker, Select, Button, Card, InputNumber, Radio, Icon, Tooltip, Divider,
} from 'antd';
import qs from 'query-string';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import moment from 'moment';
import C_Select from '../../../components/c_select';

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
        const { patient, dispatch, data, form, category } = this.props;
        console.log(category, 13)
        const { getFieldDecorator, validateFields } = form;
        const onValidateForm = () => {
            validateFields((err, values) => {
                values = {
                    ...values,
                    beginTime: values.diagnoseTimeStr ? values.diagnoseTimeStr[0].format('YYYY-MM-DD') : '',
                    endTime: values.diagnoseTimeStr ? values.diagnoseTimeStr[1].format('YYYY-MM-DD') : '',
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
                        hideRequiredMark={false}
                        style={{ marginTop: 8 }}
                    >
                        <FormItem
                            {...formItemLayout}
                            label="诊断时间"
                        >
                            {getFieldDecorator('diagnoseTimeStr', {

                            })(
                                <RangePicker style={{ width: '50%' }}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="诊断科室"
                        >
                            {getFieldDecorator('deptId', {

                            })(
                                <C_Select data={category.Depts} needAll={true} style={{width: '50%'}} />
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
                    <p>一些说明注意事项而已</p>

                </div>
            </div>
        );
    }
}

export default connect(({ task, category }) => ({
    category
}))(Step1);
