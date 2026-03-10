const API_KEY = "8dcb2f5b9a60ae6d4630e36612dcbd4e";

const requests = {
  trending: `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,

  action: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`,
  comedy: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=25`,
  romantic: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  horror: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`,
  scifi: `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=878`,

  search: (query) =>
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`,

  trailer: (id) =>
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`,
};

const IMG_URL = "https://image.tmdb.org/t/p/w500";