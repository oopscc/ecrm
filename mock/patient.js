import { getUrlParams } from './utils';

// mock tableListDataSource
let tableListDataSource = [];
let diagnosesList = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    patientCode: i,
    name: '刘德华',
    sex: (i % 2),
    mobile: Math.floor(Math.random() * 1000),
    diseaseName: `这是病种名称${i}`,
    diagnoseTimeStr: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    diagnoseName: `原发性诊断名称${i}`,
    pathologyName: `原发性病理诊断名称${i}`,
    cureModeStr: `治疗方式${i}`,
    treatmentDoctor: `主治医师${(i % 3)}`,
    callTime: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    callResult: `随访结果${(i % 4)}`
  });
  diagnosesList.push({
    id: i,
    patientCode: i,
    name: '刘德华',
    diagnoseTimeStr: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    diagnoseDept: `诊断科别${i}`,
    admissionNumber: `患者住院次数${(i % 3)}`,
    admissionTimeStr: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    admissionDept: `入院科别${i}`,
    diagnoseName: `主要诊断`,
    treatmentDoctor: `主治医师${(i % 3)}`,
    outTimeStr: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    outDept: `出院科别${i}`
  });
}

export function getPatients(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    data: {
      rows: dataSource,
      total: dataSource.length,
      pageSize,
      currentPage: parseInt(params.currentPage, 10) || 1,
    }
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export function getDiagnoses(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    data: {
      rows: dataSource,
      total: dataSource.length,
      pageSize,
      currentPage: parseInt(params.currentPage, 10) || 1,
    }
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}
export function postRule(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, no, description } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => no.indexOf(item.no) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: ['https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png', 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png'][i % 2],
        no: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        description,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getPatients,
  getDiagnoses,
  postRule,
};
