package com.example.reactnativettlock;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.reactnativettlock.TtlockModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;

public class MainActivity extends ReactActivity {
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TtlockExample";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();

    TtlockModule ttlockModule = mReactInstanceManager.getCurrentReactContext().getNativeModule(TtlockModule.class);
    WritableArray permissionsArray = Arguments.createArray();
    for (String permission : permissions) {
      permissionsArray.pushString(permission);
    }
    
    // Convert int[] to WritableArray for Turbo Module compatibilityAdd commentMore actions
    WritableArray grantResultsArray = Arguments.createArray();
    for (int result : grantResults) {
      grantResultsArray.pushInt(result);
    }
    
    ttlockModule.onRequestPermissionsResult(requestCode, permissionsArray, grantResults);
  }

}
