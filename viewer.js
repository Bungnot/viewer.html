const firebaseConfig = {
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let lastUpdated = 0;

db.ref("realtimeTables").on("value", snap => {
  const data = snap.val();
  if (!data || !data.tables) return;

  if (data.updatedAt === lastUpdated) return;
  lastUpdated = data.updatedAt;

  renderTables(data.tables);
});

function renderTables(tables) {
  const root = document.getElementById("tables");
  root.innerHTML = "";

  tables.forEach(t => {
    const sorted = Object.entries(t.summary.players)
      .sort((a,b)=>b[1]-a[1]);

    let rows = sorted.map(([name,val],i)=>`
      <tr>
        <td>#${i+1}</td>
        <td>${name}</td>
        <td style="text-align:right">${val.toLocaleString()}</td>
        <td><button onclick="alert('${name}')">ดู</button></td>
      </tr>`).join("");

    root.innerHTML += `
      <div class="card">
        <h3>${t.title}</h3>
        <table>
          <thead>
            <tr><th>#</th><th>ชื่อ</th><th>ยอด</th><th></th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:10px;font-weight:bold">
          รวมทั้งหมด: ${t.summary.total.toLocaleString()}
        </div>
      </div>
    `;
  });
}
