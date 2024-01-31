// Inspired by https://github.com/itsrajverma/react-native-option-menu/blob/master/index.js
import * as React from 'react';
import {Image, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OptionsIcon from '../../assets/images/menu.png';
import Option from '../../interfaces/Option.interface';
import OptionsMenuStyles from '../../styles/OptionsMenu.component.style';
import OpenContext from '../../context/OpenContext';

interface Props {
  index: number;
  options: Option[];
}

const OptionsMenu: React.FC<Props> = ({index, options}) => {
  const {optionsOpen, open} = React.useContext(OpenContext);

  const handlePress = () => {
    open(index);
  };

  const menu = (
    <View style={OptionsMenuStyles.optionsContainer}>
      {options.map(option => (
        <View key={option.title}>
          <TouchableOpacity
            style={OptionsMenuStyles.optionButton}
            onPress={option.action}>
            <Text
              style={{
                ...OptionsMenuStyles.optionsText,
                color: option.color ? option.color : 'black',
              }}>
              {option.title}
            </Text>
            <Icon
              name={option.icon ? option.icon : 'arrow-right'}
              size={25}
              color={option.color ? option.color : 'black'}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
  return (
    <View>
      {optionsOpen[index] ? (
        menu
      ) : (
        <TouchableOpacity
          onPress={handlePress}
          style={OptionsMenuStyles.button}>
          <Image style={OptionsMenuStyles.image} source={OptionsIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OptionsMenu;
