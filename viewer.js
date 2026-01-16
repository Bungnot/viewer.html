/* 🔐 Firebase config (ใช้ชุดเดียวกับเว็บหลัก) */
const firebaseConfig = {
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const root = document.getElementById("viewer-root");

/* 📡 อ่าน realtime */
db.ref("realtimeTables").on("value", snap => {
  const data = snap.val();
  if(!data || !data.tables){
    root.innerHTML = "<p>ยังไม่มีข้อมูล</p>";
    return;
  }
  renderTables(data.tables);
});

/* 🧱 render ตาราง */
function renderTables(tables){
  root.innerHTML = "";

  tables.forEach((table, idx) => {
    const card = document.createElement("div");
    card.className = "table-card";

    let rowsHtml = table.rows.map(r => `
      <tr>
        <td>${r[0]}</td>
        <td>${r[1]}</td>
        <td>${r[2]}</td>
      </tr>
    `).join("");

    card.innerHTML = `
      <h2>🏕️ ${table.title || "ไม่ระบุค่าย"}</h2>

      <table>
        <thead>
          <tr>
            <th>คนไล่</th>
            <th>ราคา</th>
            <th>คนยั้ง</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <button class="btn btn-summary" onclick="showCampSummary(${idx})">
        ดูยอดรวมค่าย
      </button>
      <button class="btn btn-player" onclick="showPlayerSummary(${idx})">
        ดูยอดรายบุคคล
      </button>
    `;

    root.appendChild(card);
  });
}

/* 📊 สรุปยอดค่าย */
function showCampSummary(index){
  db.ref("realtimeTables/tables/"+index).once("value").then(snap=>{
    const t = snap.val();
    let total = 0;

    t.rows.forEach(r=>{
      const nums = r[1].match(/\d+/g);
      if(nums){
        nums.forEach(n=>{
          if(n.length>=3) total+=parseInt(n);
        });
      }
    });

    openModal(`
      <h2>🏕️ ${t.title}</h2>
      <h1>รวมทั้งหมด ${total.toLocaleString()}</h1>
    `);
  });
}

/* 👤 สรุปยอดรายคน */
function showPlayerSummary(index){
  db.ref("realtimeTables/tables/"+index).once("value").then(snap=>{
    const t = snap.val();
    const map = {};

    t.rows.forEach(r=>{
      const nums = r[1].match(/\d+/g);
      let sum = 0;
      if(nums){
        nums.forEach(n=>{
          if(n.length>=3) sum+=parseInt(n);
        });
      }
      if(sum>0){
        if(r[0]) map[r[0]]=(map[r[0]]||0)+sum;
        if(r[2] && r[2]!==r[0]) map[r[2]]=(map[r[2]]||0)+sum;
      }
    });

    const html = Object.entries(map)
      .sort((a,b)=>b[1]-a[1])
      .map(([n,v],i)=>`
        <p>#${i+1} ${n} — ${v.toLocaleString()}</p>
      `).join("");

    openModal(`<h2>👤 ยอดรายบุคคล</h2>${html}`);
  });
}

/* 🪟 modal */
function openModal(html){
  document.getElementById("modal-content").innerHTML = html;
  document.getElementById("modal").style.display = "flex";
}
function closeModal(e){
  if(e.target.id==="modal")
    document.getElementById("modal").style.display="none";
}
