# News Scraper
#### News Scraper began has a legacy pair project using headlines-graphql, a public API which serves main headlines of different newspapers:
https://github.com/alandouglas96/headlines-graphql  
#### We have since rebuilt the app from the ground up to be a full stack web scraping application.
![Capture](https://user-images.githubusercontent.com/59053870/77827298-a9c49380-710c-11ea-80c2-0c0ede9179f2.JPG)

#### Users can select any text and/or image to scrape from any website and the server will scrape the site once an hour and store any non-duplicate data for the user to view.  
![Capture](https://user-images.githubusercontent.com/59053870/77827414-67e81d00-710d-11ea-9bc9-db30c80c097c.JPG)  

 ## Installation
Download or clone this repository and the frontend repository located here :
https://github.com/David-Beale/News-scraper-frontend

Run `npm i` in both repos to install dependencies.
Add a .env file to the root directory of the server repo and add the URI for your Mongo database.
Run `npm start` in both repos.

## Features
 
* Calendar select to browse tiles by date.  
![image](https://user-images.githubusercontent.com/59053870/77828676-c4026f80-7114-11ea-826a-a6f0a86c8ba2.png) 

* Delete headlines will delete the current headline stored in the database. It will reappear if it is scraped again in the next cycle.  
Delete scraper will stop scraping this headline from now on.  
![image](https://user-images.githubusercontent.com/59053870/77828697-f14f1d80-7114-11ea-89b0-02795537b6c6.png)  

* Add feed will allow the user to view an external website within the app. The draggable widget will allow the user to select a title, summary, image and link by clicking the desired content on the page. The scraping algorithm will save a unique path to the content which will be used each time the server scrapes the content.  

![image](https://user-images.githubusercontent.com/59053870/77829099-b4d0f100-7117-11ea-98fc-831db77a0776.png)  

* The "Not what you are looking for" button will try to access surrounding content and will give users the available options to choose from.

## Built With
* React
* GraphQL
* Apollo Server
* Mongo DB

## Observations
* All external scripts are disabled when viewing external sites. Therefore, websites which rely heavily on scripts will not display properly. However, any visible content which can still be seen can still be scraped even if the formatting is broken.
* The scraping algorithm is currently unable to handle minor changes to the external sites layout. Any change to the external site will likely render the unique path invalid. 

## Future Features
* An algorithm that can handle minor changes to external DOMs
* Multiple user accounts

## Contributors
* David Beale
* Joseph Tolentino Cayamanda 

## Acknowledgements
https://github.com/alandouglas96/headlines-graphql

