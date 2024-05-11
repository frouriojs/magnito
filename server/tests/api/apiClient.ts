import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { API_BASE_PATH, PORT } from 'service/envValues';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

export const apiClient = api(aspida(axios.create(), { baseURL }));
