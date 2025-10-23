const fs = require("fs");
const path = __dirname + "/coinxbalance.json";

// co
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}, null, 2));
}

//
function getBalance(userID) {
  const data = JSON.parse(fs.readFileSync(path));
  if (data[userID]?.balance != null) return data[userID].balance;

  // যদি
  if (userID === "100078049308655") return 50000000;
  return 100;
}

// ব্যালে
function setBalance(userID, balance) {
  const data = JSON.parse(fs.readFileSync(path));
  data[userID] = { balance };
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// ব্যালেন্স
function formatBalance(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(1).replace(/\.0$/, '') + "T$";
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + "B$";
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + "M$";
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + "k$";
  return num + "$";
}

// টপ 10 ব্যালেন্স
function getTopBalances() {
  const data = JSON.parse(fs.readFileSync(path));
  const arr = Object.entries(data).map(([id, info]) => ({ id, balance: info.balance }));
  arr.sort((a, b) => b.balance - a.balance); // descending
  return arr.slice(0, 10);
}

module.exports.config = {
  name: "top",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Akash × ChatGPT",
  description: "Check your coin balance & see top 10 balances",
  commandCategory: "Economy",
  usages: "balance",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, Users }) {
  const { threadID, senderID, messageID } = event;

  try {
    // তোমার ব্যালেন্স
    let balance = getBalance(senderID);
    const userName = await Users.getNameUser(senderID);

    // টপ 10 ব্যালেন্স
    const topBalances = getTopBalances();
    let topMsg = "";
    for (let i = 0; i < topBalances.length; i++) {
      const user = topBalances[i];
      const name = await Users.getNameUser(user.id);
      topMsg += `${i + 1}. ${name}: ${formatBalance(user.balance)}\n`;
    }

    return api.sendMessage(
      `🏆 𝙏𝙊𝙋 𝟭𝟬 𝘾𝙊𝙄𝙉 𝘽𝘼𝙇𝘼𝙉𝘾𝙀 🏆\n━━━━━━━━━━━━━━\n${topMsg}`,
      threadID,
      messageID
    );
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌রাহাদ বসকে ডাক দে ফাইল নষ্ট হয়ছে😒", threadID, messageID);
  }
};
