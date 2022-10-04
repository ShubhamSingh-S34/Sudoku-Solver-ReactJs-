import React, { useState } from 'react'
import styles from './MainDiv.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

var initialState = [
    ['.', '9', '.', '.', '4', '2', '1', '3', '6'],
    ['.', '.', '.', '9', '6', '.', '4', '8', '5'],
    ['.', '.', '.', '5', '8', '1', '.', '.', '.'],
    ['.', '.', '4', '.', '.', '.', '.', '.', '.'],
    ['5', '1', '7', '2', '.', '.', '9', '.', '.'],
    ['6', '.', '2', '.', '.', '.', '3', '7', '.'],
    ['1', '.', '.', '8', '.', '4', '.', '2', '.'],
    ['7', '.', '6', '.', '.', '.', '8', '1', '.'],
    ['3', '.', '.', '.', '9', '.', '.', '.', '.'],
];
var clearState = [
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
];


function MainDiv() {
    // const content = [];
    function getDeepCopy(arr) {
        return JSON.parse(JSON.stringify(arr));
    }
    var [sudoku, setSudoku] = useState(getDeepCopy(initialState));



    function onInputChange(e, row, col) {
        // console.log(initialState.board[row][col]);
        console.log(e.target.value);

        // setSudoku(sudoku => ({
        //     ...sudoku.board,
        //     board: sudoku.board.map((r, i) => r.map((c, j) => {
        //         if (i == row && j == col) {
        //             sudoku.board[i][j] = parseInt(e.target.value) || 0;
        //         }
        //         else return c;
        //     }))
        // }))
        var grid = JSON.parse(JSON.stringify(sudoku));
        grid[row][col] = parseInt(e.target.value) || 0;
        setSudoku(grid);
    }

    function isValid(board, row, col, k) {
        for (let i = 0; i < 9; i++) {
            const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const n = 3 * Math.floor(col / 3) + i % 3;
            if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
                return false;
            }
        }
        return true;
    }


    function sodokuSolver(data) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (data[i][j] == '.') {
                    for (let k = 1; k <= 9; k++) {
                        if (isValid(data, i, j, k)) {
                            data[i][j] = `${k}`;
                            if (sodokuSolver(data)) {
                                return true;
                            } else {
                                data[i][j] = '.';
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    function sudokuIsValid(board) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] != '.') {
                    if (board[i][j] <= '0' || board[i][j] > '9') return false;
                    for (let row = 0; row < 9; row++) {
                        if (row != i) {
                            if (board[row][j] == board[i][j]) return false;
                        }
                    }
                    for (let col = 0; col < 9; col++) {
                        if (col != j) {
                            if (board[i][col] == board[i][j]) return false;
                        }
                    }
                    // let subRow = parseInt(i / 3);
                    // let subCol = parseInt(j / 3);
                    // for (let row = subRow; row < subRow + 3; row++) {
                    //     for (let col = subCol; col < subCol + 3; col++) {
                    //         if (row == i && col == j) continue;
                    //         else {
                    //             if (board[row][col] == board[i][j]) return false;
                    //         }
                    //     }
                    // }
                }
            }
        }
        return true;
    }


    function solve() {
        // console.log(sudoku)
        var SolvedSudoku = getDeepCopy(sudoku);
        if (sudokuIsValid(SolvedSudoku) === false) {

            toast.error(('Lauda Ka Sudoku!!!!!!'), { position: "top-center", });
            setTimeout(setSudoku(clearState), 5000);

        }
        else {


            var sol = sodokuSolver(SolvedSudoku);
            if (sol === false) {
                toast.error(('INVALID SUDOKU'), { position: "top-center", });
                console.log("SUDOKU INVALID");
                setSudoku(clearState);
            }
            else {
                console.log("This is solved sudoku");
                console.log(SolvedSudoku);
                setSudoku(SolvedSudoku);
            }

        }

    }

    function clear() {
        console.log("clear!!!")
        var clearSudoku = getDeepCopy(clearState);
        setSudoku(clearSudoku);
    }

    function getRandomSudoku() {
        fetch('https://sugoku.herokuapp.com/board?difficulty=easy')
            .then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data.board);
                var newSudoku = getDeepCopy(clearState);

                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (data.board[i][j] != 0) {
                            newSudoku[i][j] = `${data.board[i][j]}`;
                        }
                    }
                }
                console.log(newSudoku);
                setSudoku(newSudoku);
            })
            .catch((e) => {
                console.log("OOPS ERROR!!!", e);
            })
    }


    return (<>
        <ToastContainer className="foo" style={{ height: "15px", width: '500px', font: '2rem' }} />
        <div className={styles.main}>

            <h1>Sudoku Solver</h1>
            <table>
                <tbody>
                    {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
                            return (<tr key={rIndex} >
                                {
                                    [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                                        return (<td key={rIndex + cIndex}>
                                            <input onChange={(e) => onInputChange(e, row, col)} value={sudoku[row][col] === '.' ? '' : sudoku[row][col]}
                                                className={styles.inputClass}
                                            />
                                        </td>)
                                    })
                                }

                            </tr>)
                        })
                    }
                </tbody>
            </table>
            <button
                className={styles.btn}
                onClick={solve}
            >
                Solve
            </button>
            <button
                className={styles.btn}
                onClick={getRandomSudoku}
            >
                Generate Random
            </button>
            <button
                className={styles.btn}
                onClick={clear}
            >
                Clear
            </button>
        </div>
    </>
    )
}

export default MainDiv