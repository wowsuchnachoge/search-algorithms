import { useState } from "react";
import GraphNode from "./GraphNode";

function Graph({searchAlgo, rows, cols}) {
    const totalNodes = rows * cols;
    const [nodes, _] = useState(Array.from({length: totalNodes}, (_, i) => i));
    const [nodesTexts, setNodesTexts] = useState(Array.from({length: totalNodes}, (_, i) => ""));
    const [startSelected, setStartSelected] = useState(false);
    const [disableGraph, setDisableGraph] = useState(false);
    const squareSize = 10;

    function clickHandler(i) {
        if(disableGraph) { return }
        const nodesTextsCopy = nodesTexts.slice()
        if(startSelected) {
            nodesTextsCopy[i] = "E";
            setDisableGraph(true);
            searchAlgo.end = i;
            searchAlgo.search();
        } else {
            nodesTextsCopy[i] = "S";
            searchAlgo.start = i;
        }
        setStartSelected(!startSelected);
        setNodesTexts(nodesTextsCopy);
    }

    function randomizeWalls() {
        searchAlgo.randomizeWalls();
        let newNodes = nodesTexts.slice();
        setNodesTexts(newNodes);
    }

    function reset() {
        searchAlgo.reset();
        let newNodes = Array.from({length: totalNodes}, (_, i) => "");
        setNodesTexts(newNodes);
        setStartSelected(false);
        setDisableGraph(false);
    }

    return (
        <>
            <button onClick={() => randomizeWalls()}>Randomize walls</button>
            <button onClick={() => reset()}>Reset</button>
            <div className="graph" style={{width: squareSize * cols + 2 * cols, height: squareSize * rows + 2 * rows}}>
                <h4>Search algo: {searchAlgo.name}, Rows: {rows}, Cols: {cols}</h4>
                {
                    nodes.map((i) => {
                        return <GraphNode text={nodesTexts[i]} clickHandler={clickHandler} index={i} key={i} isStart={searchAlgo.start === i} isEnd={searchAlgo.end === i} isPath={searchAlgo.path.includes(i)} isEvaluated={searchAlgo.evaluated.includes(i)} isWall={searchAlgo.walls.includes(i)} />
                    })
                }
            </div>
        </>
    );
}

export default Graph;