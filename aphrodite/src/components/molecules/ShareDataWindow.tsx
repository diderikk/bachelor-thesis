import * as React from 'react';
import {NavigationContext} from '@react-navigation/native';
import {View} from 'react-native';
import Scene from './Scene';
import ShareDataStyles from '../../styles/ShareData.component.style';
import GlobalStyles from '../../styles/Global.styles';
import {Text} from 'react-native-paper';
import CommonButton from '../atoms/CommonButton';
import {ScrollView} from 'react-native-gesture-handler';
import Accordion from '../atoms/Accordion';
import {
  IdCard,
  instanceOfVerifiableCredential,
} from '../../interfaces/IdCard.interface';
import KeyValues from '../../interfaces/KeyValues.interface';
import {useSnackBar} from '../../context/SnackBarContext';
import {VerifiableCredential} from '@veramo/core';
import {createVerifiablePresentation} from '../../veramo/veramo';
import {useDid} from '../../context/DIDContext';

interface Props {
  idCards: IdCard[];
}

const ShareDataWindow: React.FC<Props> = ({idCards}) => {
  const {dispatch} = useSnackBar();
  const navigation = React.useContext(NavigationContext);
  const holderDid = useDid();
  const [selectedAttributes, setSelectedAttributes] = React.useState<
    boolean[][]
  >(() => {
    if (idCards) {
      idCards = idCards.filter(
        card => instanceOfVerifiableCredential(card.credential),
      );
      return Array(idCards.length)
        .fill([])
        .map((_arr, index) =>
          Array(
            Object.keys(idCards![index].credential.credentialSubject.document)
              .length,
          ).fill(false),
        );
    }
    return [[]];
  });
  const [foldedCards, setFoldedCards] = React.useState<boolean[]>(() => {
    if (idCards) {
      idCards = idCards.filter(
        card => instanceOfVerifiableCredential(card.credential),
      );
      return Array(idCards.length).fill(false);
    }
    return [];
  });

  const handleFoldedChange = (cardIndex: number) => {
    setFoldedCards(prevFolded => {
      const newFolded = [...prevFolded];
      newFolded[cardIndex] = !newFolded[cardIndex];
      return newFolded;
    });
  };
  const anySelected = () => {
    return selectedAttributes.every(arr => arr.every(selected => !selected));
  };

  // TODO: Can be used for SDR if implemented later
  const getSelectedClaims = () => {
    const selectedClaims: KeyValues = {};
    idCards!
      .filter(idCard => instanceOfVerifiableCredential(idCard.credential))
      .forEach((idCard, cardIndex) => {
        Object.keys(idCard.credential.credentialSubject.document)
          .filter((_key, attrIndex) => selectedAttributes[cardIndex][attrIndex])
          .forEach(key => {
            const value = idCard.credential.credentialSubject.document[key];
            // TODO: Perhaps remove line below, mainly for testing
            key = `${idCard.credential.issuer.name}: ${key}`;
            selectedClaims[key] = value;
          });
      });
    return selectedClaims;
  };

  const getSelectedCredentials = (): VerifiableCredential[] => {
    return idCards!
      .filter(
        (idCard, cardIndex) =>
          instanceOfVerifiableCredential(idCard.credential) &&
          selectedAttributes[cardIndex].includes(true),
      )
      .map(idCard => idCard.credential as VerifiableCredential);
  };

  const handleSharePressed = async () => {
    dispatch({type: 'loading'});
    idCards = idCards!.filter(card => instanceOfVerifiableCredential(card.credential));
    setFoldedCards(Array(idCards.length).fill(false));
    const selectedCredentials = getSelectedCredentials();
    const verifiablePresentation = await createVerifiablePresentation(
      holderDid!,
      selectedCredentials,
    );
    navigation!.navigate('Share', {
      verifiablePresentation,
      cardColor: GlobalStyles.color.secondaryColor,
      cardName: 'Share data',
    });
  };

  const handleSavePressed = async () => {
    idCards = idCards!.filter(card => instanceOfVerifiableCredential(card.credential));
    setFoldedCards(Array(idCards.length).fill(false));
    const selectedCredentials = getSelectedCredentials();
    const verifiablePresentation = await createVerifiablePresentation(
      holderDid!,
      selectedCredentials,
    );
    navigation!.navigate('SavePreset', verifiablePresentation);
  };

  const handleSelectChange = React.useCallback(
    (idCardIndex: number, attributeIndex: number) => {
      setSelectedAttributes(prevSelected => {
        const newSelected = [...prevSelected];

        newSelected[idCardIndex][attributeIndex] =
          !newSelected[idCardIndex][attributeIndex];

        return newSelected;
      });
    },
    [selectedAttributes],
  );

  const idCardsJSX = idCards
    ?.filter(card => instanceOfVerifiableCredential(card.credential))
    .map((card, index) => (
      <Accordion
        key={index}
        cardIndex={index}
        cardTitle={card.nickname}
        attributes={card.credential.credentialSubject.document}
        selectedAttributes={selectedAttributes[index]}
        handleSelectChange={handleSelectChange}
        folded={foldedCards[index]}
        handleFold={handleFoldedChange}
      />
    ));

  return (
    <Scene>
      {idCards ? (
        <View style={ShareDataStyles.shareDataContainer}>
          <View style={ShareDataStyles.attributesContainer}>
            <Text style={ShareDataStyles.title}>Share data</Text>
            <Text style={ShareDataStyles.subTitle}>Data:</Text>
            <ScrollView>{idCardsJSX}</ScrollView>
          </View>
          <View style={ShareDataStyles.buttonsContainer}>
            <CommonButton
              disabled={anySelected()}
              width="50%"
              text="Share"
              onPress={handleSharePressed}
            />
            <CommonButton
              disabled={anySelected()}
              width="50%"
              text="Save"
              onPress={handleSavePressed}
            />
          </View>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No IDs to gather data from.</Text>
        </View>
      )}
    </Scene>
  );
};

export default ShareDataWindow;
