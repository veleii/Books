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

                // Lägg till click event för varje bok
                covers[index].addEventListener('click', () => {
                    const infoTitle = document.querySelector<HTMLElement>('.upclose h3');
                    const infoText = document.querySelector<HTMLElement>('.bookinfo');
                    const infoSection = document.querySelector<HTMLElement>('.info');

                    if (infoTitle && infoText && infoSection) {
                        // Uppdatera innehållet med bokens information
                        infoTitle.textContent = book.title;
                        infoText.textContent = `
                            Författare: ${book.author}
                            Förlag: ${book.publisher}
                            År: ${book.year}
                            Antal sidor: ${book.pages}
                            
                            ${book.plot}
                            
                            Målgrupp: ${book.audience}
                        `;
                        
                        // Visa info-sektionen
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