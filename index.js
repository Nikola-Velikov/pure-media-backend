const express = require('express');
const mongoose = require('mongoose');
const routesConfig = require('./config/routes.js');
const databaseConfig = require('./config/database.js');
const path = require('path');
const News = require('./models/news.js');
const fs = require('fs');
const Matches = require('./models/matches.js');
// const uploadData = async () => {
//     try {
//         console.log(1);
//         const data = JSON.parse(fs.readFileSync('news.json', 'utf-8'));
//         const formattedData = data.map(item => {
//             return {
//                  btaNewId : item.btaNewId ? new mongoose.Types.ObjectId(item.btaNewId.$oid) : undefined,
//                  matchNewId :item.matchNewId ? new mongoose.Types.ObjectId(item.matchNewId.$oid) : undefined,
//                  createdAt : item.createdAt ? new Date(parseInt(item.createdAt.$date.$numberLong)) : undefined,
//                  updatedAt: item.updatedAt ? new Date(parseInt(item.updatedAt.$date.$numberLong)) : undefined
    
//             };
//         });
        
//         await Matches.insertMany(formattedData);
//         console.log('Data uploaded successfully!');
//     } catch (error) {
//         console.error('Upload error:', error);
//     } 
// };

start();

async function start() {
    const app = express();

    await databaseConfig(app);
    routesConfig(app);
   // await uploadData()
   // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
   app.listen(4000, () => { console.log('App listening on port 3000') });

//    async function updateNewsCreatedAt() {
//     try {
//         const newsItems = await News.find(); // Fetch all news

//         for (const news of newsItems) {
//             const createdAt = new Date(news.createdAt);
            
//             // Check if the date is March 26, 2024
//             if (createdAt.getFullYear() === 2025 && createdAt.getMonth() === 2 && createdAt.getDate() === 26) {
//                 // Set createdAt to March 21, 2024
//                 news.createdAt = new Date(2025, 2, 21); // Month is 0-based (2 = March)
//                 await news.save(); // Save the updated news
//                 console.log(`✅ Updated createdAt from March 26 to March 21 for: ${news.title}`);
//             }
//         }

//         console.log("✅ Finished checking and updating news timestamps.");
//     } catch (err) {
//         console.error("❌ Error updating news:", err);
//     }
// }

// // Run the function
// updateNewsCreatedAt();

    //await Matches.deleteMany({});
   //  await uploadData()
  
//     const findNewsByTitleAndMedia = async (title, media) => {
//         try {
//             const news = await News.findOne({ title: title, media: media });
//             return news;
//         } catch (err) {
//             console.error('Error finding news:', err);
//             return null;
//         }
//     };

//  const matchesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'matches.json'), 'utf-8'));

//         // Loop through each match
//         for (const match of matchesData) {
//             // 1. Find the 'BTA' news article based on the title and media
//             const btaNews = await findNewsByTitleAndMedia(match.title, 'BTA');
            
            
//             if (btaNews) {
//                 // 2. For each match, find the related news article by description and media
//                 for (const matchItem of match.matches) {
//                     //console.log(matchItem.content);
                    
//                     const matchNews = await News.findOne({
//                         title: matchItem.title, // Assuming you match by content/description
//                         media: matchItem.media
//                     });

                   

//                     if (matchNews) {
//                        //console.log(matchNews);
                       
                        
//                         // 3. Create a new entry in the Matches collection
//                         const newMatch = new Matches({
//                             btaNewId: btaNews._id,
//                             matchNewId: matchNews._id
//                         });
                        
                    
//                        await newMatch.save();
//                     }else{
//                        // console.log(matchNews);
                        
//                     }
//                 }
//             }
//         }

// const deleteNewsById = async (id) => {
//     try {
//         const deletedNews = await News.findByIdAndDelete(id);
//         if (!deletedNews) {
//              console.log(
//               { success: false, message: "News entity not found" });
//         }
//         console.log( { success: true, message: "News entity deleted successfully" });
//     } catch (error) {
//        console.log( {success: false, message: "Error deleting news entity", error: error.message} );
//     }
// };

// deleteNewsById("67e5aa4b71b8bd0d3c0edd40")


    // async function saveNews(title, description, mediaName, image_url) {
    //     try {
    //         const existingNews = await News.findOne({ title: title });
    //     if (existingNews) {
           
    //         console.log(`Duplicate news detected: ${title}`);
    //         return; // Skip saving if it already exists
    //     }
    //         const news = new News({
    //             image_url: image_url,
    //             title: title,
    //             description: description,
    //             media: mediaName,
    //             createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) // Set the createdAt to the previous day
    //         });
    
    //         await news.save();
    //         console.log(`Saved news: ${title}`);
    //     } catch (err) {
    //         console.error('Error saving news:', err);
    //     }
    // }
    
    // // Read the file and parse news
    // function parseNewsFile(filePath, mediaName) {
    //     fs.readFile(filePath, 'utf8', async (err, data) => {
    //         if (err) {
    //             console.error('Error reading the file:', err);
    //             return;
    //         }
    
    //         // Split the file content by "Title"
    //         const newsItems = data.split('Title');
            
    //         // Process each news item
    //         for (const item of newsItems) {
    //             // Trim extra spaces and check if item is valid
    //             const trimmedItem = item.trim();
    //             if (trimmedItem.length === 0) continue;
    
    //             // Find the position of the colon (:) to separate title and description
    //             const colonIndex = trimmedItem.indexOf(':');
    //             if (colonIndex !== -1) {
    //                 const firstTitle = trimmedItem.substring(0, colonIndex).trim();
    //                 let title = "";
    //                 let image_url = "";
    //                 if (firstTitle.includes(";;;")) {
    //                     const splitTitle = firstTitle.split(";;;");
    //                     title = splitTitle[0]
    //                     image_url = splitTitle[1]
    //                 }else{
    //                     title = firstTitle
    //                 }
    //                 const description = trimmedItem.substring(colonIndex + 1).trim();
    
    //                 // Save the news to the database
    //                 await saveNews(title, description, mediaName, image_url);
    //             }
    //         }
    
    //         console.log('All news items have been processed.');
    //     });
    // }
    
    // const filePath = path.join(__dirname, 'news3.txt');
    
    // const mediaName = 'Mediapool';
    
    // parseNewsFile(filePath, mediaName);
 }
