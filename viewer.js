const root = document.getElementById("viewer-summary");
const db = firebase.database();

db.ref("liveTables").on("value", snap => {
  const data = snap.val();
  root.innerHTML = "";

  if (!data) {
    root.innerHTML = "<div class='empty'>ยังไม่มีข้อมูล</div>";
    return;
  }

  data.forEach(table => {
    const sumMap = {};

    table.rows?.forEach(r => {
      const val = parseInt(r.price);
      if (isNaN(val)) return;

      if (r.chaser)
        sumMap[r.chaser] = (sumMap[r.chaser] || 0) + val;

      if (r.holder && r.holder !== r.chaser)
        sumMap[r.holder] = (sumMap[r.holder] || 0) + val;
    });

    const sorted = Object.entries(sumMap).sort((a,b)=>b[1]-a[1]);
    if (!sorted.length) return;

    const box = document.createElement("div");
    box.className = "table-box";

    box.innerHTML = `
      <h3>🔥 ${table.title}</h3>
      ${sorted.map(([name,val],i)=>`
        <div class="row">
          <span>#${i+1} ${name}</span>
          <span class="amount">${val.toLocaleString()}</span>
        </div>
      `).join("")}
    `;

    root.appendChild(box);
  });
});
