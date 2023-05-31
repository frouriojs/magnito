import { init } from '$/service/app';
import { PORT } from '$/service/envValues';

init().listen({ port: PORT, host: '0.0.0.0' });
