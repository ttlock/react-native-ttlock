package com.reactnativettlock;

import android.Manifest;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativettlock.model.TTGatewayEvent;
import com.reactnativettlock.model.TTGatewayFieldConstant;
import com.reactnativettlock.model.TTLockEvent;
import com.reactnativettlock.model.TTLockFieldConstant;
import com.ttlock.bl.sdk.api.ExtendedBluetoothDevice;
import com.ttlock.bl.sdk.api.TTLockClient;
import com.ttlock.bl.sdk.callback.ScanLockCallback;
import com.ttlock.bl.sdk.entity.LockError;
import com.ttlock.bl.sdk.gateway.api.GatewayClient;
import com.ttlock.bl.sdk.gateway.callback.ScanGatewayCallback;
import com.ttlock.bl.sdk.util.LogUtil;

import java.util.ArrayList;
import java.util.HashMap;

public class TtlockModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final int PERMISSIONS_REQUEST_CODE = 1;
    private boolean scanGateway;
    private static HashMap<String,ExtendedBluetoothDevice> mCachedDevice = new HashMap<>();

    public TtlockModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
//        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "Ttlock";
    }

    //实现回调
//    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
//
//        @Override
//        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
////            if (requestCode == REQUEST_CODE) {
////
////                if (mDoneCallback != null) {
////
////                    if (resultCode == Activity.RESULT_CANCELED) {
////                        mCancelCallback.invoke("取消");
////                    } else {
////                        WritableMap map = Arguments.createMap();
////                        map.putString("result", intent.getExtras().getString("result"));
////                        mDoneCallback.invoke(map);
////                    }
////
////                }
////
////                mCancelCallback = null;
////                mDoneCallback = null;
////            }
//        }
//
//
//    };

    /**
     * android 6.0
     */
    private boolean initPermission() {
        //todo:回调处理
        String permissions[] = {
                Manifest.permission.ACCESS_FINE_LOCATION
        };
        ArrayList<String> toApplyList = new ArrayList<String>();
        for (String perm : permissions) {
            if (PackageManager.PERMISSION_GRANTED != ContextCompat.checkSelfPermission(getCurrentActivity(), perm)) {
                toApplyList.add(perm);
            }
        }
        String tmpList[] = new String[toApplyList.size()];
        if (!toApplyList.isEmpty()) {
            ActivityCompat.requestPermissions(getCurrentActivity(), toApplyList.toArray(tmpList), PERMISSIONS_REQUEST_CODE);
            return false;
        }
        return true;
    }

    private ExtendedBluetoothDevice cacheAndFilterScanDevice(ExtendedBluetoothDevice btDevice){
        ExtendedBluetoothDevice newAddDevice = btDevice;
        String lockMac = btDevice.getAddress();
        if(mCachedDevice.isEmpty()){
            mCachedDevice.put(lockMac,btDevice);
        }else {
            ExtendedBluetoothDevice child = mCachedDevice.get(lockMac);
            if(child == null){
                mCachedDevice.put(lockMac,btDevice);
            }else {
                if(newAddDevice.isSettingMode() != child.isSettingMode()){
                    mCachedDevice.remove(lockMac);
                    mCachedDevice.put(lockMac,btDevice);
                }else {
                    newAddDevice = null;
                }
            }
        }

        return newAddDevice;
    }

    //-------------gateway---------------
    @ReactMethod
    public void startScanGateway() {
        scanGateway = true;
        if (!initPermission()) {
            return;
        }
        GatewayClient.getDefault().startScanGateway(new ScanGatewayCallback() {
            @Override
            public void onScanGatewaySuccess(ExtendedBluetoothDevice device) {
                cacheAndFilterScanDevice(device);
                WritableMap map = Arguments.createMap();
                map.putString(TTGatewayFieldConstant.GATEWAY_NAME, device.getName());
                map.putString(TTGatewayFieldConstant.GATEWAY_MAC, device.getAddress());
                map.putBoolean(TTGatewayFieldConstant.IS_DFU_MODE, device.isDfuMode());
                map.putInt(TTGatewayFieldConstant.RSSI, device.getRssi());
                //锁开关状态跟oneMeterRSSI android不需要
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTGatewayEvent.scanGateway, map);
            }

            @Override
            public void onScanFailed(int errorCode) {
                LogUtil.d("errorCode:" + errorCode);
            }
        });
    }

    @ReactMethod
    public void stopScanGateway() {
        GatewayClient.getDefault().stopScanGateway();
    }

    //-----------lock--------------
    @ReactMethod
    public void startScan() {
        LogUtil.d("start scan");
        scanGateway = false;
        if (!initPermission()) {
            return;
        }
        TTLockClient.getDefault().startScanLock(new ScanLockCallback() {
            @Override
            public void onScanLockSuccess(ExtendedBluetoothDevice extendedBluetoothDevice) {
                LogUtil.d("extendedBluetoothDevice:" + extendedBluetoothDevice);
                if(extendedBluetoothDevice != null){
                    cacheAndFilterScanDevice(extendedBluetoothDevice);
                    WritableMap map = Arguments.createMap();
                    map.putString(TTLockFieldConstant.LOCK_NAME,extendedBluetoothDevice.getName());
                    map.putString(TTLockFieldConstant.LOCK_MAC,extendedBluetoothDevice.getAddress());
                    map.putBoolean(TTLockFieldConstant.IS_INITED,extendedBluetoothDevice.isSettingMode());
                    map.putBoolean(TTLockFieldConstant.IS_KEYBOARD_ACTIVATED,extendedBluetoothDevice.isTouch());
                    map.putInt(TTLockFieldConstant.ELECTRIC_QUANTITY,extendedBluetoothDevice.getBatteryCapacity());
                    map.putString(TTLockFieldConstant.ELECTRIC_QUANTITY, extendedBluetoothDevice.getLockVersionJson());
                    map.putInt(TTLockFieldConstant.RSSI,extendedBluetoothDevice.getRssi());
                    map.putInt(TTLockFieldConstant.LOCK_SWITCH_STATE, extendedBluetoothDevice.getParkStatus());
                    //锁开关状态跟oneMeterRSSI android不需要
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTLockEvent.scanLock, map);
                }
            }

            @Override
            public void onFail(LockError error) {
                LogUtil.d("error:" + error);
            }
        });
    }

    @ReactMethod
    public void stopScan() {
        TTLockClient.getDefault().stopScanLock();
    }

//    @ReactMethod
//    public void initLock(ReadableMap readableMap, Callback success, Callback fail) {
//        String lockmac = readableMap.getString(TTLockFieldConstant.LOCK_MAC);
//        if (TextUtils.isEmpty(lockmac)) {
//            //todo:failure
////            fail.invoke();
//            return;
//        }
//        ExtendedBluetoothDevice device = mCachedDevice.get(TTLockFieldConstant.LOCK_MAC);
//        if (device == null) {
//            //todo:failure
//            return;
//        }
//        TTLockClient.getDefault().initLock(device, new InitLockCallback() {
//            @Override
//            public void onInitLockSuccess(String lockData) {
//                WritableMap map = Arguments.createMap();
//                map.putString(TTLockFieldConstant.LOCK_DATA, lockData);
//                success.invoke(map);
//            }
//
//            @Override
//            public void onFail(LockError error) {
//                //TODO:
//            }
//        });
//    }



}
