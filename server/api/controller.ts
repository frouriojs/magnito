import { signInUseCase } from 'domain/signIn/useCase/signInUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: () => ({ status: 200, body: '' }),
  // eslint-disable-next-line complexity
  post: (req) => {
    if ('AuthFlow' in req.body) {
      return { status: 200, body: signInUseCase.srpAuth(req.body) };
    } else if ('ChallengeName' in req.body) {
      return { status: 200, body: signInUseCase.passwordVerifier(req.body) };
    } else {
      return { status: 200, body: signInUseCase.attributes(req.body) };
    }
  },
}));
