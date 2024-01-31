import React from "react";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import globalStyles from "../../styles/Global.styles"

interface Props {
	value: string;
	onChangeText: (param: string) => void;
	onBlur: () => void;
	right: React.ReactNode;
	error?: boolean;
	label: string;
	placeHolder: string;
	errorMessage: string;
  secureText: boolean;
  style: {},
}

const FormInput: React.FC<Props> = ({value, onChangeText, onBlur, right, error, errorMessage, label, placeHolder, secureText, style}) => {
  return (
    <View style={globalStyles.textInputView}>
      <TextInput
        mode="outlined"
        autoCapitalize="none"
        label={label}
        defaultValue={value}
        secureTextEntry={secureText}
        placeholder={placeHolder}
        style={style}
        onChangeText={newPasscode => onChangeText(newPasscode)}
        error={error}
        onBlur={() => onBlur()}
        right={
          right
        }
        activeOutlineColor={globalStyles.color.color}
      />
      <Text style={globalStyles.errorText}>
        {error && errorMessage}
      </Text>
    </View>
  );
};


export default FormInput;