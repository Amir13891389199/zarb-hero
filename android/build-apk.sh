#!/bin/bash
# ساخت APK بدون Gradle (با aapt2 + d8 + apksigner)
# استفاده: BT=<build-tools dir> AJ=<android.jar> KS=<keystore> KS_PASS=<pass> ./build-apk.sh
set -eo pipefail
D=$(cd "$(dirname "$0")" && pwd); SRC=$D/app/src/main; W=$(mktemp -d)
mkdir -p $W/{gen,cls,dex} $SRC/assets
cp "$D/../index.html" $SRC/assets/index.html
VC=${VERSION_CODE:-1}
sed "s#<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">#<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\" package=\"io.github.amir.zarbhero\" android:versionCode=\"$VC\" android:versionName=\"1.0.$VC\">\n    <uses-sdk android:minSdkVersion=\"24\" android:targetSdkVersion=\"34\"/>#" $SRC/AndroidManifest.xml > $W/AndroidManifest.xml
$BT/aapt2 compile --dir $SRC/res -o $W/res.zip
$BT/aapt2 link -o $W/base.apk -I $AJ --manifest $W/AndroidManifest.xml -A $SRC/assets --java $W/gen $W/res.zip
javac -nowarn -source 1.8 -target 1.8 -bootclasspath $AJ -classpath $AJ -d $W/cls $(find $SRC/java $W/gen -name '*.java')
$BT/d8 --min-api 24 --lib $AJ --output $W/dex $(find $W/cls -name '*.class')
cp $W/dex/classes.dex $W/ && (cd $W && zip -qj base.apk classes.dex)
$BT/zipalign -f -p 4 $W/base.apk $W/aligned.apk
$BT/apksigner sign --ks $KS --ks-pass pass:$KS_PASS --ks-key-alias zarb --out ${OUT:-$D/zarb-hero.apk} $W/aligned.apk
echo "APK: ${OUT:-$D/zarb-hero.apk}"
