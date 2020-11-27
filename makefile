# https://stackoverflow.com/questions/61024657/react-native-gradlew-assemblerelease-build-failed-execution-failed-for-task-a?noredirect=1

build:
	rm -rf android/app/src/main/res/drawable-*
	react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
	cd ./android && . ./gradlew assembleRelease --no-daemon
