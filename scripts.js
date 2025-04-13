/* ==============================================================
                     ADD CARDS TO PAGE
===============================================================*/
function showCards() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  animeCatalog.forEach((anime) => {
    const nextCard = templateCard.cloneNode(true); // Copy the template card
    editCardContent(nextCard, anime); // Edit title and image
    addCardClickEvent(nextCard);
    handleClip(nextCard);
    cardContainer.appendChild(nextCard); // Add new card to the container
  });
}

/* ==============================================================
                    EDIT CONTENT OF CARDS
===============================================================*/
function editCardContent(card, anime) {
  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = anime.title;

  const cardImage = card.querySelector("img");
  cardImage.src = anime.image;
  cardImage.alt = anime.title + " Poster";

  const genre = card.querySelector(".genre");
  genre.innerHTML = "<strong>Genre 📚:</strong> " + anime.genre;

  const studio = card.querySelector(".studio");
  studio.innerHTML = "<strong>Studio 🎙️:</strong> " + anime.studio;

  const rating = card.querySelector(".rating");
  rating.innerHTML = "<strong>Rating ⭐:</strong> " + anime.rating;

  const year = card.querySelector(".year");
  year.innerHTML = "<strong>Year 📅:</strong> " + anime.year;

  const description = card.querySelector(".description");
  description.innerHTML = anime.description;

  const video = card.querySelector("video");
  if (anime.clip) {
    video.src = anime.clip;
    video.style.display = "block";
  } else {
    video.style.display = "none";
  }

  console.log("new card:", anime.title, "- html: ", card);
}

/* ==============================================================
                     SHOW BACK OF CARD
===============================================================*/
function addCardClickEvent(card) {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
}

/* ==============================================================
                     HANDLE CLIP PLAYING
===============================================================*/
function handleClip(card) {
  const video = card.querySelector("video");

  if (!video) return;

  card.addEventListener("mouseover", () => {
    video.currentTime = 20;
    video.play();
  });

  card.addEventListener("mouseout", () => {
    video.pause();
    video.currentTime = 0;
  });
}

/* ==============================================================
                SEARCH ANIME BY TITLE (SEARCH BAR)
===============================================================*/
function searchAnime() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const cardContainer = document.getElementById("card-container");

  // loop through all the cards, show only the ones that match the search query
  const cards = cardContainer.getElementsByClassName("card");
  let foundMatch = false; // check if there's any match

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const title = card.querySelector("h2").textContent.toLowerCase(); // get title of each card
    if (title.startsWith(searchQuery)) {
      card.style.display = "block"; // show matching card
      foundMatch = true; // set flag to true if a match is found
    } else {
      card.style.display = "none"; // hide non-matching card
    }
  }

  // check if no cards match the search query
  if (!foundMatch) {
    const noResultsMessage = document.createElement("p");
    noResultsMessage.id = "noResultsMessage";
    noResultsMessage.textContent = "No results found.";
    // if the message already exists, dont add a new one
    if (!document.getElementById("noResultsMessage")) {
      cardContainer.appendChild(noResultsMessage);
    }
  } else {
    // remove "No results" message if there are matches
    const noResultsMessage = document.getElementById("noResultsMessage");
    if (noResultsMessage) {
      noResultsMessage.remove();
    }
  }
}

/* ==============================================================
                     FILTER BUTTON
===============================================================*/
function toggleFilters() {
  const panel = document.getElementById("filter-panel");
  panel.classList.toggle("hidden");
}

/* ==============================================================
                    PROCESS FILTERS/SORTING
===============================================================*/
function applyFilters() {
  const selectedStudio = document
    .getElementById("studioFilter")
    .value.toLowerCase();
  const selectedGenre = document
    .getElementById("genreFilter")
    .value.toLowerCase();
  const yearSorter = document.getElementById("yearSorter");
  const ratingSorter = document.getElementById("ratingSorter");
  const alphabeticalSorter = document.getElementById("alphabeticalSorter");

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
    if (yearOrder === "newest") {
      return b.year - a.year; // newest to oldest
    } else if (yearOrder === "oldest") {
      return a.year - b.year; // oldest to newest
    }

    // Handle rating sorting
    if (ratingOrder === "highest") {
      return b.rating - a.rating; // highest rating
    } else if (ratingOrder === "lowest") {
      return a.rating - b.rating; // lowest rating
    }

    // Handle alphabetical sorting
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
  showCards();

  const yearSorter = document.getElementById("yearSorter");
  const ratingSorter = document.getElementById("ratingSorter");
  const alphabeticalSorter = document.getElementById("alphabeticalSorter");

  yearSorter.addEventListener("change", () => {
    if (yearSorter.value !== "") {
      ratingSorter.value = "";
      alphabeticalSorter.value = "";
    }
    applyFilters();
  });

  ratingSorter.addEventListener("change", () => {
    if (ratingSorter.value !== "") {
      yearSorter.value = "";
      alphabeticalSorter.value = "";
    }
    applyFilters();
  });

  alphabeticalSorter.addEventListener("change", () => {
    if (alphabeticalSorter.value !== "") {
      yearSorter.value = "";
      ratingSorter.value = "";
    }
    applyFilters();
  });
});
