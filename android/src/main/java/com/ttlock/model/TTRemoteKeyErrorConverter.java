package com.reactnativettlock.model;

import com.ttlock.bl.sdk.remote.model.RemoteError;
import com.ttlock.bl.sdk.wirelessdoorsensor.model.DoorSensorError;

/**
 * Created by TTLock on 2020/9/10.
 */
public class TTRemoteKeyErrorConverter {

  public static final int fail = 0;
  public static final int wrongCRC = 1;
  public static final int connectTimeout = 2;

    public static int native2RN(RemoteError error) {
      switch (error) {
        case FAILED:
          return fail;
        case CONNECT_FAIL:
          return connectTimeout;
      }
      return fail;
    }

}
