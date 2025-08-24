function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split("&");
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key && value) params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return params;
}

async function main() {
  const msg = document.getElementById("message");
  const params = getQueryParams();
  const key = params["key"];
  const file = params["file"];

  if (!key || !file) {
    msg.innerText = "缺少必要参数 ?key=xxx&file=yyy / Missing required parameters ?key=xxx&file=yyy";
    return;
  }

  try {
    const response = await fetch("data.json");
    const data = await response.json();

    const ciphertext = data[file];
    if (!ciphertext) {
      msg.innerText = "未找到对应文件 / File not found";
      return;
    }

    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const original = bytes.toString(CryptoJS.enc.Utf8);

    if (!original) {
      msg.innerText = "密钥错误，无法解锁 / Wrong key, failed to unlock";
      return;
    }

    msg.innerText = "解锁成功，正在跳转… / Unlocked successfully, redirecting…";
    window.location.href = original;
  } catch (e) {
    msg.innerText = "读取或解密失败 / Failed to read or decrypt";
    console.error(e);
  }
}

main();
