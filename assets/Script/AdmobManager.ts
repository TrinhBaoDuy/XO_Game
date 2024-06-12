declare global {
  interface Window {
    AdmobManager: typeof AdmobManager;
  }
}

export class AdmobManager {
    public static callByNative() {
        // Xử lý hành động từ Java
        // ...
        
    }
}
window.AdmobManager = AdmobManager;