/* Denna modul hanterar mitt inputfält och sök knappen */
import {Book} from "./interface.js";
import {fetchBooks} from "./api.js";

export async function searchBooks(query: string): Promise<Book[]> {
    const books = await fetchBooks();
    return books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase())
    );
}

export function handleSearch(): void {
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

export function handleSearchAndDisplay(): void {
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