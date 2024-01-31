import { Grid, GridSize, GridSpacing } from "@mui/material"
import { CSSProperties } from "@mui/material/styles/createMixins"
import { ResponsiveStyleValue } from "@mui/system"


// If sizes is defined all components will have a specific size, else the size property will be used and all components will have a grid of the same size
/**
 * 
 * @param components The components to be given space.
 * @param sizes A list of equal size to components. Each index represents the value that is given to the material ui grid's xs property for the corresponding component. If undefined, size is instead used.
 * @param size The value that is given to the material ui grid's xs property for each component.
 * @param spacing Is passed on to the material UI Grid container spacing property.
 * @param containerStyle Styling passed on to the material UI Grid container.
 * @param verticalSpacingPixels The amount of margin-top the material UI Grid container should have.
 */
const SpacedGrid = ({components, sizes, size, spacing, containerStyle, verticalSpacingPixels}: {components: JSX.Element[], size?: boolean | GridSize | undefined, sizes?: (boolean | GridSize | undefined)[], 
    containerStyle?: CSSProperties | undefined, spacing?: ResponsiveStyleValue<GridSpacing> | undefined,
    verticalSpacingPixels: number
}) => {
    return <Grid container style={containerStyle} spacing={spacing}>
            {components.map((component, index) => {
                return <Grid key={index} item xs={sizes ? sizes[index]: size} style={{marginTop: `${verticalSpacingPixels}px`}}>
                    {component}
                </Grid>
            })}
        </Grid>
}

export default SpacedGrid