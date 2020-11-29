# https://stackoverflow.com/questions/61024657/react-native-gradlew-assemblerelease-build-failed-execution-failed-for-task-a?noredirect=1

build:
	rm -rf android/app/build
	rm -rf android/build
	rm -rf android/app/src/main/res/drawable-*
	react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
	$(MAKE) --directory=android --makefile=../makefile compile

compile:
	./gradlew assembleRelease --no-daemon

install:
	adb devices
	adb install android/app/build/outputs/apk/release/app-release.apk

all: build install

.PHONY: all