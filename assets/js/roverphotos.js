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
roverPhotosObj.prioritizeCameras = function(){
    const key = ['navcam', 'fhaz', 'rhaz', 'mast', 'chemcam', 'mahli', 'mardi']
    for (let i = 0; i < key.length; i++){
        if (this.currentDataSorted[key[i]]){
            return key[i]
        }
    }
}
roverPhotosObj.updateObjData = function(tempDataList){
    let latestOrPhotos = tempDataList.latest_photos || tempDataList.photos
    this.currentDataList = latestOrPhotos
    this.sortCurrentData()
    this.currentCamera = this.prioritizeCameras()
    this.currentPhotoIndex = 0
    this.currentPhoto = this.currentDataSorted[this.currentCamera][this.currentPhotoIndex]

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
    leftArrowYear.addEventListener('click', () => this.updatePageInfoByButtonDay(-355))
    rightArrowYear.addEventListener('click', () => this.updatePageInfoByButtonDay(355))
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
    const apiLink = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?${this.apiKey}&earth_date=${date}`
    tempDataList = await this.getFetch(apiLink)
    if (tempDataList.photos.length === 0){
        this.displayError()
        return
    } else {
        this.clearError()
    }
    this.updateObjData(tempDataList)
    this.updatePageInfo()
}
roverPhotosObj.updatePageInfoByButtonDay = async function(numberOfDays){
    let sol = this.currentDataList[0].sol
    sol = sol + numberOfDays
    const tempDataList = await this.keepFetching(numberOfDays, sol, 0)
    if (tempDataList.photos.length === 0){
        this.displayError()
        return
    } else {
        this.clearError()
    }
    this.updateObjData(tempDataList)
    this.updatePageInfo()
}
roverPhotosObj.updatePageByRandom = async function(){
    let sol = Math.floor(Math.random() * this.todaySol)
    const apiLink = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?${this.apiKey}&sol=${sol}`
    const tempDataList = await this.getFetch(apiLink)
    if (tempDataList.photos.length === 0){
        return this.updatePageByRandom()
    }
    this.clearError()
    this.updateObjData(tempDataList)
    this.updatePageInfo()
}
roverPhotosObj.keepFetching = async function(numberOfDays, sol, recursionCount){
    if (recursionCount >= 7){
        return {photos: []}
    }
    const modifier = numberOfDays > 0 ? 1 : -1
    modifiedSol = sol + modifier * recursionCount
    const apiLink = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?${this.apiKey}&sol=${modifiedSol}`
    const tempDataList = await this.getFetch(apiLink)
    if (tempDataList.photos.length === 0){
        return this.keepFetching(numberOfDays, sol, ++recursionCount)
    } else {
        return tempDataList
    }
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

    const fhazPhotoCount = document.querySelector('.fhaz span + span')
    const rhazPhotoCount = document.querySelector('.rhaz span + span')
    const navcamPhotoCount = document.querySelector('.navcam span + span')
    const mastPhotoCount = document.querySelector('.mast span + span')
    const chemcamPhotoCount = document.querySelector('.chemcam span + span')
    const mahliPhotoCount = document.querySelector('.mahli span + span')
    const mardiPhotoCount = document.querySelector('.mardi span + span')

    let currentPhotoSrc = this.currentPhoto.img_src
    imgMain.src = currentPhotoSrc
    imgLink.href = currentPhotoSrc
    viewDate.textContent = `Sol: ${this.currentPhoto.sol}`
    solElement.textContent = `Sol: ${this.currentPhoto.sol}`
    dateElement.textContent = `Earth date: ${this.currentPhoto.earth_date}`
    cameraElement.textContent = `Camera: ${this.currentPhoto.camera.full_name}`

    fhazPhotoCount.textContent = `(${this.currentDataSorted.fhaz ? this.currentDataSorted.fhaz.length : 0})`
    rhazPhotoCount.textContent = `(${this.currentDataSorted.rhaz ? this.currentDataSorted.rhaz.length : 0})`
    navcamPhotoCount.textContent = `(${this.currentDataSorted.navcam ? this.currentDataSorted.navcam.length : 0})`
    mastPhotoCount.textContent = `(${this.currentDataSorted.mast ? this.currentDataSorted.mast.length : 0})`
    chemcamPhotoCount.textContent = `(${this.currentDataSorted.chemcam ? this.currentDataSorted.chemcam.length : 0})`
    mahliPhotoCount.textContent = `(${this.currentDataSorted.mahli ? this.currentDataSorted.mahli.length : 0})`
    mardiPhotoCount.textContent = `(${this.currentDataSorted.mardi ? this.currentDataSorted.mardi.length : 0})`

    this.appendPhotos()
    
    const currentActiveSection = document.querySelector('.active-view')
    if (currentActiveSection){
        currentActiveSection.classList.remove('active-view')
    }
    document.querySelector(`.photo-${this.currentPhotoIndex}`).classList.add('active-view')
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
    img.alt = `Rover photo from ${this.currentCamera} camera, number ${photoNum + 1}`
    img.addEventListener('click', () => this.updatePhoto(index))
    section.appendChild(span)
    span.textContent = index + 1
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
    tempDataList = await this.getFetch(url)
    this.updateObjData(tempDataList)
    this.currentPhotoIndex = 0
    
    this.todaySol = this.currentDataList[0].sol
    this.todayEarthDate = this.currentDataList[0].earth_date
    this.addPageLinks()
    this.updatePageInfo()

}
roverPhotosObj.main()