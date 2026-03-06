document.getElementById("watchBtn").addEventListener("click", async () => {

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
  );

  const movie = JSON.parse(localStorage.getItem("selectedMovie"));

  await fetch("http://localhost:5000/api/watchlist/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: movie.title,
      poster: IMG_URL + movie.poster_path
    })
  });

  alert("Saved in Backend Database ✅");

  alert("Added to Watchlist ⭐");
});