import React from 'react'
import { RoughNotation } from 'react-rough-notation'
import colors from "./colors"
// source: https://roughnotation.com/

export const Underline = (props) => (
	<RoughNotation
		type="underline"
		show={true}
		color={colors.underline}
		{...props}
	/>
)
export const Box = (props) => {
	return (
		<RoughNotation
			type="box"
			show={true}
			color={colors.box}
			multiline={true}
			{...props}
		/>
	)
}
export const Circle = (props) => {
	return (
		<RoughNotation
			type="circle"
			show={true}
			color={colors.circle}
			multiline={true}
			{...props}
		/>
	)
}
export const Highlight = (props) => {
	return (
		<RoughNotation
			type="highlight"
			show={true}
			color={colors.highlight}
			multiline={true}
			{...props}
		/>
	)
}
export const StrikeThrough = (props) => {
	return (
		<RoughNotation
			type="strike-through"
			show={true}
			color={colors.strikeThrough}
			multiline={true}
			{...props}
		/>
	)
}
export const CrossedOff = (props) => {
	return (
		<RoughNotation
			type="crossed-off"
			show={true}
			color={colors.crossedOff}
			multiline={true}
			{...props}
		/>
	)
}
