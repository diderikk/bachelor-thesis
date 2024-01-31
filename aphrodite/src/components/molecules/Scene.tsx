import * as React from 'react';
import {SafeAreaView, ScrollView} from 'react-native';

type Props = {
  children?: React.ReactNode;
};

const Scene: React.FC<Props> = ({children}) => {
  return (
    <SafeAreaView style={{flex: 1, marginVertical: "2%"}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{flex: 1}}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Scene;
