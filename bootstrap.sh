#!/bin/bash

# 删除指定文件和目录
echo "开始删除指定文件和目录..."
rm -f ./yarn.lock
rm -rf ./node_modules
rm -f ./example/yarn.lock
rm -rf ./example/node_modules

# 创建新文件
echo "创建必要的文件..."
touch ./yarn.lock
mkdir -p ./example  # 确保example目录存在
touch ./example/yarn.lock

# 执行yarn命令
echo "在当前目录执行yarn..."
yarn

# 在example目录执行yarn
echo "在example目录执行yarn..."
cd ./example || { echo "无法进入example目录"; exit 1; }
yarn
cd .. || exit 1  # 返回上级目录
#
# 清理Android编译生成的内容
echo "清理主项目Android编译产物..."
if [ -d "./android" ]; then
 cd ./android || { echo "无法进入android目录"; exit 1; }
 # 删除Android构建目录
 rm -rf build
 # 如果有gradle缓存目录也清理
 rm -rf .gradle
 cd .. || exit 1  # 返回初始目录
else
 echo "警告: ./android目录不存在，跳过主项目Android清理"
fi

# 清理Example项目Android编译产物
echo "清理Example项目Android编译产物..."
if [ -d "./example/android" ]; then
 cd ./example/android || { echo "无法进入example/android目录"; exit 1; }
 # 删除Android构建目录
 rm -rf app/build
 rm -rf build
 # 删除CMake和NDK构建缓存
 rm -rf .cxx
 # 如果有gradle缓存目录也清理
 rm -rf .gradle
 cd ../.. || exit 1  # 返回初始目录
else
 echo "警告: ./example/android目录不存在，跳过Example项目Android清理"
fi

# 在example/ios目录执行pod install
echo "在example/ios目录执行pod install..."
if [ -d "./example/ios" ]; then
 cd ./example/ios || { echo "无法进入example/ios目录"; exit 1; }
 rm Podfile.lock
 rm -rf Pods
 rm -rf TtlockExample.xcworkspace
 rm -rf build
 bundle install
 bundle exec pod install
 cd ../../ || exit 1  # 返回初始目录
else
 echo "警告: ./example/ios目录不存在，跳过pod install"
fi

echo "所有操作完成"
