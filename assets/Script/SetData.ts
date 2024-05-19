export class SettingData {
    private static instance: SettingData;
    private sound: boolean;
    private music: boolean;
    private setting: boolean;
    private result: boolean;
  
    private constructor() {
      this.sound = true;
      this.music = true;
      this.setting = false;
      this.result = false;
    }
  
    public static getInstance(): SettingData {
      if (!SettingData.instance) {
        SettingData.instance = new SettingData();
      }
      return SettingData.instance;
    }
  
    public getSound(): boolean {
      return this.sound;
    }
  
    public setSound(sound: boolean): void {
      this.sound = sound;
    }
  
    public getMusic(): boolean {
      return this.music;
    }
  
    public setMusic(music: boolean): void {
      this.music = music;
    }
  
    public getSetting(): boolean {
      return this.setting;
    }
  
    public setSetting(setting: boolean): void {
      this.setting = setting;
    }
  
    public getResult(): boolean {
      return this.result;
    }
  
    public setResult(result: boolean): void {
      this.result = result;
    }
  }