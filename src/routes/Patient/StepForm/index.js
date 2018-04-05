import React, { PureComponent } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NotFound from '../../Exception/404';
import { getRoutes } from '../../../utils/utils';
import styles from '../style.less';
import qs from 'query-string';

const { Step } = Steps;


export default class StepForm extends PureComponent {

    getCurrentStep() {
        const { location } = this.props;
        const { pathname } = location;
        const pathList = pathname.split('/');
        switch (pathList[pathList.length - 1]) {
            case 'info': return 0;
            case 'diagnoseRecords': return 1;
            case 'operationRecords': return 2;
            case 'result': return 3;
            default: return 0;
        }
    }
    render() {
        const { loading, match, routerData, location } = this.props;
        return (
            <PageHeaderLayout needBack={true} title="添加患者住院信息" content="分步填写患者的住院信息，诊断信息，手术信息。">
                <Card bordered={false}>
                    <div>
                        <Steps current={this.getCurrentStep()} className={styles.steps}>
                            <Step title="填写住院信息" />
                            <Step title="填写诊断信息" />
                            <Step title="填写手术信息" />
                            <Step title="完成" />
                        </Steps>
                        <Switch>
                            {
                                getRoutes(match.path, routerData).map(item => (
                                    <Route
                                        key={item.key}
                                        path={item.path}
                                        component={item.component}
                                        exact={item.exact}
                                    />
                                ))
                            }
                            <Redirect exact from="/patient/diagnoseInfo" to={'/patient/diagnoseInfo/info' + location.search} />
                            <Route render={NotFound} />
                        </Switch>
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}
