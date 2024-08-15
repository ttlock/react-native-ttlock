package com.reactnativettlock.model;

import com.facebook.react.bridge.ReadableMap;
import com.ttlock.bl.sdk.entity.IpSetting;

import java.lang.reflect.Field;
import java.util.Map;

public class IpSettingConverter {

  public static IpSetting toObject(ReadableMap readableMap) {
    Map<String, Object> params = readableMap.toHashMap();
    IpSetting ipSetting = new IpSetting();
    Field[] fields = ipSetting.getClass().getDeclaredFields();
    try {
      for (int i = 0; i < fields.length; i++) {
        //设置是否允许访问，不是修改原来的访问权限修饰词。
        fields[i].setAccessible(true);
        if (params.get(fields[i].getName()) != null) {
          fields[i].set(ipSetting, params.get(fields[i].getName()));
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
    return ipSetting;
  }
}
