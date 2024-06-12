import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioClip)
    private clickButon: AudioClip;
    @property(AudioClip)
    private enemyHit: AudioClip;
    @property(AudioClip)
    private userHit: AudioClip;
    @property(AudioClip)
    private lose: AudioClip;
    @property(AudioClip)
    private win: AudioClip;
    @property(AudioClip)
    private bmg: AudioClip;
    @property(AudioClip)
    private oneSecond: AudioClip;
    @property(AudioClip)
    private doneTime: AudioClip;
    @property(AudioClip)
    private bravo: AudioClip;

    public audioSource: AudioSource = new AudioSource();

    start() {
        this.audioSource.clip = this.bmg;
        this.audioSource.loop = true;
    }

    clickButton(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.clickButon);
        }
    }

    clickXO(active: boolean, user: boolean) {
        if (active && this.audioSource) {
            if (user)
                this.audioSource.playOneShot(this.userHit);
            else
                this.audioSource.playOneShot(this.enemyHit)
        }
    }

    clickMusic(active: boolean) {
        if (active && this.audioSource) {
            console.log('mở nhạc')
            this.audioSource.play();
        } else {
            this.audioSource.stop()
        }
    }

    soundWinner(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.win);
        }
    }

    soundLose(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.lose);
        }
    }

    soundOneSecond(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.oneSecond);
        }
    }

    soundDoneTime(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.doneTime);
        }
    }
    soundBravo(active: boolean) {
        if (active && this.audioSource) {
            this.audioSource.playOneShot(this.bravo);
        }
    }
}


