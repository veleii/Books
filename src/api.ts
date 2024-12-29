interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    year: number;
    pages: number;
    plot: string;
    audience: string;
}

const API_URL = "https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books";

async function fetchBooks(): Promise<Book[]> {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const books = await response.json() as Book[];
        return books;
        
    } catch (error) {
        console.error('Failed to fetch books:', error);
        throw error;
    }
}

async function populateBooks(): Promise<void> {
    try {
        const books = await fetchBooks();
        const covers = document.querySelectorAll<HTMLElement>('.cover'); 
        
    books.forEach((book, index) => {
        if (covers[index]) {
            const titleElement = covers[index].querySelector<HTMLElement>('h2');
            const summaryElement = covers[index].querySelector<HTMLElement>('p');
                
            if (titleElement) titleElement.textContent = book.title;
            if (summaryElement) summaryElement.textContent = book.plot;

                
        covers[index].addEventListener('click', () => {
            const infoTitle = document.querySelector<HTMLElement>('.upclose h3');
            const infoText = document.querySelector<HTMLElement>('.bookinfo');
            const infoSection = document.querySelector<HTMLElement>('.info');

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

    
document.addEventListener('click', (e: MouseEvent) => {
    const infoSection = document.querySelector<HTMLElement>('.info');
    const upclose = document.querySelector<HTMLElement>('.upclose');
    const target = e.target as HTMLElement;

    if (infoSection && upclose && 
            !upclose.contains(target) && 
            !Array.from(covers).some(cover => cover.contains(target))) {
            infoSection.style.display = 'none';
        }
});

    } catch (error) {
        console.error('Failed to populate books:', error);
    }
}

populateBooks();

async function searchBooks(query: string): Promise<Book[]> {
    const books = await fetchBooks();
    return books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase())
    );
}

function handleSearch(): void {
    const searchInput = document.querySelector<HTMLInputElement>('.search-input');
    const searchButton = document.querySelector<HTMLButtonElement>('.search-button');
    const covers = document.querySelectorAll<HTMLElement>('.cover');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            const filteredBooks = await searchBooks(query);

            
         covers.forEach(cover => {
                const titleElement = cover.querySelector<HTMLElement>('h2');
                const summaryElement = cover.querySelector<HTMLElement>('p');
                if (titleElement) titleElement.textContent = '';
                if (summaryElement) summaryElement.textContent = '';
            });

           
            filteredBooks.forEach((book, index) => {
                if (covers[index]) {
                    const titleElement = covers[index].querySelector<HTMLElement>('h2');
                    const summaryElement = covers[index].querySelector<HTMLElement>('p');
                    if (titleElement) titleElement.textContent = book.title;
                    if (summaryElement) summaryElement.textContent = book.plot;
                }
            });

            if (filteredBooks.length === 0) {
                console.log('Inga böcker matchade din sökning.');
            }
        });
    }
}


handleSearch();

function handleSearchAndDisplay(): void {
    const searchInput = document.querySelector<HTMLInputElement>('.my-input');
    const searchButton = document.querySelector<HTMLButtonElement>('.search-button');
    const infoSection = document.querySelector<HTMLElement>('.info');
    const infoTitle = document.querySelector<HTMLElement>('.upclose h3');
    const infoText = document.querySelector<HTMLElement>('.bookinfo');

    if (searchInput && searchButton && infoSection && infoTitle && infoText) {
        searchButton.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            const books = await fetchBooks();

           
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
            } else {
                alert('Ingen bok matchade din sökning.');
            }
        });
    }
}
handleSearchAndDisplay();