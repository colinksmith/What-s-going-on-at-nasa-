const roverPhotosObj = {}
roverPhotosObj.apiKey = 'api_key=qlz0oRxjRfsTf4bFs7tVdxnnenlpdpuC6p8wwhLM'
roverPhotosObj.todaySol = null
roverPhotosObj.currentSol = null
roverPhotosObj.currentDataList = null
roverPhotosObj.currentDataSorted = null
roverPhotosObj.currentCamera = null
roverPhotosObj.currentPhoto = null
roverPhotosObj.currentPhotoIndex = null
roverPhotosObj.firstSol = 0

roverPhotosObj.getFetch = async function(url){
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data
    }catch(error){
        console.warn(error)
    }
}
roverPhotosObj.updateObjData = function(tempDataList){
    let latestOrPhotos = tempDataList.latest_photos || tempDataList.photos
    this.currentDataList = latestOrPhotos
    this.currentCamera = this.currentDataList[0].camera.name.toLowerCase()
    this.currentPhoto = this.currentDataList[0]
    this.sortCurrentData()

}
roverPhotosObj.addPageLinks = function(){
    const calendar = document.querySelector('.calendar')
    const leftArrow = document.querySelector('.left-arrow')
    const rightArrow = document.querySelector('.right-arrow')
    const leftArrowMonth = document.querySelector('.left-arrow-month')
    const rightArrowMonth = document.querySelector('.right-arrow-month')
    const leftArrowYear = document.querySelector('.left-arrow-year')
    const rightArrowYear = document.querySelector('.right-arrow-year')
    const randomButton = document.querySelector('.random')

    const leftImageSelection = document.querySelector('.left-image-selection')
    const rightImageSelection = document.querySelector('.right-image-selection')

    const fhaz = document.querySelector('.fhaz')
    const navcam = document.querySelector('.navcam')
    const mast = document.querySelector('.mast')
    const chemcam = document.querySelector('.chemcam')
    const mahli = document.querySelector('.mahli')
    const mardi = document.querySelector('.mardi')
    const rhaz = document.querySelector('.rhaz')


    calendar.addEventListener('click', () => this.updatePageByCalendar())
    leftArrow.addEventListener('click', () => this.updatePageInfoByButtonDay(-1))
    rightArrow.addEventListener('click', () => this.updatePageInfoByButtonDay(1)) 
    leftArrowMonth.addEventListener('click', () => this.updatePageInfoByButtonDay(-30))
    rightArrowMonth.addEventListener('click', () => this.updatePageInfoByButtonDay(30))
    leftArrowYear.addEventListener('click', () => this.updatePageInfoByButtonDay(-365))
    rightArrowYear.addEventListener('click', () => this.updatePageInfoByButtonDay(365))
    randomButton.addEventListener('click', () => this.updatePageByRandom())

    leftImageSelection.addEventListener('click', () => this.updateImageBy(-1))
    rightImageSelection.addEventListener('click', () => this.updateImageBy(1))

    fhaz.addEventListener('click', () => this.updateCameraTo('fhaz'))
    navcam.addEventListener('click', () => this.updateCameraTo('navcam'))
    mast.addEventListener('click', () => this.updateCameraTo('mast'))
    chemcam.addEventListener('click', () => this.updateCameraTo('chemcam'))
    mahli.addEventListener('click', () => this.updateCameraTo('mahli'))
    mardi.addEventListener('click', () => this.updateCameraTo('mardi'))
    rhaz.addEventListener('click', () => this.updateCameraTo('rhaz'))

}
roverPhotosObj.updatePageByCalendar = async function(){
    const calendar = document.querySelector('.calendarInput')
    let date = calendar.value || this.todayEarthDate
    console.log(date)
    const apiLink = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?${this.apiKey}&earth_date=${date}`
    tempDataList = await this.getFetch(apiLink)
    if (tempDataList.photos.length === 0){
        this.displayError()
        return
    } else {
        this.clearError()
    }
    console.log(tempDataList)
    this.updateObjData(tempDataList)
    this.updatePageInfo()
}
roverPhotosObj.updatePageInfoByButtonDay = async function(){

}
roverPhotosObj.updateImageBy = function(numberOfDays){
    if (this.currentPhotoIndex + numberOfDays < 0){
        this.displayError()
        return
    } else if (this.currentPhotoIndex + numberOfDays >= this.currentDataSorted[this.currentCamera].length){
        this.displayError()
        return
    } else {
        this.clearError()
    }
    this.currentPhotoIndex += numberOfDays
    this.currentPhoto = this.currentDataSorted[this.currentCamera][this.currentPhotoIndex]
    this.updatePageInfo()

}
roverPhotosObj.updateCameraTo = function(cameraSelection){
    if (!this.currentDataSorted[cameraSelection]){
        this.displayError()
        return
    }
    this.clearError()
    console.log('changing camera selection to ' + cameraSelection)
    this.currentCamera = cameraSelection
    this.appendPhotos()
}
roverPhotosObj.updatePageInfo = function(){
    const imgMain = document.querySelector('.img-main')
    const imgLink = document.querySelector('.img-link')
    const viewDate = document.querySelector('.arrow-container .today-date')

    const solElement = document.querySelector('.photo-content .sol')
    const dateElement = document.querySelector('.photo-content .earth-date')
    const cameraElement = document.querySelector('.photo-content .camera-selection')

    let currentPhotoSrc = this.currentPhoto.img_src
    imgMain.src = currentPhotoSrc
    imgLink.href = currentPhotoSrc
    viewDate.textContent = `Sol: ${this.currentPhoto.sol}`
    solElement.textContent = `Sol: ${this.currentPhoto.sol}`
    dateElement.textContent = `Earth date: ${this.currentPhoto.earth_date}`
    cameraElement.textContent = `Camera: ${this.currentPhoto.camera.full_name}`

    this.appendPhotos()
}
roverPhotosObj.updatePhoto = function(index){
    this.clearError()
    this.currentPhoto = this.currentDataSorted[this.currentCamera][index]
    this.currentPhotoIndex = index
    this.updatePageInfo()
}
roverPhotosObj.appendPhotos = function(){
    const photoHolder = document.querySelector('.photo-holder')
    photoHolder.replaceChildren(...(this.createPhotos()))
}
roverPhotosObj.createPhotos = function(){
    const output = []
    for (let i = 0; i < this.currentDataSorted[this.currentCamera].length; i++){
        output.push(this.createPhotoElement(i))
    }
    return output
}
roverPhotosObj.createPhotoElement = function(index){
    const section = document.createElement('section')
    const img = document.createElement('img')
    const span = document.createElement('span')

    const photoNum = index

    section.appendChild(img)
    section.classList.add(`photo-${index}`)
    img.src = this.currentDataSorted[this.currentCamera][photoNum].img_src
    img.addEventListener('click', () => this.updatePhoto(index))
    section.appendChild(span)
    span.textContent = index
    return section
}
roverPhotosObj.sortCurrentData = function(){
    this.currentDataSorted = {}
    this.currentDataList.forEach(element => {
        if (!this.currentDataSorted[element.camera.name.toLowerCase()]){
            this.currentDataSorted[element.camera.name.toLowerCase()] = []
        }
        this.currentDataSorted[element.camera.name.toLowerCase()].push(element)
    });
    console.log(this.currentDataSorted)
}
roverPhotosObj.displayError = function(){
    let textBox = document.querySelector('.error')
    textBox.textContent = 'Error, something went wrong with that selection. There may be no picture for that camera or date.'
}
roverPhotosObj.clearError = function(){
    let textBox = document.querySelector('.error')
    textBox.textContent = ''
}
roverPhotosObj.main = async function(){
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?${this.apiKey}`
    // const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=3676&${this.apiKey}`
    tempDataList = await this.getFetch(url)
    console.log(tempDataList)
    this.updateObjData(tempDataList)
    
    this.todaySol = this.currentDataList[0].sol
    this.todayEarthDate = this.currentDataList[0].earth_date
    this.addPageLinks()
    this.updatePageInfo()

}
roverPhotosObj.main()