import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveOX')
export class MoveOX extends Component {
    @property({ type: Boolean })
    public zoom: boolean = true
    @property({ type: Boolean })
    public leftToRight: boolean = false
    @property({ type: Boolean })
    public upToDown: boolean = false

    start() {
        if (this.zoom)
            this.onZoom()
        if (this.leftToRight)
            this.onLeftToRight()
        if (this.upToDown)
            this.onUpToDown()
    }

    onZoom() {
        console.log("onZoom", this.node);
        tween(this.node)
            .repeatForever(
                tween()
                    .by(0.5, { scale: new Vec3(0.5, 0.5, 1) })
                    .by(0.5, { scale: new Vec3(-0.5, -0.5, 1) })
            )
            .start();
    }

    onLeftToRight() {
        tween(this.node)
            .repeatForever(
                tween()
                    .by(0.5, { position: new Vec3(10, 0, 1) })
                    .by(0.5, { position: new Vec3(-10, -0, 1) })
            )
            .start();
    }

    onUpToDown() {
        tween(this.node)
            .repeatForever(
                tween()
                    .by(0.5, { position: new Vec3(0, 10, 1) })
                    .by(0.5, { position: new Vec3(0, -10, 1) })
            )
            .start();
    }
}


