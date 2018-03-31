
//---------------------------------------
//err 错误代码
//---------------------------------------
//USB设备操作 返回的错误ID
var		BCERR_BASE					=-9;  //最小错误值
var		BCERR_INVALIDHANDLE			=-9;  //不合法的句柄
var		BCERR_NOPLAYHANDLE			=-10; //没有空闲播放句柄
var		BCERR_OPENFILEFAILED		=-11; //打开文件失败
var		BCERR_READFILEFAILED		=-12; //读取文件数据错误
var		BCERR_WAVHEADERFAILED		=-13; //解析文件头失败
var		BCERR_NOTSUPPORTFORMAT		=-14; //语音格式不支持
var		BCERR_NORECHANDLE			=-15; //没有足够的录音句柄
var		BCERR_CREATEFILEFAILED		=-16; //创建录音文件失败,检查文件路径格式
var		BCERR_NOBUFSIZE				=-17; //缓冲不够
var		BCERR_PARAMERR				=-18; //参数错误
var		BCERR_INVALIDTYPE			=-19; //不合法的参数类型		
var		BCERR_INVALIDCHANNEL		=-20; //不合法的通道ID
var		BCERR_ISMULTIPLAYING		=-21; //正在多文件播放,请先停止播放
var		BCERR_ISCONFRECING			=-22; //正在会议录音,请先停止录音
var		BCERR_INVALIDCONFID			=-23; //错误的会议ID号
var		BCERR_NOTCREATECONF			=-24; //会议模块还未创建
var		BCERR_NOTCREATEMULTIPLAY	=-25; //没有开始多文件播放
var		BCERR_NOTCREATESTRINGPLAY	=-26; //没有开始字符播放
var		BCERR_ISFLASHING			=-27; //正在拍插簧,请先停止
var		BCERR_FLASHNOTLINE			=-28; //设备没有接通线路不能拍插簧
var		BCERR_NOTLOADFAXMODULE		=-29; //未启动传真模块
var		BCERR_FAXMODULERUNING		=-30; //传真正在使用，请先停止
var		BCERR_VALIDLICENSE			=-31; //错误的license
var		BCERR_ISFAXING				=-32; //正在传真不能软挂机
var		BCERR_CCMSGOVER				=-33; //CC消息长度太长
var		BCERR_CCCMDOVER				=-34; //CC命令长度太长
var		BCERR_INVALIDSVR			=-35; //服务器错误
var		BCERR_INVALIDFUNC			=-36; //未找到指定函数模块
var		BCERR_INVALIDCMD			=-37; //未找到指定命令
var		BCERR_UNSUPPORTFUNC			=-38; //设备不支持该功能unsupport func
var		BCERR_DEVNOTOPEN			=-39; //未打开指定设备
var		BCERR_INVALIDDEVID			=-40; //不合法的ID
var		BCERR_INVALIDPWD			=-41; //密码错误
var		BCERR_READSTOREAGEERR		=-42; //读取存储错误
var		BCERR_INVALIDPWDLEN			=-43; //密码长度太长
var		BCERR_NOTFORMAT				=-44; //flash还未格式化
var		BCERR_FORMATFAILED			=-45; //格式化失败
var		BCERR_NOTENOUGHSPACE		=-46; //写入的FLASH数据太长,存储空间不够
var		BCERR_WRITESTOREAGEERR		=-47; //写入存储错误
var		BCERR_NOTSUPPORTCHECK		=-48; //通道不支持线路检测功能
var		BCERR_INVALIDPATH			=-49; //不合法的文件路径
var		BCERR_AUDRVINSTALLED		=-50; //虚拟声卡驱动已经安装
var		BCERR_AUDRVUSEING			=-51; //虚拟声卡正在使用不能覆盖,请退出正在使用该驱动的软件或者重新启动电脑再安装
var		BCERR_AUDRVCOPYFAILED		=-52; //虚拟声卡驱动文件复制失败
var		BCERR_ISALREADYEXIST		=-53; //已经存在
var		BCERR_RENAMEFAILED			=-54; //重命名文件失败，必须在同一个目录才可能成功
var		BCERR_DIALCODEEMPTY			=-55; //拨号号码为空
var		BCERR_NOTMALLOC				=-56; //为初始化内存
var		BCERR_NOTAUTHORIZE			=-57; //功能未授权
var		BCERR_DEVEXCLUSIVE			=-58; //设备被占用
var		BCERR_READINOFFAILED		=-59; //读取设备信息失败
var		BCERR_REFUSENOTCALLIN		=-60; //当前没有来电，拒接失败

var		ERROR_INVALIDDLL			=-198;//不合法的DLL文件
var		ERROR_NOTINIT				=-199;//还没有初始化任何设备
var		BCERR_UNKNOW				=-200;//未知错误

//----------------------------------------

var			OSIPSERR_NOTLOGIN					  =-100;
var			OSIPSERR_INVALIDREALM				=-101;
var			OSIPSERR_REGFAILED					=-102;
var			OSIPSERR_INVALIDACCOUNT				=-103;//账号错误
var			OSIPSERR_INVALIDPWD					=-104;//密码错误
var			OSIPSERR_INVALIDHANDLE				=-105;//非法的句柄
var			OSIPSERR_NOTBUFIZE					=-106;
var			OSIPSERR_INVALIDOPERATE				=-107;
var			OSIPSERR_REFUSE						=-108;
var			OSIPSERR_TALKING					=-109;
var			OSIPSERR_ACCOUNTNOTDIALOG			=-110;
var			OSIPSERR_ACCOUNTNOTTALKING			=-111;
var			OSIPSERR_ACCOUNTNOTSESSION			=-112;
var			OSIPSERR_CALLFAILED					=-113;//呼叫失败
var			OSIPSERR_MAXREGISTER				=-114;//最大在线数
var			OSIPSERR_AUTHTIMEOUT				=-115;//授权超时
var			OSIPSERR_ACCOUTTYPE					=-116;//账号类型错误
var			OSIPSERR_BUSY						=-117;//忙
var			OSIPSERR_MAXDIALOG					=-118;//并发呼叫
var			OSIPSERR_DISABLECALLOUT				=-119;//禁止呼出
var			OSIPSERR_DISABLECALLIN				=-120;//禁止呼入
var			OSIPSERR_INVALIDAUTHTYPE			=-121;//不合法的授权类型
var			OSIPSERR_MAXACDCOUNT				=-122;//排队人数太多
var			OSIPSERR_DOBUSY						=-123;//被示忙
var			OSIPSERR_INVALIDPARAM				=-124;//不合法的参数
var			OSIPSERR_NOTANSWERACTTEAM			=-125;//未抢接
var			OSIPSERR_NOTSET						=-126;//未设置
var			OSIPSERR_NOTACCOUNTBUF				=-127;//账号缓冲不够
var			OSIPSERR_REINVITE					=-128;//invite callid 重复
var			OSIPSERR_NOMEMORY					=-129;//no memory
var			OSIPSERR_NOCONNECTDB				=-130;//no connect
var			OSIPSERR_NOTSUPPORTFORMAT			=-131;//不支持的格式
var			OSIPSERR_BLACKCODE					=-132;//黑名单
var			OSIPSERR_CREATECONFIDFAILED			=-150;//创建会议失败
var			OSIPSERR_INVALIDCONFID				=-151;//会议不存在
//------------

var			OSIPLOGIN_FAILED					=0;
var			OSIPLOGIN_SUCCESS					=1;
var			OSIPLOGIN_REGISTER				=2;

var			OSIPLOGOUT_FAILED					=10;
var			OSIPLOGOUT_SUCCESS				=11;

var			OSIPMESSAGE_SEND_FAILED		=0;
var			OSIPMESSAGE_SEND_TIMEOUT		=1;
var			OSIPMESSAGE_SEND_SUCCESS		=2;
var			OSIPMESSAGE_RECV_SUCCESS		=3;
var 		OSIPMESSAGE_RECV_NOTEXIST		=4;

//------------
var			OSIPCALLOUT_STEP_NULL					=0;
var			OSIPCALLOUT_STEP_CREATE			=101;//创建新的呼叫
var			OSIPCALLOUT_STEP_INVITE			=102;//正在呼叫
var			OSIPCALLOUT_STEP_TRYING			=103;//对方已经接收到请求
var			OSIPCALLOUT_STEP_RINGING			=104;//正在响铃
var			OSIPCALLOUT_STEP_CONNECTING	=105;//正在连接
var			OSIPCALLOUT_STEP_FAILED			=106;//呼叫失败

var			OSIPCALLOUT_STEP_ESTABLISHED		=108;//接通

var			OSIPCALLOUT_STEP_DOCANCEL			=110;//本地挂机
var			OSIPCALLOUT_STEP_DOBYE				=111;//本地挂机
var			OSIPCALLOUT_STEP_DOREFUSE			=112;//拒接
var			OSIPCALLOUT_STEP_DOHOLD			=113;//呼叫保持

var			OSIPCALLOUT_STEP_REMOTEHANG		=120;//对方挂机
var			OSIPCALLOUT_STEP_FINISHED			=121;//错误或者结束
var			OSIPCALLOUT_STEP_TIMEOUT			=122;//超时
var			OSIPCALLOUT_STEP_REFER				=123;//呼叫转移

var			OSIPCALLOUT_STEP_DELETE			=130;
//------------
var			OSIPCALLIN_STEP_NULL					=0;
var			OSIPCALLIN_STEP_CREATE				=201;//新的呼叫
var			OSIPCALLIN_STEP_INVITE				=202;//正在呼叫
var			OSIPCALLIN_STEP_TRYING				=203;//已经接收到请求
var			OSIPCALLIN_STEP_RINGING			=204;//正在回铃
var			OSIPCALLIN_STEP_CONNECTING			=205;//正在连接
var			OSIPCALLIN_STEP_FAILED				=206;//呼叫失败
var			OSIPCALLIN_STEP_ESTABLISHED		=208;//接通

var			OSIPCALLIN_STEP_DOCANCEL			=210;//停止呼叫
var			OSIPCALLIN_STEP_DOBYE				=211;//本地挂机
var			OSIPCALLIN_STEP_DOREFUSE			=212;//本地拒接
var			OSIPCALLIN_STEP_DOHOLD				=213;//呼叫保持

var			OSIPCALLIN_STEP_REMOTEHANG			=220;//对方挂机
var			OSIPCALLIN_STEP_FINISHED			=221;//错误或者结束
var			OSIPCALLIN_STEP_TIMEOUT			=222;//超时
var			OSIPCALLIN_STEP_REFER				=223;//呼叫转移
var			OSIPCALLIN_STEP_DELETE				=230;//

//==============================
//-----
var			OSIPSEVENT_LOGIN					=30000;
var			OSIPSEVENT_LOGOUT					=30001;

var			OSIPSEVENT_CALLIN					=30010;
var			OSIPSEVENT_CALLOUT				=30011;

var			OSIPSEVENT_RECVDTMF				=30020;
var		  OSIPSEVENT_RECVDTMFCMD		=30021;

var			OSIPSEVENT_MESSAGE				=30030;

var			OSIPSEVENT_PHONEHOOK			=30041;
var			OSIPSEVENT_PHONEHANG			=30042;

var			OSIPSEVENT_RECORDFILESTART	=30210;
var			OSIPSEVENT_RECORDFILESTOP		=30211;

//=====remote
var			OSIPSEVENT_UPDATESTATE		=30350;
//内部接收到的应答消息
var			OSIPSEVENT_REPLYCMD				=31050;
//======
var			OSIPS_STATE_LOGIN		=1;
var			OSIPS_STATE_LOGOUT	=2;
var			OSIPS_STATE_BUSY		=3;
var			OSIPS_STATE_FREE		=4;
var			OSIPS_STATE_CALLIN	=5;
var			OSIPS_STATE_CALLOUT	=6;
var			OSIPS_STATE_MIC=7;
var			OSIPS_STATE_SPK=8;
var			OSIPS_STATE_DOHOLD=9;
var			OSIPS_STATE_REPEATLOGIN=32;	
//

var			OSIP_MSG_TEXT						=1;
//======================

var 		CALLIN_TYPE_NULL				=0;
var 		CALLIN_TYPE_CALL				=1;
var 		CALLIN_TYPE_MONITOR			=2;
var 		CALLIN_TYPE_INSERT			=3;
var 		CALLIN_TYPE_CONFERENCE	=4;

var 		CALLIN_TYPE_UNKNOW			=99;


var		EVENT_CUSTOM_MODE_TIMER				=1;
var		EVENT_CUSTOM_MODE_CALLBACK		=2;

//--------------------------

var			OSIP_FINISHED_TIMEOUT_INVITE		=2;//请求超时
var			OSIP_FINISHED_TIMEOUT_CMD				=3;//发送命令超时
var			OSIP_FINISHED_TIMEOUT_VOICE			=4;//音频长时间静音
var			OSIP_FINISHED_TIMEOUT_RING			=5;//回铃超时
var			OSIP_FINISHED_TIMEOUT_NORING		=6;//未回铃

var			OSIP_FINISHED_FAILED						=16;//呼叫失败
var			OSIP_FINISHED_REFUSE						=17;//呼叫拒接
var			OSIP_FINISHED_DOHANG						=18;//本地挂机
var			OSIP_FINISHED_DOCANCEL					=19;//取消
var			OSIP_FINISHED_REMOTEHANG				=20;//对方挂机
//--

var			EVENT_POP_MODE_NULL=0;
var			EVENT_POP_MODE_POP=1;
var			EVENT_POP_MODE_CLEAR=2;
var	  	EVENT_POP_MODE_QUERY=3;
var			EVENT_POP_MODE_POPEX=4;
var			EVENT_POP_MODE_LAST=5;
var			EVENT_POP_MODE_END=6;