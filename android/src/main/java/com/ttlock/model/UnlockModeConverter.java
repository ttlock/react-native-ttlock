package com.reactnativettlock.model;

import com.ttlock.bl.sdk.entity.UnlockMode;

/**
 * Converter between the RN sequential index and the SDK {@link UnlockMode} bitmask enum.
 * <p>The enum constant order here mirrors the RN {@code UnlockMode} enum (0-based).</p>
 */
public enum UnlockModeConverter {
  fingerprint,
  card,
  passcode;

  public static UnlockMode RN2Native(double doubleIndex) {
    int index = (int) doubleIndex;
    UnlockModeConverter[] constants = UnlockModeConverter.class.getEnumConstants();
    if (index >= 0 && index < constants.length) {
      return RN2Native(constants[index]);
    }
    return null;
  }

  public static UnlockMode RN2Native(UnlockModeConverter converter) {
    switch (converter) {
      case fingerprint:
        return UnlockMode.FINGERPRINT;
      case card:
        return UnlockMode.CARD;
      case passcode:
        return UnlockMode.PASSCODE;
    }
    return null;
  }

  public static int native2RN(UnlockMode mode) {
    switch (mode) {
      case FINGERPRINT:
        return fingerprint.ordinal();
      case CARD:
        return card.ordinal();
      case PASSCODE:
        return passcode.ordinal();
    }
    return -1;
  }
}
