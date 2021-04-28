
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

export function isOutOfBoard(row, col){
    return (row<0||col<0||row>LINE_NUM||col>LINE_NUM);
}

