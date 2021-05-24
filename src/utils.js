export const MAX_ELEMENT_NUM = 5;
export const LINE_NUM = 11;

export function getIndexByPosition(row, col) {
    return row * LINE_NUM + col;
}

export function getPositionByIndex(index) {
    let row = Math.floor(index / LINE_NUM);
    let col = index % LINE_NUM;
    return [row, col];
}

export function isOutOfBoard(row, col) {
    return row < 0 || col < 0 || row >= LINE_NUM || col >= LINE_NUM;
}
function initEarth(squares) {
    return squares.map((square) => {
        if (square.type === "mountain" && square.num === 1) {
            return {
                ...square,
                type: "earth",
            };
        }
        return square;
    });
}
function earthToMount(squares, centerIndex) {
    let [row, col] = getPositionByIndex(centerIndex);
    let nineGrid = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    nineGrid.forEach((cur) => {
        if (isOutOfBoard(row + cur[0], col + cur[1])) {
            return;
        }
        let curIndex = getIndexByPosition(row + cur[0], col + cur[1]);
        console.log('curIndex',row + cur[0], col + cur[1])
        let item = squares[curIndex];
        if (item.type === "earth") {
            item.type = 'mountain';
            earthToMount(squares, curIndex);
        }
    });

}

export function mountCount(squares) {
    let tempSquares = JSON.parse(JSON.stringify(squares));
    tempSquares = initEarth(tempSquares)
    tempSquares.filter(item=>item.type === 'mountain').forEach(item=>{
        earthToMount(tempSquares,item.position)
    })
    return tempSquares;
}
