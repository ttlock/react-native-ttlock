package com.reactnativettlock.util;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.reactnativettlock.model.TTLockFieldConstant;
import com.ttlock.bl.sdk.entity.CyclicConfig;
import com.ttlock.bl.sdk.entity.WorkingTimesConfig;
import com.ttlock.bl.sdk.util.GsonUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by TTLock on 2021/1/7.
 */
public class Utils {

    public static List<Integer> readableArray2IntList(ReadableArray readableArray) {
      List<Integer> list = new ArrayList<>();
      if (readableArray != null) {
        for (int i=0;i<readableArray.size();i++) {
          list.add(readableArray.getInt(i));
        }
      }
      return list;
    }

    public static String readableArray2IntJson(ReadableArray readableArray) {
        String json = "[]";
        if (readableArray != null) {
            List<Integer> integers = new ArrayList<>();
            for (int i=0;i<readableArray.size();i++) {
                integers.add(readableArray.getInt(i));
            }
            json = GsonUtil.toJson(integers);
        }
        return json;
    }

    public static List<CyclicConfig> readableArray2CyclicList(ReadableArray readableArray) {
        List<CyclicConfig> cyclicConfigs = new ArrayList<>();
        if (readableArray != null) {
            for (int i=0;i<readableArray.size();i++) {
                ReadableMap map = readableArray.getMap(i);
                CyclicConfig cyclicConfig = new CyclicConfig();
                cyclicConfig.setWeekDay(map.getInt(TTLockFieldConstant.WEEK_DAY));
                cyclicConfig.setStartTime(map.getInt(TTLockFieldConstant.START_TIME));
                cyclicConfig.setEndTime(map.getInt(TTLockFieldConstant.END_TIME));
                cyclicConfigs.add(cyclicConfig);
            }
        }
        return cyclicConfigs;
    }

    // 锁工作模式的时间段配置（weekDays 数组）/ Working times config for setWorkingMode (weekDays array).
    public static List<WorkingTimesConfig> readableArray2WorkingTimesList(ReadableArray readableArray) {
        List<WorkingTimesConfig> workingTimesConfigs = new ArrayList<>();
        if (readableArray != null) {
            for (int i=0;i<readableArray.size();i++) {
                ReadableMap map = readableArray.getMap(i);
                WorkingTimesConfig workingTimesConfig = new WorkingTimesConfig();
                workingTimesConfig.setStartTime(map.getInt(TTLockFieldConstant.START_TIME));
                workingTimesConfig.setEndTime(map.getInt(TTLockFieldConstant.END_TIME));
                ReadableArray weekDays = map.getArray(TTLockFieldConstant.WEEK_DAYS);
                if (weekDays != null) {
                    workingTimesConfig.setWeekDays(readableArray2IntList(weekDays).toArray(new Integer[0]));
                }
                workingTimesConfigs.add(workingTimesConfig);
            }
        }
        return workingTimesConfigs;
    }
}
