import { _decorator, CCInteger, Component, math, Node, Sprite, SpriteFrame } from 'cc';
import { Chooser, InformaionIndex } from './InformaionIndex';
const { ccclass, property } = _decorator;

export const EVENT_NAMES = {
    Select: 'Select Box',
}

@ccclass('GamePlay')
export class GamePlay extends Component {
    @property({ type: [Node] })
    private Map: Node[] = []
    @property({ type: CCInteger })
    public winNumber: number = 3

    private playerSelectedBox: InformaionIndex[] = []
    private checkPlayerSelect: boolean = true
    private matrix = [];

    start() {
        if (this.checkPlayerSelect) {
            this.Map.forEach((m, i) => {
                m.on(Node.EventType.MOUSE_DOWN, (event) => {
                    if (m.getComponent(InformaionIndex).value === Chooser.Null) {
                        m.emit(EVENT_NAMES.Select, Chooser.Player)
                        this.playerSelectedBox.push(m.getComponent(InformaionIndex))
                        this.reSetMatrix()
                        if (this.gameOver(this.matrix, Chooser.Player)) {
                            console.log('win-Player')
                        }
                        this.checkPlayerSelect = false

                    } else {
                        console.log('hiệu ứng không cho chọn')
                    }
                })
            })
        }
    }

    reSetMatrix() {
        this.matrix = []
        this.Map.forEach((m) => {
            this.matrix.push(m.getComponent(InformaionIndex).value);
        })
    }

    blockBoxCanWin() {
        let block = [];
        let blockingMoveFound = false;
        for (let i = 0; i < this.matrix.length; i++) {
            if (this.matrix[i] === Chooser.Null) {
                let tempMatrix = [...this.matrix];
                tempMatrix[i] = Chooser.Player;
                let isBlockingMove = this.gameOver(tempMatrix, Chooser.Player);
                if (isBlockingMove) {
                    block.push(this.Map[i]);
                    blockingMoveFound = true;
                }
            }
        }
        if (!blockingMoveFound) {
            this.matrix.forEach((value, i) => {
                if (value === Chooser.Null) {
                    block.push(this.Map[i]);
                }
            });
        }
        return block[math.randomRangeInt(0, block.length)];
    }

    gameOver(tempMatrix, player: Chooser) {
        // Kiểm tra các hàng
        for (let i = 0; i < 3; i++) {
            if (
                tempMatrix[i * 3] === player &&
                tempMatrix[i * 3 + 1] === player &&
                tempMatrix[i * 3 + 2] === player
            ) {
                return true;
            }
        }

        // Kiểm tra các cột
        for (let i = 0; i < 3; i++) {
            if (
                tempMatrix[i] === player &&
                tempMatrix[i + 3] === player &&
                tempMatrix[i + 6] === player
            ) {
                return true;
            }
        }

        // Kiểm tra đường chéo chính
        if (tempMatrix[0] === player && tempMatrix[4] === player && tempMatrix[8] === player) {
            return true;
        }

        // Kiểm tra đường chéo phụ
        if (tempMatrix[2] === player && tempMatrix[4] === player && tempMatrix[6] === player) {
            return true;
        }

        return false;
    }

    update(deltaTime: number) {
        if (!this.checkPlayerSelect) {
            let box = this.blockBoxCanWin()
            box.emit(EVENT_NAMES.Select, Chooser.Bot)
            this.reSetMatrix()
            if (this.gameOver(this.matrix, Chooser.Bot)) {
                console.log('win-Bot')
            }
            this.checkPlayerSelect = true
        }
    }
}


