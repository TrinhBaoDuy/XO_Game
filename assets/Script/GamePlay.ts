import { _decorator, animation, Button, Canvas, CCInteger, Color, Component, director, Game, instantiate, Label, math, native, Node, ParticleSystem2D, Prefab, Sprite, SpriteFrame, sys } from 'cc';
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
    TEST: 'TEST',
}

export const Bot_name = 'Thua con AI'
export const WINSTREAK = 'WINNIG STREAK : '

@ccclass('GamePlay')
export class GamePlay extends Component {
    @property({ type: Prefab })
    private Map_Caro: Prefab
    private static Box_Caro: Node[] = []
    @property({ type: CCInteger })
    public winNumber: number = 3
    public static numberOfWins: number = 0

    @property({ type: Node })
    public player_index: Node
    private static Player: Node
    @property({ type: Node })
    private Bot_static: Node
    private static Bot: Node

    private static broads: String[] = []
    private static boxEnd

    @property({ type: CCInteger })
    public time_secon: number = 60
    @property({ type: Label })
    public time_node: Label
    private time_game: number = 0

    private playerSelectedBox: InformaionIndex[] = []
    private static checkPlayerSelected: boolean = false

    @property({ type: ResultManager })
    public ResultManager: ResultManager
    private static result
    @property({ type: Label })
    private winstreak: Label
    private audio: AudioManager

    start() {
        this.audio = this.node.getComponent(AudioManager)
        this.audio.clickMusic(false)
        GamePlay.result = this.ResultManager
        GamePlay.Bot = this.Bot_static
        this.createMap()
        this.turnOnTime()
        GamePlay.result.node.on(EVENT_NAMES.Retry, this.onRetry, this)
        this.winstreak.string = WINSTREAK + 0
    }

    saveLocalData(point: number) {
        const dataToSave = { person: GamePlay.Player.name, point: point };
        if (sys.localStorage) {
            sys.localStorage.setItem(GamePlay.Player.name, JSON.stringify(dataToSave));
            console.log('Dữ liệu đã được lưu trữ cục bộ thành công.');
        } else {
            console.error('Trình duyệt không hỗ trợ lưu trữ cục bộ.');
        }
    }

    removePlayer() {
        GamePlay.Player.destroy()
    }

    removeMap() {
        this.node.removeAllChildren()
    }

    createMap() {
        let map = instantiate(this.Map_Caro)
        if (map) {
            this.node.addChild(map)
            GamePlay.Box_Caro = map.children
            this.player_index.getChildByName(PlayerData.getInstance().getPlayerName()).active = true
        }
        if (this.player_index.getChildByName(PlayerData.getInstance().getPlayerName()).active) {
            GamePlay.Player = this.player_index.getChildByName(PlayerData.getInstance().getPlayerName())
            GamePlay.round(Chooser.Player)
            GamePlay.numberOfWins = 0;
            console.log(PlayerData.getInstance())
        }
        if (GamePlay.Box_Caro) {
            GamePlay.Box_Caro.forEach((m, i) => {
                m.on(Node.EventType.TOUCH_START, (event) => {
                    if (!GamePlay.checkPlayerSelected) {
                        if (m.getComponent(InformaionIndex).value === Chooser.Null) {
                            m.emit(EVENT_NAMES.Select, Chooser.Player)
                            this.audio.clickXO(SettingData.getInstance().getSound(), true)
                            GamePlay.broads.push(m.name)
                            this.playerSelectedBox.push(m.getComponent(InformaionIndex))
                            this.checkPlayer()
                        } else {
                            console.log('hk cho')
                            // this.Player.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.TimeOff)
                            // this.scheduleOnce(this.Player.getComponent(PersonManager).node.emit(EVENT_NAMES.Status, Active_Status.TimePlay), this.Player.getComponent(PersonManager).Animation.clips.find(a => a.name === Animation_Name.Hurt).duration)
                        }
                    }
                })
            })
        }
    }

    checkPlayer() {
        if (this.gameOver(GamePlay.getMatrix(), Chooser.Player)) {
            GamePlay.checkPlayerSelected = true
            this.turnOffTime()
            GamePlay.numberOfWins++
            this.lineWin(Chooser.Player)
            this.winstreak.string = WINSTREAK + GamePlay.numberOfWins
            this.audio.soundWinner(SettingData.getInstance().getSound())
            if (GamePlay.numberOfWins > PlayerData.getInstance().getPoint()) {
                this.saveLocalData(GamePlay.numberOfWins)
                this.audio.soundBravo(SettingData.getInstance().getSound())
                this.scheduleOnce(() => {
                    GamePlay.result.showResult(PlayerData.getInstance().getPlayerName(), GamePlay.Player.getComponent(Sprite).spriteFrame)
                }, 1.5)
            } else {
                this.scheduleOnce(() => {
                    this.reSetMap()
                    GamePlay.round(Chooser.Player)
                }, 1)
            }
        } else {
            GamePlay.checkPlayerSelected = true
            this.turnOffTime()
            this.turnOnBotPlayGame()
            if (GamePlay.Box_Caro.every(box => box.getComponent(InformaionIndex).value !== Chooser.Null)) {
                this.reSetMap();
            }
        }
    }

    reSetMap() {
        this.turnOnTime()
        GamePlay.Box_Caro.forEach(box => {
            box.getComponent(InformaionIndex).setChooser(Chooser.Null)
            box.getComponent(Sprite).color = Color.WHITE
        })
    }

    botAI() {
        let box = this.blockBoxCanWin(PlayerData.getInstance().getLevel())
        console.log("tới lược bot", box)
        if (box) {
            box.emit(EVENT_NAMES.Select, Chooser.Bot)
            GamePlay.broads.push(box.name)
            this.audio.clickXO(SettingData.getInstance().getSound(), false)
            if (this.gameOver(GamePlay.getMatrix(), Chooser.Bot)) {
                this.lineWin(Chooser.Bot)
                GamePlay.boxEnd = box
                this.audio.soundLose(SettingData.getInstance().getSound())
                this.scheduleOnce(() => { GamePlay.result.showResult(Bot_name, GamePlay.Bot.getComponent(Sprite).spriteFrame) }, 1.5)
                GamePlay.checkPlayerSelected = true
                this.turnOffTime()
            } else {
                GamePlay.round(Chooser.Player)
                this.turnOffTime()
                this.turnOnTime()
                if (GamePlay.Box_Caro.every(box => box.getComponent(InformaionIndex).value !== Chooser.Null)) {
                    this.reSetMap();
                    GamePlay.round(Chooser.Player)
                }
            }
        }
    }

    turnOnBotPlayGame() {
        this.turnOnTime()
        GamePlay.round(Chooser.Bot)
        this.scheduleOnce(this.botAI, math.randomRangeInt(this.time_secon / 5, this.time_secon / 2))
    }

    private static getMatrix() {
        let matrix = []
        this.Box_Caro.forEach((m) => {
            matrix.push(m.getComponent(InformaionIndex).value);
        })
        return matrix
    }

    blockBoxCanWin(level: string) {
        let matrix = GamePlay.getMatrix()
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
                            block.push(GamePlay.Box_Caro[i]);
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
                                block.push(GamePlay.Box_Caro[i]);
                            blockingMoveFound = true;
                        }
                    }
                }
            case Level.Easy:
                if (!blockingMoveFound && !blockingMoveWin) {
                    GamePlay.Box_Caro.forEach((box, i) => {
                        if (box.getComponent(InformaionIndex).value === Chooser.Null) {
                            block.push(GamePlay.Box_Caro[i]);
                        }
                    });
                }
        }
        // console.log(block)
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
        if(second<10){
            this.time_node.string = '0.' + minute + '  :  0.' + second;
        }else{
            this.time_node.string = '0.' + minute + '  :  ' + second;
        }
        this.time_game -= 1;
        if (second < 4 && minute == 0) {
            this.time_node.color = Color.RED
            this.audio.soundOneSecond(SettingData.getInstance().getSound())
        } else {
            this.time_node.color = Color.WHITE
        }
        if (second == 0 && minute == 0) {
            this.audio.soundDoneTime(SettingData.getInstance().getSound())
            GamePlay.checkPlayerSelected = true
            this.blockBoxCanWin(Level.Hard).emit(EVENT_NAMES.Select, Chooser.Player)
            this.checkPlayer()
            // this.turnOffTime()
            // this.turnOnBotPlayGame()
        }
    }

    turnOnTime() {
        this.time_game = this.time_secon
        let minute = Math.floor(this.time_game / 60);
        let second = this.time_game % 60;
        this.time_node.string = '0.' + minute + '  :  ' + second;
        this.time_node.color = Color.WHITE
        this.time_game--
        this.schedule(this.playTime, 1)
    }

    turnOffTime() {
        this.unschedule(this.playTime)
    }

    onRetry() {
        this.reSetMap()
        if (!GamePlay.checkPlayerSelected) {
            GamePlay.round(Chooser.Player)
        }
        else {
            GamePlay.round(Chooser.Bot)
            this.turnOnBotPlayGame()
        }
        this.winstreak.string = WINSTREAK + GamePlay.numberOfWins
    }

    onClickBack() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        if (!SettingData.getInstance().getSetting() && !SettingData.getInstance().getResult()) {
            director.loadScene(Scene_NAMES.Home)
            // this.turnOffTime()
            // this.sound.onMusic(false)
        }
        ///hoi lay lai nha
    }

    lineWin(player: Chooser) {
        let box = this.matrixWin(GamePlay.getMatrix(), player)
        GamePlay.Box_Caro.forEach(b => {
            b.getComponent(Sprite).color = Color.GRAY
        })
        box.forEach(i => {
            GamePlay.Box_Caro[i].getComponent(Sprite).color = player == Chooser.Player ? Color.WHITE : Color.RED
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

    static round(chooser: Chooser) {
        switch (chooser) {
            case Chooser.Player:
                // console.log('checkkkkkkkkkkkkkk')
                this.Player.getComponent(PersonManager).animation(Active_Status.TimePlay);
                this.Bot.getComponent(PersonManager).animation(Active_Status.Waiting);
                GamePlay.checkPlayerSelected = false;
                break;
            case Chooser.Bot:
                this.Player.getComponent(PersonManager).animation(Active_Status.Waiting);
                this.Bot.getComponent(PersonManager).animation(Active_Status.TimePlay);
                GamePlay.checkPlayerSelected = true;
                break;
        }
    }

    public static returnroad() {
        GamePlay.Box_Caro.forEach(m => {
            m.getComponent(Sprite).color = Color.WHITE
        })
        for (let i = GamePlay.broads.length - 1; i >= 0; i--) {
            const matchingBox = GamePlay.Box_Caro.find(m => m.name === GamePlay.broads[i]);
            if (matchingBox) {
                matchingBox.getComponent(InformaionIndex).setChooser(Chooser.Null);
                GamePlay.broads.splice(i, 1);
                const matchingBox2 = GamePlay.Box_Caro.find(m => m.name === GamePlay.broads[i - 1])
                if (matchingBox2 && matchingBox2.getComponent(InformaionIndex).value != matchingBox.getComponent(InformaionIndex).value) {
                    matchingBox2.getComponent(InformaionIndex).setChooser(Chooser.Null)
                    GamePlay.broads.splice(i - 1, 1);
                    return
                }
            }
        }
    }

    public static callByNative() {
        PlayerData.getInstance().setLimitAdViews(PlayerData.getInstance().getLimitAdViews() - 1)
        this.returnroad()
        SettingData.getInstance().setResult(false)
        GamePlay.round(Chooser.Player)
        GamePlay.result.onShowAdmobFinish()
        GamePlay.boxEnd.getComponent(InformaionIndex).canWin()
    }
}

declare global {
    interface Window {
        GamePlay: typeof GamePlay;
    }
}

window.GamePlay = GamePlay;

