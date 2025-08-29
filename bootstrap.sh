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
