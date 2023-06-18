import api from '$/api/$api';
import aspida from '@aspida/axios';
import axios from 'axios';

export const apiClient = api(aspida(axios.create({ withCredentials: true })));
