import React, { PureComponent } from 'react';
import { Button, Select, DatePicker } from 'antd';
const { RangePicker } = DatePicker;

import styles from './index.less';

export default class TimeRangePicker extends PureComponent {
    static defaultProps = {
        mode: ['month', 'month'],
        value: [],
    };
    constructor(props) {
        super(props);
        this.state = {
            mode: props.mode,
            value: props.value,
            canOpen: true
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        })
    }
    handlePanelChange = (value, mode) => {
        const {onSelect} = this.props;
        if (mode[0] != 'date' && mode[1] != 'date') return false;
        this.setState({
            value,
            mode: [
                mode[0] === 'date' ? 'month' : mode[0],
                mode[1] === 'date' ? 'month' : mode[1],
            ],
            canOpen: false
        });
        setTimeout(()=>{
            this.setState({
                canOpen: true
            })
        });
        onSelect && onSelect(value);
    }
    render() {
        const { value, mode, canOpen } = this.state;
        const openState =  canOpen ? {} : {open: false};
        return (
            <RangePicker
                {...this.props}
                {...openState}
                format="YYYY-MM"
                value={value}
                mode={mode}
                onPanelChange={this.handlePanelChange}
            />
        );
    }
};


