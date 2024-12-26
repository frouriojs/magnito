import { Button, TextField, View } from '@aws-amplify/ui-react';
import {
  confirmUserAttribute,
  fetchMFAPreference,
  setUpTOTP,
  signOut,
  updateMFAPreference,
  updateUserAttribute,
  verifyTOTPSetup,
} from 'aws-amplify/auth';
import { APP_NAME } from 'common/constants';
import type { UserEntity } from 'common/types/user';
import { Btn } from 'components/Btn/Btn';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'components/Modal/Modal';
import { Spacer } from 'components/Spacer';
import { useEffect, useState } from 'react';

export const YourProfile = (props: { user: UserEntity; onClose: () => void }) => {
  const [enabledTotp, setEnabledTotp] = useState<boolean>();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [email, setEmail] = useState(props.user.email);
  const enableTOTP = async () => {
    const totpSetupDetails = await setUpTOTP();
    const setupUri = totpSetupDetails.getSetupUri(APP_NAME);

    setQrCodeUrl(setupUri.toString());
  };
  const disableTOTP = async () => {
    await updateMFAPreference({ totp: 'DISABLED' });

    setEnabledTotp(false);
    alert('二要素認証が無効になりました。');
  };
  const verifyTOTP = async () => {
    await verifyTOTPSetup({ code: totpCode });
    await updateMFAPreference({ totp: 'PREFERRED' });
    alert('二要素認証が有効になりました。');
    setQrCodeUrl('');
  };
  const saveEmail = async () => {
    await updateUserAttribute({ userAttribute: { attributeKey: 'email', value: email } });

    const confirmationCode = prompt('確認コードを入力してください。');

    if (confirmationCode === null) return;

    const result = await confirmUserAttribute({ userAttributeKey: 'email', confirmationCode })
      .then(() => true)
      .catch(() => false);

    if (result) await signOut();
  };

  useEffect(() => {
    fetchMFAPreference().then((res) => {
      setEnabledTotp(res.preferred === 'TOTP');
    });
  }, []);

  return (
    <Modal open onClose={props.onClose}>
      <ModalHeader text="プロフィール" />
      <ModalBody>
        <div>ユーザー名: {props.user.name}</div>
        <Spacer axis="y" size={8} />
        <div>
          メールアドレス:
          <Spacer axis="x" size={8} />
          <input
            style={{ padding: '2px 8px', borderRadius: 6 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Spacer axis="x" size={8} />
          <Btn size="small" text="SAVE" disabled={email === props.user.email} onClick={saveEmail} />
        </div>
        <Spacer axis="y" size={8} />
        {enabledTotp ? (
          <Button size="small" onClick={disableTOTP}>
            二要素認証無効化
          </Button>
        ) : qrCodeUrl ? (
          <View>
            <p>認証アプリでこのQRコードをスキャンしてください</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                qrCodeUrl,
              )}`}
              alt="TOTP QR Code"
              style={{ padding: 16, width: 150 }}
            />
            <TextField
              label="ワンタイムトークンコードを入力"
              placeholder="123456"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
            />
            <Spacer axis="y" size={8} />
            <Button onClick={verifyTOTP}>送信</Button>
          </View>
        ) : (
          <Button size="small" onClick={enableTOTP}>
            二要素認証有効化
          </Button>
        )}
      </ModalBody>
      <ModalFooter cancelText="Close" cancel={props.onClose} />
    </Modal>
  );
};
