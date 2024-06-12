/****************************************************************************
Copyright (c) 2015-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package com.cocos.game;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Bundle;
import android.content.Intent;
import android.content.res.Configuration;
import android.util.Log;

import androidx.annotation.NonNull;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;
import com.cocos.service.SDKWrapper;
import com.cocos.lib.CocosActivity;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.OnUserEarnedRewardListener;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;
import com.google.android.gms.ads.rewarded.RewardItem;
import com.google.android.gms.ads.rewarded.RewardedAd;
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback;
import com.google.firebase.analytics.FirebaseAnalytics;

public class AppActivity extends CocosActivity {
    private static final String TAG = "AppActivity";
    private static RewardedAd rewardedAd;
    private static AppActivity activity;
    private static boolean finishAdmob;
    private  static boolean isLoad;
    private FirebaseAnalytics mFirebaseAnalytics;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.shared().init(this);

        mFirebaseAnalytics = FirebaseAnalytics.getInstance(this);

        activity = this;
        initializeAdmob();

//        showAdmob();
//        loadAbmob();
    }

    private static void initializeAdmob(){
        activity.runOnUiThread(new Runnable() {
                                   @Override
                                   public void run() {
                                       Log.i("check","DOOOOOOOOOOOOOOOOOOOOOOOOOO11111111");
                                       MobileAds.initialize(activity, new OnInitializationCompleteListener() {
                                           @Override
                                           public void onInitializationComplete(InitializationStatus initializationStatus) {
                                               Log.i("check","DOOOOOOOOOOOOOOOOOOOOOOOOOO222222222");
//                loadAbmob();
                                           }
                                       });
                                       loadAbmob();
                                   }
                               });
    }
    private static void loadAbmob(){
        if (rewardedAd == null) {
            AdRequest adRequest = new AdRequest.Builder().build();
            Log.d(TAG, "rewardedAd "+rewardedAd);
            Log.i("check","DOOOOOOOOOOOOOOOOOOOOOOOOOO22222222.55555"+AppActivity.isLoad);
            RewardedAd.load(activity, "ca-app-pub-3940256099942544/5224354917",
                    adRequest, new RewardedAdLoadCallback() {
                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                            // Handle the error.
                            Log.d(TAG, loadAdError.toString());
                            Log.i("check","DOOOOOOOOOOOOOOOOOOOOOOOOOOsaiiiiiiiiiiiii");
                            rewardedAd = null;
//                            activity.runOnUiThread(new Runnable() {
//                                @Override
//                                public void run() {
//                                    AppActivity.test();
//                                }
//                            });
                            AppActivity.isLoad = false;
                            Log.d(TAG, "Ad was fail loaded.");
                        }

                        @Override
                        public void onAdLoaded(@NonNull RewardedAd ad) {
                            Log.i("check","DOOOOOOOOOOOOOOOOOOOOOOOOOO333333333");
                            rewardedAd = ad;
                            finishAdmob = false;
                            AppActivity.isLoad = true;
                            CocosHelper.runOnGameThread(new Runnable() {
                                @Override
                                public void run() {
                                    CocosJavascriptJavaBridge.evalString("SettingManager.isActiveWarning(false)");
                                }
                            });
                            Log.d(TAG, "Ad was loaded.");
//                        showAdmob();
                        }
                    });
        }
    }

    private  static  void loadFaild(){
        CocosHelper.runOnGameThread(new Runnable() {
            @Override
            public void run() {
                Log.i("check","DOOOOOOOOOOOOOOOOOOOOOOOOOOisActiveWarning");
                //////////////nó cần mạng để thấy thông báo
                CocosJavascriptJavaBridge.evalString("SettingManager.isActiveWarning(true)");
            }
        });
    }
    private static void showAdmob(){
        if(AppActivity.isLoad){
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Log.i("check","DOOOOOOOOOOOOOOOOOOOOOOOOO44444444444   "+rewardedAd);
                    rewardedAd.setFullScreenContentCallback(new FullScreenContentCallback() {
                        @Override
                        public void onAdClicked() {
                            // Called when a click is recorded for an ad.
                            Log.d(TAG, "Ad was clicked.");
                            rewardedAd = null;
                        }
                        @Override
                        public void onAdDismissedFullScreenContent() {
                            // Called when ad is dismissed.
                            // Set the ad reference to null so you don't show the ad a second time.
                            Log.d(TAG, "Ad dismissed fullscreen content.");
                            if(finishAdmob){
                                CocosHelper.runOnGameThread(new Runnable() {
                                    @Override
                                    public void run() {
                                        CocosJavascriptJavaBridge.evalString("GamePlay.callByNative()");
                                    }
                                });
                            }
                            rewardedAd = null;
                            loadAbmob();
                        }
                        @Override
                        public void onAdFailedToShowFullScreenContent(AdError adError) {
                            // Called when ad fails to show.
                            Log.e(TAG, "Ad failed to show fullscreen content.");
                            rewardedAd = null;
                        }

                        @Override
                        public void onAdImpression() {
                            // Called when an impression is recorded for an ad.
                            Log.d(TAG, "Ad recorded an impression.");
                        }

                        @Override
                        public void onAdShowedFullScreenContent() {
                            // Called when ad is shown.
                            Log.d(TAG, "Ad showed fullscreen content.");
                        }
                    });
                    itemAdmob();
                }
            });
        }
        else{
            AppActivity.loadFaild();
        }
    }

    private static void itemAdmob(){
        Log.d(TAG, "rewardedAd "+rewardedAd);
        if (rewardedAd != null) {
            Activity activityContext = activity;
            rewardedAd.show(activityContext, new OnUserEarnedRewardListener() {
                @Override
                public void onUserEarnedReward(@NonNull RewardItem rewardItem) {
                    // Handle the reward.
                    Log.d(TAG, "The user earned the reward.");
                    finishAdmob = true;
                    int rewardAmount = rewardItem.getAmount();
                    String rewardType = rewardItem.getType();
                }
            });
        } else {
            Log.d(TAG, "The rewarded ad wasn't ready yet.");
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.shared().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.shared().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }
        SDKWrapper.shared().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.shared().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.shared().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.shared().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.shared().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.shared().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.shared().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.shared().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.shared().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.shared().onStart();
        super.onStart();
    }

    @Override
    public void onLowMemory() {
        SDKWrapper.shared().onLowMemory();
        super.onLowMemory();
    }

}
