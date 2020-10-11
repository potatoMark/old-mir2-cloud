var _xiao_mj = {};
_xiao_mj.start_xiao_mj = function () {
    try {
        toastLog('5s后开始小秘境试炼');
        _xiao_mj_thread = threads.start(xiaomijing);
        
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

_xiao_mj.stop_xiao_mj = function () {
    try {
        _xiao_mj_thread.interrupt();
        toastLog('小秘境试炼已经被关闭');
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

function getTargetButtonImage(){
    let into_level = _storage.get('intoLevel');//进入等级
    switch(into_level){
        case 0:
            _mj_target  = images.read(_common_img_path+'mj/30_level.png');
            _mj_page = 1;
            _mj_tp = {x:201,y:248};
            log(30);
            break;
        case 1:
            _mj_target  = images.read(_common_img_path+'mj/45_level.png');
            _mj_page = 1;
            _mj_tp = {x:508,y:251};
            log(45);
            break;
        case 2:
            _mj_target  = images.read(_common_img_path+'mj/80_level.png');
            _mj_page = 1;
            _mj_tp = {x:197,y:317};
            log(80);
            break;
        case 3:
            _mj_target  = images.read(_common_img_path+'mj/105_level.png');
            _mj_page = 1;
            _mj_tp = {x:511,y:322};
            log(105);
            break;
        case 4:
            _mj_target  = images.read(_common_img_path+'mj/120_level.png');
            _mj_page = 1;
            _mj_tp = {x:197,y:382};
            log(120);
            break;
        case 5:
            _mj_target  = images.read(_common_img_path+'mj/135_level.png');
            _mj_page = 2;
            _mj_tp = {x:201,y:248};
            log(135);
            break;
        case 6:
            _mj_target  = images.read(_common_img_path+'mj/155_level.png');
            _mj_page = 2;
            _mj_tp = {x:508,y:251};
            log(155);
            break;
        case 7:
            _mj_target  = images.read(_common_img_path+'mj/185_level.png');
            _mj_page = 2;
            _mj_tp = {x:197,y:317};
            log(185);
            break;
        case 8:
            _mj_target  = images.read(_common_img_path+'mj/200_level.png');
            _mj_page = 2;
            _mj_tp = {x:511,y:322};
            log(200);
            break;
        case 9:
            _mj_target  = images.read(_common_img_path+'mj/245_level.png');
            _mj_page = 3;
            _mj_tp = {x:197,y:317};
            log(245);
            break;
        case 10:
            _mj_target  = images.read(_common_img_path+'mj/320_level.png');
            _mj_page = 3;
            _mj_tp = {x:511,y:322};
            log(320);
            break;
        case 11:
            _mj_target  = images.read(_common_img_path+'mj/350_level.png');
            _mj_page = 3;
            _mj_tp = {x:197,y:317};
            log(320);
            break;


            
    }

}
function xiaomijing(){
    let daily_task_button = images.read(_common_img_path+'task/daily_task_button.png');
    let daily_mj = images.read(_common_img_path+'mj/daily_mj.png');
    let mj_finish = images.read(_common_img_path+'mj/mj_finish.png');
    let lijiqianwang_button = images.read(_common_img_path+'task/lijiqianwang_button.png');
    sleep(5 * 1000);
    let into_type = _storage.get('xiaoMjMethod');//进入方式 0 金币 1凭证
    getTargetButtonImage();
    try {
        while(true) {
            log('点开任务');
            click(95,204);
            sleep(1500);
            log('点击[每日任务]');
            _pic.findPointByPic(daily_task_button,0.7,2);
            sleep(1500);
    
            log('点击[每日秘境试炼]');
            var daily_mj_point = _pic.findPointByPic(daily_mj,0.7);
            if (daily_mj_point == null) {
                toastLog('未找到每日小秘境试炼,任务模式自动关闭');
                _pic.findPointByPic(_close_button,0.7,2);
                break;
            }
            click(daily_mj_point.x,daily_mj_point.y);
            sleep(1500);
            log('点击[立即前往]');
            _pic.findPointByPic(lijiqianwang_button,0.7,2);
            sleep(1500);

            log('点击[我要进入秘境]');
            click(179,397);
            sleep(1500);
            //选择秘境
            log('选择秘境类型[凭证or金币]');
            if (into_type == 1) {
                log('凭证');
                click(161,321);
            } else {
                log('金币');
                click(482,325);
            }
            sleep(1000);
            //选择等级
            for (var i = 1; i < _mj_page; i++) {
                log('点击下一页');
                click(401,385);
                sleep(1500);
            }
            log('点击小秘境目标');
            click(_mj_tp.x,_mj_tp.y);
            sleep(1500);
            log('点击进入秘境');
            click(162,384);
            sleep(2 * 1000);
            if (isSecurity()) {
                toastLog('未能进入小秘境地图,任务模式自动关闭');
                break;
            }
            //点击自动挂机
            // toastLog('点击自动挂机');
            // click(1240,325);
            let i = 0;
            while(true){
                sleep(10* 1000);
                if (into_type == 1) {
                     if (i >= 16) {
                        toastLog('8分钟时间到,小秘境试炼结束');
                        sleep(1000);
                        log('尝试查找快捷栏回城石,并点击');
                        click(1138,328);
                        break;
                     }
                     var hook_point = _pic.findPointByPic(_auto_hook_button,0.9);
                     if (hook_point ) {
                         log('找到挂机按钮',hook_point);
                         click(hook_point.x,hook_point.y);
                     }
                     i++;
                } else {
                    var mj_finish_point = _pic.findPointByPic(mj_finish,0.8);
                    if (mj_finish_point) {
                        toastLog('小秘境试炼完成');
                        sleep(1000);
                        log('尝试查找快捷栏回城石,并点击');
                        click(1138,328);
                        break;
                    }
                    var hook_point = _pic.findPointByPic(_auto_hook_button,0.9);
                    if (hook_point ) {
                        log('找到挂机按钮',hook_point);
                        click(hook_point.x,hook_point.y);
                    }
                }

            }
            sleep(2 * 1000);
        }
    } catch (error) {
        toastLog(error);
    } finally{
        daily_task_button.recycle();
        daily_mj.recycle();
        mj_finish.recycle();
        lijiqianwang_button.recycle();
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

module.exports = _xiao_mj;