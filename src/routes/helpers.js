// 15 days from now
const EndDate = new Date(1651269600 * 1000);

function Special(req, res, next) {
    res.send({
        data: {
            title: '£10 off any LEGO set! Limited Time Only!',
            end: EndDate,
        },
    });
}

module.exports = {
    Special,
};