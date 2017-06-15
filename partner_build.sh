#!/bin/bash

API_ROOT=http://localhost:3000
APP_FILEPATH=.
CONFIG_FILEPATH=$APP_FILEPATH/config/partner_config.ts
ANDROID_OUTPUT_FILEPATH=$APP_FILEPATH/platforms/android/build/outputs/apk
IOS_OUTPUT_FILEPATH=$APP_FILEPATH/platforms/ios/build/emulator
cp $CONFIG_FILEPATH ./partner_config_copy.ts

function usage {
  echo "Help: 
  usage: ./partner_build.sh -P 2 -N 'Test Partner' -ai
  '-P | --partner_id'
    Partner ID for app to build [required, takes one argument]
  '-N | --name'
    Name of app to build [required, takes one argument]
  '-a | --android'
    Build for android
  '-i | --ios'
    Build for ios 
  '-p | --prod'
    Build for production   
  '-h | --help'
    Display help"
}

while [ "$1" != "" ]; do
  case $1 in
    -P | --partner_id )           shift
                                  partner_id=$1
                                  ;;
    -N | --name )                 shift
                                  partner_name=$1
                                  ;;
    -a | -ia | -ai | --android )  android=1
                                  ;;
    -i | -ia | -ai | --ios )      ios=1
                                  ;;
    -p | --prod )                 prod=1
                                  ;;
    -h | --help )                 usage
                                  exit
                                  ;;
  esac
  shift
done

if [ -z "$partner_id" ]
then
  echo "Error: Partner ID is required to run the build script"
  usage
  exit 1
fi

if ! [ "$partner_id" -eq "$partner_id" ] 2>/dev/null
then
  echo "Error: Partner ID must be a number"
  usage
  exit 1
fi

echo "Creating config for partner $partner_id: $partner_name"

prefix="export default "
json=$(curl "$API_ROOT/partners/1/app_json.json")
new_config=$prefix$json
echo $new_config > $CONFIG_FILEPATH

if [ "$android" = 1 ]
then
  echo "Building for android"
  cd $APP_FILEPATH
  ionic cordova platform add android
  ionic cordova build android
  cd ..
  created_file=$(ls -dt $ANDROID_OUTPUT_FILEPATH/*.apk | head -1)
  appname=${partner_name// /_}
  output_path="./builds/android/$appname.apk"
  cp "$created_file" $output_path
  echo "Finished building for android. Output: $output_path. To run emulator: ionic cordova run android (from root directory)." 
fi

if [ "$ios" = 1 ]
then
  cd $APP_FILEPATH
  echo "Building for ios"
  ionic cordova platform add ios
  ionic cordova build ios
  echo "Finished building for ios."
  cd ..
  created_file=$(ls -dt $IOS_OUTPUT_FILEPATH/*.app | head -1)
  appname=${partner_name// /_}
  output_path="./builds/ios/$appname.app"
  cp "$created_file" $output_path
  echo "Finished building for ios. Output: $output_path. To run emulator: ionic cordova run ios (from root directory)." 
fi

# cat ./partner_config_copy.ts > $CONFIG_FILEPATH
rm ./partner_config_copy.ts

echo "Build process complete."
