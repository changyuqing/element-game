import React from "react";
let nameMap = {
    fire: '火',
    earth: '土',
    wind: '风',
    water: '水',
    mountain: '山',
    '':''
}
export default function Square(props) {
    switch (props.value.type) {
        case 'fire':
        case 'earth':
        case 'wind':
        case 'water':
        case 'mountain':
            return (
                <button
                    className={'square square-' + props.value.type}
                    onClick={
                        () => props.onClick()
                    }>

                    {nameMap[props.value.type]}
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