import refs from './refs';

export default function markupImages(images) {
	const markup = images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
	<div class="photo-card">
		<a class="gallery__link" href="${largeImageURL}">	
		<img src="${webformatURL}" alt="${tags}" loading="lazy" />
		</a>
		<div class="info">
			<p class="info-item">
				<b>Likes</b>
				<span>${likes}</span>
			</p>
			<p class="info-item">
				<b>Views</b>
				<span>${views}</span>
			</p>
			<p class="info-item">
				<b>Comments</b>
				<span>${comments}</span>
			</p>
			<p class="info-item">
				<b>Downloads</b>
				<span>${downloads}</span>
			</p>
		</div>
	</div>`;
    })
		.join('');	
	refs.galleryEl.insertAdjacentHTML('beforeend', markup);
}