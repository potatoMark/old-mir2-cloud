
var _pic = {};

_pic.capScreen = sync(function (){
    return captureScreen()
})
_pic.findPointByPic = sync(function (comparePic, threshold,type){
    //type == 1  color, type==2 click, type == 3 mulipty pic find, type == 0 or undefined find
    var if_img = _pic.capScreen()
    if (type == 1) {
        var point = images.findColor(if_img, comparePic)
        return point
    } else if (type == 2) {
        var point = images.findImage(if_img, comparePic,{threshold: threshold})
        if (point) {
            log('found',point)
            click(point.x,point.y)
        } else{
            log('not found')
        }
    } else if (type == 3) {
        for (var i= 0; i < comparePic.length; i++) {
            var point = images.findImage(if_img, comparePic[i],{threshold: threshold})
            if(point != null) {
                log('found',point,i)
                return point;
            }
        }
        // log('not found')
        return null;

    } else if (type == 4) {

        var point = images.findImageInRegion(if_img, comparePic,threshold[0],threshold[1],threshold[2],threshold[3],threshold[4]);
        return point;
    } else if (type == 5) {
        let points = [];
        for (var i= 0; i < comparePic.length; i++) {
            var point = images.findImage(if_img, comparePic[i], {
                region: [710, 140],
                threshold: threshold
            })
            if(point != null) {
                points.push({   
                            x:point.x + ( comparePic[i].getWidth() / 2 ),
                            y:point.y + ( comparePic[i].getHeight() / 2 )
                        });
            }
        }
        return points;
    } else {
        var point = images.findImage(if_img, comparePic,{threshold: threshold})
        return point
    }

})

_pic.matchTemplateByPic = sync(function (comparePic, options){
    var if_img = _pic.capScreen()
    var matchingResult = images.matchTemplate(if_img, comparePic,options)
    return matchingResult
})

_pic.findPointByPicClick = sync(function (comparePic, threshold){
    var point = _pic.findPointByPic(comparePic,threshold)
    if (point) {
        log('found',point)
        click(point.x,point.y)
    } else{
        log('not found')
    }

})

_pic.findPointByPicWhileClick = sync(function (comparePic, threshold, wait){
    if (!wait) {
        wait = 2000
    }
    while (true) {
        var point = _pic.findPointByPic(comparePic,threshold)
        if (point) {
            log('found',point)
            click(point.x,point.y)
            sleep(wait)
            break;
        }   
        log('not found')
        sleep(wait)
    }
})

_pic.findPointByPicWhile = sync(function (comparePic, threshold, wait){
    if (!wait) {
        wait = 2000
    }
    while (true) {
        var point = _pic.findPointByPic(comparePic,threshold)
        if (point) {
            log('found',point)
            return point
        }
        log('not found')
        sleep(wait)
    }
})

_pic.findPointByPicWhileNotCapture = sync(function (img,comparePic, threshold, wait){
    if (!wait) {
        wait = 2000
    }
    while (true) {
        var point = images.findImage(img, comparePic,{threshold: threshold})
        if (point) {
            log('found',point)
            return point
        }
        log('not found')
        sleep(wait)
    }
})

module.exports = _pic;