const { controller } = require("./controller");

const getBooks = 'SELECT * FROM public."BOOK"';
const getBookByID = `
    SELECT * FROM public."BOOK"
    WHERE "BookNumber" = $1
`;
const checkBookExist = `
    SELECT b FROM public."BOOK" b
    WHERE "BookName" = $1
    AND "PUBLISHER_PublisherNumber" = $2
    AND "PublicationYear" = $3
`;

const checkBookExistByID = `
    SELECT * FROM public."BOOK"
    WHERE "BookNumber" = $1
`;

const addBook = `
    INSERT INTO public."BOOK" (
        "BookName", 
        "PUBLISHER_PublisherNumber",
        "PublicationYear",
        "BookPrice", 
        "Pages", 
        "Synopsis"
    ) 
    VALUES ($1, $2, $3, $4, $5, $6)
`;
const removeBook = `
    DELETE FROM public."BOOK" 
    WHERE "BookNumber" = $1
`;
const updateBook = `
    UPDATE public."BOOK" SET "BookName" = $1 
    WHERE "BookNumber" = $2
`;
const getWishlist = `
    SELECT B."BookName", B."PublicationYear", B."BookPrice", B."Pages", B."Synopsis"
    FROM public."BOOK" B
    INNER JOIN public."WISHLIST" W ON B."BookNumber" = W."BOOK_BookNumber"
    WHERE W."CUSTOMER_CustomerNumber" = $1
`;

const checkBookWishlist = `
    SELECT * 
    FROM public."WISHLIST"
    WHERE "CUSTOMER_CustomerNumber" = $1
    AND "BOOK_BookNumber" = $2
`;

const addToWishlist = `
    INSERT INTO public."WISHLIST" (
        "CUSTOMER_CustomerNumber",
        "BOOK_BookNumber"
    ) 
    VALUES ($1, $2)
`;

const removeWishlist = `
    DELETE FROM public."WISHLIST" 
    WHERE "CUSTOMER_CustomerNumber" = $1
    AND "BOOK_BookNumber" = $2
`;

const getBooksByPublisher = `
    SELECT * FROM public."BOOK"
    WHERE "PUBLISHER_PublisherNumber" = $1
`;

const getTopWishlistedBooks = `
    SELECT B."BookNumber", B."BookName", COUNT(W."BOOK_BookNumber") AS WishlistCount
    FROM public."BOOK" B
    LEFT JOIN public."WISHLIST" W ON B."BookNumber" = W."BOOK_BookNumber"
    GROUP BY B."BookNumber", B."BookName"
    HAVING COUNT(W."BOOK_BookNumber") > 0
    ORDER BY WishlistCount DESC
`;
const getBookReviews = `
    SELECT A."Username", R."Comment", R."Rating"
    FROM public."CUSTOMER_ACCOUNT" A
    INNER JOIN public."CUSTOMER" C ON A."CUSTOMER_CustomerNumber" = C."CustomerNumber"
    INNER JOIN public."BOOK_REVIEW" R ON C."CustomerNumber" = R."CUSTOMER_CustomerNumber"
    WHERE R."BOOK_BookNumber" = $1
`;

const getTopRatedBooks = `
    SELECT B."BookName", ROUND(CAST(AVG(R."Rating") AS NUMERIC), 2) AS AvgRating
    FROM public."BOOK" B
    INNER JOIN public."BOOK_REVIEW" R ON B."BookNumber" = R."BOOK_BookNumber"
    GROUP BY B."BookNumber", B."BookName"
    ORDER BY AvgRating DESC
`;

const addBookReview = `
    INSERT INTO public."BOOK_REVIEW" (
        "Rating",
        "Comment",
        "CUSTOMER_CustomerNumber",
        "BOOK_BookNumber"
    ) 
    VALUES ($1, $2, $3, $4)
`;

const checkCustomerExist = `
    SELECT * 
    FROM public."CUSTOMER" c
    JOIN public."CUSTOMER_ACCOUNT" ca ON c."CustomerNumber" = ca."CUSTOMER_CustomerNumber"
    WHERE c."CustomerNumber" = $1
`;

const checkReviewExist = `
    SELECT * 
    FROM public."BOOK_REVIEW"
    WHERE "CUSTOMER_CustomerNumber" = $1
    AND "BOOK_BookNumber" = $2
`;

const removeBookReview = `
    DELETE FROM public."BOOK_REVIEW" 
    WHERE "CUSTOMER_CustomerNumber" = $1
    AND "BOOK_BookNumber" = $2
`;

const checkInventory = `
    SELECT * FROM public."INVENTORY"
    WHERE "BOOK_BookNumber" = $1
    AND "Quantity" >= $2
    ORDER BY "Quantity" DESC
    LIMIT 1
`;

const addPurchaseHistory = `
    INSERT INTO public."TRANSACTION" (
        "CUSTOMER_CustomerNumber",
        "EMPLOYEE_EmployeeNumber",
        "INVENTORY_InventoryNumber",
        "TransactionDate",
        "Quantity"
    ) 
    VALUES ($1, NULL, $2, $3, $4)

`;

const updateInventory = `
    UPDATE public."INVENTORY"
    SET "Quantity" = "Quantity" - $1
    WHERE "InventoryNumber" = $2;
`;

const getInventory = `
    SELECT s."StoreName", b."BookName", i."Quantity"
    FROM public."INVENTORY" i
    JOIN public."STORE" s ON i."STORE_StoreNumber" = s."StoreNumber"
    JOIN public."BOOK" b ON i."BOOK_BookNumber" = b."BookNumber"
    WHERE i."InventoryNumber" = $1;
`;

const updateQuantity = `
    UPDATE public."INVENTORY"
    SET "Quantity" = $1
    WHERE "InventoryNumber" = $2
`;

module.exports = {
    getBooks,
    getBookByID, 
    checkBookExist,
    checkBookExistByID,
    addBook,
    removeBook,
    updateBook,
    getWishlist,
    checkBookWishlist,
    addToWishlist,
    removeWishlist,
    getBooksByPublisher,
    getTopWishlistedBooks,
    getBookReviews,
    getTopRatedBooks,
    addBookReview,
    checkCustomerExist,
    checkReviewExist,
    removeBookReview,
    checkInventory,
    addPurchaseHistory,
    updateInventory,
    getInventory,
    updateQuantity,
}