import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame } from 'cc';
import { Scene_NAMES } from './HomeManager';
import { EVENT_NAMES } from './GamePlay';
import { SettingData } from './SetData';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('ResultManager')
export class ResultManager extends Component {
    @property({ type: Label })
    private name_winner: Label
    @property({ type: Node })
    private avatar_winner: Node

    private audio: AudioManager

    start(){
        this.audio = this.node.getComponent(AudioManager)
    }

    isActive(active: boolean) {
        this.node.active = active
    }

    showResult(name: string, avatar: SpriteFrame) {
        // this.audio.soundWinner(SettingData.getInstance().sound)
        SettingData.getInstance().setResult(true)
        this.name_winner.string = name
        this.avatar_winner.getComponent(Sprite).spriteFrame = avatar
        this.isActive(true)
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

}


