#import "Ttlock.h"
#import <TTLockOnPremise/TTLock.h>
#import <objc/message.h>


#define NOT_NULL_STRING(string) (string ?: @"")

#define EVENT_SCAN_LOCK @"EventScanLock"
#define EVENT_ADD_CARD_PROGRESS @"EventAddCardProgrress"
#define EVENT_ADD_FINGERPRINT_PROGRESS @"EventAddFingerprintProgrress"
#define EVENT_BLUETOOTH_STATE @"EventBluetoothState"
#define EVENT_SCAN_GATEWAY @"EventScanGateway"
#define EVENT_SCAN_WIFI @"EventScanWifi"
#define EVENT_SCAN_REMOTE_KEY @"EventScanRemoteKey"
#define EVENT_SCAN_DOOR_SENSOR @"EventScanDoorSensor"
#define EVENT_SCAN_WIRELESS_KEYPAD @"EventWirelessKeypad"


//static bool isAddListenBluetoothState = false;


@implementation Ttlock

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init{
    if (self = [super init]) {
//        __weak Ttlock *weakSelf = self;
        [TTLock setupBluetooth:^(TTBluetoothState state) {
//            if (isAddListenBluetoothState) {
//                [weakSelf sendEventWithName:EVENT_BLUETOOTH_STATE body:@(state)];
//            }
        }];
    }
    return self;
}

//暴露出支持的事件
- (NSArray<NSString *> *)supportedEvents
{
  return @[
      EVENT_SCAN_LOCK,
      EVENT_ADD_CARD_PROGRESS,
      EVENT_ADD_FINGERPRINT_PROGRESS,
//      EVENT_BLUETOOTH_STATE,
      EVENT_SCAN_GATEWAY,
      EVENT_SCAN_WIFI,
      EVENT_SCAN_REMOTE_KEY,
      EVENT_SCAN_DOOR_SENSOR,
      EVENT_SCAN_WIRELESS_KEYPAD
  ];
}

- (void)addListener:(NSString *)eventName
{
    [super addListener:eventName];
//    if ([eventName isEqualToString:EVENT_BLUETOOTH_STATE]) {
//        isAddListenBluetoothState = true;
//    }
}

RCT_EXPORT_METHOD(getBluetoothState:(RCTResponseSenderBlock)callbackBlock)
{
    TTBluetoothState bluetoothState = [TTLock bluetoothState];
    [Ttlock response:@(bluetoothState) success:callbackBlock];
    
}



#pragma mark - Lock
RCT_EXPORT_METHOD(startScan)
{
    [TTLock startScan:^(TTScanModel *scanModel) {
        NSMutableDictionary *data = @{}.mutableCopy;
        data[@"lockName"] = scanModel.lockName;
        data[@"lockMac"] = scanModel.lockMac;
        data[@"isInited"] = @(scanModel.isInited ? true : false);
        data[@"isKeyboardActivated"] = @(scanModel.isAllowUnlock ? true : false);
        data[@"electricQuantity"] = @(scanModel.electricQuantity);
        data[@"lockVersion"] = scanModel.lockVersion;
        data[@"lockSwitchState"] = @(scanModel.lockSwitchState);
        data[@"rssi"] = @(scanModel.RSSI);
        data[@"oneMeterRssi"] = @(scanModel.oneMeterRSSI);
        [self sendEventWithName:EVENT_SCAN_LOCK body:data];
    }];
}

RCT_EXPORT_METHOD(stopScan)
{
    [TTLock stopScan];
}


RCT_EXPORT_METHOD(initLock:(NSDictionary *)dict success:(RCTResponseSenderBlock)successfulBlock fail:(RCTResponseSenderBlock)failedBlock)
{
    [TTLock initLockWithDict:dict success:^(NSString *lockData) {
        successfulBlock(@[lockData]);
    } failure:^(TTError errorCode, NSString *errorMsg) {
        failedBlock(@[@(errorCode),NOT_NULL_STRING(errorMsg)]);
    }];
}

RCT_EXPORT_METHOD(resetLock:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock resetLockWithLockData:lockData success:^() {
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getLockVersionWithLockMac:(NSString *)lockMac success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockVersionWithLockMac:lockMac success:^(NSDictionary *lockVersion) {
        [Ttlock response:lockVersion success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(controlLock:(NSInteger)controlAction lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    TTControlAction action = controlAction + 1;
    [TTLock controlLockWithControlAction:action lockData:lockData success:^(long long lockTime, NSInteger electricQuantity, long long uniqueId) {
        [Ttlock response:@[@(lockTime),@(electricQuantity),@(uniqueId)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(resetEkey:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock resetEkeyWithLockData:lockData success:^(NSString *lockData) {
        [Ttlock response:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockTime:(nonnull NSNumber *)timestamp lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setLockTimeWithTimestamp:timestamp.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockTime:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock getLockTimeWithLockData:lockData success:^(long long lockTimestamp) {
        [Ttlock response:@(lockTimestamp) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockElectricQuantity:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getElectricQuantityWithLockData:lockData success:^(NSInteger electricQuantity) {
        [Ttlock response:@(electricQuantity) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockOperationRecord:(int)type lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTOperateLogType logType = type + 1;
    [TTLock getOperationLogWithType:logType lockData:lockData success:^(NSString *operateRecord) {
        [Ttlock response:operateRecord success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}



RCT_EXPORT_METHOD(createCustomPasscode:(NSString *)passcode startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock createCustomPasscode:passcode startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyPasscode:(NSString *)passcodeOrigin passcodeNew:(NSString *)passcodeNew startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyPasscode:passcodeOrigin newPasscode:passcodeNew startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deletePasscode:(NSString *)passcode lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock deletePasscode:passcode lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(resetPasscode:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock resetPasscodesWithLockData:lockData success:^(NSString *lockData) {
        [Ttlock response:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockSwitchState:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockSwitchStateWithLockData:lockData success:^(TTLockSwitchState state, TTDoorSensorState doorSensorState) {
        [Ttlock response:@(state) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addCard:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{

    __weak Ttlock *weakSelf = self;
    [TTLock addICCardWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddICState state) {
        [weakSelf sendEventWithName:EVENT_ADD_CARD_PROGRESS body:nil];
    } success:^(NSString *cardNumber) {
        [Ttlock response:cardNumber success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyCardValidityPeriod:(NSString *)cardNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyICCardValidityPeriodWithCyclicConfig:cycleList cardNumber:cardNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deleteCard:(NSString *)cardNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteICCardNumber:cardNumber lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllCards:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock clearAllICCardsWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addFingerprint:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    __weak Ttlock *weakSelf = self;
    [TTLock addFingerprintWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(int currentCount, int totalCount) {
        [weakSelf sendEventWithName:EVENT_ADD_FINGERPRINT_PROGRESS body:@[@(currentCount),@(totalCount)]];
    } success:^(NSString *fingerprintNumber) {
        [Ttlock response:fingerprintNumber success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyFingerprintValidityPeriod:(NSString *)fingerprintNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyFingerprintValidityPeriodWithCyclicConfig:cycleList fingerprintNumber:fingerprintNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deleteFingerprint:(NSString *)fingerprintNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteFingerprintNumber:fingerprintNumber lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllFingerprints:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock clearAllFingerprintsWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyAdminPasscode:(NSString *)adminPasscode  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock modifyAdminPasscode:adminPasscode lockData:lockData success:^(NSString *newLockData) {
            [Ttlock response:newLockData success:success];
            } failure:^(TTError errorCode, NSString *errorMsg) {
                [Ttlock response:errorCode message:errorMsg fail:fail];
            }];
}




RCT_EXPORT_METHOD(getLockAutomaticLockingPeriodicTime:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getAutomaticLockingPeriodicTimeWithLockData:lockData success:^(int currentTime, int minTime, int maxTime) {
        [Ttlock response:@[@(currentTime),@(maxTime),@(minTime)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}



RCT_EXPORT_METHOD(setLockAutomaticLockingPeriodicTime:(int)time  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setAutomaticLockingPeriodicTime:time lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getLockRemoteUnlockSwitchState:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getRemoteUnlockSwitchWithLockData:lockData success:^(BOOL isOn) {
        [Ttlock response:@(isOn) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockRemoteUnlockSwitchState:(BOOL)isOn  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setRemoteUnlockSwitchOn:isOn lockData:lockData success:^(NSString *lockData) {
        [Ttlock response:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getLockConfig:(int)config  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTLockConfigType type = config + 1;
    [TTLock getLockConfigWithType:type lockData:lockData success:^(TTLockConfigType type, BOOL isOn) {
        [Ttlock response:@[@(type),@(isOn)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockConfig:(int)config isOn:(BOOL)isOn lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTLockConfigType type = config + 1;
    [TTLock setLockConfigWithType:type on:isOn lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(setLockSoundVolume:(int)soundVolume lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setLockSoundWithSoundVolume:soundVolume lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockSoundVolume:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockSoundWithLockData:lockData success:^(TTSoundVolume soundVolume) {
        [Ttlock response:@(soundVolume) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getUnlockDirection:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getUnlockDirectionWithLockData:lockData success:^(TTUnlockDirection direction) {
        [Ttlock response:@(direction) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setUnlockDirection:(int)unlockDirection lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setUnlockDirection:unlockDirection lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addPassageMode:(int)type weekly:(NSArray<NSNumber *> *)weekly monthly:(NSArray<NSNumber *> *)monthly startDate:(int)startDate endDate:(int)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTPassageModeType modeType = type + 1;
    [TTLock configPassageModeWithType:modeType weekly:weekly monthly:monthly startDate:startDate endDate:endDate lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(clearAllPassageModes:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearPassageModeWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addRemoteKey:(NSString *)remoteKeyMac cyclicConfig:(NSArray *)cyclicConfig startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock addWirelessKeyFobWithCyclicConfig:cyclicConfig keyFobMac:remoteKeyMac startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyRemoteKey:(NSString *)remoteKeyMac cyclicConfig:(NSArray *)cyclicConfig startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyWirelessKeyFobValidityPeriodWithCyclicConfig:cyclicConfig keyFobMac:remoteKeyMac startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deleteRemoteKey:(NSString *)remoteKeyMac lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteWirelessKeyFobWithKeyFobMac:remoteKeyMac lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllRemoteKey:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearWirelessKeyFobsWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addDoorSensor:(NSString *)doorSensorMac lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock addDoorSensorWithDoorSensorMac:doorSensorMac lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllDoorSensor:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearDoorSensorWithLockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(setDoorSensorAlertTime:(int) time lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setDoorSensorAlertTime:time lockData:lockData success:^{
        [Ttlock response:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(supportFunction:(int)fuction lockData:(NSString *)lockData callback:(RCTResponseSenderBlock)callback)
{
    BOOL isSupport = [TTUtil lockFeatureValue:lockData suportFunction:fuction];
    [Ttlock response:@(isSupport) success:callback];
}



#pragma mark - Gateway
RCT_EXPORT_METHOD(startScanGateway)
{
    [TTGateway startScanGatewayWithBlock:^(TTGatewayScanModel *model) {
        NSMutableDictionary *dict = @{}.mutableCopy;
        dict[@"gatewayMac"] = model.gatewayMac;
        dict[@"gatewayName"] = model.gatewayName;
        dict[@"rssi"] = @(model.RSSI);
        dict[@"isDfuMode"] = @(model.isDfuMode);
        dict[@"type"] = @(model.type);
        [self sendEventWithName:EVENT_SCAN_GATEWAY body:dict];
    }];
}

RCT_EXPORT_METHOD(stopScanGateway)
{
    [TTGateway stopScanGateway];
}

RCT_EXPORT_METHOD(connect:(NSString *)mac block:(RCTResponseSenderBlock)block)
{
    [TTGateway connectGatewayWithGatewayMac:mac block:^(TTGatewayConnectStatus connectStatus) {
        [Ttlock response:@(connectStatus) success:block];
    }];
}

RCT_EXPORT_METHOD(getNearbyWifi:(RCTResponseSenderBlock)block)
{
    [TTGateway scanWiFiByGatewayWithBlock:^(BOOL isFinished, NSArray *WiFiArr, TTGatewayStatus status) {
        if (status == TTGatewaySuccess) {
            NSMutableArray *wifiList = @[].mutableCopy;
            for (NSDictionary *dict in WiFiArr) {
                NSMutableDictionary *wifiDict = @{}.mutableCopy;
                wifiDict[@"wifi"] = dict[@"SSID"];
                wifiDict[@"rssi"] = dict[@"RSSI"];
                [wifiList addObject:wifiDict];
            }
            [self sendEventWithName:EVENT_SCAN_WIFI body:wifiList];
            
            if (isFinished) {
                [Ttlock response:@(status) success:block];
            }
        }else{
            [Ttlock response:@(status) success:block];
        }
    }];
}

RCT_EXPORT_METHOD(initGateway:(NSDictionary *)dict success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    TTGatewayType gatewayType = [dict[@"type"] intValue];
    
    NSMutableDictionary *paramDict = @{}.mutableCopy;
    paramDict[@"SSID"] = dict[@"wifi"];
    paramDict[@"wifiPwd"] = dict[@"wifiPassword"];
    paramDict[@"uid"] = dict[@"ttlockUid"];
    paramDict[@"userPwd"] = dict[@"ttlockLoginPassword"];
    paramDict[@"gatewayName"] = dict[@"gatewayName"];
    paramDict[@"serverAddress"] = dict[@"serverIp"];
    paramDict[@"portNumber"] = dict[@"serverPort"];
    paramDict[@"gatewayVersion"] = @(gatewayType);
    if (gatewayType > TTGateWayTypeG2) {
        paramDict[@"SSID"] = @"1";
        paramDict[@"wifiPwd"] = @"1";
    }
    
    paramDict[@"type"] = dict[@"ipSettingType"];
    paramDict[@"ipAddress"] = dict[@"ipAddress"];
    paramDict[@"subnetMask"] = dict[@"subnetMask"];
    paramDict[@"router"] = dict[@"router"];
    paramDict[@"preferredDns"] = dict[@"preferredDns"];
    paramDict[@"alternateDns"] = dict[@"alternateDns"];
    
    [TTGateway initializeGatewayWithInfoDic:paramDict block:^(TTSystemInfoModel *systemInfoModel, TTGatewayStatus status) {
        if (status == TTGatewaySuccess) {
            NSDictionary *resultDict = @{
                @"modelNum":NOT_NULL_STRING(systemInfoModel.modelNum),
                @"hardwareRevision":NOT_NULL_STRING(systemInfoModel.hardwareRevision),
                @"firmwareRevision":NOT_NULL_STRING(systemInfoModel.firmwareRevision)
            };
            [Ttlock response:resultDict success:success];
        }else{
            [Ttlock response:status  message:nil fail:fail];
        }
    }];
}




#pragma mark - RemoteKey
RCT_EXPORT_METHOD(startScanRemoteKey)
{
    [TTWirelessKeyFob startScanWithBlock:^(TTWirelessKeyFobScanModel *model) {
        NSMutableDictionary *data = @{}.mutableCopy;
        data[@"remoteKeyName"] = model.keyFobName;
        data[@"rssi"] = @(model.RSSI);
        data[@"remoteKeyMac"] = model.keyFobMac;
        [self sendEventWithName:EVENT_SCAN_REMOTE_KEY body:data];
    }];
}

RCT_EXPORT_METHOD(stopScanRemoteKey)
{
    [TTWirelessKeyFob stopScan];
}

RCT_EXPORT_METHOD(initRemoteKey:(NSString *)mac lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTWirelessKeyFob newInitializeWithKeyFobMac:mac lockData:lockData block:^(TTKeyFobStatus status, int electricQuantity, TTSystemInfoModel *systemModel) {
        if (status == TTKeyFobSuccess) {
            [Ttlock response:@[@(electricQuantity),[Ttlock dictionaryFromModel:systemModel]] success:success];
        }else{
            [Ttlock response:status  message:nil fail:fail];
        }
    }];
   
}


RCT_EXPORT_METHOD(getAccessoryElectricQuantity:(int)type mac:(NSString *)mac lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getAccessoryElectricQuantityWithType:type accessoryMac:mac lockData:lockData success:^(NSInteger electricQuantity, long long updateDate) {
        [Ttlock response:@[@(electricQuantity),@(updateDate)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode  message:nil fail:fail];
    }];
}




#pragma mark - DoorSensor
RCT_EXPORT_METHOD(startScanDoorSensor)
{
    
    [TTDoorSensor startScanWithSuccess:^(TTDoorSensorScanModel * _Nonnull model) {
        NSMutableDictionary *data = @{}.mutableCopy;
        data[@"name"] = model.name;
        data[@"rssi"] = @(model.RSSI);
        data[@"mac"] = model.mac;
        data[@"scanTime"] = @(model.scanTime);
        [self sendEventWithName:EVENT_SCAN_DOOR_SENSOR body:data];
    } failure:^(TTDoorSensorError error) {
        
    }];
}

RCT_EXPORT_METHOD(stopScanDoorSensor)
{
    [TTDoorSensor stopScan];
}

RCT_EXPORT_METHOD(initDoorSensor:(NSString *)mac lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTDoorSensor initializeWithDoorSensorMac:mac lockData:lockData success:^(int electricQuantity, TTSystemInfoModel * _Nonnull systemModel) {
        [Ttlock response:@[@(electricQuantity),[Ttlock dictionaryFromModel:systemModel]] success:success];
    } failure:^(TTDoorSensorError error) {
        [Ttlock response:error  message:nil fail:fail];
    }];
}





#pragma mark - WirelessKeypad
RCT_EXPORT_METHOD(startScanWirelessKeypad)
{
    [TTWirelessKeypad startScanKeypadWithBlock:^(TTWirelessKeypadScanModel *model) {
        NSMutableDictionary *data = @{}.mutableCopy;
        data[@"name"] = model.keypadName;
        data[@"rssi"] = @(model.RSSI);
        data[@"mac"] = model.keypadMac;
        [self sendEventWithName:EVENT_SCAN_WIRELESS_KEYPAD body:data];
    }];
}

RCT_EXPORT_METHOD(stopScanWirelessKeypad)
{
    [TTWirelessKeypad stopScanKeypad];
}

RCT_EXPORT_METHOD(initWirelessKeypad:(NSString *)mac lockMac:(NSString *) lockMac success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTWirelessKeypad initializeKeypadWithKeypadMac:mac lockMac:lockMac block:^(NSString *wirelessKeypadFeatureValue, TTKeypadStatus status, int electricQuantity) {
        if(status == TTKeypadSuccess){
            [Ttlock response:@[@(electricQuantity),wirelessKeypadFeatureValue] success:success];
        }else{
            [Ttlock response:status  message:nil fail:fail];
        }
    }];
    
}



#pragma mark - private method
+ (void)response:(NSObject *)data success:(RCTResponseSenderBlock)success{
    NSArray *responseData = data ? @[data] : nil;
    success(responseData);
}

+ (void)response:(NSInteger)code message:(NSString *)message fail:(RCTResponseSenderBlock)fail{
    
    NSInteger errorCode = code;
    if (code > TTErrorRecordNotExist) {
        errorCode = code - 65;
    }else if(code > TTErrorWrongDynamicCode){
        errorCode =code - 1;
    }
    fail(@[@(errorCode),NOT_NULL_STRING(message)]);
}


+ (NSDictionary *)dictionaryFromModel:(id)model {
    unsigned int count = 0;
    objc_property_t *properties = class_copyPropertyList([model class], &count);
    NSMutableDictionary *resultDict = [NSMutableDictionary dictionaryWithCapacity:count];
    for (int i = 0; i < count; i++) {
        objc_property_t property = properties[i];
        NSString *propertyName = [NSString stringWithUTF8String:property_getName(property)];
        id propertyValue = [model valueForKey:propertyName];
        if (propertyValue) {
            [resultDict setObject:propertyValue forKey:propertyName];
        }
    }
    free(properties);
    return resultDict;
}

@end
