import { init, serveClient } from 'service/app';
import { CLIENT_PORT, PORT } from 'service/envValues';

init().listen({ port: PORT, host: '0.0.0.0' });
CLIENT_PORT && serveClient().listen({ port: CLIENT_PORT, host: '0.0.0.0' });
