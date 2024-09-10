import { userPoolUseCase } from 'domain/userPool/useCase/userPoolUseCase';
import { init, serveClient } from 'service/app';
import { CLIENT_PORT, PORT } from 'service/envValues';

userPoolUseCase.initDefaults().then(() => init().listen({ port: PORT, host: '0.0.0.0' }));

if (CLIENT_PORT) serveClient().listen({ port: CLIENT_PORT, host: '0.0.0.0' });
