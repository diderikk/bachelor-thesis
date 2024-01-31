import { NavigationContext } from '@react-navigation/native';
import * as React from 'react';
import { Text, View } from 'react-native';
import { Provider, Title } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSnackBar } from '../../context/SnackBarContext';
import IdProviderSelectListOption from '../../interfaces/IdProviderSelectListOption.interface';
import ProviderDropdown from '../../interfaces/ProviderDropdown.interface';
import ProviderResponse from '../../interfaces/ProviderResponse.interface';
import Style from '../../styles/AddIdForm.component.style';
import { fetchProviders } from '../../utils/fetchActions';
import ColorPicker from '../atoms/ColorPicker';
import CommonButton from '../atoms/CommonButton';
import FormInput from '../molecules/FormInput';
import Scene from '../molecules/Scene';

const AddIdForm: React.FC = () => {
  const navigation = React.useContext(NavigationContext);
  const [name, setName] = React.useState<string>();
  const [nameErrorMessage, setNameErrorMessage] = React.useState<string>('');
  const [providerErrorMessage, setProviderErrorMessage] =
    React.useState<string>('');
  const {dispatch} = useSnackBar();
  const handleInputChange = (name: string) => {
    setName(name);
  };

  const handleValidation = () => {
    if (name && nameErrorMessage) setNameErrorMessage('');
    else if (!name) setNameErrorMessage('*Must fill in the name');
  };

  // The selected provider from the dropdown list
  const [provider, setProvider] = React.useState<ProviderResponse>();
  // The selected color of the card
  const [color, setColor] = React.useState<string>('#FF0000');
  // Full providers list, fetched from the server
  const [providers, setProviders] = React.useState<ProviderResponse[]>([]);
  // List of providers with icons that is used in the dropdown list display
  const [providerDropdownList, setProviderDropdownList] = React.useState<
    ProviderDropdown[]
  >([]);

  const getProviders = async () => {
    const responses = await fetchProviders();
    setProviders(responses);
  };

  // This is called once at the start
  React.useEffect(() => {
    getProviders();
  }, []);

  // This is called each time providers updates
  React.useEffect(() => {
    const temp: ProviderDropdown[] = [];
    providers.map(provider => {
      temp.push({title: provider.issuerName});
    });
    setProviderDropdownList(temp);
  }, [providers]);

  const onPress = async () => {
    if (name && nameErrorMessage) setNameErrorMessage('');
    if (provider && providerErrorMessage) setProviderErrorMessage('');

    if (!name || !provider || !color) {
      if (!name) setNameErrorMessage('*Must fill in the name');
      if (!provider) setProviderErrorMessage('*Must select a provider');
      return;
    }
    dispatch({type: 'loading'});

    navigation?.navigate('EmbeddedWeb', {
      url: provider.url,
      cardName: name,
      cardColor: color,
    });
  };

  return (
    <Scene>
      <Provider>
        <Title style={Style.title}>Add ID</Title>
        <FormInput
          value={''}
          label="Name"
          placeHolder="Name"
          onChangeText={handleInputChange}
          error={undefined}
          onBlur={handleValidation}
          right={''}
          errorMessage={''}
          secureText={false}
          style={Style.nameInput}></FormInput>
        <Text style={Style.error}>{nameErrorMessage}</Text>
        <SelectDropdown
          data={providerDropdownList}
          onSelect={(selectedItem: IdProviderSelectListOption, index) => {
            setProvider(providers[index]);
            if (!selectedItem)
              setProviderErrorMessage('*Must select a provider');
            if (selectedItem && providerErrorMessage)
              setProviderErrorMessage('');
          }}
          renderCustomizedButtonChild={(selectedItem, index) => {
            return (
              <View style={Style.outterElement}>
                <View style={Style.element}>
                  <Text>
                    {selectedItem ? selectedItem.title : 'Select provider'}
                  </Text>
                </View>
                <View style={Style.dropdownLogo}>
                  <Icon style={Style.logo} name="chevron-down" size={15} />
                </View>
              </View>
            );
          }}
          renderCustomizedRowChild={(item, index) => {
            return (
              <View style={Style.element}>
                <Text>{item.title}</Text>
              </View>
            );
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={Style.dropdownButton}
          buttonTextStyle={Style.dropdownText}
          defaultButtonText={'Select provider...'}
          dropdownIconPosition={'left'}
        />
        <Text style={Style.error}>{providerErrorMessage}</Text>
        <Text style={Style.text}>Select card color:</Text>
        <View style={{backgroundColor: color}} />
        <ColorPicker setColor={setColor} style={Style.colorPicker} />
        <CommonButton
          onPress={onPress}
          text={'Connect'}
          width={'90%'}></CommonButton>
      </Provider>
    </Scene>
  );
};

export default AddIdForm;
