package com.reactnativettlock.model;

import com.ttlock.bl.sdk.entity.LockError;
import com.ttlock.bl.sdk.wirelessdoorsensor.model.DoorSensorError;

/**
 * Created by TTLock on 2020/9/10.
 */
public class TTDoorSensorErrorConverter {

  public static final int bluetoothPowerOff = 0;
  public static final int connectTimeout = 1;
  public static final int fail = 2;
  public static final int wrongCRC = 3;

    public static int native2RN(DoorSensorError error) {
      switch (error) {
        case FAILED:
          return fail;
        case CONNECT_FAIL:
          return connectTimeout;
      }
      return fail;
    }

}
