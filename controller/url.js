const Url = require('../model/url');
const shortid = require('shortid');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

const shorten = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        const history = await Url.find().sort({ _id: -1 });
        return res.render('index', { shortUrl: null, error: 'URL is required!', history, port: req.app.get('port') });
    }

    try {
        const shortId = shortid.generate();
        const shortUrl = `https://bonaaurlshortener-production.up.railway.app/${shortId}`;
        await Url.create({ shorturl: shortId, longurl: url, visittime: [] });
        const history = await Url.find().sort({ _id: -1 });
        // Render with shortUrl and history, no redirect
        res.render('index', { shortUrl, error: null, history, port: req.app.get('port') });
    } catch (err) {
        console.error('Create error:', err);
        const history = await Url.find().sort({ _id: -1 });
        res.render('index', { shortUrl: null, error: 'Server error', history, port: req.app.get('port') });
    }
};

const success = async (req, res) => {
    const shortId = req.params.shortId;
    const shortUrl = `https://bonaaurlshortener-production.up.railway.app/${shortId}`;
    const history = await Url.find().sort({ _id: -1 });
    res.render('index', { shortUrl, error: null, history, port: req.app.get('port') });
};

const redirect = async (req, res) => {
    const ist = moment().tz("Asia/Kolkata").format("hh:mm:ss A DD-MM-YYYY");
    try {
        const urlDoc = await Url.findOneAndUpdate(
            { shorturl: req.params.shortId },
            { $push: { visittime: ist } },
            { new: true }
        );
        if (!urlDoc) return res.status(404).send("URL Not Found");
        res.redirect(urlDoc.longurl);
    } catch (err) {
        console.error('Redirect error:', err);
        res.status(500).send("Server Error");
    }
};

const deleteUrl = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('Deleting ID:', id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const result = await Url.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'URL not found' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ error: 'Delete failed', details: err.message });
    }
};

module.exports = { shorten, redirect, deleteUrl, success };