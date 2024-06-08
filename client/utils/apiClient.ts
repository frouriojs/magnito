import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { NEXT_PUBLIC_COGNITO_POOL_ENDPOINT } from './envValues';

export const apiClient = api(aspida(axios.create({ baseURL: NEXT_PUBLIC_COGNITO_POOL_ENDPOINT })));
