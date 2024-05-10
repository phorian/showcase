const Cron = require('node-cron');
const Store = require('../models/store');
const Product = require('../models/product');

function deleteStoreAndProductCron(){
    Cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Cron started');
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            //Find stores and products pending deletion and deactivated over 30days
            const deactivatedStores = await Store.find({
                isAvailable: false,
                deactivationDate: { $lt: thirtyDaysAgo},
            });

            const deactivatedProducts = await Product.find({
                isAvailable: false,
                deactivationDate: { $lt: thirtyDaysAgo},
            });

            for (const store of deactivatedStores){
                await store.remove();
            }

            for( const product of deactivatedProducts){
                await product.remove();
            }

            res.status(201).json({
                status: 'success',
                length: deactivatedStores.length,
                message: `${deactivatedStores.length} stores deactivated and/or deleted.`,
                message: `${deactivatedProducts.length} products deactivated and/or deleted.`
            });
            
        } catch (err) {
            res.status(500).json({
                status: 'false',
                message: err.message
            });
        }
    })
}

module.exports = deleteStoreAndProductCron;