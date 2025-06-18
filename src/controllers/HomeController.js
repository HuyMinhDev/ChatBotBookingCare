require("dotenv").config();
// process.env.Node_ENV = 'development'; // Uncomment this line to set the environment to development
import request from "request";
import chatbotService from "../services/chatbotService.js";
import openaiService from "../services/openaiService.js";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let getHomePage = (req, res) => {
  return res.render("homepage.ejs");
};

let postWebhook = (req, res) => {
  let body = req.body;

  // ✅ In toàn bộ body nhận được từ Facebook để debug
  console.log("🌐 Webhook received:");
  console.log(JSON.stringify(body, null, 2)); // in đẹp JSON

  // Check the webhook event is from a page subscription
  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0];

      // ✅ Log chi tiết từng event
      console.log("📨 Incoming message event:", webhook_event);

      let sender_psid = webhook_event.sender.id;
      console.log("👤 Sender PSID:", sender_psid);

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }

  // ❌ KHÔNG đặt console.log(webhook_event) ở đây vì biến không tồn tại
};

let getWebhook = (req, res) => {
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Verify the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`,
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;
  // Set the response based on the postback payload
  switch (payload) {
    case "yes":
      response = { text: "Thanks!" };
      break;
    case "no":
      response = { text: "Oops, try sending another image." };
      break;
    case "RESTART_BOT":
    case "GET_STARTED":
      await chatbotService.handleGetStarted(sender_psid);
      // response = {
      //   text: "Chào mừng bạn đến với chatbot của chúng tôi! Tôi có thể hỗ trợ bạn như thế nào hôm nay?",
      // };
      break;
    case "MAIN_SPECIALTY":
      await chatbotService.handleSendMainSpecialty(sender_psid);
      break;
    // case "MAIN_DOCTOR":
    //   await chatbotService.handleSendMainDoctor(sender_psid);
    //   break;
    case "MAIN_CLINIC":
      await chatbotService.handleSendMainClinic(sender_psid);
      break;
    case "VIEW_SPECIALTY_CHATBOT":
      await chatbotService.handleSendSpecialtyChatbot(sender_psid);
      break;
    // case "VIEW_DOCTOR_CHATBOT":
    //   await chatbotService.handleSendDoctorChatbot(sender_psid);
    //   break;
    case "VIEW_CLINIC_CHATBOT":
      await chatbotService.handleSendClinicChatbot(sender_psid);
      break;
    case "BACK_TO_MAIN_MENU_CLINIC":
      await chatbotService.handleBackToMainMenuClinic(sender_psid);
      break;
    case "BACK_TO_MAIN_MENU_SPECIALTY":
      await chatbotService.handleBackToMainMenuSpecialty(sender_psid);
      break;

    case "SHOW_ROOMS":
      await chatbotService.handleShowDetailRooms(sender_psid);
      break;

    default:
      response = { text: `Unknown postback payload. ${payload}` };
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      // uri: "https://graph.facebook.com/v2.6/me/messages",
      uri: "https://graph.facebook.com/v21.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

let setupProfile = async (req, res) => {
  // Gửi yêu cầu cấu hình Profile API của Facebook Messenger
  let request_body = {
    get_started: {
      payload: "GET_STARTED",
    },
    whitelisted_domains: ["https://chatbotbookingcare.onrender.com"],
  };

  // Gửi HTTP request đến Facebook Graph API
  await request(
    {
      uri: `https://graph.facebook.com/v21.0/me/messenger_profile`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, response, body) => {
      console.log("Setup profile response:", body);
      if (!err) {
        console.log("Cấu hình Messenger profile thành công!");
      } else {
        console.error("Lỗi khi cấu hình profile:", err);
      }
    }
  );
  return res.send("Cấu hình Messenger profile thành công!");
};
let setupPersistentMenu = async (req, res) => {
  // call profile FB API
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "Visit Website BookingCare",
            url: "https://demo-fe-hospital-booking-care.vercel.app/home",
            // payload: "VIEW_WEBSITE",
            webview_height_ratio: "full",
          },
          {
            type: "web_url",
            title: "Visit Fanpage BookingCare",
            url: "https://www.facebook.com/profile.php?id=61576906725592",
            // payload: "CURATION",
            webview_height_ratio: "full",
          },
          {
            type: "postback",
            title: "Khởi động chatbot",
            payload: "RESTART_BOT",
          },
        ],
      },
    ],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      uri: `https://graph.facebook.com/v22.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      //https://graph.facebook.com/v21.0/me/custom_user_setting?access_token=${PAGE_ACCESS_TOKEN}
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log("Setup persistent menu response:", body);
      if (!err) {
        console.log("Setup persistent menu successfully!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
  return res.send("Setup persistent menu successfully!");
};

let handleReserveSchedule = (req, res) => {
  return res.render("reserve-schedule.ejs");
};

let handlePostReserveSchedule = async (req, res) => {
  try {
    const {
      psid,
      customerName = "",
      email = "",
      phoneNumber = "",
      address = "",
      gender = "",
      birthday = "",
    } = req.body;

    // Nếu customerName trống thì thay bằng "Để trống"
    const finalName = customerName.trim() === "" ? "Để trống" : customerName;

    const response1 = {
      text: `---Thông tin khách hàng đặt lịch---
      Họ và tên: ${finalName}
      Email: ${email}
      Số điện thoại: ${phoneNumber}
      Địa chỉ: ${address}
      Giới tính: ${
        gender === "male" ? "Nam" : gender === "female" ? "Nữ" : "Chưa chọn"
      }
      Ngày sinh: ${birthday || "Chưa chọn"}
      `,
    };

    await chatbotService.callSendAPI(psid, response1);

    return res.status(200).json({
      message: "ok",
    });
  } catch (e) {
    console.error("Lỗi post reserve table: ", e);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getHomePage: getHomePage,
  postWebhook: postWebhook,
  getWebhook: getWebhook,
  setupProfile: setupProfile,
  setupPersistentMenu: setupPersistentMenu,
  handleReserveSchedule: handleReserveSchedule,
  handlePostReserveSchedule: handlePostReserveSchedule,
};
