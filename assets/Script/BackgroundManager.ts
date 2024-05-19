import { _decorator, Component, Node, UITransform, view } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackgroundManager")
export class BackgroundManager extends Component {
    update(deltaTime: number) {
        this.onResized();
    }

    onResized() {
        const backgroundTransform = this.node.getComponent(UITransform);
        const screenSize = view.getVisibleSize();

        const scaleY = screenSize.height / backgroundTransform.height;

        this.node.setScale(scaleY, scaleY);
    }
}
// nếu w < h => scale background