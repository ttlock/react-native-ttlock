#import "Ttlock.h"
#import <TTLock/TTLock.h>
#import <objc/message.h>


#define NOT_NULL_STRING(string) (string ?: @"")

#define EVENT_SCAN_LOCK @"EventScanLock"
#define EVENT_ADD_CARD_PROGRESS @"EventAddCardProgrress"
#define EVENT_ADD_FINGERPRINT_PROGRESS @"EventAddFingerprintProgrress"
#define EVENT_ADD_FACE_PROGRESS @"EventAddFaceProgrress"
#define EVENT_BLUETOOTH_STATE @"EventBluetoothState"
#define EVENT_SCAN_GATEWAY @"EventScanGateway"
#define EVENT_SCAN_WIFI @"EventScanWifi"
#define EVENT_SCAN_REMOTE_KEY @"EventScanRemoteKey"
#define EVENT_SCAN_DOOR_SENSOR @"EventScanDoorSensor"
#define EVENT_SCAN_WIRELESS_KEYPAD @"EventWirelessKeypad"
#define EVENT_SCAN_LOCK_WIFI @"EventScanLockWifi"


//static bool isAddListenBluetoothState = false;

typedef enum {
    LOCK = 0,
    GATEWAY = 1,
    DOOR_SENSOR = 2,
    REMOTE_KEY_PAD = 3,
    REMOTE_KEY = 4
}DEVICE;


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
      EVENT_ADD_FACE_PROGRESS,
//      EVENT_BLUETOOTH_STATE,
      EVENT_SCAN_GATEWAY,
      EVENT_SCAN_WIFI,
      EVENT_SCAN_REMOTE_KEY,
      EVENT_SCAN_DOOR_SENSOR,
      EVENT_SCAN_WIRELESS_KEYPAD,
      EVENT_SCAN_LOCK_WIFI
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
    [Ttlock reseponseSuccess:@(bluetoothState) success:callbackBlock];
    
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


RCT_EXPORT_METHOD(initLock:(NSDictionary *)dict success:(RCTResponseSenderBlock)successfulBlock fail:(RCTResponseSenderBlock)faile)
{
    [TTLock initLockWithDict:dict success:^(NSString *lockData) {
        successfulBlock(@[lockData]);
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:faile];
    }];
}

RCT_EXPORT_METHOD(resetLock:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock resetLockWithLockData:lockData success:^() {
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
    
}


RCT_EXPORT_METHOD(getLockVersionWithLockMac:(NSString *)lockMac success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockVersionWithLockMac:lockMac success:^(NSDictionary *lockVersion) {
        [Ttlock reseponseSuccess:lockVersion success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(controlLock:(NSInteger)controlAction lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    TTControlAction action = controlAction + 1;
    [TTLock controlLockWithControlAction:action lockData:lockData success:^(long long lockTime, NSInteger electricQuantity, long long uniqueId) {
        [Ttlock reseponseSuccess:@[@(lockTime),@(electricQuantity),@(uniqueId)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(resetEkey:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock resetEkeyWithLockData:lockData success:^(NSString *lockData) {
        [Ttlock reseponseSuccess:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockTime:(nonnull NSNumber *)timestamp lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setLockTimeWithTimestamp:timestamp.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockTime:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock getLockTimeWithLockData:lockData success:^(long long lockTimestamp) {
        [Ttlock reseponseSuccess:@(lockTimestamp) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockSystem:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockSystemInfoWithLockData:lockData success:^(TTSystemInfoModel *systemModel) {
        [Ttlock reseponseSuccess:[Ttlock dictionaryFromModel:systemModel] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockElectricQuantity:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getElectricQuantityWithLockData:lockData success:^(NSInteger electricQuantity) {
        [Ttlock reseponseSuccess:@(electricQuantity) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockOperationRecord:(int)type lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTOperateLogType logType = type + 1;
    [TTLock getOperationLogWithType:logType lockData:lockData success:^(NSString *operateRecord) {
        [Ttlock reseponseSuccess:operateRecord success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}



RCT_EXPORT_METHOD(createCustomPasscode:(NSString *)passcode startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock createCustomPasscode:passcode startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyPasscode:(NSString *)passcodeOrigin passcodeNew:(NSString *)passcodeNew startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyPasscode:passcodeOrigin newPasscode:passcodeNew startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deletePasscode:(NSString *)passcode lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock deletePasscode:passcode lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(resetPasscode:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock resetPasscodesWithLockData:lockData success:^(NSString *lockData) {
        [Ttlock reseponseSuccess:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockSwitchState:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockSwitchStateWithLockData:lockData success:^(TTLockSwitchState state, TTDoorSensorState doorSensorState) {
        [Ttlock reseponseSuccess:@(state) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addCard:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{

    __weak Ttlock *weakSelf = self;
    [TTLock addICCardWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddICState state) {
        [weakSelf sendEventWithName:EVENT_ADD_CARD_PROGRESS body:nil];
    } success:^(NSString *cardNumber) {
        [Ttlock reseponseSuccess:cardNumber success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyCardValidityPeriod:(NSString *)cardNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyICCardValidityPeriodWithCyclicConfig:cycleList cardNumber:cardNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deleteCard:(NSString *)cardNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteICCardNumber:cardNumber lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllCards:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock clearAllICCardsWithLockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addFingerprint:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    __weak Ttlock *weakSelf = self;
    [TTLock addFingerprintWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(int currentCount, int totalCount) {
        [weakSelf sendEventWithName:EVENT_ADD_FINGERPRINT_PROGRESS body:@[@(currentCount),@(totalCount)]];
    } success:^(NSString *fingerprintNumber) {
        [Ttlock reseponseSuccess:fingerprintNumber success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyFingerprintValidityPeriod:(NSString *)fingerprintNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyFingerprintValidityPeriodWithCyclicConfig:cycleList fingerprintNumber:fingerprintNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deleteFingerprint:(NSString *)fingerprintNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteFingerprintNumber:fingerprintNumber lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllFingerprints:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock clearAllFingerprintsWithLockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyAdminPasscode:(NSString *)adminPasscode  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock modifyAdminPasscode:adminPasscode lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}




RCT_EXPORT_METHOD(getLockAutomaticLockingPeriodicTime:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getAutomaticLockingPeriodicTimeWithLockData:lockData success:^(int currentTime, int minTime, int maxTime) {
        [Ttlock reseponseSuccess:@[@(currentTime),@(maxTime),@(minTime)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}



RCT_EXPORT_METHOD(setLockAutomaticLockingPeriodicTime:(int)time  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setAutomaticLockingPeriodicTime:time lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getLockRemoteUnlockSwitchState:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getRemoteUnlockSwitchWithLockData:lockData success:^(BOOL isOn) {
        [Ttlock reseponseSuccess:@(isOn) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockRemoteUnlockSwitchState:(BOOL)isOn  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setRemoteUnlockSwitchOn:isOn lockData:lockData success:^(NSString *lockData) {
        [Ttlock reseponseSuccess:lockData success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getLockConfig:(int)config  lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTLockConfigType type = config + 1;
    [TTLock getLockConfigWithType:type lockData:lockData success:^(TTLockConfigType type, BOOL isOn) {
        [Ttlock reseponseSuccess:@[@(type),@(isOn)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setLockConfig:(int)config isOn:(BOOL)isOn lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTLockConfigType type = config + 1;
    [TTLock setLockConfigWithType:type on:isOn lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(setLockSoundVolume:(int)soundVolume lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setLockSoundWithSoundVolume:soundVolume lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getLockSoundVolume:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getLockSoundWithLockData:lockData success:^(TTSoundVolume soundVolume) {
        [Ttlock reseponseSuccess:@(soundVolume) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getUnlockDirection:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getUnlockDirectionWithLockData:lockData success:^(TTUnlockDirection direction) {
        [Ttlock reseponseSuccess:@(direction) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setUnlockDirection:(int)unlockDirection lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setUnlockDirection:unlockDirection lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(setUnlockDirectionAutomatic:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock autoSetUnlockDirectionWithLockData:lockData success:^(TTAutoUnlockDirection state) {
        [Ttlock reseponseSuccess:@(state) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addPassageMode:(int)type weekly:(NSArray<NSNumber *> *)weekly monthly:(NSArray<NSNumber *> *)monthly startDate:(int)startDate endDate:(int)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    TTPassageModeType modeType = type + 1;
    [TTLock configPassageModeWithType:modeType weekly:weekly monthly:monthly startDate:startDate endDate:endDate lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(clearAllPassageModes:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearPassageModeWithLockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addRemoteKey:(NSString *)remoteKeyMac cyclicConfig:(NSArray *)cyclicConfig startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock addWirelessKeyFobWithCyclicConfig:cyclicConfig keyFobMac:remoteKeyMac startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(modifyRemoteKey:(NSString *)remoteKeyMac cyclicConfig:(NSArray *)cyclicConfig startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    [TTLock modifyWirelessKeyFobValidityPeriodWithCyclicConfig:cyclicConfig keyFobMac:remoteKeyMac startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(deleteRemoteKey:(NSString *)remoteKeyMac lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteWirelessKeyFobWithKeyFobMac:remoteKeyMac lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllRemoteKey:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearWirelessKeyFobsWithLockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addDoorSensor:(NSString *)doorSensorMac lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock addDoorSensorWithDoorSensorMac:doorSensorMac lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearAllDoorSensor:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearDoorSensorWithLockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(setDoorSensorAlertTime:(int) time lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock setDoorSensorAlertTime:time lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(recoverCard:(NSString *) cardNumber cycleList: (NSArray *) cycleList  startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock recoverICCardWithCyclicConfig:cycleList cardNumber:cardNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^(NSString *cardNumber2) {
        [Ttlock reseponseSuccess:cardNumber2 success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(recoverPasscode:(NSString *) passcode passcodeType:(int)passcodeType cycleType: (int) cycleType  startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock recoverPasscode:passcode newPasscode:passcode passcodeType:passcodeType startDate:startDate.longLongValue endDate:endDate.longLongValue cycleType:cycleType lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(scanWifi:(NSString *) lockData fail:(RCTResponseSenderBlock)fail)
{
    [TTLock scanWifiWithLockData:lockData success:^(BOOL isFinished, NSArray *wifiArr) {
        [self sendEventWithName:EVENT_SCAN_LOCK_WIFI body:@[@(isFinished), wifiArr]];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(configWifi:(NSString *) wifiName wifiPassword:(NSString *) wifiPassword lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock configWifiWithSSID:wifiName wifiPassword:wifiPassword lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(getWifiPowerSavingTime:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getWifiPowerSavingTimeWithLockData:lockData success:^(NSString *timesJsonString) {
      [Ttlock reseponseSuccess:timesJsonString success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
      [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(configWifiPowerSavingTime:(NSArray *) weekDays startDate:(nonnull NSNumber *) startDate endDate:(nonnull NSNumber *) endDate lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
      [TTLock configWifiPowerSavingTimeWithWeekDays:weekDays startDate:startDate.intValue endDate:endDate.intValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
      } failure:^(TTError errorCode, NSString *errorMsg) {
          [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
      }];
}

RCT_EXPORT_METHOD(clearWifiPowerSavingTime:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearWifiPowerSavingTimeWithLockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(configServer:(NSString *) ip port:(NSString *) port lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock configServerWithServerAddress:ip portNumber:port lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(getWifiInfo:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getWifiInfoWithLockData:lockData success:^(NSString *wifiMac, NSInteger wifiRssi) {
        [Ttlock reseponseSuccess:@[wifiMac, @(wifiRssi)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(configIp:(NSDictionary *) info lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock configIpWithInfo:info lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addFace:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    __weak Ttlock *weakSelf = self;
    [TTLock addFaceWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddFaceState state, TTFaceErrorCode faceErrorCode) {
        if(state == TTAddFaceStateCanStartAdd || state == TTAddFaceStateError){
            NSNumber * stateValue = @(state - 2);
            [weakSelf sendEventWithName:EVENT_ADD_FACE_PROGRESS body:@[stateValue, @(faceErrorCode)]];
        }
    } success:^(NSString *faceNumber) {
        [Ttlock reseponseSuccess:faceNumber success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(addFaceFeatureData:(NSString *)faceFeatureData cycleList:(NSArray *) cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock addFaceFeatureData:faceFeatureData cyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^(NSString *faceNumber) {
        [Ttlock reseponseSuccess:faceNumber success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(modifyFaceValidityPeriod:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate faceNumber:(NSString *)faceNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock modifyFaceValidityWithCyclicConfig:cycleList faceNumber:faceNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(deleteFace:(NSString *)faceNumber lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock deleteFaceNumber:faceNumber lockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}

RCT_EXPORT_METHOD(clearFace:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock clearFaceWithLockData:lockData success:^{
        [Ttlock reseponseSuccess:nil success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(activateLiftFloors:(NSString *)floors lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
  [TTLock activateLiftFloors:floors lockData:lockData success:^(long long lockTime, NSInteger electricQuantity, long long uniqueId) {
    [Ttlock reseponseSuccess:@[@(lockTime),@(electricQuantity), @(uniqueId)] success:success];
  } failure:^(TTError errorCode, NSString *errorMsg) {
    [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
  }];
}


RCT_EXPORT_METHOD(setLiftControlEnableFloors:(NSString *)floors lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
  [TTLock setLiftControlableFloors:floors lockData:lockData success:^{
    [Ttlock reseponseSuccess:nil success:success];
  } failure:^(TTError errorCode, NSString *errorMsg) {
    [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
  }];
}

RCT_EXPORT_METHOD(setLiftWorkMode:(int) workMode lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
  TTLiftWorkMode liftWorkMode = workMode;
  [TTLock setLiftWorkMode:liftWorkMode lockData:lockData success:^{
    [Ttlock reseponseSuccess:nil success:success];
  } failure:^(TTError errorCode, NSString *errorMsg) {
    [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
  }];
}


RCT_EXPORT_METHOD(supportFunction:(int)fuction lockData:(NSString *)lockData callback:(RCTResponseSenderBlock)callback)
{
    BOOL isSupport = [TTUtil lockFeatureValue:lockData suportFunction:fuction];
    [Ttlock reseponseSuccess:@(isSupport) success:callback];
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
        [Ttlock reseponseSuccess:@(connectStatus) success:block];
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
                [Ttlock reseponseSuccess:@(status) success:block];
            }
        }else{
            [Ttlock reseponseSuccess:@(status) success:block];
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
    
    
    if(dict[@"ipAddress"] != nil){
        NSMutableDictionary *staticIpDict = @{}.mutableCopy;
        staticIpDict[@"type"] = dict[@"ipSettingType"];
        staticIpDict[@"ipAddress"] = dict[@"ipAddress"];
        staticIpDict[@"subnetMask"] = dict[@"subnetMask"];
        staticIpDict[@"router"] = dict[@"router"];
        staticIpDict[@"preferredDns"] = dict[@"preferredDns"];
        staticIpDict[@"alternateDns"] = dict[@"alternateDns"];
        [TTGateway configIpWithInfo:staticIpDict block:^(TTGatewayStatus status) {
            if (status == TTGatewaySuccess) {
                [TTGateway initializeGatewayWithInfoDic:paramDict block:^(TTSystemInfoModel *systemInfoModel, TTGatewayStatus status) {
                    if (status == TTGatewaySuccess) {
                        NSDictionary *resultDict = @{
                            @"modelNum":NOT_NULL_STRING(systemInfoModel.modelNum),
                            @"hardwareRevision":NOT_NULL_STRING(systemInfoModel.hardwareRevision),
                            @"firmwareRevision":NOT_NULL_STRING(systemInfoModel.firmwareRevision)
                        };
                        [Ttlock reseponseSuccess:resultDict success:success];
                    }else{
                        [Ttlock responseFail:GATEWAY code:status errorMessage:nil fail:fail];
                    }
                }];
            }else{
                [Ttlock responseFail:GATEWAY code:status errorMessage:nil fail:fail];
            }
        }];
    }else{
        [TTGateway initializeGatewayWithInfoDic:paramDict block:^(TTSystemInfoModel *systemInfoModel, TTGatewayStatus status) {
            if (status == TTGatewaySuccess) {
                NSDictionary *resultDict = @{
                    @"modelNum":NOT_NULL_STRING(systemInfoModel.modelNum),
                    @"hardwareRevision":NOT_NULL_STRING(systemInfoModel.hardwareRevision),
                    @"firmwareRevision":NOT_NULL_STRING(systemInfoModel.firmwareRevision)
                };
                [Ttlock reseponseSuccess:resultDict success:success];
            }else{
                [Ttlock responseFail:GATEWAY code:status errorMessage:nil fail:fail];
            }
        }];
    }
    
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
            [Ttlock reseponseSuccess:@[@(electricQuantity),[Ttlock dictionaryFromModel:systemModel]] success:success];
        }else{
            [Ttlock responseFail:REMOTE_KEY code:status errorMessage:nil fail:fail];
        }
    }];
   
}


RCT_EXPORT_METHOD(getAccessoryElectricQuantity:(int)type mac:(NSString *)mac lockData:(NSString *) lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    [TTLock getAccessoryElectricQuantityWithType:type accessoryMac:mac lockData:lockData success:^(NSInteger electricQuantity, long long updateDate) {
        [Ttlock reseponseSuccess:@[@(electricQuantity),@(updateDate)] success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock responseFail:LOCK code:errorCode errorMessage:errorMsg fail:fail];
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
        [Ttlock reseponseSuccess:@[@(electricQuantity),[Ttlock dictionaryFromModel:systemModel]] success:success];
    } failure:^(TTDoorSensorError error) {
        [Ttlock responseFail:DOOR_SENSOR code:error errorMessage:nil fail:fail];
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
            [Ttlock reseponseSuccess:@[@(electricQuantity),wirelessKeypadFeatureValue] success:success];
        }else{
            [Ttlock responseFail:REMOTE_KEY_PAD code:status errorMessage:nil fail:fail];
        }
    }];
}



#pragma mark - private method
+ (void)reseponseSuccess:(NSObject *)data success:(RCTResponseSenderBlock)success{
    NSArray *responseData = data ? @[data] : nil;
    success(responseData);
}




+ (void)responseFail:(DEVICE)device code:(NSInteger)code errorMessage:(NSString *)errorMessage fail:(RCTResponseSenderBlock)fail{
    NSNumber *errorCode = nil;
    if(device == GATEWAY){
        errorCode = @([self getTTGatewayErrorCode:code]);
    }else if(device == REMOTE_KEY){
        errorCode = @([self getTTRemoteKeyErrorCode:code]);
    }else if(device == REMOTE_KEY_PAD){
        errorCode = @([self getTTRemoteKeypadErrorCode:code]);
    }else if(device == DOOR_SENSOR){
        errorCode = @([self getTTDoorSensoryErrorCode:code]);
    }else{
        errorCode = [self getTTLockErrorCode:@(code)];
    }
    
    fail(@[errorCode,NOT_NULL_STRING(errorMessage)]);
    
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



+ (NSInteger)getTTGatewayErrorCode:(TTGatewayStatus) status{
    NSArray *codeArray =@[@(TTGatewayFail),
                          @(TTGatewayWrongSSID),
                          @(TTGatewayWrongWifiPassword),
                          @(TTGatewayWrongCRC),
                          @(TTGatewayWrongAeskey),
                          @(TTGatewayNotConnect),
                          @(TTGatewayDisconnect),
                          @(TTGatewayFailConfigRouter),
                          @(TTGatewayFailConfigServer),
                          @(TTGatewayFailConfigAccount),
                          @(TTGatewayNoSIM),
                          @(TTGatewayInvalidCommand),
                          @(TTGatewayFailConfigIP),
                          @(TTGatewayFailInvaildIP)
    
    ];
    
    NSInteger errorCode = 0;
    for (int i = 0; i < codeArray.count; i++) {
        if([codeArray[i] intValue] == status){
            errorCode = i;
        }
    }
    return errorCode;
}



+ (NSInteger)getTTRemoteKeyErrorCode:(NSInteger) status{
    
    NSArray *codeArray =@[@(TTKeyFobFail),
                          @(TTKeyFobWrongCRC),
                          @(TTKeyFobConnectTimeout)
    
    ];
    NSInteger errorCode = 0;
    for (int i = 0; i < codeArray.count; i++) {
        if([codeArray[i] intValue] == status){
            errorCode = i;
        }
    }
    return errorCode;
}

+ (NSInteger)getTTRemoteKeypadErrorCode:(NSInteger) status{
    
    NSArray *codeArray =@[@(TTKeypadFail),
                          @(TTKeypadWrongCRC),
                          @(TTKeypadConnectTimeout),
                          @(TTKeypadWrongFactorydDate)
                          
    
    ];
    NSInteger errorCode = 0;
    for (int i = 0; i < codeArray.count; i++) {
        if([codeArray[i] intValue] == status){
            errorCode = i;
        }
    }
    return errorCode;
}


+ (NSInteger)getTTDoorSensoryErrorCode:(TTDoorSensorError) status{
    NSArray *codeArray =@[@(TTDoorSensorErrorBluetoothPowerOff),
                          @(TTDoorSensorErrorConnectTimeout),
                          @(TTDoorSensorErrorFail),
                          @(TTDoorSensorErrorWrongCRC)];
    NSInteger errorCode = 2;
    for (int i = 0; i < codeArray.count; i++) {
        if([codeArray[i] intValue] == status){
            errorCode = i;
        }
    }
    return errorCode;
}


+ (NSNumber *)getTTLockErrorCode:(NSNumber *) code{
    NSInteger errorCode = 18;
    NSArray *codeArray =@[@(TTErrorHadReseted),
                          @(TTErrorCRCError),
                          @(TTErrorNoPermisstion),
                          @(TTErrorWrongAdminCode),
                          @(TTErrorLackOfStorageSpace),
                          @(TTErrorInSettingMode),
                          @(TTErrorNoAdmin),
                          @(TTErrorNotInSettingMode),
                          @(TTErrorWrongDynamicCode),
                          @(TTErrorIsNoPower),
                          @(TTErrorResetPasscode),
                          @(TTErrorUpdatePasscodeIndex) ,
                          @(TTErrorInvalidLockFlagPos),
                          @(TTErrorEkeyExpired),
                          @(TTErrorPasscodeLengthInvalid),
                          @(TTErrorSamePasscodes),
                          @(TTErrorEkeyInactive),
                          @(TTErrorAesKey),
                          @(TTErrorFail),
                          @(TTErrorPasscodeExist),
                          @(TTErrorPasscodeNotExist),
                          @(TTErrorLackOfStorageSpaceWhenAddingPasscodes),
                          @(TTErrorInvalidParaLength) ,
                          @(TTErrorCardNotExist),
                          @(TTErrorFingerprintDuplication),
                          @(TTErrorFingerprintNotExist) ,
                          @(TTErrorInvalidCommand),
                          @(TTErrorInFreezeMode) ,
                          @(TTErrorInvalidClientPara),
                          @(TTErrorLockIsLocked),
                          @(TTErrorRecordNotExist),
                          @(TTErrorWrongSSID),
                          @(TTErrorWrongWifiPassword),
                          @(TTErrorBluetoothPoweredOff),
                          @(TTErrorConnectionTimeout),
                          @(TTErrorDisconnection),
                          @(TTErrorLockIsBusy) ,
                          @(TTErrorWrongLockData),
                          @(TTErrorInvalidParameter)
                          ];
    
    
    for (int i = 0; i < codeArray.count; i++) {
        if([codeArray[i] intValue] == code.intValue){
            errorCode = i;
        }
    }
    return @(errorCode);
}

@end
