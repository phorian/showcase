const Flutterwave = require('flutterwave-node-v3');
const User = require("../models/User");
const Store = require("../models/store");
const Cart = require("../models/cart");

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


exports.createWallet = async (req, res) => {
const { firstname, lastname, email, phone, bvn } = req.body;

if ( !firstname || !lastname || !email || !phone || !bvn){
    return res.status(400).json({
        message: 'Please provide all required fields'
    });
}

try {
    const wallet = await flw.VirtualAcct.create({
        firstname: firstname,
        lastname: lastname,
        email,
        bvn,
        phone,
        is_permanent: true,
        tx_ref: `ShwcseMrchnt{Date.now()}`,
    });

    const newWallet = new User({
        email,
        firstname,
        lastname,
        walletId: wallet.data.account_number,
    });

    await newWallet.save();


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


exports.payMerchant = async (req, res) => {
    const { userId } = req.body;

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
                    totalAmount: 0,
                    items: [],
                };
            }
            acc[storeId].totalAmount += item.productId.price * item.quantity;
            acc[storeId].items.push(item);
            return acc;
        }, {});


        //Process payments for each store

        const transactions = Object.values(storePayments).map(async (storePayment) => {
            const response = await flw.Transfer.initiate({
                account_bank: storePayment.store.bankCode,
                account_number: storePayment.store.walletId,  //flutterwave wallet 
                amount: storePayment.totalAmount,
                currency: 'NGN',
                narration: `Payment for items from ${storePayment.store.title}`,
                tx_ref: `ShwcseMrchnt{Date.now()}`,
                debit_currency: 'NGN',
            });

            return response.data
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



exports.depositFund = async (req, res) => { }


exports.withdrawBalance = async (req, res) => { }