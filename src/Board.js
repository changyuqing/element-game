import React from "react";
import Square from "./Square";
import Direction from "./Direction";
import DirectionChoose from "./DirectionChoose";

export default class Board extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => {
                this.props.onClick(i);
            }}/>;
    }

    render() {
        let row = 11;
        let col = 11;

        let board = new Array(row).fill(0).map((_, rowIndex) => {
            return (

                <div className="board-row" key={rowIndex}>
                    {
                        new Array(col).fill(0).map((_, colIndex) => {
                            let index = rowIndex * col + colIndex;
                            return (
                                <React.Fragment key={colIndex}>
                                    {this.renderSquare(index)}
                                </React.Fragment>
                            )

                        })
                    }
                </div>
            )
        })
        if (this.props.arrow.isShow) {
            return (
                <div style={{position: 'relative', width: '374px'}}>
                    {board}
                    <Direction onChangeDirection={(row, col) => this.props.onChangeDirection(row, col)}
                               row={this.props.arrow.row} col={this.props.arrow.col} shape={this.props.arrow.shape}/>
                </div>
            );
        } else if (this.props.choose.isShow) {
            return (
                <div style={{position: 'relative', width: '374px'}}>
                    {board}
                    <DirectionChoose onChangeDirection={(row, col) => this.props.onChangeChoose(row, col)}
                                     row={this.props.choose.row} col={this.props.choose.col}/>
                </div>
            );
        } else {
            return (
                <div style={{position: 'relative', width: '374px'}}>
                    {board}
                </div>
            );
        }
    }
}
