package com.reactnativettlock.model;

import com.ttlock.bl.sdk.keypad.model.KeypadError;
import com.ttlock.bl.sdk.remote.model.RemoteError;

/**
 * Created by TTLock on 2020/9/10.
 */
public class TTKeypadErrorConverter {

  public static final int fail = 0;
  public static final int wrongCRC = 1;
  public static final int connectTimeout = 2;
  public static final int wrongFactorydDate = 3;

    public static int native2RN(KeypadError error) {
      switch (error) {
        case FAILED:
          return fail;
        case KEYBOARD_CONNECT_FAIL:
          return connectTimeout;
      }
      return fail;
    }

}
