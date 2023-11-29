function GraphNode({text, index, clickHandler, isStart, isEnd, isPath, isEvaluated, isWall}) {
    let className = "graph-node";
    if(isPath) {
        className += " isPath";
    }
    if(isEvaluated) {
        className += " evaluated";
    }
    if(isStart) {
        className += " start";
    }
    if(isEnd) {
        className += " end";
    }
    if(isWall) {
        className += " wall";
    }
    return (
        <div className={className} onClick={() => clickHandler(index)}>
            <p>{text}</p>
        </div>
    );
}

export default GraphNode;