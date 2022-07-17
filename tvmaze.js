/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  const shows = [];
  const request = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  const result = request.data;
  for (let i = 0; i < result.length; i++){
    shows.push({
      id: result[`${i}`].show.id,
      name: result[`${i}`].show.name,
      summary: result[`${i}`].show.summary,
      image: result[`${i}`].show.image
    })
  }
  return shows
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    let showImg = show.image;
    if(showImg === null){
      showImg = 'http://tinyurl.com/tv-missing';
    } else {
      showImg = showImg.original;
    }
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src="${showImg}">
           </div>
         </div>
       </div>
      `);

    const $episodesBtn = $('<button type="button">Episodes</button>');
    const $cardBody = $('.card-body')
    $showsList.append($item);
    $cardBody.append($episodesBtn);
    
    

  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  // console.log(res.data['0']);
  const episodeList = []
  for(let i = 0; i < res.data.length; i++){
    episodeList.push({
      id: res.data[`${i}`].id,
      name: res.data[`${i}`].name,
      season: res.data[`${i}`].season,
      number: res.data[`${i}`].number
    })
  }
  return episodeList;
}

function populateEpisodes(episodeList){
  const $episodeList = $('#episode-list')
  $episodeList.empty();
  let $li = $(`<li>${episodeList.name} (${episodeList.season}, ${episodeList.number})</li>`);
  $episodeList.append($li);
}
