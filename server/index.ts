import { userPoolUseCase } from 'domain/userPool/useCase/userPoolUseCase';
import { init } from 'service/app';
import { PORT } from 'service/envValues';

userPoolUseCase.initDefaults().then(() => init().listen({ port: PORT, host: '0.0.0.0' }));
