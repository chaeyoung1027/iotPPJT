const firebaseConfig = {
  databaseURL: "https://commonpjt-fd9ed-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const container = document.getElementById("studentData");

// 🔁 실시간으로 message 데이터 감시해서 최신 메시지 표시
const messageRef = db.ref("/message");
const messageBlockId = "message-block";

messageRef.on("value", snapshot => {
  const messageData = snapshot.val();
  const messageText = messageData?.message || "메시지 없음";

  const existingBlock = document.getElementById(messageBlockId);
  const messageHTML = `
    <div id="${messageBlockId}" class="data-block" style="background:#fff9c4; padding:1em; border:1px solid #fbc02d;">
      <div class="label">📢 현재 메시지: ${messageText}</div>
    </div>
    <hr/>
  `;

  if (existingBlock) {
    existingBlock.outerHTML = messageHTML; // 갱신
  } else {
    container.insertAdjacentHTML("afterbegin", messageHTML); // 처음 표시
  }
});

// 📦 학생 데이터 렌더링
db.ref("/").once("value").then(snapshot => {
  snapshot.forEach(child => {
    const name = child.key;

    if (name === "message") return; // message는 이미 따로 처리

    const info = child.child("info").val();
    const data = child.child("sensehat").val();
    const studentId = info?.학번 || info?.student_id || "N/A";

    if (!data) {
      container.innerHTML += `
        <div class="data-block">
          <div class="label">이름:</div> ${name}<br>
          <div class="label">학번:</div> ${studentId}<br>
          <div style="color:red;">※ 센서 데이터 없음</div>
        </div>
        <hr/>
      `;
      return;
    }

    const accel = data.accel || {};
    const gyro = data.gyro || {};
    const timestamp = data.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A";

    container.innerHTML += `
      <div class="data-block">
        <div class="label">이름:</div> ${name}<br>
        <div class="label">학번:</div> ${studentId}<br><br>

        <div class="label">🌡 센서 데이터</div>
        - Humidity: ${data.humidity ?? "N/A"} %<br>
        - Pressure: ${data.pressure ?? "N/A"} hPa<br>
        - Temperature: ${data.temperature ?? "N/A"} °C<br>
        - Accel: x=${accel.x ?? "N/A"}, y=${accel.y ?? "N/A"}, z=${accel.z ?? "N/A"}<br>
        - Gyro: x=${gyro.x ?? "N/A"}, y=${gyro.y ?? "N/A"}, z=${gyro.z ?? "N/A"}<br>
        - Timestamp: ${timestamp}
      </div>
      <hr/>
    `;
  });
});
