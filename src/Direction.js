import React from "react";

export default function Direction(props) {
    let lineHeight = 33;
    let x = lineHeight * (props.col - 1);
    let y = lineHeight * (props.row - 1);
    let shape = props.shape || Math.pow(2, 9) - 1;
    return (
        <div className="direction" style={{top: y + 'px', left: x + 'px'}}>
            <div className="board-row">
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 1) > 0) {
                            props.onChangeDirection(-1, -1)
                        }
                    }
                }>{(shape & 1) > 0?'↖':''}
                </button>
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 2) > 0) {
                            props.onChangeDirection(-1, 0)
                        }
                    }
                }>{(shape & 2) > 0?'↑':''}
                </button>
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 4) > 0) {
                            props.onChangeDirection(-1, 1)
                        }
                    }
                }>{(shape & 4) > 0?'↗':''}
                </button>
            </div>
            <div className="board-row">
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 8) > 0) {
                            props.onChangeDirection(0, -1)
                        }
                    }
                }>{(shape & 8) > 0?'←':''}
                </button>
                <button className='square direction-square'></button>
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 16) > 0) {
                            props.onChangeDirection(0, 1)
                        }
                    }
                }>{(shape & 16) > 0?'→':''}
                </button>
            </div>
            <div className="board-row">
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 32) > 0) {
                            props.onChangeDirection(1, -1)
                        }
                    }
                }>{(shape & 32) > 0?'↙':''}
                </button>
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 64) > 0) {
                            props.onChangeDirection(1, 0)
                        }
                    }
                }>{(shape & 64) > 0?'↓':''}
                </button>
                <button className='square direction-square' onClick={
                    () => {
                        if ((shape & 128) > 0) {
                            props.onChangeDirection(1, 1)
                        }
                    }
                }>{(shape & 128) > 0?'↘':''}
                </button>
            </div>
        </div>
    )
}
