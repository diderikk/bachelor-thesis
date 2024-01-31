import React from 'react';
import {IconButton} from 'react-native-paper';
import PINButtonStyles from '../../styles/PINButton.component.style';

interface Props {
  handlePress: () => void;
  isDisabled: boolean;
}

const PINDeleteButton: React.FC<Props> = ({handlePress, isDisabled}) => {
  return (
    <IconButton
      style={PINButtonStyles.PINDeleteButton}
      icon="backspace-outline"
      disabled={isDisabled}
      onPress={handlePress} children=""/>  );
};

export default PINDeleteButton;
