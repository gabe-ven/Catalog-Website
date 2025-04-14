/* ==============================================================
                     DISPLAY CARDS
===============================================================*/
function showCards() {
  // grab HTML element where cards will be shown
  const cardContainer = document.getElementById("card-container");
  // clear the container before adding new cards
  cardContainer.innerHTML = "";
  // grab first element within card (template)
  const templateCard = document.querySelector(".card");

  // loop through entire animeCatalog
  animeCatalog.forEach((anime) => {
    // create copy of template card
    const nextCard = templateCard.cloneNode(true);
    // update new card's content based on current anime
    editCardContent(nextCard, anime);
    // add click event for card flip
    addCardClickEvent(nextCard);
    // handle preview clip of anime
    handleClip(nextCard);
    // add new card to container
    cardContainer.appendChild(nextCard);
  });
}

/* ==============================================================
                 GENERATE URL FOR CRUNCHYROLL
===============================================================*/
function generateCrunchyrollUrl(title) {
  const baseUrl = "https://www.crunchyroll.com/";
  const lowerTitle = title.toLowerCase();
  let goodTitle = "";

  // filter out unwanted characters
  for (let i = 0; i < lowerTitle.length; i++) {
    const char = lowerTitle[i];
    if (
      (char >= "a" && char <= "z") ||
      (char >= "0" && char <= "9") ||
      char === " "
    ) {
      goodTitle += char;
    }
  }

  // replace spaces with dashes
  let formattedTitle = "";
  for (let i = 0; i < goodTitle.length; i++) {
    if (goodTitle[i] === " ") {
      formattedTitle += "-";
    } else {
      formattedTitle += goodTitle[i];
    }
  }

  return baseUrl + formattedTitle;
}

/* ==============================================================
                    EDIT CONTENT OF CARDS
===============================================================*/
function editCardContent(card, anime) {
  // make card visible
  card.style.display = "block";

  // update with anime title
  const header = card.querySelector("h2");
  header.textContent = anime.title;

  // set src to anime image url
  const image = card.querySelector("img");
  image.src = anime.image;

  // fill with anime genre
  const genre = card.querySelector(".genre");
  genre.innerHTML = "<strong>Genre 📚:</strong> " + anime.genre;

  // fill with anime studio
  const studio = card.querySelector(".studio");
  studio.innerHTML = "<strong>Studio 🎙️:</strong> " + anime.studio;

  // fill with anime rating
  const rating = card.querySelector(".rating");
  rating.innerHTML = "<strong>Rating ⭐:</strong> " + anime.rating;

  // fill with anime year
  const year = card.querySelector(".year");
  year.innerHTML = "<strong>Year 📅:</strong> " + anime.year;

  // fill with anime description
  const description = card.querySelector(".description");
  description.innerHTML = anime.description;

  // add link to the card
  const crunchyrollUrl = generateCrunchyrollUrl(anime.title);
  const link = card.querySelector(".link");
  if (link) {
    link.href = crunchyrollUrl;
    link.textContent = "WATCH HERE";
    link.target = "_blank"; // open in a new tab
  }

  const video = card.querySelector("video");
  // if clip exists, set video source and make visible
  if (anime.clip) {
    video.src = anime.clip;
    video.style.display = "block";
  }
  // hide video display if no clip exists
  else {
    video.style.display = "none";
  }

  console.log("new card:", anime.title, "- html: ", card);
}

/* ==============================================================
                     SHOW BACK OF CARD
===============================================================*/
function addCardClickEvent(card) {
  // flip card on click
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
}

/* ==============================================================
                     HANDLE CLIP PLAYING
===============================================================*/
function handleClip(card) {
  // grab video element
  const video = card.querySelector("video");

  // return if there is no video
  if (!video) return;

  // on hover, play the video from 20 seconds in
  card.addEventListener("mouseover", () => {
    video.currentTime = 20;
    video.play();
  });

  // on unhover, pause the video and reset to 0 seconds
  card.addEventListener("mouseout", () => {
    video.pause();
    video.currentTime = 0;
  });
}

/* ==============================================================
                SEARCH ANIME BY TITLE (SEARCH BAR)
===============================================================*/
function searchAnime() {
  // grab search input and card container
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const cardContainer = document.getElementById("card-container");

  const cards = cardContainer.getElementsByClassName("card");
  let foundMatch = false; // check if there's any match

  // loop through all the cards, show only the ones that match the search query
  for (let i = 0; i < cards.length; i++) {
    // grab each card
    const card = cards[i];
    const title = card.querySelector("h2").textContent.toLowerCase(); // get title of each card

    // check if title starts with search query
    if (title.startsWith(searchQuery)) {
      card.style.display = "block"; // show matching card
      foundMatch = true; // set flag to true if a match is found
    } else {
      card.style.display = "none"; // hide non-matching card
    }
  }

  // check if no cards match the search query
  if (!foundMatch) {
    const noResults = document.createElement("p");
    noResults.id = "noResults";
    noResults.textContent = "No results found.";
    // if the message already exists, dont add a new one
    if (!document.getElementById("noResults")) {
      cardContainer.appendChild(noResults);
    }
  } else {
    // remove "No results" message if there are matches
    const noResults = document.getElementById("noResults");
    if (noResults) {
      noResults.remove();
    }
  }
}

/* ==============================================================
                     FILTER BUTTON
===============================================================*/
function toggleFilters() {
  // toggle the visibility of the filter panel
  const panel = document.getElementById("filter-panel");
  panel.classList.toggle("hidden");
}

/* ==============================================================
                    PROCESS FILTERS/SORTING
===============================================================*/
function applyFilters() {
  // grab selected values from filter dropdowns
  const selectedStudio = document
    .getElementById("studioFilter")
    .value.toLowerCase();
  const selectedGenre = document
    .getElementById("genreFilter")
    .value.toLowerCase();
  const yearSorter = document.getElementById("yearSorter");
  const ratingSorter = document.getElementById("ratingSorter");
  const alphabeticalSorter = document.getElementById("alphabeticalSorter");

  // get selected sorting options
  const yearOrder = yearSorter.value.toLowerCase();
  const ratingOrder = ratingSorter.value.toLowerCase();
  const alphabeticalOrder = alphabeticalSorter.value.toLowerCase();
  const cardContainer = document.getElementById("card-container");

  // filter catalog based on selected studio and genre
  const filteredAnime = animeCatalog.filter((anime) => {
    const studioMatches =
      selectedStudio === "" ||
      anime.studio.toLowerCase().includes(selectedStudio);
    const genreMatches =
      selectedGenre === "" || anime.genre.toLowerCase().includes(selectedGenre);
    return studioMatches && genreMatches;
  });

  // sort filtered anime based on year and rating
  const sortedAnime = filteredAnime.sort((a, b) => {
    // handle year sorting
    if (yearOrder === "newest") {
      return b.year - a.year; // newest to oldest
    } else if (yearOrder === "oldest") {
      return a.year - b.year; // oldest to newest
    }

    // handle rating sorting
    if (ratingOrder === "highest") {
      return b.rating - a.rating; // highest rating
    } else if (ratingOrder === "lowest") {
      return a.rating - b.rating; // lowest rating
    }

    // handle alphabetical sorting
    if (alphabeticalOrder === "a-z") {
      return a.title.localeCompare(b.title); // sort A-Z
    } else if (alphabeticalOrder === "z-a") {
      return b.title.localeCompare(a.title); // sort Z-A
    }

    // no sorting
    return 0;
  });

  // clear container and add filtered and sorted cards
  cardContainer.innerHTML = "";
  sortedAnime.forEach((anime) => {
    const nextCard = document.querySelector(".card").cloneNode(true);
    editCardContent(nextCard, anime);
    addCardClickEvent(nextCard);
    handleClip(nextCard);
    cardContainer.appendChild(nextCard);
  });
}

/* ==============================================================
                    RUN SHOWCARDS()/RESET SORTING
===============================================================*/
// the purpose of this is to display all the cards when the page loads
// and sort dropdowns so that selecting one clears the others
document.addEventListener("DOMContentLoaded", () => {
  // show all cards when the page loads
  showCards();

  // get sort dropdowns
  const yearSorter = document.getElementById("yearSorter");
  const ratingSorter = document.getElementById("ratingSorter");
  const alphabeticalSorter = document.getElementById("alphabeticalSorter");

  // reset sorting when one is selected
  // if year is selected, reset rating and alphabetical
  yearSorter.addEventListener("change", () => {
    if (yearSorter.value !== "") {
      ratingSorter.value = "";
      alphabeticalSorter.value = "";
    }
    applyFilters();
  });

  // if rating is selected, reset year and alphabetical
  ratingSorter.addEventListener("change", () => {
    if (ratingSorter.value !== "") {
      yearSorter.value = "";
      alphabeticalSorter.value = "";
    }
    applyFilters();
  });

  // if alphabetical is selected, reset year and rating
  alphabeticalSorter.addEventListener("change", () => {
    if (alphabeticalSorter.value !== "") {
      yearSorter.value = "";
      ratingSorter.value = "";
    }
    applyFilters();
  });
});
