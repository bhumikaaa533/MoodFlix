const row = document.getElementById("watchRow");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

function showWatchlist() {

  row.innerHTML = "";

  watchlist.forEach((movie, index) => {

    const div = document.createElement("div");
    div.classList.add("movie");

    div.innerHTML = `
      <img src="${movie.poster}">
      <button onclick="removeMovie(${index})">❌ Remove</button>
    `;

    row.appendChild(div);
  });
}

function removeMovie(index) {
  watchlist.splice(index, 1);

  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  showWatchlist();
}

showWatchlist();

async function loadWatchlist() {

  const res = await fetch("http://localhost:5000/api/watchlist");
  const data = await res.json();

  const container = document.getElementById("WatchlistContainer");

  container.innerHTML = "";

  movies.forEach(movie => {
    container.innerHTML += `
      <div class="moviecard">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"/>
        <h3>${movie.title}</h3>
        <button onclick="removemovie(${movie.id})">❌ Remove</button>
      </div>
    `;
  });
}

async function removemovie(movieId) {

  await fetch(`http://localhost:5000/api/watchlist/${movieId}`, {
    method: "DELETE"
  });

  loadWatchlist();
}

loadWatchlist();