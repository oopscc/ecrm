var g_ajaxErrID = -999;
var g_FuncErrID = -998;
var g_ajaxErrJsonStr = '{\"ret\":'+g_ajaxErrID+'}';
var g_ajaxErrJsonObj = JSON.parse(g_ajaxErrJsonStr);
var g_JsonCallbackFunc="jsoncallback";

var g_FuncCmdCallback=null;
var g_FuncEventCallback=null;

var g_EventTimerDelay=500;
var g_timerevent = 0;

var	u_cmd_dial=1;
var	u_cmd_dohang=2;
var	u_cmd_enablemic=3;
var	u_cmd_enablespk=4;
var	u_cmd_dohold=5;
var	u_cmd_dobusy=6;
var	u_cmd_startrefer=7;
var	u_cmd_stoprefer=8;
var	u_cmd_doinsert=9;
var	u_cmd_domonitor=10;
var	u_cmd_dohangex=11;
var	u_cmd_doinvite=12;
var	u_cmd_answeractteam=13;
var	u_cmd_dobusyex=14;
var	u_cmd_doanswer=15;
var	u_cmd_dologin=16;
var	u_cmd_dologout=17;
var	u_cmd_dogoivr=18;

var	u_cmd_startplayfile=20;
var	u_cmd_stopplayfile=21;
var u_cmd_querydtmfcmd=25;
var	u_cmd_setdevctrl=26;

var	u_cmd_clearevent=30;
var u_cmd_querylastevent=31;
var u_cmd_queryaccount=32;
var u_cmd_setuploadparam=33;

var	u_cmd_conference_create=50;
var	u_cmd_conference_delete=51;
var	u_cmd_conference_addmember=52;
var	u_cmd_conference_removemember=53;
var u_cmd_conference_startcallmember=54;
var u_cmd_conference_stopcallmember=55;

var u_cmd_group_querygroup=80;
var u_cmd_group_queryaccount=81;
var u_cmd_group_querywaitin=82;

var u_cmd_doecho=90;


var g_listcount=0;
var g_account_list=[];

var g_dialid=0;
var g_uAjax = $.ajax;

function tag_from_data() 
{
	this.m_id=-1;
	this.m_vip="";
	this.m_vhost="";
	this.m_vuriport=0;
	
	this.m_vsipip="";
	this.m_vsipport=0;
	
	this.m_vextip="";
	this.m_vextport=0;
	this.m_vexthost="";
	
	this.m_uuguid = "";
	this.m_uucaller="";
	this.m_from="";
	this.m_pwd="";
	this.m_login=0;		
	
	this.m_ajaxtimeout=10000;
	this.m_ajaxasync=true;
		
	this.m_bEnableEvent= 1;
	this.m_EventTimeout = 30;//s
	this.m_EventLastID = "0";	
	this.m_popEventType=EVENT_POP_MODE_QUERY;
	this.m_BeginEventTick = 0;	
	this.m_EndEventTick = 0;
	this.m_ElapseTimeout = 1000;
}

//only ie
function url_ExeclljPhone() 
{  
	try
	{	
	  var shell = new ActiveXObject("WScript.Shell");   
	  var command = shell.RegRead("HKEY_CURRENT_USER\\SOFTWARE\\CphoneC\\lljphone\\path");
 		 command += " -AutoRun"; 
	  //alert(command);
	  window.oldOnError = window.onerror;  
 		window._command = command;  
	  window.onerror = function (err) 
 		{  
	    if (err.indexOf('utomation') != -1) 
 	   {
 	     return 1;  
	   	}  
 	   else return 0;  
	  };  
	  var wsh = new ActiveXObject('WScript.Shell');  
 	  if (wsh)
 	  {  
 	    wsh.Run(command);
 	  }
  	window.onerror = window.oldOnError;  
  	return 1;
	}
 	catch(e)
  {
 		return 0; 
	} 
}  

function u_Format2d(v)
{
	if(v<10) return '0'+v.toString();
	else return v.toString();
}

function u_Format3d(v)
{
	if(v<10) return '00'+v.toString();
	else if(v<100) return '0'+v.toString();
	else return v.toString();
}

function url_GetNowTimeString()
{
	var vd=new Date();
	return '['+u_Format2d(vd.getHours())+':'+u_Format2d(vd.getMinutes())+':'+u_Format2d(vd.getSeconds())+' '+u_Format3d(vd.getMilliseconds())+']';
}

function url_GetAjaxErrID()
{
    return g_ajaxErrID; 
}

function url_IsAjaxErrRet(ret)
{
    if (g_ajaxErrID == ret) return 1;
  	else return 0;	
}

function url_IsAjaxErrObj(jsonObj)
{
    if (g_ajaxErrID == jsonObj.ret) return 1;
  	else return 0;
}

function url_GetJsonString(jsonObj)
{
    return JSON.stringify(jsonObj); 
}

function url_InitListCount(count)
{
  for (var i = g_listcount; i < count; i++) 
  {	
		g_account_list[i] = new tag_from_data();
		g_account_list[i].m_id = i;
	}	
	g_listcount = count;
}

function url_IsValidID(id)
{
		if (id < 0 || id > g_listcount || g_account_list[id] == undefined) return 0;
		else
		{
			return 1;
		}
}

function url_getdata(id) 
{
		return g_account_list[id];
}

function url_getidfrom(from)
{
    for (var i = 0; i < g_listcount; i++) 
    {
    		if (g_account_list[i].m_from.length > 0
    				&& g_account_list[i].m_from == from)
    		{
    				return i;
    		}    		
    }	
    return -1;
}

function url_SetCmdCallback(cb)
{
    g_FuncCmdCallback = cb;
}

function url_SetEventCallback(cb)
{
    g_FuncEventCallback = cb;
}

function url_SetAjaxTimeout(id, timeout) 
{
		if (url_IsValidID(id) == 0) return 0;
    g_account_list[id].m_ajaxtimeout = timeout;
    return 1;		
}

function url_SetAsync(id, asy) 
{
		if (url_IsValidID(id) == 0) return 0;		
    g_account_list[id].m_ajaxasync = asy;
    return 1;		
}

function url_SetFrom(id, from,pwd) 
{
		if (url_IsValidID(id) == 0) return 0;
	  else if (g_account_list[id].m_from != from)
	  {
	  	g_account_list[id].m_EventLastID = 0;
	  }
    g_account_list[id].m_from = from;
    g_account_list[id].m_pwd = pwd;
    return 1;
}

function url_SetPopEventType(id,pop) 
{
		if (url_IsValidID(id) == 0) return 0;
    g_account_list[id].m_popEventType = pop;
    return 1;
}

function url_SetElapseTimeout(id,v) 
{
		if (url_IsValidID(id) == 0) return 0;
    g_account_list[id].m_ElapseTimeout = v;
    return 1;
}

function url_EnableEvent(id,b) 
{
 		if (url_IsValidID(id) == 0) return 0;
    g_account_list[id].m_bEnableEvent = b;
    return 1;
}


function url_SetEventTimerDelay(delay) 
{
    g_EventTimerDelay = delay;
}

function url_SetEventTimeout(id,timeout) 
{
	if (url_IsValidID(id) == 0) return 0;
  g_account_list[id].m_EventTimeout = timeout;
  return 1;   
}

function url_SetIP(id, uriip, uriport) 
{
		if (g_listcount < id+1)
		{
			url_InitListCount(id+1);
		}
		if (url_IsValidID(id) == 0) return 0;	
    g_account_list[id].m_vip = uriip;
    g_account_list[id].m_vuriport = uriport;
    g_account_list[id].m_vhost = "http://"+uriip+":"+uriport;
    return 1;
}

function url_SetSipIP(id, sipip, sipport) 
{
		if (url_IsValidID(id) == 0) return 0;
		g_account_list[id].m_vsipip = sipip;
    g_account_list[id].m_vsipport = sipport;
    return 1;
}
function url_SetExtIP(id, extip, extport) 
{
		if (url_IsValidID(id) == 0) return 0;
		g_account_list[id].m_vextip = extip;
    g_account_list[id].m_vextport = extport;
    g_account_list[id].m_vexthost = "http://"+extip+":"+extport;
    return 1;
}
function url_SetGuid(id,guid) 
{
		if (url_IsValidID(id) == 0) return 0;
    g_account_list[id].m_uuguid = guid;
    return 1;
}

function url_GetGuid(id) 
{
		if (url_IsValidID(id) == 0) return "";
    return g_account_list[id].m_uuguid;
}

function url_SetCaller(id,uucaller) 
{
		if (url_IsValidID(id) == 0) return 0;
    g_account_list[id].m_uucaller = uucaller;
    return 1;
}

function url_GetCaller(id) 
{
		if (url_IsValidID(id) == 0) return "";
    return g_account_list[id].m_uucaller;
}

function u_StartEventTimerEx(delay)
{
    if (g_timerevent == 0) 
    {
    	  if (delay == 0) delay = 1;
        g_timerevent = window.setInterval("u_onGetEventTimer()", delay);
    }
}        

function u_StartEventTimer()
{
    if (g_timerevent == 0) 
    {
    	  if (g_EventTimerDelay == 0) g_EventTimerDelay = 1;
        g_timerevent = window.setInterval("u_onGetEventTimer()", g_EventTimerDelay);
    }
}        

function u_StopEventTimer()
{
    if (g_timerevent != 0) 
    {
        window.clearInterval(g_timerevent);
    		g_timerevent = 0;
    }
}    

function u_AjaxGetUrlCmd_sync(tagaccount,cmd, vurl)
{
   $.ajax({
    		async: tagaccount.m_ajaxasync,    		
    		timeout: tagaccount.m_ajaxtimeout,
        type:"GET",
        url:vurl,
        success:function(jsonObj)
        {},  
        error : function() 
        {}
    });
    return 1;	
}

function u_AjaxGetUrlCmd(tagaccount,cmd, vurl)
{
   $.ajax({
    		timeout: tagaccount.m_ajaxtimeout,
        type:"GET",
        url:vurl,
        dataType :'jsonp',  
        scriptCharset: 'gb2312',
        contentType: 'application/x-www-form-urlencoded; charset=gb2312',
        jsonp:g_JsonCallbackFunc,  
        success:function(jsonObj)
        {   	         	  
        		if (cmd == u_cmd_querylastevent)
        		{
        			u_ProcEvtJson(tagaccount.m_id, jsonObj, vurl);
        		}
        		else if (cmd == u_cmd_queryaccount)
        		{
        			if (jsonObj.ret > 0 && jsonObj.list[0].account == tagaccount.m_from)
        			{
        					tagaccount.m_login = jsonObj.list[0].online;
        			}
        		}        		
            g_FuncCmdCallback(tagaccount, cmd, vurl, jsonObj);
        },  
        error : function() 
        {
            g_FuncCmdCallback(tagaccount, cmd, vurl, g_ajaxErrJsonObj);
        }
    });
    return 1;	
}

function url_GetJsonCaller(json)
{
	if (json.caller == undefined) return "";
	else return json.caller;
}

function url_DoEcho(id,data,mode) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
			data = encodeURIComponent(data);
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_DoEcho.cpc?data="+data;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_doecho, vurl);
		}
}

function url_DoEchoFrom(id,data,from,mode) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
			data = encodeURIComponent(data);
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_DoEcho.cpc?data="+data+"&from="+from;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_doecho, vurl);
		}
}

function url_StartDial(id,to)
{
	if (url_IsValidID(id) == 0) return 0;
	else if (g_account_list[id].m_uuguid.length > 0)
	{
		return g_FuncErrID;
	}
	else
	{
		g_dialid++;
		to = encodeURIComponent(to);
    var vurl = g_account_list[id].m_vhost+"/OSIPS_Action.cpc?cmd=osips_startcallext&from="+g_account_list[id].m_from+"&to="+to+"&pwd="+g_account_list[id].m_pwd+"&dialid="+g_dialid;
    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dial, vurl);
  }
}


function url_StartProxyDial(id,proxy,to)
{
	if (url_IsValidID(id) == 0) return 0;
	else if (g_account_list[id].m_uuguid.length > 0)
	{
		return g_FuncErrID;
	}
	else
	{
		g_dialid++;
		to = encodeURIComponent(to);
    var vurl = g_account_list[id].m_vhost+"/OSIPS_Action.cpc?cmd=osips_startcallext&from="+g_account_list[id].m_from+"&to="+to+"&pwd="+g_account_list[id].m_pwd+"&dialid="+g_dialid+"&proxy="+proxy;
    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dial, vurl);
  }
}

function url_EnableMic(id,mic) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_enablemic&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&mic="+mic;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_enablemic, vurl);
		}
}

function url_EnableSpk(id,spk) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_enablespk&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&spk="+spk;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_enablespk, vurl);
		}
}

function url_StartPlayFileEx(id,szFile,loop,interval,mode,vol) 
{
		if (url_IsValidID(id) == 0) return 0;		
		else
		{
			szFile = encodeURIComponent(szFile);
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_playfile&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&file="+szFile+"&type=1"+"&loop="+loop+"&interval="+interval+"&mode="+mode+"&vol="+vol;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_startplayfile, vurl);
		}
}

function url_StartPlayFile(id,szFile,loop,interval,mode) 
{
		return url_StartPlayFileEx(id,szFile,loop,interval,mode, 0);
}

function url_StopPlayFile(id,mode) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_playfile&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&type=24"+"&mode="+mode;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_stopplayfile, vurl);
		}
}

function url_SetDevCtrl(id,chid,type,value) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_setdevctrl&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&chid="+chid+"&ctrltype="+type+"&ctrlvalue="+value;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_setdevctrl, vurl);
		}
}


function url_DoHold(id,hold) 
{
		return url_DoHoldEx(id, hold, 0);
}

function url_DoHoldEx(id,hold,mode) 
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_dohold&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&hold="+hold+"&mode="+mode;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dohold, vurl);
		}
}

function url_DoBusy(id,busy) 
{
		if (url_IsValidID(id) == 0) return 0;
	  var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_dobusy&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd +"&busy="+busy;
	 
	  if (g_account_list[id].m_ajaxasync)	  return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dobusy, vurl);
		else return u_AjaxGetUrlCmd_sync(g_account_list[id], u_cmd_dobusy, vurl);
}

function url_DoBusyEx(id,busy,account) 
{
		if (url_IsValidID(id) == 0) return 0;
	  var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_dobusy&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd +"&busy="+busy+"&account="+account;	 
	  if (g_account_list[id].m_ajaxasync)  return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dobusyex, vurl);
	  else return u_AjaxGetUrlCmd_sync(g_account_list[id], u_cmd_dobusyex, vurl);
}

function url_SetUsbCallLogParam(id,param) 
{
		if (url_IsValidID(id) == 0) return 0;
	  var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_setuploadparam&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd +"&guid="+g_account_list[id].m_uuguid+"&"+param;
	  return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_setuploadparam, vurl);
}

function url_setuploadparam(id,param) 
{
	return url_SetUsbCallLogParam(id,param);
}

function url_DoHang(id) 
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_dohang&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dohang, vurl);
		}
}


function url_DoInvite(id,to) 
{
		return url_DoInviteEx(id,to,0);
}

function url_DoInviteEx(id,to,mode) 
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{		
			to = encodeURIComponent(to);
	  	var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_doinvite&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&to="+to+"&mode="+mode;
	  	return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_doinvite, vurl);
	  }
}

function url_AnswerActTeam(id)
{
		if (url_IsValidID(id) == 0) return 0;
	  var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_answeractteam&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd;
	  return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_answeractteam, vurl);
}	
	
function url_DoInsert(id,guid) 
{
		if (url_IsValidID(id) == 0) return 0;
	  var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_doinsert&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+guid;
	  return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_doinsert, vurl);
}

function url_DoMonitor(id,guid) 
{
		if (url_IsValidID(id) == 0) return 0;
	  var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_domonitor&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+guid;
	  return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_domonitor, vurl);
}

function url_DoHangEx(id,guid) 
{
		if (url_IsValidID(id) == 0) return 0;
	  var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_dohang&from="+g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+guid;
	  return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dohangex, vurl);
}

function url_DoAnswer(id) 
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_doanswer&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_doanswer, vurl);
		}
}

function url_DoExtAnswer(id) 
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
	    var vurl = g_account_list[id].m_vexthost + "/OSIPS_Action.cpc?cmd=osips_doanswer&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_doanswer, vurl);
		}
}

function url_DoLogin(id) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
	    var vurl = g_account_list[id].m_vexthost + "/OSIPS_Action.cpc?cmd=osips_dologin&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&ip=" + g_account_list[id].m_vsipip + "&port=" + g_account_list[id].m_vsipport;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dologin, vurl);
		}
}

function url_DoLogout(id) 
{
		if (url_IsValidID(id) == 0) return 0;
		else
		{
	    var vurl = g_account_list[id].m_vexthost + "/OSIPS_Action.cpc?cmd=osips_dologout&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dologout, vurl);
		}
}


function  url_QueryDTMFCmd(id, itemname, rmode)
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_QueryDTMFCmd.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&itemname="+itemname+"&rmode="+rmode;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_querydtmfcmd, vurl);
		}	
}

function  url_QueryDTMFCmdEx(id, itemname, szguid)
{
		if (url_IsValidID(id) == 0) return 0;
		else if (szguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_QueryDTMFCmd.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+szguid+"&itemname="+itemname+"&rmode=2";
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_querydtmfcmd, vurl);
		}	
}

function  url_DoGoIVR(id, xmlfile, goid, rmode)
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
			xmlfile = encodeURIComponent(xmlfile);
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_dogoivr&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&file="+xmlfile+"&goid="+goid+"&rmode="+rmode;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_dogoivr, vurl);
		}	
}

function url_StartRefer(id,to,rmode) 
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
			to = encodeURIComponent(to);
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_startrefer&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid+"&to="+to+"&rmode="+rmode;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_startrefer, vurl);
		}
}


function url_StopRefer(id) 
{
		if (url_IsValidID(id) == 0) return 0;
		else if (g_account_list[id].m_uuguid.length == 0)
		{
			return g_FuncErrID;
		}
		else
		{
	    var vurl = g_account_list[id].m_vhost + "/OSIPS_Action.cpc?cmd=osips_stoprefer&from="+ g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&guid="+g_account_list[id].m_uuguid;
	    return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_stoprefer, vurl);
		}
}

function url_QueryAccount(id)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_QueryAccount.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&account="+g_account_list[id].m_from;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_queryaccount, vurl);
}        

function url_QueryAccountEx(id,list)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_QueryAccount.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&account="+list;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_queryaccount, vurl);
}        

function url_QueryAccountEx(id,list)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_QueryAccount.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd+"&account="+list;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_queryaccount, vurl);
}        

function url_ClearEvent(id)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_PopEvent.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&pop="+EVENT_POP_MODE_CLEAR;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_clearevent, vurl);
}        

function url_StartEvent()
{
    u_StartEventTimer();
}

function url_StopEvent()
{
    u_StopEventTimer();
}

function u_SaveLastEventID(id, EventObj)
{
	if (url_IsValidID(id) == 0) return 0;
	else if (EventObj.evtid > 0 && EventObj.evtid != g_account_list[id].m_EventLastID)
	{
     g_account_list[id].m_EventLastID = EventObj.evtid;
     return 1;
	}        	
	else
	{
		return 0;
	}
}

function u_ProcEvtJson(id, jsonobj, vurl)
{
		if (url_IsValidID(id) == 0) return 0;
		else if (jsonobj.ret > 0)
    {    		
        for (var i = 0; i < jsonobj.evt.length; i++) 
        {
           var eventObj = jsonobj.evt[i];      
                
           if (eventObj.type == OSIPSEVENT_LOGIN && g_account_list[id].m_login == 0)
           {
           		g_account_list[id].m_login = 1;
           }
           if (u_SaveLastEventID(id, eventObj) > 0)
           { 
              if (eventObj.result == 102 || eventObj.result == 202 || eventObj.result == 104)
              {
                url_SetGuid(id,eventObj.guid);
              }                     
              
              g_FuncEventCallback(g_account_list[id], vurl, 1, eventObj);
              
              if (eventObj.result == 121 || eventObj.result == 221)
              {              	
                if (eventObj.guid == url_GetGuid(id))
                {
                  url_SetGuid(id, "");                  
                }
              }
           }
        }
    }
    else
    {
      if (jsonobj.ret == OSIPSERR_NOTLOGIN && g_account_list[id].m_login == 1)
      {
        g_account_list[id].m_login = 0;
      }
      g_FuncEventCallback(g_account_list[id], vurl, jsonobj.ret, jsonobj);              
    } 
}

function u_GetEvent(id)
{
    var vBDate = new Date();
    var vTime = vBDate.getTime();    
    if (vTime > g_account_list[id].m_BeginEventTick + g_account_list[id].m_ElapseTimeout)
    {    		
  			g_account_list[id].m_BeginEventTick = vTime;	
				g_account_list[id].m_EndEventTick = vTime;
				
				var tout = (g_account_list[id].m_EventTimeout+30)*1000;	 
				
				var vurl = g_account_list[id].m_vhost + "/OSIPS_PopEvent.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&timeout=" + g_account_list[id].m_EventTimeout + "&evtid="+g_account_list[id].m_EventLastID+"&pop="+g_account_list[id].m_popEventType;

				g_uAjax({
				  type:"GET",
				  url:vurl,
				  timeout:tout,
				  dataType : 'jsonp',  
				  jsonp:g_JsonCallbackFunc,  
				  success:function(jsonobj)
				  {    
							u_ProcEvtJson(id, jsonobj, vurl);
							g_account_list[id].m_EndEventTick = 0;
				  },  
				  error : function() 
				  {
				  		 g_account_list[id].m_login = 0;
				       g_FuncEventCallback(g_account_list[id], vurl, g_ajaxErrID, g_ajaxErrJsonObj);
				       g_account_list[id].m_EndEventTick = 0;
				  }  
				});   	 
  	}
}

function u_onGetEventTimer()
{
    for (var i = 0; i < g_listcount; i++) 
    {
    		if (g_account_list[i].m_from.length > 0
    				&& g_account_list[i].m_EndEventTick == 0
    				&& g_account_list[i].m_bEnableEvent > 0)
    		{
    				u_GetEvent(i);
    		}    		
    }
    return 1;
}

//获取最后一个事件，就是当前状态
function	url_querylastevent(id)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_PopEvent.cpc?from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&timeout=" + g_account_list[id].m_EventTimeout + "&evtid="+g_account_list[id].m_EventLastID+"&pop="+EVENT_POP_MODE_LAST;
 	 return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_querylastevent, vurl);	
}

//---
function	url_group_querygroup(id,account)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Group.cpc?cmd=querygroup&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&account=" + account;
 	 return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_group_querygroup, vurl);	
}

function	url_group_queryaccount(id,groupname)
{
	 if (url_IsValidID(id) == 0) return 0;
	 groupname = encodeURIComponent(groupname);
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Group.cpc?cmd=queryaccount&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&groupname="+groupname;
 	 return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_group_queryaccount, vurl);	
}

function	url_group_querywaitin(id,groupname)
{
	 if (url_IsValidID(id) == 0) return 0;
	 groupname = encodeURIComponent(groupname);
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Group.cpc?cmd=querywaitin&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&groupname="+groupname;
 	 return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_group_querywaitin, vurl);	
}
//---


//-----
function	url_Conference_Create(id,name)
{
	 if (url_IsValidID(id) == 0) return 0;
	 name = encodeURIComponent(name);
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Conference.cpc?cmd=create&from=" + g_account_list[id].m_from + "&pwd=" + g_pwd + "&timeout="+g_conferencetimeout+"&name="+name;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_conference_create, vurl);	
}

function  url_Conference_Delete(id,confid)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Conference.cpc?cmd=delete&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&confid="+confid;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_conference_delete, vurl);		
}

function  url_Conference_AddMember(id,confid,account,nick,route)
{
	 if (url_IsValidID(id) == 0) return 0;
	 nick = encodeURIComponent(nick);
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Conference.cpc?cmd=addmember&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&confid="+confid+"&account="+account+"&nick="+nick+"&route="+route;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_conference_addmember, vurl);		
}
function  url_Conference_RemoveMember(id,confid,account)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Conference.cpc?cmd=removemember&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&confid="+confid+"&account="+account;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_conference_removemember, vurl);		
}


function  url_Conference_StartCallMember(id,confid,account)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Conference.cpc?cmd=startcallmember&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&confid="+confid+"&account="+account;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_conference_startcallmember, vurl);		
}

function  url_Conference_StopCallMember(id,confid,account)
{
	 if (url_IsValidID(id) == 0) return 0;
   var vurl = g_account_list[id].m_vhost + "/OSIPS_Conference.cpc?cmd=stopcallmember&from=" + g_account_list[id].m_from + "&pwd=" + g_account_list[id].m_pwd + "&confid="+confid+"&account="+account;
   return u_AjaxGetUrlCmd(g_account_list[id], u_cmd_conference_stopcallmember, vurl);		
}
//------