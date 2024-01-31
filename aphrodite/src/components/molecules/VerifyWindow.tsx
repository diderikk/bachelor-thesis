import * as React from 'react';
import { View } from 'react-native';
import BarcodeMask from 'react-native-barcode-mask';
import { Barcode, RNCamera } from 'react-native-camera';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import IdVerificationStatus from '../../enums/IdVerificationStatus.enum';
import globalStyles from '../../styles/Global.styles';
import { handleId } from '../../utils/id';
import { toString } from '../../utils/keyValues';
import VerificationPopup from '../atoms/VerificationPopup';

/*
  The shouldRender prop is used to determine if the camera component
  should be rendered or not. Since VerifyWindow is being used in a
  BottomNavigation component as a scene in HomeScreenContainer.tsx,
  we don't want the camera to render when the specific window is not
  selected. The boolean can help determine if the right index of a
  scene is selected, and only then render the camera component. This
  was necessary to implement to remove unnecessary permission popups each 
  time a new scene was selected or rendered from BottomNavigation.
*/
interface Props {
  shouldRender: boolean,
}

const VerifyWindow: React.FC<Props> = ({shouldRender}) => {
  const def = React.useRef<RNCamera | null> (null);

  // State of the last scanned barcode
  const [barcode, setBarcode] = React.useState<Barcode>();
  const [title, setTitle] = React.useState<string>("");
  const [data, setData] = React.useState<string>("Loading...");
  const [showPopup, setShowPopup] = React.useState<boolean>(false);

  const openPopup = () => {
    const localData = barcode!.data;
      (async () => {
        if(localData){
          const status = await handleId(localData)
          setTitle(status.status)
          if(status.status === IdVerificationStatus.SUCCESS) setData(toString(status.data))
          else setData("");
        }
      })()
      setShowPopup(true);
  }
  const closePopup = () => {
    setShowPopup(false);
    setTitle("");
    setData("Loading...");
  }

  // Every time barcode changes, this effect is called
  React.useEffect(() => {
    // Change QR scanner edge color depending if barcode is available
    if(barcode){
      openPopup();
    }
  }, [barcode])

  return (
    <SafeAreaView style={{flex: 1}}>
      { !showPopup ?
      <SafeAreaView style={{flex: 1}}>      
        {
          shouldRender ? <RNCamera
          ref={ref => {
            def.current = ref;
          }}
          style={{
            flex: 1,
          }}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          captureAudio={false}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            setBarcode(barcodes.pop());
          }}
          >
            <BarcodeMask edgeColor={globalStyles.color.color} width={300} height={300} useNativeDriver={true}/>
          </RNCamera> :
          <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}><Text>"Cannot access the camera"</Text></View>
        }
      </SafeAreaView>
      :
      <VerificationPopup title={title} closePopup={closePopup} description={data}></VerificationPopup>
      }
    </SafeAreaView>
  );
};

export default VerifyWindow;