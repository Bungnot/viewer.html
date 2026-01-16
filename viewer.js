const root = document.getElementById("viewer-summary");

/* --------------------------
   ข้อมูลทดสอบ (MOCK DATA)
---------------------------*/
const mockData = [
  {
    title: "ค่าย A",
    players: [
      { name: "Aorm", total: 400 },
      { name: "BenZ", total: 300 },
      { name: "Nuy", total: 200 }
    ]
  },
  {
    title: "ค่าย B",
    players: [
      { name: "Macus", total: 500 },
      { name: "William", total: 350 }
    ]
  }
];

/* --------------------------
   ฟังก์ชันกดปุ่ม
---------------------------*/
function mockAdd(){
  root.innerHTML = "";

  mockData.forEach(table=>{
    const box = document.createElement("div");
    box.style.background="#ffffff";
    box.style.color="#020617";
    box.style.borderRadius="16px";
    box.style.padding="15px";
    box.style.marginBottom="20px";

    box.innerHTML = `
      <h3 style="margin-bottom:10px">🔥 ${table.title}</h3>
      ${table.players.map((p,i)=>`
        <div style="display:flex;justify-content:space-between;padding:6px 0">
          <span>#${i+1} ${p.name}</span>
          <b>${p.total.toLocaleString()}</b>
        </div>
      `).join("")}
    `;

    root.appendChild(box);
  });
}

function mockClear(){
  root.innerHTML = "";
}
