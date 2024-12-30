/* Detta är min main modul */
import {fetchBooks} from "./api.js";
import {searchBooks, handleSearch} from "./search.js";

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
handleSearch();

