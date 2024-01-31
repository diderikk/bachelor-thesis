import * as React from 'react';
import {Button, Text} from 'react-native-paper';
import Style from '../../styles/CommonButton.component.style';
import GlobalStyle from '../../styles/Global.styles';

interface Props {
  onPress: () => void;
  text: string;
  width?: string;
  disabled?: boolean;
}

const CommonButton: React.FC<Props> = ({onPress, text, width, disabled}) => {
  const finalWidth = width ? width : '70%';
  const finalDisabled = disabled ? disabled : false;

  return (
    <Button
      contentStyle={Style.buttonContent}
      style={{
        ...Style.button,
        width: finalWidth,
        backgroundColor: finalDisabled
          ? GlobalStyle.color.disableColor
          : GlobalStyle.color.color,
      }}
      mode="contained"
      onPress={onPress}
      disabled={finalDisabled}>
      <Text style={Style.text}>{text}</Text>
    </Button>
  );
};

export default CommonButton;
