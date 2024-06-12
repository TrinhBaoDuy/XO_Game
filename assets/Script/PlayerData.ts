export class PlayerData {
    private static instance: PlayerData;
    private player_name: string;
    private level: string;
    private point: number;
    private limit_ad_views : number
  
    private constructor() {
      this.player_name = '';
      this.level = '';
      this.point = 0;
      this.limit_ad_views = 0;
    }
  
    public static getInstance(): PlayerData {
      if (!PlayerData.instance) {
        PlayerData.instance = new PlayerData();
      }
      return PlayerData.instance;
    }
  
    public getPlayerName(): string {
      return this.player_name;
    }
  
    public setPlayerName(name: string): void {
      this.player_name = name;
    }
  
    public getLevel(): string {
      return this.level;
    }
  
    public setLevel(level: string): void {
      this.level = level;
    }
  
    public getPoint(): number {
      return this.point;
    }
  
    public setPoint(point: number): void {
      this.point = point;
    }

    public getLimitAdViews(): number {
      return this.limit_ad_views;
    }
  
    public setLimitAdViews(limit_ad_view: number): void {
      this.limit_ad_views = limit_ad_view;
    }
  }