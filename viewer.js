// 🔥 Firebase config (ของคุณ)
firebase.initializeApp({
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live"
});

const db = firebase.database();
const tbody = document.querySelector("#result tbody");

// ✅ ฟังก์ชันรวมยอด (หัวใจทั้งหมด)
function aggregateTotals(tables){
  const totals = {};

  tables.forEach(t=>{
    t.rows.forEach(r=>{
      const chaser = r[0]?.trim();
      const price  = r[1]?.replace(/[Oo]/g,'0');
      const holder = r[2]?.trim();

      const nums = price?.match(/\d+/g);
      if(!nums) return;

      nums.forEach(n=>{
        if(n.length>=3){
          const val = parseInt(n);
          if(chaser) totals[chaser]=(totals[chaser]||0)+val;
          if(holder && holder!==chaser)
            totals[holder]=(totals[holder]||0)+val;
        }
      });
    });
  });

  return Object.entries(totals)
    .sort((a,b)=>b[1]-a[1]);
}

// ✅ render ตารางเดียว
function render(list){
  tbody.innerHTML="";
  if(list.length===0){
    tbody.innerHTML=`<tr><td colspan="3" class="empty">รอข้อมูล...</td></tr>`;
    return;
  }

  list.forEach(([name,total],i)=>{
    tbody.innerHTML+=`
      <tr>
        <td class="rank">#${i+1}</td>
        <td>${name}</td>
        <td class="amount">${total.toLocaleString()}</td>
      </tr>`;
  });
}

// ✅ listener เดียว เสถียร
db.ref("realtimeTables").on("value",snap=>{
  const data=snap.val();
  if(!data||!data.tables){
    render([]);
    return;
  }
  const result=aggregateTotals(data.tables);
  render(result);
});
