package com.reactnativettlock.model;

import com.ttlock.bl.sdk.gateway.model.GatewayError;
import com.ttlock.bl.sdk.keypad.model.KeypadError;

/**
 * Created by TTLock on 2020/9/10.
 */
public class TTGatewayErrorConverter {

  public static final int fail = 0;
  public static final int wrongSSID = 1;
  public static final int wrongWifiPassword = 2;
  public static final int wrongCRC = 3;
  public static final int wrongAeskey = 4;
  public static final int notConnect = 5;
  public static final int disconnect = 6;
  public static final int failConfigRouter = 7;
  public static final int failConfigServer = 8;
  public static final int failConfigAccount = 9;
  public static final int noSIM = 10;
  public static final int invalidCommand = 11;
  public static final int failConfigIP = 12;
  public static final int failInvaildIP = 13;

    public static int native2RN(GatewayError error) {
      switch (error) {
        case FAILED:
          return fail;
        case BAD_WIFI_NAME:
          return wrongSSID;
        case BAD_WIFI_PASSWORD:
          return wrongWifiPassword;
        case INVALID_COMMAND:
          return invalidCommand;
        case TIME_OUT:
          return notConnect;
        case NO_SIM_CARD:
          return noSIM;
        case FAILED_TO_CONFIGURE_ROUTER:
          return failConfigRouter;
        case FAILED_TO_CONFIGURE_SERVER:
          return failConfigServer;
        case FAILED_TO_CONFIGURE_ACCOUNT:
          return failConfigAccount;
      }
      return fail;
    }

}
