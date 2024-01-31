import { NavigationContext } from '@react-navigation/native';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import MMKVStorage, { useMMKVStorage } from "react-native-mmkv-storage";
import { Text } from 'react-native-paper';
import { useDidUpdate } from '../../context/DIDContext';
import { useSnackBar } from '../../context/SnackBarContext';
import { SecurePasswordStoreErrorFeedback } from '../../enums/SecurePasswordStoreErrorFeedback.enum';
import styles from '../../styles/Global.styles';
import PINStyles from '../../styles/PIN.component.style';
import { signUp, verify } from '../../utils/securePasswordStore';
import PINBalls from '../atoms/PINBalls';
import PINButton from '../atoms/PINButton';
import PINDeleteButton from '../atoms/PINDeleteButton';

interface Props {
  status: 'choose' | 'enter' | 'locked';
  titleProp: string;
  finishProcess: () => void;
}

// Data storage used to save data needed for locking of application
const storage = new MMKVStorage.Loader().initialize();

const PIN: React.FC<Props> = ({finishProcess, status, titleProp}) => {
  const navigation = React.useContext(NavigationContext);
  const setWalletDid = useDidUpdate()
  const [subtitleError, setSubtitleError] = useState<string>('');
  const [PINCode, setPINCode] = useState<number[]>([
    -1, -1, -1, -1, -1, -1, -1, -1,
  ]);
  const [chosenPIN, setChosenPIN] = useState<string>('');
  const [title, setTitle] = useState<string>(titleProp);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [lockTimer, setLockTimer] = useState<number>(0);
  // Using MMKV storage Hooks like a state. Setting its value will also change its value in storage
  const [lockedUntil, setLockedUntil] = useMMKVStorage<string>("lockedUntil", storage, "");
  const [timeouts, setTimeouts] = useMMKVStorage<number>("timeouts", storage, 0);
  const {dispatch} = useSnackBar();

  // This is called once at the start
  useEffect(() => {
    if(lockedUntil && lockedUntil !== "") {
      const lock = moment(lockedUntil, "DD-MM-YYYY HH:mm:ss Z");
      const diff = lock.diff(moment(), "seconds");
      // If lockedUntil is in the future, login must still be locked
      if(diff > 0) {
        setTitle('Locked');
        setSubtitleError('');
        setLockTimer(diff);
      }
      // If 1 hour has passed after lockedUntil, reset timeouts
      if(diff > -3600) {
        setTimeouts(+timeouts!);
      }
      else {
        setTimeouts(0);
      }
    }
  }, []);

  useEffect(() => {
    const rerender = navigation?.addListener('focus', () => {
      resetPIN();
    });
    return rerender;
  }, [navigation]);

  // Empties all PIN balls
  const resetPIN = () => {
    setPINCode([-1, -1, -1, -1, -1, -1, -1, -1]);
  };

  // Run when a user has chosen and confirmed their PIN
  // Stores the PIN code
  const handleStorePIN = async (password: string): Promise<boolean> => {
    dispatch({type: 'loading'})
    const response = await signUp(password);
    if(typeof response === 'string'){
      setWalletDid!(response)
      dispatch({type: 'success', description: 'Signed up!'})
      return true
    }
    switch (response) {
      case SecurePasswordStoreErrorFeedback.PBKDF2_ERROR:
        setSubtitleError('Internal error');
        break;
      case SecurePasswordStoreErrorFeedback.USER_ALREADY_EXISTS:
        setSubtitleError('User already exists');
        break;
      case SecurePasswordStoreErrorFeedback.STORE_ERROR:
        setSubtitleError('Internal error');
        break;
      default:
        setSubtitleError("Error")
        break;
    }
    dispatch({type: 'disabled'})
    return false
  };

  // Used when a user is choosing a PIN code
  const handleChoosePIN = async () => {
    // After first entering a PIN code, "change page" to confirm PIN code
    if (!chosenPIN) {
      setChosenPIN(PINCode.join(''));
      resetPIN();
      setTitle('Confirm PIN code');
      return;
    }
    // After confirming PIN code
    const confirmedPIN = PINCode.join('');
    if (confirmedPIN !== chosenPIN) {
      setChosenPIN('');
      resetPIN();
      setSubtitleError('PIN codes did not match, try again');
      setTitle(titleProp);
      return;
    }
    // Confirm PIN code === Chosen PIN code
    if (await handleStorePIN(chosenPIN)) {
      finishProcess();
    } else {
      setChosenPIN('');
      resetPIN();
      setTitle(title);
    }
  };

  // Used after a PIN code has been stored
  const handleEnterPIN = async () => {
    const enteredPINCode = PINCode.join('');
    if (await verifyEnterPIN(enteredPINCode)) {
      finishProcess();
    } else {
      resetPIN();
    }
  };

  // Validates entered PIN code with the stored PIN code
  const verifyEnterPIN = async (password: string): Promise<boolean> => {
    dispatch({type: 'loading'})
    const response = await verify(password);
    if(typeof response === 'string'){
      setWalletDid!(response)
      return true
    }
    switch (response) {
      case SecurePasswordStoreErrorFeedback.WRONG_PASSWORD:
        if (wrongCount >= 2) {
          setTitle('Locked');
          setSubtitleError('');
          const lockTime = 5*60*(2**timeouts!);
          setLockTimer(lockTime);
          if(timeouts! < 3) setTimeouts(timeouts! + 1);
          setLockedUntil(moment().add(lockTime, "s").format("DD-MM-YYYY HH:mm:ss Z"));
          dispatch({type: 'disabled'});
          return false;
        }
        setSubtitleError('Wrong PIN, please try again');
        setWrongCount(prevWrongCount => prevWrongCount + 1);
        break;
      case SecurePasswordStoreErrorFeedback.STORE_ERROR:
        setSubtitleError('Internal error, please try again later');
        break;
      default:
        setSubtitleError("Error");
        break;
    }
    dispatch({type: 'disabled'})
    return false
  };

  const submitPINCode = async () => {
    switch (status) {
      case 'choose':
        await handleChoosePIN();
        break;
      case 'enter':
        await handleEnterPIN();
        break;
    }
  };

  // Adds PIN entered
  const handlePINButtonPress = async (value: number) => {
    let index = 0;
    const PINCodeCopy = [...PINCode];
    while (index < PINCode.length) {
      if (PINCodeCopy[index] < 0) {
        PINCodeCopy[index] = value;
        setPINCode(PINCodeCopy);
        if (index === PINCode.length - 1) await submitPINCode();
        break;
      }
      index++;
    }
  };

  // Removes last PIN entered
  const handleDeletePress = () => {
    let index = PINCode.length - 1;
    const PINCodeCopy = [...PINCode];
    while (index >= 0) {
      if (PINCodeCopy[index] >= 0) {
        PINCodeCopy[index] = -1;
        setPINCode(PINCodeCopy);
        break;
      }
      index--;
    }
  };

  const formatLockTime = (lockTime: number) => {
    const seconds =
      lockTime % 60 < 10
        ? '0' + (lockTime % 60).toString()
        : (lockTime % 60).toString();
    return `${~~(lockTime / 60)} : ${seconds}`;
  };

  useEffect(() => {
    if (lockTimer === 0) {
      setTitle(titleProp);
      setWrongCount(0);
    }
    else {
      const timer = setTimeout(() => {
        setLockTimer(prevLockTime => prevLockTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [lockTimer]);

  return (
    <View style={PINStyles.viewContainer}>
      <Text style={PINStyles.PINTitle}>{title}</Text>
      <Text style={PINStyles.PINSubTitleError}>{subtitleError}</Text>
      {lockTimer > 0 ? (
        <View style={styles.viewRow}>
          <Text style={PINStyles.PINLockTimeText}>
            {formatLockTime(lockTimer)}
          </Text>
        </View>
      ) : (
        <PINBalls PINCode={PINCode} />
      )}
      <View
        style={{
          flexDirection: 'column',
        }}>
        <View style={PINStyles.PINRow}>
          <PINButton
            value={1}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINButton
            value={2}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINButton
            value={3}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
        </View>
        <View style={PINStyles.PINRow}>
          <PINButton
            value={4}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINButton
            value={5}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINButton
            value={6}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
        </View>
        <View style={PINStyles.PINRow}>
          <PINButton
            value={7}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINButton
            value={8}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINButton
            value={9}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
        </View>
        <View style={PINStyles.PINRow}>
          <PINButton
            hide={true}
            value={0}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINButton
            value={0}
            handlePress={handlePINButtonPress}
            isDisabled={lockTimer > 0}
          />
          <PINDeleteButton
            handlePress={handleDeletePress}
            isDisabled={lockTimer > 0}
          />
        </View>
      </View>
    </View>
  );
};

export default PIN;
