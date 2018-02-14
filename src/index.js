import $ from 'jquery';
import 'bootstrap';
import './styles.css';
import navbarTemplate from './templates/navbar.html';
import searchBox from './templates/search.html';

const root = document.getElementById('root');

$(() => {
  $(root).append(navbarTemplate);
  $(root).append('<div class="container-fluid" id="container"><h1>Welcome to Neutrino</h1></div>');
  $('#container').append(searchBox);
  $('#term').focus(() => {
    let full = false;
    if ($('#poster').has('img').length) {
      full = true;
    }
    if (full === false) {
      $('#poster').empty();
    }
  });

  const getPoster = () => {
    const film = $('#term').val();
    if (film === '') {
      $('#poster').html('<div class="alert alert-danger" role="alert"><strong>Nope!</strong> Empty search, try to put something in search</div>');
    } else {
      $('#poster').html('<div class="alert alert-success" role="alert"><strong>Wait. Looking for it...</strong></div>');

      $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${film}& =?`, (json) => {
        if (json.total_results !== 0) {
          const tot = Object.keys(json.results).length;
          $('#poster').html(`<div class="alert alert-success" role="alert"><strong>Your search found: ${tot} results </strong></div><div class="movies"></div>`);
          for (let p = 0; p < tot; p += 1) {
            let img = json.results[p].poster_path;
            if (img === null) {
              img = "http://via.placeholder.com/500x700?text='Poster not available'";
            } else {
              img = `http://image.tmdb.org/t/p/w500/${json.results[p].poster_path}`;
            }
            $('.movies').append(`<div class="movie"><h4>${json.results[p].title}</h4><p><img src="${img}" class="img-fluid"></p></div>`);
          }
        } else {
          $('#poster').html('<div class="alert alert-danger" role="alert"><strong>Sorry </strong>Nothing found</div>');
        }
      });
    }
    return false;
  };

  $('#search').click(getPoster);
  $('#term').keyup((event) => {
    if (event.keyCode === 13) {
      getPoster();
    }
  });
});
