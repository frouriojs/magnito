import assert from 'assert';
import type {
  ChangePasswordTarget,
  ConfirmForgotPasswordTarget,
  ForgotPasswordTarget,
  GetUserTarget,
  RevokeTokenTarget,
} from 'common/types/auth';
import { userMethod } from 'domain/user/model/userMethod';
import { userCommand } from 'domain/user/repository/userCommand';
import { userQuery } from 'domain/user/repository/userQuery';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { jwtDecode } from 'jwt-decode';
import { transaction } from 'service/prismaClient';
import type { AccessTokenJwt } from 'service/types';
import { createAttributes } from '../service/createAttributes';
import { genCodeDeliveryDetails } from '../service/genCodeDeliveryDetails';
import { sendConfirmationCode } from '../service/sendAuthMail';

export const authUseCase = {
  getUser: (req: GetUserTarget['reqBody']): Promise<GetUserTarget['resBody']> =>
    transaction(async (tx) => {
      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      return { UserAttributes: createAttributes(user), Username: user.name };
    }),
  revokeToken: (req: RevokeTokenTarget['reqBody']): Promise<RevokeTokenTarget['resBody']> =>
    transaction(async (tx) => {
      await userQuery.findByRefreshToken(tx, req.Token);

      return {};
    }),
  changePassword: (
    req: ChangePasswordTarget['reqBody'],
  ): Promise<ChangePasswordTarget['resBody']> =>
    transaction(async (tx) => {
      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      await userCommand.save(tx, userMethod.changePassword({ user, req }));

      return {};
    }),
  forgotPassword: (
    req: ForgotPasswordTarget['reqBody'],
  ): Promise<ForgotPasswordTarget['resBody']> =>
    transaction(async (tx) => {
      const poolClient = await userPoolQuery.findClientById(tx, req.ClientId);
      const user = await userQuery.findByName(tx, req.Username);
      assert(poolClient.userPoolId === user.userPoolId);

      const forgotUser = userMethod.forgotPassword(user);
      await userCommand.save(tx, forgotUser);
      await sendConfirmationCode(forgotUser);

      return { CodeDeliveryDetails: genCodeDeliveryDetails(forgotUser) };
    }),
  confirmForgotPassword: (
    req: ConfirmForgotPasswordTarget['reqBody'],
  ): Promise<ConfirmForgotPasswordTarget['resBody']> =>
    transaction(async (tx) => {
      const user = await userQuery.findByName(tx, req.Username);

      await userCommand.save(
        tx,
        userMethod.confirmForgotPassword({
          user,
          confirmationCode: req.ConfirmationCode,
          password: req.Password,
        }),
      );

      return {};
    }),
};
