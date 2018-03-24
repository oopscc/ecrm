import React from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import { routerRedux } from 'dva/router';
import Result from '../../../components/Result';
import styles from './style.less';
import qs from 'query-string';

class Step3 extends React.PureComponent {
    state = {
        type: '',
        title: ''
    }
    componentDidMount() {
        const { location } = this.props;
        let { result } = qs.parse(location.search);
        if (+result) {
            this.setState({
                type: 'success',
                title: '创建成功'
            })
        } else {
            this.setState({
                type: 'error',
                title: '创建失败'
            })
        }

    }
    render() {
        const { dispatch, data } = this.props;
        const {type, title} = this.state;
        const onFinish = () => {
            dispatch(routerRedux.push('/task/taskAdd'));
        };
        const onBack = () => {
            dispatch(routerRedux.push('/task/list'));
        };
        const actions = (
            <div>
                <Button type="primary" onClick={onFinish}>
                    再次分配任务
                </Button>
                <Button type="primary" onClick={onBack}>
                    返回任务列表
                </Button>
            </div>
        );
        return (
            <Result
                type={type}
                title={title}
                actions={actions}
                className={styles.result}
            />
        );
    }
}

export default connect(({  }) => ({

}))(Step3);
