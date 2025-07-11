// We'll store users like { username: {password: "...", credits: 0, works: [], profilePic: "dataURL" } }
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = null;

function handleLoginRegister() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginError = document.getElementById("loginError");

  if (!username || !password) {
    loginError.innerText = "Please enter username and password.";
    return;
  }

  loginError.innerText = "";

  if (!users[username]) {
    // New user - register
    users[username] = { password, credits: 0, works: [], profilePic: "default.jpg" };
    localStorage.setItem("users", JSON.stringify(users));
    alert("You registered successfully! Please login now.");
    // Clear inputs for login
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    return;
  }

  // Existing user - login check
  if (users[username].password !== password) {
    loginError.innerText = "Incorrect password.";
    return;
  }

  // Successful login
  currentUser = username;
  showProfilePage();
}

function showProfilePage() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("userDisplay").innerText = currentUser;

  // Load user data
  const userData = users[currentUser];
  document.getElementById("creditCount").innerText = userData.credits || 0;
  document.getElementById("profilePreview").src = userData.profilePic || "default.jpg";

  // Load works
  const workList = document.getElementById("workList");
  workList.innerHTML = "";
  userData.works.forEach(work => {
    const div = document.createElement("div");
    div.classList.add("work-item");
    div.innerHTML = `
      <p><strong>Description:</strong> ${work.desc}</p>
      <p><strong>File:</strong> ${work.fileName}</p>
    `;
    workList.appendChild(div);
  });
}

function logout() {
  currentUser = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("loginError").innerText = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

// Profile Picture Upload - save as dataURL in localStorage users object
document.getElementById("profileUpload").addEventListener("change", function () {
  if (!currentUser) return;

  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataURL = e.target.result;
      document.getElementById("profilePreview").src = dataURL;
      users[currentUser].profilePic = dataURL;
      localStorage.setItem("users", JSON.stringify(users));
    };
    reader.readAsDataURL(file);
  }
});

// Work submission
document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!currentUser) return;

  const desc = document.getElementById("desc").value.trim();
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];
  if (!desc || !file) return;

  // Add work to user data
  users[currentUser].works.unshift({
    desc: desc,
    fileName: file.name,
  });

  // Add credits
  users[currentUser].credits += 10;
  localStorage.setItem("users", JSON.stringify(users));

  // Refresh work list & credit
  showProfilePage();

  // Reset form
  this.reset();
});
