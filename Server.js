const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const { request, response } = require("express");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// const readline = require('readline');

// const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
// const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// (async() => {
//   try {
//     const name = await prompt("Enter name of the stack: ");

//     const total = await prompt("Enter total stack : ");
    
//     console.log(`Name: ${name}, total: ${total}`);
//     let db = new sqlite3.Database("db/stackmanagement.db");
//     let insertQuery = "INSERT INTO StackTable(name, total) VALUES(?, ?)";

//     const values = [`${name}`,` ${total}`];

//     db.run(insertQuery, values, (err) => {
//         if(err) {
//             response.json({
//                 message: err.message,
//             });
//         }
//     });
//     db.close();
//     // rl.close();
//   } catch (e) {
//     console.error("Unable to prompt", e);
//   }
// })();


// When done reading prompt, exit program 
// rl.on('close', () => process.exit(0));

// (async() => {
//   try {
//     const stackId = await prompt("StackId: ");
//     const name = await prompt("Enter name of the stack: ");
//     const activity = await prompt("Activity: ");
//     const value = await prompt("Enter total stack : ");
    
//     console.log(`stackId: ${stackId}, Name: ${name}, Activity: ${activity}, value: ${value}`);
//     let db = new sqlite3.Database("db/stackmanagement.db");
//     let insertQuery = "INSERT INTO ChangeStack(stackId, name, activity, value) VALUES(?, ?, ?, ?)";

//     const values = [`${stackId}`, `${name}`, `${activity}`, ` ${total}`];

//     db.run(insertQuery, values, (err) => {
//         if(err) {
//             response.json({
//                 message: err.message,
//             });
//         // } else {
//         //     response.json({
//         //         message: "Succesfully inserted Stack"
//         //     });
//         }
//     });
//     db.close();
//     // rl.close();
//   } catch (e) {
//     console.error("Unable to prompt", e);
//   }
// })();

// rl.on('close', () => process.exit(0));


// let db = new sqlite3.Database("db/stackmanagement.db");
//       let data = [
//         ['glass', 200],
//         ['gear', 1000]
//      ]

//      for (var i=0;i<data.length; i++){
//         db.run("INSERT INTO StackTable(name, total) values(?,?)",data[i][0],data[i][1],(err,rows)=>{
//         if(err){
//            throw err;
//         }
//          console.log('Insert Success');
//     })
//    }
//    db.close();
//    {
//    let db = new sqlite3.Database("db/stackmanagement.db");

//    let sql = `SELECT name, total FROM StackTable`;

// db.all(sql, [], (err, rows) => {
//   if (err) {
//     throw err;
//   }
//   rows.forEach((row) => {
//     console.log(row.name, row.total);
//   });
// });

// // close the database connection
// db.close();}
// {
// let db = new sqlite3.Database("db/stackmanagement.db");

// let updatedData = ['200', 11];
// let updatedQuery = `UPDATE StackTable SET total = ? WHERE stackId = ?`;

// db.run(updatedQuery, updatedData, function(err) {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log(`Row(s) updated: ${this.changes}`);

// });

// // close the database connection
// db.close();

// }

// {
//     let db = new sqlite3.Database("db/stackmanagement.db");
    
//     let deleteId = [9];
//     let deleteQuery = `DELETE FROM StackTable WHERE stackId = ?`;
    
//     db.run(deleteQuery, deleteId, function(err) {
//       if (err) {
//         return console.error(err.message);
//       }
//       console.log(`Row(s) Deleted: ${this.changes}`);
    
//     });
    
//     // close the database connection
//     db.close();
    
//     }


app.post("/", (request, response) => {
    const newStack = request.body;
    console.log(newStack);

    let db = new sqlite3.Database("db/stackmanagement.db");
    let insertQuery = "INSERT INTO StackTable(name, total) VALUES(?, ?)";

    const values = [
        newStack.name,
        newStack.total
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

app.post("/change", (request, response) => {
    const changeStack = request.body;
    console.log(changeStack);

    let db = new sqlite3.Database("db/stackmanagement.db");
    // let insertQuery = "INSERT INTO StackChange(name, activity, value, stackId) VALUES(?, ?, ?, ?)";
    let insertQuery = "INSERT INTO ChangeStack_1(name, activity, value, stackId) VALUES(?, ?, ?, ?)";

    const values = [
        changeStack.name,
        changeStack.activity,
        changeStack.value,
        changeStack.stackId
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

app.get("/change", (request, response) => {
    let db = new sqlite3.Database("db/stackmanagement.db");

    const selectQuery = "SELECT changeId, name, value, date, time, stackId FROM StackChange_1";

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