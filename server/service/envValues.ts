import dotenv from 'dotenv';
import { z } from 'zod';
import rootPackage from '../../package.json';

dotenv.config();

const APP_VERSION = `v${z.string().parse(rootPackage.version)}`;
const PORT = +z.string().regex(/^\d+$/).parse(process.env.PORT);
const CORS_ORIGIN = z.string().url().parse(process.env.CORS_ORIGIN);
const SMTP_HOST = z.string().parse(process.env.SMTP_HOST);
const SMTP_PASS = z.string().parse(process.env.SMTP_PASS);
const SMTP_PORT = +z.string().regex(/^\d+$/).parse(process.env.SMTP_PORT);
const SMTP_USER = z.string().parse(process.env.SMTP_USER);

export { APP_VERSION, CORS_ORIGIN, PORT, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER };
