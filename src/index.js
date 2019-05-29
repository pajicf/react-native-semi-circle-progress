import React from 'react'
import { Animated, View, StyleSheet, ViewPropTypes } from 'react-native'
import PropTypes from 'prop-types'

export default class SemiCircleProgress extends React.PureComponent {

    static propTypes = {
        progressShadowColor: PropTypes.string,
        progressColor: PropTypes.string,
        interiorCircleColor: PropTypes.string,
        circleRadius: PropTypes.number,
        progressWidth: PropTypes.number,
        percentage: PropTypes.number,
        exteriorCircleStyle: ViewPropTypes.style,
        interiorCircleStyle: ViewPropTypes.style,
        animationSpeed: PropTypes.number,
        initialPercentage: PropTypes.number,
        minValue: PropTypes.number,
        maxValue: PropTypes.number,
        currentValue: PropTypes.number
    }

    static defaultProps = {
        progressShadowColor: 'silver',
        progressColor: 'steelblue',
        interiorCircleColor: 'white',
        circleRadius: 100,
        progressWidth: 10,
        animationSpeed: 2,
        initialPercentage: 0,
    }

    constructor(props) {
        super(props)

        this.state = {
            rotationAnimation: new Animated.Value(props.initialPercentage)
        }
    }

    componentDidMount() {
        this.animate()
    }

    componentDidUpdate() {
        this.animate()
    }

    animate = () => {
        const toValue = this.getPercentage()
        const speed = this.props.animationSpeed

        Animated.spring(this.state.rotationAnimation, {
            toValue,
            speed,
            useNativeDriver: true
        }).start();
    }

    getPercentage = () => {
        const { percentage, minValue, maxValue, currentValue } = this.props
        if (percentage)
            return Math.max(Math.min(percentage, 100), 0)

        if (currentValue && minValue && maxValue) {
            const newPercent = (currentValue - minValue) / (maxValue - minValue) * 100
            return Math.max(Math.min(newPercent, 100), 0)
        }

        return 0
    }

    getStyles = () => {
        const { circleRadius, progressShadowColor, progressColor, progressWidth, interiorCircleColor } = this.props
        const interiorCircleRadius = circleRadius - progressWidth

        return StyleSheet.create({
            exteriorCircle: {
                width: circleRadius * 2,
                height: circleRadius,
                borderRadius: circleRadius,
                backgroundColor: progressShadowColor
            },
            rotatingCircleWrap: {
                width: circleRadius * 2,
                height: circleRadius,
                top: circleRadius
            },
            rotatingCircle: {
                width: circleRadius * 2,
                height: circleRadius,
                borderRadius: circleRadius,
                backgroundColor: progressColor,
                transform: [
                    { translateY: -circleRadius / 2 },
                    {
                        rotate: this.state.rotationAnimation.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0deg', '180deg']
                        })
                    },
                    { translateY: circleRadius / 2 }
                ]
            },
            interiorCircle: {
                width: interiorCircleRadius * 2,
                height: interiorCircleRadius,
                borderRadius: interiorCircleRadius,
                backgroundColor: interiorCircleColor,
                top: progressWidth
            }
        })
    }

    render() {

        const styles = this.getStyles()

        return (
            <View style={[defaultStyles.exteriorCircle, styles.exteriorCircle, this.props.exteriorCircleStyle]}>
                <View style={[defaultStyles.rotatingCircleWrap, styles.rotatingCircleWrap]}>
                    <Animated.View style={[defaultStyles.rotatingCircle, styles.rotatingCircle]} />
                </View>
                <View style={[defaultStyles.interiorCircle, styles.interiorCircle, this.props.interiorCircleStyle]}>
                    {this.props.children}
                </View>
            </View>
        )
    }
}

const defaultStyles = StyleSheet.create({
    exteriorCircle: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        alignItems: 'center',
        overflow: 'hidden'
    },
    rotatingCircleWrap: {
        position: 'absolute',
        left: 0
    },
    rotatingCircle: {
        position: 'absolute',
        top: 0,
        left: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    interiorCircle: {
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    }
})