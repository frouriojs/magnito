import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { NEXT_PUBLIC_API_ORIGIN } from './envValues';

export const apiClient = api(aspida(axios.create({ baseURL: NEXT_PUBLIC_API_ORIGIN })));
