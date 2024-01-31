import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import {Text} from 'react-native-paper';
import styles from '../../styles/Global.styles'
import PINButtonStyles from '../../styles/PINButton.component.style';

interface Props {
  value: number;
  handlePress: (value: number) => void;
  hide?: boolean;
  isDisabled: boolean;
}

const PINButton: React.FC<Props> = ({value, handlePress, hide, isDisabled}) => {
  if (hide)
    return (
      <View
        style={{
          ...PINButtonStyles.PINButtonContainer,
          backgroundColor: 'transparent',
        }}></View>
    );
  return (
    <TouchableHighlight
      style={
        isDisabled
          ? PINButtonStyles.PINButtonContainerDisabled
          : PINButtonStyles.PINButtonContainer
      }
	  underlayColor={styles.color.disableColor}
      onPress={() => handlePress(value)}
      disabled={isDisabled}>
      <Text
        style={
          isDisabled
            ? PINButtonStyles.PINButtonTextDisabled
            : PINButtonStyles.PINButtonText
        }>
        {value}
      </Text>
    </TouchableHighlight>
  );
};

export default PINButton;
