import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import refs from './js/refs';
import ImageService from './js/ImageService';
import LoadMoreBtn from './js/LoadMoreBtn';
import markupImages from './js/markup';

const { form, galleryEl } = refs;

const newImageSearch = new ImageService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

form.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchImages);

async function onSubmit(evt) {
	evt.preventDefault();
	const form = evt.currentTarget;
  const value = form.elements.searchQuery.value.trim();
  if (value === '') onError('The search query is not!');
  newImageSearch.searchQuery = value;
	clearImagesList();
	newImageSearch.resetPage();
	newImageSearch.resetTotalHits();

	loadMoreBtn.show();
	
	const totalHits = await fetchImages();
	Notiflix.Notify.info(`📌 Hooray! We found ${totalHits} images.`);
	form.reset();	
}

async function fetchImages() {
  loadMoreBtn.disable();
	try {
    const { hits, totalHits } = await fetchImagesMarkup();

    markupImages(hits);

    // Create the gallary
    const gallery = new SimpleLightbox('.photo-card a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });

    gallery.on('closed.simplelightbox', () => {
      gallery.refresh();
    });

    if (totalHits > newImageSearch.perPage) {
      loadMoreBtn.enable();
      newImageSearch.incrTotalHits();
    }
    if (totalHits <= newImageSearch.totalHits) {
      loadMoreBtn.hide();
      Notiflix.Notify.info(
        "📌 We're sorry, but you've reached the end of search results."
			);
			throw new Error(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    onError(err);
  }
}

async function fetchImagesMarkup() {	
	try {
    const { hits, totalHits } = await newImageSearch.getImages();
    if (hits.length === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
		return { hits, totalHits };		
  } catch (err) {
    onError(err);
	}
}

function clearImagesList() {
	galleryEl.innerHTML = '';
}

function onError(err) {
	loadMoreBtn.hide();
	Notiflix.Notify.failure(`❌ ${err}`);
}