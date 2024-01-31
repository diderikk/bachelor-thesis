import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VerifiableCredential, VerifiablePresentation } from '@veramo/core';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { OrientationLocker, PORTRAIT } from "react-native-orientation-locker";
import UserInactivity from 'react-native-user-inactivity';
import SnackBar from './components/atoms/SnackBar';
import Scene from './components/molecules/Scene';
import ENV from './config/env';
import { DidProvider } from './context/DIDContext';
import { useIsPINCodeSetContext, useIsPINCodeSetUpdateContext } from './context/isPINCodeSetContext';
import { SnackBarProvider } from './context/SnackBarContext';
import AddId from './scenes/add_id/AddId';
import EditId from './scenes/edit_id/EditId';
import EmbeddedWeb from './scenes/embedded_web/EmbeddedWeb';
import Greeting from './scenes/greeting/Greeting';
import Home from './scenes/home/Home';
import Login from './scenes/login/Login';
import Preview from './scenes/preview/Preview';
import PINRegistration from './scenes/registration/PINRegistration';
import SavePreset from './scenes/save_preset/SavePreset';
import Share from './scenes/share/Share';
import { createIdCardList } from './utils/secureIdStore';
import { resetDevice, userExists } from './utils/securePasswordStore';

export type RootStackParamList = {
  Greeting: undefined;
  Registration: undefined;
  Home: undefined;
  AddId: undefined;
  Login: undefined;
  Preview: {
    cardColor: string;
    cardName: string;
    verifiableCredential: VerifiableCredential;
  };
  Share: {
    verifiablePresentation: VerifiablePresentation;
    cardName: string;
    cardColor: string;
  };
  SavePreset: VerifiablePresentation;
  EditId: {
    cardColor: string;
    cardName: string;
  };
  EmbeddedWeb: {
    url: string;
    cardName: string;
    cardColor: string;
  };
};

const App = () => {
  const navigationRef = useNavigationContainerRef();
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const PINCodeSet = useIsPINCodeSetContext()
  const setPINCodeSet = useIsPINCodeSetUpdateContext()

  useEffect(() => {
    if(ENV.RESET_APPLICATION_ON_STARTUP) resetDevice();
    hasUserSetPinCode();
    createIdCardList();
  }, []);

  const hasUserSetPinCode = async () => {
    setPINCodeSet!(await userExists());
    setIsLoading(false);
  };

  LogBox.ignoreAllLogs();
  if (isLoading) return <Scene />;
  //NB! Even though navigationRef.navigate("Login") may display an error in some IDEs it is the only way to make it work.
  //The team has tried to follow the documentation displayed and the error messages, but none of those methods work.
  return (
      <UserInactivity timeForInactivity={300000} onAction={isActive => { if(!isActive && PINCodeSet) navigationRef.navigate("Login")}} style={{ flex: 1 }}>
        <OrientationLocker orientation={PORTRAIT}/>
        <DidProvider>
          <SnackBarProvider>
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator>
                {PINCodeSet && (
                  <Stack.Screen
                    name="Login"
                    key="Login"
                    component={Login}
                    options={{
                      headerShown: false,
                      animationTypeForReplace: 'pop',
                      gestureEnabled: true,
                    }}
                  />
                )}
                <Stack.Screen
                  name="Greeting"
                  component={Greeting}
                  options={{
                    headerShown: false,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                  }}
                />
                <Stack.Screen
                  name="Registration"
                  component={PINRegistration}
                  options={{
                    headerBackVisible: true,
                    headerTitleAlign: 'center',
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                  }}
                />

                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{
                    headerShown: false,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                  }}
                />

                <Stack.Screen
                  name="AddId"
                  component={AddId}
                  options={{
                    headerShown: true,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                    headerTitle: '',
                  }}
                />
                <Stack.Screen
                  name="Preview"
                  component={Preview}
                  options={{
                    headerShown: true,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                    headerTitle: '',
                  }}
                />

                <Stack.Screen
                  name="Share"
                  component={Share}
                  options={{
                    headerShown: true,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                    headerTitle: '',
                  }}
                />

                <Stack.Screen
                  name="SavePreset"
                  component={SavePreset}
                  options={{
                    headerShown: true,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                    headerTitle: '',
                  }}
                />

                <Stack.Screen
                  name="EditId"
                  component={EditId}
                  options={{
                    headerShown: true,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                    headerTitle: '',
                  }}
                />

                <Stack.Screen
                  name="EmbeddedWeb"
                  component={EmbeddedWeb}
                  options={{
                    headerShown: true,
                    animationTypeForReplace: 'pop',
                    gestureEnabled: true,
                    headerTitle: '',
                  }}
                />
              </Stack.Navigator>
            </NavigationContainer>
            <SnackBar />
          </SnackBarProvider>
        </DidProvider>
      </UserInactivity>
  );
};

export default App;
