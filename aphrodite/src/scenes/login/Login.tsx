import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import Scene from '../../components/molecules/Scene';
import PIN from '../../components/organisms/PIN';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login: React.FC<Props> = ({route, navigation}) => {
  return (
    <Scene>
      <PIN status='enter' finishProcess={() => navigation.navigate('Home')} titleProp="Enter PIN code" />
    </Scene>
  );
};

export default Login;
