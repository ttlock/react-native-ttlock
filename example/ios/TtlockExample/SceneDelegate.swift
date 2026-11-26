import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
  var window: UIWindow?

  func scene(
    _ scene: UIScene,
    willConnectTo session: UISceneSession,
    options connectionOptions: UIScene.ConnectionOptions
  ) {
    guard let windowScene = scene as? UIWindowScene else {
      return
    }

    guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
      return
    }

    let window = UIWindow(windowScene: windowScene)
    self.window = window
    // RN 0.81 still reads UIApplication.shared.delegate.window in some places.
    appDelegate.window = window

    appDelegate.reactNativeFactory?.startReactNative(
      withModuleName: "TtlockExample",
      in: window,
      launchOptions: appDelegate.launchOptions
    )
  }
}
