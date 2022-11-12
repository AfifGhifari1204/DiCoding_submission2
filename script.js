document.addEventListener('DOMContentLoaded', function () {
    const ing = document.getElementById('inputBook');
    ing.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    const Book = [];
    const RENDER_EVENT = 'render-book';
    const SAVED_EVENT = 'saved-book';
    const BOOKSHELF_KEY = 'bookshelf-apps';

    function generateId() {
        return +new Date();
    }

    function generateinputedBook(id, bookTitle, bookAuthor, bookYear, isCompleted) {
        return {
            id,
            bookTitle,
            bookAuthor,
            bookYear,
            isCompleted
        }
    }

    function addBook() {
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const completed = document.getElementById('inputBookIsComplete').checked;

        const generatedID = generateId();
        const inputedBook = generateinputedBook(generatedID, title, author, year, completed);
        Book.push(inputedBook);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    document.addEventListener(RENDER_EVENT, function () {
        console.log(Book);
    });

    function insertingBook(inputedBook) {
        const { id, bookTitle, bookAuthor, bookYear, isCompleted } = inputedBook;

        const titleText = document.createElement('h3');
        titleText.innerText = bookTitle;

        const author = document.createElement('p');
        author.innerText = bookAuthor;

        const year = document.createElement('p');
        year.innerText = bookYear;

        const container = document.createElement('article');
        container.classList.add('book_item');
        container.append(titleText, author, year);
        container.setAttribute('id', `books-${id}`);


        if (isCompleted) {
            const readBook = document.createElement('button');
            readBook.innerText = 'Belum selesai dibaca';
            readBook.classList.add('green');
            readBook.addEventListener('click', function () {
                unreadBook(id);
            });

            const remove = document.createElement('button');
            remove.innerText = 'Hapus buku';
            remove.classList.add('red');
            remove.addEventListener('click', function () {
                removeBook(id);
            });

            container.append(readBook, remove);

        } else {

            const unread = document.createElement('button');
            unread.innerText = 'Selesai dibaca';
            unread.classList.add('green');
            unread.addEventListener('click', function () {
                haveReadBook(id);
            });

            const remove = document.createElement('button');
            remove.innerText = 'Hapus buku';
            remove.classList.add('red');
            remove.addEventListener('click', function () {
                removeBook(id);
            });

            container.append(unread, remove);
        }

        return container;
    }

    document.addEventListener(RENDER_EVENT, function () {
        const notyetread = document.getElementById('incompleteBookshelfList');
        const haveread = document.getElementById('completeBookshelfList');

        notyetread.innerHTML = '';
        haveread.innerHTML = '';

        for (bookItem of Book) {
            insertingBook(bookItem);
            if (bookItem.isCompleted) {
                haveread.append(insertingBook(bookItem));
            } else {
                notyetread.append(insertingBook(bookItem));
            }
        }
    });

    function haveReadBook(bookId) {
        const bookTarget = findBook(bookId);
        if (bookTarget == null) return;

        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function removeBook(bookId) {
        const bookTarget = findBookIndex(bookId);
        if (bookTarget === -1) return;
        Book.splice(bookTarget, 1);

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function unreadBook(bookId) {
        const bookTarget = findBook(bookId);
        if (bookTarget == null) return;
        bookTarget.isCompleted = false;

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBook(bookId) {
        for (bookItem of Book) {
            if (bookItem.id === bookId) {
                return bookItem;
            }
        }
        return null;
    }

    function findBookIndex(bookId) {
        for (index in Book) {
            if (Book[index].id === bookId) {
                return index;
            }
        }
        return -1;
    }

    function SavedBook() {
        if (typeof (Storage) === undefined) {
            alert('No saved book')
            return false;
        }
        return true;
    }
    document.addEventListener(SAVED_EVENT, function () {
        console.log(localStorage.getItem(BOOKSHELF_KEY));
    });

    function saveData() {
        if (SavedBook()) {
            const parsed = JSON.stringify(Book);
            localStorage.setItem(BOOKSHELF_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

    function loadSavedBook() {
        const serializeData = localStorage.getItem(BOOKSHELF_KEY);
        let data = JSON.parse(serializeData);

        if (data !== null) {
            for (const theBook of data) {
                Book.push(theBook);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    if (SavedBook()) {
        loadSavedBook();
    }
});