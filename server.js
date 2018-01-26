const r = require("rethinkdb");

var connection = null;

r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;

    //By default, RethinkDB creates a database test. Let’s create a table authors within this database:

    // r.db('test').tableCreate('authors').run(connection, function(err, result) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result, null, 2));
    // });

    //Let’s insert three new documents into the authors table:

    // r.table('authors').insert([
    //     { name: "William Adama", tv_show: "Battlestar Galactica",
    //     posts: [
    //         {title: "Decommissioning speech", content: "The Cylon War is long over..."},
    //         {title: "We are at war", content: "Moments ago, this ship received word..."},
    //         {title: "The new Earth", content: "The discoveries of the past few days..."}
    //     ]
    //     },
    //     { name: "Laura Roslin", tv_show: "Battlestar Galactica",
    //     posts: [
    //         {title: "The oath of office", content: "I, Laura Roslin, ..."},
    //         {title: "They look like us", content: "The Cylons have the ability..."}
    //     ]
    //     },
    //     { name: "Jean-Luc Picard", tv_show: "Star Trek TNG",
    //     posts: [
    //         {title: "Civil rights", content: "There are some words I've known since..."}
    //     ]
    //     }
    // ]).run(connection, function(err, result) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result, null, 2));
    // })

    //To retrieve all documents from the table authors, we can simply run the query r.table('authors'):

    r.table('authors').run(connection, function(err, cursor) {
        if (err) throw err;
        cursor.toArray(function(err, result) {
            if (err) throw err;
            //console.log(JSON.stringify(result, null, 2));
        });
    });

    //Let’s try to retrieve the document where the name attribute is set to William Adama. We can use a condition to filter the documents by chaining a filter command to the end of the query:

    r.table('authors').filter(r.row('name').eq("William Adama")).
        run(connection, function(err, cursor) {
            if (err) throw err;
            cursor.toArray(function(err, result) {
                if (err) throw err;
                //console.log(JSON.stringify(result, null, 2));
        });
    });

    //Let’s use filter again to retrieve all authors who have more than two posts:

    r.table('authors').filter(r.row('posts').count().gt(2)).
        run(connection, function(err, cursor) {
            if (err) throw err;
            cursor.toArray(function(err, result) {
                if (err) throw err;
                //console.log(JSON.stringify(result, null, 2));
        });
    });

    //We can also efficiently retrieve documents by their primary key using the get command. We can use one of the ids generated in the previous example:

    r.table('authors').get('9cb79ac4-7767-49af-954c-2a35c19538f6').
        run(connection, function(err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result, null, 2));
    });

    //Let’s update all documents in the authors table and add a type field to note that every author so far is fictional:
    
    // r.table('authors').update({type: "fictional"}).
    // run(connection, function(err, result) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result, null, 2));
    // });

    // r.table('authors').
    // filter(r.row("name").eq("William Adama")).
    // update({rank: "Admiral"}).
    // run(connection, function(err, result) {
    //     if (err) throw err;
    //     console.log(JSON.stringify(result, null, 2));
    // });

    //The update command allows changing existing fields in the document, as well as values inside of arrays. Let’s suppose Star Trek archaeologists unearthed a new speech by Jean-Luc Picard that we’d like to add to his posts:

    // r.table('authors').filter(r.row("name").eq("Jean-Luc Picard")).
    //     update({posts: r.row("posts").append({
    //         title: "Shakespeare",
    //         content: "What a piece of work is man..."})
    //     }).run(connection, function(err, result) {
    //         if (err) throw err;
    //         console.log(JSON.stringify(result, null, 2));
    //     });

    r.table('authors').
    filter(r.row('posts').count().lt(3)).
    delete().
    run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
});
