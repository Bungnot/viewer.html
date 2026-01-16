/***** 1. Firebase Config (คัดมาจากเว็บหลัก) *****/
const firebaseConfig = {
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live",
  storageBucket: "admin-rocket-live.firebasestorage.app",
  messagingSenderId: "875303528481",
  appId: "1:875303528481:web:719af49939623d64225b60"
};

/***** 2. INIT FIREBASE (ห้ามลืมเด็ดขาด) *****/
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/***** 3. DOM *****/
const root = document.getElementById("viewer-summary");

/***** 4. LISTEN REALTIME *****/
db.ref("realtimeTables").on("value", snap => {
  const payload = snap.val();
  root.innerHTML = "";

  if (!payload || !payload.tables) {
    root.innerHTML = "ยังไม่มีข้อมูล";
    return;
  }

  payload.tables.forEach(table => {
    const map = {};

    table.rows.forEach(r => {
      const nums = String(r[1] || "").match(/\d+/g);
      if (!nums) return;

      let sum = 0;
      nums.forEach(n => {
        if (n.length >= 3) sum += parseInt(n);
      });

      if (sum > 0) {
        if (r[0]) map[r[0]] = (map[r[0]] || 0) + sum;
        if (r[2] && r[2] !== r[0])
          map[r[2]] = (map[r[2]] || 0) + sum;
      }
    });

    const sorted = Object.entries(map).sort((a,b)=>b[1]-a[1]);
    if (!sorted.length) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${table.title || "ไม่ระบุค่าย"}</h3>`;

    sorted.forEach(([name, total], i) => {
      card.innerHTML += `
        <div class="row">
          <span>#${i+1} ${name}</span>
          <b>${total.toLocaleString()}</b>
        </div>
      `;
    });

    root.appendChild(card);
  });
});

