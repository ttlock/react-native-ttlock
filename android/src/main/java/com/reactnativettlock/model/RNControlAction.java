package com.reactnativettlock.model;

import com.ttlock.bl.sdk.constant.ControlAction;

/**
 * Created by TTLock on 2021/1/5.
 */
public class RNControlAction {
    public static final int unlock = 0;
    public static final int lock = 1;

    public static int RN2Native(int rnAction) {
        switch (rnAction) {
            case unlock:
                return ControlAction.UNLOCK;
            case lock:
                return ControlAction.LOCK;
                default:
                    return ControlAction.UNLOCK;
        }
    }

    public static boolean isValidAction(int rnAction) {
        if (rnAction < 0 || rnAction > 1) {
            return false;
        }
        return true;
    }
}
