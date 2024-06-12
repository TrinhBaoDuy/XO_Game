import { _decorator, CCInteger, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapGame')
export class MapGame extends Component {
    @property({ type: Prefab })
    private box: Prefab
    @property({ type: CCInteger })
    private size_box: number = 85

    @property({ type: CCInteger })
    private size_map: number = 10 

    start() {

    }

    update(deltaTime: number) {
        
    }

    // createBoard(boardSize: number) {
    //     this.board = [];
    //     const screenSize = view.getVisibleSize(); //size màn hình
    //     console.log("size screen", screenSize);
    //     const cellSize = 85;
    
    //     const boardWidth = boardSize * cellSize;
    //     const boardHeight = boardSize * cellSize;
    //     console.log("boardSize", boardWidth, boardHeight);
    //     const startX = -boardWidth / 2 + cellSize / 2; //x: ô đầu
    //     const startY = -boardHeight / 2 + cellSize / 2; //y: ô đầu
    
    //     for (let i = 0; i < boardSize; i++) {
    //       for (let j = 0; j < boardSize; j++) {
    //         const cell = instantiate(this.box);
    //         const cellX = startX + i * cellSize;
    //         const cellY = startY + j * cellSize;
    //         cell.setPosition(cellX, cellY);
    //         this.node.addChild(cell);
    //         this.board.push(cell);
    //       }
    //     }
    //   }
}


