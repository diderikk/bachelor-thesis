import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as React from 'react';
import {SafeAreaView} from 'react-native';
import {RootStackParamList} from '../../App';
import HomeScreenContainer from '../../components/organisms/HomeScreenContainer'
import {IdCard, instanceOfIdCard} from '../../interfaces/IdCard.interface';
import { SecureIdStoreErrorFeedback } from '../../enums/SecureIdStoreFeedback.enum';
import { getAllIds } from '../../utils/secureIdStore';
import { useSnackBar } from '../../context/SnackBarContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<Props> = ({navigation}) => {
   /*
  TODO we can maybe store this data in a higher component level, to avoid reloading all data
  everytime we reload this component
  */
  const [idCards, setIdCards] = React.useState<IdCard[]>([])
  const {state, dispatch} = useSnackBar();

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      getAllIds().then(res => {
        if(res instanceof Array && !state.fadeOut && idCards.length === 0){
          dispatch({type: 'disabled'})
        }
        if(res instanceof Array && res.every(idCard => instanceOfIdCard(idCard)) && res.length > 0){
          setIdCards(res)
        }
        else if(res === SecureIdStoreErrorFeedback.STORE_ERROR){
          //TODO implement error message
          dispatch({type: 'error', error: 'Store error'})
        }
        else if(res === SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT){
          dispatch({type: 'error', error: 'ID Card list absent'})
        }
      })
    })
    //Removes event listener to focus when to component unmounts
    return unsub
  },[navigation])

  return (
    <SafeAreaView style={{flex: 1}}>
      <HomeScreenContainer idCards={idCards} />
    </SafeAreaView>
  );
};

export default Home;