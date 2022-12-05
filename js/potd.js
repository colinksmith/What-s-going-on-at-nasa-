const potdObj = {}
potdObj.apiKey = 'api_key=qlz0oRxjRfsTf4bFs7tVdxnnenlpdpuC6p8wwhLM'
potdObj.todayDate = null
potdObj.date = null
potdObj.data = null
potdObj.firstDate = new Date('June 15 1995 12')
potdObj.getFetch = async function(url){
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data
    }catch(error){
        console.warn(error)
    }
}
potdObj.updatePageInfo = function(){
    const imgMain = document.querySelector('.img-main')
    const imgLink = document.querySelector('.img-link')
    const potdText = document.querySelector('.potd-text')
    const potdTitle = document.querySelector('.potd-title')
    const potdDate = document.querySelector('.arrow-container .today-date')
    const vid = document.querySelector('iframe')


    potdText.textContent = this.data.explanation
    potdTitle.textContent = this.data.title
    potdDate.textContent = this.data.date

    if (this.data.media_type === "video") {
        vid.classList.add('active-media')
        vid.classList.remove('hidden-media')
        imgMain.classList.remove('active-media')
        imgMain.classList.add('hidden-media')

        vid.src = this.data.url
    } else if (this.data.media_type === "image"){
        vid.classList.remove('active-media')
        vid.classList.add('hidden-media')
        imgMain.classList.add('active-media')
        imgMain.classList.remove('hidden-media')

        imgMain.src = this.data.hdurl
        imgLink.href = this.data.url
    }
}

potdObj.addPageLinks = function(){
    const calendar = document.querySelector('.calendar')
    const leftArrow = document.querySelector('.left-arrow')
    const rightArrow = document.querySelector('.right-arrow')
    const leftArrowMonth = document.querySelector('.left-arrow-month')
    const rightArrowMonth = document.querySelector('.right-arrow-month')
    const leftArrowYear = document.querySelector('.left-arrow-year')
    const rightArrowYear = document.querySelector('.right-arrow-year')
    const randomButton = document.querySelector('.random')

    calendar.addEventListener('click', () => this.updatePageCalendar())
    leftArrow.addEventListener('click', () => this.updatePageInfoButtonDay(-1))
    rightArrow.addEventListener('click', () => this.updatePageInfoButtonDay(1)) 
    leftArrowMonth.addEventListener('click', () => this.updatePageInfoButtonDay(-30))
    rightArrowMonth.addEventListener('click', () => this.updatePageInfoButtonDay(30))
    leftArrowYear.addEventListener('click', () => this.updatePageInfoButtonDay(-365))
    rightArrowYear.addEventListener('click', () => this.updatePageInfoButtonDay(365))
    randomButton.addEventListener('click', () => this.updatePageRandom())

}
potdObj.updatePageCalendar = async function(){
    const calendar = document.querySelector('.calendarInput')
    let date = calendar.value
    const apiLink = `https://api.nasa.gov/planetary/apod?${this.apiKey}&date=${date}`
    this.data = await this.getFetch(apiLink)
    let newDate = new Date(this.data.date)
    if (!this.isDateValid(newDate)) {
        return
    }
    this.date = newDate
    this.updatePageInfo()
}
potdObj.updatePageInfoButtonDay = async function(dayModifier){
    let currentDate = new Date(this.date.valueOf())
    currentDate.setDate(currentDate.getDate() + dayModifier)
    if (!this.isDateValid(currentDate)) {
        return
    }
    const yesterdayDateApiFormat = `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth() + 1}-${String(currentDate.getUTCDate()).padStart(2, '0')}`
    const yesterdayDataApiLink = `https://api.nasa.gov/planetary/apod?${this.apiKey}&date=${yesterdayDateApiFormat}`

    this.data = await this.getFetch(yesterdayDataApiLink)
    this.date = currentDate
    this.updatePageInfo()
}
potdObj.updatePageRandom = async function(){
    apiLink = `https://api.nasa.gov/planetary/apod?${this.apiKey}&date=${this.getRandomDate()}`
    let currentData = await this.getFetch(apiLink)
    if(currentData.code === 404 || currentData.code === 400){
        this.updatePageRandom()
        return
    }
    this.data = currentData
    this.date = currentData.date
    this.updatePageInfo()
}
potdObj.getRandomDate = function(){
    let date, month, year
    let today = new Date()
    let yearDiff = today.getUTCFullYear() - 1995
    date = Math.ceil(Math.random() * 31)
    month = Math.ceil(Math.random() * 12)
    year = Math.ceil(Math.random() * yearDiff + 1995)

    date = String(date).padStart(2, 0)
    month = String(month).padStart(2, 0)

    return `${year}-${month}-${date}`
}
potdObj.isDateValid = function(currentDate) {

    if (!(currentDate - this.todayDate <= 0)){
        this.displayError()
        return false
    } else if (!(currentDate - this.firstDate >= 0)){
        this.displayError()
        return false
    }
    this.clearError()
    return true
}
potdObj.displayError = function(){
    let textBox = document.querySelector('.error')
    textBox.textContent = 'Error, something went wrong with that date. There may be no picture for that date.'
}
potdObj.clearError = function(){
    let textBox = document.querySelector('.error')
    textBox.textContent = ''
}
potdObj.main = async function(){
    const url = `https://api.nasa.gov/planetary/apod?${this.apiKey}`
    this.data = await this.getFetch(url)
    this.date = new Date(this.data.date)
    this.todayDate = new Date(this.date.valueOf())
    this.addPageLinks()
    this.updatePageInfo()
    console.log(this.firstDate)
}
potdObj.main()
