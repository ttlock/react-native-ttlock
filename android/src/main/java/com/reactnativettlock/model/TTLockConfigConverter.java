package com.reactnativettlock.model;


import com.ttlock.bl.sdk.entity.TTLockConfigType;

/**
 * Created by TTLock on 2020/9/10.
 */
public enum TTLockConfigConverter {
  audio,
  passcodeVisible,
  freeze,
  tamperAlert,
  resetButton,
  privacyLock,
  passageModeAutoUnlock,
  wifiPowerSavingMode;

  public static TTLockConfigType RN2Native(int index) {
    if (index < TTLockConfigConverter.class.getEnumConstants().length) {
      return RN2Native(TTLockConfigConverter.class.getEnumConstants()[index]);
    }
    return null;
  }

  public static TTLockConfigType RN2Native(TTLockConfigConverter ttLockConfigConverter) {
    switch (ttLockConfigConverter) {
      case audio:
        return TTLockConfigType.LOCK_SOUND;
      case passcodeVisible:
        return TTLockConfigType.PASSCODE_VISIBLE;
      case freeze:
        return TTLockConfigType.LOCK_FREEZE;
      case privacyLock:
        return TTLockConfigType.PRIVACY_LOCK;
      case resetButton:
        return TTLockConfigType.RESET_BUTTON;
      case tamperAlert:
        return TTLockConfigType.TAMPER_ALERT;
      case passageModeAutoUnlock:
        return TTLockConfigType.PASSAGE_MODE_AUTO_UNLOCK_SETTING;
      case wifiPowerSavingMode:
        return TTLockConfigType.WIFI_LOCK_POWER_SAVING_MODE;
    }
    return null;
  }

  public static int native2RN(TTLockConfigType ttLockConfigType) {
    switch (ttLockConfigType) {
      case LOCK_SOUND:
        return audio.ordinal();
      case PASSCODE_VISIBLE:
        return passcodeVisible.ordinal();
      case LOCK_FREEZE:
        return freeze.ordinal();
      case PRIVACY_LOCK:
        return privacyLock.ordinal();
      case RESET_BUTTON:
        return resetButton.ordinal();
      case TAMPER_ALERT:
        return tamperAlert.ordinal();
      case PASSAGE_MODE_AUTO_UNLOCK_SETTING:
        return passageModeAutoUnlock.ordinal();
      case WIFI_LOCK_POWER_SAVING_MODE:
        return wifiPowerSavingMode.ordinal();
    }
    return -1;//未知
  }
}
