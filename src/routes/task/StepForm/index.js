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
  // componentDidMount() {
  //   const { dispatch, location } = this.props;
  //   let patientCode = qs.parse(location.search).patientCode;
  //   if (!patientCode) {
  //     return
  //   }
  //   dispatch({
  //     type: 'patient/getDiagnose',
  //     payload: {
  //       patientCode
  //     }
  //   });
  // }
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'search': return 0;
      case 'create': return 1;
      case 'result': return 2;
      default: return 0;
    }
  }
  render() {
    const { loading, match, routerData, location } = this.props;
    return (
      <PageHeaderLayout title="分步表单" content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。">
        <Card bordered={false}>
          <div>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="选择待随访患者" />
              <Step title="生成任务" />
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
              <Redirect exact from="/task/taskAdd" to={'/task/taskAdd/search'} />
              <Route render={NotFound} />
            </Switch>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
