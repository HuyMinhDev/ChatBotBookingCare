console.log("JS đã được load");
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
//validate inputs

function validateInputFields() {
  const EMAIL_REG =
    /^[a-zA-Z][a-zA-Z0-9_.]{1,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
  const PHONE_REG = /^[0-9]{9,11}$/;

  let isError = false;

  // Họ và tên
  let name = $("#customerName");
  if (name.val().trim() === "") {
    name.addClass("is-invalid");
    isError = true;
  } else {
    name.removeClass("is-invalid");
  }

  // Email
  let email = $("#email");
  if (!EMAIL_REG.test(email.val())) {
    email.addClass("is-invalid");
    isError = true;
  } else {
    email.removeClass("is-invalid");
  }

  // Số điện thoại
  let phoneNumber = $("#phoneNumber");
  if (!PHONE_REG.test(phoneNumber.val())) {
    phoneNumber.addClass("is-invalid");
    isError = true;
  } else {
    phoneNumber.removeClass("is-invalid");
  }

  // Địa chỉ
  let address = $("#address");
  if (address.val().trim() === "") {
    address.addClass("is-invalid");
    isError = true;
  } else {
    address.removeClass("is-invalid");
  }

  // Giới tính
  let gender = $("input[name='gender']:checked");
  if (gender.length === 0) {
    $("input[name='gender']").addClass("is-invalid");
    isError = true;
  } else {
    $("input[name='gender']").removeClass("is-invalid");
  }

  // Ngày sinh
  let birthday = $("#birthday");
  if (birthday.val() === "") {
    birthday.addClass("is-invalid");
    isError = true;
  } else {
    birthday.removeClass("is-invalid");
  }

  return isError;
}

function handleClickButtonReserveSchedule() {
  $("#btnReserveSchedule").on("click", function (e) {
    e.preventDefault(); // Ngăn submit mặc định nếu có

    let hasError = validateInputFields(); // Trả về true nếu có lỗi

    if (hasError) return;

    let data = {
      psid: $("#psid").val(),
      customerName: $("#customerName").val(),
      email: $("#email").val(),
      phoneNumber: $("#phoneNumber").val(),
      address: $("#address").val(),
      gender: $("input[name='gender']:checked").val(),
      birthday: $("#birthday").val(),
    };

    // Gửi dữ liệu lên server trước
    $.ajax({
      url: `${window.location.origin}/reserve-schedule-ajax`,
      method: "POST",
      data: data,
      success: function (res) {
        console.log("Gửi thành công:", res);

        // Sau khi gửi thành công thì mới đóng Webview
        MessengerExtensions.requestCloseBrowser(
          function success() {
            // Đã đóng
          },
          function error(err) {
            console.log("Lỗi khi đóng webview:", err);
          }
        );
      },
      error: function (error) {
        console.log("Gửi thất bại:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      },
    });
  });
}
