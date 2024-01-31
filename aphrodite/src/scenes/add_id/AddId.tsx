import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {SafeAreaView} from 'react-native';
import {RootStackParamList} from '../../App';
import AddIdForm from '../../components/organisms/AddIdForm';

type Props = NativeStackScreenProps<RootStackParamList, 'AddId'>;

const AddId: React.FC<Props> = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <AddIdForm />
    </SafeAreaView>
  );
};

export default AddId;