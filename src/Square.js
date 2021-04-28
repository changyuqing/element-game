import React from "react";

export default function Square(props) {
    switch (props.value.type) {
        case 'fire':
        case 'earth':
        case 'wind':
        case 'water':
            return (
                <button
                    className='square'
                    onClick={
                        () => props.onClick()
                    }>

                    {props.value.value}
                    {props.value.number > 1 ? (<span className='element-number'>{props.value.number}</span>) : (<></>)}
                </button>
            );
        case '':
            return (
                <button
                    className='square'
                    onClick={
                        () => props.onClick()
                    }>
                    {props.value.value}
                </button>
            );
        case 'Person':
            return (
                <button
                    className='square'
                    onClick={
                        () => props.onClick()
                    }>
                    {props.value.value}
                </button>
            );
        default:
            return (<button className='square'/>);
    }
}