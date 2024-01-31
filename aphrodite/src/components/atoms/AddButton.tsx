import * as React from 'react';
import { FAB } from 'react-native-paper';
import Style from '../../styles/AddButton.component.style';

interface Props {
  onPress: () => void;
}

const AddButton: React.FC<Props> = ({onPress}) => (
  <FAB
    style={Style.button}
    icon="plus"
    onPress={onPress}
    color='#FFFFFF'
  />
);

export default AddButton;