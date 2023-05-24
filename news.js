console.log("hello world")

//        ====== API ACCESS & Base URL====
        let url ="https://newsapi.org/v2/top-headlines?country=us&apiKey=b1b5a87a593a457ab58c3470d4ced8e9"
        let auth= "apiKey=b1b5a87a593a457ab58c3470d4ced8e9" //<<APIKEY needs to be hidden.
        let baseUrl= "https://newsapi.org/v2/"



//========ONLOAD -- WILL LIKELY NEED TO MOVE THIS ELSEWHERE=======

//        1.) Could just fetch with default url and run make newsBox will clear on submission
//        2.) But is the exact same function so only makes sense to call it and have the code written once
//        3.) So  Need to find the onLoad event handler.  so if ONLOAD get news, and pass in the url
//              but getNews has the url passed through getQueries... would need to wrap the if stmt around it,
//              but that seems inefficient.
//              This is why I tried to pass the getQueries as a parameter to return the url... but even so
//              as a callable function it would not be needed if just passing in a default url... that decision would still be in the et queries function

// Currently: GetNews calls GetQueries, and Fetch, then Fetch Calls NewsBox
// Need:  OnLoad Fetch and NewsBox, so GetNews and GetQueries aren't needed.
//              ... wrapt fetch>newsBox in its own function? does that make sense, fetch is its own function already.
//   ... yes it makes sense b/c it could be better encapsulated

// NEED TO REFACTOR CODE LATER.

let makeNews = (url)=>{
    fetch(url)
    .then(res=>res.json())
    .then(data=> {
        if (data.totalResults == 0)
            {alert("No Results Found")}

        articles= data.articles
        console.log(articles)
        articles.forEach((article, ind)=>{
            eval('news'+[ind]+' = new NewsBox(article.urlToImage, article.url, article.title, article.source.name, article.publishedAt)')
            eval('news'+[ind]+'.makeNews()')
        })
    })
    .catch(err=>console.log(`Error: ${err}`))
}

makeNews(url)
//====================== VARIABLE DECLARATIONS ========

let queryTopics = ""
let queryDateStart=""
let queryDateEnd=""
let sourceDomain=""
let domainUrl=""
let sourceUrl=""
let sortBy= ""  //<--- not adde yet: relevancy, popularity, pubslishedAt (Latest DateTime)
    //***     Additional Options to add LANGUAGE, PAGE SIZE, PAGENATION...

//============ DEFAULT DATES ==========
document.querySelectorAll('.Date').forEach((date)=>{date.defaultValue = new Date().toISOString().slice(0,10)})

//=========== SEARCHTYPE RADIO BUTTONS ========  1. Check which is checked.  2. If it is checked pass back the name value  3. Use the value of the  VALUE attribute to determine the URL

let searchTypeUrl ='top-headlines?'
let searchType= document.querySelector("input[name='TopOrAll']:checked").value // could just set to empty strings
console.log(searchType)

function getSearchType(){
    console.log('getSearchType Initiated')
    searchType= document.querySelector("input[name='TopOrAll']:checked").value

    if (searchType=='Search All') {
        return searchTypeUrl =  'everything?'
    }else{
        return searchTypeUrl=  'top-headlines?'
    }
}


//============NEW!!  - Not needed but should move the url reference to the back end.
 //=========ACTUALLYY NOT NEEDED, PUT THE URL IN THE DROP DOWN AND TRIM IT IN THE BACK END THIS IS A WASTE OF SPACE
 //DOMAIN SOURCE
//1.) Domain property doesn't exist for many articles. Need to use source. Need to create a function that returns the correct value.
//2.) Should this be a List  .. switch/case - how to populate. For now will do 3 manually.'

//3.) Code it like a Badie... lol get it started

let getDomainSource = ()=>{
   let domainSelection = $("#domain :selected")[0].innerText
   console.log(`domain Selection is: ${domainSelection}`)
   switch(domainUrl ){
   case "NPR":
    domainUrl ="npr.org"
    sourceUrl="npr"
    break;
   case "CNN":
    domainUrl ="cnn.com"
    sourceUrl="CNN"
    break;
   case "WSJ":
    domainUrl ="wsj.com"
    sourceUrl="WSJ"
    break;
   default:
    domainUrl=""
    sourceUrl=""
   }
  return (domainUrl, sourceUrl)
}



////========= URL MAKER ========
//let makeUrl = ()=>{
//    console.log("URL Creation initiated")
//    url= baseUrl+ searchTypeUrl +"q="+ queryNames['queryTopics'].replaceAll(" ", "%20")+ "&from="+ queryNames['queryDateStart'] + "&to="+ queryNames['queryDateEnd']+"&"+auth
//    console.log(url)
//    return url
//}

//============ ALL OTHER QUERY INPUTS========

let getQueries = ()=>{
    console.log("getQueries Initiated")

    searchType= getSearchType()
    console.log(searchType)

    domainUrl, sourceName = getDomainSource()
    console.log(getDomainSource())

    let queryNames={'queryTopics': "stuff", 'domainUrl':"stuff", 'queryDateStart':"stuff", 'queryDateEnd':"stuff"} //<--- THESE HAVE TO BE IN ORDER!!! Anyway to correct that?
    let gotQueries= document.querySelectorAll('.GetQuery')

    if (gotQueries.length!= Object.keys(queryNames).length){
        alert( "ERROR! Check number of queryName variables!")
    }

    for(let i =0; i< gotQueries.length; i++ ){
        for (key in queryNames){
            queryNames[key]= gotQueries[i].value
             i++  //<-- NOTE: Where the incrementor is placed matters, if placed inside the inner loop executes once, if placed outside the inner loops completes first, then the loop repeats!
        }
    }
    console.log(queryNames)
      /// Need if statement to test for defaults, but default values are not empty...
                // ** Solution! Just set change value attr to defaultValue in the html!
    console.log("URL Creation initiated")
    console.log(domainUrl)
    url= baseUrl+ searchTypeUrl +"q="+ queryNames['queryTopics'].replaceAll(" ", "%20")+ "&domains="+queryNames['domainUrl']+"&from="+ queryNames['queryDateStart'] + "&to="+ queryNames['queryDateEnd']+"&"+auth
        //^ NEED TO ADD BACK DOMAINURL AFTER TESTING
    console.log(url)
    return url
}



console.log(getQueries())
//============ MAKE NEWS BOX ==========
class NewsBox {
    constructor(headlineImg, headlineUrl, headline, headlineSource,headlineDate){
        this.headlineImg= headlineImg
        this.headline = headline
        this.headlineSource= headlineSource
        this.headlineDate=headlineDate
        this.headlineUrl = headlineUrl
    }

    makeNews = ()=>{
        console.log("initiated MakeNews")
        $('.newsContainer').append(
            $('<div>', {class:'newsBox'}).append([
                $('<img>', {class:'headline-img', src: this.headlineImg }),
                $('<span>', {class:'headline-source', text: this.headlineSource}),
                $('<span>', {class:'headline-date', text: this.headlineDate}),
                $('<a>',{class: 'headlineUrl', href: this.headlineUrl}).append(
                $('<h3>', {class:'headline', text: this.headline}))
               
                ])
        )
    }
//NEED TO MAKE SURE THE ELEMENT VARIABLES ARE SCOPED FOR THE ENTIRE OBJECT AND CAN BE USED OUTSIDE OF THEIR FUNCTION

}

//============= Test Make News Box ===================
//        const news1 = new NewsBox('test1', 'test2', 'test3', 'test4')
//        news1.makeNews()
//        console.log(news1.headline)
//

//======================  API CALL ONLOAD........

fetch(url)
 .then(res=>res.json)
 .then(data=>console.log(data)
 )
 .catch(err=>`ERROR ${err}`)



//=============== API CALL FOR CLICK EVENT ===========================
let getNews = ()=>{
    $('.newsBox').remove()
    url=getQueries()
    console.log(url)
    fetch(url)
    .then(res=>res.json())
    .then(data=> {
        console.log(data)

        articles= data.articles
        if (data.totalResults == 0)
            {alert("No Results Found")}

        console.log(articles)
        articles.forEach((article, ind)=>{
            eval('news'+[ind]+' =new NewsBox(article.urlToImage, article.url, article.title, article.source.name, article.publishedAt)')
            eval('news'+[ind]+'.makeNews()')
        })
    })

    .catch(err=>console.log(`Error: ${err}`))
}

document.querySelector('.submitQuery').addEventListener('click', getNews)

//==========Test URL CREATOR====
//Does it make sense to separate URL maker???


//
//getNews(getQueries)

//url=
//console.log(url)
//
//    console.log(searchTypeUrl)


//onClick - Get Query/Make URL/ GET NEWS/ MAKE BOX


// ******* WILL NEED TO LOOP THROUGH ARTICLE OBJECT....
//---------------------

//======= NEED TO FIX AND TEST THIS====
/*articles.forEach((val, ind)=>{
    let params = [articles[i].urlToImage, articles[i].title, articles[i].source.name, article[i].publishedAt.slice(0,10)]
    const news[i] = new NewsBox(params)
    news [i].makeNews()
})
*/


//========   Make NewsBox Class Factory ===============================
            // 1. Pass Article data into variables
            // 2. Create html elements to make newsBox holder
            // 3. Populate the newsBox html with data from  variables... why not just populate with data directly


//========   Make URL====================
//**************  MAY WANT TO CONSIDER AUTO POPULATING THE qryNames List with the ID Names from the DOM...., that would ensure that everythings always in the same order...
            //1. sets counter
            //2. for each key in the list of qryNames,
            //3. Set the VALUE of the KEY to the value of the value of the DOM element inside the 2nd array
            //4. Increment the counter INSIDE the 2nd loop to exit to outer for loop
            //5. Concatenates URL values