const earthNowObj = {}
earthNowObj.apiKey = 'api_key=qlz0oRxjRfsTf4bFs7tVdxnnenlpdpuC6p8wwhLM'
earthNowObj.todayDate = null
earthNowObj.currentDate = null
earthNowObj.currentDataList = null
earthNowObj.currentDataView = null
earthNowObj.currentView = null
earthNowObj.firstDate = new Date('June 15 1995 12')

//separate into dateData, viewData

earthNowObj.getFetch = async function(url){
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data
    }catch(error){
        console.warn(error)
    }
}
earthNowObj.addPageLinks = function(){
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
earthNowObj.updatePageInfo = function(){
    const imgMain = document.querySelector('.img-main')
    const imgLink = document.querySelector('.img-link')
    const viewDate = document.querySelector('.arrow-container .today-date')

    const dateElement = document.querySelector('.coords-content .date')
    const timeElement = document.querySelector('.coords-content .time')
    const latElement = document.querySelector('.coords-content .lat')
    const lonElement = document.querySelector('.coords-content .lon')

    const apiDateFormat = `${earthNowObj.currentDate.getFullYear()}/${String(earthNowObj.currentDate.getMonth() + 1).padStart(2, '0')}/${String(earthNowObj.currentDate.getDate()).padStart(2, '0')}`

    let currentViewUrl = `https://api.nasa.gov/EPIC/archive/natural/${apiDateFormat}/jpg/${this.currentDataView.image}.jpg?${this.apiKey}`
    imgMain.src = currentViewUrl
    imgLink.href = currentViewUrl
    viewDate.textContent = this.currentDataView.date.slice(0, 10)
    dateElement.textContent = `Date: ${this.currentDataView.date.slice(0, 10)}`
    timeElement.textContent = `Time: ${this.currentDataView.date.slice(11)}`
    latElement.textContent = `Lat: ${this.currentDataView.centroid_coordinates.lat}`
    lonElement.textContent = `Lon: ${this.currentDataView.centroid_coordinates.lon}`


}
earthNowObj.updatePageCalendar = async function(){
    const calendar = document.querySelector('.calendarInput')
    let date = calendar.value
    const apiLink = `https://api.nasa.gov/EPIC/api/natural/date/${date}?${this.apiKey}`
    tempDataList = await this.getFetch(apiLink)
    if (!this.isDateValid(tempDataList)) {
        return
    }
    this.updateObjData(tempDataList)
    console.log(this.currentDataList[this.currentView].date)
    this.updatePageInfo()
    this.createAllViewSections()
}
earthNowObj.isDateValid = function(currentData) {
    if (currentData.length === 0){
        this.displayError()
        return false
    }
    this.clearError()
    return true
}
earthNowObj.displayError = function(){
    let textBox = document.querySelector('.error')
    textBox.textContent = 'Error, something went wrong with that date. There may be no picture for that date.'
}
earthNowObj.clearError = function(){
    let textBox = document.querySelector('.error')
    textBox.textContent = ''
}
earthNowObj.updateObjData = function(tempDataList){
    this.currentDataList = tempDataList
    this.currentDataView = this.currentDataList[0]
    this.currentDate = new Date(this.currentDataList[0].date)
}
earthNowObj.createAllViewSections = function(){
    const viewHolder = document.querySelector('.view-holder')
    
    viewHolder.replaceChildren(...(this.createViewSectionArr()))
}
earthNowObj.createViewSectionArr = function(){
    const output = []
    for (let i = 0; i < this.currentDataList.length; i++){
        output.push(this.createViewSection(i))
    }
    return output
}
earthNowObj.createViewSection = function(index){
    const viewHolder = document.querySelector('.view-holder')

    const section = document.createElement('section')
    const aEle = document.createElement('a')
    const imgEle = document.createElement('img')
    const spanEle = document.createElement('span')

    const viewNum = index

    section.appendChild(aEle)
    section.classList.add(`view-${viewNum}`)
    if (section.classList.contains(`view-${this.currentView}`)){
        section.classList.add('active-view')
    }

    aEle.appendChild(imgEle)
    const apiDateFormat = `${earthNowObj.currentDate.getFullYear()}/${String(earthNowObj.currentDate.getMonth() + 1).padStart(2, '0')}/${String(earthNowObj.currentDate.getDate()).padStart(2, '0')}`
    imgEle.src = `https://api.nasa.gov/EPIC/archive/natural/${apiDateFormat}/jpg/${this.currentDataList[viewNum].image}.jpg?${this.apiKey}`
    imgEle.addEventListener('click', () => this.changeView(viewNum))
    
    section.appendChild(spanEle)
    spanEle.textContent = this.currentDataList[viewNum].date.slice(11)

    return section
}
earthNowObj.changeView = function(viewNum){
    const currentActiveSection = document.querySelector('.active-view')
    currentActiveSection.classList.remove('active-view')
    document.querySelector(`.view-${viewNum}`).classList.add('active-view')
    this.currentDataView = this.currentDataList[viewNum]
    this.currentView = viewNum
    this.updatePageInfo()
}
earthNowObj.main = async function(){
    const url = `https://api.nasa.gov/EPIC/api/natural/?${this.apiKey}`
    this.todayDate = new Date()
    this.currentView = 0
    tempDataList = await this.getFetch(url)
    this.updateObjData(tempDataList)
    this.addPageLinks()
    this.updatePageInfo()
    console.log(this.currentDataList)
    this.createAllViewSections()
}
earthNowObj.main()


// pseudocode:
// search /available for most recent
//     let mostRecent =
// let earthNowObj.data = getFetch(mostRecent)
//     let imgHref = earthNowObj.data[0].image

//     let apiDate = `${this.todayDate.getUTCFullYear()}-${this.todayDate.getUTCMonth() + 1}-${String(this.todayDate.getUTCDate()).padStart(2, '0')}`