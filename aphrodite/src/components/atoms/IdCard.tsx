import { NavigationContext } from '@react-navigation/native';
import * as React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import OpenContext from '../../context/OpenContext';
import { useSnackBar } from '../../context/SnackBarContext';
import {
  instanceOfIdCard,
  instanceOfVerifiableCredential
} from '../../interfaces/IdCard.interface';
import Option from '../../interfaces/Option.interface';
import Style from '../../styles/IdCard.component.style';
import { getId } from '../../utils/secureIdStore';
import OptionsMenu from './OptionsMenu';

interface Props {
  backgroundColor: string;
  cardName: string;
  documentDid: string;
  index: number;
  removeIdCard: (cardName: string, documentDid: string) => void;
}

const IdCard: React.FC<Props> = ({
  backgroundColor,
  cardName,
  documentDid,
  index,
  removeIdCard,
}) => {
  const navigation = React.useContext(NavigationContext);
  const {dispatch} = useSnackBar();
  const {anyOpen, closeAllOptions} = React.useContext(OpenContext);

  const editAction = () => {
    navigation?.navigate('EditId', {
      cardName,
      cardColor: backgroundColor,
    });
  };

  const deleteAction = () => {
    removeIdCard(cardName, documentDid);
  };

  const options: Option[] = [
    {title: 'Edit', action: editAction, icon: 'square-edit-outline'},
    {
      title: 'Delete',
      action: deleteAction,
      color: 'red',
      icon: 'delete-outline',
    },
  ];

  const handlePress = async () => {
    if (anyOpen()) {
      closeAllOptions()
      return;
    }
    const response = await getId(cardName);
    if (instanceOfIdCard(response)) {
      if (instanceOfVerifiableCredential(response.credential)) {
        navigation?.navigate('Preview', {
          cardName,
          cardColor: backgroundColor,
          verifiableCredential: response.credential,
        });
      } else {
        dispatch({type: 'loading'})
        navigation?.navigate('Share', {
          cardName,
          cardColor: backgroundColor,
          verifiablePresentation: response.credential,
        });
      }
    }
  };

  return (
    <Card
      mode="outlined"
      style={{...Style.card, backgroundColor: backgroundColor}}
      onPress={handlePress}>
      <Card.Content>
        <View style={Style.actionContainer}>
          <OptionsMenu options={options} index={index} />
        </View>
        <Text style={Style.text}>{cardName}</Text>
      </Card.Content>
    </Card>
  );
};

export default IdCard;
