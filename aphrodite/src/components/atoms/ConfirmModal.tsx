import * as React from 'react';
import {View, Modal} from 'react-native';
import {Button, Text} from 'react-native-paper';
import GlobalStyles from '../../styles/Global.styles';
import ConfirmModalStyles from '../../styles/ConfirmModal.component.style';

interface Props {
  title: string;
  subTitle?: string;
  visible: boolean;
  hideModal: () => void;
  callback: () => void;
}

const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  subTitle,
  hideModal,
  callback,
}) => {
	const confirmPress = async () => {
		callback()
		hideModal()
	}
  return (
    <Modal animationType="slide" visible={visible} transparent={true}>
      <View style={ConfirmModalStyles.outerContainer} />
      <View style={ConfirmModalStyles.innerContainer}>
        <Text style={ConfirmModalStyles.title}>{title}</Text>
        <Text style={ConfirmModalStyles.subTitle}>
          {subTitle ? subTitle : ''}
        </Text>
        <View style={ConfirmModalStyles.buttonContainer}>
          <Button
            onPress={hideModal}
            style={{...ConfirmModalStyles.button, backgroundColor: 'lightgrey'}}
            mode="contained">
            <Text style={ConfirmModalStyles.buttonText}>Cancel</Text>
          </Button>
          <Button
            onPress={confirmPress}
            style={{
              ...ConfirmModalStyles.button,
              backgroundColor: GlobalStyles.color.color,
            }}
            mode="contained">
            <Text style={ConfirmModalStyles.buttonText}>Confirm</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
