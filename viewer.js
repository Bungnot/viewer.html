/*************** 1) Firebase Config ***************/
const firebaseConfig = {
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live",
  storageBucket: "admin-rocket-live.appspot.com",
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
    root.innerHTML = "<div style='opacity:.6'>ยังไม่มีข้อมูล</div>";
    return;
  }

  Object.values(data).forEach(table => {
    const summary = table.summary || {};
    const entries = Object.entries(summary).sort((a,b)=>b[1]-a[1]);
    if (!entries.length) return;

    const box = document.createElement("div");
    box.className = "card";

    box.innerHTML = `
      <h3>${table.title || "ไม่ระบุค่าย"}</h3>
      ${entries.map(([name,total],i)=>`
        <div class="row">
          <span>#${i+1} ${name}</span>
          <b>${total.toLocaleString()}</b>
        </div>
      `).join("")}
    `;

    root.appendChild(box);
  });
});
