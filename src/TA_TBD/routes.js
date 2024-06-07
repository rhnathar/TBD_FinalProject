const { Router } = require('express');
const controller = require('./controller');
const router = Router();

//get
router.get('/books', controller.getBooks);
router.get('/books/:BookNumber', controller.getBookByID);
router.get('/wishlist/:CustomerNumber', controller.getWishlist);
router.get('/books/publisher/:PublisherNumber', controller.getBooksByPublisher);
router.get('/topWishlistedBooks', controller.getTopWishlistedBooks);
router.get('/book-reviews/:BookNumber', controller.getBookReviews);
router.get('/topRatedBooks', controller.getTopRatedBooks);
router.get('/inventory/:InventoryNumber', controller.getInventory);

//post
router.post('/books', controller.addBook);
router.post('/wishlist/:CustomerNumber', controller.addToWishlist);
router.post('/book-reviews/:CustomerNumber/:BookNumber', controller.addBookReview);
router.post('/search-book', controller.selectBookBuilder);
router.post('/purchase-book', controller.purchaseBook);

//delete
router.delete('/wishlist/:CustomerNumber/:BookNumber', controller.removeWishlist);
router.delete('/books/:BookNumber', controller.removeBook);
router.delete('/book-reviews/:CustomerNumber/:BookNumber', controller.removeBookReview);

//put
router.put('/books/:BookNumber', controller.updateBook);
router.put('/inventory/:InventoryNumber', controller.updateQuantity);
//export to server.js
module.exports = router;