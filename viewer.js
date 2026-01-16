/************** FIREBASE INIT **************/
firebase.initializeApp({
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live"
});

const db = firebase.database();
const tbody = document.getElementById("table-body");

/************** STATE (กันกระพริบ / cache) **************/
let lastRenderedJSON = "";
let renderTimer = null;

/************** CORE AGGREGATOR **************/
function aggregate(tables){
  const map = {};

  tables.forEach(t=>{
    t.rows.forEach(r=>{
      const chaser = r[0]?.trim();
      const price  = r[1]?.replace(/[Oo]/g,'0');
      const holder = r[2]?.trim();
      const nums = price?.match(/\d+/g);
      if(!nums) return;

      nums.forEach(n=>{
        if(n.length>=3){
          const v = parseInt(n);
          if(chaser) map[chaser]=(map[chaser]||0)+v;
          if(holder && holder!==chaser)
            map[holder]=(map[holder]||0)+v;
        }
      });
    });
  });

  return Object.entries(map)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,20); // จำกัด TOP 20 (เสถียรกว่า)
}

/************** RENDER **************/
function render(list){
  const json = JSON.stringify(list);
  if(json===lastRenderedJSON) return; // ❗ กัน render ซ้ำ
  lastRenderedJSON=json;

  tbody.innerHTML="";

  if(list.length===0){
    tbody.innerHTML=`<tr><td colspan="3" class="empty">รอข้อมูล...</td></tr>`;
    return;
  }

  list.forEach(([name,total],i)=>{
    let cls="";
    if(i===0) cls="top1";
    if(i===1) cls="top2";
    if(i===2) cls="top3";

    tbody.innerHTML+=`
      <tr class="${cls}">
        <td class="rank">#${i+1}</td>
        <td>${name}</td>
        <td class="amount">${total.toLocaleString()}</td>
      </tr>
    `;
  });
}

/************** LISTENER (DEBOUNCE) **************/
db.ref("realtimeTables").on("value",snap=>{
  const data = snap.val();
  if(!data || !data.tables){
    render([]);
    return;
  }

  clearTimeout(renderTimer);
  renderTimer = setTimeout(()=>{
    const result = aggregate(data.tables);
    render(result);
  },120); // debounce กัน Firebase ยิงถี่
});
