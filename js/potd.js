const potdObj = {}
potdObj.apiKey = 'api_key=qlz0oRxjRfsTf4bFs7tVdxnnenlpdpuC6p8wwhLM'
potdObj.date = null
potdObj.getFetch = async function(url){
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data
    }catch(error){
        console.warn(error)
    }
}
potdObj.updatePageInfo = function(data){
    const imgMain = document.querySelector('.img-main')
    const imgLink = document.querySelector('.img-link')
    const potdText = document.querySelector('.potd-text')
    const potdTitle = document.querySelector('.potd-title')
    const potdDate = document.querySelector('.arrow-container .today-date')

    imgMain.src = data.hdurl
    imgLink.href = data.url
    potdText.textContent = data.explanation
    potdTitle.textContent = data.title
    potdDate.textContent = data.date
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
    const data = await this.getFetch(apiLink)
    this.updatePageInfo(data)
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

    const yesterdayData = await this.getFetch(yesterdayDataApiLink)

    this.updatePageInfo(yesterdayData)
}
potdObj.main = async function(){
    const url = `https://api.nasa.gov/planetary/apod?${this.apiKey}`
    let data = await this.getFetch(url)
    this.date = new Date(data.date)
    console.log(data)
    console.log(this.date)
    this.addPageLinks()
    this.updatePageInfo(data)


}
potdObj.main()
