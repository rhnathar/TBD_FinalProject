const pool = require('../../db')
const queries = require('./queries');
const { get } = require('./routes');

const getBooks = (req, res) => {
    pool.query(queries.getBooks, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getBookByID = (req, res) => {
    const BookNumber = parseInt(req.params.BookNumber);
    pool.query(queries.getBookByID, [BookNumber], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getBooksByPublisher = (req, res) => {
    const PublisherNumber = parseInt(req.params.PublisherNumber);
    pool.query(queries.getBooksByPublisher, [PublisherNumber], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })

}

const getBookReviews = (req, res) => {
    const BookNumber = parseInt(req.params.BookNumber);
    pool.query(queries.getBookReviews, [BookNumber], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const getTopRatedBooks = (req, res) => {
    pool.query(queries.getTopRatedBooks, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })

}

const addBook = (req, res) => {
    const { BookName, PUBLISHER_PublisherNumber, PublicationYear, BookPrice, Pages, Synopsis } = req.body;

    //check if book already exist
    pool.query(queries.checkBookExist, [BookName, PUBLISHER_PublisherNumber, PublicationYear], (error, results) => {
        if (results.rows.length) {
            res.send("Book already exists.");
        }
        else{ //add book to db
            pool.query(
                queries.addBook, 
                [BookName, PUBLISHER_PublisherNumber, PublicationYear, BookPrice, Pages, Synopsis], 
                (error, results) => {
                    if (error) throw error;
                    res.status(201).send("Book submitted successfully");
                }
            );
        }  
    });
};

const removeBook = (req, res) => {
    const BookNumber = parseInt(req.params.BookNumber);

    pool.query(queries.getBookByID, [BookNumber], (error, results) => {
        const noBookFound = !results.rows.length;
        if(noBookFound){
            res.send("Book does not exist in the database");
        } 
        else{
            pool.query(queries.removeBook, [BookNumber], (error, results) => {
                if (error) throw error;
                res.status(200).send("Book removed successfully");
            });
        }
    });
};

const updateBook = (req, res) => {
    const BookNumber = parseInt(req.params.BookNumber);
    const { BookName } = req.body;

    pool.query(queries.getBookByID, [BookNumber], (error, results) => {
        const noBookFound = !results.rows.length;
        if(noBookFound){
            res.send("Book does not exist in the database");
        }
        else{
            pool.query(queries.updateBook, [BookName, BookNumber], (error, results) => {
                if (error) throw error;
                res.status(200).send("Book updated successfully");
            });
        }
    });
}

const getWishlist = (req, res) => {
    const CustomerNumber = parseInt(req.params.CustomerNumber);
    pool.query(queries.getWishlist, [CustomerNumber], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const getTopWishlistedBooks = (req, res) => {
    pool.query(queries.getTopWishlistedBooks, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const addToWishlist = (req, res) => {
    const CustomerNumber = parseInt(req.params.CustomerNumber);
    const { BOOK_BookNumber } = req.body;

    //check if book already exist in wishlist
    pool.query(queries.checkBookWishlist, [CustomerNumber, BOOK_BookNumber], (error, results) => {
        if (results.rows.length) {
            res.send("Book already exists in wishlist.");
        }
        else{//add book to wishlist
            pool.query(
                queries.addToWishlist, 
                [CustomerNumber, BOOK_BookNumber], 
                (error, results) => {
                    if (error) throw error;
                    res.status(201).send("Book added successfully from wishlist");
                }
            );
        }
    });
}

const removeWishlist = (req, res) => {
    const CustomerNumber = parseInt(req.params.CustomerNumber);
    const BookNumber = parseInt(req.params.BookNumber);
    
    //check if book exist in wishlist
    pool.query(queries.checkBookWishlist, [CustomerNumber, BookNumber], (error, results) => {
        if (!results.rows.length) {
            res.send("Book does not exists in wishlist.");
        }
        else{//delete book from wishlist
            pool.query(
                queries.removeWishlist, 
                [CustomerNumber, BookNumber], 
                (error, results) => {
                    if (error) throw error;
                    res.status(201).send('Book removed successfully');
                }
            );
        }
    });
}   

const addBookReview = (req, res) => {
    const CustomerNumber = parseInt(req.params.CustomerNumber);
    const BookNumber = parseInt(req.params.BookNumber);
    const { Rating, Comment } = req.body;

    //check if customer exists
    pool.query(queries.checkCustomerExist, [CustomerNumber], (error, customerResults) => {
        if (error) throw error;

        if (customerResults.rows.length === 0) {
            res.send('Customer not found');
            return;
        }

        //check if book exists
        pool.query(queries.checkBookExistByID, [BookNumber], (error, bookResults) => {
            if (error) throw error;

            if (bookResults.rows.length === 0) {
                res.send('Book not found');
                return;
            }

            //check if review already exists
            pool.query(queries.checkReviewExist, [CustomerNumber, BookNumber], (error, reviewResults) => {
                if (error) throw error;

                if (reviewResults.rows.length > 0) {
                    res.send('Review already exists');
                    return;
                }

                //add book review
                pool.query(
                    queries.addBookReview, 
                    [Rating, Comment, CustomerNumber, BookNumber], 
                    (error, results) => {
                        if (error) throw error;
                        res.send('Review submitted successfully');
                    }
                );
            });
        });
    });
};

const removeBookReview = (req, res) => {
    const CustomerNumber = parseInt(req.params.CustomerNumber);
    const BookNumber = parseInt(req.params.BookNumber);

    pool.query(queries.checkReviewExist, [CustomerNumber, BookNumber], (error, results) => {
        if (results.rows.length === 0) {
            res.send('Review does not exist');
            return;
        }

        pool.query(queries.removeBookReview, [CustomerNumber, BookNumber], (error, results) => {
            if (error) throw error;
            res.status(201).send('Review removed successfully');
        });
    });
};

const selectBookBuilder = (req, res) => {
    const { Attribute, Condition, Value, GroupBy, OrderBy, Limit} = req.body;
    //join book and genre
    let query = 'SELECT ' + (Attribute || 'b.*, g.*') + ' FROM public."BOOK" b JOIN public."BOOK_GENRE" bg ON b."BookNumber" = bg."BOOK_BookNumber" JOIN public."GENRE" g ON bg."GENRE_GenreNumber" = g."GenreNumber"';
    let whereClauses = [];
    let params = [];

    if (Condition && Value) {
        whereClauses.push(`${Condition} = $1`);
        params.push(Value);
    }
      
    if (whereClauses.length > 0) {
        query += ' WHERE ' + whereClauses.join(' AND ');
    } 

    if (GroupBy) {
        query += ` GROUP BY ${GroupBy}`;
    }

    if (OrderBy) {
        query += ` ORDER BY ${OrderBy}`;
    }

    if (Limit) {
        query += ` LIMIT ${Limit}`;
    }
    pool.query(query, params, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

const purchaseBook = async (req, res) => {
    const { CustomerNumber, BookNumber, TransactionDate, Quantity  } = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if customer exists
        const customerResult = await client.query(queries.checkCustomerExist, [CustomerNumber]);
        if (customerResult.rows.length === 0) {
            res.send('Customer not found');
            await client.query('ROLLBACK');
            return;
        }

        // Check if book exists
        const bookResult = await client.query(queries.checkInventory, [BookNumber, Quantity]);
        if (bookResult.rows.length === 0) {
            res.send('Book not found or the stock is not enough');
            await client.query('ROLLBACK');
            return;
        }
        //get inventory number
        const inventoryNumber = bookResult.rows[0].InventoryNumber;

        // Add book to purchase history
        await client.query(queries.addPurchaseHistory, [CustomerNumber, inventoryNumber, TransactionDate, Quantity]);

        // Update inventory
        await client.query(queries.updateInventory, [Quantity, inventoryNumber]);

        await client.query('COMMIT');
        res.status(201).send('Book purchased successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

const getInventory = (req, res) => {
    const InventoryNumber = parseInt(req.params.InventoryNumber);
    pool.query(queries.getInventory,[InventoryNumber], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const updateQuantity = (req, res) => {
    const InventoryNumber = parseInt(req.params.InventoryNumber);
    const { Quantity } = req.body;

    pool.query(queries.getInventory, [InventoryNumber], (error, results) => {
        if (results.rows.length === 0) {
            res.send('Inventory not found');
            return;
        }

        pool.query(queries.updateQuantity, [Quantity, InventoryNumber], (error, results) => {
            if (error) throw error;
            res.status(200).send('Inventory updated successfully');
        });
    }); 
}

module.exports = {
    getBooks,
    getBookByID,
    addBook,
    removeBook,
    updateBook,
    getWishlist,
    addToWishlist,
    removeWishlist,
    getBooksByPublisher,
    getTopWishlistedBooks,
    getBookReviews,
    getTopRatedBooks,
    addBookReview,
    removeBookReview,
    selectBookBuilder,
    purchaseBook,
    getInventory,
    updateQuantity,
};