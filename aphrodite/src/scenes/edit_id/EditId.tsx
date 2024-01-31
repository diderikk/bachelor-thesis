import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {View} from 'react-native';
import {Provider, Text} from 'react-native-paper';
import {RootStackParamList} from '../../App';
import ColorPicker from '../../components/atoms/ColorPicker';
import CommonButton from '../../components/atoms/CommonButton';
import FormInput from '../../components/molecules/FormInput';
import Scene from '../../components/molecules/Scene';
import { useSnackBar } from '../../context/SnackBarContext';
import {SecureIdStoreErrorFeedback} from '../../enums/SecureIdStoreFeedback.enum';
import EditIdStyles from '../../styles/EditId.scene.style';
import {editId} from '../../utils/secureIdStore';

type Props = NativeStackScreenProps<RootStackParamList, 'EditId'>;

const EditId: React.FC<Props> = ({route, navigation}) => {
  const {cardName, cardColor} = route.params;
  const [newCardName, setNewCardName] = React.useState<string>(cardName);
  const [cardNameError, setCardNameError] = React.useState<string>('');
  const [newCardColor, setNewCardColor] = React.useState<string>(cardColor);
  const {dispatch} = useSnackBar();

  const handleInputChange = (newText: string) => {
    setNewCardName(newText);
  };

  const handleValidation = () => {
    if (newCardName && cardNameError) setCardNameError('');
    else if (!newCardName) setCardNameError('*Must fill in the card name');
  };

  const handleColorChange = (color: string) => {
    setNewCardColor(color);
  };

  const handleConfirmPress = async () => {
    dispatch({type: 'loading'})
    const editReponse = await editId(cardName, newCardColor, newCardName);

    switch (editReponse) {
      case SecureIdStoreErrorFeedback.SUCCESS:
        dispatch({type: 'success', description: 'ID edited'})
        navigation.navigate('Home');
        break;
      case SecureIdStoreErrorFeedback.ID_NICKNAME_OCCUPIED:
        dispatch({type: 'error', error: 'Card name occupied'})
        break;
      case SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT:
        dispatch({type: 'error', error: 'ID_CARD_LIST_ABSENT'})
        break;
      case SecureIdStoreErrorFeedback.STORE_ERROR:
        dispatch({type: 'error', error: 'Store error'})
        break;
      case SecureIdStoreErrorFeedback.ID_ABSENT:
        dispatch({type: 'error', error: 'Couldn not find ID'})
        break;
    }
  };

	const disableConfirm = ():boolean => {
		if(newCardName.length === 0) return true;
		if(newCardName === cardName && newCardColor === cardColor) return true;
		return false;
	}

  return (
    <Scene>
      <Provider>
        <View style={EditIdStyles.container}>
          <Text style={EditIdStyles.title}>Save preset</Text>
          <FormInput
            value={newCardName}
            label="Card name"
            placeHolder="Card name"
            onChangeText={handleInputChange}
            error={cardNameError.length > 0}
            onBlur={handleValidation}
            right={''}
            errorMessage={cardNameError}
            secureText={false}
            style={EditIdStyles.input}
          />
        </View>
        <ColorPicker
          setColor={handleColorChange}
          color={newCardColor}
          style={EditIdStyles.colorPicker}
        />
        <CommonButton disabled={disableConfirm()} onPress={handleConfirmPress} text="Confirm" />
      </Provider>
    </Scene>
  );
};

export default EditId;
