var _random = {};

function random() {
    while(true){
        sleep(500);
        click(1135,538);
        let now = new Date();
        let minutes = now.getMinutes();
        if (minutes >= 35) {
            toastLog('随机活动已经结束');
            break;
        }
    }

}

_random.start_fly = function () {
    try {
        //查找随机按钮
        // _random_button_point = _pic.findPointByPic(_random_button,0.7);
        // if (_random_button_point == null) {
        //     toastLog('未找到随机按钮,程序异常');
        //     return false;
        // }
        _random_thread = threads.start(random);

        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}

_random.stop_fly = function () {
    try {
        _random_thread.interrupt();
        toastLog('关闭自动随机辅助');
        return true;
    } catch (error) {
        toastLog(error);
        return false;
    }
}


module.exports = _random;