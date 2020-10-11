let b1 = images.read('/sdcard/Pictures/boss/hooking.png');
let b2 = images.read('/sdcard/Pictures/boss/auto_hook_button.png');

//640 190

if (!requestScreenCapture(true)) {
    toastLog("请求截图失败");
    exit()
}
sleep(5* 1000);
while (true) {
    sleep(5 * 1000);
    let p = findPointByPic(b1,0.1);
    
    let p1 = findPointByPic(b2,0.1);
    // let p2 = images.findImage(img, b2,{threshold:0.8} );
    // let cp = images.findImage(img, c,{threshold:0.4} );
    // log('p1',p1);
    // log('p2',p2);
    if (p != null ) {
        toastLog('挂机中')
        log('p3',p);
    }
    if (p1 != null ) {
        toastLog('未挂机')
        log('p3',p1);
    }
    
}


function findPointByPic (comparePic, threshold,type){
   //type == 1  color flg type==2 click type == 0 or undefined find
   var if_img = captureScreen()
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
               log('found',point)
               log('found index:',i)
               return point;
           }
       }
       log('not found')
       return null;

   } else {
       var point = images.findImage(if_img, comparePic,{threshold: threshold})
       return point
   }

}