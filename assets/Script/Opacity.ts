import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Opacity')
export class Opacity extends Component {
    @property({ type: Node })
    public nodeParent: Node

    onclick() {
        this.nodeParent.active = false
    }
}


