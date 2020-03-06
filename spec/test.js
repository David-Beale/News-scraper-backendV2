const storeHeadlines = require("../scraper/store-headlines");
const Headlines = require("../server/models/headlines")
require("../server/db");

storeHeadlines.store();