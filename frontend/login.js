const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("Login hit");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("https://moodflix-9b1h.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    console.log("Response from server:", data);

    if(!res.ok) {
      alert(data.message || "Login failed");
      return;
    }
    alert("Login successful! Welcome, " + data.name);

    
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("email", email);
      window.location.href = "index.html";
    

  } catch (err) {
    console.log(err);
    alert("An error occurred during login. Please try again.");
  }
});

function login(){
  window.location.href="index.html"
}