import React from "react";
import {getIndexByPosition, getPositionByIndex, isOutOfBoard, LINE_NUM, MAX_ELEMENT_NUM} from "./utils";
import Board from "./Board";

export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null)}],
            stepNumber: 0,
            xIsNext: true,
            isAsc: true,

            // 游戏开始摸的棋子数目
            elementNum: 1,
            squares: Array(11 * 11).fill({type: '', value: '', number: 0}),
            bag: [40, 40, 40, 40],
            element: {
                fire: 0,
                water: 0,
                wind: 0,
                earth: 0,
                move: 0
            },
            currentPlayer: 'A',
            arrow: {
                row: 0,
                col: 0,
                isShow: false,
                shape: 255,
            },
            status: 'init',
            // 水元素流淌的步数
            flowStep: 0,
            flowPath: [],
            choose: {
                row: 0,
                col: 0,
                isShow: false
            },

        }

    }

    componentDidMount() {
        this.initPlayer();
    }

    handleClick(index) {
        let status = this.state.status;
        let squares = [...this.state.squares];
        console.log('火', status)
        let element = {...this.state.element};
        let bag = [...this.state.bag];
        if (status === 'move') {
            return;
        }
        // 火
        if (status === 'fire') {
            // 火可以被放在 空/风 上
            if (squares[index].type === '' || squares[index].type === 'wind') {
                // 手中的火元素 - 1
                if (element.fire <= 0) {
                    return;
                }
                // 如果是风需要把棋子放回袋子
                if (squares[index].type === 'wind') {
                    bag[2] += squares[index].number;
                }
                squares[index] = {
                    type: 'fire',
                    value: '火',
                    number: 1
                }
                element.fire--;

                // 放置免费火元素
                function placeFreeFire(index) {
                    if (squares[index].type === '' ||
                        squares[index].type === 'wind') {
                        // 袋子里的火元素 - 1
                        if (bag[0] <= 0) {
                            return true;
                        }
                        if (squares[index].type === 'wind') {
                            bag[2] += squares[index].number;
                        }
                        bag[0]--;
                        squares[index] = {
                            type: 'fire',
                            value: '火',
                            number: 1
                        }
                        return true;
                    }
                    return false;
                }

                let [row, col] = getPositionByIndex(index);
                for (let j = -1; j <= 1; j = j + 2) {
                    for (let i = row + j * 2; i >= 0 && i < LINE_NUM; i = i + j) {
                        if (squares[getIndexByPosition(i - j, col)].type !== 'fire') {
                            break;
                        }
                        if (placeFreeFire(getIndexByPosition(i, col))) {
                            break;
                        }
                    }
                }
                for (let j = -1; j <= 1; j = j + 2) {
                    for (let i = col + j * 2; i >= 0 && i < LINE_NUM; i = i + j) {
                        if (squares[getIndexByPosition(row, i - j)].type !== 'fire') {
                            break;
                        }
                        if (placeFreeFire(getIndexByPosition(row, i))) {
                            break;
                        }
                    }
                }

            }
        } else if (status === 'earth') {
            // 土 可以放在 空/水/土
            if (squares[index].type === '' || squares[index].type === 'water' || squares[index].type === 'earth') {
                // 最多堆叠两个棋子
                if (squares[index].type === 'earth' && squares[index].number >= 2) {
                    return;
                }
                // 手中的土元素 - 1
                if (element.earth <= 0) {
                    return;
                }
                // 如果是水需要把棋子放回袋子
                if (squares[index].type === 'water') {
                    bag[3] += squares[index].number;
                }
                // 如果棋子在土元素上，则变成山
                if (squares[index].type === 'earth') {
                    squares[index] = {
                        type: 'earth',
                        value: '山',
                        number: 2
                    }
                } else {
                    squares[index] = {
                        type: 'earth',
                        value: '土',
                        number: 1
                    }
                }
                element.earth--;

                // 山脉连锁
                function earthToMount(centerIndex) {
                    let [row, col] = getPositionByIndex(centerIndex);
                    let nineGrid = [
                        [-1, -1], [-1, 0], [-1, 1],
                        [0, -1], [0, 1],
                        [1, -1], [1, 0], [1, 1]
                    ];
                    let isMount = nineGrid.reduce((pre, cur) => {
                        if (squares[getIndexByPosition(row + cur[0], col + cur[1])].value === '山') {
                            return true;
                        } else {
                            return pre;
                        }
                    }, squares[centerIndex].value === '山')
                    console.log('isMount', row, col, isMount)
                    if (isMount) {
                        squares[centerIndex].value = '山'
                        nineGrid.forEach(cur => {
                            let curIndex = getIndexByPosition(row + cur[0], col + cur[1]);
                            let item = squares[curIndex];
                            if (item.type === 'earth' && item.value === '土') {
                                earthToMount(curIndex);
                            }
                        });
                    }
                }

                earthToMount(index);

            }
        } else if (status === 'wind') {
            // 风 可以放在 空/风/土
            if (squares[index].type === '' || squares[index].type === 'wind' || squares[index].type === 'earth') {

                // 最多堆叠四个棋子
                if (squares[index].type === 'wind' && squares[index].number >= 4) {
                    return;
                }
                // 不能替代山
                if (squares[index].type === 'earth' && squares[index].value === '山') {
                    return;
                }
                // 手中的风元素 - 1
                if (element.wind <= 0) {
                    return;
                }
                // 如果是土需要把棋子放回袋子
                if (squares[index].type === 'earth') {
                    bag[1] += squares[index].number;
                }
                // 如果棋子在风元素上，则数目+1
                if (squares[index].type === 'wind') {
                    squares[index] = {
                        type: 'wind',
                        value: '风',
                        number: squares[index].number + 1
                    }
                } else {
                    squares[index] = {
                        type: 'wind',
                        value: '风',
                        number: 1
                    }
                }
                element.wind--;

            }
        } else if (status === 'water') {
            // 水 可以放在 空/火
            if (squares[index].type === '' || squares[index].type === 'fire') {
                if (element.water <= 0) {
                    return;
                }
                // 如果是火需要把棋子放回袋子
                if (squares[index].type === 'earth') {
                    bag[0] += squares[index].number;
                }
                squares[index] = {
                    type: 'water',
                    value: '水',
                    number: 1
                }
                element.water--;
                let flowArray = [
                    [0, 1],
                    [1, 0],
                    [-1, 0],
                    [0, -1]
                ]
                let [row, col] = getPositionByIndex(index);
                let river = flowArray.reduce((pre, cur) => {
                    if (row + cur[0] < 0 || row + cur[0] > LINE_NUM ||
                        col + cur[1] < 0 || col + cur[1] > LINE_NUM
                    ) {
                        return pre;
                    }
                    let curIndex = getIndexByPosition(row + cur[0], col + cur[1]);
                    return squares[curIndex].type === 'water' ? [...pre, cur] : pre;
                }, [])
                if (river.length > 0) {
                    status = 'flow';
                    if (river.length > 1) {
                        this.setState({
                            flowPath: [[row, col]],
                            choose: {
                                row,
                                col,
                                isShow: true
                            }
                        })
                    } else {
                        this.setState({
                            flowPath: [[row, col]]
                        })
                        this.onChangeChoose(river[0], [row, col]);
                    }

                }
            }
        }
        this.setState({
            squares,
            element,
            bag,
            status
        })

    }

    // 初始化游戏人数
    initPlayer() {
        let squares = [...this.state.squares];
        squares[getIndexByPosition(4, 5)] = {type: 'Person', value: 'A', number: 1}
        squares[getIndexByPosition(6, 5)] = {type: 'Person', value: 'B', number: 1}
        this.setState({
            squares
        })
    }

    // 更改初始摸棋子的数目
    changElementNum(num) {
        if (this.state.elementNum + num < 1 || this.state.elementNum + num > MAX_ELEMENT_NUM - 1) {
            return;
        }
        this.setState({
            elementNum: this.state.elementNum + num
        });
    }

    // 分配棋子
    distributionElement(num) {
        let element = this.state.element;
        for (let e in element) {
            if (element.hasOwnProperty(e) && element[e] !== 0) {
                return;
            }
        }

        let bag = [...this.state.bag];
        let elementNum = bag.reduce((pre, cur) => {
            return pre + cur;
        }, 0)
        let results = new Array(bag.length).fill(0);
        for (let i = 0; i < num; i++) {
            let position = Math.floor(Math.random() * (elementNum - i)) + 1;
            let tempSum = 0;
            for (let j = 0; j < bag.length; j++) {
                if (tempSum < position && position <= tempSum + bag[j]) {
                    bag[j]--;
                    results[j]++;
                    break;
                }
                tempSum += bag[j]
            }
        }
        this.setState({
            bag,
            element: {
                fire: results[0],
                water: results[1],
                wind: results[2],
                earth: results[3],
                move: MAX_ELEMENT_NUM - num
            }
        })

    }

    // 处理移动
    // 处理水的流动
    handleDirection(rowOffset, colOffset) {
        let status = this.state.status;
        if (status === 'move') {
            let squares = [...this.state.squares];
            let currentPlayer = this.state.currentPlayer;
            let index = squares.findIndex(item => item.value === currentPlayer);
            let [row, col] = getPositionByIndex(index);
            let nextIndex = getIndexByPosition(row + rowOffset, col + colOffset)
            let nextItem = squares[nextIndex];
            let isWind = false;
            if (nextItem.type === 'wind') {
                isWind = true;
                // 处理风跳跃的问题
                let nextStep = 0;
                while (nextItem && nextItem.type === 'wind') {
                    nextStep += nextItem.number - 1;
                    let [row, col] = getPositionByIndex(nextIndex);
                    nextIndex = getIndexByPosition(row + rowOffset, col + colOffset);
                    if (isOutOfBoard(row + rowOffset, col + colOffset)) {
                        return;
                    }
                    nextItem = squares[nextIndex];

                }
                while (nextStep - 1 > 0) {

                    let [row, col] = getPositionByIndex(nextIndex);
                    nextIndex = getIndexByPosition(row + rowOffset, col + colOffset);
                    if (isOutOfBoard(row + rowOffset, col + colOffset)) {
                        return;
                    }
                    nextItem = squares[nextIndex];
                    if (nextItem.type === 'wind') {
                        nextStep += nextItem.number;
                    }
                    nextStep--;
                }
                if (nextStep === 1) {
                    let [row, col] = getPositionByIndex(nextIndex);
                    nextIndex = getIndexByPosition(row + rowOffset, col + colOffset);
                    if (isOutOfBoard(row + rowOffset, col + colOffset)) {
                        return;
                    }
                    nextItem = squares[nextIndex];
                    nextStep--;
                }

            }
            if (nextItem.type === '') {
                // 处理山挡路的问题
                if (!isWind && (rowOffset & colOffset) === 1) {
                    let itemA = squares[getIndexByPosition(row + rowOffset, col)];
                    let itemB = squares[getIndexByPosition(row, col + colOffset)];
                    if (itemA.value === '山' && itemB.value === '山') {
                        return;
                    }
                }
                // 正常移动
                squares[nextIndex] = squares[index];
                squares[index] = nextItem;

                let move = this.state.element.move;
                this.setState({
                    squares,
                    element: {
                        ...this.state.element,
                        move: move - 1
                    }
                })
                let [nextRow, nextCol] = getPositionByIndex(nextIndex);
                if (move > 1) {
                    this.setState({
                        arrow: {
                            shape: 255,
                            isShow: true,
                            row: nextRow,
                            col: nextCol
                        }
                    })
                } else {
                    this.setState({
                        arrow: {
                            shape: 255,
                            isShow: false,
                            row: nextRow,
                            col: nextCol
                        }
                    })
                }
            }

        } else if (status === 'flow') {
            let squares = [...this.state.squares];
            let flowPath = [...this.state.flowPath];
            let bag = [...this.state.bag];
            let flowStep = this.state.flowStep;
            let [row, col] = flowPath[0];
            let nextIndex = getIndexByPosition(row + rowOffset, col + colOffset)
            let nextItem = squares[nextIndex];
            // 水浇灭火
            if (nextItem.type === '' || nextItem.type === 'fire') {
                flowPath.unshift([row + rowOffset, col + colOffset]);
                let curIndex = getIndexByPosition(...flowPath.pop())
                squares[nextIndex] = squares[curIndex];
                squares[curIndex] = {
                    type: '',
                    number: 0,
                    value: ''
                };
                // 浇灭的火元素回到袋子里
                if (nextItem.type === 'fire') {
                    bag[0] += nextItem.number;
                }

                this.setState({
                    squares,
                    bag,
                    flowStep: flowStep - 1,
                    flowPath
                })
                if (flowStep > 1) {
                    this.setState({
                        arrow: {
                            shape: 90,
                            isShow: true,
                            row: row + rowOffset,
                            col: col + colOffset
                        }
                    })
                } else {
                    this.setState({
                        arrow: {
                            shape: 255,
                            isShow: false,
                            row: row + rowOffset,
                            col: col + colOffset
                        },
                        status: 'water'
                    })
                }
            }
        }
    }

    // 处理按钮导致的状态变化
    handleStatusChange(status) {
        let arrow = this.state.arrow;
        let element = this.state.element;
        if (this.state.status === 'flow') {
            return;
        }
        if (element[status] <= 0) {
            return;
        }
        if (status === 'move') {
            let currentPlayer = this.state.currentPlayer;
            let index = this.state.squares.findIndex(item => item.value === currentPlayer);
            let [row, col] = getPositionByIndex(index);
            arrow = {
                isShow: true,
                row, col
            }
        } else {
            arrow = {
                ...arrow,
                isShow: false
            }
        }
        this.setState({
            status,
            arrow
        })
    }

    // 处理河流的选择
    onChangeChoose(status, firstWater) {
        let flowPath = [...this.state.flowPath];
        if (firstWater) {

            flowPath = [firstWater]
        } else {
            firstWater = flowPath[0];
        }
        let curWater = firstWater;
        let squares = this.state.squares;
        if (curWater[0] + status[0] < 0 || curWater[1] + status[1] < 0 ||
            curWater[0] + status[0] > LINE_NUM || curWater[1] + status[1] > LINE_NUM) {
            return;
        }
        if (squares[getIndexByPosition(curWater[0] + status[0], curWater[1] + status[1])].type !== 'water') {
            return;
        }

        while (squares[getIndexByPosition(curWater[0] + status[0], curWater[1] + status[1])].type === 'water') {
            curWater = [curWater[0] + status[0], curWater[1] + status[1]];
            flowPath.push(curWater);
        }
        this.setState({
            flowPath,
            flowStep: flowPath.length,
            arrow: {
                row: firstWater[0],
                col: firstWater[1],
                shape: 90,
                isShow: true
            },
            choose: {
                ...this.state.choose,
                isShow: false
            }
        })
    }

    // 切换玩家
    toNextPlayer() {
        let players = ['A', 'B'];
        let currentPlayer = this.state.currentPlayer;
        let playerIndex = (players.findIndex(player => currentPlayer === player) + 1) % players.length;
        currentPlayer = players[playerIndex];
        let element = this.state.element;
        let elementNum = element.fire + element.water + element.earth + element.wind + element.move;
        if (elementNum > 0 || this.state.status === 'flow') {
            return;
        }
        this.setState({
            currentPlayer,
            status: 'init'
        })
    }

    render() {
        let history = this.state.history;
        let current = history[this.state.stepNumber];


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={this.state.squares}
                        arrow={this.state.arrow}
                        choose={this.state.choose}
                        onClick={i => {
                            this.handleClick(i);
                        }}
                        onChangeDirection={
                            (row, col) => {
                                this.handleDirection(row, col);
                            }
                        }
                        onChangeChoose={
                            (row, col) => {
                                this.onChangeChoose([row, col]);
                            }
                        }
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => this.changElementNum(-1)}>-</button>
                    {this.state.elementNum}
                    <button onClick={() => this.changElementNum(+1)}>+</button>
                    <button onClick={() => this.distributionElement(+this.state.elementNum)}>摸子</button>
                    <div>{'当前玩家:' + this.state.currentPlayer}</div>
                    <div>当前棋子数：</div>
                    <button onClick={() => this.handleStatusChange('fire')}>火:{this.state.element.fire}</button>
                    <button onClick={() => this.handleStatusChange('earth')}>土:{this.state.element.earth}</button>
                    <button onClick={() => this.handleStatusChange('wind')}>风:{this.state.element.wind}</button>
                    <button onClick={() => this.handleStatusChange('water')}>水:{this.state.element.water}</button>
                    <button onClick={() => this.handleStatusChange('move')}>移动:{this.state.element.move}</button>
                    <button onClick={() => this.toNextPlayer()}>换人</button>

                </div>
            </div>
        );
    }
}