import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { RootStackParamList } from '../../App';
import Scene from '../../components/molecules/Scene';
import PIN from '../../components/organisms/PIN';
import { useIsPINCodeSetUpdateContext } from '../../context/isPINCodeSetContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

const PINRegistration: React.FC<Props> = ({navigation}) => {
  const setPINCodeSet = useIsPINCodeSetUpdateContext()
  return (
    <Scene>
      <PIN
        status="choose"
        finishProcess={() => {
          navigation.navigate('Home')
          setPINCodeSet!(true)
        }}
        titleProp="Enter a PIN code"
      />
    </Scene>
  );
};

export default PINRegistration;
