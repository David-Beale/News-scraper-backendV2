# News Scraper
https://db-newsfeeds.netlify.com/  
https://github.com/David-Beale/News-scraper-frontendV2
![news](https://user-images.githubusercontent.com/59053870/79229068-59fb0180-7e5a-11ea-98f7-3ad492774ba3.JPG)  
#### News Feeds helps users to create their own feeds by selecting text and/or images to scrape from any website. The app will scrape the site once an hour and store any new data for the user to view.

![Capture](https://user-images.githubusercontent.com/59053870/77827414-67e81d00-710d-11ea-9bc9-db30c80c097c.JPG)  

## Features
 
### Add custom feed
 ![image](https://user-images.githubusercontent.com/59053870/77829099-b4d0f100-7117-11ea-98fc-831db77a0776.png)  
 
#### Clicking add feed will allow the user to view an external website within the app. The draggable widget will allow the user to select a title, summary, image and link by clicking the desired content on the page.
#### The custom scraping algorithm will save a unique path to the content which will be used each time the server scrapes the content.
#### The "Not what you are looking for" button will try to access surrounding content and will give users the available options to choose from.

### Calendar select
![image](https://user-images.githubusercontent.com/59053870/77828676-c4026f80-7114-11ea-826a-a6f0a86c8ba2.png) 
#### Browse previously scraped headlines by date using the calendar select tool.

### Authentication
#### Authentication allows users to control their own content which will only be accessible to their account.

### Delete
![image](https://user-images.githubusercontent.com/59053870/77828697-f14f1d80-7114-11ea-89b0-02795537b6c6.png)  
#### Delete headlines will delete the current headline stored in the database. It will reappear if it is scraped again in the next cycle.
#### Delete scraper will stop the app from scraping this headline in the future.
#### Both can be selected at the same time

## Built With
* React
* GraphQL
* Apollo Server
* Mongo DB
* Passport

## Observations
* All external scripts are disabled when viewing external sites. Therefore, websites which rely heavily on scripts will not display properly. However, any visible content can still be scraped even if the formatting is broken.
* The scraping algorithm relies on the stored path to the content. Changes to the external site may cause the path to break, resulting in scrape failures.
* Certain sites including BBC News employ anti-scraping measures which prevent the app from scraping the content correctly.
* The site is for educational purposes only and is not intended as a commercial product.

## Other contributors
* Joseph Tolentino Cayamanda 

## Acknowledgements
https://github.com/alandouglas96/headlines-graphql

