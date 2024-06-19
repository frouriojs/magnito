import { prismaClient } from 'service/prismaClient';
import { defineController } from './$relay';

// サインアップフローを省略してテストを書くためのエンドポイント
// 200行まではcontrollerにべた書きで良い
export default defineController(() => ({
  delete: async ({ user }) => {
    await prismaClient.user.delete({ where: { id: user.id } });

    return { status: 204 };
  },
}));
