import * as React from 'react';
import {BottomNavigation} from 'react-native-paper';
import {IdCard} from '../../interfaces/IdCard.interface';
import VerifyWindow from '../molecules/VerifyWindow';
import WalletWindow from '../molecules/WalletWindow';
import globalStyles from '../../styles/Global.styles';
import ShareDataWindow from '../molecules/ShareDataWindow';

interface Props {
  idCards: IdCard[];
}

const HomeScreenContainer: React.FC<Props> = ({
  idCards: idCardsProp,
}) => {
  const [idCards, setIdCards] = React.useState<IdCard[]>(idCardsProp);

  const removeIdCard = (idNickname: string) => {
    setIdCards(prevCards =>
      prevCards!.filter(card => card.nickname !== idNickname),
    );
  };

  React.useEffect(() => {
    if (idCardsProp) setIdCards(idCardsProp);
  }, [idCardsProp]);

  const Wallet = () => (
    <WalletWindow
      idCards={idCards}
      removeIdCard={removeIdCard}
    />
  );
  const Verify = () => <VerifyWindow shouldRender={index == 2}></VerifyWindow>;
  const ShareData = () => <ShareDataWindow idCards={idCards} />;

  const [index, setIndex] = React.useState(0);
  const routes = [
    {key: 'wallet', title: 'Wallet', icon: 'wallet', color: '#FFFFFF'},
    {key: 'sharedata', title: 'Share Data', icon: 'qrcode', color: '#FFFFFF'},
    {key: 'verify', title: 'Verify', icon: 'qrcode-scan', color: '#FFFFFF'},
  ];

  const renderScene = BottomNavigation.SceneMap({
    wallet: Wallet,
    verify: Verify,
    sharedata: ShareData,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={true}
      activeColor={globalStyles.color.color}
      inactiveColor={globalStyles.color.disableColor}
    />
  );
};

export default HomeScreenContainer;
