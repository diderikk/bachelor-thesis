import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text, Title } from 'react-native-paper';
import Style from '../../styles/VerificationPopup.component.style';
import CommonButton from './CommonButton';

interface Props {
    title: string,
    closePopup: () => void,
    description: string,
}

const VerificationPopup : React.FC<Props> = ({title, closePopup, description}) => (
    <ScrollView contentContainerStyle={Style.container}>
        <Title style={Style.title}>{title}</Title>
        <Text style={Style.text}>{description}</Text>
        <CommonButton onPress={closePopup} text={"OK"}></CommonButton>
    </ScrollView>
);

export default VerificationPopup;