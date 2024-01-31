import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {Image, View} from 'react-native';
import {Text} from 'react-native-paper';
import {RootStackParamList} from '../../App';
import walletImg from '../../assets/images/wallet.png';
import CommonButton from '../../components/atoms/CommonButton';
import Scene from '../../components/molecules/Scene';
import globalStyles from '../../styles/Global.styles'

type Props = NativeStackScreenProps<RootStackParamList, 'Greeting'>;

const Greeting: React.FC<Props> = ({navigation}) => {
  const handlePress = () => {
    navigation.navigate('Registration');
  };

  return (
    <Scene>
      <View
        style={globalStyles.viewColumn}>
        <Text style={{fontSize: 40}}>Digital ID Wallet</Text>
        <Image style={{resizeMode: 'center'}} source={walletImg}></Image>
        <CommonButton text={"Get started"} onPress={handlePress}></CommonButton>
      </View>
    </Scene>
  );
};

export default Greeting;
