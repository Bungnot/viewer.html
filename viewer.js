// 🔐 Firebase config (ใช้ชุดเดียวกับเว็บหลัก)
firebase.initializeApp({
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live",
});

const db = firebase.database();
const root = document.getElementById("list");

db.ref("realtimeSummary").on("value", snap => {
  const data = snap.val();
  root.innerHTML = "";

  if(!data){
    root.innerHTML = `<div style="text-align:center;color:#94a3b8">ยังไม่มีข้อมูล</div>`;
    return;
  }

  const sorted = Object.entries(data)
    .sort((a,b)=>b[1].total - a[1].total);

  sorted.forEach(([name,obj],i)=>{
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div class="rank">#${i+1}</div>
      <div class="name">${name}</div>
      <div class="amount">${obj.total.toLocaleString()}</div>
      <div class="actions">
        <input placeholder="-จำนวน" id="minus-${name}">
        <button class="btn-minus" onclick="minus('${name}')">-</button>
        <button class="btn-clear" onclick="clearAll('${name}')">เคลียร์</button>
      </div>
    `;
    root.appendChild(row);
  });
});

function clearAll(name){
  if(!confirm(`เคลียร์ยอดทั้งหมดของ ${name}?`)) return;
  db.ref("realtimeSummary/"+name).remove();
}

function minus(name){
  const input = document.getElementById("minus-"+name);
  const val = parseInt(input.value);
  if(!val || val<=0) return alert("กรอกจำนวนที่ถูกต้อง");

  const ref = db.ref("realtimeSummary/"+name+"/total");
  ref.transaction(current=>{
    if(!current) return 0;
    return Math.max(current - val, 0);
  });
}
