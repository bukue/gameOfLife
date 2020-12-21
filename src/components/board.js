import {Component} from "react"

const aliveStyle = {
    backgroundColor: "black"
}

const deadStyle = {
    backgroundColor: "white"
}

const rowStyle = {
    display: "flex"
}

export default class Board extends Component{
    constructor(props){
        super(props);
        this.props = props;

        let board = new Array(this.props.rows).fill(0);

        for(let x = 0; x < board.length; x++){
            let elements = new Array(this.props.cols).fill(0);
        
            for(let i=0; i < elements.length; i++){
                elements[i] = Math.random() <= 0.25 ? true : false;
            }

            board[x] = elements;
        }

        this.elementStyle = {
            width: this.props.size,
            height: this.props.size,
        }

        this.state = {
            board,
            version: 0
        }
        
        this.handleNewIteration = this.handleNewIteration.bind(this);
    }

    // less than 2 neighbors dies
    check2Neighbours(alive, aliveNeighbors){
        return alive && !aliveNeighbors.length < 2;
    }

    // 2 or 3 lives
    check3Neighbours(alive, aliveNeighbors){
        return alive && aliveNeighbors.length==2 || aliveNeighbors.length==3;
    }

    // more than 3 dies
    checkMorethan3Neighbours(alive, aliveNeighbors){
        return alive && aliveNeighbors.length <3;
    }

    // dead cell with 3 neighbours lives
    deadCellLives(alive, aliveNeighbors){
        return !alive && aliveNeighbors.length >= 3;
    }

    getNeighbours(row, col){
        const {board} = this.state;

        let neighbors = []

        neighbors.push({
            row: row - 1,
            col: col - 1
        });

        neighbors.push({
            row: row,
            col: col - 1
        });

        neighbors.push({
            row: row + 1,
            col: col - 1
        });

        neighbors.push({
            row: row - 1,
            col: col
        });

        neighbors.push({
            row: row + 1,
            col: col
        });

        neighbors.push({
            row: row - 1,
            col: col + 1
        });

        neighbors.push({
            row: row ,
            col: col + 1
        });

        neighbors.push({
            row: row + 1,
            col: col + 1
        });

        for(let x=0; x< neighbors.length; x++){
            if(neighbors[x].row<0){
                neighbors[x].row  = board.length -1;
            }

            if(neighbors[x].row > board.length-1){
                neighbors[x].row = 0;
            }

            if(neighbors[x].column<0){
                neighbors[x].column  = board[0].length -1;
            }

            if(neighbors[x].column > board[0].length-1){
                neighbors[x].column = 0;
            }
        }

        return neighbors;
    }

    handleNewIteration(){
        const {board} = this.state;

        for(let row=0; row< board.length; row++){
            for(let col=0; col < board[row].length; col++){
                let alive = board[row][col];
                let neighbors = this.getNeighbours(row, col);
                let aliveNeighbors =  neighbors.filter(c=> board[c.row][c.col]);
                board[row][col] = this.check2Neighbours(alive, aliveNeighbors) &&
                    this.check3Neighbours(alive, aliveNeighbors) &&
                    this.checkMorethan3Neighbours(alive, aliveNeighbors) ||
                    this.deadCellLives(alive, aliveNeighbors);
            }
        }

        this.setState(prevState=>{
            return {
                board,
                version: prevState.version++
            }
        })
    }

    componentDidMount(){
        this.intervalId = setInterval(this.handleNewIteration, this.props.interval);
    }

    componentWillUnmount(){
        clearInterval(this.intervalId);
    }

    getBoard(){
        let {board} = this.state;

        return board.map((row, indexRow)=>{
            return (
                <div style={rowStyle} key={`row-${indexRow}`}>
                    {
                        row.map((element, indexElement) =>{
                            return (
                                <div 
                                    style={{...this.elementStyle, ...(element ? deadStyle : aliveStyle)}} 
                                    key={`element-${indexRow}-${indexElement}`} 
                                />
                            );
                        })
                    }
                </div>
            );
        })
    }

    render(){
        return (this.getBoard());
    }
}