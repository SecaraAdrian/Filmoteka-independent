const apiKey = '0749cec710b71a564db8455b86e66c45';
const baseUrl = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', getPopularMovies);

async function getPopularMovies() {
  try {
    const response = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}`);
    const data = await response.json();
    displayResults(data.results);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
  }
}

function displayResults(movies) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  if (movies.length === 0) {
    resultsContainer.innerHTML = '<p>No movies found.</p>';
    return;
  }
  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} poster" onclick="showMovieDetails(${movie.id})">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.genre_ids.map(genreId => getGenreName(genreId)).join(', ')}</p>
        <p>${movie.release_date.split('-')[0]}</p>
      </div>
    `;
    resultsContainer.appendChild(movieElement);
  });
}

async function showMovieDetails(movieId) {
  try {
    const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
    const movie = await response.json();
    displayMovieDetails(movie);
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
}

function displayMovieDetails(movie) {
  const modalTitle = document.getElementById('modal-title');
  const modalDetails = document.getElementById('modal-details');
  const modalPoster = document.getElementById('modal-poster');

  modalTitle.innerText = movie.title;

  const detailsHTML = `
    <p>Vote / Votes: ${movie.vote_average} / ${movie.vote_count}</p>
    <p>Popularity: ${movie.popularity}</p>
    <p>Original Title: ${movie.original_title}</p>
    <p>Genre: ${movie.genres.map(genre => genre.name).join(', ')}</p>
    <p>ABOUT</p>
    <p>${movie.overview}</p>
  `;

  modalDetails.innerHTML = detailsHTML;
  modalPoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  showModal();
}

function showModal() {
  const modal = document.getElementById('movie-modal');
  modal.style.display = 'block';
  
  const span = document.getElementsByClassName('close')[0];
  span.onclick = () => modal.style.display = 'none';
  
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

function getGenreName(genreId) {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genres[genreId] || 'Unknown';
}
