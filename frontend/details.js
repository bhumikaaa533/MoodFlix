const movieId = localStorage.getItem("selectedMovieId");

async function loadDetails() {

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );

  const movie = JSON.parse(localStorage.getItem("selectedMovie"));

  if (!movie) {
    alert("Movie data not found! Go back and click details again.");
    window.location.href = "index.html";
  }

  document.getElementById("movieTitle").innerText = movie.title;

  document.getElementById("moviePoster").src =
    "https://image.tmdb.org/t/p/w500" + movie.poster_path;

  document.getElementById("movieOverview").innerText =
    "Overview: " + movie.overview;

  document.getElementById("movieRelease").innerText =
    "Release Date: " + movie.release_date;

  document.getElementById("movieRating").innerText =
    "Rating: " + movie.vote_average;

  document.getElementById("movieGenres").innerText =
    "Genres: " + (movie.genre_names || "Not Available");

  function goback() {
    window.history.back();
  }

}

loadDetails();

document.getElementById("watchBtn").onclick = async () => {

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );

  const movie = await res.json();

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  watchlist.push({
    title: movie.title,
    poster: IMG_URL + movie.poster_path
  });

  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  alert("Added to Watchlist ⭐");
};