/*************** 1) Firebase Config ***************/
const firebaseConfig = {
    apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
    authDomain: "admin-rocket-live.firebaseapp.com",
    databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "admin-rocket-live",
    storageBucket: "admin-rocket-live.firebasestorage.app",
    messagingSenderId: "875303528481",
    appId: "1:875303528481:web:719af49939623d64225b60"
  };

/*************** 2) Init Firebase ***************/
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/*************** 3) DOM ***************/
const root = document.getElementById("viewer-summary");

/*************** 4) Listen Real-time ***************/
db.ref("liveTables").on("value", snap => {
  const data = snap.val();

  root.innerHTML = "";

  if (!data) {
    root.innerHTML = "<div class='empty'>ยังไม่มีข้อมูล</div>";
    return;
  }

  Object.values(data).forEach(table => {
    if (!table.rows) return;

    const map = {};

    table.rows.forEach(r => {
      const nums = String(r.price || "").match(/\d+/g);
      if (!nums) return;

      let sum = 0;
      nums.forEach(n=>{
        if(n.length>=3) sum += parseInt(n);
      });

      if(sum>0){
        if(r.chaser) map[r.chaser]=(map[r.chaser]||0)+sum;
        if(r.holder && r.holder!==r.chaser)
          map[r.holder]=(map[r.holder]||0)+sum;
      }
    });

    const sorted = Object.entries(map).sort((a,b)=>b[1]-a[1]);
    if(!sorted.length) return;

    const box=document.createElement("div");
    box.className="box";

    box.innerHTML=`
      <b>${table.title || "ไม่ระบุชื่อบั้ง"}</b>
      ${sorted.map(([n,v],i)=>`
        <div class="row">
          <span>#${i+1} ${n}</span>
          <b>${v.toLocaleString()}</b>
        </div>
      `).join("")}
    `;

    root.appendChild(box);
  });
});
