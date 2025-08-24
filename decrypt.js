(function () {
  function setMsg(text) {
    const el = document.getElementById("message");
    if (el) el.textContent = text;
  }

  function getParams() {
    const sp = new URLSearchParams(window.location.search);
    // 支持别名，方便你以后改：key/k，file/id
    return {
      key: sp.get("key") || sp.get("k"),
      file: sp.get("file") || sp.get("id"),
    };
  }

  async function main() {
    const { key, file } = getParams();

    if (!key || !file) {
      setMsg("缺少必要参数 ?key=xxx&file=yyy / Missing parameters ?key=xxx&file=yyy");
      return;
    }

    try {
      // 加时间戳避免 GitHub Pages 缓存老文件
      const res = await fetch("data.json?ts=" + Date.now());
      if (!res.ok) {
        setMsg("无法读取数据文件 / Failed to fetch data.json");
        return;
      }

      const db = await res.json();
      const ciphertext = db[file];

      if (!ciphertext) {
        setMsg("未找到对应文件 / File not found");
        return;
      }

      let original = "";
      try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        original = bytes.toString(CryptoJS.enc.Utf8);
      } catch (_) {
        // 解密出错会落到下面的校验
      }

      if (!original) {
        setMsg("密钥错误或解密失败 / Wrong key or decryption failed");
        return;
      }

      setMsg("解锁成功，正在跳转… / Unlocked successfully, redirecting…");
      // 直接跳转到解密得到的真实链接（可为 https:// 或 ankiistore:// 等）
      window.location.href = original;
    } catch (err) {
      console.error(err);
      setMsg("发生错误 / An error occurred");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();
