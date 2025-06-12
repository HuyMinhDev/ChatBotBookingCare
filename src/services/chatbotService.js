import request from "request";
require("dotenv").config();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED = "https://bit.ly/3HsPEXN";
const IMAGE_GUIDE_TO_USE_BOT = "https://bit.ly/4jNjHqS";
const IMAGE_COME_BACK =
  "https://st2.depositphotos.com/1005979/6904/i/450/depositphotos_69045701-stock-photo-comeback-word-in-red-3d.jpg";

const IMAGE_SPECIALTY = "https://bit.ly/3TluSvS";
const IMAGE_SPECIALTY_1 = "https://bit.ly/eye_specialty";
const IMAGE_SPECIALTY_2 = "https://bit.ly/spine_specialty";
const IMAGE_SPECIALTY_3 =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbXJftAi72hW5C4XzFL1DdYIw0kKfVOwy8jQ&s";
const IMAGE_SPECIALTY_4 =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ9a08Lv3LK63aWROGJWQslLUqzmxENufLSQ&s";
const IMAGE_SPECIALTY_5 =
  "https://anandrishijihospital.com/wp-content/uploads/2017/11/functional-neurology-1024x768.jpg";
const IMAGE_SPECIALTY_6 =
  "https://wp02-media.cdn.ihealthspot.com/wp-content/uploads/sites/197/2021/04/iStock-1196234930.jpg";
const IMAGE_SPECIALTY_7 =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoTypzYWNDN5NtMsBgT2eoLjKRZL0JeiQO5w&s";

const IMAGE_CLINIC =
  "https://media.istockphoto.com/id/1364075546/photo/empty-corridor-in-modern-hospital-with-information-counter-and-hospital-bed-in-rooms-3d.jpg?s=612x612&w=0&k=20&c=xxFDmIVpH1wJaaiorpvfzec4RRggSb48PDb_dU9bTjo=";
const IMAGE_CLINIC_1 =
  "https://songkhoe.medplus.vn/wp-content/uploads/2021/02/39-1.jpg";
const IMAGE_CLINIC_2 =
  "https://wikibacsi.net/wp-content/uploads/2019/03/benh-vien-mat-viet-han-la-co-so-3-cua-benh-vien-mat-sai-gon.jpg";
const IMAGE_CLINIC_3 =
  "https://thuongtruong-fileserver.nvcms.net/IMAGES/2025/02/28/20250228131601-401.jpeg";
const IMAGE_CLINIC_4 =
  "https://benhvienranghammatsg.vn/wp-content/uploads/2024/03/chi-nhanh-tai-tphcm-rhmsg.jpg";
const IMAGE_CLINIC_5 = "https://medic.gumlet.io/storage/2021/12/HH.jpg";
const IMAGE_CLINIC_6 =
  "https://cdn.tgdd.vn//News/0//tong-quan-ve-phong-kham-victoria-healthcare-845x482.jpg";
const IMAGE_CLINIC_7 =
  "https://cdn-healthcare.hellohealthgroup.com/2023/09/1694688318_6502e43ec36bd1.54062776.jpg";
const IMAGE_CLINIC_8 =
  "https://hd1.hotdeal.vn/images/uploads/2015/05/27/146101/146101-cham-soc-da-mun-body-%20%2820%29.JPG";

let callSendAPI = (sender_psid, response) => {
  return new Promise((resolve, reject) => {
    let request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };

    request(
      {
        uri: "https://graph.facebook.com/v21.0/me/messages",
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: request_body,
      },
      (err, res, body) => {
        if (!err) {
          console.log("message sent!");
          resolve("message sent");
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
  });
};

let getUserName = (sender_psid) => {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}/?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        // qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "GET",
        // json: request_body,
      },
      (err, res, body) => {
        console.log("getUserProfile response:", body);
        if (!err) {
          body = JSON.parse(body);
          let username = `${body.last_name} ${body.first_name}`;
          resolve(username);
          console.log("message sent!");
        } else {
          console.error("Unable to send message:" + err);
          reject(err);
        }
      }
    );
    // return username;
  });
};

let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = await getUserName(sender_psid);
      let response1 = {
        text: `Chào mừng ${username} đến với chatbot BookingCare của chúng tôi! Tôi có thể hỗ trợ bạn như thế nào hôm nay?`,
      };
      let response2 = sendGetStartedTemplate(sender_psid);
      //send text message
      await callSendAPI(sender_psid, response1);
      //send generic template message
      await callSendAPI(sender_psid, response2);
      resolve("done");
    } catch (error) {
      console.error("Error in handleGetStarted:", error);
      reject(error);
    }
  });
};
let sendGetStartedTemplate = (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        // elements: [
        //   {
        //     title: "Xin chào bạn đến với website BookingCare của chúng tôi!",
        //     subtitle: "Dưới đây là một số lựa chọn dành cho bạn",
        //     image_url: IMAGE_GET_STARTED,
        //     buttons: [
        //       {
        //         type: "postback",
        //         title: "CHUYÊN KHOA",
        //         payload: "MAIN_SPECIALTY",
        //       },
        //       {
        //         type: "postback",
        //         title: "BÁC SĨ",
        //         payload: "MAIN_DOCTOR",
        //       },
        //       {
        //         type: "postback",
        //         title: "CƠ SỞ Y TẾ",
        //         payload: "MAIN_CLINIC",
        //       },
        //       {
        //         type: "postback",
        //         title: "Đặt lịch khám",
        //         payload: "RESERVE_SCHEDULE",
        //       },
        //       {
        //         type: "postback",
        //         title: "HƯỚNG DẪN SỬ DỤNG BOT",
        //         payload: "GUIDE_TO_USE_BOT",
        //       },
        //     ],
        //   },
        // ],
        elements: [
          {
            title: "Xin chào bạn đến với BookingCare!",
            subtitle: "Chọn một trong các mục sau:",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "CHUYÊN KHOA",
                payload: "MAIN_SPECIALTY",
              },
              // {
              //   type: "postback",
              //   title: "BÁC SĨ",
              //   payload: "MAIN_DOCTOR",
              // },

              {
                type: "postback",
                title: "CƠ SỞ Y TẾ",
                payload: "MAIN_CLINIC",
              },
              {
                type: "postback",
                title: "Khởi động lại bot",
                payload: "GET_STARTED",
              },
            ],
          },
          {
            title: "Giờ mở cửa",
            subtitle: "T2 - CN: 8:00 - 17:00",
            image_url: IMAGE_GUIDE_TO_USE_BOT,
            buttons: [
              {
                type: "postback",
                title: "Đặt lịch khám",
                payload: "RESERVE_SCHEDULE",
              },
              {
                type: "postback",
                title: "HƯỚNG DẪN SỬ DỤNG BOT",
                payload: "GUIDE_TO_USE_BOT",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendMainSpecialty = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = getMainMenuTemplate(sender_psid);
      //send text message
      await callSendAPI(sender_psid, response);
      //send generic template message
      resolve("done");
    } catch (error) {
      console.error("Error in handleSendMainSpecialty:", error);
      reject(error);
    }
  });
};

let getMainMenuTemplate = (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Dưới đây là các chuyên khoa mà chúng tôi cung cấp:",
            subtitle:
              "Chúng tôi hân hạnh giới thiệu đến bạn các chuyên khoa hàng đầu.",
            image_url: IMAGE_SPECIALTY,
            buttons: [
              {
                type: "web_url",
                title: "Xem Chuyên Khoa Website",
                url: "https://demo-fe-hospital-booking-care.vercel.app/list-specialty",
                webview_height_ratio: "full",
              },
              {
                type: "postback",
                title: "Xem Chuyên Khoa chatbot",
                payload: "VIEW_SPECIALTY_CHATBOT",
              },
              {
                type: "postback",
                title: "Quay lại",
                payload: "GET_STARTED",
              },
            ],
          },
          {
            title: "Giờ mở cửa",
            subtitle: "T2 - CN: 8:00 - 17:00",
            image_url: IMAGE_GUIDE_TO_USE_BOT,
            buttons: [
              {
                type: "postback",
                title: "Đặt lịch khám",
                payload: "RESERVE_SCHEDULE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

// let handleSendMainDoctor = (sender_psid) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let response = {
//         text: "Dưới đây là các bác sĩ mà chúng tôi cung cấp:",
//       };
//       //send text message
//       await callSendAPI(sender_psid, response);
//       //send generic template message
//       resolve("done");
//     } catch (error) {
//       console.error("Error in handleSendMainDoctor:", error);
//       reject(error);
//     }
//   });
// };

let handleSendMainClinic = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = getMainMenuClinicTemplate(sender_psid);
      //send text message
      await callSendAPI(sender_psid, response);
      //send generic template message
      resolve("done");
    } catch (error) {
      console.error("Error in handleSendMainClinic:", error);
      reject(error);
    }
  });
};

let getMainMenuClinicTemplate = (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Dưới đây là các cơ sở y tế mà chúng tôi cung cấp:",
            subtitle:
              "Chúng tôi hân hạnh giới thiệu đến bạn các cơ sở y tế hàng đầu.",
            image_url: IMAGE_CLINIC,
            buttons: [
              {
                type: "web_url",
                title: "Xem Cơ Sở Y Tế Website",
                url: "https://demo-fe-hospital-booking-care.vercel.app/list-clinic",
                webview_height_ratio: "full",
              },
              {
                type: "postback",
                title: "Xem Cơ Sở Y Tế chatbot",
                payload: "VIEW_CLINIC_CHATBOT",
              },
              {
                type: "postback",
                title: "Quay lại",
                payload: "GET_STARTED",
              },
            ],
          },
          {
            title: "Giờ mở cửa",
            subtitle: "T2 - CN: 8:00 - 17:00",
            image_url: IMAGE_GUIDE_TO_USE_BOT,
            buttons: [
              {
                type: "postback",
                title: "Đặt lịch khám",
                payload: "RESERVE_SCHEDULE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendSpecialtyChatbot = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = getMenuSpecialty(sender_psid);
      //send text message
      await callSendAPI(sender_psid, response);
      //send generic template message
      resolve("done");
    } catch (error) {
      console.error("Error in handleSendMainSpecialty:", error);
      reject(error);
    }
  });
};
let getMenuSpecialty = (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Khoa Mắt",
            subtitle: "Chẩn đoán và điều trị các bệnh về mắt.",
            image_url: IMAGE_SPECIALTY_1,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-specialty/6",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Khoa Cột Sống",
            subtitle: "Điều trị các bệnh lý liên quan đến cột sống.",
            image_url: IMAGE_SPECIALTY_2,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-specialty/7",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Khoa Cơ Xương Khớp",
            subtitle: "Chuyên điều trị các bệnh cơ, xương, khớp.",
            image_url: IMAGE_SPECIALTY_3,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-specialty/3",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Khoa Tim Mạch",
            subtitle: "Chăm sóc và điều trị các bệnh lý về tim mạch.",
            image_url: IMAGE_SPECIALTY_4,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-specialty/5",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Khoa Thần Kinh",
            subtitle: "Chẩn đoán và điều trị bệnh thần kinh.",
            image_url: IMAGE_SPECIALTY_5,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-specialty/4",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Khoa Thận - Tiết Niệu",
            subtitle: "Chăm sóc sức khỏe thận và hệ tiết niệu.",
            image_url: IMAGE_SPECIALTY_6,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-specialty/1",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Khoa Châm Cứu",
            subtitle: "Điều trị bằng phương pháp y học cổ truyền.",
            image_url: IMAGE_SPECIALTY_7,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-specialty/8",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay về menu chính.",
            image_url: IMAGE_COME_BACK,
            buttons: [
              {
                type: "postback",
                title: "Quay trở lại",
                payload: "BACK_TO_MAIN_MENU_SPECIALTY",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendClinicChatbot = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = getMenuClinic(sender_psid);
      //send text message
      await callSendAPI(sender_psid, response);
      //send generic template message
      resolve("done");
    } catch (error) {
      console.error("Error in handleSendMainClinic:", error);
      reject(error);
    }
  });
};
let getMenuClinic = (sender_psid) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Phòng Khám Đa Khoa Quốc Tế Exson",
            subtitle: "Dịch vụ y tế chất lượng cao, đa chuyên khoa.",
            image_url: IMAGE_CLINIC_1,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/8",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Phòng Khám Mắt Việt Hàn",
            subtitle: "Chuyên khám và điều trị bệnh về mắt.",
            image_url: IMAGE_CLINIC_2,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/6",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Phòng Khám Nhi Đồng Sài Gòn",
            subtitle: "Chăm sóc sức khỏe cho trẻ em.",
            image_url: IMAGE_CLINIC_3,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/7",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Phòng Khám Răng Hàm Mặt Sài Gòn",
            subtitle: "Dịch vụ nha khoa uy tín và chuyên nghiệp.",
            image_url: IMAGE_CLINIC_4,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/5",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Phòng Khám Đa Khoa Hòa Hảo",
            subtitle: "Khám chữa bệnh đa khoa hiện đại.",
            image_url: IMAGE_CLINIC_5,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/2",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Phòng Khám Quốc Tế Victoria Healthcare",
            subtitle: "Y tế quốc tế với đội ngũ bác sĩ chuyên môn cao.",
            image_url: IMAGE_CLINIC_6,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/3",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Phòng Khám sản phụ khoa Hạnh Phúc",
            subtitle: "Chăm sóc sức khỏe mẹ và bé.",
            image_url: IMAGE_CLINIC_7,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/10",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Phòng Khám Da Liễu O2 Skin",
            subtitle: "Chăm sóc và điều trị các vấn đề về da.",
            image_url: IMAGE_CLINIC_8,
            buttons: [
              {
                type: "web_url",
                title: "Xem chi tiết",
                url: "https://demo-fe-hospital-booking-care.vercel.app/detail-clinic/4",
                webview_height_ratio: "full",
              },
            ],
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay về menu chính.",
            image_url: IMAGE_COME_BACK,
            buttons: [
              {
                type: "postback",
                title: "Quay trở lại",
                payload: "BACK_TO_MAIN_MENU_CLINIC",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleBackToMainMenuClinic = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = getMainMenuClinicTemplate(sender_psid);
      //send text message
      await callSendAPI(sender_psid, response);
      //send generic template message
      resolve("done");
    } catch (error) {
      console.error("Error in handleBackToMainMenu:", error);
      reject(error);
    }
  });
};
let handleBackToMainMenuSpecialty = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = getMainMenuTemplate(sender_psid);
      //send text message
      await callSendAPI(sender_psid, response);
      //send generic template message
      resolve("done");
    } catch (error) {
      console.error("Error in handleBackToMainMenu:", error);
      reject(error);
    }
  });
};
module.exports = {
  handleGetStarted: handleGetStarted,
  callSendAPI: callSendAPI,
  handleSendMainSpecialty: handleSendMainSpecialty,
  // handleSendMainDoctor: handleSendMainDoctor,
  handleSendMainClinic: handleSendMainClinic,
  handleSendSpecialtyChatbot: handleSendSpecialtyChatbot,
  handleSendClinicChatbot: handleSendClinicChatbot,
  handleBackToMainMenuClinic: handleBackToMainMenuClinic,
  handleBackToMainMenuSpecialty: handleBackToMainMenuSpecialty,
};
