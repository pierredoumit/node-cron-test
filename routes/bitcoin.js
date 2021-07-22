const express = require('express');
require('dotenv').config()
const router = express.Router();
const cron = require('node-cron');
const moment = require('moment');
const fetch = require('node-fetch');

// Load Bitcoin model
const Bitcoin = require('../models/Bitcoin');
let cronJob;

router.get("/", async (req, res) => {
    try {
        let page = req.query.page;
        const my_limit = 1;

        if (page === undefined)
            page = 1;

        const skipping = (page - 1) * my_limit;
        let total_pages = 1;

        const aggregate = await Bitcoin.aggregate([
            {
                "$facet": {
                    "totalData": [
                        { "$skip": skipping },
                        { "$limit": my_limit },
                    ],
                    "totalCount": [
                        {
                            "$group": {
                                "_id": null,
                                "count": { "$sum": 1 }
                            }
                        }
                    ]
                }
            },
        ]);

        if (aggregate[0].totalCount.length > 0)
            total_pages = Math.ceil(aggregate[0].totalCount[0].count / my_limit);

        res.render(`Front/Bitcoin/list`, {
            info: aggregate[0].totalData,
            total_pages,
            moment
        });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).render("Front/Error/error");
    }
});

router.post('/', async (req, res) => {
    try {
        const { selectedInterval } = req.body
        if (cronJob)
            cronJob.stop();

        cronJob = cron.schedule(selectedInterval, () => {
            fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?&start=1&limit=1&convert=USD', {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.API_KEY
                },
            })
                .then(response => response.json())
                .then(data => {
                    const price = data.data[0].quote.USD.price
                    const entry = new Bitcoin({
                        price
                    });
                    entry.save();
                })
                .catch(err => console.log(err))
        });

        cronJob.start();
        res.send('ok')
    }
    catch (err) {
        console.log(err.message);
        res.status(500).render("Error/error");
    }
});

module.exports = router;