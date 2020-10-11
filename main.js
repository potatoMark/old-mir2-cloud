"ui";
importClass(android.text.TextWatcher);
importClass(android.os.Environment);
importClass(android.net.Uri);
importClass(android.app.DownloadManager);

_service = require('./service.js');
_task = require('./task.js');
_random = require('./random.js');
_xiao_mj = require('./xiaomijing.js');
_da_mj = require('./damijing.js');
_pic = require('./utils/pic.js');
let ViewIdListRegisterListener = require('./utils/ViewIdListRegisterListener');
var color = "#009688";
let normalOptions = "沃玛寺庙|沃玛寺庙东|沃玛寺庙西|地牢|地牢东|石墓|石墓东|祖玛|骨魔|牛魔寺庙|赤月峡谷";
let specialOptions = "魔龙东郊|魔龙西郊|魔龙城";
let levelOptions = "一层|二层|三层";
let elementOptions = "元素1层01|元素1层02|元素1层03|元素2层01|元素2层02|元素2层03|元素3层01|元素3层02|元素4层01|元素4层02|元素5层|元素6层|元素7层|元素8层|元素9层|元素10层|元素11层|元素12层";
let module = "all";
let fruitDisplay = "gone";
let molongDisplay = "gone";
let putong = "先选择挂机地图,再选择挂机几层\r\n人物会自动走到目标地点开始挂机,所有怪都打\r\n支持死亡复活,回城继续挂机,英雄死亡复活";
let zhanling = "人物会自动通过占领图标直接传送至占领3层开始挂机\r\n(自己要有占领地图)";
let yuansu = "选择元素后,角色会自动进入对应元素地图挂机\r\n手机屏幕左下角和左侧中间位置\r\n不能出现悬浮窗a等把元素关键图标给遮住了\r\n否则会出现无法进入元素的情况\r\n辅助在执行下拉操作选择元素关卡的时候,不要触摸屏幕\r\n否则会中断下拉操作,导致进入元素失败";
let nainiu = "人物会自动进入奶牛公共频道\r\n每次都将会消耗设定的奶牛个数\r\n进入奶牛后开始自动挂机打BOSS\r\n不会拉怪/引怪等系列操作\r\n如果挂机途中担心会被杀回城\r\n可以把保护调成飞随机\r\n辅助会在30秒内自动恢复挂机"
let yeguo = "选择好需要挂果子的元素地图后,人物将会随机进入目标地图开始挂机;\r\n辅助会根据设定的时间(怪物扫描时间)判断周围是否有怪物存在,如果连续三次判断都没有怪物,那么就会自动换下一个地图进行挂机";
let molongs = "[循环找紫]一定要勾选上,否则就只会进入魔龙1-3层开始普通挂机\r\n紫怪/黄怪勾选上后,默认所有目标地图都将会找紫怪和黄怪;橙怪根据自己实力勾选;尽量不要勾选黄怪,会影响找怪速度,如果模拟器比较卡,最好橙怪都不要勾选"
let renwu = "[秘境进入方式]如果选择凭证,系统默认挂机八分钟回城,目的是保证人物能够把材料捡完,如果你五分钟内无法自动打完秘境,尽量不要使用辅助打凭证秘境\r\n[秘境进入方式]如果选择金币,4紫2橙打完后会自动回城\r\n大秘境勾选[进入通过关卡]后,会自动打已通过关卡中倒数第二个关卡\r\n如果不勾选,将会打最新的挑战关卡";
let other = "[英雄随机召唤]:勾选后,[随机最大时间]一定要设值,当英雄被杀后,辅助不会一分钟后召唤英雄,而是在指定的时间范围内随机一个召唤,这样可以极大的防止敌人一直砍你英雄爆碎片\r\n[连续几次未发现xxx]:找紫怪时,魔龙,元素9以上地图如果连续N个点未找到紫怪,系统会开始自动挂机15秒,打小怪回血,防止一直未找到紫怪吸血,被小怪打回城如果你装备足够好,那么设置成999\r\n[被击杀N次xxx]:如果你在挂机地图被敌军击杀N次后,辅助会自动更换备用地图\r\n更换规则:如果在挂元素,那么将会自动更换到普通地图;如果在挂元素以外(奶牛/占领/找紫)的地图,那么将会更换至元素地图"
switch(module){
    case "basic":
        fruitDisplay = "gone";
        molongDisplay = "gone";
        break;
    case "molong":
        fruitDisplay = "gone";
        molongDisplay = "visible";
        break;
    case "fruit":
        fruitDisplay = "visible";
        molongDisplay = "gone";
        break;
    case "all":
        fruitDisplay = "visible";
        molongDisplay = "visible";
        break;
}
ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="复古传奇脚本辅助"/>
                <tabs id="tabs"/>
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <vertical padding="0">
                        <horizontal >
                            <Switch id="autoService" w="*"  text="无障碍服务(必须打开):" checked="{{auto.service != null}}" textSize="15sp"/>
                        </horizontal>
                        <vertical>
                            <text textSize="16sp">挂机模式:</text>
                        </vertical>
                        <radiogroup id="hookMode" orientation="horizontal">
                            <radio id="normalMode" text="普通"></radio>
                            <radio id="ownerMode" text="占领"></radio>
                            <radio id="elementMode"  text="元素"></radio>
                            <radio id="cowMode"  text="奶牛"></radio>
                            <radio id="fruitMode" visibility="{{fruitDisplay}}" text="野果"></radio>
                            <radio id="molongMode" visibility="{{molongDisplay}}" text="特殊"></radio>
                        </radiogroup>

                        <vertical id="basichookId">
                            <radiogroup id="basichookmode" orientation="horizontal">
                                <radio id="dingdian" text="定点"></radio>
                                <radio id="xunhuan" text="循环"></radio>
                            </radiogroup>
                            <vertical id="notloophook">
                                <horizontal >
                                    <text textSize="16sp">请选择挂机目标:</text>
                                    <spinner id="hookTarget" spinnerMode="dialog" entries="{{normalOptions}}" />
                                </horizontal>
                                <horizontal >
                                    <text textSize="16sp">请选择挂几层:</text>
                                    <spinner id="hookLevel"  spinnerMode="dialog" entries="{{levelOptions}}" />
                                </horizontal>
                            </vertical>
                            <vertical id="loophook">
                                <horizontal >
                                    <text textSize="16sp">祖玛:</text>
                                    <checkbox id="zuma_1" text="一层"  />
                                    <checkbox id="zuma_2" text="二层"  />
                                    <checkbox id="zuma_3" text="三层"  />
                                </horizontal>
                                <horizontal >
                                    <text textSize="16sp">黄泉:</text>
                                    <checkbox id="hq_1" text="一层"  />
                                    <checkbox id="hq_2" text="二层"  />
                                    <checkbox id="hq_3" text="三层"  />
                                </horizontal>
                                <horizontal >
                                    <text textSize="16sp">牛魔:</text>
                                    <checkbox id="niumo_1" text="一层"  />
                                    <checkbox id="niumo_2" text="二层"  />
                                    <checkbox id="niumo_3" text="三层"  />
                                </horizontal>
                            </vertical>
                            <vertical>
                                <text textSize="16sp" textColor="#EE9A00" text="{{putong}}"></text>
                            </vertical>
                        </vertical>

                        <vertical id="elementId">
                            <text textSize="16sp">请选择元素目标:</text>
                            <spinner id="hookElement" spinnerMode="dialog" entries="{{elementOptions}}" />
                            <text textSize="16sp" textColor="#EE9A00" text="{{yuansu}}"></text>
                        </vertical>

                        <vertical id="molongId">
                            <horizontal>
                                <text textSize="16sp">循环找紫:</text>
                                <checkbox id="loopFindId" />
                            </horizontal>
                            <vertical>
                                <text textSize="16sp">挂机目标:</text>
                                <horizontal>
                                    <checkbox id="molongdj" text="魔龙东郊" />
                                    <checkbox id="molongxj" text="魔龙西郊" />
                                    <checkbox id="molongc" text="魔龙城" />
                                </horizontal>
                                <horizontal>
                                    <checkbox id="element7" text="元素7" />
                                    <checkbox id="element8" text="元素8" />
                                    <checkbox id="element9" text="元素9" />
                                    <checkbox id="element10" text="元素10" />

                                </horizontal>
                                <horizontal>
                                    <checkbox id="element11" text="元素11" />
                                    <checkbox id="element12" text="元素12" />
                                </horizontal>
                            </vertical>
                            <horizontal >
                                <text textSize="16sp">击杀选择:</text>
                                <checkbox id="h_kill_check" text="黄怪"  />
                                <checkbox id="z_kill_check" text="紫怪"  />
                            </horizontal>
                            <vertical>
                                <text textSize="16sp">橙怪击杀选择:</text>
                                <horizontal>
                                    <checkbox id="ml_dj_c" text="魔龙东郊"  />
                                    <checkbox id="ml_xj_c" text="魔龙西郊"  />
                                    <checkbox id="ml_c_c" text="魔龙城"  />
                                </horizontal>
                                <horizontal>
                                    <checkbox id="e7_c" text="元素7"  />
                                    <checkbox id="e8_c" text="元素8"  />
                                    <checkbox id="e9_c" text="元素9"  />
                                    <checkbox id="e10_c" text="元素10"  />
                                </horizontal>
                                <horizontal>
                                    <checkbox id="e11_c" text="元素11"  />
                                    <checkbox id="e12_c" text="元素12"  />
                                </horizontal>
                                <text textSize="16sp" textColor="#EE9A00" text="{{molongs}}"></text>
                            </vertical>
                        </vertical>
                        <vertical id="zhanlingId">
                            <text textSize="16sp" textColor="#EE9A00" text="{{zhanling}}"></text>
                        </vertical>
                        <vertical id="cowId">
                            <text textSize="16sp">奶牛挑战个数:</text>
                            <input id="cowCount" text="1"  inputType="number|numberDecimal" />
                            <text textSize="16sp" textColor="#EE9A00" text="{{nainiu}}"></text>
                        </vertical>

                               
                        <vertical id="fruitId">
                            <text textSize="16sp">请选择循环挂果子地图:</text>
                            <vertical>
                                <horizontal>
                                    <checkbox id="e_1" text="元素1层01"  />
                                    <checkbox id="e_2" text="元素1层02"  />
                                    <checkbox id="e_3" text="元素1层03"  />
                                </horizontal>
                                <horizontal>
                                    <checkbox id="e_4" text="元素2层01"  />
                                    <checkbox id="e_5" text="元素2层02"  />
                                    <checkbox id="e_6" text="元素2层03"  />
                                </horizontal>
                                <horizontal>
                                    <checkbox id="e_7" text="元素3层01"  />
                                    <checkbox id="e_8" text="元素3层02"  />
                                </horizontal>
                                <horizontal>
                                    <checkbox id="e_9" text="元素4层01"  />
                                    <checkbox id="e_10" text="元素4层02"  />
                                </horizontal>
                                <horizontal>
                                    <checkbox id="e_11" text="元素5层"  />
                                </horizontal>
                                <horizontal>
                                    <text textSize="16sp">怪物扫描时间(秒):</text>
                                    <input id="scanboss" text="1"  inputType="number|numberDecimal" />
                                </horizontal>
                                <horizontal>
                                    <text textSize="16sp">换图几次回城存果子:</text>
                                    <input id="storeyeguo" text="1"  inputType="number|numberDecimal" />
                                </horizontal>
                                <text textSize="16sp" textColor="#EE9A00" text="{{yeguo}}"></text>
                            </vertical>
                        </vertical>
                        
                    </vertical>
                </frame>
                <frame>
                    <vertical padding="16">
                        <vertical>
                            <text textSize="16sp" textColor="#778899">小秘境进入方式:</text>
                            <spinner id="xiaoMjMethod" spinnerMode="dialog" entries="金币|凭证" />
                        </vertical>
                        <vertical>
                            <text textSize="16sp" textColor="#778899">小秘境进入等级:</text>
                            <spinner id="intoLevel" spinnerMode="dialog" entries="30|45|80|105|120|135|155|185|200|245|320|350" />
                        </vertical>
                        <vertical>
                            <text textSize="16sp" textColor="#A2CD5A">大秘境进入方式:</text>
                            <spinner id="daMjMethod" spinnerMode="dialog" entries="无|双倍|十倍" />
                        </vertical>
                        <horizontal>
                            <text textSize="16sp" textColor="#A2CD5A">是否进入已通过关卡:</text>
                            <checkbox id="playPassedLevel" />
                        </horizontal>
                        <horizontal>
                            <text textSize="16sp" textColor="#A2CD5A">是否只打第一关:</text>
                            <checkbox id="onlyplayfirstone" />
                        </horizontal>
                        <text textSize="16sp" textColor="#EE9A00" text="{{renwu}}"></text>
                    </vertical>
                </frame>
                <frame>
                    <vertical padding="16">
                        <vertical>
                            <checkbox id="randomCallHero" text="英雄随机召唤"  />
                            <horizontal>
                                <text textSize="16sp" >随机最大时间(分):</text>
                                <input id="randomTime" text="5"  inputType="number|numberDecimal" />
                            </horizontal>
                        </vertical>
                        <horizontal>
                            <text textSize="16sp" >连续几次未发现紫怪开始回血攻击:</text>
                            <input id="restoreLife" text="5"  inputType="number|numberDecimal" />
                        </horizontal>
                        
                        <horizontal>
                            <text textSize="16sp" >被击杀多少次进入备用地图:</text>
                            <input id="killCount" text="5"  inputType="number|numberDecimal" />
                        </horizontal>
                        <horizontal>
                            <text textSize="16sp" >材料自动存仓库:</text>
                            <checkbox id="autoStoreResourece" />
                        </horizontal>
                        <text textSize="16sp" textColor="#EE9A00" text="{{other}}"></text>
                    </vertical>
                </frame>
                <frame>
                    <com.stardust.autojs.core.console.ConsoleView id="console" h="*"/>
                </frame>
            </viewpager>
        </vertical>
        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <img w="280" h="200" scaleType="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg"/>
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}"/>
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center"/>
                </horizontal>
            </list>
        </vertical>
    </drawer>
);


//初始化一个按钮json
_buttonJson = {
    service:0,
    log:0,
    random:0,
    task:0,
    small:0,
    big:0
}
loadImages();
threads.start(function () {
    // $settings.setEnabled('enable_accessibility_service_by_root', true);
    toastLog(app.versionName);
    // _ra = undefined;
    if (!requestScreenCapture(true)) {
        toastLog("请求截图失败");
        exit()
    }

    // 启用稳定模式
    // log('启用稳定模式');
    // $settings.setEnabled('stable_mode', true);

    // 关闭前台服务
    log('打开前台服务');
    $settings.setEnabled('foreground_service', true);

    // 禁用音量键(上)关闭脚本
    log('禁用音量键(上)关闭脚本');
    $settings.setEnabled('stop_all_on_volume_up', false);

    //脚本运行时自动启动无障碍
    // log('脚本运行时自动启动无障碍');
    // $settings.setEnabled('enable_accessibility_service_by_root', true);
});
(function () {
    let request = http.request;
    // 覆盖http关键函数request，其他http返回最终会调用这个函数
    http.request = function () {
        try {
            // 捕捉所有异常
            return request.apply(http, arguments);
        } catch (e) {
            // 出现异常返回null
            console.error(e);
            return null;
        }
    }
})();

http.__okhttp__.setTimeout(5 * 1000);
var lp1 = dialogs.build({
    title: "处理中...",
    progress: {
        max: -1
    },
    cancelable: false
});
_firstRequest = true;
_download_flag = 0;
let _mainThread_ = undefined;
_storage = storages.create('mir-ui-config')
let idList = [
    ['hookMode'],
    ['hookLevel'],
    ['hookElement'],
    ['hookTarget'],
    ['killCount'],
    ['xiaoMjMethod'],
    ['intoLevel'],
    ['daMjMethod'],
    ['playPassedLevel'],
    ['onlyplayfirstone'],
    ['loopFindId'],
    ['molongdj'],
    ['molongxj'],
    ['molongc'],
    ['element7'],
    ['element8'],
    ['element9'],
    ['element10'],
    ['element11'],
    ['element12'],
    ['h_kill_check'],
    ['z_kill_check'],
    ['randomCallHero'],
    ['randomTime'],
    ['restoreLife'],
    ['ml_dj_c','ml_xj_c','ml_c_c','e7_c','e8_c','e9_c','e10_c','e11_c','e12_c'],
    ['e_1','e_2','e_3'],
    ['e_4','e_5','e_6'],
    ['e_7','e_8'],
    ['e_9','e_10'],
    ['e_11'],
    ['scanboss'],
    ['storeyeguo'],
    ['cowCount'],
    ['basichookmode'],
    ['zuma_1','zuma_2','zuma_3','hq_1','hq_2','hq_3','niumo_1','niumo_2','niumo_3'],
    ['autoStoreResourece']

];
idList.map((viewIdList) => {
    let inputViewIdListRegisterListener = new ViewIdListRegisterListener(viewIdList, _storage)
    inputViewIdListRegisterListener.registerlistener()
    inputViewIdListRegisterListener.restore()
})

ui.console.setConsole(runtime.console);
// 设置控制台字体颜色
let c = new android.util.SparseArray();
let Log = android.util.Log;
c.put(Log.VERBOSE, new java.lang.Integer(colors.parseColor("#dfc0c0c0")));
c.put(Log.DEBUG, new java.lang.Integer(colors.parseColor("#cc000000")));
c.put(Log.INFO, new java.lang.Integer(colors.parseColor("#ff64dd17")));
c.put(Log.WARN, new java.lang.Integer(colors.parseColor("#ff2962ff")));
c.put(Log.ERROR, new java.lang.Integer(colors.parseColor("#ffd50000")));
c.put(Log.ASSERT, new java.lang.Integer(colors.parseColor("#ffff534e")));
ui.console.setColors(c);


//创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu=>{
    menu.add("启动游戏");
    menu.add("授权");
    menu.add("获取更新");
    menu.add("关于");
});
//监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item)=>{
    switch(item.getTitle()){
        case "启动游戏":
            launchPackage('com.ahcq.tulonggb');
            break;
        case "授权":
            rawInput("请输入授权码").then(key => {
                let post_json = {
                    'serial': device.serial,
                    'imei': device.getAndroidId(),
                    'game': 'mir2',
                    'module': module,
                    'key': key
                };
                let url = "http://49.233.10.54:7788/api/bind";
                lp1.show();
                setTimeout(() => {
                    lp1.dismiss()
                }, 5000);
                http.postJson(url, post_json, {}, function (res) {
                    if (res) {
                        let result = res.body.json();
                        toastLog(result.msg);
                        if (result.code == 200) {
                            _auth = 1;
                        }
                    } else {
                        toastLog('服务器请求异常')
                    }
                    lp1.dismiss()
                })
            });
            break;
        case "获取更新":
            let version = app.versionName;
            http.get("http://49.233.10.54:7788/download/version", {}, function(res, err){
                if(err){
                    console.error(err);
                    return;
                }
                let remote_version = res.body.string();
                if (remote_version == version) {
                    toastLog('当前已经是最新版本');
                    return;
                } else {
                    if (_download_flag == 1) {
                        toastLog('请勿重复下载');
                        return;
                    }
                    toastLog('开始下载最新版本')
                    _download_flag = 1;
                    let uri = "http://49.233.10.54:7788/download/mir2/"+module;
                    let request = new DownloadManager.Request(Uri.parse(uri));
                    request.setDestinationInExternalPublicDir("/download/", "传奇云辅助.apk");
                    request.setAllowedOverRoaming(false);
                    request.setAllowedOverMetered(true); //默认是允许的。
                    request.setTitle("传奇云辅助");  
                    request.setDescription("传奇云辅助正在下载"); 
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    request.setMimeType("application/vnd.android.package-archive");//apk类型
                    let downloadManager = context.getSystemService(context.DOWNLOAD_SERVICE);
                    let id = downloadManager.enqueue(request);
                    let query = new DownloadManager.Query();
                    let st = setInterval(() => {
                        let cursor = downloadManager.query(query.setFilterById(id));
                        if (!(cursor != null && cursor.moveToFirst())) return toastLog("下载任务不存在");
                        let bytes_downloaded = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));//已下载字节
                        let totalSize = cursor.getLong(cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                        // log("下载进度:"+Math.ceil(bytes_downloaded/totalSize*100)+"%");
                        let status = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS));
                        if (status == DownloadManager.STATUS_SUCCESSFUL){
                            toastLog("下载已完成");
                            _download_flag = 0;
                            clearInterval(st);//取消定时器
                        }
                        if (status == DownloadManager.STATUS_FAILED){
                            toastLog("下载失败");
                            _download_flag = 0;
                            clearInterval(st);//取消定时器
                        }
                    }, 1500);
                }
            });

            break;
        case "关于":
            alert("联系方式", "邮箱:mark.make@hotmail.com \r\n qq:365156978");
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["挂机设置","任务设置","其他设置", "日志"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);

//让工具栏左上角可以打开侧拉菜单
// ui.toolbar.setupWithDrawer(ui.drawer);

ui.menu.setDataSource([
{
    title: "选项一",
    icon: "@drawable/ic_android_black_48dp"
},
{
    title: "选项二",
    icon: "@drawable/ic_settings_black_48dp"
},
{
    title: "选项三",
    icon: "@drawable/ic_favorite_black_48dp"
},
{
    title: "退出",
    icon: "@drawable/ic_exit_to_app_black_48dp"
}
]);

ui.menu.on("item_click", item => {
    switch(item.title){
        case "退出":
            ui.finish();
            break;
    }
})

//加载图片 *********
_auth = 0;
threads.start(function () {
    let post_json = {
        'serial': device.serial,
        'imei': device.getAndroidId(),
        'game': 'mir2',
        'module': module
    };
    let url = "http://49.233.10.54:7788/api/authorize";
    http.postJson(url, post_json, {}, function (res) {
        if (res) {
            let result = res.body.json();
            toastLog(result.msg);
            if (result.code == 200) {
                _auth = 1;
            }
        } else {
            toastLog('服务器请求异常');
        }
    })
});

ui.autoService.on("check", function(checked) {
    // 用户勾选无障碍服务的选项时，跳转到页面让用户去开启
    if(checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if(!checked && auto.service != null){
        auto.service.disableSelf();
    }
});

// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function() {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
});
let  randomTime = _storage.get('randomTime');
if (!randomTime) {
    _storage.put('randomTime','1');
    ui['normalMode'].checked=true;
    ui['randomTime'].setText('1');
}

let  restoreLife = _storage.get('restoreLife');
if (!restoreLife) {
    _storage.put('restoreLife','999');
    ui['restoreLife'].setText('999');
}

let  killCount = _storage.get('killCount');
if (!killCount) {
    _storage.put('killCount','2');
    ui['killCount'].setText('2');
}

let  cowCount = _storage.get('cowCount');
if (!cowCount) {
    _storage.put('cowCount','1');
    ui['cowCount'].setText('1');
}

let  scanboss = _storage.get('scanboss');
if (!scanboss) {
    _storage.put('scanboss','30');
    ui['scanboss'].setText('30');

    _storage.put('storeyeguo','8');
    ui['storeyeguo'].setText('8');

    

    _storage.put('autoStoreResourece',false);
    
}



let modelValue = _storage.get('hookMode');
if (!modelValue) {
    _storage.put('hookMode',"普通");
    modelValue = "普通";
}
var count=ui.hookMode.getChildCount()
for (var i = 0;i < count;i++){
    
    let radioButton = ui.hookMode.getChildAt(i);
    if (modelValue == radioButton.getText()) {
        initComponent (radioButton.getText());
        break;
    }
}


///
let putongmodelValue = _storage.get('basichookmode');
if (!putongmodelValue) {
    log('走到这里来了')
    _storage.put('basichookmode',"定点");
    putongmodelValue = "定点";
    ui['dingdian'].checked=true;
}
var countx=ui.basichookmode.getChildCount()
for (var j = 0;j < countx;j++){
    
    let radioButton = ui.basichookmode.getChildAt(j);
    if (putongmodelValue == radioButton.getText()) {
        initComponent2 (radioButton.getText());
        break;
    }
}

function initComponent (checked) {
    if (checked == '普通') {
        ui.basichookId.setVisibility(0x00000000);   
        ui.elementId.setVisibility(0x00000008);
        ui.molongId.setVisibility(0x00000008);
        ui.fruitId.setVisibility(0x00000008);
        ui.cowId.setVisibility(0x00000008);
        ui.zhanlingId.setVisibility(0x00000008);
    } else if (checked == '野果') {
        ui.basichookId.setVisibility(0x00000008);   
        ui.elementId.setVisibility(0x00000008);
        ui.molongId.setVisibility(0x00000008);
        ui.fruitId.setVisibility(0x00000000);
        ui.cowId.setVisibility(0x00000008);
        ui.zhanlingId.setVisibility(0x00000008);
    } else if (checked == '元素') {
        ui.basichookId.setVisibility(0x00000008);   
        ui.elementId.setVisibility(0x00000000);
        ui.molongId.setVisibility(0x00000008);
        ui.fruitId.setVisibility(0x00000008);
        ui.cowId.setVisibility(0x00000008);
        ui.zhanlingId.setVisibility(0x00000008);
    } else if (checked == '奶牛') {
        ui.basichookId.setVisibility(0x00000008);   
        ui.elementId.setVisibility(0x00000008);
        ui.molongId.setVisibility(0x00000008);
        ui.fruitId.setVisibility(0x00000008);
        ui.cowId.setVisibility(0x00000000);
        ui.zhanlingId.setVisibility(0x00000008);
    } else if (checked == '特殊') {
        ui.basichookId.setVisibility(0x00000008);   
        ui.elementId.setVisibility(0x00000008);
        ui.molongId.setVisibility(0x00000000);
        ui.fruitId.setVisibility(0x00000008);
        ui.cowId.setVisibility(0x00000008);
        ui.zhanlingId.setVisibility(0x00000008);
    } else if (checked == '定点') {
        ui.notloophook.setVisibility(0x00000000);   
        ui.loophook.setVisibility(0x00000008);   

        ui.basichookId.setVisibility(0x00000000);   
        ui.elementId.setVisibility(0x00000008);
        ui.molongId.setVisibility(0x00000008);
        ui.fruitId.setVisibility(0x00000008);
        ui.cowId.setVisibility(0x00000008);
        ui.zhanlingId.setVisibility(0x00000008);
    } else if (checked == '循环') {
        ui.notloophook.setVisibility(0x00000008);   
        ui.loophook.setVisibility(0x00000000); 

        ui.basichookId.setVisibility(0x00000000);   
        ui.elementId.setVisibility(0x00000008);
        ui.molongId.setVisibility(0x00000008);
        ui.fruitId.setVisibility(0x00000008);
        ui.cowId.setVisibility(0x00000008);
        ui.zhanlingId.setVisibility(0x00000008);
    } else {
        ui.basichookId.setVisibility(0x00000008);   
        ui.elementId.setVisibility(0x00000008);
        ui.molongId.setVisibility(0x00000008);
        ui.fruitId.setVisibility(0x00000008);
        ui.cowId.setVisibility(0x00000008);
        ui.zhanlingId.setVisibility(0x00000000);
    }
}

function initComponent2 (checked) {
    if (checked == '定点') {
        ui.notloophook.setVisibility(0x00000000);   
        ui.loophook.setVisibility(0x00000008);   

    } else if (checked == '循环') {
        ui.notloophook.setVisibility(0x00000008);   
        ui.loophook.setVisibility(0x00000000); 

    } else {
        ui.notloophook.setVisibility(0x00000008);   
        ui.loophook.setVisibility(0x00000008);  
    }
}

console.setGlobalLogConfig({
    "file": "/sdcard/mir2/old-mir2.txt"
});
threads.start(
    function(){
        _init_status = undefined; // 0 运行中 1暂停
        run_img = "@drawable/ic_play_circle_outline_black_48dp";
        stop_img = "@drawable/ic_pause_circle_outline_black_48dp";
        _floaty=floaty.rawWindow(
            <relative id='main'>
                <linear id="home">
                    <text text="100.00%" id="avialMemId" textColor="green"/>
                    <img  tint="white" alpha="0.6" src="@drawable/ic_extension_black_48dp" h="25" w="35"/>
                </linear>
                <linear id="tool">
                    {/* 脚本运行/停止按钮 */}
                    <img id="runId" tint="white" src="{{run_img}}" h="20" w="30"/>
                    <img id="stopId" tint="white" src="{{stop_img}}" h="20" w="30"/>
                    {/* 日志按钮 */}
                    <img id="showlog" tint="white" src="@drawable/ic_assignment_black_48dp" h="20" w="30"/>
                    {/* 随机按钮 */}
                    <img id="startfly" tint="white" src="@drawable/ic_flight_takeoff_black_48dp" h="20" w="30"/>
                    <img id="stopfly" tint="white" src="@drawable/ic_flight_land_black_48dp" h="20" w="30"/>
                    {/* 任务按钮 */}
                    <img id="starttask" tint="white" src="@drawable/ic_restaurant_black_48dp" h="20" w="30"/>
                    <img id="stoptask" tint="white" src="@drawable/ic_restaurant_menu_black_48dp" h="20" w="30"/>
                    {/* 小秘境 */}
                    <img id="startXiaoMj" tint="white" src="@drawable/ic_timer_black_48dp" h="20" w="30"/>
                    <img id="stopXiaoMj" tint="white" src="@drawable/ic_timer_off_black_48dp" h="20" w="30"/>
                    {/* 大秘境 */}
                    <img id="startDaMj" tint="white" src="@drawable/ic_visibility_black_48dp" h="20" w="30"/>
                    <img id="stopDaMj" tint="white" src="@drawable/ic_visibility_off_black_48dp" h="20" w="30"/>
                    
                    
                    <img id="back" tint="white" src="@drawable/ic_replay_black_48dp" h="20" w="30"/>
                    <img id="move" paddingLeft="5" tint="white" src="@drawable/ic_open_with_black_48dp" h="20" w="30"/>
                </linear>
            </relative>
        );
        
        
        _floaty.setPosition(95, 55);
        _floaty.setTouchable(true);

        threads.start(function(){

            setInterval(function(){
                ui.run(function() {
                    let availableMemory = device.getAvailMem();
                    let totalMemory = device.getTotalMem();
                    // log('current available memory :',availableMemory);
                    // log('current total memory :',totalMemory);
                    let rate = ((availableMemory/totalMemory)*100).toFixed(2);
                    // log(rate);
                    // if (rate<0.3) {

                    // }
                    _floaty.avialMemId.setText(rate+'%');
                });
            },5000)

        } )


        //0x00000000 显示 0x00000004 隐藏但占位 0x00000008隐藏不占位
        _floaty.stopId.setVisibility(0x00000008);
        _floaty.tool.setVisibility(0x00000008);
        _floaty.stopfly.setVisibility(0x00000008);
        _floaty.stoptask.setVisibility(0x00000008);
        _floaty.stopXiaoMj.setVisibility(0x00000008);
        _floaty.stopDaMj.setVisibility(0x00000008);
        
        _floaty.startDaMj.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    if(auto.service == null) {
                        toastLog("请先开启无障碍服务！");
                        return true;
                    }
                    if (_auth == 0) {
                        toastLog('软件未授权');
                        return true;
                    }
                    var r = _da_mj.start_da_mj();
                    if (r) {
                        _floaty.startDaMj.setVisibility(0x00000008);
                        _floaty.stopDaMj.setVisibility(0x00000000);
                        _buttonJson.big = 1;
                    }
              }
              return true
            }
        );

        _floaty.stopDaMj.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    var r = _da_mj.stop_da_mj();
                    if (r) {
                        _floaty.startDaMj.setVisibility(0x00000000);
                        _floaty.stopDaMj.setVisibility(0x00000008);
                        _buttonJson.big = 0;
                    }
              }
              return true
            }
        );
        

        _floaty.startXiaoMj.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    if(auto.service == null) {
                        toastLog("请先开启无障碍服务！");
                        return true;
                    }
                    if (_auth == 0) {
                        toastLog('软件未授权');
                        return true;
                    }
                    var r = _xiao_mj.start_xiao_mj();
                    if (r) {
                        _floaty.startXiaoMj.setVisibility(0x00000008);
                        _floaty.stopXiaoMj.setVisibility(0x00000000);
                        _buttonJson.small = 1;
                    }
              }
              return true
            }
        );

        _floaty.stopXiaoMj.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    var r = _xiao_mj.stop_xiao_mj();
                    if (r) {
                        _floaty.startXiaoMj.setVisibility(0x00000000);
                        _floaty.stopXiaoMj.setVisibility(0x00000008);
                        _buttonJson.small = 0;
                    }
              }
              return true
            }
        );


        _floaty.starttask.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    if(auto.service == null) {
                        toastLog("请先开启无障碍服务！");
                        return true;
                    }
                    if (_auth == 0) {
                        toastLog('软件未授权');
                        return true;
                    }
                    var r = _task.start_daily_task();
                    if (r) {
                        _floaty.starttask.setVisibility(0x00000008);
                        _floaty.stoptask.setVisibility(0x00000000);
                        _buttonJson.task = 1;
                    }
              }
              return true
            }
        );

        _floaty.stoptask.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    var r = _task.stop_daily_task();
                    if (r) {
                        _floaty.starttask.setVisibility(0x00000000);
                        _floaty.stoptask.setVisibility(0x00000008);
                        _buttonJson.task = 0;
                    }
              }
              return true
            }
        );

        _floaty.startfly.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    if(auto.service == null) {
                        toastLog("请先开启无障碍服务！");
                        return true;
                    }
                    if (_auth == 0) {
                        toastLog('软件未授权');
                        return true;
                    }
                    var r = _random.start_fly();
                    if (r) {
                        _floaty.startfly.setVisibility(0x00000008);
                        _floaty.stopfly.setVisibility(0x00000000);
                        _buttonJson.random = 1;
                    }
              }
              return true
            }
        );

        _floaty.stopfly.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    var r = _random.stop_fly();
                    if (r) {
                        _floaty.startfly.setVisibility(0x00000000);
                        _floaty.stopfly.setVisibility(0x00000008);
                        _buttonJson.random = 0;
                    }
              }
              return true
            }
        );

        _floaty.back.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_UP:
                    _floaty.tool.setVisibility(0x00000008);
                    _floaty.home.setVisibility(0x00000000);
              }
              return true
            }
        );

        _floaty.home.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_DOWN:
                  x=event.getRawX()
                  y=event.getRawY()
                  windowX=_floaty.getX()
                  windowY=_floaty.getY()
                  return true
                case event.ACTION_MOVE:
                //移动手指调整悬浮窗位置
                _floaty.setPosition(windowX+(event.getRawX()-x),windowY+(event.getRawY()-y))
                case event.ACTION_UP:
                    //手指弹起时如果偏移很小则判断为点击
                    if(Math.abs(event.getRawY() - y) == 0 && Math.abs(event.getRawX() - x) == 0){
                        _floaty.tool.setVisibility(0x00000000);
                        _floaty.home.setVisibility(0x00000008);
                    }

              }
              return true
            }
        )
        //移动窗口
        _floaty.move.setOnTouchListener(
            function (view,event){
              switch (event.getAction()){
                case event.ACTION_DOWN:
                  x=event.getRawX()
                  y=event.getRawY()
                  windowX=_floaty.getX()
                  windowY=_floaty.getY()
                  return true
                case event.ACTION_MOVE:
                //移动手指调整悬浮窗位置
                _floaty.setPosition(windowX+(event.getRawX()-x),windowY+(event.getRawY()-y))
              }
              return true
            }
        )

        _floaty.runId.setOnTouchListener(
            function (view,event){
              if (event.getAction() == event.ACTION_UP) {
                if(auto.service == null) {
                    toastLog("请先开启无障碍服务！");
                    return true;
                }

                if (_auth == 1) {
                    _service.run();
                    toastLog('脚本启动成功');
                    _floaty.runId.setVisibility(0x00000008);
                    _floaty.stopId.setVisibility(0x00000000);
                    _storage.put("service_signal",1);
                    _buttonJson.service = 1;
                } else {
                    toastLog('软件未授权');
                    return true
                }

              }
              return true
            }
        )

        _floaty.stopId.setOnTouchListener(
            function (view,event){
              if (event.getAction() == event.ACTION_UP) {
                var result = _service.stop();
                if (result) {
                    toastLog('脚本暂停');
                    _floaty.runId.setVisibility(0x00000000);
                    _floaty.stopId.setVisibility(0x00000008);
                 }
                _storage.put("service_signal",0);
                _buttonJson.service = 0;
              }
              return true
            }
        )

        let show_log = false;
        _floaty.showlog.setOnTouchListener(
            function (view,event){
              if (event.getAction() == event.ACTION_UP) {
                if (!show_log) {
                    console.show();
                    console.setPosition(device.width, 0);
                    show_log = true;
                    _buttonJson.log = 1;
                } else {
                    console.hide();
                    show_log = false;
                    _buttonJson.log = 0;
                }
              }
              return true
            }
        )
        
    }
  )

  

  function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}


  function loadImages(){
    //共通目录设定
    _common_img_path = './res/';
    //加载图片
    _auto_hook_button = images.read(_common_img_path+'auto_hook_button.png');
    _hooking = images.read(_common_img_path+'hooking.png');

    _close_button = images.read(_common_img_path+'close_button.png');
    _chongzhi_close_button = images.read(_common_img_path+'chongzhi_close_button.png');
    _return_city_button = images.read(_common_img_path+'return_city_button.png');
    _zhaohuan_button = images.read(_common_img_path+'zhaohuan_button.png');

    //security
    _security1_label = images.read(_common_img_path+'security/security1_label.png');
    _security2_label = images.read(_common_img_path+'security/security2_label.png');

}

// setTimeout(()=>{
//     let signal = _storage.get("service_signal");
//     if (signal == 1) {
//         launchPackage('com.ahcq.tulonggb');
//         setTimeout(()=>{
//             if (_buttonJson.service == 0) {
//                 toast("启动脚本")
//                 _service.run();
    
//                 ui.run(function() {
//                     _floaty.runId.setVisibility(0x00000008);
//                     _floaty.stopId.setVisibility(0x00000000);
//                 });
//             }
//         },3000);
//     }
// },20000);


// events.on("exit",()=>
// {
//     let signal = _storage.get("service_signal");

//     if (signal == 1) {
//         log('程序异常退出');
//         engines.execScriptFile(engines.myEngine().source)
//     } else {
//         log('程序正常退出')
//     }
    
// })



