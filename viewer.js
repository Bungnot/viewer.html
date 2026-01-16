// Firebase Config (ต้องเหมือน Admin เป๊ะ)
const firebaseConfig = {
  apiKey: "AIzaSyBQQqfwcPDFPjdzeaMkU4EwpYXkBr256yo",
  authDomain: "admin-rocket-live.firebaseapp.com",
  databaseURL: "https://admin-rocket-live-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "admin-rocket-live",
  storageBucket: "admin-rocket-live.appspot.com",
  messagingSenderId: "875303528481",
  appId: "1:875303528481:web:719af49939623d64225b60"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const root = document.getElementById("viewer-summary");

db.ref("liveTables").on("value", snap => {
  const data = snap.val();
  root.innerHTML = "";

  if (!data) {
    root.innerHTML = "<div style='opacity:.6'>ยังไม่มีข้อมูล</div>";
    return;
  }

  Object.entries(data).forEach(([tableName, tableData]) => {
    const total = tableData.total || 0;

    const box = document.createElement("div");
    box.style.background = "#0f172a";
    box.style.borderRadius = "16px";
    box.style.padding = "15px";
    box.style.marginBottom = "16px";

    box.innerHTML = `
      <h3>🔥 ${tableName}</h3>
      <div style="font-size:20px;font-weight:700;margin-top:8px">
        ยอดรวม: ${total.toLocaleString()} บาท
      </div>
    `;

    root.appendChild(box);
  });
});
