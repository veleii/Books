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
    const searchInput = document.querySelector<HTMLInputElement>('.my-input');
    const searchButton = document.querySelector<HTMLButtonElement>('.search-button');
    const infoSection = document.querySelector<HTMLElement>('.info');
    const infoTitle = document.querySelector<HTMLElement>('.upclose h3');
    const infoText = document.querySelector<HTMLElement>('.bookinfo');

    if (searchInput && searchButton && infoSection && infoTitle && infoText) {
        const performSearch = async () => {
            const query = searchInput.value.trim();
            if (query) {
                const filteredBooks = await searchBooks(query);
                
                const book = filteredBooks.find(b => b.title.toLowerCase() === query.toLowerCase());
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
                } else {
                    infoTitle.textContent = 'Ingen matchning';
                    infoText.textContent = 'Det finns ingen bok som matchar din sökning.';
                }
                infoSection.style.display = 'block'; 
            }
        };
        
        searchButton.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
}
