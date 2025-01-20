const mazeService = {
    generateBinaryMaze,
    bfsMazeWithPath,
    resetMaze

}

window.mazeService = mazeService

function generateBinaryMaze(n, start = [0, 0], end = [n - 1, n - 1]) {
    const maze = []

    for (let i = 0; i < n; i++) {
        const row = []
        for (let j = 0; j < n; j++) {
            // Randomly generate 0 or 1
            const cell = Math.random() < 0.4 ? 1 : 0 // 70% chance for 0, 30% for 1
            row.push(cell)
        }
        maze.push(row)
    }

    // Ensure the start (top-left) and end (bottom-right) points are paths (0)
    maze[start[0]][start[1]] = 'S'
    maze[end[0]][end[1]] = 'E'


    return maze
}

async function bfsMazeWithPath(maze, setMaze, start, end, isRunning, delay = 20) {
    const rows = maze.length
    const cols = maze[0].length
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
    const queue = [[...start, [[...start]]]]
    const visited = new Set()
    visited.add(`${start[0]},${start[1]}`)

    function processNext(resolve) {
        if (queue.length === 0) {
            console.log('endded with no result path')
            return null
        }
        if (isRunning.current === false) {
            console.log('mannual stopped')
            return null
        }

        const [row, col, path] = queue.shift()

        if (row === end[0] && col === end[1]) {
            return resolve(path)
        }

        for (const [dx, dy] of directions) {
            const newRow = row + dx
            const newCol = col + dy

            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                maze[newRow][newCol] !== 1 &&
                !visited.has(`${newRow},${newCol}`)
            ) {
                queue.push([newRow, newCol, [...path, [newRow, newCol]]])
                visited.add(`${newRow},${newCol}`)

                if (maze[newRow][newCol] !== 'E') {
                    //Model update
                    maze[newRow][newCol] = 'V'
                    setMaze([...maze])

                    //DOM update
                    const cellElement = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`)
                    if (cellElement) {
                        cellElement.setAttribute('data-cell-value', 'V')
                    }
                }
            }
        }

        setTimeout(() => processNext(resolve), delay)
    }

    return new Promise((resolve) => {
        processNext(resolve)
    })
}

function resetMaze(maze, setMaze) {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 'V' || maze[i][j] === 'P') {
                //model
                maze[i][j] = 0

                //DOM
                const cellElement = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                if (cellElement) {
                    cellElement.setAttribute('data-cell-value', 0)
                    cellElement.innerText = 0
                }
            }
            else continue
        }
    }
    setMaze([...maze])
}

export default mazeService


