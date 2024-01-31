import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {RootStackParamList} from '../../App';
import CommonButton from '../../components/atoms/CommonButton';
import SwitchAttribute from '../../components/atoms/SwitchAttribute';
import Scene from '../../components/molecules/Scene';
import {useDid} from '../../context/DIDContext';
import {useSnackBar} from '../../context/SnackBarContext';
import {
  IdCard,
  instanceOfIdCard,
  instanceOfVerifiableCredential,
} from '../../interfaces/IdCard.interface';
import previewStyles from '../../styles/Preview.scene.style';
import {getId} from '../../utils/secureIdStore';
import {createVerifiablePresentation} from '../../veramo/veramo';
import {VerifiableCredential, VerifiablePresentation} from '@veramo/core';

type Props = NativeStackScreenProps<RootStackParamList, 'Preview'>;

const Preview: React.FC<Props> = ({route, navigation}) => {
  const {dispatch} = useSnackBar();
  const {cardColor, cardName} = route.params;
  const [selected, setSelected] = useState<boolean[]>([]);
  const [idCard, setIdCard] = useState<IdCard>();
  const holderDid = useDid();

  const anySelected = () => {
    return selected.every(value => !value);
  };

  const fetchId = async () => {
    const response = await getId(cardName);
    if (instanceOfIdCard(response)) {
      setIdCard(response);
      const amountOfClaims = Object.keys(
        response.credential.credentialSubject.document,
      ).length;
      setSelected(Array(amountOfClaims).fill(false));
    }
  };

  const handleValueChange = (index: number) => {
    const tempSelected = [...selected];
    tempSelected[index] = !tempSelected[index];
    setSelected(tempSelected);
  };

  const handleSharePressed = async () => {
    if (idCard) {
      dispatch({type: 'loading'});
      let verifiablePresentation: VerifiablePresentation = null!;
      if (instanceOfVerifiableCredential(idCard!.credential))
        verifiablePresentation = await createVerifiablePresentation(
          holderDid!,
          [idCard!.credential as VerifiableCredential],
        );
      else verifiablePresentation = idCard!.credential;
      navigation.navigate('Share', {
        cardColor,
        cardName,
        verifiablePresentation,
      });
    }
  };

  useEffect(() => {
    fetchId();
  }, []);

  return (
    <Scene>
      <View
        style={{...previewStyles.previewContainer, backgroundColor: cardColor}}>
        <View style={previewStyles.attributesContainer}>
          <Text style={previewStyles.cardTitle}>{cardName}</Text>
          {idCard && Object.keys(idCard.credential.credentialSubject.document).map(
              (key, index) => {
                const val = idCard.credential.credentialSubject.document[key];
                return (
                  <SwitchAttribute
                    key={key}
                    attributeName={key}
                    attributeValue={val}
                    index={index}
                    handleValueChange={handleValueChange}
                    value={selected[index]}
                  />
                );
              },
            )}
        </View>
        <CommonButton
          disabled={anySelected()}
          width="100%"
          text="Share selected"
          onPress={handleSharePressed}
        />
      </View>
    </Scene>
  );
};

export default Preview;
