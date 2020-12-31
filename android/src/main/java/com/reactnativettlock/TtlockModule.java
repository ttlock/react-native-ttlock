package com.reactnativettlock;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class TtlockModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public TtlockModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Ttlock";
    }
}
