import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import styles from './style.less';

export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
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
  toggleEditable=(e, key) => {
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
      key: `NEW_TEMP_ID_${this.index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  }
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
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
      this.props.onChange(this.state.data);
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
    const columns = [{
      title: '手术类型',
      dataIndex: 'operationScheme',
      key: 'operationScheme',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'operationScheme', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="成员姓名"
            />
          );
        }
        return text;
      },
    }, {
      title: '手术日期',
      dataIndex: 'operationDate',
      key: 'operationDate',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'operationDate', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="工号"
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
              onChange={e => this.handleFieldChange(e, 'operationName', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="所属部门"
            />
          );
        }
        return text;
      },
    },{
      title: 'cm3编码',
      dataIndex: 'cm3Code',
      key: 'cm3Code',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'cm3Code', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="所属部门"
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
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'operativeDoctor', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="所属部门"
            />
          );
        }
        return text;
      },
    }, {
      title: '麻醉医生',
      dataIndex: 'anesthesiaDoctor',
      key: 'anesthesiaDoctor',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'anesthesiaDoctor', record.key)}
              onBlur={e => this.saveRow(e, record.key)}
              onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="所属部门"
            />
          );
        }
        return text;
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
                <a>保存</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a>保存</a>
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
