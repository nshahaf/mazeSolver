import { useState, useRef, useEffect } from 'react'
import styles from './maze.module.css'
import mazeService from '../services/mazeService.js'
const demoMaze = [
    [
        "S",
        1,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        0
    ],
    [
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
    ],
    [
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        0
    ],
    [
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1
    ],
    [
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        0,
        0
    ],
    [
        0,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0
    ],
    [
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        1,
        0
    ],
    [
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0
    ],
    [
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0
    ],
    [
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0
    ],
    [
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0
    ],
    [
        1,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0
    ],
    [
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        0
    ],
    [
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0
    ],
    [
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0
    ],
    [
        0,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1
    ],
    [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        "E"
    ]
]

const Maze = ({ n = 19 }) => {
    const start = [0, 0]
    const end = [n - 1, n - 1]

    const [maze, setMaze] = useState(demoMaze || [])
    const isRunning = useRef(false)


    useEffect(() => {
        console.log(maze)


    }, [maze])
    function handleClick(e) {

        const row = e.target.dataset.row
        const col = e.target.dataset.col
        if (row == start[0] && col == start[1]) return //start point cannot be changed
        if (row == end[0] && col == end[1]) return //end point cannot be changed

        //model
        maze[row][col] = maze[row][col] == 0 ? 1 : 0
        setMaze([...maze])

        //DOM
        e.target.dataset.cellValue = e.target.dataset.cellValue == 0 ? 1 : 0
        e.target.innerText = e.target.dataset.cellValue
    }


    async function handleStart() {
        isRunning.current = true
        const path = await mazeService.bfsMazeWithPath(maze, setMaze, start, end, isRunning)

        for (const cell of path) {
            const [row, col] = cell
            if (row == start[0] && col == start[1]) continue //start point cannot be changed
            if (row == end[0] && col == end[1]) continue //end point cannot be changed
            const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
            cellElement.setAttribute('data-cell-value', 'P')
            cellElement.innerText = 'P'
        }
        // console.log(path)

    }

    function handleReset() {
        isRunning.current = false
        mazeService.resetMaze(maze, setMaze)
    }

    function handleLoad() {
        setMaze([...demoMaze])
    }

    function handleRandom() {
        // setMaze([...mazeService.generateBinaryMaze(n, start, end)])
        setMaze([...mazeService.generateMaze(n)])
    }

    if (!maze) return null
    return (
        <>
            <div className={styles.maze}>
                {maze.map((row, i) => {
                    return (
                        <div className={styles.row} key={`row-${i}`}>
                            {row.map((cell, j) => {
                                return (
                                    <div
                                        className={styles.cell}
                                        key={`cell-${i}-${j}`}
                                        data-cell-value={cell}
                                        data-row={i}
                                        data-col={j}
                                        onClick={handleClick}
                                    >
                                        {cell}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <div className={styles.controlls}>
                <button className={styles.button} onClick={handleStart}>Start</button>
                <button className={styles.button} onClick={handleReset}>Reset</button>
                <button className={styles.button} onClick={handleLoad}>Load</button>
                <button className={styles.button} onClick={handleRandom}>Random</button>
            </div >
        </>
    )
}

export default Maze