import React from "react";

export default function DirectionChoose(props) {
    let lineHeight = 33;
    let x = lineHeight * (props.col - 1);
    let y = lineHeight * (props.row - 1);

    return (
        <div className="direction" style={{top: y + 'px', left: x + 'px'}}>
            <div className="board-row">
                <button className='square direction-square'>
                </button>
                <button className='square direction-square' onClick={
                    () => props.onChangeDirection(-1, 0)
                }>〇
                </button>
                <button className='square direction-square'>
                </button>
            </div>
            <div className="board-row">
                <button className='square direction-square' onClick={
                    () => props.onChangeDirection(0, -1)
                }>〇
                </button>
                <button className='square direction-square'>
                </button>
                <button className='square direction-square' onClick={
                    () => props.onChangeDirection(0, 1)
                }>〇
                </button>
            </div>
            <div className="board-row">
                <button className='square direction-square'>
                </button>
                <button className='square direction-square' onClick={
                    () => props.onChangeDirection(1, 0)
                }>〇
                </button>
                <button className='square direction-square'>
                </button>

            </div>
        </div>
    )
}
