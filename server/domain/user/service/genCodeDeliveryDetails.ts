import type { CodeDeliveryDetails } from 'common/types/auth';
import type { UserEntity } from 'common/types/user';

export const genCodeDeliveryDetails = (user: UserEntity): CodeDeliveryDetails => ({
  AttributeName: 'email',
  DeliveryMedium: 'EMAIL',
  Destination: user.email.replace(/^(.).*@(.).+$/, '$1***@$2***'),
});
