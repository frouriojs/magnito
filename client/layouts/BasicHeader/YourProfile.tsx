import { Button, TextField, View } from '@aws-amplify/ui-react';
import {
  fetchMFAPreference,
  setUpTOTP,
  updateMFAPreference,
  verifyTOTPSetup,
} from 'aws-amplify/auth';
import { APP_NAME } from 'common/constants';
import type { UserEntity } from 'common/types/user';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'components/Modal/Modal';
import { Spacer } from 'components/Spacer';
import { useEffect, useState } from 'react';

export const YourProfile = (props: { user: UserEntity; onClose: () => void }) => {
  const [enabledTotp, setEnabledTotp] = useState<boolean>();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const enableTOTP = async () => {
    const totpSetupDetails = await setUpTOTP();
    const setupUri = totpSetupDetails.getSetupUri(APP_NAME);

    setQrCodeUrl(setupUri.toString());
  };
  const verifyTOTP = async () => {
    await verifyTOTPSetup({ code: totpCode });
    await updateMFAPreference({ totp: 'PREFERRED' });
    alert('二要素認証が有効になりました。');
    setQrCodeUrl('');
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
        <div>メールアドレス: {props.user.email}</div>
        <Spacer axis="y" size={8} />
        {enabledTotp ? (
          <div>二要素認証: 有効</div>
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
