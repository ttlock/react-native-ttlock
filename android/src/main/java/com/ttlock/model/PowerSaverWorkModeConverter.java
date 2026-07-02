package com.reactnativettlock.model;

import com.ttlock.bl.sdk.entity.PowerSaverWorkMode;

/**
 * Converter between the RN sequential index and the SDK {@link PowerSaverWorkMode} bitmask enum.
 * <p>The enum constant order here mirrors the RN {@code PowerSaverWorkMode} enum (0-based).</p>
 */
public enum PowerSaverWorkModeConverter {
  allCards,
  idCard,
  hotelCard,
  roomCard,
  autoGetPower;

  public static PowerSaverWorkMode RN2Native(double doubleIndex) {
    int index = (int) doubleIndex;
    PowerSaverWorkModeConverter[] constants = PowerSaverWorkModeConverter.class.getEnumConstants();
    if (index >= 0 && index < constants.length) {
      return RN2Native(constants[index]);
    }
    return null;
  }

  public static PowerSaverWorkMode RN2Native(PowerSaverWorkModeConverter converter) {
    switch (converter) {
      case allCards:
        return PowerSaverWorkMode.ALL_CARDS;
      case idCard:
        return PowerSaverWorkMode.ID_CARD;
      case hotelCard:
        return PowerSaverWorkMode.HOTEL_CARD;
      case roomCard:
        return PowerSaverWorkMode.ROOM_CARD;
      case autoGetPower:
        return PowerSaverWorkMode.AUTO_GET_POWER;
    }
    return null;
  }
}
