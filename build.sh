/*
* This script automate build process of creating
* GO binary embedded with AngularJS front-end application as binary assets.
*/

# Grunt build ng-app
grunt --gruntfile dashboard/Gruntfile.js build

# Prepare ng-app distribution folder as GO asset source code
cd dashboard
go-bindata-assetfs -pkg dashboard dist

# Dirty fix on exporting the assetFS so that main package could call
sed -i '' 's/func\ assetFS/func\ EassetFS/g' bindata_assetfs.go

# No build the Server
cd ../
gom build -o webplug server.go
