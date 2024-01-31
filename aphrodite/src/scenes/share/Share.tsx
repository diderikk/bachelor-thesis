import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Scene from '../../components/molecules/Scene';
import {View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ShareStyles from '../../styles/Share.scene.style';
import PreviewStyles from '../../styles/Preview.scene.style';
import {Text} from 'react-native-paper';
import {useSnackBar} from '../../context/SnackBarContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Share'>;

const Share: React.FC<Props> = ({route}) => {
  const {dispatch} = useSnackBar();
  const {cardName, cardColor, verifiablePresentation} = route.params;

  React.useEffect(() => {
    dispatch({type: 'disabled'});
  }, []);

  return (
    <Scene>
      <View
        style={{...PreviewStyles.previewContainer, backgroundColor: cardColor}}>
        <View style={PreviewStyles.attributesContainer}>
          <Text style={PreviewStyles.cardTitle}>{cardName}</Text>
          {verifiablePresentation.verifiableCredential &&
            verifiablePresentation.verifiableCredential.map(key => (
              <Text
                key={key.credentialSubject.id}
                style={ShareStyles.attributeText}>
                {key.issuer.name}
              </Text>
            ))}
        </View>
        <View style={ShareStyles.QRContainer}>
          <QRCode value={verifiablePresentation.proof.jwt} size={300} />
        </View>
      </View>
    </Scene>
  );
};

export default Share;
