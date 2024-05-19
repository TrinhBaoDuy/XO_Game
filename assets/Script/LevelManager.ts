import { _decorator, Color, Component, Label, Node, Sprite, Tween, tween, Vec3 } from 'cc';
import { PlayerData } from './PlayerData';
import { Level } from './HomeManager';
const { ccclass, property } = _decorator;

@ccclass('LevelManager')
export class LevelManager extends Component {

    @property({ type: [Node] })
    private Level: Node[] = []
    private level: number = 0

    start(){
        this.onClickLevel()
    }

    onClickLevel() {
        this.level++
        if (this.level == 4)
            this.level = 1
        switch (this.level) {
            case 1:
                this.easy()
                PlayerData.getInstance().setLevel(Level.Easy)
                break
            case 2:
                this.medium()
                PlayerData.getInstance().setLevel(Level.Medium)
                break
            case 3:
                this.hard()
                PlayerData.getInstance().setLevel(Level.Hard)
                break
        }
    }

    easy() {
        Tween.stopAll()

        this.Level[0].getComponent(Label).color = Color.WHITE;
        this.Level[1].getComponent(Label).color = Color.GRAY;
        this.Level[2].getComponent(Label).color = Color.GRAY;

        tween(this.Level[0])
            .repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
                    .to(0.5, { scale: new Vec3(1, 1, 1) })
            )
            .start();
        tween(this.Level[0]).to(0.5, { position: Vec3.ZERO }).start()

        tween(this.Level[2])
            .to(0.5, { position: new Vec3(-88, 0, 0) })
            .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
            .start();

        tween(this.Level[1])
            .to(0.5, { position: new Vec3(110, 0, 0) })
            .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
            .start();
    }

    medium() {
        Tween.stopAll()

        this.Level[1].getComponent(Label).color = Color.WHITE;
        this.Level[0].getComponent(Label).color = Color.GRAY;
        this.Level[2].getComponent(Label).color = Color.GRAY;

        tween(this.Level[1])
            .repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
                    .to(0.5, { scale: new Vec3(1, 1, 1) })
            )
            .start();
        tween(this.Level[1]).to(0.5, { position: Vec3.ZERO }).start()

        tween(this.Level[0])
            .to(0.5, { position: new Vec3(-118, 0, 0) })
            .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
            .start();

        tween(this.Level[2])
            .to(0.5, { position: new Vec3(124, 0, 0) })
            .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
            .start();
    }

    hard() {
        Tween.stopAll()

        this.Level[2].getComponent(Label).color = Color.WHITE;
        this.Level[1].getComponent(Label).color = Color.GRAY;
        this.Level[0].getComponent(Label).color = Color.GRAY;

        tween(this.Level[2])
            .repeatForever(
                tween()
                    .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
                    .to(0.5, { scale: new Vec3(1, 1, 1) })
            )
            .start();
        tween(this.Level[2]).to(0.5, { position: Vec3.ZERO }).start()

        tween(this.Level[1])
            .to(0.5, { position: new Vec3(-115, 0, 0) })
            .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
            .start();

        tween(this.Level[0])
            .to(0.5, { position: new Vec3(89, 0, 0) })
            .to(0.5, { scale: new Vec3(0.7, 0.7, 1) })
            .start();
    }

}


