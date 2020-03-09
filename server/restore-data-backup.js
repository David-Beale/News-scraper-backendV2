require("./db");
const SiteData = require("./models/site-data")
const data = require('./data-backup')

data.forEach(async (obj) => {
  try {
    let check = await SiteData.exists({ website: obj.website })
    if(!check){
      console.log('saving')
      const itemToSave = new SiteData ({
        website: obj.website,
        name: obj.name,
        selector: obj.selector,
        country: obj.country,
      })
      itemToSave.save(function (err) {
        if (err) throw err;
      });
    } else console.log('duplicate found')
  } catch (error) {
    console.log(error)
  }
})
