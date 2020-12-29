#import "Ttlock.h"
#import <TTLock/TTLock.h>


#define NOT_NULL_STRING(string) (string ?: @"")

#define EVENT_SCAN_LOCK @"EventScanLock"
#define EVENT_ADD_CARD_PROGRESS @"EventAddCardProgrress"
#define EVENT_ADD_FINGERPRINT_PROGRESS @"EventAddFingerprintProgrress"
#define EVENT_BLUETOOTH_STATE @"EventBluetoothState"
#define EVENT_SCAN_GATEWAY @"EventScanGateway"
#define EVENT_SCAN_WIFI @"EventScanWifi"


static bool isAddListenBluetoothState = false;


@implementation Ttlock

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init{
    if (self = [super init]) {
        __weak Ttlock *weakSelf = self;
        [TTLock setupBluetooth:^(TTBluetoothState state) {
            if (isAddListenBluetoothState) {
                [weakSelf sendEventWithName:EVENT_BLUETOOTH_STATE body:@(state)];
            }
        }];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
      EVENT_SCAN_LOCK,
      EVENT_ADD_CARD_PROGRESS,
      EVENT_ADD_FINGERPRINT_PROGRESS,
      EVENT_BLUETOOTH_STATE,
      EVENT_SCAN_GATEWAY,
      EVENT_SCAN_WIFI];
}

- (void)addListener:(NSString *)eventName
{
    [super addListener:eventName];
    if ([eventName isEqualToString:EVENT_BLUETOOTH_STATE]) {
        isAddListenBluetoothState = true;
    }
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

RCT_EXPORT_METHOD(getLockOperateRecord:(int)type lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
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
    [TTLock getLockSwitchStateWithLockData:lockData success:^(TTLockSwitchState state) {
        [Ttlock response:@(state) success:success];
    } failure:^(TTError errorCode, NSString *errorMsg) {
        [Ttlock response:errorCode message:errorMsg fail:fail];
    }];
}


RCT_EXPORT_METHOD(addCard:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{

    __weak Ttlock *weakSelf = self;
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock addICCardStartDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddICState state) {
            [weakSelf sendEventWithName:EVENT_ADD_CARD_PROGRESS body:nil];
        } success:^(NSString *cardNumber) {
            [Ttlock response:cardNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock addICCardWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(TTAddICState state) {[weakSelf sendEventWithName:EVENT_ADD_CARD_PROGRESS body:nil];
        } success:^(NSString *cardNumber) {
            [Ttlock response:cardNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
}

RCT_EXPORT_METHOD(modifyCardValidityPeriod:(NSString *)cardNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock modifyICCardValidityPeriodWithCardNumber:cardNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock modifyICCardValidityPeriodWithCardNumber:cardNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
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
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock addFingerprintStartDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(int currentCount, int totalCount) {
            [weakSelf sendEventWithName:EVENT_ADD_FINGERPRINT_PROGRESS body:@[@(currentCount),@(totalCount)]];
        } success:^(NSString *fingerprintNumber) {
            [Ttlock response:fingerprintNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock addFingerprintWithCyclicConfig:cycleList startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData progress:^(int currentCount, int totalCount) {
            [weakSelf sendEventWithName:EVENT_ADD_FINGERPRINT_PROGRESS body:@[@(currentCount),@(totalCount)]];
        } success:^(NSString *fingerprintNumber) {
            [Ttlock response:fingerprintNumber success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
}

RCT_EXPORT_METHOD(modifyFingerprintValidityPeriod:(NSString *)fingerprintNumber cycleList:(NSArray *)cycleList startDate:(nonnull NSNumber *)startDate endDate:(nonnull NSNumber *)endDate lockData:(NSString *)lockData success:(RCTResponseSenderBlock)success fail:(RCTResponseSenderBlock)fail)
{
    
    if (cycleList == nil || cycleList.count == 0) {
        [TTLock modifyFingerprintValidityPeriodWithFingerprintNumber:fingerprintNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }else{
        [TTLock modifyFingerprintValidityPeriodWithCyclicConfig:cycleList fingerprintNumber:fingerprintNumber startDate:startDate.longLongValue endDate:endDate.longLongValue lockData:lockData success:^{
            [Ttlock response:nil success:success];
        } failure:^(TTError errorCode, NSString *errorMsg) {
            [Ttlock response:errorCode message:errorMsg fail:fail];
        }];
    }
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
    [TTLock modifyAdminPasscode:adminPasscode lockData:lockData success:^{
        [Ttlock response:nil success:success];
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
        NSLog(@"clearAllPassageModes");
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
    NSDictionary *paramDict = @{
            @"SSID": dict[@"wifi"],
            @"wifiPwd": dict[@"wifiPassword"],
            @"gatewayName": dict[@"gatewayName"],
            @"uid": dict[@"ttlockUid"],
            @"userPwd": dict[@"ttlockLoginPassword"]
    };
    [TTGateway initializeGatewayWithInfoDic:paramDict block:^(TTSystemInfoModel *systemInfoModel, TTGatewayStatus status) {
        if (status == TTGatewaySuccess) {
            NSDictionary *resultDict = @{
                @"modelNum":NOT_NULL_STRING(systemInfoModel.modelNum),
                @"hardwareRevision":NOT_NULL_STRING(systemInfoModel.hardwareRevision),
                @"firmwareRevision":NOT_NULL_STRING(systemInfoModel.firmwareRevision)
            };
            [Ttlock response:resultDict success:success];
        }else{
//            NSDictionary *codeMap = @{
//                @(1):@0,
//                @(3):@1,
//                @(4):@2,
//                @(-1):@3,
//                @(-2):@4,
//                @(-3):@5,
//                @(-4):@6,
//                @(-5):@7,
//                @(-6):@8,
//                @(-7):@9,
//            };
//            NSInteger errorCode = [codeMap[@(status)] intValue];
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

@end
