const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '38355159-bacd356c93a5482dc866a24cc';
const PER_PAGE = 40;

let currentPage = 1;
let currentQuery = '';

// Function to fetch images from Pixabay API
async function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

// Function to render image cards in the gallery
function renderImageCards(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');
    card.innerHTML = `
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    `;
    gallery.appendChild(card);
  });
}

// Function to handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  gallery.innerHTML = ''; // Clear existing gallery
  currentQuery = form.searchQuery.value.trim();
  currentPage = 1;
  loadMoreBtn.style.display = 'none';

  const images = await fetchImages(currentQuery, currentPage);
  if (images.length > 0) {
    renderImageCards(images);
    if (images.length === PER_PAGE) {
      loadMoreBtn.style.display = 'block';
    }
  } else {
    showNoImagesMessage();
  }
});

// Function to handle "Load more" button click
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  const images = await fetchImages(currentQuery, currentPage);
  if (images.length > 0) {
    renderImageCards(images);
    if (images.length < PER_PAGE) {
      loadMoreBtn.style.display = 'none';
    }
  } else {
    loadMoreBtn.style.display = 'none';
  }
});

// Function to show a message when no images are found
function showNoImagesMessage() {
  const noImagesMessage = `
    <div class="photo-card">
      <p>Sorry, there are no images matching your search query. Please try again.</p>
    </div>
  `;
  gallery.innerHTML = noImagesMessage;
}
