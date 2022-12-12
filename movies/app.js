const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_URL_POPULAR =
  'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1';
const API_URL_SEARCH =
  'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
    },
  });

  const respData = await resp.json();
  showMovies(respData);

  function getClassByRate(vote) {
    if (vote >= 7) {
      return 'green';
    } else if (vote >= 5) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  function showMovies(data) {
    const moviesEl = document.querySelector('.movies');
    // Очищаем предыдущие фильмы
    document.querySelector('.movies').innerHTML = '';

    data.films.forEach((movie) => {
      const movieEl = document.createElement('div');
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
    <div class="movie">
    <div class="movie__cover-inner">
        <img class="movie__cover"src="${movie.posterUrlPreview}" alt=${movie.nameRu}>

        <div class="movie__cove--darken"></div>
    </div>
    <div class="movie__info"></div>
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">   </div>
        <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${
        movie.rating
      }</div>
</div>
    `;
      movieEl.addEventListener('click', () => openModal(movie.filmId));

      moviesEl.appendChild(movieEl);
    });
  }
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
  //по умолчанию, чтобы не делать переходы на новые страницы
  e.preventDefault();

  //сюда search
  const apiSearhUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearhUrl);

    search.value = '';
  }
});

//modal
const modalEl = document.querySelector('.modal');
async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': API_KEY,
    },
  });

  const respData = await resp.json();

  modalEl.classList.add('modal--show');
  document.body.classList.add('stop-scrolling');

  modalEl.innerHTML = `
    <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
    <h2>
      <span class="modal__movie-title">${respData.nameRu}</span>
      <span class="modal__movie-release-year"> - ${respData.year}</span>
    </h2>
    <ul class="modal__movie-info">
      <div class="loader"></div>
      <li class="modal__movie-genre">Жанр - ${respData.genres.map(
        (el) => `<span>${el.genre}</span>`,
      )}</li>
      ${
        respData.filmLength
          ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>`
          : ''
      }
      <li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
      <li class="modal__movie-overview">Описание - ${respData.description}</li>
    </ul>
    <button type="button" class="modal__button-close">Закрыть</button>
  </div>
    `;

  const btnClose = document.querySelector('modal__button-close');
  btnClose.addEventListener('click', () => closeModal());
}

function closeModal() {
  modalEl.classList.remove('modal--show');
  document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
