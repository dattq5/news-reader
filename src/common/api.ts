import { DEFAULT_PAGE_SIZE } from "./constants";

export const BASE_PATH = import.meta.env.VITE_BASE_PATH;
export const API_KEY = import.meta.env.VITE_API_KEY;

export const API = {
  getArticles: ({page = 1, pageSize = DEFAULT_PAGE_SIZE, source = ''}) => `
      ${BASE_PATH}/top-headlines?pageSize=${pageSize}&page=${page}${source ? '&sources=' + source : '&country=au'}&apiKey=${API_KEY}
    `,
  getSources: () => `${BASE_PATH}/top-headlines/sources?apiKey=${API_KEY}`
}