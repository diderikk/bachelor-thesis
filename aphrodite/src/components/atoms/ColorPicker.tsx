import * as React from 'react';
import { ViewStyle } from 'react-native';
import { ColorPicker, fromHsv } from "react-native-color-picker"

interface Props {
    setColor: (color: string) => void;
    style: ViewStyle;
    color?: string;
}

const CustomColorPicker: React.FC<Props> = ({setColor, style, color}) => {
    return <ColorPicker color={color} style={style} hideSliders={true} onColorChange={color => {
        color.v = 0.75
        color.s = 0.9
        setColor(fromHsv(color))
        }}>
    </ColorPicker>
}

export default CustomColorPicker;