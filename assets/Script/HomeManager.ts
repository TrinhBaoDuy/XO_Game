import { _decorator, Color, Component, director, Label, native, Node, ParticleSystem2D, Sprite, sys, tween } from 'cc';
import { PlayerData } from './PlayerData';
import { AudioManager } from './AudioManager';
import { SettingData } from './SetData';
const { ccclass, property } = _decorator;

export const Scene_NAMES = {
    Home: 'home',
    Playing: 'game'
};

export enum Level {
    Easy = 'easy',
    Medium = 'medium',
    Hard = 'hard'
}

@ccclass('HomeManager')
export class HomeManager extends Component {
    @property({ type: [Node] })
    private Player: Node[] = []
    @property({ type: Label })
    private cannbao: Label
    private an = new Color(255, 255, 255, 0)
    private hien = new Color(255, 255, 255, 255)

    @property({ type: [ParticleSystem2D] })
    private Partical: ParticleSystem2D[] = []

    @property({ type: Label })
    private point: Label

    @property({ type: AudioManager })
    private audio: AudioManager

    private clickPlayer: boolean = false

    start() {
        this.cannbao.getComponent(Label).color = this.an
        this.point.string = 'Hight Score: ... '
        this.Player.forEach(p => {
            p.getComponent(Sprite).color = Color.GRAY
        })
        this.onclickGEIGHA()
    }


    getPoint(name: string) {
        if (sys.localStorage) {
            const data = sys.localStorage.getItem(name);
            if (data) {
                const savedData = JSON.parse(data);
                if (savedData.person === name) {
                    return savedData.point;
                }
            }
        } else {
            console.error('Trình duyệt không hỗ trợ lưu trữ cục bộ.');
        }
        return 0;
    }

    onclickGEIGHA() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        PlayerData.getInstance().setPlayerName(this.Player[0].name)
        this.clickPlayer = true
        PlayerData.getInstance().setPoint(this.getPoint(this.Player[0].name))
        this.point.string = 'Hight Score: ' + this.getPoint(this.Player[0].name) + " "
        this.Player[1].getComponent(Sprite).color = Color.GRAY
        this.Player[1].children.forEach((child) => {
            child.getComponent(Label).color = Color.GRAY;
        });
        this.Player[0].getComponent(Sprite).color = Color.WHITE
        this.Player[0].children.forEach((child) => {
            child.getComponent(Label).color = Color.WHITE;
        });
        this.Partical[0].resetSystem()
        this.Partical[1].stopSystem()

    }
    onclickJOSHEP() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        PlayerData.getInstance().setPlayerName(this.Player[1].name)
        PlayerData.getInstance().setPoint(this.getPoint(this.Player[1].name))
        this.clickPlayer = true
        this.point.string = 'Hight Score: ' + this.getPoint(this.Player[1].name) + " "
        this.Player[0].getComponent(Sprite).color = Color.GRAY
        this.Player[0].children.forEach((child) => {
            child.getComponent(Label).color = Color.GRAY;
        });
        this.Player[1].getComponent(Sprite).color = Color.WHITE
        this.Player[1].children.forEach((child) => {
            child.getComponent(Label).color = Color.WHITE;
        });
        this.Partical[1].resetSystem()
        this.Partical[0].stopSystem()
    }

    onclickStart() {
        // console.log(PlayerData.getInstance())
        PlayerData.getInstance().setLimitAdViews(1)
        this.audio.clickButton(SettingData.getInstance().getSound())
        if (this.clickPlayer) {
            director.loadScene(Scene_NAMES.Playing)
        } else {
            tween(this.cannbao)
                .to(1, { color: this.hien })
                .to(0.5, { color: this.an })
                .start()
        }
    }

}


