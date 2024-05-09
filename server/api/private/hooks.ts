import type { UserEntity } from 'api/@types/user';
import { userUseCase } from 'domain/user/useCase/userUseCase';
import { getUserRecord } from 'middleware/firebaseAdmin';
import { defineHooks } from './$relay';

export type AdditionalRequest = {
  user: UserEntity;
};

export default defineHooks(() => ({
  preHandler: async (req, res) => {
    const user = await getUserRecord(req.cookies.session);

    if (!user) {
      res.status(401).send();
      return;
    }

    req.user = await userUseCase.findOrCreateUser(user);
  },
}));
