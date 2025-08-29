#import <TtlockSpec/TtlockSpec.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

//@interface Ttlock : NSObject <NativeTtlockSpec>
@interface Ttlock : RCTEventEmitter <RCTBridgeModule>

@end
