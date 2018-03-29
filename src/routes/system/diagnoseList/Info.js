import React, {
    PureComponent,
    Fragment
} from 'react';
import {
    connect
} from 'dva';
import {
    routerRedux
} from 'dva/router';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider, Tag
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DropOption from '../../../components/DropOption';
import Icds from './list_icd';
import qs from 'query-string';

import styles from './List.less';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;

const CreateForm = Form.create()((props) => {
    const {
        modalVisible,
        form,
        handleAdd,
        handleModalVisible,
        handleSelectIcds,
    } = props;

    const onSelectRow = (rows) => {
        handleSelectIcds(rows);
    }
    return (
        <Modal
            title="添加疾病"
            visible={modalVisible}
            onOk={() => handleAdd()}
            onCancel={() => handleModalVisible()}
            width={1000}
        >
            <Icds
                onSelectRow={onSelectRow}
            >
            </Icds>
        </Modal>
    );
});

@connect(({ system, loading, }) => ({
    diseases: system.diseases,
    loading: loading.models.system,
}))
@Form.create()
export default class TableList extends PureComponent {
    state = {
        modalVisible: false,
        formValues: {},
        seleceedIcds: [],
        icds: [],
        id: '',
        diseaseName: ''
    };

    componentDidMount() {
        const { dispatch, location } = this.props;
        let { id, diseaseName } = qs.parse(location.search);
        if (!id) {
            return
        }
        this.setState({
            id, diseaseName
        })
        dispatch({
            type: 'system/getDisease',
            payload: { id },
            callback: data => {
                this.setState({
                    diseaseName: data.data.diseaseName,
                    icds: data.data.illnessArr
                })
            }
        });

    }

    handleFormReset = () => {
        const {
            form,
            dispatch
        } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'system/fetchDiseases',
            payload: {},
        });
    }

    toggleForm = () => {
        this.setState({
            expandForm: !this.state.expandForm,
        });
    }

    handleSearch = (e) => {
        e.preventDefault();
        const {
            dispatch,
            form,
        } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const values = {
                ...fieldsValue,
                id: this.state.id,
                illnessIdList: this.state.icds.map(item => item.id)
            };
            const type = !this.state.id ? 'system/addDisease' : 'system/editDisease';
            this.props.dispatch({
                type,
                payload: values,
                callback: (res) => {
                    if (res && !res.result) {
                        this.props.dispatch(routerRedux.goBack());
                    }
                }
            });

        });
    }

    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag,
            seleceedIcds: []
        });
    }
    handleSelectIcds = icds => {
        this.setState({
            seleceedIcds: icds
        });
    }

    handleAdd = () => {
        const icds = this.state.seleceedIcds;
        const icdIds = Array.from(icds, item => item.id);
        this.setState({
            icds: [...this.state.icds.filter(icd => !icdIds.includes(icd.id)), ...icds],
            modalVisible: false,
        });
    }

    handleDelete = icd => {
        this.setState({
            icds: [...this.state.icds.filter(item => item.id != icd.id)]
        })
    }

    renderSimpleForm() {
        const {
            getFieldDecorator
        } = this.props.form;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="病种名称">
                            {getFieldDecorator('diseaseName', {
                                initialValue: this.state.diseaseName,
                                rules: [{
                                    required: true, message: '请输入病种名称',
                                }],
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button style={{ marginLeft: 8 }} onClick={() => this.handleModalVisible(true)}>添加</Button>
                            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">保存</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderForm() {
        return this.renderSimpleForm();
    }

    render() {
        const { loading, } = this.props;
        const { selectedRows, modalVisible, icds} = this.state;
        const data = {list: icds};
        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
            handleSelectIcds: this.handleSelectIcds,
        };

        const columns = [
            {
                title: '序号',
                width: '20%',
                dataIndex: 'id',
                key: 'id',
                render: (text, record, index) => {
                    return +index + 1;
                },
                align: 'center'
            }, {
                title: '疾病编码',
                dataIndex: 'illnessCode',
                key: 'illnessCode',
                width: '25%'
            }, {
                title: '疾病名称',
                dataIndex: 'illnessName',
                key: 'illnessName',
                width: '25%'
            }, {
                title: '操作',
                key: 'operation',
                render: (text, record) => {
                    return <div>
                        <Tag color="#f50" onClick={this.handleDelete.bind(this, record)}>删除</Tag>
                    </div>
                }
            }]

        return (
            <PageHeaderLayout title="添加病种">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>
                            {this.renderForm()}
                        </div>
                        <StandardTable
                            loading={loading}
                            data={data}
                            columns={columns}
                            size="small"
                        />
                    </div>

                </Card>
                <CreateForm
                    {...parentMethods}
                    modalVisible={modalVisible}
                />
            </PageHeaderLayout>
        );
    }
}
