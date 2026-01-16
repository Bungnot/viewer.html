const firebaseConfig = {
  // 🔴 ใช้ config เดียวกับเว็บหลัก
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const root = document.getElementById("viewer-summary");

db.ref("liveTables").on("value", snap => {
  const data = snap.val();
  if (!data) {
    root.innerHTML = "ยังไม่มีข้อมูล";
    return;
  }

  root.innerHTML = "";

  Object.values(data).forEach(table => {
    const entries = Object.entries(table.summary || {})
      .sort((a,b)=>b[1]-a[1]);

    if (!entries.length) return;

    const box = document.createElement("div");
    box.className = "card";

    box.innerHTML = `
      <h3>📌 ${table.title}</h3>
      ${entries.map(([n,v],i)=>`
        <div class="row">
          <span>#${i+1} ${n}</span>
          <b>${v.toLocaleString()}</b>
        </div>
      `).join("")}
    `;

    root.appendChild(box);
  });
});
