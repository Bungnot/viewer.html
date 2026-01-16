const root = document.getElementById("viewer-summary");
const db = firebase.database();

/*
  🔴 path ต้องตรงกับฝั่ง ADMIN
  ปกติคุณใช้ liveTables
*/
db.ref("liveTables").on("value", snap => {
  const data = snap.val();
  root.innerHTML = "";

  if (!data) {
    root.innerHTML = `<div class="empty">ยังไม่มีข้อมูล</div>`;
    return;
  }

  data.forEach(table => {
    const map = {};

    // รวมยอดตามชื่อ
    table.rows?.forEach(r => {
      const nums = r.price?.match(/\d+/g);
      if (!nums) return;

      let sum = 0;
      nums.forEach(n => {
        if (n.length >= 3) sum += parseInt(n);
      });

      if (sum > 0) {
        if (r.chaser)
          map[r.chaser] = (map[r.chaser] || 0) + sum;

        if (r.holder && r.holder !== r.chaser)
          map[r.holder] = (map[r.holder] || 0) + sum;
      }
    });

    const sorted = Object.entries(map)
      .sort((a,b)=>b[1]-a[1]);

    if (!sorted.length) return;

    const box = document.createElement("div");
    box.className = "table-box";

    box.innerHTML = `
      <h3 style="margin-bottom:10px">🔥 ${table.title}</h3>
      ${sorted.map(([name,value],i)=>`
        <div class="row">
          <span><span class="rank">#${i+1}</span>${name}</span>
          <span class="amount">${value.toLocaleString()}</span>
        </div>
      `).join("")}
    `;

    root.appendChild(box);
  });
});
