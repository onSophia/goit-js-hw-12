import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const perPage = 15;

form.addEventListener('submit', async event => {
    event.preventDefault();

    currentQuery = event.currentTarget.elements['search-text'].value.trim();

    if (currentQuery === '') {
        iziToast.warning({
            title: 'Warning',
            message: 'Search query cannot be empty!',
            position: 'topRight',
        });
        return;
    }

    currentPage = 1;
    clearGallery();
    hideLoadMoreButton();
    showLoader();

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);

        if (data.hits.length === 0) {
            iziToast.error({
                title: 'Error',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight',
            });
            return;
        }

        createGallery(data.hits);

        if (currentPage * perPage < data.totalHits) {
            showLoadMoreButton();
        } else {
            iziToast.info({
                title: 'Info',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: `Something went wrong: ${error.message}`,
            position: 'topRight',
        });
    } finally {
        hideLoader();
        form.reset();
    }
});

loadMoreBtn.addEventListener('click', async () => {
    currentPage += 1;
    hideLoadMoreButton();
    showLoader();

    try {
        const data = await getImagesByQuery(currentQuery, currentPage);
        createGallery(data.hits);

        const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });

        if (currentPage * perPage >= data.totalHits) {
            hideLoadMoreButton();
            iziToast.info({
                title: 'Info',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'topRight',
            });
        } else {
            showLoadMoreButton();
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: `Something went wrong: ${error.message}`,
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
});