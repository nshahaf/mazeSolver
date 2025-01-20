const mazeService = {
    generateBinaryMaze,
    bfsMazeWithPath,
    resetMaze,
    generateMaze

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

function generateMaze(n) {
    // Create a grid filled with walls (represented by 1s)
    const grid = Array.from({ length: n }, () => Array(n).fill(1))

    // Directions for moving (up, down, left, right)
    const directions = [
        [-1, 0], // up
        [1, 0],  // down
        [0, -1], // left
        [0, 1]   // right
    ]

    // Start point (0, 0) and end point (n-1, n-1)
    const startX = 0
    const startY = 0
    const endX = n - 1
    const endY = n - 1

    // Stack for DFS and marking the start and end points
    const stack = [[startX, startY]]
    grid[startX][startY] = 0 // Mark the start as a path (0)

    while (stack.length > 0) {
        const [x, y] = stack[stack.length - 1] // Get current position
        const neighbors = []

        // Find unvisited neighbors (must be within bounds and walls)
        for (let [dx, dy] of directions) {
            const nx = x + dx * 2
            const ny = y + dy * 2
            if (nx >= 0 && nx < n && ny >= 0 && ny < n && grid[nx][ny] === 1) {
                neighbors.push([nx, ny])
            }
        }

        if (neighbors.length > 0) {
            // Randomly pick a neighbor and carve a path
            const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)]
            grid[nx][ny] = 0 // Carve the path at the neighbor
            grid[x + (nx - x) / 2][y + (ny - y) / 2] = 0 // Carve the path between the current and neighbor cell
            stack.push([nx, ny]) // Move to the neighbor
        } else {
            stack.pop() // Backtrack if no unvisited neighbors
        }
    }

    // Ensure the end point is a path (0)
    grid[startX][startY] = 'S'
    grid[endX][endY] = 'E'

    // Ensure there is a path to the end point
    if (grid[endX - 1][endY] === 1 && grid[endX][endY - 1] === 1) {
        grid[endX - 1][endY] = 0
    }

    return grid
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


