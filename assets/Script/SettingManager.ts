import { _decorator, Component, director, Node } from 'cc';
import { SettingData } from './SetData';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('SettingManager')
export class SettingManager extends Component {
    @property({ type: Node })
    public setting: Node;

    private audio: AudioManager

    start() {
        director.addPersistRootNode(this.node);
        this.audio = this.node.getComponent(AudioManager)
        console.log('dooooooooo')
        console.log(SettingData.getInstance())
        this.audio.clickMusic(SettingData.getInstance().getMusic())
        
    }

    onClickSetting() {
        this.audio.clickButton(SettingData.getInstance().getSound());
        this.setting.active = true;
        SettingData.getInstance().setSetting(true)
    }

    onCloseSetting() {
        this.audio.clickButton(SettingData.getInstance().getSound());
        this.setting.active = false;
        SettingData.getInstance().setSetting(false)
    }

    onClickSound() {
        if (SettingData.getInstance().getSound()) SettingData.getInstance().setSound(false);
        else SettingData.getInstance().setSound(true);
        console.log(SettingData.getInstance())
        this.audio.clickButton(SettingData.getInstance().getSound());
    }
    onClickMusic() {
        if (SettingData.getInstance().getMusic()) SettingData.getInstance().setMusic(false)
        else SettingData.getInstance().setMusic(true)
        this.audio.clickMusic(SettingData.getInstance().getMusic())
    }
}


