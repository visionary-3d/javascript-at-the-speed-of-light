enum WallType {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  NULL,
}

class Cell {
  walls: Array<boolean>;
  visited: boolean;
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.walls = new Array<boolean>(4); // top, right, bottom, left
    this.walls.fill(true);
    Object.seal(this.walls);

    this.visited = false;
    this.x = x;
    this.y = y;
  }

  // default visitedCells is -2 because it'll return -1 which is invalid
  visit(visitedCells: number = -2) {
    this.visited = true;

    return visitedCells + 1;
  }
}

export class MazeGenerator {
  maze: Cell[];
  size: number;

  constructor(
    size: number = 5,
  ) {
    this.size = size;
    this.maze = [];
  }

  generateMaze() {
    this.initMazeGrid();
    this.generateCellsDFS(this.maze[0]);
    this.createGates();
  }

  getNumberOfWalls(size: number) {
    // returns the number of all the walls
    // 2n(n+1)

    return 2 * size * (size + 1);
  }

  generateCellsDFS(startingCell: Cell) {
    // the stack is used for backtracing steps
    const stack = [startingCell];

    let visitedCells = 0;
    visitedCells = startingCell.visit(visitedCells);

    const totalCells = this.size * this.size;

    let currentCell = startingCell;

    while (visitedCells < totalCells) {
      const unvisitedNeighbors = this.getUnvisitedNeighbors(currentCell);

      if (unvisitedNeighbors.length > 0) {
        const nextCell = this.getNextCellRandomly(unvisitedNeighbors);

        stack.push(nextCell);

        visitedCells = nextCell.visit(visitedCells);

        this.removeWalls(currentCell, nextCell);

        currentCell = nextCell;
      } else if (stack.length > 0) {
        // if there's no unvisited neighbor cell at this current cell
        // backtrace using the stack
        currentCell = stack.pop() as Cell;
      }
    }
  }

  getCell(x: number, y: number) {
    const index = x + y * this.size;
    return this.maze[index];
  }

  initMazeGrid() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const index = x + y * this.size;
        this.maze[index] = new Cell(x, y);
      }
    }
  }

  createGates() {
    this.maze[0].walls[WallType.BOTTOM] = false;
    this.maze[this.maze.length - 1].walls[WallType.TOP] = false;
  }

  getWallOffset(offsetX: number, offsetY: number) {
    if (offsetY > 0) {
      return WallType.TOP;
    }
    if (offsetX > 0) {
      return WallType.RIGHT;
    }
    if (offsetY < 0) {
      return WallType.BOTTOM;
    }
    if (offsetX < 0) {
      return WallType.LEFT;
    }

    return WallType.NULL;
  }

  getUnvisitedNeighbor(
    cell: Cell,
    neighbors: Cell[],
    offsetX: number,
    offsetY: number
  ) {
    const x = cell.x + offsetX;
    const y = cell.y + offsetY;

    if (x < 0 || y < 0 || x >= this.size || y >= this.size) {
      return;
    }

    const visitingCell = this.getCell(x, y);
    const cellHasWallInBetween =
      cell.walls[this.getWallOffset(offsetX, offsetY)];

    if (cellHasWallInBetween && !visitingCell.visited) {
      neighbors.push(visitingCell);
    }
  }

  getNextCellRandomly(unvisitedNeighbors: Cell[]) {
    const randomIndex = Math.floor(Math.random() * unvisitedNeighbors.length);

    return unvisitedNeighbors[randomIndex];
  }

  getUnvisitedNeighbors(cell: Cell): Cell[] {
    const neighbors: Cell[] = [];

    this.getUnvisitedNeighbor(cell, neighbors, +0, +1);
    this.getUnvisitedNeighbor(cell, neighbors, +1, +0);
    this.getUnvisitedNeighbor(cell, neighbors, +0, -1);
    this.getUnvisitedNeighbor(cell, neighbors, -1, +0);

    return neighbors;
  }

  removeWalls(currentCell: Cell, nextCell: Cell) {
    const diffX = currentCell.x - nextCell.x;
    const diffY = currentCell.y - nextCell.y;

    if (diffX === 1) {
      currentCell.walls[WallType.LEFT] = false;
      nextCell.walls[WallType.RIGHT] = false;
    } else if (diffX === -1) {
      currentCell.walls[WallType.RIGHT] = false;
      nextCell.walls[WallType.LEFT] = false;
    }

    if (diffY === 1) {
      currentCell.walls[WallType.BOTTOM] = false;
      nextCell.walls[WallType.TOP] = false;
    } else if (diffY === -1) {
      currentCell.walls[WallType.TOP] = false;
      nextCell.walls[WallType.BOTTOM] = false;
    }
  }
}
