import api from '$/api/$api'
import aspida from '@aspida/axios'
import axios from 'axios'

const agent = axios.create()
agent.defaults.withCredentials = true

export const apiClient = api(aspida(agent))
