const Push = require("pushover-notifications");

const userKey = "uo61b3duga4tz535bdnyqy1bvkisgi"//"YOUR_USER_KEY"; // Replace with your Pushover user key
const appToken = "acsmqd9whba8rutog69nianb7j213v"//"YOUR_APP_TOKEN"; // Replace with your Pushover app token

const push = new Push({
  user: userKey,
  token: appToken,
});
console.log("🚀 ~ file: pushover.js:10 ~ push:", push)

const message = {
  message: "Hello from your Node.js app!",
  title: "My Node.js App",
  sound: "pushover",
  priority: 1, // 1 for high priority, 0 for normal
};

const pushOver = push.send(message, (err, result) => {
  if (err) {
    console.error("Error sending Pushover notification:", err);
  } else {
    console.log("Pushover notification sent successfully:", result);
  }
});

module.exports = pushOver
