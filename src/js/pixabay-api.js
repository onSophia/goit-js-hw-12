import axios from 'axios';

const API_KEY = '58374973-e3a87afbdf39838391ab2dba0';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
    const response = await axios.get(BASE_URL, {
        params: {
            key: API_KEY,
            q: query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 15,
            page: page,
        },
    });

    return response.data;
}