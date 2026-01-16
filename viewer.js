// ใช้ firebaseConfig เดิมจาก script.js
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const root = document.getElementById("viewer-summary");

db.ref("liveTables").on("value", snap => {
  const data = snap.val();
  if (!data) return;

  root.innerHTML = "";

  data.forEach(table => {
    const map = {};

    table.rows.forEach(r => {
      const nums = r.price?.match(/\d+/g);
      if (!nums) return;

      let sum = 0;
      nums.forEach(n => {
        if (n.length >= 3) sum += parseInt(n);
      });

      if (sum > 0) {
        if (r.chaser) map[r.chaser] = (map[r.chaser] || 0) + sum;
        if (r.holder && r.holder !== r.chaser)
          map[r.holder] = (map[r.holder] || 0) + sum;
      }
    });

    const sorted = Object.entries(map)
      .sort((a,b)=>b[1]-a[1]);

    if (!sorted.length) return;

    const box = document.createElement("div");
    box.style.background="#fff";
    box.style.borderRadius="16px";
    box.style.padding="15px";
    box.style.marginBottom="20px";

    box.innerHTML = `
      <h3 style="margin-bottom:10px">🔥 ${table.title}</h3>
      ${sorted.map(([n,v],i)=>`
        <div style="display:flex;justify-content:space-between;padding:6px 0">
          <span>#${i+1} ${n}</span>
          <b>${v.toLocaleString()}</b>
        </div>
      `).join("")}
    `;

    root.appendChild(box);
  });
});
