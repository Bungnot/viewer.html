// Firebase config (เหมือนเว็บหลัก)
const firebaseConfig = {
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live",
  storageBucket: "admin-rocket-live.firebasestorage.app",
  messagingSenderId: "875303528481",
  appId: "1:875303528481:web:719af49939623d64225b60"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const container = document.getElementById("viewer-content");

// 🔢 รวมยอดจากทุกค่าย
function buildGlobalSummary(tables = []) {
  const map = {};

  tables.forEach(table => {
    (table.rows || []).forEach(r => {
      if (!Array.isArray(r)) return;

      const [chaser, price, holder] = r;
      const nums = (price || "").toString().match(/\d+/g);
      if (!nums) return;

      let sum = 0;
      nums.forEach(n => {
        if (n.length >= 3) sum += parseInt(n);
      });

      if (sum > 0) {
        if (chaser) map[chaser] = (map[chaser] || 0) + sum;
        if (holder && holder !== chaser)
          map[holder] = (map[holder] || 0) + sum;
      }
    });
  });

  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

// 🔴 Listen Realtime
db.ref("realtimeTables").on("value", snap => {
  const data = snap.val();

  if (!data || !Array.isArray(data.tables)) {
    container.innerHTML = `<div class="empty">รอข้อมูลจากระบบ…</div>`;
    return;
  }

  const summary = buildGlobalSummary(data.tables);

  if (summary.length === 0) {
    container.innerHTML = `<div class="empty">ยังไม่มีรายการเล่น</div>`;
    return;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th style="width:40px;">#</th>
          <th>ชื่อ</th>
          <th style="text-align:right;">ยอด</th>
        </tr>
      </thead>
      <tbody>
  `;

  summary.forEach(([name, total], i) => {
    html += `
      <tr>
        <td class="rank">${i + 1}</td>
        <td class="name">${name}</td>
        <td class="amount">${total.toLocaleString()}</td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
});
