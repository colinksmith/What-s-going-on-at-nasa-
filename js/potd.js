const potdObj = {}
potdObj.apiKey = 'api_key=qlz0oRxjRfsTf4bFs7tVdxnnenlpdpuC6p8wwhLM'
potdObj.date = null
potdObj.data = null
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
    const leftArrow = document.querySelector('.left-arrow')
    const rightArrow = document.querySelector('.right-arrow')
    const calendar = document.querySelector('.calendar')

    leftArrow.addEventListener('click', () => this.updatePageInfoButton('yesterday'))
    rightArrow.addEventListener('click', () => this.updatePageInfoButton('tomorrow')) 
    calendar.addEventListener('click', () => this.updatePageCalendar())
}
potdObj.updatePageCalendar = async function(){
    const calendar = document.querySelector('.calendarInput')
    let date = calendar.value
    const apiLink = `https://api.nasa.gov/planetary/apod?${this.apiKey}&date=${date}`
    this.data = await this.getFetch(apiLink)
    this.date = new Date(this.data.date)
    this.updatePageInfo()
}
potdObj.updatePageInfoButton = async function(parameter){
    let dayModifier = null
    switch (parameter){
        case 'tomorrow':
        case 1:
            dayModifier = 1
            break
        case 'yesterday':
        case -1:
            dayModifier = -1
            break
        default:
            console.log('something went wrong')
    }

    let currentDate = this.date
    currentDate.setDate(currentDate.getDate() + dayModifier)
    const yesterdayDateApiFormat = `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth() + 1}-${String(currentDate.getUTCDate()).padStart(2, '0')}`
    const yesterdayDataApiLink = `https://api.nasa.gov/planetary/apod?${this.apiKey}&date=${yesterdayDateApiFormat}`

    this.data = await this.getFetch(yesterdayDataApiLink)

    this.updatePageInfo()
    console.log(this.data)
}

potdObj.main = async function(){
    const url = `https://api.nasa.gov/planetary/apod?${this.apiKey}`
    this.data = await this.getFetch(url)
    this.date = new Date(this.data.date)
    this.addPageLinks()
    this.updatePageInfo()
}
potdObj.main()
