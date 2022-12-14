const earthNowObj = {}
earthNowObj.apiKey = 'api_key=qlz0oRxjRfsTf4bFs7tVdxnnenlpdpuC6p8wwhLM'
earthNowObj.todayDate = null
earthNowObj.currentDate = null
earthNowObj.currentDataList = null
earthNowObj.currentDataView = null
earthNowObj.currentView = null
earthNowObj.firstDate = new Date('2015-06-13')
earthNowObj.validDates = null

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

    calendar.addEventListener('click', () => this.updatePageByCalendar())
    leftArrow.addEventListener('click', () => this.updatePageInfoByButtonDay(-1))
    rightArrow.addEventListener('click', () => this.updatePageInfoByButtonDay(1)) 
    leftArrowMonth.addEventListener('click', () => this.updatePageInfoByButtonDay(-30))
    rightArrowMonth.addEventListener('click', () => this.updatePageInfoByButtonDay(30))
    leftArrowYear.addEventListener('click', () => this.updatePageInfoByButtonDay(-365))
    rightArrowYear.addEventListener('click', () => this.updatePageInfoByButtonDay(365))
    randomButton.addEventListener('click', () => this.updatePageByRandom())

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

    if (this.currentView >= this.currentDataList.length) {
        this.currentView = this.currentDataList.length - 1
        this.currentDataView = this.currentDataList[this.currentView]
    }

    let currentViewUrl = `https://api.nasa.gov/EPIC/archive/natural/${apiDateFormat}/jpg/${this.currentDataView.image}.jpg?${this.apiKey}`
    imgMain.src = currentViewUrl
    imgLink.href = currentViewUrl
    viewDate.textContent = this.currentDataView.date.slice(0, 10)
    dateElement.textContent = `Date: ${this.currentDataView.date.slice(0, 10)}`
    timeElement.textContent = `Time: ${this.currentDataView.date.slice(11)}`
    latElement.textContent = `Lat: ${this.currentDataView.centroid_coordinates.lat}`
    lonElement.textContent = `Lon: ${this.currentDataView.centroid_coordinates.lon}`
}
earthNowObj.updatePageInfoByButtonDay = async function(numberOfDays){
    let tempDate = new Date(this.currentDate.getTime())
    tempDate.setDate(tempDate.getDate() + numberOfDays)
    if (!this.isDateValid(tempDate)) {
        return
    }
    const validFormattedDate = this.getValidDate(tempDate, numberOfDays)
    const apiLink = `https://api.nasa.gov/EPIC/api/natural/date/${validFormattedDate}?${this.apiKey}`
    tempDataList = await this.getFetch(apiLink)
    this.updateObjData(tempDataList)
    this.updatePageInfo()
    this.createAllViewSections()
}
earthNowObj.updatePageByCalendar = async function(){
    const calendar = document.querySelector('.calendarInput')
    let date = calendar.value
    console.log(date)
    const apiLink = `https://api.nasa.gov/EPIC/api/natural/date/${date}?${this.apiKey}`
    tempDataList = await this.getFetch(apiLink)
    if (!this.isDateValid(tempDataList)) {
        return
    }
    this.updateObjData(tempDataList)
    this.updatePageInfo()
    this.createAllViewSections()
}
earthNowObj.updatePageByRandom = async function(){
    let formattedDate = this.validDates[Math.floor(Math.random() * this.validDates.length)].date
    console.log(formattedDate)
    const apiLink = `https://api.nasa.gov/EPIC/api/natural/date/${formattedDate}?${this.apiKey}`
    tempDataList = await this.getFetch(apiLink)
    if (!this.isDateValid(tempDataList)) {
        return
    }
    this.updateObjData(tempDataList)
    this.currentView = Math.floor(Math.random() * this.currentDataList.length)
    this.updatePageInfo()
    this.createAllViewSections()
}
earthNowObj.isDateValid = function(tempDate) {
    if (tempDate - new Date(this.validDates[0].date) > 0){
        displayError()
        return false
    } else if (this.firstDate - tempDate > 0){
        displayError()
        return false
    }
    clearError()
    return true

    function displayError(){
        let textBox = document.querySelector('.error')
        textBox.textContent = 'Error, something went wrong with that date. There may be no picture for that date.'
    }
    function clearError(){
        let textBox = document.querySelector('.error')
        textBox.textContent = ''
    }
}
earthNowObj.updateObjData = function(tempDataList){
    this.currentDataList = tempDataList
    this.currentDataView = this.currentDataList[this.currentView]
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
    imgEle.alt = `View of the Earth #${viewNum + 1}, from the time: ${this.currentDataList[viewNum].date.slice(11)}`
    imgEle.addEventListener('click', () => this.changeView(viewNum))
    
    section.appendChild(spanEle)
    spanEle.textContent = this.currentDataList[viewNum].date.slice(11)

    return section
}
earthNowObj.changeView = function(viewNum){
    const currentActiveSection = document.querySelector('.active-view')
    if (currentActiveSection){
        currentActiveSection.classList.remove('active-view')
    }
    document.querySelector(`.view-${viewNum}`).classList.add('active-view')
    this.currentDataView = this.currentDataList[viewNum]
    this.currentView = viewNum
    this.updatePageInfo()
}
earthNowObj.getValidDate = function(tempDate, numberOfDays){
    let tomorrowOrYesterday = numberOfDays > 0 ? 1 : -1
    // let tempDate = new Date(this.currentDate.getTime())
    let targetDateFormat = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(tempDate.getDate()).padStart(2, '0')}`
    const currentDateFormat = `${this.currentDate.getFullYear()}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(this.currentDate.getDate()).padStart(2, '0')}`
    while (!this.validDates.filter(ele => ele.date === targetDateFormat).length){
        tempDate.setDate(tempDate.getDate() + tomorrowOrYesterday)
        targetDateFormat = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(tempDate.getDate()).padStart(2, '0')}`
    }
    console.log(this.currentDate)
    console.log(targetDateFormat, currentDateFormat)
    return targetDateFormat
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
    this.changeView(this.currentView)
    this.validDates = await this.getFetch(`https://api.nasa.gov/EPIC/api/natural/all?${this.apiKey}`)
    // console.log(this.getValidDate(-1))
}
earthNowObj.main()

//trivialTest