const notFound = (req, res) => {
    res.status(404).json({success:false, msg:`Cannot find the url: ${req.url} `})
}

module.exports = notFound