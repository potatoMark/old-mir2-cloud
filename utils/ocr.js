var _ocr = {}
_ocr.fonts = function (img, is位置) {

    var imag64 = images.toBase64(img, "png", 100);
    var API_Key = "G40f1b5EyyY3GFnhOtDukK5c";
    var Secret_Key = "X8fvLuEZM3LC20tIgSchMzWh4HB6pjGW";

    var getTokenUrl = "https://aip.baidubce.com/oauth/2.0/token";
    //token获取地址。
    var token_Res = http.post(getTokenUrl, {
        grant_type: "client_credentials",
        client_id: API_Key,
        client_secret: Secret_Key,
    });

    var token = token_Res.body.json().access_token;
    var ocrUrl1 = "https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic"; //每天可用5000次。
    //文字识别。
    var ocrUrl2 = "https://aip.baidubce.com/rest/2.0/ocr/v1/general"; //每天可用500次。
    //含位置信息。
    var ocrUrl = ocrUrl1;
    if (is位置) {
        ocrUrl = ocrUrl2;
    };
    var ocr_Res = http.post(ocrUrl, {
        headers: {
            "Content - Type": "application/x-www-form-urlencoded"
        },
        access_token: token,
        image: imag64,
    });

    var json = ocr_Res.body.json();
    //log(json);
    return json;
};

_ocr.location = function (img, keyWords) {
    var result =  _ocr.fonts(img,true)
    log('',result.words_result)
    for(var i=0;i< result.words_result.length; i++  ){
        var font = result.words_result[i]
        if (font) {
            var str = font.words

            for(var j=0;j< keyWords.length; j++  ){
                var keyWord = keyWords[j]
                var reg = new RegExp(keyWord);
                if(str.match(reg)){
                    return font.location
                }
            }


        }
    }
}

module.exports = _ocr;

