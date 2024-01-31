import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import KeyValues from '../../interfaces/KeyValues.interface';
import FoldCardStyles from '../../styles/Accordion.component.style';
import SwitchAttribute from './SwitchAttribute';

interface Props {
  cardIndex: number;
  cardTitle: string;
  attributes: KeyValues;
  selectedAttributes: boolean[];
  handleSelectChange: (idCardIndex: number, attributeIndex: number) => void;
  folded: boolean;
  handleFold: (index: number) => void;
}

const Accordian: React.FC<Props> = ({
  cardTitle,
  attributes,
  handleSelectChange,
  selectedAttributes,
  cardIndex,
  folded,
  handleFold,
}) => {

  const attributesJSX = Object.keys(attributes).map((key, index) => {
    const val = attributes[key];
    return (
      <SwitchAttribute
        key={index}
        attributeName={key}
        attributeValue={val}
        index={index}
        handleValueChange={() => handleSelectChange(cardIndex, index)}
        value={selectedAttributes[index]}
      />
    );
  });

  return (
    <View style={FoldCardStyles.container}>
      <TouchableOpacity
        onPress={() => handleFold(cardIndex)}
        style={FoldCardStyles.topContainer}>
        <Text style={FoldCardStyles.cardTitle}>{cardTitle}</Text>
        <IconButton
          color="white"
          icon={folded ? 'chevron-up' : 'chevron-down'}
          onPress={() => handleFold(cardIndex)}
        />
      </TouchableOpacity>
      {folded && attributesJSX}
    </View>
  );
};

export default Accordian;
