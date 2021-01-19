const quoteList = document.getElementById("quote-list")
const newQuoteForm = document.getElementById("new-quote-form")


init()

//fetch
function init() {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(response => response.json())
    .then(data => {
      renderAllQuotes(data)
    })
}




//functions
function likesCount(arry) {
    return arry.length
}



function renderAllQuotes(quoteArr) {
    quoteArr.forEach(renderOneQuote)
}

function renderOneQuote(quoteObject) {
    const quoteLi = document.createElement("li")
    quoteLi.dataset.id = quoteObject.id
    quoteLi.className = "quote-card"
    fetch("http://localhost:3000/likes")
        .then(response => response.json())
        .then(likesArray => {
        const resultsArray = likesArray.filter((like) => like.quoteId == quoteObject.id)
        const likesCount = resultsArray.length
        
    quoteLi.innerHTML = `
    
    <blockquote class="blockquote">
      <p class="mb-0">${quoteObject.quote}</p>
      <footer class="blockquote-footer">${quoteObject.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${likesCount}</span></button>
      <button class='btn-danger'>Delete</button>
      <button class='btn-edit btn-secondary'>Edit</button>
    </blockquote>
  `
    quoteList.appendChild(quoteLi)
    })
}

function handleNewQuoteSubmit(event) {
    event.preventDefault();
    const newQuote = {
        quote: event.target.quote.value,
        author: event.target.author.value
    }
    
    fetch("http://localhost:3000/quotes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accepts: 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
        .then(resp => resp.json())
        .then(quoteObj => {
            renderOneQuote(quoteObj)
        })

}


function handleQuoteClick(event) {
    const card = event.target.closest(".quote-card")
    if (event.target.matches(".btn-danger")) {
        const id = card.dataset.id
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
    })
        .then(resp => resp.json())
        .then(data => { 
            // console.log(data)

        })
        card.remove()
    } else if (event.target.matches(".btn-success")){
        const button = event.target
        const id = card.dataset.id
        const likeSpan = button.querySelector("span")
        let likeCount = parseInt(likeSpan.textContent)
        likeCount++
        likeSpan.innerText = likeCount
        const clickLi = {
            quoteId: id
        }
        fetch(`http://localhost:3000/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(clickLi)
        })
            .then(resp => resp.json())
            .then(data => {
                // console.log(data)
            })
    } else if (event.target.matches(".btn-edit")) {
        const id = card.dataset.id
        const editFormBox = document.createElement('form')
        editFormBox.className = "edit-form"
        card.innerHTML = null
        editFormBox.innerHTML = `
            <form id="new-quote-form">
                <div class="form-group">
                <label for="new-quote">Quote</label>
                <input name="quote" type="text" class="form-control" id="new-quote" placeholder="Learn. Love. Code.">
                </div>
                <div class="form-group">
                <label for="Author">Author</label>
                <input name="author" type="text" class="form-control" id="author" placeholder="Flatiron School">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
            `
        card.appendChild(editFormBox)
        editFormBox.addEventListener("submit", function (event) {
            event.preventDefault()
            const updatedQuote = {
                quote: event.target.quote.value,
                author: event.target.author.value
            }

            fetch(`http://localhost:3000/quotes/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedQuote)
            })
                .then(resp => resp.json())
                .then(data => {
                    renderOneQuote(updatedQuote)
                })
        })
        
    }
}

    


//Event listeners 
newQuoteForm.addEventListener("submit", handleNewQuoteSubmit)
quoteList.addEventListener("click", handleQuoteClick)


