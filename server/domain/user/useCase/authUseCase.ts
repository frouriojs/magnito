import assert from 'assert';
import type {
  ChangePasswordTarget,
  ConfirmForgotPasswordTarget,
  DeleteUserAttributesTarget,
  ForgotPasswordTarget,
  GetUserTarget,
  RevokeTokenTarget,
  UpdateUserAttributesTarget,
  VerifyUserAttributeTarget,
} from 'common/types/auth';
import { userMethod } from 'domain/user/model/userMethod';
import { userCommand } from 'domain/user/repository/userCommand';
import { userQuery } from 'domain/user/repository/userQuery';
import { userPoolQuery } from 'domain/userPool/repository/userPoolQuery';
import { jwtDecode } from 'jwt-decode';
import { transaction } from 'service/prismaClient';
import type { AccessTokenJwt } from 'service/types';
import { toAttributeTypes } from '../service/createAttributes';
import { genCodeDeliveryDetails } from '../service/genCodeDeliveryDetails';
import { sendConfirmationCode } from '../service/sendAuthMail';

export const authUseCase = {
  getUser: (req: GetUserTarget['reqBody']): Promise<GetUserTarget['resBody']> =>
    transaction(async (tx) => {
      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      return { UserAttributes: toAttributeTypes(user), Username: user.name };
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
  updateUserAttributes: (
    req: UpdateUserAttributesTarget['reqBody'],
  ): Promise<UpdateUserAttributesTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.AccessToken);

      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);
      const updated = userMethod.updateAttributes(user, req.UserAttributes);

      await userCommand.save(tx, updated);

      if (user.confirmationCode !== updated.confirmationCode) await sendConfirmationCode(updated);

      return { CodeDeliveryDetailsList: [genCodeDeliveryDetails(updated)] };
    }),
  verifyUserAttribute: (
    req: VerifyUserAttributeTarget['reqBody'],
  ): Promise<VerifyUserAttributeTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.AccessToken);

      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      await userCommand.save(tx, userMethod.verifyAttribute(user, req));

      return {};
    }),
  deleteUserAttributes: (
    req: DeleteUserAttributesTarget['reqBody'],
  ): Promise<DeleteUserAttributesTarget['resBody']> =>
    transaction(async (tx) => {
      assert(req.AccessToken);

      const decoded = jwtDecode<AccessTokenJwt>(req.AccessToken);
      const user = await userQuery.findById(tx, decoded.sub);

      await userCommand.save(tx, userMethod.deleteAttributes(user, req.UserAttributeNames));

      return {};
    }),
};
