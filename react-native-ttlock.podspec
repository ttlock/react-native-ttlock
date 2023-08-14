require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-ttlock"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://www.npmjs.com/package/react-native-ttlock.git", :tag => "#{s.version}" }

  
  s.source_files = "ios/**/*.{h,m,mm}"

  #TTLock 依赖
  s.platform = :ios, '9.0'
  s.vendored_frameworks = "ios/Frameworks/**/*.framework"
  
  s.dependency "React"

  s.static_framework = true
end