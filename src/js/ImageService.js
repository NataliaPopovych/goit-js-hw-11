import axios from 'axios';

const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = '38355159-bacd356c93a5482dc866a24cc';


export default class ImageService {
  constructor() {
    this.page = 1;
    this.perPage = 40;
		this.searchQuery = '';
		this.totalHits = 0;
  }

  async getImages() {
    const {data} = await axios.get(
      `${BASE_URL}?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}`
    );
		this.incrPage();		
    return data;
	}
	
  resetPage() {
    this.page = 1;
  }

  incrPage() {
    this.page += 1;
	}

	resetTotalHits() {
		this.totalHits = 0;
	}
	
	incrTotalHits() {
		this.totalHits += this.perPage;
	}
}
