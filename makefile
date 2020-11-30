# https://stackoverflow.com/questions/61024657/react-native-gradlew-assemblerelease-build-failed-execution-failed-for-task-a?noredirect=1

build:
	rm -rf android/app/build
	rm -rf android/build
	rm -rf android/app/src/main/res/drawable-*
	react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
	$(MAKE) --directory=android compile

install:
	adb devices
	adb push android/app/build/outputs/apk/release/app-release.apk /data/local/tmp
	adb shell pm install /data/local/tmp/app-release.apk
	adb shell rm /data/local/tmp/app-release.apk
