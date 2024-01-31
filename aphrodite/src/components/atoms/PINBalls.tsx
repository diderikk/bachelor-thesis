import React from "react";
import { View } from "react-native";
import styles from '../../styles/Global.styles';
import PINStyles from '../../styles/PIN.component.style';

interface Props {
  PINCode: number[];
}

const PINBalls: React.FC<Props> = ({PINCode}) => {
	return (
		<View style={styles.viewRow}>
        {PINCode.map((val, index) => {
          return (
            <View
              key={index}
              style={
                val >= 0 ? PINStyles.PINBall : PINStyles.PINBallSmall
              }></View>
          );
        })}
      </View>
	)
}

export default PINBalls;