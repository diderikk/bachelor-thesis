import { NavigationContext } from '@react-navigation/native';
import * as React from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import OpenContext from '../../context/OpenContext';
import { useSnackBar } from '../../context/SnackBarContext';
import { SecureIdStoreErrorFeedback } from '../../enums/SecureIdStoreFeedback.enum';
import { IdCard as IdCardInterface } from '../../interfaces/IdCard.interface';
import { deleteId as deleteIdBackend } from '../../utils/fetchActions';
import { deleteId } from '../../utils/secureIdStore';
import AddButton from '../atoms/AddButton';
import ConfirmModal from '../atoms/ConfirmModal';
import IdCard from '../atoms/IdCard';
import SearchBar from '../atoms/SearchBar';

interface Props {
  idCards: IdCardInterface[];
  removeIdCard: (idNickname: string) => void;
}

const WalletWindow: React.FC<Props> = ({idCards, removeIdCard}) => {
  const navigation = React.useContext(NavigationContext);
  const {dispatch} = useSnackBar();
  //They can be here for now, but if the search is to be saved when switching windows it has to be at a higher level
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [optionsOpen, setOptionsOpen] = React.useState<boolean[]>(() => {
    if (idCards) {
      Array(idCards.length).fill(false);
    }
    return [];
  });

  const [showConfirmModal, setShowConfirmModal] =
    React.useState<boolean>(false);
  const [modalConfirmCallback, setModalConfirmCallback] = React.useState<
    () => void
  >(() => {});

  const open = (index: number) => {
    setOptionsOpen(prevList => {
      const newList = Array(prevList.length).fill(false);
      newList[index] = true;
      return newList;
    });
  };

  const closeAllOptions = () => {
    if (idCards) setOptionsOpen(Array(idCards.length).fill(false));
  };

  const anyOpen = () => !optionsOpen.every(open => !open);

  const value = React.useMemo(
    () => ({
      optionsOpen,
      open,
      closeAllOptions,
      anyOpen,
    }),
    [optionsOpen],
  );

  const handleTouch = () => {
    if (value.anyOpen()) value.closeAllOptions();
  };

  const deleteIdCard = async (cardName: string, documentDid: string) => {
    const callback = async () => {
      dispatch({type: 'loading'})

      const result = await deleteIdBackend(documentDid);
      if(!result) {
        dispatch({type: 'error', error: 'Could not delete ID'})
        return;
      } 

      const res = await deleteId(cardName);
      switch (res) {
        case SecureIdStoreErrorFeedback.SUCCESS:
          dispatch({type: 'success', description: 'ID deleted'})
          break;
        //TODO: handle errors
        case SecureIdStoreErrorFeedback.ID_ABSENT:
          dispatch({type: 'error', error: 'Could not find ID'})
          break;
        case SecureIdStoreErrorFeedback.DEFAULT_ID_CARD_LIST_ABSENT:
          dispatch({type: 'error', error: 'ID_CARD_LIST_ABSENT'})
          break;
        case SecureIdStoreErrorFeedback.STORE_ERROR:
          dispatch({type: 'error', error: 'Store error'})
          break;
        default:
          console.log('Default called');
          break;
      }
    };

    showModal(callback);
  };

  const showModal = (callback: () => void) => {
    setModalConfirmCallback(() => callback);
    setShowConfirmModal(true);
  };

  const hideModal = () => {
    setModalConfirmCallback(() => () => {});
    setShowConfirmModal(false);
  };

  const onAddButtonPress = () => {
    navigation?.navigate('AddId');
  };

  const idCardsJSX = idCards
    .filter(idCard =>
      idCard.nickname.toLowerCase().startsWith(searchQuery.toLowerCase()),
    )
    .map((idCard, index) => {
      return (
        <IdCard
          key={idCard.nickname}
          backgroundColor={idCard.colorCode}
          cardName={idCard.nickname}
          documentDid={idCard.credential.id!}
          index={index}
          removeIdCard={deleteIdCard}
        />
      );
    });

  return (
    <SafeAreaView style={{flex: 1}}>
      <ConfirmModal
        subTitle="Do you really want to delete this ID? This process cannot be undone"
        title="Are you sure?"
        visible={showConfirmModal}
        hideModal={hideModal}
        callback={modalConfirmCallback}
      />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFocus={handleTouch}
      />
      <TouchableWithoutFeedback
        style={{height: '100%'}}
        onPress={() => handleTouch()}>
        <View style={{height: '100%'}}>
          <OpenContext.Provider value={value}>
            {idCards.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>No IDs available</Text>
              </View>
            ) : (
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={{flex: 1}}>
                {idCardsJSX}
              </ScrollView>
            )}
          </OpenContext.Provider>
        </View>
      </TouchableWithoutFeedback>

      <AddButton onPress={onAddButtonPress} />
    </SafeAreaView>
  );
};

export default WalletWindow;
