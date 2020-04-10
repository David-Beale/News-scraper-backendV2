const Headlines = require("./models/headlines");
const SiteData = require("./models/site-data");
const got = require('got');
const fs = require('fs')
const cheerio = require('cheerio')
const storeHeadlines = require("../scraper/store-headlines");

const resolvers = {
  Query: {
    headline: async (_, args, context) => {
      if (Object.keys(args).length) {
        const {email} = context.req.user 
        console.log(email)
        return await Headlines.find({...args, email});
      } else {
        return await Headlines.find();
      }
    },
    refresh: async () => {
      storeHeadlines.store();
      return "complete";
    },
    html: async (_, args) => {
      if (Object.keys(args).length) {
        html = await got(args.name);
        // html = fs.readFileSync('./bbcnews.html', 'utf8')
        // fs.writeFileSync('./bbcnews.html', html.body)
        // const $ = cheerio.load(html)
        const $ = cheerio.load(html.body)
        // const div =$('<div> class="empty"></div>')
        // $('style').replaceWith(div)
        // $('link').replaceWith(div)
        let images = Object.values($('img'))
        try {
          images.forEach(image => {
            if (image.attribs && image.attribs['data-src'] && image.attribs['data-src'][0] === 'h') {
              image.attribs['src'] = image.attribs['data-src']
            } else if (image.attribs && image.attribs['data-src-md'] && image.attribs['data-src-md'][0] === 'h') {
              image.attribs['src'] = image.attribs['data-src-md']
            } else if (image.parent && image.parent.attribs && image.parent.attribs['data-src'] && image.parent.attribs['data-src'][0] === 'h') {
              image.attribs['src'] = image.parent.attribs['data-src']
            }
          })
        } catch (error) {
          console.log(error)
        }
        return { htmlBody: $.html() }
      } else {
        return 
      }
    }
  },
  Mutation: {
    addFeed: (root, args, context) => {
      const {email} = context.req.user; 
      const { website, name, titlePath, titleRoot, summaryPath, linkPath, imagePath, imageTag } = args
      const newFeed = new SiteData({
        website, name, titlePath, titleRoot, summaryPath, linkPath, imagePath, imageTag, email
      })
      return newFeed.save();
    },
    deleteHeadline: async (root, args) => {
      console.log('deleting headline')
      const {id} = args
      await Headlines.findByIdAndRemove(id, function (err) {
        if (err) throw err;
        console.log('Post deleted');  // eslint-disable-line no-console
      });
    },
    deleteScraper: async (root, args) => {
      console.log('deleting scraper')
      const {id} = args
      await SiteData.findByIdAndRemove(id, function (err) {
        if (err) throw err;
        console.log('Post deleted');  // eslint-disable-line no-console
      });
    },
  }
};

module.exports = resolvers;



