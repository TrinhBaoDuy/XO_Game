import { _decorator, CCInteger, Component, Node, UITransform, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScaleManager')
export class ScaleManager extends Component {
    @property({ type: CCInteger })
    public wightdDefault: number = 375
    @property({ type: CCInteger })
    public heghtdDefault: number = 667

    update(dt: number) {
        if (this.getScale() !== this.node.getScale())
            this.node.setScale(this.getScale())
    }

    getScale() {
        const backgroundTransform = this.node.getComponent(UITransform);
        const screenSize = view.getVisibleSize();

        const defaultWidth = this.wightdDefault;
        const defaultHeight = this.heghtdDefault;

        const scaleX = screenSize.width / defaultWidth;
        const scaleY = screenSize.height / defaultHeight;

        return new Vec3(scaleX, scaleY, 1);
    }
}


