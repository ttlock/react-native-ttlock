package com.reactnativettlock.model;

import com.ttlock.bl.sdk.entity.LockError;

/**
 * Created by TTLock on 2020/9/10.
 */
public class TTLockErrorConverter {

  public static final int hadReseted = 0;
  public static final int crcError = 1;
  public static final int noPermisstion = 2;
  public static final int wrongAdminCode = 3;
  public static final int lackOfStorageSpace = 4;
  public static final int inSettingMode = 5;
  public static final int noAdmin = 6;
  public static final int notInSettingMode = 7;
  public static final int wrongDynamicCode = 8;
  public static final int isNoPower = 9;
  public static final int resetPasscode = 10;
  public static final int updatePasscodeIndex = 11;
  public static final int invalidLockFlagPos = 12;
  public static final int ekeyExpired = 13;
  public static final int passcodeLengthInvalid = 14;
  public static final int samePasscodes = 15;
  public static final int ekeyInactive = 16;
  public static final int aesKey = 17;
  public static final int fail = 18;
  public static final int passcodeExist = 19;
  public static final int passcodeNotExist = 20;
  public static final int lackOfStorageSpaceWhenAddingPasscodes = 21;
  public static final int invalidParaLength = 22;
  public static final int cardNotExist = 23;
  public static final int fingerprintDuplication = 24;
  public static final int fingerprintNotExist = 25;
  public static final int invalidCommand = 26;
  public static final int inFreezeMode = 27;
  public static final int invalidClientPara = 28;
  public static final int lockIsLocked = 29;
  public static final int recordNotExist = 30;
  public static final int wrongSSID = 31;
  public static final int wrongWifiPassword = 32;
  public static final int bluetoothPoweredOff = 33;
  public static final int connectionTimeout = 34;
  public static final int disconnection = 35;
  public static final int lockIsBusy = 36;
  public static final int wrongLockData = 37;
  public static final int invalidParameter = 38;

    public static int native2RN(LockError error) {
      switch (error) {
        case KEY_INVALID:
          return hadReseted;
        case LOCK_CRC_CHECK_ERROR:
          return crcError;
        case LOCK_NO_PERMISSION:
          return noPermisstion;
        case LOCK_ADMIN_CHECK_ERROR:
          return wrongAdminCode;
        case LOCK_IS_IN_SETTING_MODE:
          return inSettingMode;
        case LOCK_NOT_EXIST_ADMIN:
          return noAdmin;
        case LOCK_IS_IN_NO_SETTING_MODE:
          return notInSettingMode;
        case LOCK_DYNAMIC_PWD_ERROR:
          return wrongDynamicCode;
        case LOCK_NO_POWER:
          return isNoPower;
        case LOCK_INIT_KEYBOARD_FAILED:
          return resetPasscode;
        case LOCK_KEY_FLAG_INVALID:
          return invalidLockFlagPos;
        case LOCK_USER_TIME_EXPIRED:
          return ekeyExpired;
        case LOCK_PASSWORD_LENGTH_INVALID:
          return passcodeLengthInvalid;
        case LOCK_SUPER_PASSWORD_IS_SAME_WITH_DELETE_PASSWORD:
          return samePasscodes;
        case LOCK_USER_TIME_INEFFECTIVE:
          return ekeyInactive;
        case LOCK_PASSWORD_EXIST:
          return passcodeExist;
        case LOCK_PASSWORD_NOT_EXIST:
          return passcodeNotExist;
        case LOCK_NO_FREE_MEMORY:
          return lackOfStorageSpace;
        case LOCK_REVERSE:
          return lockIsLocked;
        case INVALID_VENDOR:
          return invalidClientPara;
        case INVALID_COMMAND:
          return invalidCommand;
        case LOCK_FROZEN:
          return inFreezeMode;
        case BAD_WIFI_NAME:
          return wrongSSID;
        case BAD_WIFI_PASSWORD:
          return wrongWifiPassword;
        case IC_CARD_NOT_EXIST:
          return cardNotExist;
        case FINGER_PRINT_NOT_EXIST:
          return fingerprintNotExist;
        case INVALID_PARAM:
          return invalidParameter;
        case RECORD_NOT_EXIST:
          return recordNotExist;
        case Failed:
          return fail;
        case LOCK_CONNECT_FAIL:
          return connectionTimeout;
        case LOCK_IS_BUSY:
          return lockIsBusy;
        case DATA_FORMAT_ERROR:
          return invalidParameter;
      }
      return fail;
    }
}
