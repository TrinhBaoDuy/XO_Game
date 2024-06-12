import { _decorator, Component, director, Label, native, Node, Sprite, SpriteFrame, sys, tween, Vec3 } from 'cc';
import { Scene_NAMES } from './HomeManager';
import { Bot_name, EVENT_NAMES, GamePlay } from './GamePlay';
import { SettingData } from './SetData';
import { AudioManager } from './AudioManager';
import { PlayerData } from './PlayerData';
const { ccclass, property } = _decorator;

@ccclass('ResultManager')
export class ResultManager extends Component {
    @property({ type: Label })
    private name_winner: Label
    @property({ type: Node })
    private avatar_winner: Node
    @property({ type: Node })
    private buttonAdmob: Node
    @property({ type: Label })
    private views: Label
    private audio: AudioManager

    start() {
        this.audio = this.node.getComponent(AudioManager)
    }

    isActive(active: boolean) {
        this.node.active = active
    }

    showAdmob() {
        if (sys.os === sys.OS.ANDROID) {
            let a = native.reflection.callStaticMethod(
                "com/cocos/game/AppActivity",
                "showAdmob",
                "()V"
            );
        } else {
            console.log("Platform is not Android");
        }
    }

    showResult(name: string, avatar: SpriteFrame) {
        console.log('PLAYER DATA', PlayerData.getInstance().getLimitAdViews())
        if (name == Bot_name && PlayerData.getInstance().getLimitAdViews() > 0) {
            this.views.string = PlayerData.getInstance().getLimitAdViews().toString()
            tween(this.views.node)
                .repeatForever(
                    tween()
                        .by(0.5, { scale: new Vec3(1, 1, 0.7) })
                        .by(0.5, { scale: new Vec3(-1, -1, 0.7) })
                )
                .start();
            this.buttonAdmob.active = true
            this.isActive(false)
        } else {
            this.buttonAdmob.active = false
            this.isActive(true)
            // if (name == Bot_name)
            //     this.audio.soundLose(SettingData.getInstance().getSound())
            // else this.audio.soundWinner(SettingData.getInstance().getSound())
        }
        if (name == Bot_name && !this.buttonAdmob.active) {
            GamePlay.numberOfWins = 0
        }
        SettingData.getInstance().setResult(true)
        this.name_winner.string = name
        this.avatar_winner.getComponent(Sprite).spriteFrame = avatar
    }

    onClickRetry() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        this.isActive(false)
        this.node.emit(EVENT_NAMES.Retry)
        SettingData.getInstance().setResult(false)
    }

    onClickHome() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        director.loadScene(Scene_NAMES.Home)
        SettingData.getInstance().setResult(false)
        this.isActive(false)
    }

    onClickIdont() {
        GamePlay.numberOfWins = 0
        this.buttonAdmob.active = false
        this.isActive(true)
    }

    onShowAdmobFinish() {
        this.buttonAdmob.active = false
        this.isActive(false)
    }

}


