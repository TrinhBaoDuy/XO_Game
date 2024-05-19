import { _decorator, Color, Component, director, Label, Node, ParticleSystem2D, Sprite, sys } from 'cc';
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

    @property({ type: [ParticleSystem2D] })
    private Partical: ParticleSystem2D[] = []

    @property({ type: Label })
    private point: Label
    private audio: AudioManager
    private clickPlayer: boolean = false

    start() {
        this.audio = this.node.getComponent(AudioManager)
        this.point.string = 'Hight Score: ... '
        this.Player.forEach(p => {
            p.getComponent(Sprite).color = Color.GRAY
        })

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
        this.point.string = 'Hight Score: ' + this.getPoint(this.Player[0].name)
        this.Player[1].getComponent(Sprite).color = Color.GRAY
        this.Player[0].getComponent(Sprite).color = Color.WHITE
        this.Partical[0].resetSystem()
        this.Partical[1].stopSystem()

    }
    onclickJOSHEP() {
        this.audio.clickButton(SettingData.getInstance().getSound())
        PlayerData.getInstance().setPlayerName(this.Player[1].name)
        PlayerData.getInstance().setPoint(this.getPoint(this.Player[1].name))
        this.clickPlayer = true
        this.point.string = 'Hight Score: ' + this.getPoint(this.Player[1].name)
        this.Player[0].getComponent(Sprite).color = Color.GRAY
        this.Player[1].getComponent(Sprite).color = Color.WHITE
        this.Partical[1].resetSystem()
        this.Partical[0].stopSystem()
    }

    onclickStart() {
        console.log(PlayerData.getInstance())
        this.audio.clickButton(SettingData.getInstance().getSound())
        if (this.clickPlayer) {
            director.loadScene(Scene_NAMES.Playing)
        }
    }

}


