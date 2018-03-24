import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, DatePicker } from 'antd';
import moment from 'moment';
import styles from './style.less';
import C_Select from '../../../components/c_select';

export default class TableForm extends PureComponent {
    constructor(props) {
        super(props);
        const data = (props.value.operationRecords || []).map(item => {
            return { ...item, key: item.id }
        })
        this.state = {
            data,
            cures: props.value.cures || [],
            diseases: props.value.diseases || [],
            doctors: props.value.doctors || [],
            anesthesias: props.value.anesthesias || [],
            loading: false,
        };
    }
    componentWillReceiveProps(nextProps) {
        // if ('value' in nextProps) {
        //     this.setState({
        //         data: nextProps.value,
        //     });
        // }
    }
    getRowByKey(key, newData) {
        return (newData || this.state.data).filter(item => item.key === key)[0];
    }
    index = 0;
    cacheOriginData = {};
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: 'form/submit',
                    payload: values,
                });
            }
        });
    }
    toggleEditable = (e, key) => {
        e.preventDefault();
        const newData = this.state.data.map(item => ({ ...item }));
        const target = this.getRowByKey(key, newData);
        if (target) {
            // 进入编辑状态时保存原始数据
            if (!target.editable) {
                this.cacheOriginData[key] = { ...target };
            }
            target.editable = !target.editable;
            this.setState({ data: newData });
            this.props.onChange(newData);
        }
    }
    remove(key) {
        const newData = this.state.data.filter(item => item.key !== key);
        this.setState({ data: newData });
        this.props.onChange(newData);
    }
    newMember = () => {
        const newData = this.state.data.map(item => ({ ...item }));
        newData.push({
            key: `NEW_Operate_ID_${this.index}`,
            name: '',
            editable: true,
            isNew: true,
        });
        this.index += 1;
        this.setState({ data: newData });
    }
    handleKeyPress(e, key) {
        // if (e.key === 'Enter') {
        //     this.saveRow(e, key);
        // }
    }
    handleFieldChange(value, fieldName, key) {
        const newData = this.state.data.map(item => ({ ...item }));
        const target = this.getRowByKey(key, newData);
        if (target) {
            target[fieldName] = value;
            this.setState({ data: newData });
        }
    }
    saveRow(e, key) {
        e.persist();
        this.setState({
            loading: true,
        });
        // save field when blur input
        setTimeout(() => {
            if (document.activeElement.tagName === 'INPUT' &&
                document.activeElement !== e.target) {
                this.setState({
                    loading: false,
                });
                return;
            }
            if (this.clickedCancel) {
                this.clickedCancel = false;
                this.setState({
                    loading: false,
                });
                return;
            }
            const target = this.getRowByKey(key) || {};
            // if (!target.workId || !target.name || !target.department) {
            //   message.error('请填写完整成员信息。');
            //   e.target.focus();
            //   this.setState({
            //     loading: false,
            //   });
            //   return;
            // }
            delete target.isNew;
            this.toggleEditable(e, key);
            // this.props.onChange(this.state.data);
            this.setState({
                loading: false,
            });
        }, 500);
    }
    cancel(e, key) {
        this.clickedCancel = true;
        e.preventDefault();
        const newData = this.state.data.map(item => ({ ...item }));
        const target = this.getRowByKey(key, newData);
        if (this.cacheOriginData[key]) {
            Object.assign(target, this.cacheOriginData[key]);
            target.editable = false;
            delete this.cacheOriginData[key];
        }
        this.setState({ data: newData });
    }
    render() {
        const { cures, diseases, doctors, anesthesias } = this.state;
        const columns = [{
            title: '治疗方案',
            dataIndex: 'operationScheme',
            key: 'operationScheme',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <C_Select data={cures} defaultValue={text}
                            autoFocus
                            onChange={e => this.handleFieldChange(e, 'operationScheme', record.key)}
                        />
                    );
                }
                let names = cures.filter(item => item.id == text)[0];
                return names ? names.name : '';
            },
        }, {
            title: '手术日期',
            dataIndex: 'operationDateStr',
            key: 'operationDateStr',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    let date = text ? moment(text, 'YYYY-MM-DD') : moment('2018-01-01', 'YYYY-MM-DD');
                    return (
                        <DatePicker
                            defaultValue={date}
                            onChange={(e, dateStr) => this.handleFieldChange(dateStr, 'operationDateStr', record.key)}
                            placeholder="手术日期"
                        />
                    );
                }
                return text;
            },
        }, {
            title: '手术名称',
            dataIndex: 'operationName',
            key: 'operationName',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Input
                            value={text}
                            onChange={e => this.handleFieldChange(e.target.value, 'operationName', record.key)}
                            placeholder="手术名称"
                        />
                    );
                }
                return text;
            },
        }, {
            title: 'cm3编码',
            dataIndex: 'cm3Code',
            key: 'cm3Code',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <Input
                            value={text}
                            onChange={e => this.handleFieldChange(e.target.value, 'cm3Code', record.key)}
                            placeholder="cm3编码"
                        />
                    );
                }
                return text;
            },
        }, {
            title: '手术医生',
            dataIndex: 'operativeDoctor',
            key: 'operativeDoctor',
            width: '15%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <C_Select data={doctors} defaultValue={text}
                            onChange={e => this.handleFieldChange(e, 'operativeDoctor', record.key)}
                        />
                    );
                }
                let names = doctors.filter(item => item.id == text)[0];
                return names ? names.name : '';
            },
        }, {
            title: '麻醉方式',
            dataIndex: 'anesthesiaMode',
            key: 'anesthesiaMode',
            width: '10%',
            render: (text, record) => {
                if (record.editable) {
                    return (
                        <C_Select data={anesthesias} defaultValue={text}
                            onChange={e => this.handleFieldChange(e, 'anesthesiaMode', record.key)}
                        />
                    );
                }
                let names = anesthesias.filter(item => item.id == text)[0];
                return names ? names.name : '';

            },
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => {
                if (!!record.editable && this.state.loading) {
                    return null;
                }
                if (record.editable) {
                    if (record.isNew) {
                        return (
                            <span>
                                <a onClick={e => this.toggleEditable(e, record.key)}>保存</a>
                                <Divider type="vertical" />
                                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </span>
                        );
                    }
                    return (
                        <span>
                            <a onClick={e => this.toggleEditable(e, record.key)}>保存</a>
                            <Divider type="vertical" />
                            <a onClick={e => this.cancel(e, record.key)}>取消</a>
                        </span>
                    );
                }
                return (
                    <span>
                        <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                            <a>删除</a>
                        </Popconfirm>
                    </span>
                );
            },
        }];

        return (
            <div>
                <Table
                    loading={this.state.loading}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={false}
                    rowClassName={(record) => {
                        return record.editable ? styles.editable : '';
                    }}
                />
                <Button
                    style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
                    type="dashed"
                    onClick={this.newMember}
                    icon="plus"
                >
                    新增手术
        </Button>
            </div>
        );
    }
}
