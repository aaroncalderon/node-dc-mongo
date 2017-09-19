var Subjects = require('./models/SubjectViews');

module.exports = function (app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes	
    // sample api route
    app.get('/api/data', function (req, res) {
        // use mongoose to get all nerds in the database
        Subjects.find({}, {
            '_id': 0,
            "Name" : 1,
            "Reports-To" : 1,
            "ID" : 1,
            "FIRST_NAME" : 1,
            "LAST_NAME" : 1,
            "Full Name" : 1,
            "BUSINESS_UNIT" : 1,
            "DEPTID" : 1,
            "JOBCODE" : 1,
            "Job Title" : 1,
            "POS JCODE" : 1,
            "Location ID" : 1,
            "Location" : 1,
            "Subordinate POS JOBCODE" : 1,
            "Subordinate POS Business Title" : 1,
            "Subordinate POS Business Unit" : 1,
            "Subordinate POS LOCATION ID" : 1,
            "Subordinate POS LOCATION" : 1,
            "Subordinate Job Title" : 1,
            "Subordinate Business Title" : 1,
            "Subordinate JOBCODE" : "1STVP",
            "Subordinate JOBCODE Business Title" : 1,
            "Subordinate Deptartment ID" : 1,
            "Subordinate Department Name" : 1,
            "Subordinate LOCATION ID" : 1,
            "Subordinate LOCATION" : 1,
            "Subordinate POS Num" : 1,
            "Subordinate Reports-To" : 1,
        }, function (err, subjectDetails) {
            // if there is an error retrieving, send the error. 
            // nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(subjectDetails); // return all nerds in JSON format
        });
    });





    // frontend routes =========================================================
    app.get('*', function (req, res) {
        res.sendfile('./public/login.html');
    });
}