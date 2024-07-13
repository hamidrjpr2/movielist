let movieList = [];
const movieContainer = document.querySelector(".lists");
const addButton = document.getElementById('btn-popup');
const addMoviePopup = document.getElementById('add-menu');
const movieDetailsPopup = document.getElementById('more-menu');
const inputFields = document.querySelectorAll('.fill-inputs');
const popupButtons = document.querySelectorAll('.pop-btn');
const errorPopup = document.getElementById('errors');
const errorCloseButton = document.getElementById('error-btn');
const imdb = document.querySelector('.imdb')

let currentMovieIndex = 0;
let editMovieIndex = 0;
let validationErrors;

// Load initial data and render the list
initializeData();
renderMovieList();
console.log(movieList);

// Event listener for the main add button
addButton.addEventListener('click', () => {
    showAddMoviePopup();
    clearInputFields();
    popupButtons[0].style.display = 'inline-block';
});

// Function to handle editing a movie
function editMovie(event) {
    editMovieIndex = event.target.closest('div').getAttribute('data-index');

    showAddMoviePopup();
    popupButtons[1].innerHTML = 'Edit';
    popupButtons[1].style.display = 'inline-block';

    // Fill input fields with the selected movie's data
    inputFields[0].value = movieList[editMovieIndex].name;
    inputFields[1].value = movieList[editMovieIndex].genre;
    inputFields[2].value = movieList[editMovieIndex].status;
    inputFields[3].value = movieList[editMovieIndex].year;
    inputFields[4].value = movieList[editMovieIndex].posterUrl;
    inputFields[5].value = movieList[editMovieIndex].casts;
    inputFields[6].value = movieList[editMovieIndex].summary;
}

// Event listener for adding a movie
popupButtons[0].addEventListener('click', () => {
    if (validateRequiredFields() && validateUrl()) {
        addNewMovie();
    } else {
        showErrorPopup();
    }
});

// Function to handle adding a new movie
function addNewMovie() {
    movieList.push({
        name: inputFields[0].value,
        genre: inputFields[1].value,
        status: inputFields[2].value,
        year: inputFields[3].value,
        posterUrl: inputFields[4].value,
        casts: inputFields[5].value,
        summary: inputFields[6].value
    });
    closeAddMoviePopup();
    resetMovieContainer();
    renderMovieList();
    // currentMovieIndex++;
}

// Event listener for editing a movie
popupButtons[1].addEventListener('click', () => {
    movieList[editMovieIndex].name = inputFields[0].value;
    movieList[editMovieIndex].genre = inputFields[1].value;
    movieList[editMovieIndex].status = inputFields[2].value;
    movieList[editMovieIndex].year = inputFields[3].value;
    movieList[editMovieIndex].posterUrl = inputFields[4].value;
    movieList[editMovieIndex].casts = inputFields[5].value;
    movieList[editMovieIndex].summary = inputFields[6].value;
    resetMovieContainer();
    renderMovieList();
    closeAddMoviePopup();
});

// Function to handle displaying movie details
function showMovieDetails(event) {
    let detailsIndex = event.target.closest('div').getAttribute('data-index');

    const castContent = document.querySelector('.cast-content');
    const summaryContent = document.querySelector('.summary-content');
    const poster = document.querySelector('.poster');
    const closeDetailsButton = document.getElementById('more-close');

    showMovieDetailsPopup();
    poster.setAttribute('src', movieList[detailsIndex].posterUrl);
    castContent.innerHTML = movieList[detailsIndex].casts;
    summaryContent.innerHTML = movieList[detailsIndex].summary;

    closeDetailsButton.addEventListener('click', () => {
        closeMovieDetailsPopup();
    });
}

// Event listener to close the add movie popup
popupButtons[2].addEventListener('click', () => {
    closeAddMoviePopup();
    clearInputFields();
});

// Function to handle deleting a movie
function deleteMovie(event) {
    let deleteIndex = event.target.closest('div').getAttribute('data-index');
    movieList.splice(deleteIndex, 1);
    resetMovieContainer();
    renderMovieList();
    localStorage.setItem('movieList', JSON.stringify(movieList));
    console.log(movieList);
}

// Function to render the movie list
function renderMovieList() {
    movieList.forEach((movie, index) => {
        let movieItem = document.createElement("div");
        movieItem.setAttribute('data-index', currentMovieIndex);
        movieItem.setAttribute('draggable', 'true');
        movieItem.classList.add(
            'list', 'flex', 'flex-wrap', 'justify-center', 'md:flex-nowrap', '*:text-[16px]', 'text-white', 'font-bold', 'font-mono', 'rounded-xl', 'bg-black', 'bg-opacity-30', 'my-2', 'py-5', 'gap-y-2'
        );

        function getStatusClass() {
            if (movie.status == 'Watched') {
                return 'watched';
            } else if (movie.status == 'Not Watched') {
                return 'notWatched';
            } else if (movie.status == 'Watching') {
                return 'watching';
            }
        }

        movieItem.innerHTML = `
            <p class="w-3/12 md:w-2/12 mx-2 break-words flex flex-wrap flex-col items-center justify-start text-center">
                <span class="flex flex-wrap items-center text-center justify-center border-b mb-5">
                    <i class="fa-duotone fa-signature text-foreColor"></i>
                    <span class="ml-2 mt-2 md:mt-0 text-foreColor">Movie</span>
                </span>
                <span>${movie.name}</span>
            </p>
            <p class="w-3/12 md:w-2/12 mx-2 break-words flex flex-wrap flex-col items-center justify-start text-center">
                <span class="flex flex-wrap items-center text-center justify-center border-b mb-5">
                    <i class="fa-duotone fa-grid-2 text-foreColor"></i>
                    <span class="ml-2 mt-2 md:mt-0 text-foreColor">Genre</span>
                </span>
                <span>${movie.genre}</span>
            </p>
            <p class="w-3/12 md:w-2/12 mx-2 break-words flex flex-wrap flex-col items-center justify-start text-center">
                <span class="flex flex-wrap items-center text-center justify-center border-b mb-5">
                    <i class="fa-duotone fa-chart-simple text-foreColor"></i>
                    <span class="ml-2 mt-2 md:mt-0 text-foreColor">Status</span>
                </span>
                <span class="${getStatusClass()} text-[10px] py-1 px-1 inline-block">${movie.status}</span>
            </p>
            <div class="md:hidden w-full border-t border-[#ffffff3e]"></div>
            <p class="w-3/12 md:w-2/12 mx-2 break-words flex flex-wrap flex-col items-center justify-start text-center">
                <span class="flex flex-wrap items-center text-center justify-center border-b mb-5">
                    <i class="fa-duotone fa-calendar-days text-foreColor"></i>
                    <span class="ml-2 mt-2 md:mt-0 text-foreColor">Year</span>
                </span>
                <span>${movie.year}</span>
            </p>
            <p class="w-3/12 md:w-2/12 mx-2 break-words flex flex-wrap flex-col items-center justify-start text-center">
                <span class="flex flex-wrap items-center text-center justify-center border-b mb-5">
                    <i class="fa-duotone fa-circle-info text-foreColor"></i>
                    <span class="ml-2 mt-2 md:mt-0 text-foreColor">More</span>
                </span>
                <span onclick='showMovieDetails(event)' class="cursor-pointer">...</span>
            </p>
            <p class="w-3/12 md:w-2/12 mx-2 break-words flex flex-col items-center justify-start text-center  cursor-pointer">
                <span class="flex flex-wrap items-center text-center justify-center border-b mb-5">
                    <i class="fa-duotone fa-brush text-foreColor"></i>
                    <span class="ml-2 mt-2 md:mt-0 text-foreColor">Action</span>
                </span>
                <span>
                    <i onclick='editMovie(event)' class="fa-duotone fa-pen-to-square text-positiveColor text-2xl mx-1 my-2"></i>
                    <i onclick='deleteMovie(event)' class="fa-duotone fa-trash text-negetiveColor text-2xl mx-1 my-2"></i>
                </span>
            </p>`;
        movieContainer.appendChild(movieItem);
        localStorage.setItem('movieList', JSON.stringify(movieList));
        currentMovieIndex++;
    });
}

// Function to load data from localStorage
function initializeData() {
    if (JSON.parse(localStorage.getItem('movieList')) != null) {
        movieList = JSON.parse(localStorage.getItem('movieList'));
    }
}

// Function to clear the movie container
function resetMovieContainer() {
    movieContainer.innerHTML = null;
    currentMovieIndex = 0;
}

// Function to clear input fields
function clearInputFields() {
    inputFields.forEach(inp => {
        inp.value = '';
    });
}

// Function to validate URL
function validateUrl() {
    let urlPattern = new RegExp("\\b((http|https):\\/\\/)?([a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,})(:[0-9]{1,5})?(\\/[^\\s]*)?\\/?\\b");
    const urlToTest = inputFields[4].value;
    const matches = urlToTest.match(urlPattern);
    if (urlToTest == '') {
        return true;
    } else if (urlToTest != '' && matches) {
        return true;
    } else if (urlToTest != '' && !matches) {
        validationErrors = 'Url is invalid';
        return false;
    }
}

// Function to check if required fields are filled
function validateRequiredFields() {
    if (inputFields[0].value != '' && inputFields[1].value != '' && inputFields[2].value != '' && inputFields[3].value != '') {
        return true;
    } else {
        validationErrors = 'At least The first 4 inputs must be filled';
        return false;
    }
}

// Function to show the add movie popup
function showAddMoviePopup() {
    addMoviePopup.style.visibility = 'visible';
    addMoviePopup.style.opacity = '100';
    addMoviePopup.style.transform = 'translate(-50%,-50%) scaleX(1) scaleY(1)';
    addButton.closest('main').style.filter = 'blur(5px)';
}

// Function to close the add movie popup
function closeAddMoviePopup() {
    addMoviePopup.removeAttribute('style');
    addMoviePopup.nextElementSibling.removeAttribute('style');
    popupButtons[0].style.display = 'none';
    popupButtons[1].style.display = 'none';
}

// Function to show the error popup
function showErrorPopup() {
    console.log("Error occurred");

    errorPopup.style.visibility = 'visible';
    errorPopup.style.opacity = '100';
    errorPopup.style.transform = 'translate(-50%,-50%) scaleX(1) scaleY(1)';
    addButton.closest('main').style.filter = 'blur(5px)';

    errorPopup.firstElementChild.innerHTML = validationErrors;

    errorCloseButton.addEventListener('click', () => {
        errorPopup.removeAttribute('style');
        addMoviePopup.nextElementSibling.removeAttribute('style');
    });
}

// Function to show the movie details popup
function showMovieDetailsPopup() {
    movieDetailsPopup.style.visibility = 'visible';
    movieDetailsPopup.style.opacity = '100';
    movieDetailsPopup.style.transform = 'translate(-50%,-50%) scaleX(1) scaleY(1)';
    addButton.closest('main').style.filter = 'blur(5px)';
}

// Function to close the movie details popup
function closeMovieDetailsPopup() {
    movieDetailsPopup.removeAttribute('style');
    addMoviePopup.nextElementSibling.removeAttribute('style');
}


// Api ********
const loading = document.querySelector('.loading')
async function getMovie(name,type) {
    const url = `https://www.omdbapi.com/?apikey=b01e97ed&${type}=${name}`
    try {
        loading.setAttribute('src', 'img/load.gif')
        const response = await fetch(url)
        const result = await response.json()
        return result

    }catch (err){
        console.log(err)
    }
    finally {
        loading.removeAttribute('src')
    }

}

async function MovieSearchCreate(name,type) {
    let hamid = await getMovie(name,type)
    console.log(hamid)
    imdb.style.display = 'flex'
    hamid.Search.map((row,index) => {
        let li = document.createElement('div')
        li.classList.add('w-full', 'p-2', 'my-2', 'bg-[#FEFDED]', 'cursor-pointer')
        li.setAttribute('data-index', index)
        li.setAttribute('onclick', `selectMovie('${row.imdbID}')`)
        li.innerHTML = `
        <figure class="w-full items-center *:mx-1 flex flex-col text-center">
            <img class="w-[70px] h-[70px] rounded-full object-cover" src="${row.Poster}" alt="">
            <figcaption> ${row.Title} </figcaption>
        </figure>
        <h5 class="w-full flex justify-center">
            <span>Year:</span>
            <span>${row.Year}</span
        </h5>
    `
        imdb.appendChild(li)
    })
}

async function MovieSearchPut(imdbID) {
    let film = await getMovie(imdbID,'i')
    console.log(film)
    inputFields[0].value = film.Title
    inputFields[1].value = film.Genre
    inputFields[3].value = film.Released
    inputFields[4].value = film.Poster
    inputFields[5].value = film.Actors
    inputFields[6].value = film.Plot
}

// Api ********

// IMDB button click function
popupButtons[3].addEventListener('click', ()=> {
    resetSearch()
    async function resetSearch() {
        imdb.innerHTML = ''
        imdb.style.display = 'none'
    }
    MovieSearchCreate(inputFields[0].value,'s')
})

// Select Imdb Search and put it in inputFields
async function selectMovie(imdbID) {
    MovieSearchPut(imdbID)
    imdb.innerHTML = ''
    imdb.style.display = 'none'
}
