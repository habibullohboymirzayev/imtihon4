"use strict";

const elForm = document.querySelector("#form")
const elSearchInput = document.querySelector("#search_input")
const elShowingResult = document.querySelector("#showing__result")
const elOrderByNewst = document.querySelector("#order_by_newst")
const elBookmarkListGroap = document.querySelector("#bookmark_list_grop")
const elWrapper = document.querySelector("#wrapper")
const elBooksModal = document.querySelector(".books__modal")
const elLogut = document.querySelector(".logout-btn")

const elWrapperTemplate = document.querySelector(".wrapper-templale").content
const elBookmarkTemplate = document.querySelector(".bookmark-temlate").content

//-----------------------------------------------------------------------------
const token = window.localStorage.getItem("token");

if (!token) {
    window.location.replace("index.html")
}

elLogut.addEventListener("click", function () {
    window.localStorage.removeItem("token")
    window.location.replace("index.html")

})

// renser books
function renderBooks(data, wrapper) { 
    setTimeout(function () {
        wrapper.innerHTML = null;
        let booksFragment = document.createDocumentFragment()
        
        data.forEach(item => {
            let booksTemplate = elWrapperTemplate.cloneNode(true)
            
            booksTemplate.querySelector("#card-img-top").src = item.volumeInfo.imageLinks.smallThumbnail
            booksTemplate.querySelector("#card-title").textContent = item.volumeInfo.title
            booksTemplate.querySelector("#card-text").textContent = item.volumeInfo.authors
            booksTemplate.querySelector("#card-year").textContent = item.volumeInfo.publishedDate
            booksTemplate.querySelector("#read__btn").href = item.volumeInfo.previewLink
            booksTemplate.querySelector("#info__btn").dataset.booksForModal = item.id
            booksTemplate.querySelector("#bookmark__btn").dataset.booksForBookmark = item.id
            
            booksFragment.appendChild(booksTemplate)
        });
        
        wrapper.appendChild(booksFragment)
        
        elShowingResult.textContent = data.length
    },1000)
    
} 

// async function
let getBooksData =  async function() {
    
    const recust = await fetch(`https://www.googleapis.com/books/v1/volumes?q=python`)
    const data = await recust.json()
    const result = data.items
    if (result.length > 0) {
        renderBooks(result,elWrapper)
    }
}
getBooksData()

// search books 
elForm.addEventListener("submit", function (evt) {
    evt.preventDefault()
    
    let searchValue = elSearchInput.value.trim()
    elSearchInput.value = null
    
    let getBooksData =  async function() {
        
        const recust = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}`)
        const data = await recust.json()
        const result = data.items
        if (result.length > 0) {
            renderBooks(result,elWrapper)
        }
    }
    getBooksData()
})


// order by newst
elOrderByNewst.addEventListener("click", function () {
    let getBooksData =  async function() {
        
        const recust = await fetch(`https://www.googleapis.com/books/v1/volumes?q=python&orderBy=newest`)
        const data = await recust.json()
        const result = data.items
        if (result.length > 0) {
            renderBooks(result,elWrapper)
        }
    }
    getBooksData()
})




// books bookmark
const localBooks = JSON.parse(window.localStorage.getItem("books"))

let saveBookmark =localBooks || []
console.log(saveBookmark);

elWrapper.addEventListener("click", function (evt) {
    if (evt.target.matches("#bookmark__btn")) {
        let booksId = evt.target.dataset.booksForBookmark
        let getBooksData =  async function() {
            
            const recust = await fetch(`https://www.googleapis.com/books/v1/volumes/${booksId}`)
            const data = await recust.json()
            const result = data.volumeInfo
            if (!saveBookmark.includes(booksId)) {
                saveBookmark.push(result) 
                window.localStorage.setItem("books",JSON.stringify(saveBookmark))
            }
            renderBookmark(saveBookmark,elBookmarkListGroap)      
            
        }
        getBooksData()
    }
})

// render bookmark
const renderBookmark = function(array , wrapper) {
    wrapper.innerHTML = null
    let bookmarkFragment = document.createDocumentFragment()
    
    array.forEach(item => {
        let bookmarkTemplate = elBookmarkTemplate.cloneNode(true)
        
        bookmarkTemplate.querySelector("#bookmark__title").textContent = item.title
        bookmarkTemplate.querySelector("#bookmark__text").textContent = item.authors
        bookmarkTemplate.querySelector("#bookmark__link").href = item.previewLink
        bookmarkTemplate.querySelector("#bookmark__delate").dataset.bookmarkDelateBtn = item.id
        
        bookmarkFragment.appendChild(bookmarkTemplate)
    })
    
    wrapper.appendChild(bookmarkFragment)
}

renderBookmark(localBooks,elBookmarkListGroap)

// delate bookmark
elBookmarkListGroap.addEventListener("click", function (evt) {
    if (evt.target.matches("#bookmark__delate")) {
        
        const bookmarkDelate = evt.target.dataset.bookmarkDelateBtn
        const findBookmark = saveBookmark.findIndex(bookmark => bookmark.id === bookmarkDelate)
        
        
        saveBookmark.splice(findBookmark,1)
        elBookmarkListGroap.innerHTML = null
        window.localStorage.setItem("books",JSON.stringify(saveBookmark))
        
        renderBookmark(saveBookmark,elBookmarkListGroap)      
        
    }
})


// books modal 

elWrapper.addEventListener("click", function (evt) {
    
    let bookInfoBtn = evt.target.dataset.booksForModal
    
    if (bookInfoBtn) {
        let getBooksData =  async function() {
            
            const recust = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookInfoBtn}`)
            const data = await recust.json()
            const result = data.volumeInfo
            
            elBooksModal.querySelector(".modal-title").textContent = result.title
            elBooksModal.querySelector(".modal-img").src = result.imageLinks.smallThumbnail
            elBooksModal.querySelector(".modal-body").textContent = result.description
            elBooksModal.querySelector(".modal_author").textContent = result.authors
            elBooksModal.querySelector(".modal_published").textContent = result.publishedDate
            elBooksModal.querySelector(".modal_publishers").textContent = result.publisher
            elBooksModal.querySelector(".modal_categories").textContent = result.categories.split()
            elBooksModal.querySelector(".modal_count").textContent = result.pageCount
        }
        getBooksData()
        
        
    }
    
    
})




