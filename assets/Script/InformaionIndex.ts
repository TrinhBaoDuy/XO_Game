import { _decorator, CCInteger, Component, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { EVENT_NAMES } from './GamePlay';
const { ccclass, property } = _decorator;

export enum Chooser {
    Null,
    Player,
    Bot
}

@ccclass('InformaionIndex')
export class InformaionIndex extends Component {
    @property({ type: CCInteger })
    public rowIndex: number
    @property({ type: CCInteger })
    public columIndex: number

    public value: Chooser = Chooser.Null

    @property({ type: SpriteFrame })
    private Player: SpriteFrame
    @property({ type: SpriteFrame })
    private Bot: SpriteFrame
    @property({ type: SpriteFrame })
    private Null: SpriteFrame

    start() {
        this.node.on(EVENT_NAMES.Select, this.setChooser, this)
    }

    setChooser(chooser: Chooser) {
        Tween.stopAll()
        this.value = chooser
        switch (chooser) {
            case Chooser.Null:
                this.node.getComponent(Sprite).spriteFrame = this.Null
                break;
            case Chooser.Bot:
                this.node.getComponent(Sprite).spriteFrame = this.Bot
                break;
            case Chooser.Player:
                this.node.getComponent(Sprite).spriteFrame = this.Player
                break;
        }
    }

    canWin() {
        tween(this.node)
            .repeatForever(
                tween()
                    .by(0.5, { scale: new Vec3(0.05, 0.05, 1) })
                    .call(() => {
                        this.node.getComponent(Sprite).spriteFrame = this.Player;
                    })
                    .by(0.5, { scale: new Vec3(-0.05, -0.05, 1) })
                    .call(() => {
                        this.node.getComponent(Sprite).spriteFrame = this.Null;
                    })
            )
            .start();
    }
}


