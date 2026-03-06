if(!localStorage.getItem("token")) {
  window.location.href = "login.html";
}


const row = document.getElementById("movieRow");
const suggestionsBox = document.getElementById("suggestions");
const searchBox = document.getElementById("searchBox");


function moodMoviesURL(mood) {
  const moodMap = {
    happy: 35,
    sad: 18,
    action: 28,
    comedy: 35,
    romantic: 10749,
    horror: 27,
    scifi: 878
  };
  return `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${moodMap[mood]}`;
}

/* Fetch Trending Movies */
async function loadTrending() {

  const res = await fetch(requests.trending);
  const data = await res.json();

  row.innerHTML = "";

  data.results.forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("movie");

    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const isSaved = watchlist.some(m => m.id === movie.id);

    div.innerHTML = `
      <div class="heart-icon ${isSaved ? 'hovered active' : ''}" onclick="toggleWatchlist(${movie.id},'${movie.title}','${movie.poster_path}',this)"> ${isSaved ? '❤️' : '🤍'}</div>
      
      <div class="rating-circle">${movie.vote_average.toFixed(1)}</div>
      <img src="${IMG_URL + movie.poster_path}">
      <div class="movie-buttons">
        <button onclick="openTrailer(${movie.id})">▶ Trailer</button>
        <button onclick="openDetails(${movie.id})">Details</button>
      </div>
    `;

    row.appendChild(div);
  });
}


loadTrending();

if (searchBox) {
  searchBox.addEventListener("keyup", async (e) => {
    const query=e.target.value.trim();
    if(query.length < 2) {
      document.getElementById("suggestions").innerHTML = "";
      suggestionsBox.style.display = "none";
      return;
    }
    searchMovies(query);

  

    
  const res = await fetch(requests.search(query));
  const data = await res.json();

  if(suggestionsBox) {
  suggestionsBox.innerHTML = "";
  suggestionsBox.style.display = "block";
  }
  
  data.results.slice(0,6).forEach(movie => {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.innerHTML = `<img src="${IMG_URL + movie.poster_path}"class="suggestion-poster">
    <div class="suggestion-info"><p>${movie.title}</p><span class="rating-badge">${movie.vote_average.toFixed(1)}</span></div>`;
   
    div.onclick = () => {
      searchBox.value = movie.title;
      suggestionsBox.style.display = "none";
      openDetails(movie.id);
    };

    suggestionsBox.appendChild(div);
  });
});
}

async function searchMovies(query) {
  const res = await fetch(requests.search(query));
  const data = await res.json();
  const row = document.getElementById("searchResults");
  if(row) {
  row.innerHTML = "";
  }
  data.results.forEach(movie => {
    if(!movie.poster_path) return;
    const moviediv = document.createElement("div");
    moviediv.classList.add("movie");

    moviediv.innerHTML = `
      <img src="${IMG_URL + movie.poster_path}">
      <button onclick="openTrailer(${movie.id})">▶ Trailer</button>
      <button onclick="openDetails(${movie.id})">Details</button>
    `;

    row.appendChild(moviediv);
  });
}


async function openTrailer(movieId) {

  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await res.json();

  const trailer = data.results.find(v => v.type === "Trailer" && v.site === "YouTube");

  if (!trailer) {
    alert("Trailer not available");
    return;
  }

  document.getElementById("trailerModal").style.display = "block";

  document.getElementById("trailerFrame").src =
    `https://www.youtube.com/embed/${trailer.key}`;
}

/* Close Modal */
document.getElementById("closeModal").onclick = () => {
  document.getElementById("trailerModal").style.display = "none";
  document.getElementById("trailerFrame").src = " "
};



function openDetails(movieId) {
  localStorage.setItem("selectedMovieId", movieId);
  window.location.href = "details.html";
}

async function loadMoodMovies(mood) {
    const url=moodMoviesURL(mood);
    const res = await fetch(url);
    const data = await res.json();
    const row = document.getElementById("moodRow");
    row.innerHTML = "";
    data.results.forEach(movie => {
      const div = document.createElement("div");
      div.classList.add("movie");
        div.innerHTML = ` <img src="${IMG_URL + movie.poster_path}"><h4>${movie.title}</h4>`;
      row.appendChild(div);
    });
}

const moodSelect = document.getElementById("moodSelect");
const moodTagline = document.getElementById("moodTagline");

moodSelect.addEventListener("change", () => {
  const selectedMood = this.value;
  filterMovies(selectedMood);

  function filterMovies(mood) {
    const movies = document.querySelectorAll(".movie");
    movies.forEach(movie => {
      if (mood==="all"){
        movie.style.display = "block";
      } else {
        if(movie.classList.contains(mood)) {
          movie.style.display = "block";
        } else {
        movie.style.display = "none";
      }
    }
  });


  // Remove old mood class
  document.body.className = "";

  if (selectedMood) {
    document.body.classList.add(selectedMood);
  }
    document.body.classList.add(selectedMood);
  }

  // Taglines
  if (selectedMood === "action") {
    moodTagline.innerText = "🔥 Time for adrenaline rush!";
  } 
  else if (selectedMood === "comedy") {
    moodTagline.innerText = "😂 Let’s lighten the mood!";
  } 
  else if (selectedMood === "romance") {
    moodTagline.innerText = "❤️ Love is in the air...";
  } 
  else if (selectedMood === "horror") {
    moodTagline.innerText = "😈 Entering the dark side...";
  } 
  else {
    moodTagline.innerText = "";
  }
});


loadMoodMovies("happy");

console.log("Mood Selector and Mood-Based Movies Loaded");

async function loadCategory(title, url) {
  try{
  const res = await fetch(url);
  const data = await res.json();

  const categoryRow = document.createElement("div");
  categoryRow.classList.add("category-row");

  categoryRow.innerHTML = `<h2>${title}</h2> 
  <div class="movie-row">${data.results.map(movie => `
    <img src="${IMG_URL + movie.poster_path}" onclick="openDetails(${movie.id})"/>
    <button onclick="openTrailer(${movie.id})">▶ Trailer</button>
    <button onclick="openDetails(${movie.id})">Details</button>
  `).join("")}</div>`;

  document.getElementById("categories").appendChild(categoryRow);
}
catch(error) {
  console.log("Category Load Error:", error);
}
}


loadCategory("Action", requests.action);
loadCategory("Comedy", requests.comedy);
loadCategory("Romantic", requests.romantic);
loadCategory("Horror", requests.horror);
loadCategory("Sci-Fi", requests.scifi);

console.log("Categories Loaded");

const mood= document.getElementById("moodSelect");
if(mood) {
  mood.addEventListener("change", (e) => {
    console.log("Mood Selected:", e.target.value);
});
}

const searchInput = document.getElementById("searchInput");
if(searchInput) {
  searchInput.addEventListener("keyup", async(e) => {
    console.log("Typing:", e.target.value);
});
}
    

const closeBtn = document.getElementById("closeModal");
if(closeBtn) {
  closeBtn.addEventListener("click", () => {

    document.getElementById("trailerModal").style.display = "none";
    document.getElementById("trailerFrame").src = '';
});
}

document.addEventListener("click", (e) => {

  if(searchBox && suggestionsBox) {
    if(!searchBox.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = "none";
      console.log("Elements:", suggestionsBox);
    }
  }
});


  function toggleWatchlist(id, title, poster, element) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  const index = watchlist.findIndex(movie => movie.id === id);

  if (index === -1) {
    watchlist.push({ id, title, poster });
    element.classList.add("active");
    setTimeout(() => {
      element.classList.remove("active");
    }, 400);
    element.innerHTML = "❤️";
  } else {
    watchlist.splice(index, 1);
    element.classList.remove("active");
    element.innerHTML = "🤍";
  }

  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}
updateWatchlistCount();


function updateWatchlistCount() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const badge = document.getElementById("watchlistCount");
  if (badge) {
    badge.innerText = watchlist.length;
  }
}

updateWatchlistCount();

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

//Show username
const name= localStorage.getItem("name");

if(name) {
  document.getElementById("username").innerText = `Hi, ${name}`;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  window.location.href = "login.html";
}

function addToWatchlist(movieName) {
  const email = localStorage.getItem("email");

  fetch("http://localhost:5000/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, movie: movieName })
  })
  .then(res => res.json())
  .then(data => {
    alert("Added to your watchlist ❤️");
  });
}


const toggleBtn = document.getElementById("themeToggle");

// Page load pe saved theme check
if(localStorage.getItem("theme") === "light"){
  document.body.classList.add("light-mode");
}else{
  document.body.classList.add("dark-mode");
}

// Toggle theme
toggleBtn.addEventListener("click", () => {

  if(document.body.classList.contains("dark-mode")){
    
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");

    localStorage.setItem("theme","light");

    toggleBtn.innerText="🌙";

  }else{

    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");

    localStorage.setItem("theme","dark");

    toggleBtn.innerText="☀️";

  }

});