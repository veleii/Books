var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = "https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books";
function fetchBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const books = yield response.json();
            return books;
        }
        catch (error) {
            console.error('Failed to fetch books:', error);
            throw error;
        }
    });
}
function populateBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const books = yield fetchBooks();
            const covers = document.querySelectorAll('.cover');
            books.forEach((book, index) => {
                if (covers[index]) {
                    const titleElement = covers[index].querySelector('h2');
                    const summaryElement = covers[index].querySelector('p');
                    if (titleElement)
                        titleElement.textContent = book.title;
                    if (summaryElement)
                        summaryElement.textContent = book.plot;
                    covers[index].addEventListener('click', () => {
                        const infoTitle = document.querySelector('.upclose h3');
                        const infoText = document.querySelector('.bookinfo');
                        const infoSection = document.querySelector('.info');
                        if (infoTitle && infoText && infoSection) {
                            infoTitle.textContent = book.title;
                            infoText.textContent = `
                    Författare: ${book.author}
                    Förlag: ${book.publisher}
                    År: ${book.year}
                    Antal sidor: ${book.pages}
                            
                    ${book.plot}
                            
                    Målgrupp: ${book.audience}
                `;
                            infoSection.style.display = 'block';
                        }
                    });
                }
            });
            document.addEventListener('click', (e) => {
                const infoSection = document.querySelector('.info');
                const upclose = document.querySelector('.upclose');
                const target = e.target;
                if (infoSection && upclose &&
                    !upclose.contains(target) &&
                    !Array.from(covers).some(cover => cover.contains(target))) {
                    infoSection.style.display = 'none';
                }
            });
        }
        catch (error) {
            console.error('Failed to populate books:', error);
        }
    });
}
populateBooks();
function searchBooks(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const books = yield fetchBooks();
        return books.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
    });
}
function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const covers = document.querySelectorAll('.cover');
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const query = searchInput.value.trim();
            const filteredBooks = yield searchBooks(query);
            covers.forEach(cover => {
                const titleElement = cover.querySelector('h2');
                const summaryElement = cover.querySelector('p');
                if (titleElement)
                    titleElement.textContent = '';
                if (summaryElement)
                    summaryElement.textContent = '';
            });
            filteredBooks.forEach((book, index) => {
                if (covers[index]) {
                    const titleElement = covers[index].querySelector('h2');
                    const summaryElement = covers[index].querySelector('p');
                    if (titleElement)
                        titleElement.textContent = book.title;
                    if (summaryElement)
                        summaryElement.textContent = book.plot;
                }
            });
            if (filteredBooks.length === 0) {
                console.log('Inga böcker matchade din sökning.');
            }
        }));
    }
}
handleSearch();
function handleSearchAndDisplay() {
    const searchInput = document.querySelector('.my-input');
    const searchButton = document.querySelector('.search-button');
    const infoSection = document.querySelector('.info');
    const infoTitle = document.querySelector('.upclose h3');
    const infoText = document.querySelector('.bookinfo');
    if (searchInput && searchButton && infoSection && infoTitle && infoText) {
        searchButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            const query = searchInput.value.trim();
            const books = yield fetchBooks();
            const book = books.find(b => b.title.toLowerCase() === query.toLowerCase());
            if (book) {
                infoTitle.textContent = book.title;
                infoText.textContent = `
                    Författare: ${book.author}
                    Förlag: ${book.publisher}
                    År: ${book.year}
                    Antal sidor: ${book.pages}
                    
                    ${book.plot}
                    
                    Målgrupp: ${book.audience}
                `;
                infoSection.style.display = 'block';
            }
            else {
                alert('Ingen bok matchade din sökning.');
            }
        }));
    }
}
handleSearchAndDisplay();
