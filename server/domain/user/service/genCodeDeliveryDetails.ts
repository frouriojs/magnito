import type { CodeDeliveryDetails } from 'api/@types/auth';
import type { UserEntity } from 'api/@types/user';

export const genCodeDeliveryDetails = (user: UserEntity): CodeDeliveryDetails => ({
  AttributeName: 'email',
  DeliveryMedium: 'EMAIL',
  Destination: user.email.replace(/^(.).*@(.).+$/, '$1***@$2***'),
});
