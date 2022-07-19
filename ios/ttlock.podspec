#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint ttlock_flutter.podspec' to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'ttlock_react'
  s.version          = '0.0.1'
  s.summary          = 'A new react plugin project.'
  s.description      = <<-DESC
A new flutter plugin project.
                       DESC
  s.homepage         = 'http://example.com'
  s.license          = "MIT"
  s.author           = { 'Your Company' => 'email@example.com' }
  s.source           = { :path => '.' }
  s.source_files = '/*'
  s.public_header_files = '/*.h'
  s.platform = :ios, '9.0'
  s.vendored_frameworks = "Frameworks/**/*.framework"
  s.static_framework = true
  

  # Flutter.framework does not contain a i386 slice. Only x86_64 simulators are supported.
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'VALID_ARCHS[sdk=iphonesimulator*]' => 'x86_64' }
end
