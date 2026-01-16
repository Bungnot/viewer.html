firebase.initializeApp({
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live"
});

const db = firebase.database();
const tbody = document.getElementById("table-body");

const totals = {};
let lastRender = "";

db.ref("realtimeEvents").on("child_added", snap => {
  const d = snap.val();
  if (!d || !d.amount) return;

  if (d.chaser) totals[d.chaser] = (totals[d.chaser] || 0) + d.amount;
  if (d.holder && d.holder !== d.chaser)
    totals[d.holder] = (totals[d.holder] || 0) + d.amount;

  render();
});

function render() {
  const list = Object.entries(totals)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,20);

  const json = JSON.stringify(list);
  if (json === lastRender) return;
  lastRender = json;

  tbody.innerHTML = "";

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="3" class="empty">รอข้อมูล...</td></tr>`;
    return;
  }

  list.forEach(([name,total],i)=>{
    let cls="";
    if(i===0) cls="top1";
    if(i===1) cls="top2";
    if(i===2) cls="top3";

    tbody.innerHTML += `
      <tr class="${cls}">
        <td>#${i+1}</td>
        <td>${name}</td>
        <td class="amount">${total.toLocaleString()}</td>
      </tr>
    `;
  });
}
