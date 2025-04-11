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

function removeLastCard() {
  titles.pop(); // Remove last item in titles array
  showCards(); // Call showCards again to refresh
}
