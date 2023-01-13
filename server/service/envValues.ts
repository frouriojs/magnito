import dotenv from 'dotenv'

dotenv.config()

const PORT = +(process.env.PORT ?? '8080')
const API_BASE_PATH = process.env.API_BASE_PATH ?? ''
const API_ORIGIN = process.env.API_ORIGIN ?? ''
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? ''

export { PORT, API_BASE_PATH, API_ORIGIN, CORS_ORIGIN }
