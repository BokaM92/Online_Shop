//variables
const hamMenu = document.getElementById('ham_menu'),
    navClose = document.querySelectorAll('.sidenav a'),
    mySidenav = document.getElementById('mySidenav'),
    cars = document.querySelectorAll('.cars'),
    advertisement = document.querySelectorAll('.advertisement'),
    brandsMenu = document.getElementById('brands'),
    formBrands = document.getElementById('myDropdown'),
    search = document.getElementById('search'),
    titles = document.querySelectorAll('.card h3'),
    searchInpt = document.getElementById('search-cars'),
    form = document.getElementById('form'),
    brandsStore = document.getElementById('brands_store'),
    tBody = document.querySelector('#cart-content tbody'),
    shoppingCart = document.getElementById('shopping-cart'),
    clearCartBtn = document.getElementById('clear-cart'),
    carNum = document.getElementById('car-number')

//listeners
eventListeners()

function eventListeners() {
    hamMenu.addEventListener('click', clickOpenSideNav),
        window.addEventListener('scroll', scrollHandler),
        brandsMenu.addEventListener('click', menuHandler),
        formBrands.addEventListener('click', formBrandsMenu),
        search.addEventListener('submit', searchHandler),
        form.addEventListener('submit', submitHandler),
        brandsStore.addEventListener('click', addCarToCart),
        shoppingCart.addEventListener('click', removeItemFromUI),
        clearCartBtn.addEventListener('click', clearCart)
}

//side nav
function clickOpenSideNav(ev) {
    if (ev.target.tagName.toLowerCase() === 'span') {
        mySidenav.append
        mySidenav.style.width = '250px'
    }
}

for (const close of navClose) {
    close.addEventListener('click', function (ev) {
        if (ev.target.tagName.toLowerCase() === 'a') {
            mySidenav.style.width = '0'
        }
    })
}

//scrollhandler
function scrollHandler() {
    let viewportHeight = window.innerHeight;
    cars.forEach(item => {
        if (item.getBoundingClientRect().top <= viewportHeight * 0.9) {
            item.style.opacity = 1;
        } else {
            item.style.opacity = 0.3;
        }
    })
    advertisement.forEach(item => {
        if (item.getBoundingClientRect().top <= viewportHeight * 0.8) {
            item.style.opacity = 1;
        } else {
            item.style.opacity = 0;
        }
    })
}

//brands menuhandler
function menuHandler(ev) {
    ev.preventDefault();
    if (ev.target.tagName.toLowerCase() !== 'span') {
        return
    }
    let target = ev.target.dataset.target;
    cars.forEach(item => {
        if (item.classList.contains(target)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
}

//brands menuhandler (mobile-view)
function formBrandsMenu(ev) {
    ev.preventDefault();
    if (ev.target.tagName.toLowerCase() !== 'a') {
        return
    }
    let target = ev.target.dataset.target;
    cars.forEach(item => {
        if (item.classList.contains(target)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
}

//searchhandler
function searchHandler(ev) {
    ev.preventDefault();
    let inptValue = searchInpt.value;
    if(inptValue.length > 0) {
        titles.forEach(item => {
            if(item.textContent.toLowerCase().includes(inptValue.toLowerCase())) {
                item.parentElement.parentElement.style.display = 'block'
            } else {
                item.parentElement.parentElement.style.display = 'none'
            }
            searchInpt.value = ''
        })
    } else {
        alert("You must put at least one charachter")
    }
}

//cart
function cartText(cars) {
    let cartContent;
    if(cars.length === 0) {
        cartContent = 'Empty'
    } else if(cars.length === 1) {
        cartContent = '1 Item'
    } else {
        cartContent = `
        ${cars.length} items
        `
    }
    return cartContent
}

//addToCart
function addCarToCart(ev) {
    ev.preventDefault();
    if(ev.target.classList.contains('add-to-cart')) {
        let cars = getFromStorage('cars');
        let car = {
            id: ev.target.dataset.id,
            src: ev.target.parentElement.parentElement.querySelector('img').src,
            title: ev.target.parentElement.parentElement.querySelector('h3').textContent,
            price: ev.target.parentElement.parentElement.querySelector('.price').textContent
        }
        let check = cars.filter(item =>{
            return item.id === car.id
        });
        if(check.length !== 0) {
            alert("You have alrady selected this car")
            return
        } else {
            cars.push(car)
            setToStorage(car)
            addCar(cars)
        }
    } else {
        return
    }
}

function cartUI(car) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td><img src="${car.src}" alt="${car.title}" width="100"></td>
    <td>${car.title}</td>
    <td>${car.price}</td>
    <td><button class="remove" data-id="${car.id}">X</button></td>
    `
    tBody.appendChild(tr);
}

function addCar(cars) {
    removeAllFromCart(tBody.children)
    cars.forEach(item =>{
        cartUI(item)
    });

    const cartContent = cartText(cars);
    carNum.textContent = cartContent
}

//removeFromCart
function removeItem(id) {
    const cars = getFromStorage('cars');
    const filteredCars = cars.filter(item => {
        return item.id !== id
    })
    localStorage.setItem('cars', JSON.stringify(filteredCars))
}

function removeItemFromUI(ev) {
    ev.preventDefault();
    if(ev.target.classList.contains('remove')) {
        ev.target.parentElement.parentElement.remove();
        removeItem(ev.target.dataset.id);

        const cars = getFromStorage('cars');
        const cartContent = cartText(cars);
        carNum.textContent = cartContent
    } else{
        return
    }
}

function clearCart(ev) {
    ev.preventDefault();
    removeAllFromCart(tBody.children);
    removeFromStorage('cars');

    const cars = getFromStorage('cars');
    const cartContent = cartText(cars);
    carNum.textContent = cartContent
}

function removeFromStorage(storage) {
    localStorage.removeItem(storage)
}

function removeAllFromCart(childs) {
    Array.from(childs).forEach(item =>{
        item.remove()
    })
}

//submitHandler Contact form
function submitHandler(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name',document.getElementById('name').value)
    formData.append('email',document.getElementById('email').value)
    formData.append('msg',document.getElementById('msg').value)
    console.log([...formData])
}

//storage
function getFromStorage(cars) {
    let storage;
    if(localStorage.getItem(cars) === null) {
        storage = []
    } else {
        storage = JSON.parse(localStorage.getItem(cars))
    }
    return storage
}

function setToStorage(car) {
    let cars = getFromStorage('cars');
    cars.push(car);
    localStorage.setItem('cars', JSON.stringify(cars))
}

