# https://stackoverflow.com/questions/61024657/react-native-gradlew-assemblerelease-build-failed-execution-failed-for-task-a?noredirect=1

build:
	rm -rf android/app/build
	rm -rf android/build
	rm -rf android/app/src/main/res/drawable-*
	rm -rf android/app/src/main/res/raw
	mkdir -p android/app/src/main/assets
	react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ --reset-cache
	$(MAKE) --directory=android compile

keystore:
	keytool -genkey -v -keystore debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000
	mv debug.keystore android/app

install:
	adb devices
	adb push android/app/build/outputs/apk/release/app-release.apk /data/local/tmp
	adb shell pm install /data/local/tmp/app-release.apk
	adb shell rm /data/local/tmp/app-release.apk

relink:
	jq ".dependencies" package.json | jq -r "keys[]" | xargs -L 1 react-native link