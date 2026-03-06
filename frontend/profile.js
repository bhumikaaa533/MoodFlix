// 🔒 Protected route
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

const name = localStorage.getItem("name");
const email = localStorage.getItem("email");

document.getElementById("profileName").innerText = name;
document.getElementById("profileEmail").innerText = email;

// Watchlist count fetch
fetch(`https://moodflix-9b1h.onrender.com/api/watchlist/${email}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("watchlistCount").innerText = data.watchlist.length;
  });

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}