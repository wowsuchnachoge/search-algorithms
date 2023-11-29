import SearchAlgo from './SearchAlgo.js';

class AStar extends SearchAlgo {
    constructor(start, end, rows, cols) {
        super('A*');
        this.start = start;
        this.end = end;
        this.rows = rows;
        this.cols = cols;
        this.path = [];
        this.evaluated = [];
        this.walls = [];
    }

    reset() {
        this.start = null;
        this.end = null;
        this.path = [];
        this.evaluated = [];
        this.randomizeWalls();
    }

    search() {
        super.search();
        // openList is an array to maintain costs objects {index, f, g, h, parent}
        let openList = new Map();
        const initialNode = {'index': this.start, 'f': 0, 'g': 0, 'h': 0, 'parent': null};
        openList.set(initialNode.index, initialNode);
        let closedList = [];
        let foundEnd = false;
        // console.log(`Start: ${this.start}, End: ${this.end}`);
        while(openList.size > 0) {
            // nextNode = q
            let nextNode = openList.entries().next().value;
            openList.delete(nextNode[0]);
            closedList.push(nextNode[1].index);
            // console.log(nextNode);
            let successors = this.generateSuccesorsFor(nextNode[1]);
            successors.map((node) => {
                node.parent = nextNode[1];
                this.evaluated.push(node.index);
                return node;
            });
            for(let i = 0; i < successors.length; i++) {
                if(successors[i].index === this.end) {
                    foundEnd = true;
                    this.getFinalPath(successors[i]);
                    break;
                } else if(!closedList.includes(successors[i].index) && successors[i].index !== null) {
                    successors[i].g = this.calculateG(successors[i]);
                    successors[i].h = this.calculateH(successors[i]);
                    successors[i].f = successors[i].g + successors[i].h;
                    if(!openList.has(successors[i].index) || successors[i].f < openList.get(successors[i].index).f) {
                        openList.set(successors[i].index, successors[i]);
                    }
                }
            }
            if(foundEnd) {
                break;
            }
        }
        if(!foundEnd) {
            console.log("Failed to find solution");
        } else {
            console.log("Found exit!");
        }
    }

    getFinalPath(node) {
        while(node.index != this.start) {
            this.path.push(node.index);
            node = node.parent;
        }
    }

    getNextNodeIndex(list) {
        let lowestCost = 100000;
        let lowestCostIndex = null;
        for(let i = 0; i < list.length; i++) {
            if(list[i].cost < lowestCost) {
                lowestCost = list[i].cost;
                lowestCostIndex = i;
            }
        }
        return lowestCostIndex;
    }

    isWall(index) {
        return this.walls.includes(index);
    }

    generateSuccesorsFor(node) {
        let index = node.index;
        let [y, x] = this.indexToYX(index);
        // Nodes
        let nextIndex = this.YXToIndex(y - 1, x - 1);
        let topLeft = {'index': (y - 1 >= 0 && x - 1 >= 0 && !this.isWall(nextIndex)) ? nextIndex : null};

        nextIndex = this.YXToIndex(y - 1, x);
        let top = {'index': (y - 1 >= 0 && !this.isWall(nextIndex)) ? nextIndex : null};

        nextIndex = this.YXToIndex(y - 1, x + 1);
        let topRight = {'index': (y - 1 >= 0 && x + 1 < this.cols && !this.isWall(nextIndex)) ? nextIndex : null};

        nextIndex = this.YXToIndex(y, x - 1);
        let left = {'index': (x - 1 >= 0 && !this.isWall(nextIndex)) ? nextIndex : null};

        nextIndex = this.YXToIndex(y, x + 1);
        let right = {'index': (x + 1 < this.cols && !this.isWall(nextIndex)) ? nextIndex : null};

        nextIndex = this.YXToIndex(y + 1, x - 1);
        let bottomLeft = {'index': (y + 1 < this.rows && x - 1 <= 0 && !this.isWall(nextIndex)) ? nextIndex : null};

        nextIndex = this.YXToIndex(y + 1, x);
        let bottom = {'index': (y + 1 < this.rows && !this.isWall(nextIndex)) ? nextIndex : null};

        nextIndex = this.YXToIndex(y + 1, x + 1);
        let bottomRight = {'index': (y + 1 < this.rows && x + 1 < this.cols && !this.isWall(nextIndex)) ? nextIndex : null};

        // Append nodes to result array
        // let successors = [topLeft, top, topRight, left, right, bottomLeft, bottom, bottomRight];

        let successors = [top, left, right, bottom];
        return successors;
    }

    calculateG(node) {
        let [parentY, parentX] = this.indexToYX(node.parent.index);
        let [nodeY, nodeX] = this.indexToYX(node.index);
        let d = Math.sqrt(Math.pow((parentY - nodeY), 2) + Math.pow((parentX - nodeX), 2));
        return node.parent.g + d;
    }

    calculateH(node) {
        let [endY, endX] = this.indexToYX(this.end);
        let [y, x] = this.indexToYX(node.index);
        return Math.sqrt(Math.pow((endY - y), 2) + Math.pow((endX - x), 2));
    }

    indexToYX(index) {
        let y = Math.floor(index / this.cols);
        let x = index % this.cols;
        return [y, x];
    }

    YXToIndex(y, x) {
        return (y * this.cols) + x;
    }

    randomizeWalls() {
        this.walls = [];
        for(let i = 0; i < (this.rows * this.cols); i++) {
            if(Math.random() > 0.75) {
                this.walls.push(i);
            }
        }
    }

}

export default AStar;

/**
What A* Search Algorithm does is that at each step it picks the node according to a value-‘f’
which is a parameter equal to the sum of two other parameters – ‘g’ and ‘h’.
At each step it picks the node/cell having the lowest ‘f’, and process that node/cell.
f(n) = g(n) + h(n)
g(n): the movement cost to move from the starting point to a given square on the grid, following the path generated to get there.
h(n): the estimated movement cost to move from that given square on the grid to the final destination. (Often called heuristic)
*/