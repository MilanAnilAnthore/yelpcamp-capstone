const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelpcamp-capstone');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for (i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = await new Campground({
            author: '6935b17860cecdbc35d77cd6',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { "type": "Point", "coordinates": [75.7754, 11.245204] },
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur molestiae praesentium reiciendis, provident expedita cum mollitia obcaecati, exercitationem sapiente sed repellat dolore quibusdam inventore rem deserunt ratione voluptas doloremque ad.",
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/drggckqb4/image/upload/v1765219863/YelpCamp/mffkbq60u4yvprmtpy8c.jpg',
                    filename: 'YelpCamp/mffkbq60u4yvprmtpy8c',
                },
                {
                    url: 'https://res.cloudinary.com/drggckqb4/image/upload/v1765219864/YelpCamp/jghcahlrpeb2rs1y5b00.jpg',
                    filename: 'YelpCamp/jghcahlrpeb2rs1y5b00',
                }
            ]
        })
        await camp.save();
    }


}

seedDB().then(() => {
    mongoose.connection.close();
})