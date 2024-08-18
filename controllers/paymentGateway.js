const Flutterwave = require('flutterwave-node-v3');
const User = require("../models/User");
const Store = require("../models/store");
const Cart = require("../models/cart");

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

async function updateUserDepositWalletBallance(userId, amount) {
    try{
        const user = await User.findById(userId);
        if(user){
            user.walletBalance += amount;
            await user.save();
            console.log(`Updated wallet balance for user ${userId}: ${user.walletBalance}`);
            } else  {
                console.log(`User with ID ${userId} not found`);
            }
        } catch (err){
            console.error('Error updating wallet balance:', err);
    }
}


exports.createUserWallet = async (req, res) => {
    const userId = req.user.id;



try {

    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
            message: 'User not found'
        });
    }

    const { firstname, lastname, email, phone} = user;

    const { bvn } = req.body;

    if ( !firstname || !lastname || !email || !phone || !bvn){
    return res.status(400).json({
        message: 'Please provide all required fields'
    });
}

    const wallet = await flw.VirtualAcct.create({
        firstname: firstname,
        lastname: lastname,
        email,
        bvn,
        phone,
        is_permanent: true,
        tx_ref: `ShwcseMrchnt{Date.now()}`,
    });

    /*const newWallet = new User({
        email,
        firstname,
        lastname,
        walletId: wallet.data.account_number,
    });*/

    user.walletId = wallet.data.account_number

    await user.save();


    res.status(201).json({
        status:'success',
        data:{
            wallet
        }
    });
} catch (err) {
    res.status(500).json({
        status:'false',
        message:err.message,
    });
}
}

exports.CreateStoreWallet = async (req, res) => {
    try {
        /*const store = await Store.findById(storeId).populate('owner');
        if(!store){
            return res.status(400).json({
                message: 'Store not found'
            });
        }*/

        const store = await Store.findOne({owner: req.user._id}).populate('owner');
        if(!store){
            return res.status(404).json({
                status: false,
                message: "Store not found"
            })
        }

        const { bvn } = req.body;

        if (!bvn){
            return res.status(400).json({
                message: 'Please Input your bvn'
            });
        }

        const payload = {
            businessEmail: businessEmail,
            is_permanent: true, // true --> Static account; false --> Dynamic account
            bvn,
        };

        const response = await flw.VirtualAcct.create(payload);
        store.walletId = response.data.account_number;

        await store.save();

        res.status(201).json({
            status:'success',
            data:{
                response
            }
        });
    } catch (err) {
        res.status(500).json({
            status:'false',
            message:err.message,
        });
    }
}


exports.payMerchant = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.find({ userId }).populate('storeId productId');

        if(cart.length === 0){
            return res.status(404).json({
                message: 'Cart not found'
            });
        }

        //Group items according to store here
        const storePayments = cart.reduce((acc, item) => {
            const storeId = item.storeId._id.toString();
            if(!acc[storeId]) {
                acc[storeId] = {
                    store: item.storeId,
                    totalPrice: 0.00,
                    items: [],
                };
            }
            acc[storeId].totalPrice += item.productId.price * item.quantity;
            acc[storeId].items.push(item);
            return acc;
        }, {});


        //Process payments for each store

        const transactions = Object.values(storePayments).map(async (storePayment) => {

            const originalAmount = storePayment.totalPrice;
            const buyerAmount = originalAmount * 1.05; // Buyer pays 5% fee
            const sellerAmount = originalAmount * 0.95; //Merchant pays 5% fee
            const showcaseAmount = originalAmount * 0.10; //showcase fee

            //Update buyer's wallet balance
            const buyer = await User.findById(userId);
            if(!buyer){
                throw new Error('Buyer not found');
            }

            if (buyer.walletBalance < buyerAmount) {
                throw new Error('Insufficient funds');
            }

            buyer.walletBalance -= buyerAmount;
            await buyer.save();

            const storeResponse = await flw.Transfer.initiate({
                account_bank: 'MPS', //change to flutterwave bank code
                account_number: storePayment.store.walletId,  //Merchant flutterwave wallet 
                amount: sellerAmount,
                currency: 'NGN',
                narration: `Payment for items from ${storePayment.store.title}`,
                tx_ref: `ShwcseMrchnt{Date.now()}`,
                debit_currency: 'NGN',
            });

             //Update store's wallet balance
             const storeWallet = await Store.findById(storePayment.store._id);
             if(!storeWallet){
                 throw new Error('Store not found');
             }
 
             storeWallet.walletBalance += sellerAmount;
             await storeWallet.save();

            const showcaseResponse = await flw.Transfer.initiate({
                account_bank: 'MPS', //change to flutterwave bank code
                account_number: process.env.SHOWCASE_WALLET_ID,  //Merchant flutterwave wallet 
                amount: showcaseAmount,
                currency: 'NGN',
                narration: `Showcase fee for items from ${storePayment.store.title}`,
                tx_ref: `ShwcseMrchnt{Date.now()}`,
                debit_currency: 'NGN',
            });

            return {
                storeResponse: storeResponse.data,
                showcaseResponse: showcaseResponse.data
            }
    });

    const results = await Promise.all(transactions);

    res.status(200).json({
        status:'success',
        data:{
            results
        }
    });
    } catch (err) {
        res.status(500).json({
            status: 'false',
            message: err.message,
        });
    }
}



exports.depositWebhook = async (req, res) => { 
    const event = req.body;
    console.log('Webhook received:', event);

    if(event.event === 'transfer.completed' && event.data.status === 'SUCCESSFUL') {
        const depositAmount = event.data.amount;
        const userId = event.data.user_Id

        updateUserDepositWalletBallance(userId, depositAmount);
    }

    res.status(200).send('Webhook received');
}


exports.withdrawBalance = async (req, res) => { 

    const { account_bank, account_number, amount, narration, walletType } = req.body

    const userId = req.user.id;

    if( !account_bank || !account_number || !amount) {
        return res.status(400).json({
            message: 'Please provide all required fields'
        });
    }

    try {
        let wallet;
        if(walletType === 'user'){
            wallet = await User.findById(userId);
        } else if (walletType === 'store') {
            wallet = await Store.findOne({owner: userId});
        } else {
            return res.status(400).json({
                message: 'Invalid wallet type'
            });
        }

        if(!wallet){
            return res.status(404).json({
                message: 'Wallet not found'
            });
        }

        if(wallet.walletBalance < amount){
            return res.status(400).json({
                message: 'Insuuficient funds'
            });
        }

        const withdrawal = await flw.Transfer.initiate({
            account_bank,
            account_number,
            amount,
            currency: 'NGN',
            narration: narration || 'Withdrawal from Showcase wallet',
            reference: `ShwcseWthdrl{Date.now()}`,
            debit_currency: 'NGN'
        });

        //update wallet balance
        wallet.walletBalance -= amount
        await wallet.save();

        res.status(201).json({
            status: 'success',
            data: withdrawal.data
        });
    } catch (err) {
        res.status(500).json({
            status: 'false',
            message: err.message,
        });
    }
}

