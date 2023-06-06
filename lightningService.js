const fs = require('fs');
const quadKeyTool = require('quadkeytools')


//make sure file is in correct json format

fs.readFile('lightning.json', (err, data) => {
    //create an empty array to track alerts generated. We will use quadkey and asset owner as a unique set
    let alertTracker = []
    //load assets once
    const assetData = JSON.parse(fs.readFileSync('assets.json'));

    if (err) {
        console.log(err)
    }
    //format the json file - handle missing commas
    var nuarr = data.toString().split("\n");

    //iterate through all strikes from json file
    for (const n of nuarr) {
        //check for blank lines caused by formatting
        if (n.length > 0) {
            //load strike data
            const strike = JSON.parse(n)
            if (strike.flashType != 9) {
                //utilize npm tool to convert lat lng to quadkey - zoom level static set at 12
                const qKey = quadKeyTool.locationToQuadkey({lat: strike.latitude, lng: strike.longitude}, 12);
                //find assets that have matching quadkey - expecting multiple assets in one quadkey
                let matchingAssetTwo = assetData.filter(o => o.quadKey === qKey.toString())

                for (const matchingAsset of matchingAssetTwo) {
                    //only fire alerts for our list of assets
                    if (matchingAsset) {
                        //set variable for duplicate alert checking
                        let alertExists
                        //check if alertTracker contains the quadkey and owner
                        let secondCheck = alertTracker.filter(o => o.quadKey.toString() === qKey.toString() && o.owner === matchingAsset.assetOwner.toString())

                        // handle first alert case
                        if (alertTracker.length === 0) {
                            alertExists = false
                        }
                        // if secondCheck is >0 then alert already exists
                        else if (secondCheck.length > 0) {
                            alertExists = true
                        } else {
                            alertExists = false
                        }

                        // generate non-duplicate alert for matching asset
                        if (alertExists === false) {
                            //push to alert tracker to ensure no duplicate alerts
                            alertTracker.push({quadKey: qKey, owner: matchingAsset.assetOwner})
                            console.log('lightning alert for ' + matchingAsset.assetOwner + ' : ' + matchingAsset.assetName)
                            console.log('alert counter', alertTracker.length)


                        }
                    }

                }
            }

        }
    }

});

