const roverPhotosObj = {}
roverPhotosObj.apiKey = 'api_key=qlz0oRxjRfsTf4bFs7tVdxnnenlpdpuC6p8wwhLM'
roverPhotosObj.todaySol = null
roverPhotosObj.currentSol = null
roverPhotosObj.currentDataList = null
roverPhotosObj.currentCamera = null
roverPhotosObj.currentPhoto = null
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
    this.currentDataList = tempDataList
    this.currentCamera = this.currentDataList.latest_photos[0].camera.name
    console.log(this.currentCamera)
}
roverPhotosObj.addPageLinks = function(){
    console.log('added page links')
}
roverPhotosObj.updatePageInfo = function(){
    console.log('updated page info')
}
roverPhotosObj.createAllViewSections = function(){
    console.log('created view section')
}
roverPhotosObj.changeView = function(){
    console.log('changed view')
}
roverPhotosObj.main = async function(){
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?${this.apiKey}`
    tempDataList = await this.getFetch(url)
    console.log(tempDataList)
    this.updateObjData(tempDataList)
    this.todaySol = this.currentDataList.latest_photos[0].sol
    this.addPageLinks()
    this.updatePageInfo()
    this.createAllViewSections()
    this.changeView(this.currentView)
    this.validDates = await this.getFetch(`https://api.nasa.gov/EPIC/api/natural/all?${this.apiKey}`)
}
roverPhotosObj.main()