import { _decorator, Color, Component, director, JsonAsset, Label, native, Node, Sprite, sys } from 'cc';
import { SettingData } from './SetData';
import { AudioManager } from './AudioManager';
import { GamePlay } from './GamePlay';
const { ccclass, property } = _decorator;

@ccclass('SettingManager')
export class SettingManager extends Component {
    @property({ type: Node })
    public setting: Node;
    @property({ type: Node })
    public warning: Node;
    @property({ type: Node })
    public sound: Node;
    @property({ type: Node })
    public music: Node;
    // @property({ type: JsonAsset })
    // public loading: JsonAsset;
    private audio: AudioManager
    private static warningWifi

    start() {
        SettingManager.warningWifi = this.warning
        director.addPersistRootNode(this.node);
        this.audio = this.node.getComponent(AudioManager)
        console.log('dooooooooo')
        console.log(SettingData.getInstance())
        this.music.getComponent(Sprite).color = Color.GRAY
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
        if (SettingData.getInstance().getSound()) {
            SettingData.getInstance().setSound(false);
            this.sound.getComponent(Sprite).color = Color.GRAY
            // this.sound.children.forEach((child) => {
            //     child.getComponent(Label).color = Color.GRAY;
            //   });
        }
        else {
            SettingData.getInstance().setSound(true);
            this.sound.getComponent(Sprite).color = Color.WHITE
            // this.sound.children.forEach((child) => {
            //     child.getComponent(Label).color = Color.WHITE;
            //   });
        }
        console.log(SettingData.getInstance())
        this.audio.clickButton(SettingData.getInstance().getSound());
    }

    onClickMusic() {
        if (SettingData.getInstance().getMusic()) {
            SettingData.getInstance().setMusic(false)
            this.music.getComponent(Sprite).color = Color.GRAY
            // this.music.children.forEach((child) => {
            //     child.getComponent(Label).color = Color.GRAY;
            //   });
        }
        else {
            SettingData.getInstance().setMusic(true)
            this.music.getComponent(Sprite).color = Color.WHITE
            // this.music.children.forEach((child) => {
            //     child.getComponent(Label).color = Color.WHITE;
            //   });
        }
        this.audio.clickMusic(SettingData.getInstance().getMusic())
    }

    reLoadAdmob() {
        if (sys.os === sys.OS.ANDROID) {
            let a = native.reflection.callStaticMethod(
                "com/cocos/game/AppActivity",
                "initializeAdmob",
                "()V"
            );
        } else {
            console.log("Platform is not Android");
        }
    }

    onReLoad() {
        SettingManager.warningWifi.active = false
        this.reLoadAdmob()
        console.log('hien animation load')
        // var json = this.loading.json;
    }


    static isActiveWarning(active: boolean) {
        console.log('DOOOOOOOOOOOOOOOOOOOOOOOOOOisActiveWarningCos', active)
        SettingManager.warningWifi.active = active
    }
}

declare global {
    interface Window {
        SettingManager: typeof SettingManager;
    }
}

window.SettingManager = SettingManager;

window.addEventListener('online', () => {
    SettingManager.isActiveWarning(false)
    console.log('Kết nối mạng đã được khôi phục');
});

window.addEventListener('offline', () => {
    SettingManager.isActiveWarning(true)
    console.log('Mất kết nối mạng');
});