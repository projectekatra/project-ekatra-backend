const fs = require('fs');
let rawdata = fs.readFileSync('./utils/embeddings.json');
let embeddings = JSON.parse(rawdata);

function add(array1,array2)
{
  for(var i=0; i<array1.length;i++)
  {
    array1[i]+=array2[i]
  }
  return array1
}

function getEmbeddingSentence(sentence){
  sentence = sentence.toLowerCase()
  sentence = sentence.replace(/[^a-zA-Z ]/g, "")
  sentence = sentence.split(" ")
  var array= new Array(300).fill(0);
  sentence.forEach((item, i) => {
    if(embeddings[item])
    array = add(array,embeddings[item])
  });
  return array;
}



function cosine_similarity(array1,array2){
  var dot=0;
  var norm1 = 0;
  var norm2 = 0;
  for(var i=0;i<array1.length;i++)
  {
    dot+=array1[i]*array2[i]
    norm1+=array1[i]*array1[i]
    norm2+=array2[i]*array2[i]
  }
  if(norm1===0||norm2===0)
  return 0;
  else
  return dot/(Math.sqrt(norm1)*Math.sqrt(norm2))
}

function Recommender(resources,id){
var description = resources.filter(x=>x.id===id)[0].description
var remaining = resources.filter(x=>x.id!==id)
var sentence_embed = getEmbeddingSentence(description)
var remaining_added = remaining.map(x=>{
  var temp_embed = getEmbeddingSentence(x.description);
  var cosine = cosine_similarity(sentence_embed,temp_embed)
  x.cosine = cosine
  return x;
})
return remaining_added.sort((a, b) => (a.cosine > b.cosine) ? -1 : 1)
}


function Search(resources,search_string){
var remaining = resources
var sentence_embed = getEmbeddingSentence(search_string)
var remaining_added = remaining.map(x=>{
  var temp_embed = getEmbeddingSentence(x.description);
  var cosine = cosine_similarity(sentence_embed,temp_embed)
  x.relevance = cosine
  return x;
})
return remaining_added.sort((a, b) => (a.relevance > b.relevance) ? -1 : 1)
}

function Searching(resources, Search_string)
{
   if(Search_string===undefined)
   {
      return resources.sort((a, b) => (a.visited > b.visited) ? -1 : 1)
   } 
   else
   {
       return Search(resources, Search_string).slice(0,7)
   }
}

exports.Recommender = Recommender;
exports.Searching = Searching;
