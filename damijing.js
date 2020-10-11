var _da_mj = {};
_da_mj.start_da_mj = function () {
    try {
        toastLog('5s后开始大秘境试炼');
        _da_mj_thread = threads.start(damijing);
        
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

_da_mj.stop_da_mj = function () {
    try {
        _da_mj_thread.interrupt();
        toastLog('大秘境试炼已经被关闭');
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

function damijing(){
    sleep(5 * 1000);
    let into_type = _storage.get('daMjMethod');//进入方式 0 双倍 1十倍
    let onlyplayfirstone = _storage.get('onlyplayfirstone');
    let isPlayPassed = _storage.get('playPassedLevel');
    try {
        while(true) {

            //找到活动按钮并点击
            log('开始查找活动按钮');
            click(883,36);
            sleep(1500);
            //找到第二个活动按钮
            click(791,124);
            sleep(1500);
            log('点击[大秘境]]');
            click(139,341);
            sleep(1500);
            log('点击[进入]]');
            click(1130,664);
            sleep(1500);

            //判断是否打通过的关卡
            if (isPlayPassed) {
                log('点击[关卡选择]');
                click(482,116);
                sleep(1500);
                if (onlyplayfirstone) {
                    //356 156
                    for (let i = 0; i<4; i++){
                        swipe(356,156,356,720,random(1000,2000));
                        sleep(random(500,1000));
                    }
                }
                log('点击[选择关卡]');
                click(372,161);
                sleep(1500);
            }

            if (into_type == 2) {
                log('点击[十倍秘境]');
                click(350,575);
            } else if (into_type == 1) {
                log('点击[双倍秘境]]');
                click(75,575);
            }
            sleep(1500);
            log('点击[进入秘境]]');
            click(397,672);
            sleep(1500);
            //尝试做两次关闭操作
            var matchingResult = _pic.matchTemplateByPic(_close_button, {threshold:0.7, max:10});
            result = matchingResult.sortBy('left');
            for (var i = 0;i<result.matches.length;i++) {
                var p = result.matches[i].point;
                click(p.x,p.y);
                sleep(1000);
            }

            if (isSecurity()) {
                toastLog('程序异常,大秘境自动关闭');
                break;
            }

            while(true){
                sleep(10 * 1000);
                if(isSecurity()) {
                    toastLog('开始下一轮大秘境试炼');
                    break;
                }
                var hook_point = _pic.findPointByPic(_auto_hook_button,0.9);
                if (hook_point ) {
                    log('找到挂机按钮',hook_point);
                    click(hook_point.x,hook_point.y);
                }
            }
            sleep(2 * 1000);
        }
    } catch (error) {
        toastLog(error);
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

module.exports = _da_mj;