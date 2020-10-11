var _task = {};
_task.start_daily_task = function () {
    try {
        toastLog('5s后开始日常任务试炼');
        _daily_task_tread = threads.start(dailyTask);
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

_task.stop_daily_task = function () {
    try {
        _daily_task_tread.interrupt();
        toastLog('关闭自动试炼任务');
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

function dailyTask(){

    let daily_task_button = images.read(_common_img_path+'task/daily_task_button.png');
    let first_do_task1_button = images.read(_common_img_path+'task/first_do_task1_button.png');
    let first_do_task2_button = images.read(_common_img_path+'task/first_do_task2_button.png');
    let lijiqianwang_button = images.read(_common_img_path+'task/lijiqianwang_button.png');
    let task_finish_button = images.read(_common_img_path+'task/task_finish_button.png');

    sleep(5 * 1000);
    let w  = Math.max(device.width, device.height);
    let h = Math.min(device.width, device.height);
    try {
        while(true) {
            log('点开任务');
            click(95,204);
            sleep(1500);
            log('点击[每日任务]');
            _pic.findPointByPic(daily_task_button,0.7,2);
            sleep(1700);
    
            log('点击[每日试炼]');
            var daily_task1_point = _pic.findPointByPic(first_do_task1_button,0.9);
            var daily_task2_point = _pic.findPointByPic(first_do_task2_button,0.9);
            if (!daily_task1_point && !daily_task2_point) {
                    toastLog('未找到试炼任务,任务模式自动关闭');
                    sleep(1000);
                    _pic.findPointByPic(_close_button,0.7,2);
                    break;
            }
            if(daily_task1_point) {
                click(daily_task1_point.x,daily_task1_point.y);
            }else if(daily_task2_point) {
                click(daily_task2_point.x,daily_task2_point.y);
            }
            sleep(2000);
            log('点击[立即前往]');
            _pic.findPointByPic(lijiqianwang_button,0.7,2);
            sleep(2500);
            //判断是否还在土城
            var r = isSecurity();
            var P = _pic.findPointByPic(_auto_hook_button,0.9);
            //还在土城,则需要领取任务
            if (r && P) {
                log('点击[领取任务]');
                click(126,389);
                sleep(1500);
                log('点开任务2');
                click(95,204);
                sleep(1500);
                log('点击[每日任务]');
                _pic.findPointByPic(daily_task_button,0.7,2);
                sleep(1700);
    
                log('点击[每日试炼]2');
                var daily_task1_point = _pic.findPointByPic(first_do_task1_button,0.9);
                var daily_task2_point = _pic.findPointByPic(first_do_task2_button,0.9);
                if (!daily_task1_point && !daily_task2_point) {
                    toastLog('未找到试炼任务,任务模式自动关闭');
                    sleep(1000);
                    _pic.findPointByPic(_close_button,0.7,2);
                    break;
                }           
                if(daily_task1_point) {
                    click(daily_task1_point.x,daily_task1_point.y);
                }else if(daily_task2_point) {
                    click(daily_task2_point.x,daily_task2_point.y);
                }
    
                sleep(2000);
                log('点击[立即前往]');
                _pic.findPointByPic(lijiqianwang_button,0.7,2);
            }
            log('等待任务完成');
            while(true){
                sleep(30 * 1000);
                var task_finish_button_point = _pic.findPointByPic(task_finish_button,0.7);
                if (task_finish_button_point) {
                    toastLog('任务完成,回城交差');
                    click(task_finish_button_point.x,task_finish_button_point.y);
                    sleep(3000);
    
                    log('点击[任务提交]');
                    click(126,389);
                    sleep(3000);
                    log('点击[确定],领取奖励');
                    click(w - 50, h -50);
                    break;
                }
                //死亡check
                let fuhuo_img = images.read(_common_img_path+'fuhuo_label.png');
                let fuhuo_point = _pic.findPointByPic(fuhuo_img,0.1);
                fuhuo_img.recycle();
                if (fuhuo_point) {
                    log('fuck,被杀了,赶紧复活',new Date());
                    click(fuhuo_point.x,fuhuo_point.y);
                    break;
                }
                //
                if (isSecurity()) {
                    log('被打回城,继续任务');
                    break;
                }
                let zhaohuan_point = _pic.findPointByPic(_zhaohuan_button,0.4);
                if (zhaohuan_point) {
                    log('自动召唤英雄');
                    click(zhaohuan_point.x,zhaohuan_point.y);
                    sleep(1000);
                }
                
                var hook_point = _pic.findPointByPic(_auto_hook_button,0.9);
                if (hook_point ) {
                    log('找到挂机按钮',hook_point);
                    click(hook_point.x,hook_point.y);
                }
                log('任务还未完成,继续等待...');
            }
            sleep(2 * 1000);
        }
    } catch (error) {
        toastLog(error);
    }finally{
        
        daily_task_button.recycle();
        first_do_task1_button.recycle();
        first_do_task2_button.recycle();
        lijiqianwang_button.recycle();
        task_finish_button.recycle();
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

module.exports = _task;