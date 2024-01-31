import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VerifiableCredential } from '@veramo/core';
import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../../App';
import ENV from '../../config/env';
import { useDid } from '../../context/DIDContext';
import { useSnackBar } from '../../context/SnackBarContext';
import { SecureIdStoreErrorFeedback } from '../../enums/SecureIdStoreFeedback.enum';
import { IdCard } from '../../interfaces/IdCard.interface';
import { saveId } from '../../utils/secureIdStore';

type Props = NativeStackScreenProps<RootStackParamList, 'EmbeddedWeb'>;

const EmbeddedWeb: React.FC<Props> = ({route, navigation}) => {
  const {dispatch} = useSnackBar();
  const [timer, setTimer] = useState<number>(-1);
  const holderDid = useDid();
  const {url, cardName, cardColor} = route.params;

  const getWebSocketURI = () => {
    if (ENV.IS_DEV) return 'ws://10.0.2.2:3000';
    if (url.startsWith('https://')) return 'ws://' + url.substring(8);
    return 'ws://' + url.substring(7);
  };

  const connectWebSocket = async () => {
    const ws = new WebSocket(getWebSocketURI());
    ws.onopen = () => {
      setTimer(-1);
      dispatch({type: 'disabled'});
    };
    ws.onmessage = async event => {
      dispatch({type: 'loading'});
      const vc: VerifiableCredential = JSON.parse(event.data);
      await handleReceivedCredential(vc);

      ws.send('recieved');
      ws.close();
    };
  };

  const handleReceivedCredential = async (vc: VerifiableCredential) => {
    const idCard: IdCard = {
      nickname: cardName,
      colorCode: cardColor,
      credential: vc,
    };

    const res = await saveId(idCard);
    switch (res) {
      case SecureIdStoreErrorFeedback.SUCCESS:
        dispatch({type: 'success', description: 'ID was added'});
        navigation.navigate('Home');
        break;
      //TODO handle errors
      case SecureIdStoreErrorFeedback.ID_NICKNAME_OCCUPIED:
        dispatch({type: 'error', error: 'Nickname occupied'});
        break;
      case SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT:
        dispatch({type: 'error', error: 'ID_CARD_LIST_ABSENT'});
        break;
      case SecureIdStoreErrorFeedback.STORE_ERROR:
        dispatch({type: 'error', error: 'Store error'});
        break;
    }
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (timer < 0) {
      return;
    }
    if (timer === 0) {
      dispatch({type: 'error', error: 'Took too long time'});
      navigation.navigate('Home');
      return;
    }
    const timeout = setTimeout(() => {
      connectWebSocket();
      setTimer(prevTime => prevTime - 1);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [timer]);

  return (
    <WebView
      source={{
        uri: `${
          ENV.IS_DEV ? 'http://10.0.2.2:3000/' : url
        }?did=${holderDid}`,
      }}
      onNavigationStateChange={newState => {
        if (!newState.loading) {
          setTimer(60)
          dispatch({type: 'disabled'});
        }
      }}
    />
  );
};

export default EmbeddedWeb;
