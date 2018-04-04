//提示日志
function AppendStatus(szStatus) {
    console.log(url_GetNowTimeString() + ' ' + szStatus);
}

//接收到的回调事件信息
//**********************************************************************//
function cmd_json_callback(tagaccount, cmd, url, jsonObj) {
    //===================================
    if (cmd == u_cmd_doecho) {
        if (jsonObj.ret > 0) AppendStatus("Echo连接服务器网络正常");
        else AppendStatus("**Echo连接服务器失败**");
    }
    else if (cmd == u_cmd_querylastevent) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("最后状态获取失败:" + url);
        else {
            //alert(url_GetJsonString(jsonObj));
        }
    }
    else if (cmd == u_cmd_querydtmfcmd) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("查询节点DTMFCmd失败:" + url);
        else {
            if (jsonObj.ret <= 0) {
                AppendStatus("获取节点DTMFCmd错误:" + tagaccount.m_from);
            }
            else {
                AppendStatus("[" + tagaccount.m_from + "]" + "获取节点DTMFCmd信息: itemname:" + jsonObj.itemname + " dtmfcmd:" + jsonObj.dtmfcmd);
            }
        }
    }
    else if (cmd == u_cmd_dogoivr) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("跳转IVR失败:" + url);
        else {
            if (jsonObj.ret <= 0) {
                AppendStatus("跳转IVR错误:" + tagaccount.m_from);
            }
            else {
                AppendStatus("[" + tagaccount.m_from + "]" + "跳转IVR完成");
            }
        }
    }
    else if (cmd == u_cmd_queryaccount) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("获取账号状态失败:" + url);
        else {
            if (jsonObj.ret <= 0) {
                AppendStatus("获取数据错误:" + tagaccount.m_from);
            }
            else {
                //alert(url_GetJsonString(jsonObj));
                AppendStatus("获取账号信息:" + jsonObj.list[0].account + " online:" + jsonObj.list[0].online + " dobusy:" + jsonObj.list[0].dobusy);
            }
        }
    }
    else if (cmd == u_cmd_clearevent) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("清除事件执行失败:" + url);
        else {
            AppendStatus("清除事件执行完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_setuploadparam) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("设置参数失败:" + url);
        else {
            AppendStatus("设置参数完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_dohang) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("挂机执行失败:" + url);
        else {
            url_SetGuid(tagaccount.m_id, '');
            AppendStatus("挂机完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_setdevctrl) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("执行控制设备失败:" + url);
        else {
            AppendStatus("控制设备完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_enablespk) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("控制耳机失败:" + url);
        else {
            AppendStatus("控制耳机完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_enablemic) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("控制麦克风失败:" + url);
        else {
            AppendStatus("控制麦克风完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_dohangex) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("强拆执行失败:" + url);
        else {
            url_SetGuid(tagaccount.m_id, '');
            AppendStatus("强拆完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_dohold) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("保持执行失败:" + url);
        else {
            AppendStatus("保持完成:" + jsonObj.hold);
        }
    }
    else if (cmd == u_cmd_doinsert) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("强插执行失败:" + url);
        else {
            AppendStatus("挂机完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_domonitor) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("监听执行失败:" + url);
        else {
            AppendStatus("监听完成:" + jsonObj.ret);
        }
    }
    else if (cmd == u_cmd_doinvite) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("三方邀请呼叫失败:" + url);
        else {
            if (jsonObj.ret > 0) {
                AppendStatus("三方邀请完成:" + jsonObj.ret + "  newguid=" + jsonObj.newguid);
            }
            else {
                AppendStatus("三方邀请呼叫失败:" + jsonObj.ret);
            }
        }
    }
    else if (cmd == u_cmd_dial) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("拨号执行失败:" + url);
        else {
            if (jsonObj.ret == 1) {
                url_SetGuid(tagaccount.m_id, jsonObj.guid);//保存guid
                AppendStatus("开始呼叫");
            }
            else {
                AppendStatus("呼叫失败:" + jsonObj.ret + " from:" + jsonObj.from + " to:" + jsonObj.to);
            }
        }
    }
    else if (cmd == u_cmd_dobusy || cmd == u_cmd_dobusyex) {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("示忙执行失败:" + url);
        else {
            if (jsonObj.ret == 1 && jsonObj.busy > 0) {
                AppendStatus("执行示忙成功:" + jsonObj.from);
            }
            else if (jsonObj.ret == 0 && jsonObj.busy > 0) {
                AppendStatus("执行示忙失败:" + jsonObj.from);
            }
            else if (jsonObj.ret == 1 && jsonObj.busy == 0) {
                AppendStatus("执行示闲成功:" + jsonObj.from);
            }
            else if (jsonObj.ret == 0 && jsonObj.busy == 0) {
                AppendStatus("执行示闲失败:" + jsonObj.from);
            }
        }
    }
    //========================================
    else {
        if (url_IsAjaxErrObj(jsonObj)) AppendStatus("执行命令失败:" + url);
        else {
            AppendStatus("执行命令完成: cmd:" + cmd + " url:" + url + " " + url_GetJsonString(jsonObj));
        }
    }
}

//**********************************************************************//
function event_json_callback(tagaccount, url, ret, eventObj) {
    if (url_IsAjaxErrRet(ret)) {
        AppendStatus("执行事件读取超时失败:" + url);
        return;
    }
    else if (ret < 0) {
        if (tagaccount.m_login == 0) {
            AppendStatus("账号未登陆:" + tagaccount.m_from);
        }
        else {
            AppendStatus("获取事件失败:" + ret);
        }
        return;
    }
    else if (ret == 0) {
        //AppendStatus("没有事件,等候...");
        return;
    }
    else {
        //alert(url_GetJsonString(eventObj));
        if (eventObj.type == OSIPSEVENT_CALLIN
            || eventObj.type == OSIPSEVENT_CALLOUT) {
            switch (eventObj.uctype) {
                case 11:
                    {
                        event_callin(tagaccount, eventObj);
                    } break;
                case 12:
                    {
                        event_callout(tagaccount, eventObj);
                    } break;
                case 13:
                    {
                        event_callext(tagaccount, eventObj);
                    } break;
                case 30:
                    {
                        event_callout_act(tagaccount, eventObj);
                    } break;
                default: break;
            }
        }
        else if (eventObj.type == OSIPSEVENT_LOGIN) {
            AppendStatus("账号在线..." + tagaccount.m_from);
        }
        else if (eventObj.type == OSIPSEVENT_LOGOUT) {
            AppendStatus("账号离线..." + tagaccount.m_from);
        }
        else if (eventObj.type == OSIPSEVENT_UPDATESTATE) {
            if (eventObj.result == OSIPS_STATE_BUSY) {
                if (eventObj.param > 0) AppendStatus("[" + tagaccount.m_from + "]示忙...");
                else AppendStatus("[" + tagaccount.m_from + "]示闲...");
            }
            else if (eventObj.result == OSIPS_STATE_MIC) {
                AppendStatus("[" + tagaccount.m_from + "-guid:" + eventObj.guid + "]MIC..." + eventObj.param);
            }
            else if (eventObj.result == OSIPS_STATE_SPK) {
                AppendStatus("[" + tagaccount.m_from + "-guid:" + eventObj.guid + "]SPK..." + eventObj.param);
            }
        }
        else if (eventObj.type == OSIPSEVENT_RECVDTMF) {
            AppendStatus("接收到按键：" + eventObj.dtmf);
        }
        else if (eventObj.type == OSIPSEVENT_PHONEHOOK) {
            AppendStatus("电话摘机");
        }
    }
}

function event_callin(tagaccount, eventObj) {
    switch (eventObj.result) {
        case 102:
            {
                url_SetCaller(0, url_GetJsonCaller(eventObj));
                AppendStatus("[" + tagaccount.m_from + "]来电呼叫:" + eventObj.from + "&caller=" + url_GetJsonCaller(eventObj));
            } break;
        case 104:
            {
                AppendStatus("[" + tagaccount.m_from + "]来电响铃弹屏:" + eventObj.from + "&uctype=" + eventObj.uctype + "&caller=" + url_GetJsonCaller(eventObj));
                window.event_call_in(eventObj.from);
                if (url_GetJsonCaller(eventObj).length > 0) {//查询是否从ivr按键后弹屏
                    //T_QueryDTMFCmdEx(document.getElementById('itemname').value, url_GetJsonCaller(eventObj));
                }
            } break;
        case 108:
            {
                AppendStatus("[" + tagaccount.m_from + "]来电接通:" + eventObj.from);
            } break;
        case 120:
            {
                AppendStatus("[" + tagaccount.m_from + "]来电对方挂机/忙音:" + eventObj.from);
            } break;
        case 121:
            {
                AppendStatus("[" + tagaccount.m_from + "]来电结束:" + eventObj.from);
            } break;
        default: break;
    }
}

function event_callout(tagaccount, eventObj) {
    switch (eventObj.result) {
        case 202:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话拨号去电:" + eventObj.from + "-" + eventObj.to);
            } break;
        case 204:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话拨号去电响铃弹屏:" + eventObj.from + "-" + eventObj.to);
            } break;
        case 208:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话拨号去电接通:" + eventObj.from + "-" + eventObj.to);
            } break;
        case 220:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话拨号对方挂机/忙音:" + eventObj.from + "-" + eventObj.to);
            } break;
        case 221:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话拨号去电结束:" + eventObj.from + "-" + eventObj.to);
            } break;
        default: break;
    }
}

function event_callout_act(tagaccount, eventObj) {
    switch (eventObj.result) {
        case 202:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话抢接拨号:" + eventObj.to);
            } break;
        case 208:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话抢接接通弹屏:" + eventObj.to);
            } break;
        case 221:
            {
                AppendStatus("[" + tagaccount.m_from + "]电话抢接结束:" + eventObj.to);
            } break;
        default: break;
    }
}

function event_callext(tagaccount, eventObj) {
    switch (eventObj.result) {
        case 102:
            {
                AppendStatus("[" + tagaccount.m_from + "]软拨号正在呼叫:" + eventObj.from + " guid=" + eventObj.guid);
            } break;
        case 104:
            {
                AppendStatus("[" + tagaccount.m_from + "]软拨号去电响铃弹屏:" + eventObj.from);
            } break;
        case 108:
            {
                AppendStatus("[" + tagaccount.m_from + "]软拨号分机接通:" + eventObj.from);
            } break;
        case 120:
            {
                AppendStatus("[" + tagaccount.m_from + "]软拨号分机对方挂机/忙音:" + eventObj.from);
            } break;
        case 121:
            {
                AppendStatus("[" + tagaccount.m_from + "]软拨号去电结束:" + eventObj.from);
            } break;
        default: break;
    }
}
//**********************************************************************//

function T_DoHang() {
    if (url_DoHang(0) < 0) {
        AppendStatus("挂机错误");
    }
    else {
        AppendStatus("挂机");
    }
}
function T_DoAnswer() {
    if (url_DoAnswer(0) < 0) {
        AppendStatus("usb设备应答错误");
    }
    else {
        AppendStatus("usb设备应答");
    }
}
function T_DoExtAnswer() {
    if (url_DoExtAnswer(0) < 0) {
        AppendStatus("sip软分机应答错误");
    }
    else {
        AppendStatus("sip软分机应答");
    }
}
function T_StartDial(to) {
    if (url_StartDial(0, to) <= 0) {
        AppendStatus("拨号错误");
    }
    else {
        AppendStatus("拨号:" + to);
    }
}

function T_QueryDTMFCmdEx(itemname, szguid) {
    if (url_QueryDTMFCmdEx(0, itemname, szguid) <= 0) {
        AppendStatus("查询dtmfcmd ex错误");
    }
}

function T_QueryDTMFCmd(itemname) {
    if (url_QueryDTMFCmd(0, itemname, 1) <= 0) {
        AppendStatus("查询dtmfcmd错误");
    }
}

function T_DoGoIVR(xmlfile) {
    if (url_DoGoIVR(0, xmlfile, '', 1) <= 0) {
        AppendStatus("跳转IVR错误");
    }
}
function T_PlayFile(szFile, loop, interval) {
    if (url_StartPlayFileEx(0, szFile, loop, interval, 3, 50) <= 0) {
        AppendStatus("播放文件失败");
    }
    else {
        AppendStatus("播放文件");
    }
}

function T_DoEcho(ip, port) {
    url_SetIP(0, ip, port);
    url_SetAjaxTimeout(0, 3000);//修改ajax超时3秒
    //查询服务器是否网络正常
    url_DoEcho(0, "ping", 0);

    //url_SetDevCtrl(0,0,5,1);
    //url_EnableSpk(0,1);
    //url_EnableMic(0,1);
}

//设置监控分机账号相关信息
function T_SetParam(ip, port, from, pwd) {
    //第一个通道参数0表示设置监控分机第一个，一般只需要监控一个
    //设置软交换服务器ip和端口
    url_SetIP(0, ip, port);
    //设置监控的分机和密码
    url_SetFrom(0, from, pwd);

    url_SetAjaxTimeout(0, 10000);//修改ajax超时10秒,默认10秒

    //查询账号状态
    url_QueryAccount(0);

    //启动事件捕获
    url_StartEvent();
}

//初始化全局参数
function T_InitURL() {
    //初始化最大监控分机数量为2, 可以设置监控分机相关参数的通道可以为0,1
    url_InitListCount(2);
    //设置操作命令结果回调js函数
    url_SetCmdCallback(cmd_json_callback);
    //设置分机事件回调js函数
    url_SetEventCallback(event_json_callback);
}

function I_Exit() {
    //退出默认把分机示忙,async为0,同步模式执行,不再处理消息回调
    url_SetAsync(0, false);
    //url_DoBusy(0,1);
    url_SetAsync(0, true);
}

// 初始化方法
function call_init() {
    console.log('init');
    T_InitURL();
    T_SetParam('127.0.0.1', '9934', '5125645', '123456');
}
export default {
    init: call_init,
    call: T_StartDial,
    answer: T_DoAnswer,
    hangup: T_DoHang
}

