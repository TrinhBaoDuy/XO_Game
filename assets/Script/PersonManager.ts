import { _decorator, Animation, Color, color, Component, easing, Node, Sprite, Tween, tween, Vec3 } from 'cc';
import { EVENT_NAMES } from './GamePlay';
const { ccclass, property } = _decorator;

export const Animation_Name = {
    Idle: 'Idle',
    Dying: 'Dying',
    Hurt: 'Hurt',
    Slash: 'Slashing',
    Walk: 'Walking',
}
export enum Active_Status {
    Waiting,
    TimePlay,
    TimeOff,
    Winer,
    Loser,
}

@ccclass('PersonManager')
export class PersonManager extends Component {
    @property({ type: Animation })
    public Animation: Animation

    start() {
        this.node.on(EVENT_NAMES.Status, this.animation, this)
    }

    animation(status: Active_Status) {
        switch (status) {
            case Active_Status.Waiting:
                Tween.stopAllByTarget(this.node)
                tween(this.node).to(0.3, { scale: new Vec3(0.25, 0.25, 1) }).start();
                this.node.getComponent(Sprite).color = new Color(145, 145, 145, 255)
                break
            case Active_Status.TimePlay:
                this.node.getComponent(Sprite).color = new Color(255, 255, 255, 255)
                tween(this.node)
                    .repeatForever(
                        tween()
                            .by(0.5, { scale: new Vec3(0.05, 0.05, 1) })
                            .by(0.5, { scale: new Vec3(-0.05, -0.05, 1) })
                    )
                    .start();
                break
            case Active_Status.TimeOff:
                this.Animation.play(Animation_Name.Hurt)
                break
            case Active_Status.Loser:
                this.Animation.play(Animation_Name.Dying)
                break
            case Active_Status.Winer:
                this.Animation.play(Animation_Name.Slash)
                break
        }
    }

}


