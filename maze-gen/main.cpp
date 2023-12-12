#include <iostream>
#include <vector>
#include <array>
#include <stack>
#include <cmath>
#include <random>
#include <chrono>

enum class WallType
{
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
  NO,
};

class Cell
{
public:
  Cell(int x, int y)
  {
    this->x = x;
    this->y = y;
    visited = false;
    walls.fill(true);
  };
  ~Cell(){};

  void visit()
  {
    visited = true;
  };

  int x;
  int y;
  bool visited;
  std::array<bool, 4> walls;
};

class Generator
{
public:
  Generator(int size)
  {
    this->size = size;

    cells.resize(size * size);

    for (int y = 0; y < size; y++)
    {
      for (int x = 0; x < size; x++)
      {
        int index = x + y * size;
        cells[index] = new Cell(x, y);
      }
    }
  };
  ~Generator()
  {
    for (int y = 0; y < size; y++)
    {
      for (int x = 0; x < size; x++)
      {
        int index = x + y * size;
        delete cells[index];
      }
    }
  };

  void generateCellsDFS(Cell *startingCell)
  {
    std::stack<Cell *> stack;
    stack.push(startingCell);

    startingCell->visit();

    // Start with 1 to account for the starting cell
    int visitedCells = 1;

    int totalCells = this->size * this->size;

    Cell *currentCell = startingCell;

    while (visitedCells < totalCells)
    {
      std::vector<Cell *> unvisitedNeighbors = getUnvisitedNeighbors(currentCell);

      if (unvisitedNeighbors.size() > 0)
      {
        int random = double(rand()) / RAND_MAX;
        int randomIndex = std::floor(random * unvisitedNeighbors.size());

        Cell *nextCell = unvisitedNeighbors[randomIndex];

        stack.push(nextCell);

        nextCell->visit();
        visitedCells++;

        removeWalls(currentCell, nextCell);

        currentCell = nextCell;
      }
      else if (stack.size() > 0)
      {
        currentCell = stack.top();
        stack.pop();
      }
    }
  }

  void removeWalls(Cell *currentCell, Cell *nextCell)
  {
    int diffX = currentCell->x - nextCell->x;
    int diffY = currentCell->y - nextCell->y;

    if (diffX == 1)
    {
      currentCell->walls[int(WallType::LEFT)] = false;
      nextCell->walls[int(WallType::RIGHT)] = false;
    }
    else if (diffX == -1)
    {
      currentCell->walls[int(WallType::RIGHT)] = false;
      nextCell->walls[int(WallType::LEFT)] = false;
    }

    if (diffY == 1)
    {
      currentCell->walls[int(WallType::BOTTOM)] = false;
      nextCell->walls[int(WallType::TOP)] = false;
    }
    else if (diffY == -1)
    {
      currentCell->walls[int(WallType::TOP)] = false;
      nextCell->walls[int(WallType::BOTTOM)] = false;
    }
  }

  std::vector<Cell *> getUnvisitedNeighbors(Cell *cell)
  {
    std::vector<Cell *> neighbors;

    getUnvisitedNeighbor(cell, neighbors, +0, +1);
    getUnvisitedNeighbor(cell, neighbors, +1, +0);
    getUnvisitedNeighbor(cell, neighbors, +0, -1);
    getUnvisitedNeighbor(cell, neighbors, -1, +0);

    return neighbors;
  }

  void getUnvisitedNeighbor(
      Cell *cell,
      std::vector<Cell *> &neighbors,
      int offsetX,
      int offsetY)
  {
    int x = cell->x + offsetX;
    int y = cell->y + offsetY;

    if (x < 0 || y < 0 || x >= this->size || y >= this->size)
    {
      return;
    }

    Cell *visitingCell = getCell(x, y);
    WallType wt = getWallOffset(offsetX, offsetY);
    bool cellHasWallInBetween = cell->walls[int(wt)];

    if (cellHasWallInBetween && !visitingCell->visited)
    {
      neighbors.push_back(visitingCell);
    }
  }

  Cell *getCell(int x, int y)
  {
    int index = x + y * this->size;
    return cells[index];
  }

  WallType getWallOffset(int offsetX, int offsetY)
  {
    if (offsetY > 0)
    {
      return WallType::TOP;
    }
    if (offsetX > 0)
    {
      return WallType::RIGHT;
    }
    if (offsetY < 0)
    {
      return WallType::BOTTOM;
    }
    if (offsetX < 0)
    {
      return WallType::LEFT;
    }

    return WallType::NO;
  }

  std::vector<Cell *> cells;
  int size;
};