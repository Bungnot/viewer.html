// 🔧 Firebase config (เหมือนเว็บหลัก)
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

const container = document.getElementById("viewer-summary");

// ✅ ฟังก์ชันคำนวณยอด
function calculateSummary(rows = []) {
  const map = {};

  rows.forEach(r => {
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

  return Object.entries(map).sort((a,b)=>b[1]-a[1]);
}

// ✅ Listen แบบกันพัง
db.ref("realtimeTables").on("value", snap => {
  const data = snap.val();

  if (!data || !Array.isArray(data.tables)) {
    container.innerHTML = `<div class="empty">รอข้อมูลจากเว็บหลัก...</div>`;
    return;
  }

  let html = "";

  data.tables.forEach((table, idx) => {
    const title = table.title || `ค่าย ${idx+1}`;
    const summary = calculateSummary(table.rows || []);

    html += `
      <div class="camp">
        <div class="camp-title">🏕️ ${title}</div>
    `;

    if (summary.length === 0) {
      html += `<div class="empty">ยังไม่มีรายการ</div>`;
    } else {
      html += `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อ</th>
              <th>ยอด</th>
            </tr>
          </thead>
          <tbody>
            ${summary.map(([name,total],i)=>`
              <tr>
                <td>${i+1}</td>
                <td>${name}</td>
                <td>${total.toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }

    html += `</div>`;
  });

  container.innerHTML = html;
});
