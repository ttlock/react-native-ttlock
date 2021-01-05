package com.reactnativettlock.model;

/**
 * Created by TTLock on 2021/1/4.
 */
public class ScanLockModal {
    public String lockName;
    public String lockMac;
    public boolean isInited;
    public boolean isKeyboardActivated;
    public int electricQuantity;
    public String lockVersion;
    public int rssi;

    //暂时未使用
    public int lockSwitchState;
    public int oneMeterRSSI;
}
