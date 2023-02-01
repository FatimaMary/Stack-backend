const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const { request, response } = require("express");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.post("/", (request, response) => {
    const newStock = request.body;
    console.log(newStock);

    let db = new sqlite3.Database("db/stackmanagement.db");
    let insertQuery = "INSERT INTO StockTable(name) VALUES( ?)";

    const values = [
        newStock.name,
        // newStock.total
    ];

    db.run(insertQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Succesfully inserted Stack"
            });
        }
    });
    db.close();
});

app.get("/", (request, response) => {
    let db = new sqlite3.Database("db/stackmanagement.db");

    const selectQuery = "SELECT stackId, name, total FROM StackTable";

    db.all(selectQuery, [], (err, rows) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            const stackEntries = rows.map((singleStack) => {
                return {
                    stackId: singleStack.stackId,
                    name: singleStack.name,
                    total: singleStack.total
                };
            });
            response.json(stackEntries)
        }
    });
    db.close();
});

app.put("/", (request, response) => {
    const updatedStack = request.body;
    let db = new sqlite3.Database("db/stackmanagement.db");

    const updatedData = [updatedStack.total];
    const stackId = updatedStack.stackId;

    // const updatedQuery = "UPDATE StackTable SET total = ? WHERE stackId = ?";
    const updatedQuery = "UPDATE StackTable SET total = total - ChangeStack.value FROM ChangeStack WHERE StackTable.stackId = ChangeStack.stackId AND ChangeStack.activity = 'checkout'";
    const values = [...updatedData, stackId];

    db.run(updatedQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Stack updated"
            });
        }
    });
    db.close();
});

// app.put("/", (request, response) => {
//     const updatedStack = request.body;
//     let db = new sqlite3.Database("db/stackmanagement.db");

//     const updatedData = [updatedStack.total];
//     const stackId = updatedStack.stackId;

//     const updatedQuery = "UPDATE StackTable SET total = total + ChangeStack.value FROM ChangeStack WHERE StackTable.stackId = ChangeStack.stackId AND ChangeStack.activity = 'checkin'";
//     const values = [...updatedData, stackId];

//     db.run(updatedQuery, values, (err) => {
//         if(err) {
//             response.json({
//                 message: err.message,
//             });
//         } else {
//             response.json({
//                 message: "Stack updated"
//             });
//         }
//     });
//     db.close();
// });


app.delete("/", (request, response) => {
    const stackId = parseInt(request.body.stackId);

    let db = new sqlite3.Database("db/stackmanagement.db");
    const values = [stackId];

    const deleteQuery = "DELETE FROM StackTable WHERE stackId = ?";

    db.run(deleteQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Stack Deleted"
            });
        }
    });
    db.close();
})

app.post("/change", (request, response) => {
    const changeStack = request.body;
    console.log(changeStack);

    let db = new sqlite3.Database("db/stackmanagement.db");

    let insertQuery = "INSERT INTO ChangeStack(name, activity, value, stackId) VALUES(?, ?, ?, ?)"

    const updatedValue = changeStack.activity === 'checkout' ? (changeStack.value * -1) : (changeStack.value);

    const values = [
        changeStack.name,
        changeStack.activity,
        updatedValue,
        changeStack.stackId
    ];

    db.run(insertQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
    const stackId = changeStack.stackId;
    // const updatedQuery = "UPDATE StackTable SET total = (SELECT  SUM (value) FROM ChangeStack cs WHERE stackId = ?) WHERE stackId = ?";
    const selectQuery = "SELECT SUM(value) FROM ChangeStack WHERE stackId = ?"
    db.all(selectQuery, [], (err, rows) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            // const stackEntries = rows.map((singleStack) => {
            //     return {
            //         changeId: singleStack.changeId,
            //         name: singleStack.name,
            //         value: singleStack.value,
            //         date:  singleStack.date,
            //         time: singleStack.time,
            //         stackId: singleStack.stackId
            //     };
            // }); 
            console.log(rows);
            const updatedQuery = "UPDATE StackTable SET total = SUM(ChangeStack.value) FROM ChangeStack WHERE StackTable.stackId = ChangeStack.stackId"
         const values = [stackId];

    db.run(updatedQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Stack updated"
            });
        }
    });
    // console.log(stackEntries);
        }
    });} });
    db.close();
});

app.get("/change", (request, response) => {
    let db = new sqlite3.Database("db/stackmanagement.db");

    const selectQuery = "SELECT changeId, name, value, date, time, stackId FROM ChangeStack";

    db.all(selectQuery, [], (err, rows) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            const stackEntries = rows.map((singleStack) => {
                return {
                    changeId: singleStack.changeId,
                    name: singleStack.name,
                    value: singleStack.value,
                    date:  singleStack.date,
                    time: singleStack.time,
                    stackId: singleStack.stackId
                };
            });
            response.json(stackEntries)
        }
    });
    db.close();
});


app.get("/select", (request, response) => {
    let db = new sqlite3.Database("db/stackmanagement.db");

    const selectQuery = "select st.stackId, st.name, sc.activity, sc.value, sc.date, sc.time from StackTable st INNER JOIN StackChange sc on st.name = sc.name";

    db.all(selectQuery, [], (err, rows) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            const stackEntries = rows.map((singleStack) => {
                return {
                    stackId: singleStack.stackId,
                    name: singleStack.name,
                    activity: singleStack.activity,
                    value: singleStack.value
                };
            });
            response.json(stackEntries)
        }
    });
    db.close();
});

app.put("/", (request, response) => {
    const updatedStack = request.body;
    let db = new sqlite3.Database("db/stackmanagement.db");

    const updatedData = [updatedStack.total];
    const stackId = updatedStack.stackId;

    const updatedQuery = "UPDATE StackTable SET total = ? WHERE stackId = ?";
    const values = [...updatedData, stackId];

    db.run(updatedQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Stack updated"
            });
        }
    });
    db.close();
});

app.delete("/", (request, response) => {
    const stackId = parseInt(request.body.stackId);

    let db = new sqlite3.Database("db/stackmanagement.db");
    const values = [stackId];

    const deleteQuery = "DELETE FROM StackTable WHERE stackId = ?";

    db.run(deleteQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Stack Deleted"
            });
        }
    });
    db.close();
})

app.listen(8000, () => {
    console.log('Start Listening, use 8000')
})