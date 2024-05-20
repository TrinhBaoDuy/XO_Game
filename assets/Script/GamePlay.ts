import { _decorator, animation, Button, Canvas, CCInteger, Color, Component, director, instantiate, Label, math, Node, ParticleSystem2D, Prefab, Sprite, SpriteFrame, sys } from 'cc';
import { Chooser, InformaionIndex } from './InformaionIndex';
import { Active_Status, Animation_Name, PersonManager } from './PersonManager';
import { PlayerData } from './PlayerData';
import { Level, Scene_NAMES } from './HomeManager';
import { ResultManager } from './ResultManager';
import { SettingData } from './SetData';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

export const EVENT_NAMES = {
    Select: 'Select Box',
    Status: 'Status Active',
    Bot_Turn: 'Bot Turn',
    Retry: 'Retry Game',
    Home: 'Come Home Game',
}

@ccclass('GamePlay')
export class GamePlay extends Component {
    @property({ type: Prefab })
    private Map_Caro: Prefab
    private Box_Caro: Node[] = []
    @property({ type: CCInteger })
    public winNumber: number = 3
    private numberOfWins: number = 0

    @property({ type: Node })
    public player_index: Node
    private Player: Node
    @property({ type: Node })
    public Bot: Node

    @property({ type: CCInteger })
    public time_secon: number = 60
    @property({ type: Label })
    public time_node: Label
    private time_game: number = 0

    private playerSelectedBox: InformaionIndex[] = []
    private checkPlayerSelected: boolean = false

    @property({ type: ResultManager })
    public ResultManager: ResultManager

    private audio: AudioManager

    // @property({ type: Node })
    // private animation_win: Node

    start() {
        this.audio = this.node.getComponent(AudioManager)
        // this.WinSceneManager = this.node.getComponent(WinSceneManager)
        this.createMap()
        this.turnOnTime()
        // this.node.on(EVENT_NAMES.Bot_Turn, this.botPlayGame, this)
        this.ResultManager.node.on(EVENT_NAMES.Retry, this.onRetry, this)
    }

    saveLocalData(point: number) {
        const dataToSave = { person: this.Player.name, point: point };
        if (sys.localStorage) {
            sys.localStorage.setItem(this.Player.name, JSON.stringify(dataToSave));
            console.log('Dữ liệu đã được lưu trữ cục bộ thành công.');
        } else {
            console.error('Trình duyệt không hỗ trợ lưu trữ cục bộ.');
        }
    }

    removePlayer() {
        this.Player.destroy()
    }

    removeMap() {
        this.node.removeAllChildren()
    }

    createMap() {
        let map = instantiate(this.Map_Caro)
        if (map) {
            this.node.addChild(map)
            this.Box_Caro = map.children
            this.player_index.getChildByName(PlayerData.getInstance().getPlayerName()).active = true
        }
        if (this.player_index.getChildByName(PlayerData.getInstance().getPlayerName()).active) {
            this.Player = this.player_index.getChildByName(PlayerData.getInstance().getPlayerName())
            this.Player.getComponent(PersonManager).animation(Active_Status.TimePlay)
            this.Bot.getComponent(PersonManager).animation(Active_Status.Waiting)
            this.numberOfWins = PlayerData.getInstance().getPoint()
            console.log(PlayerData.getInstance())
        }
        if (this.Box_Caro) {
            this.Box_Caro.forEach((m, i) => {
                m.on(Node.EventType.MOUSE_DOWN, (event) => {
                    if (!this.checkPlayerSelected) {
                        if (m.getComponent(InformaionIndex).value === Chooser.Null) {
                            m.emit(EVENT_NAMES.Select, Chooser.Player)
                            this.audio.clickXO(SettingData.getInstance().getSound())
                            this.playerSelectedBox.push(m.getComponent(InformaionIndex))
                            if (this.gameOver(this.getMatrix(), Chooser.Player)) {
                                this.checkPlayerSelected = true
                                this.turnOffTime()
                                this.numberOfWins++
                                this.saveLocalData(this.numberOfWins)
                                this.lineWin(Chooser.Player)
                                this.scheduleOnce(() => {
                                    this.ResultManager.showResult(PlayerData.getInstance().getPlayerName(), this.Player.getComponent(Sprite).spriteFrame)
                                }, 1.5)
                            } else {
                                this.checkPlayerSelected = true
                                this.turnOffTime()
                                this.turnOnBotPlayGame()
                            }
                        } else {
                            console.log('hk cho')
                            // this.Player.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.TimeOff)
                            // this.scheduleOnce(this.Player.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.TimePlay), this.Player.getComponent(PersonManager).Animation.clips.find(a => a.name === Animation_Name.Hurt).duration)
                        }
                        if (this.Box_Caro.every(box => box.getComponent(InformaionIndex).value !== Chooser.Null)) {
                            this.turnOffTime()
                            this.reSetMap();
                            this.Player.getComponent(PersonManager).animation(Active_Status.Waiting)
                            this.checkPlayerSelected = true
                            this.Bot.getComponent(PersonManager).animation(Active_Status.TimePlay)
                            this.turnOnBotPlayGame()
                        }
                    }
                })
            })
        }
    }

    reSetMap() {
        this.turnOnTime()
        console.log(this.numberOfWins)
        this.Box_Caro.forEach(box => { 
            box.getComponent(InformaionIndex).setChooser(Chooser.Null)
            box.getComponent(Sprite).color = Color.WHITE
         })
    }

    botAI() {
        let box = this.blockBoxCanWin(PlayerData.getInstance().getLevel())
        if (box) {
            box.emit(EVENT_NAMES.Select, Chooser.Bot)
            this.audio.clickXO(SettingData.getInstance().getSound())
            if (this.gameOver(this.getMatrix(), Chooser.Bot)) {
                this.lineWin(Chooser.Bot)
                this.scheduleOnce(() => { this.ResultManager.showResult('Thua con AI', this.Bot.getComponent(Sprite).spriteFrame) }, 1.5)
                this.checkPlayerSelected = true
                this.turnOffTime()
            } else {
                this.Player.getComponent(PersonManager).animation(Active_Status.TimePlay)
                this.Bot.getComponent(PersonManager).animation(Active_Status.Waiting)
                this.checkPlayerSelected = false
                this.turnOffTime()
                this.turnOnTime()
            }
            if (this.Box_Caro.every(box => box.getComponent(InformaionIndex).value !== Chooser.Null)) {
                this.reSetMap();
                this.checkPlayerSelected = false
                this.Bot.getComponent(PersonManager).animation(Active_Status.Waiting)
                this.Player.getComponent(PersonManager).animation(Active_Status.TimePlay)
                this.turnOffTime()
                this.turnOnTime()
            }
        }
    }

    turnOnBotPlayGame() {
        this.turnOnTime()
        this.Bot.getComponent(PersonManager).animation(Active_Status.TimePlay)
        this.Player.getComponent(PersonManager).animation(Active_Status.Waiting)
        this.scheduleOnce(this.botAI, math.randomRangeInt(this.time_secon / 5, this.time_secon / 2))
    }

    getMatrix() {
        let matrix = []
        this.Box_Caro.forEach((m) => {
            matrix.push(m.getComponent(InformaionIndex).value);
        })
        return matrix
    }

    blockBoxCanWin(level: string) {
        let matrix = this.getMatrix()
        let block = [];
        let blockingMoveFound = false;
        let blockingMoveWin = false;
        switch (level) {
            case Level.Hard:
                for (let i = 0; i < matrix.length; i++) {
                    if (matrix[i] === Chooser.Null) {
                        let tempMatrix = [...matrix];
                        tempMatrix[i] = Chooser.Bot;
                        let isBlockingMove = this.gameOver(tempMatrix, Chooser.Bot);
                        if (isBlockingMove) {
                            block.push(this.Box_Caro[i]);
                            blockingMoveWin = true;
                        }
                    }
                }
            case Level.Medium:
                for (let i = 0; i < matrix.length; i++) {
                    if (matrix[i] === Chooser.Null) {
                        let tempMatrix = [...matrix];
                        tempMatrix[i] = Chooser.Player;
                        let isBlockingMove = this.gameOver(tempMatrix, Chooser.Player);
                        if (isBlockingMove) {
                            if (!blockingMoveWin)
                                block.push(this.Box_Caro[i]);
                            blockingMoveFound = true;
                        }
                    }
                }
            case Level.Easy:
                if (!blockingMoveFound && !blockingMoveWin) {
                    this.Box_Caro.forEach((box, i) => {
                        if (box.getComponent(InformaionIndex).value === Chooser.Null) {
                            block.push(this.Box_Caro[i]);
                        }
                    });
                }
        }
        console.log(block)
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

    playTime() {
        let minute = Math.floor(this.time_game / 60);
        let second = this.time_game % 60;
        this.time_node.string = '0.' + minute + '  :  ' + second;
        this.time_game -= 1;
        if (second == 0 && minute == 0) {
            this.checkPlayerSelected = true
            this.turnOffTime()
            this.turnOnBotPlayGame()
        }
    }

    turnOnTime() {
        this.time_game = this.time_secon
        let minute = Math.floor(this.time_game / 60);
        let second = this.time_game % 60;
        this.time_node.string = '0.' + minute + '  :  ' + second;
        this.time_game--
        this.schedule(this.playTime, 1)
    }

    turnOffTime() {
        this.unschedule(this.playTime)
    }

    onRetry() {
        this.reSetMap()
        if (!this.checkPlayerSelected) {
            this.Bot.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.Waiting)
            this.Player.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.TimePlay)
        }
        else {
            this.Bot.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.TimePlay)
            this.Player.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.Waiting)
            this.turnOnBotPlayGame()
        }
    }

    onClickBack() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        if (!SettingData.getInstance().getSetting() && !SettingData.getInstance().getResult()) {
            director.loadScene(Scene_NAMES.Home)
            // this.turnOffTime()
            // this.sound.onMusic(false)
        }
    }

    lineWin(player: Chooser) {
        let box = this.matrixWin(this.getMatrix(), player)
        box.forEach(i => {
            this.Box_Caro[i].getComponent(Sprite).color = player == Chooser.Player ? Color.BLUE : Color.RED
        })

    }

    matrixWin(tempMatrix, player: Chooser) {
        let winbox = []
        // Kiểm tra các hàng
        for (let i = 0; i < 3; i++) {
            if (
                tempMatrix[i * 3] === player &&
                tempMatrix[i * 3 + 1] === player &&
                tempMatrix[i * 3 + 2] === player
            ) {
                // return winbox[tempMatrix[i * 3], tempMatrix[i * 3 + 1], tempMatrix[i * 3 + 2]]
                winbox = [i * 3, i * 3 + 1, i * 3 + 2];
                return winbox
            }
        }

        // Kiểm tra các cột
        for (let i = 0; i < 3; i++) {
            if (
                tempMatrix[i] === player &&
                tempMatrix[i + 3] === player &&
                tempMatrix[i + 6] === player
            ) {
                // return winbox[tempMatrix[i], tempMatrix[i + 3], tempMatrix[i + 6]]
                winbox = [i, i + 3, i + 6];
                return winbox
            }
        }

        // Kiểm tra đường chéo chính
        if (tempMatrix[0] === player && tempMatrix[4] === player && tempMatrix[8] === player) {
            // return winbox[tempMatrix[0], tempMatrix[4], tempMatrix[8]]
            winbox = [0, 4, 8];
            return winbox
        }

        // Kiểm tra đường chéo phụ
        if (tempMatrix[2] === player && tempMatrix[4] === player && tempMatrix[6] === player) {
            // return winbox[tempMatrix[2], tempMatrix[4], tempMatrix[6]]
            winbox = [2, 4, 6];
            return winbox
        }
    }

}


