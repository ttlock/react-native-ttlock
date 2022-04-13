package com.reactnativettlock;

import android.Manifest;
import android.content.pm.PackageManager;
import android.text.TextUtils;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.reactnativettlock.model.RNControlAction;
import com.reactnativettlock.model.TTGatewayEvent;
import com.reactnativettlock.model.TTGatewayFieldConstant;
import com.reactnativettlock.model.TTLockConfigConverter;
import com.reactnativettlock.model.TTLockErrorConverter;
import com.reactnativettlock.model.TTLockEvent;
import com.reactnativettlock.model.TTLockFieldConstant;
import com.reactnativettlock.util.Utils;
import com.ttlock.bl.sdk.api.ExtendedBluetoothDevice;
import com.ttlock.bl.sdk.api.TTLockClient;
import com.ttlock.bl.sdk.callback.AddFingerprintCallback;
import com.ttlock.bl.sdk.callback.AddICCardCallback;
import com.ttlock.bl.sdk.callback.ClearAllFingerprintCallback;
import com.ttlock.bl.sdk.callback.ClearAllICCardCallback;
import com.ttlock.bl.sdk.callback.ClearPassageModeCallback;
import com.ttlock.bl.sdk.callback.ControlLockCallback;
import com.ttlock.bl.sdk.callback.CreateCustomPasscodeCallback;
import com.ttlock.bl.sdk.callback.DeleteFingerprintCallback;
import com.ttlock.bl.sdk.callback.DeleteICCardCallback;
import com.ttlock.bl.sdk.callback.DeletePasscodeCallback;
import com.ttlock.bl.sdk.callback.GetAutoLockingPeriodCallback;
import com.ttlock.bl.sdk.callback.GetLockConfigCallback;
import com.ttlock.bl.sdk.callback.GetLockStatusCallback;
import com.ttlock.bl.sdk.callback.GetLockTimeCallback;
import com.ttlock.bl.sdk.callback.GetLockVersionCallback;
import com.ttlock.bl.sdk.callback.GetOperationLogCallback;
import com.ttlock.bl.sdk.callback.GetRemoteUnlockStateCallback;
import com.ttlock.bl.sdk.callback.InitLockCallback;
import com.ttlock.bl.sdk.callback.ModifyAdminPasscodeCallback;
import com.ttlock.bl.sdk.callback.ModifyFingerprintPeriodCallback;
import com.ttlock.bl.sdk.callback.ModifyICCardPeriodCallback;
import com.ttlock.bl.sdk.callback.ModifyPasscodeCallback;
import com.ttlock.bl.sdk.callback.ResetKeyCallback;
import com.ttlock.bl.sdk.callback.ResetLockCallback;
import com.ttlock.bl.sdk.callback.ResetPasscodeCallback;
import com.ttlock.bl.sdk.callback.ScanLockCallback;
import com.ttlock.bl.sdk.callback.SetAutoLockingPeriodCallback;
import com.ttlock.bl.sdk.callback.SetLockConfigCallback;
import com.ttlock.bl.sdk.callback.SetLockTimeCallback;
import com.ttlock.bl.sdk.callback.SetPassageModeCallback;
import com.ttlock.bl.sdk.callback.SetRemoteUnlockSwitchCallback;
import com.ttlock.bl.sdk.constant.LogType;
import com.ttlock.bl.sdk.entity.ControlLockResult;
import com.ttlock.bl.sdk.entity.LockError;
import com.ttlock.bl.sdk.entity.PassageModeConfig;
import com.ttlock.bl.sdk.entity.PassageModeType;
import com.ttlock.bl.sdk.entity.TTLockConfigType;
import com.ttlock.bl.sdk.entity.ValidityInfo;
import com.ttlock.bl.sdk.gateway.api.GatewayClient;
import com.ttlock.bl.sdk.gateway.callback.ConnectCallback;
import com.ttlock.bl.sdk.gateway.callback.InitGatewayCallback;
import com.ttlock.bl.sdk.gateway.callback.ScanGatewayCallback;
import com.ttlock.bl.sdk.gateway.callback.ScanWiFiByGatewayCallback;
import com.ttlock.bl.sdk.gateway.model.ConfigureGatewayInfo;
import com.ttlock.bl.sdk.gateway.model.DeviceInfo;
import com.ttlock.bl.sdk.gateway.model.GatewayError;
import com.ttlock.bl.sdk.gateway.model.GatewayType;
import com.ttlock.bl.sdk.gateway.model.WiFi;
import com.ttlock.bl.sdk.util.FeatureValueUtil;
import com.ttlock.bl.sdk.util.LogUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@ReactModule(name = "Ttlock")
public class TtlockModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final int PERMISSIONS_REQUEST_CODE = 1;
    private boolean scanGateway;
    private static HashMap<String, ExtendedBluetoothDevice> mCachedDevice = new HashMap<>();
    private String mac;
    private int totalCnt;
    private boolean flag;

    public TtlockModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        LogUtil.setDBG(true);
    }

    @Override
    public String getName() {
        return "Ttlock";
    }

    /**
     * android 6.0
     */
    private boolean initPermission() {
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

    @ReactMethod
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case PERMISSIONS_REQUEST_CODE: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0) {
                    for (int i=0;i<permissions.length;i++) {
                        if (Manifest.permission.ACCESS_FINE_LOCATION.equals(permissions[i]) && grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                            // permission was granted, yay! Do the
                            // contacts-related task you need to do.
                            if (scanGateway) {
                                startScanGateway();
                            } else {
                                startScan();
                            }
                        } else {
                            // permission denied, boo! Disable the
                            // functionality that depends on this permission.
                        }
                    }
                }
                return;
            }
            // other 'case' lines to check for other
            // permissions this app might request.
        }
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
        GatewayClient.getDefault().prepareBTService(getCurrentActivity());
        GatewayClient.getDefault().startScanGateway(new ScanGatewayCallback() {
            @Override
            public void onScanGatewaySuccess(ExtendedBluetoothDevice device) {
                WritableMap map = Arguments.createMap();
                map.putString(TTGatewayFieldConstant.GATEWAY_NAME, device.getName());
                map.putString(TTGatewayFieldConstant.GATEWAY_MAC, device.getAddress());
                map.putBoolean(TTGatewayFieldConstant.IS_DFU_MODE, device.isDfuMode());
                map.putInt(TTGatewayFieldConstant.RSSI, device.getRssi());
                map.putInt(TTGatewayFieldConstant.TYPE, device.getGatewayType());
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

    @ReactMethod
    public void connect(String mac, Callback callback) {
//        ExtendedBluetoothDevice device = mCachedDevice.get(mac);
        if (mac == null) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, callback);
            LogUtil.d("mac is null");
            return;
        }
        this.mac = mac;
        //{ code: 0, description: "The bluetooth connect timeout" },
        //      { code: 1, description: "The bluetooth connect success" },
        //      { code: 2, description: "The bluetooth connect fail" }

        //是否已经回调
        flag = false;
        GatewayClient.getDefault().connectGateway(mac, new ConnectCallback() {
            @Override
            public void onConnectSuccess(ExtendedBluetoothDevice device) {
                LogUtil.d("connected:" + device);
                flag = true;
                callback.invoke(1);
            }

            @Override
            public void onDisconnected() {
                try {//过滤掉断开连接的回调
                    if (!flag) {
                        flag = true;
                        callback.invoke(0);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }

    @ReactMethod
    public void getNearbyWifi(Callback callback) {//0:完成 1:失败
        if (TextUtils.isEmpty(mac)) {
            LogUtil.d("mac is null");
            return;
        }
        GatewayClient.getDefault().scanWiFiByGateway(mac, new ScanWiFiByGatewayCallback() {
            @Override
            public void onScanWiFiByGateway(List<WiFi> wiFis) {
                if(wiFis != null) {
                    WritableArray writableArray = Arguments.createArray();
                    for (WiFi wiFi : wiFis) {
                        WritableMap map = Arguments.createMap();
                        map.putString(TTGatewayFieldConstant.WIFI, wiFi.getSsid());
                        map.putInt(TTGatewayFieldConstant.RSSI, wiFi.getRssi());
                        writableArray.pushMap(map);
                    }
                    //锁开关状态跟oneMeterRSSI android不需要
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTGatewayEvent.scanWifi, writableArray);
                }
            }

            @Override
            public void onScanWiFiByGatewaySuccess() {
                callback.invoke(0);
            }

            @Override
            public void onFail(GatewayError error) {
                LogUtil.d("error:" + error);
                callback.invoke(1);
            }
        });
    }

    @ReactMethod
    public void initGateway(ReadableMap readableMap, Callback success, Callback fail) {

        if (readableMap != null) {
            ConfigureGatewayInfo gatewayInfo = new ConfigureGatewayInfo();
            gatewayInfo.plugName = readableMap.getString(TTGatewayFieldConstant.GATEWAY_NAME);
            gatewayInfo.plugVersion = readableMap.getInt(TTGatewayFieldConstant.TYPE);
            if (gatewayInfo.plugVersion == GatewayType.G2) {//G2网关才有WIFI跟WIFI 密码
                gatewayInfo.ssid = readableMap.getString(TTGatewayFieldConstant.WIFI);
                gatewayInfo.wifiPwd = readableMap.getString(TTGatewayFieldConstant.WIFI_PASSWORD);
            }
            gatewayInfo.uid = readableMap.getInt(TTGatewayFieldConstant.TTLOCK_UID);
            gatewayInfo.userPwd = readableMap.getString(TTGatewayFieldConstant.TTLOCK_LOGIN_PASSWORD);


            GatewayClient.getDefault().initGateway(gatewayInfo, new InitGatewayCallback() {
                @Override
                public void onInitGatewaySuccess(DeviceInfo deviceInfo) {
                    WritableMap map = Arguments.createMap();
                    map.putString(TTGatewayFieldConstant.MODEL_NUM, deviceInfo.getModelNum());
                    map.putString(TTGatewayFieldConstant.HARDWARE_REVISION, deviceInfo.getHardwareRevision());
                    map.putString(TTGatewayFieldConstant.FIRMWARE_REVISION, deviceInfo.getFirmwareRevision());
                    success.invoke(map);
                }

                @Override
                public void onFail(GatewayError error) {
                    fail.invoke(error.getErrorCode());
                }
            });
        }

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
//                LogUtil.d("extendedBluetoothDevice:" + extendedBluetoothDevice);
                if(extendedBluetoothDevice != null){
                    cacheAndFilterScanDevice(extendedBluetoothDevice);
                    WritableMap map = Arguments.createMap();
                    map.putString(TTLockFieldConstant.LOCK_NAME,extendedBluetoothDevice.getName());
                    map.putString(TTLockFieldConstant.LOCK_MAC,extendedBluetoothDevice.getAddress());
                    map.putBoolean(TTLockFieldConstant.IS_INITED, !extendedBluetoothDevice.isSettingMode());
                    map.putBoolean(TTLockFieldConstant.IS_KEYBOARD_ACTIVATED,extendedBluetoothDevice.isTouch());
                    map.putInt(TTLockFieldConstant.ELECTRIC_QUANTITY,extendedBluetoothDevice.getBatteryCapacity());
                    map.putString(TTLockFieldConstant.LOCK_VERSION, extendedBluetoothDevice.getLockVersionJson());
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

    @ReactMethod
    public void initLock(ReadableMap readableMap, Callback success, Callback fail) {
        String lockmac = readableMap.getString(TTLockFieldConstant.LOCK_MAC);
        if (TextUtils.isEmpty(lockmac)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            LogUtil.d("lockmac is null");
            return;
        }
        ExtendedBluetoothDevice device = mCachedDevice.get(lockmac);
        if (device == null) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            LogUtil.d("device is null");
            return;
        }
        String clientPara = readableMap.getString(TTLockFieldConstant.CLIENT_PARA);
        if (!TextUtils.isEmpty(clientPara)) {
            device.setManufacturerId(clientPara);
        }
        TTLockClient.getDefault().initLock(device, new InitLockCallback() {
            @Override
            public void onInitLockSuccess(String lockData) {
                success.invoke(lockData);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void resetLock(String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().resetLock(lockData, null, new ResetLockCallback() {
            @Override
            public void onResetLockSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void resetEkey(String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().resetEkey(lockData, null, new ResetKeyCallback() {
            @Override
            public void onResetKeySuccess(String lockData) {
                success.invoke(lockData);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void controlLock(int controlAction, String lockData, Callback success, Callback fail) {
        if (!RNControlAction.isValidAction(controlAction) || TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().controlLock(RNControlAction.RN2Native(controlAction), lockData, null, new ControlLockCallback() {
            @Override
            public void onControlLockSuccess(ControlLockResult controlLockResult) {
                WritableArray writableArray = Arguments.createArray();
                writableArray.pushDouble(controlLockResult.getLockTime());
                writableArray.pushInt(controlLockResult.getBattery());
                writableArray.pushInt(controlLockResult.getUniqueid());
                success.invoke(writableArray);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void createCustomPasscode(String passcode, double startDate, double endDate, String lockData, Callback success, Callback fail) {
        LogUtil.d("passcode:" + passcode);
        if (TextUtils.isEmpty(passcode) || TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        LogUtil.d("startDate:" + startDate);
        TTLockClient.getDefault().createCustomPasscode(passcode, (long)startDate, (long)endDate, lockData, null, new CreateCustomPasscodeCallback() {
            @Override
            public void onCreateCustomPasscodeSuccess(String passcode) {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void modifyPasscode(String passcodeOrigin, String passcodeNew, double startDate, double endDate, String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(passcodeOrigin) || TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().modifyPasscode(passcodeOrigin, passcodeNew, (long)startDate, (long)endDate, lockData, null, new ModifyPasscodeCallback() {
            @Override
            public void onModifyPasscodeSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void deletePasscode(String passcode, String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(passcode) || TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().deletePasscode(passcode, lockData, null, new DeletePasscodeCallback() {
            @Override
            public void onDeletePasscodeSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void resetPasscode(String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().resetPasscode(lockData, null, new ResetPasscodeCallback() {
            @Override
            public void onResetPasscodeSuccess(String lockData) {
                success.invoke(lockData);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void getLockSwitchState(String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(lockData)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().getLockStatus(lockData, null, new GetLockStatusCallback() {
            @Override
            public void onGetLockStatusSuccess(int status) {
                success.invoke(status);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void addCard(ReadableArray cycleList, double startDate, double endDate, String lockData, Callback success, Callback fail) {
        //todo:测试循环IC卡数据
        LogUtil.d("cycleList:" + cycleList);
        ValidityInfo validityInfo = new ValidityInfo();
        validityInfo.setModeType(cycleList == null || cycleList.size() == 0 ? ValidityInfo.TIMED : ValidityInfo.CYCLIC);
        validityInfo.setStartDate((long) startDate);
        validityInfo.setEndDate((long) endDate);
        validityInfo.setCyclicConfigs(Utils.readableArray2CyclicList(cycleList));

        TTLockClient.getDefault().addICCard(validityInfo, lockData, new AddICCardCallback() {
            @Override
            public void onEnterAddMode() {
                //前端目前不接收任何数据
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTLockEvent.addCardProgrress, null);
            }

            @Override
            public void onAddICCardSuccess(long cardNum) {
                success.invoke(String.valueOf(cardNum));
            }

            @Override
            public void onFail(LockError lockError) {
                lockErrorCallback(lockError, fail);
            }
        });
    }

    @ReactMethod
    public void modifyCardValidityPeriod(String cardNumber, ReadableArray cycleList, double startDate, double endDate, String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(cardNumber)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }

        ValidityInfo validityInfo = new ValidityInfo();
        validityInfo.setModeType(cycleList == null || cycleList.size() == 0 ? ValidityInfo.TIMED : ValidityInfo.CYCLIC);
        validityInfo.setStartDate((long) startDate);
        validityInfo.setEndDate((long) endDate);
        validityInfo.setCyclicConfigs(Utils.readableArray2CyclicList(cycleList));

        TTLockClient.getDefault().modifyICCardValidityPeriod(validityInfo, cardNumber, lockData, new ModifyICCardPeriodCallback() {
            @Override
            public void onModifyICCardPeriodSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError lockError) {
                lockErrorCallback(lockError, fail);
            }
        });
    }

    @ReactMethod
    public void deleteCard(String cardNumber, String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(cardNumber)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().deleteICCard(cardNumber, lockData, null, new DeleteICCardCallback() {
            @Override
            public void onDeleteICCardSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void clearAllCards(String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().clearAllICCard(lockData, null, new ClearAllICCardCallback() {
            @Override
            public void onClearAllICCardSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void addFingerprint(ReadableArray cycleList, double startDate, double endDate, String lockData, Callback success, Callback fail) {
        ValidityInfo validityInfo = new ValidityInfo();
        validityInfo.setModeType(cycleList == null || cycleList.size() == 0 ? ValidityInfo.TIMED : ValidityInfo.CYCLIC);
        validityInfo.setStartDate((long) startDate);
        validityInfo.setEndDate((long) endDate);
        validityInfo.setCyclicConfigs(Utils.readableArray2CyclicList(cycleList));

        //todo:
        TTLockClient.getDefault().addFingerprint(validityInfo, lockData, new AddFingerprintCallback() {
            @Override
            public void onEnterAddMode(int totalCount) {
                totalCnt = totalCount;
                WritableArray writableArray = Arguments.createArray();
                writableArray.pushInt(0);
                writableArray.pushInt(totalCnt);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTLockEvent.addFingerprintProgress, writableArray);
            }

            @Override
            public void onCollectFingerprint(int currentCount) {
                WritableArray writableArray = Arguments.createArray();
                writableArray.pushInt(currentCount);
                writableArray.pushInt(totalCnt);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(TTLockEvent.addFingerprintProgress, writableArray);
            }

            @Override
            public void onAddFingerpintFinished(long fingerprintNum) {
                success.invoke(String.valueOf(fingerprintNum));
            }

            @Override
            public void onFail(LockError lockError) {
                lockErrorCallback(lockError, fail);
            }
        });
    }

    @ReactMethod
    public void modifyFingerprintValidityPeriod(String fingerprintNumber, ReadableArray cycleList, double startDate, double endDate, String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(fingerprintNumber)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }

        ValidityInfo validityInfo = new ValidityInfo();
        validityInfo.setModeType(cycleList == null || cycleList.size() == 0 ? ValidityInfo.TIMED : ValidityInfo.CYCLIC);
        validityInfo.setStartDate((long) startDate);
        validityInfo.setEndDate((long) endDate);
        validityInfo.setCyclicConfigs(Utils.readableArray2CyclicList(cycleList));

        TTLockClient.getDefault().modifyFingerprintValidityPeriod(validityInfo, fingerprintNumber, lockData, new ModifyFingerprintPeriodCallback() {
            @Override
            public void onModifyPeriodSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError lockError) {
                lockErrorCallback(lockError, fail);
            }
        });
    }

    @ReactMethod
    public void deleteFingerprint(String fingerprintNumber, String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(fingerprintNumber)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().deleteFingerprint(fingerprintNumber, lockData, null, new DeleteFingerprintCallback() {
            @Override
            public void onDeleteFingerprintSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void clearAllFingerprints(String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().clearAllFingerprints(lockData, null, new ClearAllFingerprintCallback() {
            @Override
            public void onClearAllFingerprintSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError lockError) {
                lockErrorCallback(lockError, fail);
            }
        });
    }

    @ReactMethod
    public void modifyAdminPasscode(String adminPasscode, String lockData, Callback success, Callback fail) {
        if (TextUtils.isEmpty(adminPasscode)) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        TTLockClient.getDefault().modifyAdminPasscode(adminPasscode, lockData, null, new ModifyAdminPasscodeCallback() {
            @Override
            public void onModifyAdminPasscodeSuccess(String passcode) {
                success.invoke(passcode);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void setLockTime(double timestamp, String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().setLockTime((long) timestamp, lockData, null, new SetLockTimeCallback() {
            @Override
            public void onSetTimeSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void getLockTime(String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().getLockTime(lockData, null, new GetLockTimeCallback() {
            @Override
            public void onGetLockTimeSuccess(long lockTimestamp) {
                success.invoke(String.valueOf(lockTimestamp));
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void getLockOperationRecord(int type, String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().getOperationLog(type == 0 ? LogType.NEW : LogType.ALL, lockData, null, new GetOperationLogCallback() {
            @Override
            public void onGetLogSuccess(String log) {
                success.invoke(log);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void getLockAutomaticLockingPeriodicTime(String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().getAutomaticLockingPeriod(lockData, new GetAutoLockingPeriodCallback() {
            @Override
            public void onGetAutoLockingPeriodSuccess(int currtentTime, int minTime, int maxTime) {
                WritableArray writableArray = Arguments.createArray();
                writableArray.pushInt(currtentTime);
                writableArray.pushInt(maxTime);
                writableArray.pushInt(minTime);
                success.invoke(writableArray);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void setLockAutomaticLockingPeriodicTime(int seconds, String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().setAutomaticLockingPeriod(seconds, lockData, null, new SetAutoLockingPeriodCallback() {
            @Override
            public void onSetAutoLockingPeriodSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void getLockRemoteUnlockSwitchState(String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().getRemoteUnlockSwitchState(lockData, null, new GetRemoteUnlockStateCallback() {
            @Override
            public void onGetRemoteUnlockSwitchStateSuccess(boolean enabled) {
                success.invoke(enabled);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void setLockRemoteUnlockSwitchState(boolean isOn, String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().setRemoteUnlockSwitchState(isOn, lockData, null, new SetRemoteUnlockSwitchCallback() {
            @Override
            public void onSetRemoteUnlockSwitchSuccess(String lockData) {
                success.invoke(lockData);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void getLockConfig(int config, String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().getLockConfig(TTLockConfigConverter.RN2Native(config), lockData, new GetLockConfigCallback() {
            @Override
            public void onGetLockConfigSuccess(TTLockConfigType ttLockConfigType, boolean switchOn) {
                LogUtil.d("ttLockConfigType:" + switchOn);
                WritableArray writableArray = Arguments.createArray();
                writableArray.pushInt(TTLockConfigConverter.native2RN(ttLockConfigType));
                writableArray.pushBoolean(switchOn);
                success.invoke(writableArray);
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void setLockConfig(int config, boolean isOn, String lockData, Callback success, Callback fail) {
        TTLockConfigType ttLockConfigType = TTLockConfigConverter.RN2Native(config);
        if (ttLockConfigType == null) {
            lockErrorCallback(LockError.DATA_FORMAT_ERROR, fail);
            return;
        }
        LogUtil.d("ttLockConfigType:" + isOn);
        TTLockClient.getDefault().setLockConfig(ttLockConfigType, isOn, lockData, new SetLockConfigCallback() {
            @Override
            public void onSetLockConfigSuccess(TTLockConfigType ttLockConfigType) {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void addPassageMode(int type, ReadableArray weekly, ReadableArray monthly, int startDate, int endDate, String lockData, Callback success, Callback fail) {
        PassageModeConfig passageModeConfig = new PassageModeConfig();
        passageModeConfig.setModeType(type == 0 ? PassageModeType.Weekly : PassageModeType.Monthly);
        if (passageModeConfig.getModeType() == PassageModeType.Weekly) {
            passageModeConfig.setRepeatWeekOrDays(Utils.readableArray2IntJson(weekly));
        } else {
            passageModeConfig.setRepeatWeekOrDays(Utils.readableArray2IntJson(monthly));
        }
        passageModeConfig.setStartDate(startDate);
        passageModeConfig.setEndDate(endDate);

        LogUtil.d("weekdays:" + passageModeConfig.getRepeatWeekOrDays());

        TTLockClient.getDefault().setPassageMode(passageModeConfig, lockData, null, new SetPassageModeCallback() {
            @Override
            public void onSetPassageModeSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void clearAllPassageModes(String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().clearPassageMode(lockData, null, new ClearPassageModeCallback() {
            @Override
            public void onClearPassageModeSuccess() {
                success.invoke();
            }

            @Override
            public void onFail(LockError error) {
                lockErrorCallback(error, fail);
            }
        });
    }

    @ReactMethod
    public void getLockVersionWithLockMac(String lockData, Callback success, Callback fail) {
        TTLockClient.getDefault().getLockVersion(lockData, new GetLockVersionCallback() {
            @Override
            public void onGetLockVersionSuccess(String lockVersion) {
                success.invoke(lockVersion);
            }

            @Override
            public void onFail(LockError lockError) {
                lockErrorCallback(lockError, fail);
            }
        });
    }

    @ReactMethod
    public void getBluetoothState(Callback callback) {
        boolean enable = TTLockClient.getDefault().isBLEEnabled(getCurrentActivity());
        //4-on, 5-off
        callback.invoke(enable ? 4 : 5);
    }

    @ReactMethod
    public void supportFunction(int function, String lockData, Callback callback) {
        boolean support = FeatureValueUtil.isSupportFeature(lockData, function);
        callback.invoke(support);
    }

    private void lockErrorCallback(LockError lockError, Callback fail) {
        if (fail != null) {
            fail.invoke(TTLockErrorConverter.native2RN(lockError), lockError.getErrorMsg());
        }
    }



}
