import type { UserEntity } from 'api/@types/user';
import { getUserRecord } from 'middleware/firebaseAdmin';
import { usersRepo } from 'repository/usersRepo';
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

    req.user = usersRepo.recordToModel(user);
  },
}));
