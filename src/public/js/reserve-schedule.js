(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/messenger.Extensions.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "Messenger");
window.extAsyncInit = function () {
  // Messenger Extensions will be available here
  MessengerExtensions.getContext(
    "1173358894531927",
    function success(thread_context) {
      // success
      //set psid to input
      $("#psid").val(thread_context.psid);
      handleClickButtonReserveSchedule();
    },
    function error(err) {
      // error
      console.log("Lỗi đặt bàn Eric bot", err);
    }
  );
};

function handleClickButtonReserveSchedule() {}
