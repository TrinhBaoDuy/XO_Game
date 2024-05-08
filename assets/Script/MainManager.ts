import { _decorator, Button, Component, director, Node, Scene } from 'cc';
const { ccclass, property } = _decorator;

export const Scene_NAMES = {
    Play_Game: 'XO',
}

@ccclass('MainManager')
export class MainManager extends Component {
    @property({ type: Button })
    private Play_Game: Button 

    onLoad(){
        this.Play_Game.node.on(Button.EventType.CLICK,()=>{
            director.loadScene(Scene_NAMES.Play_Game)
            console.log('dô')
        })
    }
}


