import { Form, Input, Icon, Button, Row, Col, Divider } from 'antd';
const FormItem = Form.Item;
import C_Select from '../../../components/c_select';
const CallResult = [{ id: '102002', value: '无人接听' }, { id: '102007', value: '关机' }, { id: '101001', value: '稳定' }];
import styles from './smsTpl.less';

export default class DynamicFieldSet extends React.Component {
    constructor(props) {
        super(props);
        const {replys} = props;
        this.state = {
            keys: Array.from(replys, (x, index) => `replyId${index}`),
            uuid: replys.length,
            smsReplys: replys
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            keys: Array.from(nextProps.replys, (x, index) => `replyId${index}`),
            uuid: nextProps.replys.length,
            smsReplys: nextProps.replys
        })

    }

    remove = (k) => {
        const { form } = this.props;
        const keys = this.state.keys;
        if (keys.length === 1) {
            return;
        }
        this.setState({
            keys: keys.filter(key => key !== k),
        })
    }

    add = () => {
        const { form } = this.props;
        const { keys, uuid, smsReplys } = this.state;
        const nextKeys = keys.concat(`replyId${uuid}`);
        const newsmsReplys = smsReplys.concat({
            replyContent: '',
            contentResult: ''
        });
        this.setState({
            uuid: uuid + 1,
            keys: nextKeys,
            smsReplys: newsmsReplys
        })
    }


    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { keys, smsReplys } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4, offset: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const {PStates} = this.props;
        const formItems = keys.map((replyId, index) => {
            return(
                <div key={replyId} >
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={12} sm={24} offset={0}>
                            <FormItem
                                {...(formItemLayout)}
                                label={'回复'}
                                required={false}
                            >
                                {getFieldDecorator(`smsReplys[${replyId}].replyContent`, {
                                    initialValue: smsReplys[index].replyContent,
                                    validateTrigger: ['onChange', 'onBlur'],

                                })(
                                    <Input placeholder="passenger name" style={{ width: '90%' }} />
                                )}
                            </FormItem>
                        </Col>
                        <Col md={12} sm={24}>
                        {
                            <FormItem
                                {...(formItemLayout1)}
                                label={'含义'}
                                required={false}
                                colon={false}
                            >
                                {getFieldDecorator(`smsReplys[${replyId}].contentResult`, {
                                    initialValue: smsReplys[index].contentResult,
                                    validateTrigger: ['onChange', 'onBlur'],

                                })(
                                    <C_Select
                                        data={PStates}
                                        style={{ width: '56%', color: '#999', marginRight: 4 }}
                                    />
                                )}
                                <Icon
                                    className={styles.dynamicButton}
                                    type="plus-circle-o"
                                    onClick={() => this.add()}
                                />
                                <Icon
                                    className={styles.dynamicButton}
                                    type="minus-circle-o"
                                    onClick={() => this.remove(replyId)}
                                />
                            </FormItem>
                        }
                        </Col>
                    </Row>
                </div>
            )
        });
        return (
            <div>
                {formItems}
            </div>
        );
    }
}
