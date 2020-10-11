importClass(android.os.Environment);
importClass(android.net.Uri);
importClass(android.app.DownloadManager);
let uri = "http://s9.pstatp.com/package/apk/news_article_lite/news_article_lite_wap_test_lite_1_v7.1.5_91d50e5.apk?v=1569477894";
let request = new DownloadManager.Request(Uri.parse(uri));
request.setDestinationInExternalPublicDir("/download/", "今日头条.apk");
request.setAllowedOverRoaming(false);
request.setAllowedOverMetered(true); //默认是允许的。
request.setTitle("今日头条");  
request.setDescription("今日头条正在下载"); 
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
    log("下载进度:"+Math.ceil(bytes_downloaded/totalSize*100)+"%");
    let status = cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS));
    if (status == DownloadManager.STATUS_SUCCESSFUL){
        toastLog("下载已完成");
        clearInterval(st);//取消定时器
        }
}, 1500);


