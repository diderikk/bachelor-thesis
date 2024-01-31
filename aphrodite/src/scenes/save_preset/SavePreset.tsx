import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import {View} from 'react-native';
import {Provider, Text} from 'react-native-paper';
import { RootStackParamList } from '../../App';
import ColorPicker from '../../components/atoms/ColorPicker';
import CommonButton from '../../components/atoms/CommonButton';
import FormInput from '../../components/molecules/FormInput';
import Scene from '../../components/molecules/Scene';
import { useSnackBar } from '../../context/SnackBarContext';
import { SecureIdStoreErrorFeedback } from '../../enums/SecureIdStoreFeedback.enum';
import { IdCard } from '../../interfaces/IdCard.interface';
import SavePresetStyles from '../../styles/SavePreset.scene.styles';
import { saveId } from '../../utils/secureIdStore';

type Props = NativeStackScreenProps<RootStackParamList, 'SavePreset'>;

const SavePreset: React.FC<Props> = ({route, navigation}) => {
  const {dispatch} = useSnackBar();
  const [cardName, setCardName] = React.useState<string>('');
  const [color, setColor] = React.useState<string>('#FF0000');
  const [cardNameError, setCardNameError] = React.useState<string>('');
	const verifiablePresentation = route.params

  const handleInputChange = (param: string) => {
    setCardName(param);
  };

  const handleValidation = () => {
    if (cardName && cardNameError) setCardNameError('');
    else if (!cardName) setCardNameError('*Must fill in the card name');
  };

  const selectColor = (color: string) => {
    setColor(color);
  };

	const handleSavePress = async () => {
    dispatch({type: 'loading'})
		const idCard: IdCard = {
			nickname: cardName,
			credential: verifiablePresentation,
			colorCode: color,
		}

		const res = await saveId(idCard)
      switch (res){
        case SecureIdStoreErrorFeedback.SUCCESS:
          dispatch({type: 'success', description: 'Saved preset'})
          navigation.navigate("Home");
          break
        case SecureIdStoreErrorFeedback.ID_NICKNAME_OCCUPIED:
          dispatch({type: 'error', error: 'Card name occupied'})
          break
        case SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT:
          dispatch({type: 'error', error: 'ID_CARD_LIST_ABSENT'})
          break
        case SecureIdStoreErrorFeedback.STORE_ERROR:
          dispatch({type: 'error', error: 'Store error'})
          break
      }
	}

  return (
    <Scene>
      <Provider>
        <View style={SavePresetStyles.container}>
          <Text style={SavePresetStyles.title}>Save preset</Text>
          <FormInput
            value={cardName}
            label="Card name"
            placeHolder="Card name"
            onChangeText={handleInputChange}
            error={cardNameError.length > 0}
            onBlur={handleValidation}
            right={''}
            errorMessage={cardNameError}
            secureText={false}
            style={SavePresetStyles.input}
          />
					
        </View>
				<Text style={SavePresetStyles.text}>Select card color:</Text>
          <ColorPicker
            setColor={selectColor}
            style={SavePresetStyles.colorPicker}
          />
					<CommonButton disabled={cardName.length === 0} onPress={handleSavePress} text='Save preset'/>
      </Provider>
    </Scene>
  );
};

export default SavePreset;
