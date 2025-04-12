// This function adds cards the page to display the data in the array
function showCards() {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  animeCatalog.forEach((anime) => {
    const nextCard = templateCard.cloneNode(true); // Copy the template card
    editCardContent(nextCard, anime); // Edit title and image
    addCardClickEvent(nextCard);
    cardContainer.appendChild(nextCard); // Add new card to the container
  });
}

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

  console.log("new card:", anime.title, "- html: ", card);
}

function addCardClickEvent(card) {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
}

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", showCards);

// this function is to search for anime by title
function searchAnime() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const cardContainer = document.getElementById("card-container");

  // loop through all the cards, show only the ones that match the search query
  const cards = cardContainer.getElementsByClassName("card");
  let foundMatch = false; // Flag to check if there's any match

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const title = card.querySelector("h2").textContent.toLowerCase(); // get title of each card
    if (title.startsWith(searchQuery)) {
      card.style.display = "block"; // show matching card
      foundMatch = true; // Set flag to true if a match is found
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

function toggleFilters() {
  const panel = document.getElementById("filter-panel");
  panel.classList.toggle("hidden");
}
