import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property([AudioClip])
    private audio: AudioClip[] | null = [];
    public audioSource: AudioSource = new AudioSource();

    start(): void {
        this.audioSource.clip = this.audio[2];
        this.audioSource.loop = true;
    }

    clickButton(active: boolean) {
        if (active) {
            this.audioSource.playOneShot(this.audio[0]);
        }
    }

    clickXO(active: boolean) {
        if (active) {
            this.audioSource.playOneShot(this.audio[1]);
        }
    }

    clickMusic(active: boolean) {
        if (!active) {
            this.audioSource.stop();
        } else {
            console.log('mở nhạc')
            this.audioSource.play();
        }
    }

    soundWinner(active: boolean) {
        if (active) {
            this.audioSource.playOneShot(this.audio[3]);
        }
    }
}


