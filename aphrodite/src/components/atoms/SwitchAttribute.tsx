import * as React from 'react';
import {View} from 'react-native';
import {Switch, Text} from 'react-native-paper';
import switchAttributeStyles from '../../styles/SwitchAttribute.component.style';
import styles from '../../styles/Global.styles';

interface Props {
  attributeName: string;
  attributeValue: string;
  index: number;
  handleValueChange: (index: number) => void;
  value: boolean;
}

const SwitchAttribute: React.FC<Props> = ({
  attributeName,
  attributeValue,
  index,
  handleValueChange,
  value
}) => {
  return (
    <View style={switchAttributeStyles.container}>
      <Text style={switchAttributeStyles.text}>
        {attributeName}: {attributeValue}
      </Text>
      <Switch
				style={switchAttributeStyles.switch}
        value={value}
        onValueChange={() => {
          handleValueChange(index);
        }}
        thumbColor="white"
        trackColor={{true: styles.color.color, false: styles.color.disableColor}}
      />
    </View>
  );
};

export default SwitchAttribute;
