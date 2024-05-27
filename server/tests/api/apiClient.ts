import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { PORT } from 'service/envValues';

const baseURL = `http://127.0.0.1:${PORT}`;

export const apiClient = api(aspida(axios.create(), { baseURL }));
