import { _decorator, Animation, Component, Node } from 'cc';
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
                this.Animation.play(Animation_Name.Idle)
                break
            case Active_Status.TimePlay:
                this.Animation.play(Animation_Name.Walk)
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


