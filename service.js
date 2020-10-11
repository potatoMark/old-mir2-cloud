const _pic = require("./utils/pic");

var _service = {};

_service.run = function () {
    try {

        
        //基于-手机:1080x1920
        var _Width=1920;
        var _Height=1080;

        //横屏模式
        width = Math.max(device.width, device.height);
        height = Math.min(device.width, device.height);
        log('当前屏幕分辨率',width,height);
        _android_version = parseInt(device.release.slice(0,1));
        log('安卓.版本',_android_version);
        //计算scale
        var scaleWidth = width / _Width;
        var scaleHeight = height / _Height;
        var scale = Math.min(scaleWidth, scaleHeight);
        log('scale:', scale);

        _danger_signal_ =  threads.atomic();
        _danger_signal_.set(0);
    
        //0 未找到紫怪 1找到紫怪
        _found_signal_ =  threads.atomic();
        _found_signal_.set(0);
    
        //0 未挂机 1挂机中
        _auto_flag_ =  threads.atomic();
        _auto_flag_.set(0);
        //滑动信号 0不滑动 1滑动
        _swip_signal_ =  threads.atomic();
        _swip_signal_.set(0);
        //被杀次数记录
        _kill_count = threads.atomic();
        _kill_count.set(0);

        _random_call_timestamp = 0;

        _find_thread = undefined; 

        //启动线程
        _common_check_thread = threads.start(checkCommon);
        //定义进入地图方式
        //自动挂机主进程
        _auto_hook_thread = threads.start(autoHook);
        //异常处理进程
        _exception_thread = threads.start(operationException);

        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

_service.stop = function(){
     try {
        //启动线程
        _common_check_thread.interrupt();
        //自动挂机主进程
        _auto_hook_thread.interrupt();
        //异常处理进程
        _exception_thread.interrupt();
        if (_find_thread) {
            _find_thread.interrupt();
        }

        _auto_flag_.set(0);
        _swip_signal_.set(0);
        _kill_count.set(0);
        _random_call_timestamp = 0;
        
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}


function findSpeic4(h_kill_,z_kill_,c_kill_,h,z,c){
    log('开始找怪');
    let p = undefined;
    let p1 = undefined;
    let p2 = undefined;
    let firstF_z = [];
    let firstF_c = [];
    firstF_z.push(z[0]);
    firstF_z.push(z[2]);
    firstF_c.push(c[0]);
    if (z_kill_) {
        let startTime = new Date().getTime();
        p = _pic.findPointByPic(firstF_z,0.1,3);
        let endTime = new Date().getTime();
        log('找怪耗时:',endTime - startTime,' 毫秒')
    }

    if (h_kill_) {
        p1 = _pic.findPointByPic(h,0.1,3);
    }
    if (c_kill_) {
        p2 = _pic.findPointByPic(firstF_c,0.1,3);
    }


    if (p) {
        log('发现紫怪');
    } else if (p1) {
        log('发现黄怪');
    } else if (p2) {
        log('发现橙怪');
    } else {
        return 0;
    }
    click(1240,325);
    sleep(5 * 1000);
    let hook = _pic.findPointByPic(_auto_hook_button,0.1);
    if (hook) {
        click(hook.x,hook.y);
    }
    var loop = 0;
    while(loop<5){
        let pp ,pp1,pp2;
        if (z_kill_) {
            pp = _pic.findPointByPic(z,0.1,3);
        }

        if (h_kill_) {
            pp1 = _pic.findPointByPic(h,0.1,3);
        }

        if (c_kill_) {
            pp2 = _pic.findPointByPic(c,0.1,3);
        }
        
        
        if (pp || pp1 ||pp2) {
            sleep(5 * 1000);
            loop = 0;
            continue;
        }

        sleep(2000);
        loop++;
    }
    //捡物品时间
    if (p2) {
        sleep(20*1000);
    } else {
        sleep(10*1000);
    }
    return 1;
}

function findSpeic(h_kill_,z_kill_,c_kill_,h,z,c){
    log('开始找怪');
    let p = undefined;
    let p1 = undefined;
    let p2 = undefined;
    let firstF_z = [];
    let firstF_c = [];
    if (z.length == 3) {
        firstF_z.push(z[0]);
        firstF_z.push(z[1]);
    } else if (z.length == 4) {
        firstF_z.push(z[0]);
        firstF_z.push(z[1]);
        firstF_z.push(z[2]);
    } else {
        firstF_z.push(z[0]);
    }
    firstF_c.push(c[0]);
    if (z_kill_) {
        let startTime = new Date().getTime();
        p = _pic.findPointByPic(firstF_z,0.1,3);
        let endTime = new Date().getTime();
        log('找怪耗时:',endTime - startTime,' 毫秒')
    }

    if (h_kill_) {
        p1 = _pic.findPointByPic(h,0.1,3);
    }
    if (c_kill_) {
        p2 = _pic.findPointByPic(firstF_c,0.1,3);
    }


    if (p) {
        log('发现紫怪');
    } else if (p1) {
        log('发现黄怪');
    } else if (p2) {
        log('发现橙怪');
    } else {
        return 0;
    }
    click(1240,325);
    sleep(5 * 1000);
    let hook = _pic.findPointByPic(_auto_hook_button,0.1);
    if (hook) {
        click(hook.x,hook.y);
    }
    var loop = 0;
    while(loop<5){
        let pp ,pp1,pp2;
        if (z_kill_) {
            pp = _pic.findPointByPic(z,0.1,3);
        }

        if (h_kill_) {
            pp1 = _pic.findPointByPic(h,0.1,3);
        }

        if (c_kill_) {
            pp2 = _pic.findPointByPic(c,0.1,3);
        }
        
        
        if (pp || pp1 ||pp2) {
            sleep(5 * 1000);
            loop = 0;
            continue;
        }

        sleep(2000);
        loop++;
    }
    //捡物品时间
    if (p2) {
        sleep(20*1000);
    } else {
        sleep(10*1000);
    }
    return 1;
}

function findSpeic2(h_kill_,z_kill_,c_kill_,h,z,c,flag){

    if (flag % 2 == 0 ) {
        let startTime = new Date().getTime();
        speicCheck();
        let endTime = new Date().getTime();
        log('死亡&回城check:',endTime - startTime,' 毫秒')
    }
    findBossLoop(h_kill_,z_kill_,c_kill_,h,z,c);
    setInterval(()=>{
        findBossLoop(h_kill_,z_kill_,c_kill_,h,z,c)
    }, 500);

}

function findBossLoop(h_kill_,z_kill_,c_kill_,h,z,c){
    let p = undefined;
    let p1 = undefined;
    let p2 = undefined;
    let firstF_z = [];
    let firstF_c = [];
    if (z.length == 3) {
        firstF_z.push(z[0]);
        firstF_z.push(z[1]);
    } else if (z.length == 4) {
        firstF_z.push(z[0]);
        firstF_z.push(z[1]);
        firstF_z.push(z[2]);
    } else {
        firstF_z.push(z[0]);
    }

    firstF_c.push(c[0]);

    if (z_kill_) {
        let startTime = new Date().getTime();
        p = _pic.findPointByPic(firstF_z,0.1,3);
        let endTime = new Date().getTime();
        log('找怪耗时:',endTime - startTime,' 毫秒')
    }

    if (h_kill_) {
        p1 = _pic.findPointByPic(h,0.1,3);
    }
    if (c_kill_) {
        p2 = _pic.findPointByPic(firstF_c,0.1,3);
    }
    if (p) {
        log('发现紫怪');
        _found_signal_.set(1);
    } else if (p1) {
        log('发现黄怪');
        _found_signal_.set(1);
    } else if (p2) {
        log('发现橙怪');
        _found_signal_.set(1);
    } else {
        _found_signal_.set(0);
        return;
    }
    click(1240,325);
    sleep(5 * 1000);
    let hook = _pic.findPointByPic(_auto_hook_button,0.1);
    if (hook) {
        click(hook.x,hook.y);
    }
    var loop = 0;
    while(loop<5){
        let pp, pp1, pp2;
        if (z_kill_) {
            pp = _pic.findPointByPic(z,0.1,3);
        }

        if (h_kill_) {
            pp1 = _pic.findPointByPic(h,0.1,3);
        }

        if (c_kill_) {
            pp2 = _pic.findPointByPic(c,0.1,3);
        }
        
        if (pp || pp1 || pp2) {
            sleep(5 * 1000);
            loop = 0;
            continue;
        }
        sleep(2000);
        loop++;
    }
    //捡物品时间
    if (p2) {
        sleep(20*1000);
    } else {
        sleep(10*1000);
    }
    _found_signal_.set(0);
}

function findSpeic3(h_kill_,z_kill_,c_kill_,h,z,c,flag){

    if (flag % 2 == 0 ) {
        let startTime = new Date().getTime();
        speicCheck();
        let endTime = new Date().getTime();
        log('死亡&回城check:',endTime - startTime,' 毫秒')
    }
    findBossLoop2(h_kill_,z_kill_,c_kill_,h,z,c);
    setInterval(()=>{
        findBossLoop2(h_kill_,z_kill_,c_kill_,h,z,c)
    }, 500);

}

function findBossLoop2(h_kill_,z_kill_,c_kill_,h,z,c){
    let p = undefined;
    let p1 = undefined;
    let p2 = undefined;
    let firstF_z = [];
    let firstF_c = [];
    firstF_z.push(z[0]);
    firstF_z.push(z[1]);
    firstF_c.push(c[0]);

    if (z_kill_) {
        let startTime = new Date().getTime();
        p = _pic.findPointByPic(firstF_z,0.1,3);
        let endTime = new Date().getTime();
        log('找怪耗时:',endTime - startTime,' 毫秒')
    }

    if (h_kill_) {
        p1 = _pic.findPointByPic(h,0.1,3);
    }
    if (c_kill_) {
        p2 = _pic.findPointByPic(firstF_c,0.1,3);
    }
    if (p) {
        log('发现紫怪');
        _found_signal_.set(1);
    } else if (p1) {
        log('发现黄怪');
        _found_signal_.set(1);
    } else if (p2) {
        log('发现橙怪');
        _found_signal_.set(1);
    } else {
        _found_signal_.set(0);
        return;
    }
    terminalTime = new Date().getTime();
    click(1240,325);
    sleep(5 * 1000);
    let hook = _pic.findPointByPic(_auto_hook_button,0.1);
    if (hook) {
        click(hook.x,hook.y);
    }
    var loop = 0;
    while(loop<5){
        let pp, pp1, pp2;
        if (z_kill_) {
            pp = _pic.findPointByPic(z,0.1,3);
        }

        if (h_kill_) {
            pp1 = _pic.findPointByPic(h,0.1,3);
        }

        if (c_kill_) {
            pp2 = _pic.findPointByPic(c,0.1,3);
        }
        
        if (pp || pp1 || pp2) {
            sleep(5 * 1000);
            loop = 0;
            continue;
        }
        sleep(2000);
        loop++;
    }
    //捡物品时间
    if (p2) {
        sleep(20*1000);
    } else {
        sleep(10*1000);
    }
    _found_signal_.set(0);
}


function intoMolong(){
    let molongdj = _storage.get('molongdj');
    let molongxj = _storage.get('molongxj');
    let molongc = _storage.get('molongc');
    let element7 = _storage.get('element7');
    let element8 = _storage.get('element8');
    let element9 = _storage.get('element9');
    let element10 = _storage.get('element10');
    let element11 = _storage.get('element11');
    let element12 = _storage.get('element12');

    let loopFind = _storage.get('loopFindId');
    let restoreLife = _storage.get('restoreLife');

    let h_kill_ = _storage.get('h_kill_check');
    let z_kill_ = _storage.get('z_kill_check');
    let c_kill_ = false;

    let _ml_h_pic = [];
    let _ml_z_pic = [];
    let _ml_c_pic = [];
    let file = undefined;
    try {
        if (loopFind) {
            //关闭常规的守护线程
            _common_check_thread.interrupt();
            //关闭异常监听Bus
            _exception_thread.interrupt();
            let preRandomDest = 0;

            while (true) {
                
                // for (let index = 1; index <= 8; index++) {
                let index = random(1,8);
                log('random:',index);
                if (preRandomDest == index) {
                    continue;
                }
                    
                if((index == 1 && !molongdj)
                    || (index == 2 && !molongxj)
                    || (index == 3 && !molongc)
                    || (index == 4 && !element7)
                    || (index == 5 && !element8)
                    || (index == 6 && !element9)
                    || (index == 7 && !element10)
                    || (index == 8 && !element11)
                    || (index == 9 && !element12)) {
                    continue;
                }
                preRandomDest = index; 

                 //自动隐藏边角显示栏
                 let leftBound = images.read(_common_img_path+'task/task_button.png');
                 let rightBound = images.read(_common_img_path+'chuan_zhanling_button.png');
 
                 let leftPoint = _pic.findPointByPic(leftBound,0.7);
                 leftBound.recycle();
                 if (leftPoint) {
                     click(16,208);
                 }
                 sleep(500);
                 let rightPoint = _pic.findPointByPic(rightBound,0.7);
                 rightBound.recycle();
                 if (rightPoint) {
                     click(1069,43);
                 }
                 sleep(1000);
                if (index <= 3) {
                    log('开始找传送按钮');
                    click(1184,216);
                    sleep(2000);
                    _swip_signal_.set(0);
                    log('准备切换到特殊地图页面');
                    click(127,216);
                    sleep(2000);
                    log('准备进入目标地图');
                    
                    if (index == 1) {

                        file = open('./tmp/molongdj.txt','r');

                        _ml_h_pic = [images.read(_common_img_path+'boss/dj_h_boss1.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/dj_z_boss3.png'),images.read(_common_img_path+'boss/dj_z_boss2.png')];
                        _ml_c_pic=[images.read(_common_img_path+'boss/dj_c_boss1.png'),images.read(_common_img_path+'boss/dj_c_boss2.png')];
                        c_kill_ = _storage.get('ml_dj_c');

                        click(468,303);
                    } else if (index == 2) {
                        file = open('./tmp/molongxj.txt','r');

                        _ml_h_pic = [images.read(_common_img_path+'boss/xj_h_boss3.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/xj_z_boss1.png'),images.read(_common_img_path+'boss/xj_z_boss3.png')];
                        _ml_c_pic=[images.read(_common_img_path+'boss/xj_c_boss2.png'),images.read(_common_img_path+'boss/xj_c_boss1.png'),images.read(_common_img_path+'boss/xj_c_boss3.png')];
                        c_kill_ = _storage.get('ml_xj_c');
                        click(756,310);
                    } else if (index == 3) {
                        file = open('./tmp/molongc.txt','r');
                        _ml_h_pic = [images.read(_common_img_path+'boss/ml_h_boss2.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/ml_z_boss2.png'),images.read(_common_img_path+'boss/ml_z_boss3.png')];
                        _ml_c_pic=[images.read(_common_img_path+'boss/ml_c_boss2.png'),images.read(_common_img_path+'boss/ml_c_boss1.png'),images.read(_common_img_path+'boss/ml_c_boss3.png')];
                        c_kill_ = _storage.get('ml_c_c');
                        click(1049,316);
                    }
                } else {
                    elementMethod();
                    sleep(2 * 1000);
                    if (index == 4) {
                        file = open('./tmp/element7.txt','r');
                        _ml_h_pic = [images.read(_common_img_path+'boss/e7_h_boss2.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/e7_z_boss2.png'),
                                    images.read(_common_img_path+'boss/e7_z_boss5.png'),
                                    images.read(_common_img_path+'boss/e7_z_boss3.png')];
                        _ml_c_pic = [images.read(_common_img_path+'boss/e7_c_boss1.png')];
                        c_kill_ = _storage.get('e7_c');
                        click(770,97);
                    } else if (index == 5) {
                        file = open('./tmp/element8.txt','r');
                        _ml_h_pic = [images.read(_common_img_path+'boss/e8_h_boss2.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/e8_z_boss2.png'),
                                    images.read(_common_img_path+'boss/e8_z_boss3.png'),
                                    images.read(_common_img_path+'boss/e8_z_boss4.png'),
                                    images.read(_common_img_path+'boss/e8_z_boss5.png')];
                        _ml_c_pic = [images.read(_common_img_path+'boss/e8_c_boss2.png'),images.read(_common_img_path+'boss/e8_c_boss1.png'),images.read(_common_img_path+'boss/e8_c_boss3.png')];
                        c_kill_ = _storage.get('e8_c');
                        click(757,201);
                    } else if (index == 6) {
                        file = open('./tmp/element9.txt','r');
                        _ml_h_pic = [images.read(_common_img_path+'boss/ml_h_boss2.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/ml_z_boss2.png'),images.read(_common_img_path+'boss/ml_z_boss3.png')];
                        _ml_c_pic = [images.read(_common_img_path+'boss/ml_c_boss2.png'),images.read(_common_img_path+'boss/ml_c_boss1.png'),images.read(_common_img_path+'boss/ml_c_boss3.png')];
                        c_kill_ = _storage.get('e9_c');
                        click(772,299);
                    } else if (index == 7) {
                        file = open('./tmp/element10.txt','r');
                        _ml_h_pic = [images.read(_common_img_path+'boss/e10_h_boss1.png'),images.read(_common_img_path+'boss/e10_h_boss2.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/e10_z_boss1.png'),images.read(_common_img_path+'boss/e10_z_boss2.png')];
                        _ml_c_pic = [images.read(_common_img_path+'boss/e10_c_boss2.png'),images.read(_common_img_path+'boss/e10_c_boss1.png'),images.read(_common_img_path+'boss/e10_c_boss3.png')];
                        c_kill_ = _storage.get('e10_c');
                        click(781,394);
                    } else if (index == 8) {
                        file = open('./tmp/element11.txt','r');
                        _ml_h_pic = [images.read(_common_img_path+'boss/e11_h_boss1.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/e11_z_boss1.png'),images.read(_common_img_path+'boss/e11_z_boss2.png')];
                        _ml_c_pic = [images.read(_common_img_path+'boss/e11_c_boss2.png'),images.read(_common_img_path+'boss/e11_c_boss1.png')];
                        c_kill_ = _storage.get('e11_c');
                        click(786,487);
                    } else if (index == 9) {
                        _ml_h_pic = [images.read(_common_img_path+'boss/e12_h_boss1.png')];
                        _ml_z_pic = [images.read(_common_img_path+'boss/e12_z_boss1.png'),images.read(_common_img_path+'boss/e12_z_boss2.png')];
                        _ml_c_pic = [images.read(_common_img_path+'boss/e12_c_boss1.png'),images.read(_common_img_path+'boss/e12_c_boss2.png')];
                        c_kill_ = _storage.get('e12_c');
                        click(786,597);
                    }
                }

                sleep(2000);
                let tps = file.readlines();

                let loopCount = 0;
                let loopFlag = 0;
                for (row in tps){
                    let point = tps[row].split(',');
                    if (loopFlag%5 == 0) {
                        let startTime = new Date().getTime();
                        var close1_point = _pic.findPointByPic(_close_button,0.9);
                        if (close1_point) {
                            click(close1_point.x,close1_point.y);
                            log('close1')
                        }
                        
                        let zhaohuan_point = _pic.findPointByPic(_zhaohuan_button,0.4);
                        if (zhaohuan_point) {
                            let randomTime = _storage.get('randomTime');
                            let randomCallHero = _storage.get('randomCallHero');
                            if(randomCallHero) {
                                if (_random_call_timestamp == 0) {
                                    var later = Math.floor((Math.random()*randomTime)+1);
                                    _random_call_timestamp = new Date().getTime() + later * 60 * 1000;
                                    log('下次召唤英雄时间:',later,'分钟以后');
                                } else if (new Date().getTime() >= _random_call_timestamp) {
                                    log('自动召唤英雄');
                                    click(zhaohuan_point.x,zhaohuan_point.y);
                                    _random_call_timestamp = 0 ;
                                }
                            } else {
                                log('自动召唤英雄');
                                click(zhaohuan_point.x,zhaohuan_point.y);
                            }

                        }
                        let endTime = new Date().getTime();
                        log('关闭按钮查询耗时:',endTime - startTime,' 毫秒')
                    }
                    
                    sleep(1000);
                    log('打开地图');
                    click(1175,101);
                    sleep(1000);
                    log('定位坐标');
                    let x = point[0];
                    let y = point[1];
                    log(x+','+y);
                    //double click
                    press(x,y,2);
                    press(x,y,2);
                    sleep(1000);
                    log('关闭地图');
                    click(1099,93);
                    log('等待角色走到指定点位');
                    var seep = (point[2] * 1000 - 1500) < 0 ? 1000:point[2] * 1000 - 1500;
                    if (seep >= 5 * 1000) {
                        _find_thread = threads.start(function () {
                            findSpeic2(h_kill_,z_kill_,c_kill_, _ml_h_pic, _ml_z_pic, _ml_c_pic,loopFlag)
                        });
                    }
                    sleep(seep);
                    if (seep < 5 * 1000) {
                        let result  = findSpeic(h_kill_,z_kill_,c_kill_, _ml_h_pic, _ml_z_pic, _ml_c_pic);
                        if (result == 0) {
                            loopCount++;
                        } else{
                            loopCount = 0;
                        }
                    } else {
                        if (_found_signal_.get() == 0) {
                            _find_thread.interrupt();
                            let result  = findSpeic(h_kill_,z_kill_,c_kill_, _ml_h_pic, _ml_z_pic, _ml_c_pic);
                            if (result == 0) {
                                loopCount++;
                            } else{
                                loopCount = 0;
                            }
                            // loopCount++;
                        } else {
                            while (true) {
                                if (_found_signal_.get() == 1) {
                                    sleep(5000);
                                    continue;
                                } 
                                _find_thread.interrupt();
                                break;
                            }
                            loopCount = 0;
                        }
                    }

                    if (loopCount >= restoreLife && index == 3) {
                        //长时间未找到怪物,开始自动打小怪,补充血量
                        log('长时间未找到怪物,开始自动打小怪,补充血量');
                        click(1240,325);
                        sleep(10 * 1000);
                        loopCount = 0;
                    }

                    loopFlag++;
                }
                file.close();
                click(1147,326);
                log('目标地图找怪完成,回城休息');
                
                for (let i = 0; i < _ml_h_pic.length; i++) {
                    if (_ml_h_pic[i]) {
                        _ml_h_pic[i].recycle();
                    }
                    
                }
                for (let j = 0; j < _ml_z_pic.length; j++) {
                    if (_ml_z_pic[j]) {
                        _ml_z_pic[j].recycle();
                    }
                }
                for (let k = 0; k < _ml_c_pic.length; k++) {
                    if (_ml_c_pic[k]) {
                        _ml_c_pic[k].recycle();
                    }
                    
                }
                sleep(2 * 1000);
                if (_storage.get('autoStoreResourece')) {
                    storePackage(2);
                }
            }
        } else {
            //传
            log('开始找传送按钮');
            click(1184,216);
            sleep(2000);
            _swip_signal_.set(0);
            log('准备切换到特殊地图页面');
            click(127,216);
            sleep(2000);
            log('准备进入目标地图');
            if (molongdj) {
                click(468,303);
            } else if (molongxj) {
                click(756,310);
            } else if (molongc) {
                click(1049,316);
            }
            //开始挂机
            log('开始挂机');
            sleep(1000);
            click(1240,325);
        }
        _auto_flag_.set(1);
    } catch (error) {
        toastLog('发生系统异常');
        toastLog(error);
        _danger_signal_.set(1);
    }
}

function elementMethod(){
    log('准备进入更多');
    click(44,634);
    sleep(2000);
    log('准备进入百仙果');
    click(1124,281);
    sleep(2000);
    _swip_signal_.set(0);
    log('准备进入元素挑战列表');
    click(42,263);
    sleep(2000);

    log('翻页开始31');
    var swip_result = swipe(770,620,770,0,4*1000);
    log('翻页结束31');
    if (swip_result == false) {
        log('滑动异常',swip_result);
        _danger_signal_.set(1);
        return false;
    }
    sleep(2000);
    log('翻页开始32');
    var swip_result = swipe(770,620,770,0,4*1000);
    _swip_signal_.set(0);
    log('翻页结束32');
    if (swip_result == false) {
        log('滑动异常',swip_result);
        _danger_signal_.set(1);
        return false;
    }
}


function intoElement(){

    try {
        log('准备进入更多');
        click(44,634);
        sleep(2000);
        log('准备进入百仙果');
        click(1124,281);
        sleep(2000);
        _swip_signal_.set(0);
        log('准备进入元素挑战列表');
        click(42,263);
        sleep(2000);


        //判断目标是在第几页
        if (_element_ <= 23) {
            switch (_element_) {
                case 11: 
                    click(790,143);
                    break;
                case 12: 
                    click(782,232);
                    break;
                case 13: 
                    click(783,333);
                    break;
                case 21: 
                    click(807,435);
                    break;
                case 22: 
                    click(795,526);
                    break;
                case 23: 
                    click(781,622);
                    break;

            }
        } else if (_element_ > 23 && _element_ <= 61) {
            log('翻页开始');
            while(_swip_signal_.get() == 2){
                log('check Common ing...');
                sleep(1000);
                continue;
            }
            _swip_signal_.set(1);
            var swip_result = swipe(770,620,770,0,4*1000);
            _swip_signal_.set(0);
            log('翻页结束');
            if (swip_result == false) {
                log('滑动异常',swip_result);
                _danger_signal_.set(1);
                return false;
            }
            sleep(  2 * 1000);

            switch (_element_) {
                case 31: 
                    click(776,104);
                    break;
                case 32: 
                    click(777,205);
                    break;
                case 41: 
                    click(784,303);
                    break;
                case 42: 
                    click(776,392);
                    break;
                case 51: 
                    click(772,495);
                    break;
                case 61: 
                    click(782,593);
                    break;
            }


        } else if(_element_ > 61) {
            log('翻页开始31');
            while(_swip_signal_.get() == 2){
                log('check Common ing...');
                sleep(1000);
                continue;
            }
            _swip_signal_.set(1);
            var swip_result = swipe(770,620,770,0,4*1000);
            // _swip_signal_.set(0);
            log('翻页结束31');
            if (swip_result == false) {
                log('滑动异常',swip_result);
                _danger_signal_.set(1);
                return false;
            }
            sleep(2000);

            
            log('翻页开始32');
            // _swip_signal_.set(1);
            var swip_result = swipe(770,620,770,0,4*1000);
            _swip_signal_.set(0);
            log('翻页结束32');
            if (swip_result == false) {
                log('滑动异常',swip_result);
                _danger_signal_.set(1);
                return false;
            }

            //
            sleep(2 * 1000);

            switch (_element_) {
                case 71: 
                    click(770,97);
                    break;
                case 81: 
                    click(757,201);
                    break;
                case 91: 
                    click(772,299);
                    break;
                case 101: 
                    click(781,394);
                    break;
                case 111: 
                    click(786,497);
                    break;
                case 121: 
                    click(775,595);
                    break;
            }


        }
        _auto_flag_.set(1);
        sleep(2000);
        //开始挂机
        log('开始挂机');
        click(1240,325);
    } catch (error) {
        toastLog('发生系统异常');
        toastLog(error);
        _danger_signal_.set(1);
    }
}

function intoelementfruit(){
    //组装需要挂机的地图目标
    let scanboss = _storage.get('scanboss');//扫描时间
    
    let preIndex = 0;
    let bossGroup = undefined;
    let index = 0;
    let target = undefined;
    let loopCnt = 0;
    try {
        //自动隐藏边角显示栏
        let leftBound = images.read(_common_img_path+'task/task_button.png');
        let rightBound = images.read(_common_img_path+'chuan_zhanling_button.png');

        let leftPoint = _pic.findPointByPic(leftBound,0.7);
        leftBound.recycle();
        if (leftPoint) {
            click(16,208);
        }
        sleep(500);
        let rightPoint = _pic.findPointByPic(rightBound,0.7);
        rightBound.recycle();
        if (rightPoint) {
            click(1069,43);
        }
        sleep(1000);
        while(true){
            loopCnt++;
            _pic.findPointByPic(_close_button,0.7,2);
            sleep(1000);
            click(width - 10,height - 10);

            bossGroup = [];
            index = random(1,11);
            if (index == preIndex) {
                continue;
            }
            target = _storage.get('e_'+index);
            if (!target) {
                continue;
            }
            preIndex = index;

            //进入元素
            log('准备进入更多');
            click(44,634);
            sleep(2000);
            log('准备进入百仙果');
            click(1124,281);
            sleep(2000);
            _swip_signal_.set(0);
            log('准备进入元素挑战列表');
            click(42,263);
            sleep(2000);
            
            if (index <= 6) {
                //第一页
                switch (index) {
                    case 1: 
                        click(790,143);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e1_1.png'),
                            images.read(_common_img_path+'fruit/e1_2.png'),
                            images.read(_common_img_path+'fruit/e1_3.png')
                        ];
                        break;
                    case 2: 
                        click(782,232);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e1_1.png'),
                            images.read(_common_img_path+'fruit/e1_2.png'),
                            images.read(_common_img_path+'fruit/e1_3.png')
                        ];
                        break;
                    case 3: 
                        click(783,333);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e1_1.png'),
                            images.read(_common_img_path+'fruit/e1_2.png'),
                            images.read(_common_img_path+'fruit/e1_3.png')
                        ];
                        break;
                    case 4: 
                        click(807,435);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e2_1.png'),
                            images.read(_common_img_path+'fruit/e2_2.png')
                        ];
                        break;
                    case 5: 
                        click(795,526);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e2_1.png'),
                            images.read(_common_img_path+'fruit/e2_2.png')
                        ];
                        break;
                    case 6: 
                        click(781,622);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e2_1.png'),
                            images.read(_common_img_path+'fruit/e2_2.png')
                        ];
                        break;
                }
            }else {
                log('翻页开始');
                while(_swip_signal_.get() == 2){
                    log('check Common ing...');
                    sleep(1000);
                    continue;
                }
                _swip_signal_.set(1);
                var swip_result = swipe(770,620,770,0,4*1000);
                _swip_signal_.set(0);
                log('翻页结束');
                if (swip_result == false) {
                    log('滑动异常',swip_result);
                    _danger_signal_.set(1);
                    return false;
                }
                sleep(  2 * 1000);
                switch (index) {
                    case 7: 
                        click(776,104);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e3_1.png'),
                            images.read(_common_img_path+'fruit/e3_2.png'),
                            images.read(_common_img_path+'fruit/e3_3.png'),
                            images.read(_common_img_path+'fruit/e3_4.png'),
                        ];
                        break;
                    case 8: 
                        click(777,205);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e3_1.png'),
                            images.read(_common_img_path+'fruit/e3_2.png'),
                            images.read(_common_img_path+'fruit/e3_3.png'),
                            images.read(_common_img_path+'fruit/e3_4.png'),
                        ];
                        break;
                    case 9: 
                        click(784,303);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e4_1.png'),
                            images.read(_common_img_path+'fruit/e4_2.png'),
                            images.read(_common_img_path+'fruit/e4_3.png'),
                            images.read(_common_img_path+'fruit/e4_4.png'),
                        ];
                        break;
                    case 10: 
                        click(776,392);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e4_1.png'),
                            images.read(_common_img_path+'fruit/e4_2.png'),
                            images.read(_common_img_path+'fruit/e4_3.png'),
                            images.read(_common_img_path+'fruit/e4_4.png'),
                        ];
                        break;
                    case 11: 
                        click(772,495);
                        bossGroup = [
                            images.read(_common_img_path+'fruit/jy.png'),
                            images.read(_common_img_path+'fruit/kr.png'),
                            images.read(_common_img_path+'fruit/xb.png'),
                            images.read(_common_img_path+'fruit/e5_1.png'),
                            images.read(_common_img_path+'fruit/e5_2.png'),
                            images.read(_common_img_path+'fruit/e5_3.png'),
                            images.read(_common_img_path+'fruit/e5_4.png'),
                        ];
                        break;
                }
            }
            //开始挂机
            sleep(2000);
            click(1240,325);
            //查看周围是否有怪物
            let count = 0;
            let findResult = undefined;
            while(true){
                sleep(scanboss * 1000);
                findResult = _pic.findPointByPic(bossGroup,0.1,3);
                if (findResult) {
                    count = 0;
                    continue;
                } else {
                    count++ ;
                }
                if (count >= 3) {
                    log('当前地图,长时间未发现怪物,准备换图')
                    break;
                }
            }

            if (loopCnt >= _storage.get('storeyeguo')) {
                _swip_signal_.set(1);
                //点击回城存果子
                click(1147,326);
                sleep(2 * 1000);
                if (_storage.get('autoStoreResourece')) {
                    storePackage(3);
                }
                loopCnt = 0;
            }
        }
    } catch (error) {
        toastLog(error);
    }
}
function intoCow(){

    let cow = _storage.get('cowCount');
    try{
        //找到活动按钮并点击
        log('开始查找活动按钮');
        click(883,36);
        sleep(1500);
        //找到第二个活动按钮
        click(791,124);
        sleep(2000);

        //点击奶牛关活动
        log('点击奶牛关活动');
        click(165,418);
        sleep(2000);
        _swip_signal_.set(0);
        //点击公共奶牛关
        log('点击公共奶牛关');
        click(603,541);
        sleep(2000);
        //开始设置此次挑战的时间
        log('开始设置此次挑战的时间');
        var count = 1;
        while(count < cow){
            log('添加五分钟,使用奶牛:',count+1);
            sleep(700);
            click(716,680);
            count++;
        }
        sleep(2000);
        //进入奶牛关
        log('进入奶牛关');
        click(759,544);
        sleep(2000);
        //提示点击确定
        click(487,483);
        _auto_flag_.set(1);
        //开始挂机
        log('开始挂机');
        sleep(1000);
        click(1240,325);
    } catch (error) {
        toastLog('发生系统异常');
        toastLog(error);
        _danger_signal_.set(1);
    }
}
function intozhanling(){
    try{
        log('开始查找占领地图按钮');
        let chuan_zhanling_button = images.read(_common_img_path+'chuan_zhanling_button.png');
    
        var chuan_zhanling_button_point = _pic.findPointByPic(chuan_zhanling_button,0.4);
        chuan_zhanling_button.recycle();
        if (chuan_zhanling_button_point) {
            log('找到传送占领按钮',chuan_zhanling_button_point);
            click(chuan_zhanling_button_point.x,chuan_zhanling_button_point.y);
        } else{
            log('fuck,占领传送按钮未找到,有问题了');
            _danger_signal_.set(1);
            return false;
        }
        _swip_signal_.set(0);
        sleep(2000);
        log('点击进入目标地图');
        click(111,183);
        sleep(2000);
        _auto_flag_.set(1);
        //开始挂机
        log('开始挂机');
        click(1240,325);
    } catch (error) {
        toastLog('发生系统异常');
        toastLog(error);
        _danger_signal_.set(1);
    }
}

function openMap(){
    if (_map_point) {
        click(_map_point.x, _map_point.y);
        return true;
    }
    return false;
    
}

function closeMap(){
    if (!_close_point) {
        var close_button_point = _pic.findPointByPic(_close_button,0.4);
        if (close_button_point) {
            log('找到目标按钮',close_button_point);
            _close_point = {x:close_button_point.x,y:close_button_point.y}
        } else {
            log('fuck,地图关闭按钮未找到,有问题了');
            return false;
        }
        
    }
    sleep(2000);
    click(_close_point.x, _close_point.y);
    return true;
}


function operationException(){
    setInterval(function (){
        if (_danger_signal_.get() == 1) {
            log('⚪进入异常处理⚪');
            log('关闭进程');
            _auto_hook_thread.interrupt();
            _common_check_thread.interrupt();
            log('尝试关闭异常弹框(确认),并关闭');
            _pic.findPointByPic(_close_button,0.7,2);
            sleep(3000);
            // log('尝试关闭异常弹框(充值),并关闭');
            // _pic.findPointByPicclick(_chongzhi_close_button,0.7);
            // sleep(3000);
            // log('尝试查找快捷栏回城石,并关闭');
            // _pic.findPointByPicclick(_return_city_button,0.7);
            sleep(500);
            log('点击屏幕');
            click(width - 10,height - 10);

            log('初始化异常信号值为0');
            _danger_signal_.set(0);
            log('重新启动主进程');
            _auto_hook_thread = threads.start(autoHook);
            _common_check_thread = threads.start(checkCommon);
        }
    }, 60 * 1000);
}

function putongloophookjudge(){
    let basichookmode = _storage.get('basichookmode');
    log(basichookmode);
    if (basichookmode == '定点') {
        into3ceng();
    } else if (basichookmode == '循环') {
        intoLoopHook123Ceng();
    }
}
function intoLoopHook123Ceng(){

    try {
        //关闭常规的守护线程
        _common_check_thread.interrupt();
        //关闭异常监听Bus
        _exception_thread.interrupt();

        let index = 0;
        let preIndex = 0;
        let ceng1 = undefined;
        let ceng2 = undefined;
        let ceng3 = undefined;
        let sleep1 = undefined;
        let sleep2 = undefined;
        let mubiaoPic = undefined;
        let file1 = undefined;
        let file2 = undefined;
        let file3 = undefined;
        let z_boss = [];
        let c_boss = [];

        //自动隐藏边角显示栏
        let leftBound = images.read(_common_img_path+'task/task_button.png');
        let rightBound = images.read(_common_img_path+'chuan_zhanling_button.png');

        let leftPoint = _pic.findPointByPic(leftBound,0.7);
        leftBound.recycle();
        if (leftPoint) {
            click(16,208);
        }
        sleep(500);
        let rightPoint = _pic.findPointByPic(rightBound,0.7);
        rightBound.recycle();
        if (rightPoint) {
            click(1069,43);
        }
        sleep(1000);
        
        while(true){
            index = random(1,3);
            if (index == preIndex) {
                continue;
            }
            if (index == 1) {
                ceng1 = _storage.get('zuma_1');
                ceng2 = _storage.get('zuma_2');
                ceng3 = _storage.get('zuma_3');
                sleep1 = 60 * 1000;
                sleep2 = 150 * 1000;

                if(ceng1 || ceng2 || ceng3) {

                    file1 = open('./tmp/putong/zuma1.txt','r');
                    file2 = open('./tmp/putong/zuma2.txt','r');
                    file3 = open('./tmp/putong/zuma3.txt','r');
                    mubiaoPic = images.read(_common_img_path+'map/zuma_button.png');
                    z_boss = [images.read(_common_img_path+'boss/putong/zuma_z_boss1.png'),
                              images.read(_common_img_path+'boss/putong/zuma_z_boss2.png'),
                              images.read(_common_img_path+'boss/putong/zuma_z_boss3.png')
                             ];
                    c_boss = [images.read(_common_img_path+'boss/putong/zuma_c_boss1.png'),
                              images.read(_common_img_path+'boss/putong/zuma_c_boss2.png')
                             ];

                    putongLoopCeng(ceng1,ceng2,ceng3,file1,file2,file3,mubiaoPic,z_boss,c_boss,sleep1,sleep2);
                    file1.close();
                    file2.close();
                    file3.close();
                    mubiaoPic.recycle();
                    for (let j = 0; j < z_boss.length; j++) {
                        if (z_boss[j]) {
                            z_boss[j].recycle();
                        }
                    }
                    for (let k = 0; k < c_boss.length; k++) {
                        if (c_boss[k]) {
                            c_boss[k].recycle();
                        }
                        
                    }
                }
            } else if (index == 2) {
                ceng1 = _storage.get('hq_1');
                ceng2 = _storage.get('hq_2');
                ceng3 = _storage.get('hq_3');
                sleep1 = 105 * 1000;
                sleep2 = 145 * 1000;
                if(ceng1 || ceng2 || ceng3) {

                    file1 = open('./tmp/putong/hq1.txt','r');
                    file2 = open('./tmp/putong/hq2.txt','r');
                    file3 = open('./tmp/putong/hq3.txt','r');
                    mubiaoPic = images.read(_common_img_path+'map/gumo_button.png');
                    z_boss = [images.read(_common_img_path+'boss/putong/hq_z_boss1.png'),
                              images.read(_common_img_path+'boss/putong/hq_z_boss2.png'),
                              images.read(_common_img_path+'boss/putong/hq_z_boss3.png')
                             ];
                    c_boss = [images.read(_common_img_path+'boss/putong/hq_c_boss1.png'),
                              images.read(_common_img_path+'boss/putong/hq_c_boss2.png')
                             ];

                    putongLoopCeng(ceng1,ceng2,ceng3,file1,file2,file3,mubiaoPic,z_boss,c_boss,sleep1,sleep2);
                    file1.close();
                    file2.close();
                    file3.close();
                    mubiaoPic.recycle();
                    for (let j = 0; j < z_boss.length; j++) {
                        if (z_boss[j]) {
                            z_boss[j].recycle();
                        }
                    }
                    for (let k = 0; k < c_boss.length; k++) {
                        if (c_boss[k]) {
                            c_boss[k].recycle();
                        }
                        
                    }
                }
            } else if (index == 3) {
                ceng1 = _storage.get('niumo_1');
                ceng2 = _storage.get('niumo_2');
                ceng3 = _storage.get('niumo_3');
                sleep1 = 285 * 1000;
                sleep2 = 95 * 1000;
                if(ceng1 || ceng2 || ceng3) {

                    file1 = open('./tmp/putong/niumo1.txt','r');
                    file2 = open('./tmp/putong/niumo2.txt','r');
                    file3 = open('./tmp/putong/niumo3.txt','r');
                    mubiaoPic = images.read(_common_img_path+'map/niumo_button.png');
                    z_boss = [images.read(_common_img_path+'boss/putong/niumo_z_boss1.png'),
                              images.read(_common_img_path+'boss/putong/niumo_z_boss2.png'),
                              images.read(_common_img_path+'boss/putong/niumo_z_boss3.png')
                             ];
                    c_boss = [images.read(_common_img_path+'boss/putong/niumo_c_boss1.png'),
                              images.read(_common_img_path+'boss/putong/niumo_c_boss2.png')
                             ];

                    putongLoopCeng(ceng1,ceng2,ceng3,file1,file2,file3,mubiaoPic,z_boss,c_boss,sleep1,sleep2);
                    file1.close();
                    file2.close();
                    file3.close();
                    mubiaoPic.recycle();
                    for (let j = 0; j < z_boss.length; j++) {
                        if (z_boss[j]) {
                            z_boss[j].recycle();
                        }
                    }
                    for (let k = 0; k < c_boss.length; k++) {
                        if (c_boss[k]) {
                            c_boss[k].recycle();
                        }
                        
                    }
                }
            }
            click(1147,326);
            log('目标地图找怪完成,回城休息');
            sleep(2 * 1000);
            if (_storage.get('autoStoreResourece')) {
                storePackage(1);
            }
        }
    }catch(error){
        toastLog('发生系统异常');
        toastLog(error);
        _danger_signal_.set(1);
    }finally{

    }

}

function putongLoopCeng(ceng1,ceng2,ceng3,file1,file2,file3,mubiaoPic,z_boss,c_boss,sleep1,sleep2) {
    try {

        //先传入地图
        log('开始找传送按钮');
        click(1184,216);
        _swip_signal_.set(0);
        //设定地图图标
        _map_point =  {x:1175, y:101};
        _close_point = undefined;
        sleep(2000);
        //滑动
        swipe(width/2,height/2, width/2, height/2  - 140, 500);

        sleep(2000);
        //进入目标地图
        log('准备进入目标地图');
        var mubiao_button_point = _pic.findPointByPic(mubiaoPic,0.7);
        _mubiao_button.recycle();
        if (mubiao_button_point) {
            log('找到目标地图',mubiao_button_point);
            click(mubiao_button_point.x,mubiao_button_point.y);
            sleep(2000);
        } else{
            log('fuck,目标地图未找到,有问题了');
            return false;
        }

        //判断是否需要在一层找图
        if (ceng1) {
            currentcengloopfind(file1,z_boss,c_boss);
        }


        //打开地图
        log('打开地图');
        openMap();
        sleep(2000);

        log('准备从一层走到二层入口');
        click(917,224);
        //关闭地图
        log('关闭地图');
        closeMap();

        log('等待人物走到二层入口....');
        if (ceng1) {
            sleep(5 *1000);
        } else {
            sleep(sleep1);
        }
        
        log('人物已经走到二层入口');
        //点击进入2层
        let ceng2title = images.read(_common_img_path+'2cengtitle.png');
        click(637,286);
        sleep(2 * 1000);

        openMap();
        sleep(1.5 * 1000);
        var ceng2title_point = _pic.findPointByPic(ceng2title,0.1);
        closeMap();
        sleep(2* 1000);
        if (!ceng2title_point) {
            log('未能成功进入2层');
            return false;
        }

        if (ceng2) {
            currentcengloopfind(file2,z_boss,c_boss);
        }

         //打开地图
        log('打开地图');
        openMap();
        sleep(2000);
        
        click(917,224);
        //关闭地图
        log('关闭地图');
        closeMap();
        
        log('等待人物走到三层入口....');
        if (ceng2) {
            sleep(5 *1000);
        } else {
            sleep(sleep2);
        }
        log('人物已经走到三层入口');

        //点击进入3层
        let ceng3title = images.read(_common_img_path+'3cengtitle.png');
        click(637,286);
        sleep(2 * 1000);
        openMap();
        sleep(1.5 * 1000);
        var ceng3title_point = _pic.findPointByPic(ceng3title,0.1);
        closeMap();
        sleep(2* 1000);
        if (!ceng3title_point) {
            log('未能成功进入3层');
            return false;
        }
        if (ceng3) {
            currentcengloopfind(file3,z_boss,c_boss);
        }

    } catch (error) {
        
    } finally{

    }
}

function currentcengloopfind(file,z_boss,c_boss){
    let tps = file.readlines();
    let loopFlag = 0;
    let point = undefined;
    let loopCount = undefined;
    let beginTime = undefined;
    terminalTime =undefined;
    let breakFlag = false;
    let nextStepSleep = 0;
    for (row in tps){
        point = tps[row].split(',');
        if (loopFlag%5 == 0) {
            let startTime = new Date().getTime();
            var close1_point = _pic.findPointByPic(_close_button,0.9);
            if (close1_point) {
                click(close1_point.x,close1_point.y);
                log('close1')
            }
            
            let zhaohuan_point = _pic.findPointByPic(_zhaohuan_button,0.4);
            if (zhaohuan_point) {
                let randomTime = _storage.get('randomTime');
                let randomCallHero = _storage.get('randomCallHero');
                if(randomCallHero) {
                    if (_random_call_timestamp == 0) {
                        var later = Math.floor((Math.random()*randomTime)+1);
                        _random_call_timestamp = new Date().getTime() + later * 60 * 1000;
                        log('下次召唤英雄时间:',later,'分钟以后');
                    } else if (new Date().getTime() >= _random_call_timestamp) {
                        log('自动召唤英雄');
                        click(zhaohuan_point.x,zhaohuan_point.y);
                        _random_call_timestamp = 0 ;
                    }
                } else {
                    log('自动召唤英雄');
                    click(zhaohuan_point.x,zhaohuan_point.y);
                }

            }
            let endTime = new Date().getTime();
            log('关闭按钮查询耗时:',endTime - startTime,' 毫秒')
        }
        while(true){
            sleep(1000);
            log('打开地图');
            click(1175,101);
            sleep(1000);
            log('定位坐标');
            let x = point[0];
            let y = point[1];
            log(x+','+y);
            //double click
            press(x,y,2);
            press(x,y,2);
            sleep(1000);
            log('关闭地图');
            click(1099,93);
            log('等待角色走到指定点位');
            var seep = (point[2] * 1000 - 1500) < 0 ? 1000:point[2] * 1000 - 1500;
            beginTime = new Date().getTime();
            terminalTime = 0;
            breakFlag = false;
            if (nextStepSleep != 0) {
                seep = nextStepSleep;
            }
            if (seep >= 5 * 1000) {
                _find_thread = threads.start(function () {
                    findSpeic3(false,true,true, [], z_boss, c_boss,loopFlag)
                });
            }
            sleep(seep);
            if (seep < 5 * 1000) {
                let result  = findSpeic4(false,true,true, [], z_boss, c_boss);
                if (result == 0) {
                    loopCount++;
                } else{
                    loopCount = 0;
                }
                breakFlag = true;
            } else {
                if (_found_signal_.get() == 0) {
                    _find_thread.interrupt();
                    let result  = findSpeic4(false,true,true, [], z_boss, c_boss);
                    if (result == 0) {
                        loopCount++;
                    } else{
                        loopCount = 0;
                    }
                    // loopCount++;
                } else {
                    while (true) {
                        if (_found_signal_.get() == 1) {
                            sleep(5000);
                            continue;
                        } 
                        _find_thread.interrupt();
                        break;
                    }
                    loopCount = 0;
                }

                
                if (terminalTime == 0) {
                    breakFlag = true;
                } else {
                    let timediff = seep - (terminalTime - beginTime);
                    if (timediff >= 5000) {
                        nextStepSleep = timediff;
                        breakFlag  = false;
                    } else {
                        breakFlag = true;
                    }
                }
            }

            if (breakFlag) {
                nextStepSleep = 0;
                break;
            }
        }
        

        loopFlag++;
    }
}

function into3ceng(){
    
    let floor = _storage.get('hookLevel') + 1; 
    try{
        //去目标地图
        //传
        log('开始找传送按钮');
        click(1184,216);
        _swip_signal_.set(0);
        //设定地图图标
        _map_point =  {x:1175, y:101};
        _close_point = undefined;
        sleep(2000);
        //滑动
        swipe(width/2,height/2, width/2, height/2  - 140, 500);

        sleep(2000);
        //进入目标地图
        log('准备进入目标地图');
        var mubiao_button_point = _pic.findPointByPic(_mubiao_button,0.7);
        _mubiao_button.recycle();
        if (mubiao_button_point) {
            log('找到目标地图',mubiao_button_point);
            click(mubiao_button_point.x,mubiao_button_point.y);
            sleep(2000);
        } else{
            log('fuck,目标地图未找到,有问题了');

            var close_button_point = _pic.findPointByPic(_close_button,0.4);
            if (close_button_point) {
                log('找到关闭按钮',close_button_point);
                click(close_button_point.x,close_button_point.y);
                sleep(2000);
            } else {
                log('fuck,关闭按钮未找到,有问题了');
                //程序错误信号
                _danger_signal_.set(1);
                return;
            }

            return;
        }

        //一层
        if (floor == 1) {
            toastLog('恭喜,进入目标地图,稍后将会进入自动挂机状态');
            _auto_flag_.set(1);
            //开始挂机
            log('开始挂机');
            sleep(1000);
            click(1240,325);
            return true;
        }


        //打开地图
        log('打开地图');
        if (!openMap()) {
            toastLog('地图打开异常');
            _danger_signal_.set(1);
            return;
        }
        sleep(2000);

        log('准备从一层走到二层入口');
        click(917,224);
        //关闭地图
        log('关闭地图');
        if (!closeMap()) {
            toastLog('地图关闭异常');
            _danger_signal_.set(1);
            return;
        }

        log('等待人物走到二层入口....');
        sleep(_sleep1);
        log('人物已经走到二层入口');
        //点击进入2层
        let go_2ceng_button = images.read(_common_img_path+'go_2ceng_button.png');
        var go_2ceng_button_point = _pic.findPointByPic(go_2ceng_button,0.5);
        go_2ceng_button.recycle();
        if (go_2ceng_button_point) {
            log('找到[进入2层]按钮',go_2ceng_button_point);
            click(go_2ceng_button_point.x,go_2ceng_button_point.y);
            sleep(3000);
        } else{
            log('fuck,没找到[进入2层]按钮,有问题了');
            //程序错误信号
            _danger_signal_.set(1);
            return;
        }


        //二层
        if (floor == 2) {
            toastLog('恭喜,进入目标地图,稍后将会进入自动挂机状态');
            _auto_flag_.set(1);
            //开始挂机
            log('开始挂机');
            sleep(1000);
            click(1240,325);
            return true;
        }

        //打开地图
        log('打开地图');
        if (!openMap()) {
            toastLog('地图打开异常');
            _danger_signal_.set(1);
            return;
        }
        sleep(2000);
        
        click(917,224);
        //关闭地图
        log('关闭地图');
        if (!closeMap()) {
            toastLog('地图关闭异常');
            _danger_signal_.set(1);
            return;
        }
        
        log('等待人物走到三层入口....');
        sleep(_sleep2);
        log('人物已经走到三层入口');

        //点击进入3层
        let go_3ceng_button = images.read(_common_img_path+'go_3ceng_button.png');
        var go_3ceng_button_point = _pic.findPointByPic(go_3ceng_button,0.7);
        go_3ceng_button.recycle();
        if (go_3ceng_button_point) {
            log('找到[进入3层]按钮',go_3ceng_button_point);
            click(go_3ceng_button_point.x,go_3ceng_button_point.y);
            sleep(2000);
        } else{
            log('fuck,没找到[进入3层]按钮,有问题了');
            //程序错误信号
            _danger_signal_.set(1);
            return;
        }

        //3层
        if (floor == 3) {
            toastLog('恭喜,进入目标地图,稍后将会进入自动挂机状态');
            _auto_flag_.set(1);
            //开始挂机
            log('开始挂机');
            sleep(1000);
            click(1240,325);
            return;
        }


    } catch (error) {
        toastLog('发生系统异常');
        toastLog(error);
        _danger_signal_.set(1);
    }
}
function isSecurity(){
    var security1_point = _pic.findPointByPic(_security1_label,0.7);
    var security2_point = _pic.findPointByPic(_security2_label,0.7);
    if(security1_point || security2_point){
        return true;

    } else{
        return false;
    }

}

function checkCommon() {
    
    setInterval(function (){
        if (_swip_signal_.get() == 1) {
            return;
        }
        _swip_signal_.set(2);
        //人物死亡check
        let fuhuo_img = images.read(_common_img_path+'fuhuo_label.png');
        let fuhuo_point = _pic.findPointByPic(fuhuo_img,0.1);
        fuhuo_img.recycle();
        if (fuhuo_point) {
            log('fuck,被杀了,赶紧复活',new Date());
    
            click(fuhuo_point.x,fuhuo_point.y);
            _swip_signal_.set(0);
            _kill_count.set(_kill_count.get() + 1);
            return true;
        }

        if (isSecurity()) {
            log('fuck,被打回来了',new Date());
            //自动挂机主进程
            if (_auto_hook_thread) {
                _auto_hook_thread.interrupt();
            }
            _auto_hook_thread = threads.start(autoHook);
            _swip_signal_.set(0);
            
            return true;
        }
    
        let zhaohuan_point = _pic.findPointByPic(_zhaohuan_button,0.4);
        if (zhaohuan_point) {

            let randomTime = _storage.get('randomTime');
            let randomCallHero = _storage.get('randorandomCallHeromTime');
            if (_auto_flag_.get() == 1 && randomCallHero) {

                if (_random_call_timestamp == 0) {
                    var later = Math.floor((Math.random()*randomTime)+1);
                    _random_call_timestamp = new Date().getTime() + later * 60 * 1000;
                    log('下次召唤英雄时间:',later,'分钟以后');
                } else if (new Date().getTime() >= _random_call_timestamp) {
                    log('自动召唤英雄');
                    click(zhaohuan_point.x,zhaohuan_point.y);
                    _random_call_timestamp = 0 ;
                    }

            } else {
                log('自动召唤英雄');
                click(zhaohuan_point.x,zhaohuan_point.y);
            }
            sleep(2000);
        }

        if (_auto_flag_.get() == 1) {
            var hook_point = _pic.findPointByPic(_auto_hook_button,0.9);
            if (hook_point ) {
                log('断网,重新挂机',hook_point);
                click(hook_point.x,hook_point.y);
            }
        }
        _swip_signal_.set(0); 
    }, 30 * 1000);



}

function speicCheck() {

    try {

        let fuhuo_img = images.read(_common_img_path+'fuhuo_label.png');
        let fuhuo_point = _pic.findPointByPic(fuhuo_img,0.1);
        fuhuo_img.recycle();
        if (fuhuo_point) {
            log('fuck,被杀了,赶紧复活',new Date());

            click(fuhuo_point.x,fuhuo_point.y);
            
            if (_auto_hook_thread) {
                _auto_hook_thread.interrupt();
            }
            _auto_hook_thread = threads.start(autoHook);
            if (_find_thread) {
                _find_thread.interrupt();
            }
            return false;
        }

        if (isSecurity()) {
            log('fuck,被打回来了',new Date());
            //自动挂机主进程
            if (_auto_hook_thread) {
                _auto_hook_thread.interrupt();
            }
            _auto_hook_thread = threads.start(autoHook);
            if (_find_thread) {
                _find_thread.interrupt();
            }
            return false;
        }

    }finally{
    }
}

function initHookImage(){
    let target = _storage.get('hookTarget');
    log('target=',target);

    switch (target) {
        case 0: 
            _mubiao_button = images.read(_common_img_path+'map/woma_button.png');
            _sleep1 = 225*1000;
            _sleep2 = 185*1000;
            break;
        case 1: 
            _mubiao_button = images.read(_common_img_path+'map/womadong_button.png');
            _sleep1 = 225*1000;
            _sleep2 = 185*1000;
            break;
        case 2: 
            _mubiao_button = images.read(_common_img_path+'map/womaxi_button.png');
            _sleep1 = 225*1000;
            _sleep2 = 185*1000;
            break;
        case 3: 
            _mubiao_button = images.read(_common_img_path+'map/dilao_button.png');
            _sleep1 = 150*1000;
            _sleep2 = 95*1000;
            break;
        case 4: 
            _mubiao_button = images.read(_common_img_path+'map/dilaodong_button.png');
            _sleep1 = 150*1000;
            _sleep2 = 95*1000;
            break;
        case 5: 
            _mubiao_button = images.read(_common_img_path+'map/shimu_button.png');
            _sleep1 = 75*1000;
            _sleep2 = 135*1000;
            break;
        case 6: 
            _mubiao_button = images.read(_common_img_path+'map/shimudong_button.png');
            _sleep1 = 75*1000;
            _sleep2 = 135*1000;
            break;
        case 7: 
            _mubiao_button = images.read(_common_img_path+'map/zuma_button.png');
            _sleep1 = 60*1000;
            _sleep2 = 150*1000;
            break;
        case 8: 
            _mubiao_button = images.read(_common_img_path+'map/gumo_button.png');
            _sleep1 = 105*1000;
            _sleep2 = 145*1000;
            break;

        case 9: 
            _mubiao_button = images.read(_common_img_path+'map/niumo_button.png');
            _sleep1 = 285*1000;
            _sleep2 = 95*1000;
            break;
        case 10: 
            _mubiao_button = images.read(_common_img_path+'map/chiyue_button.png');
            _sleep1 = 285*1000;
            _sleep2 = 155*1000;
            break;
    }
}

function initElement(){

    let target = _storage.get('hookElement');
    switch(target){

        case 0: 
            _element_ = 11;
            break;
        case 1: 
            _element_ = 12;
            break;
        case 2: 
            _element_ = 13;
            break;
        case 3: 
            _element_ = 21;
            break;
        case 4: 
            _element_ = 22;
            break;
        case 5: 
            _element_ = 23;
            break;
        case 6: 
            _element_ = 31;
            break;
        case 7: 
            _element_ = 32;
            break;
        case 8: 
            _element_ = 41;
            break;
        case 9: 
            _element_ = 42;
            break;
        case 10: 
            _element_ = 51;
            break;
        case 11: 
            _element_ = 61;
            break;
        case 12: 
            _element_ = 71;
            break;
        case 13: 
            _element_ = 81;
            break;
        case 14: 
            _element_ = 91;
            break;
        case 15: 
            _element_ = 101;
            break;  
        case 16: 
            _element_ = 111;
            break; 
        case 17: 
            _element_ = 121;
            break;  
    }
}

function autoHook(){
    _swip_signal_.set(1);
        _pic.findPointByPic(_close_button,0.7,2);
        sleep(1000);
        _pic.findPointByPic(_return_city_button,0.7,2);
        sleep(1000);
        click(width - 10,height - 10);
        
        
        if (_storage.get('autoStoreResourece')) {
            toastLog('背包存储完后开始挂机');
            storePackage(4);
            sleep(2*1000);
        } else {
            toastLog('10秒后开始挂机');
            sleep(10*1000);
        }
        
        //0 还未开始挂机 1开始挂机
        _auto_flag_.set(0);
        let mode = _storage.get('hookMode');
        let killCount = _storage.get('killCount');
        log('击杀基准',Number(killCount))
        log('被击杀次数',Number(_kill_count.get()))
        if (Number(killCount) <= Number(_kill_count.get())) {
            if (mode == '元素') {
                mode = '普通';
            } else {
                mode = '元素';
            }
            _kill_count.set(0);
        }
        log('mode:',mode);
        switch(mode){
            case '普通':
                initHookImage();
                putongloophookjudge();
                break;
            case '占领':
                intozhanling();
                break;
            case '野果':
                intoelementfruit();
                break;
            case '奶牛':
                intoCow();
                break;
            case '元素':
                initElement();
                intoElement();
                break;
            case '特殊':
                intoMolong();
                break;
        }

}

function storePackage(type){
    
    //加载图片
    let resources = [];
    if (type == 1) {
        //祖玛-牛魔
        resources = [
            images.read(_common_img_path+'store/chaohuo.png'),
            images.read(_common_img_path+'store/chaopao.png'),
            images.read(_common_img_path+'store/gaohuo.png'),
            images.read(_common_img_path+'store/gaopao.png'),
            images.read(_common_img_path+'store/junlin.png'),
            images.read(_common_img_path+'store/bikong.png'),
            images.read(_common_img_path+'store/nainiu.png'),
            images.read(_common_img_path+'store/suiji.png'),
            images.read(_common_img_path+'store/tianpeng.png'),
            images.read(_common_img_path+'store/zhonghuo.png'),
            images.read(_common_img_path+'store/zhongpao.png'),

            images.read(_common_img_path+'store/zibaos.png'),
            images.read(_common_img_path+'store/hongbaos.png'),
            images.read(_common_img_path+'store/lvbaos.png'),
            images.read(_common_img_path+'store/chengbaos.png'),
            images.read(_common_img_path+'store/baibaos.png')
        ];
        
    } else if (type == 2) {
        //魔龙-e7
        resources = [
            images.read(_common_img_path+'store/chaohuo.png'),
            images.read(_common_img_path+'store/chaopao.png'),
            images.read(_common_img_path+'store/chiyan.png'),
            images.read(_common_img_path+'store/gaohun.png'),
            images.read(_common_img_path+'store/gaohuo.png'),
            images.read(_common_img_path+'store/gaopao.png'),
            images.read(_common_img_path+'store/hanfu.png'),
            images.read(_common_img_path+'store/hongguo.png'),
            images.read(_common_img_path+'store/huancai.png'),
            images.read(_common_img_path+'store/miji.png'),
            images.read(_common_img_path+'store/nainiu.png'),
            images.read(_common_img_path+'store/suiji.png'),
            images.read(_common_img_path+'store/zhonghun.png'),
            images.read(_common_img_path+'store/zhonghuo.png'),
            images.read(_common_img_path+'store/zhongpao.png'),
            images.read(_common_img_path+'store/zhuzi.png'),

            images.read(_common_img_path+'store/zibaos.png'),
            images.read(_common_img_path+'store/hongbaos.png'),
            images.read(_common_img_path+'store/lvbaos.png'),
            images.read(_common_img_path+'store/chengbaos.png'),
            images.read(_common_img_path+'store/baibaos.png')
        ];
    } else if (type == 3) {
        //e1-e5
        resources = [
            images.read(_common_img_path+'store/yeguo.png'),
            images.read(_common_img_path+'store/zibaos.png'),
            images.read(_common_img_path+'store/hongbaos.png'),
            images.read(_common_img_path+'store/lvbaos.png'),
            images.read(_common_img_path+'store/chengbaos.png'),
            images.read(_common_img_path+'store/baibaos.png')
        ];
    } else if (type == 4) {
        //all
        resources = [
            images.read(_common_img_path+'store/chaohuo.png'),
            images.read(_common_img_path+'store/chaopao.png'),
            images.read(_common_img_path+'store/chiyan.png'),
            images.read(_common_img_path+'store/gaohun.png'),
            images.read(_common_img_path+'store/gaohuo.png'),
            images.read(_common_img_path+'store/gaopao.png'),
            images.read(_common_img_path+'store/hanfu.png'),
            images.read(_common_img_path+'store/hongguo.png'),
            images.read(_common_img_path+'store/huancai.png'),
            images.read(_common_img_path+'store/miji.png'),
            images.read(_common_img_path+'store/nainiu.png'),
            images.read(_common_img_path+'store/suiji.png'),
            images.read(_common_img_path+'store/zhonghun.png'),
            images.read(_common_img_path+'store/zhonghuo.png'),
            images.read(_common_img_path+'store/zhongpao.png'),
            images.read(_common_img_path+'store/zhuzi.png'),
            images.read(_common_img_path+'store/yeguo.png'),
            images.read(_common_img_path+'store/junlin.png'),
            images.read(_common_img_path+'store/bikong.png'),
            images.read(_common_img_path+'store/tianpeng.png'),

            images.read(_common_img_path+'store/zibaos.png'),
            images.read(_common_img_path+'store/hongbaos.png'),
            images.read(_common_img_path+'store/lvbaos.png'),
            images.read(_common_img_path+'store/chengbaos.png'),
            images.read(_common_img_path+'store/baibaos.png')
        ];
    }
    
    log('打开背包');
    click(1094,158);
    sleep(1.5 * 1000);
    // log('点击整理');
    click(1164,689);
    sleep(1.5 * 1000);
    // log('点击全部');
    click(799,105);
    sleep(1.5 * 1000);
    log('点击仓库')
    click(988,692);
    sleep(1.5 * 1000);
    // log('点击快速存入')
    click(1160,688);
    sleep(1.5 * 1000);
    let flag = true;
    for (let i = 0; i<4; i++ ) {
        //查询物品
        flag = findResourceAndStore(resources,flag);
        //滑动
        swipe(1070,336,999,336,1 * 1000);
        sleep(2000);
    }
    swipe(1070,336,999,336,1 * 1000);
    sleep(1500);
    // log('取消快速存入')
    click(1160,688);
    sleep(1.5 * 1000);
    // log('关闭仓库');
    click(988,692);
    sleep(1.5 * 1000);
    log('关闭背包');
    click(1238,34);

    for (let j = 0 ; j < resources.length; j++) {
        resources[j].recycle();
    }
    sleep(1 * 1000);

}

function findResourceAndStore(resources,flag){

    let points = [];
    points = _pic.findPointByPic(resources, 0.9,5);
    for (let i = 0 ; i < points.length; i++) {
        click(points[i].x,points[i].y);
        if (flag) {
            sleep(1500);
            let img = images.read(_common_img_path+'store/storepackage.png');
            let point = _pic.findPointByPic(img, 0.1);
            img.recycle();
            if (point) {
                click(point.x,point.y)
                sleep(1500);
                // log('点击快速存入');
                click(1160,688);
            }
            flag = false;
        }
        sleep(1500);
        //click整理
        click(265,681);
        sleep(1500);
    }
    return flag;
}


module.exports = _service;