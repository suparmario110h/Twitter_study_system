/////////////////////////////////////////////////////////////////////////////////////
// 認証用インスタンスの生成
/////////////////////////////////////////////////////////////////////////////////////

var twitter = TwitterWebService.getInstance(
  'MTuvoyNsEvz6Hu3MePSuXel9I',//API Key
  'qDfriiJpYDSnlYgfJdowqxFaitA6w8EVS1XPTV3sob4wSm5SUt'//API secret key
);

/////////////////////////////////////////////////////////////////////////////////////
// アプリを連携認証する
/////////////////////////////////////////////////////////////////////////////////////

function authorize() {
  twitter.authorize();
}

/////////////////////////////////////////////////////////////////////////////////////
// タイムラインを取得
/////////////////////////////////////////////////////////////////////////////////////

function getTimeLine() {
  var service = twitter.getService();
  var json = service.fetch("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=ShiningPochi&tweet_mode=extended");
  var array = JSON.parse(json);
  Logger.log(array);
  //ツイートのランダム抽出
  var number = Math.floor(Math.random() * array.length);
  var selectTweet = array[number];

  //LINE notifyのトークン
  var token = "alE5cNv7CwEqLFXaFlpgfyyTBH2A4wOw6EQfc5EBg61";

  // 写真が添付されているツイートのみピックアップ
  if (selectTweet.entities.media != undefined && selectTweet.entities.media[0].type == 'photo') {
    // ツイートに添付されている枚数分だけ繰り返す
    for (var k = 0; k < selectTweet.extended_entities.media.length; k++) {
      // JSONから画像のURLを取得
      var img_url = selectTweet.extended_entities.media[k].media_url;
    }
    var optionPhoto = {
      "method": "post",
      "payload": {
        "message": selectTweet.full_text,
        "imageThumbnail": img_url,
        "imageFullsize": img_url
      },
      "headers": { "Authorization": "Bearer " + token }
    };
    Logger.log(img_url);
    UrlFetchApp.fetch("https://notify-api.line.me/api/notify", optionPhoto);

  } else {
    var optionNomal = {
      "method": "post",
      "payload": { "message": selectTweet.full_text },
      "headers": { "Authorization": "Bearer " + token }
    };
    //Logger.log(selectTweet.text);
    UrlFetchApp.fetch("https://notify-api.line.me/api/notify", optionNomal);
  };

}
/////////////////////////////////////////////////////////////////////////////////////
// ツイートを投稿
/////////////////////////////////////////////////////////////////////////////////////

function postTweet() {

  var service = twitter.getService();
  var endPointUrl = 'https://api.twitter.com/1.1/statuses/update.json';

  var response = service.fetch(endPointUrl, {
    method: 'post',
    payload: {
      status: 'これはGASからのツイートだよ'
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////
//認証を解除する
/////////////////////////////////////////////////////////////////////////////////////

function reset() {
  twitter.reset();
}

/////////////////////////////////////////////////////////////////////////////////////
//認証後のコールバック
/////////////////////////////////////////////////////////////////////////////////////

function authCallback(request) {
  return twitter.authCallback(request);
}

//分岐したよ