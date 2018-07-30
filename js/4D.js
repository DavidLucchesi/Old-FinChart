//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------DECLARE--------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//

//Déclaration des variables
var totalPonderation = 0; 
var continentalPonderation = [];
var detailP = [];
var detailG = [];
var centralValue = 0;
var continentsNameList = [];
var sectorsInContinent = [];
var sectorsNameList = [];
var maxAbsolueValueG = 0;
var lineValue = 0 ;
var line1Value = 0;
var line2Value = 0;
var line3Value = 0;
var sentence1 = "Portfolio Equity";
var sentence2 = "Performance YTD";
var jsonFile="";
var obj="";


//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------INITIALIZE-----------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//


//Initialize
function initialize(){
	totalPonderation = 0; 
	continentalPonderation = [];
	detailP = [];
	detailG = [];
	centralValue = 0;
	continentsNameList = [];
	sectorsInContinent = [];
	sectorsNameList = [];
	maxAbsolueValueG = 0;
	lineValue = 0 ;
	line1Value = 0;
	line2Value = 0;
	line3Value = 0;
	sentence1 = "Portfolio Equity";
	sentence2 = "Performance YTD";
}

//Function calculating everything and setting the variables
function calc(){
//Initialisation des tableaux
for (var i = 0; i < obj.continents.length; i++) {
	var continentalValue=0;
	var tempSector = 0;
	continentsNameList.push(obj.continents[i].name);
	for (var j=0; j< obj.continents[i].sectors.length;j++){
		tempSector +=1;
		totalPonderation += obj.continents[i].sectors[j].p;
		continentalValue +=obj.continents[i].sectors[j].p;
		detailP.push(obj.continents[i].sectors[j].p);
		detailG.push(obj.continents[i].sectors[j].g);
		if(Math.abs(obj.continents[i].sectors[j].g)>maxAbsolueValueG)
			maxAbsolueValueG=Math.abs(obj.continents[i].sectors[j].g);
		sectorsNameList.push(obj.continents[i].sectors[j].name)
	}
	sectorsInContinent.push(tempSector);
	continentalPonderation.push(continentalValue);
}

//Calcul des line1 & line2
lineValue=Math.ceil(maxAbsolueValueG);
if (lineValue%2==1)
	lineValue +=1;
line1Value = 3*lineValue/4;
line2Value = lineValue/2;
line3Value = lineValue/4;

//Calcul central value
for (var i = 0; i < detailP.length; i++) {
	centralValue+=detailP[i]*detailG[i]
}
centralValue = Math.round(centralValue*10/totalPonderation)/10;

}
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------TABLE---------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//


function fillTable(){
//Filling Table
document.getElementById("table").innerHTML ="";
var sectorValueForTable = 0;
for (var i = 0; i < obj.continents.length; i++) {
	document.getElementById("table").innerHTML +="<tr><td rowspan=\""+sectorsInContinent[i]+"\" style=\"text-align:center\">"+continentsNameList[i]+
	"</td><td>"+sectorsNameList[sectorValueForTable]+"</td><td>"+detailP[sectorValueForTable]+"M</td><td>"+detailG[sectorValueForTable]+
	"%</td></tr>";
	sectorValueForTable +=1;
	for (var j = 0; j < sectorsInContinent[i]-1; j++) {
		document.getElementById("table").innerHTML +="<tr><td>"+sectorsNameList[sectorValueForTable]+"</td><td>"+detailP[sectorValueForTable]+
		"M</td><td>"+detailG[sectorValueForTable]+"%</td></tr>";
		sectorValueForTable+=1;
	}
}
}


//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------CANVAS---------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//

function draw(){
//Extra couleur
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
context.font="10px sans-serif";
context.clearRect(0, 0, canvas.width, canvas.height);
var cX = canvas.width/2;
var cY = canvas.height/2;
var radius1 = cY/1.8;
var initAngle=-Math.PI/2;
var finAngle=0;
var extra = 80/maxAbsolueValueG;
for (var i = 0; i < detailP.length; i++) {
	context.beginPath();
	if(detailG[i] > 0)
		//context.fillStyle='#10E31E';
		context.fillStyle='#93F6A5';
	else
		//context.fillStyle='#C80E33';
		//context.fillStyle='#F24653';
		context.fillStyle='#F56B75';
	context.moveTo(cX, cY);
	finAngle=initAngle+(detailP[i]*2*Math.PI/totalPonderation);
	if(detailG[i] > 0)
		context.arc(cX, cY, radius1+extra*detailG[i], initAngle, finAngle);
	else
		context.arc(cX, cY, radius1-extra*detailG[i], initAngle, finAngle);
	context.lineTo(cX,cY);
	context.fill();
	context.closePath();
	initAngle=finAngle;
}

//Extra contour
for (var i = 0; i < detailP.length; i++) {
	context.beginPath();
	context.moveTo(cX, cY);
	finAngle=initAngle+(detailP[i]*2*Math.PI/totalPonderation);
	if(detailG[i] > 0)
		context.arc(cX, cY, radius1+extra*detailG[i], initAngle, finAngle);
	else
		context.arc(cX, cY, radius1-extra*detailG[i], initAngle, finAngle);
	context.lineTo(cX,cY);
	context.closePath();
	context.stroke();
	initAngle=finAngle;
}

//Ligne1 contour
context.beginPath();	
context.arc(cX, cY, radius1+extra*line1Value, (-Math.PI/2)+0.1, (3*Math.PI/2)-0.1);
context.stroke();

//Ligne1 texte
context.strokeStyle = "rgb(0,0,0)";
context.fillStyle = "rgb(0,0,0)";
context.fillText(line1Value+"%", cX-3*(line1Value+"%").length, cY-radius1-extra*line1Value+2);

//Ligne2 contour
context.beginPath();	
context.arc(cX, cY, radius1+extra*line2Value, (-Math.PI/2)+0.1, (3*Math.PI/2)-0.1);
context.stroke();

//Ligne1 texte
context.strokeStyle = "rgb(0,0,0)";
context.fillStyle = "rgb(0,0,0)";
context.fillText(line2Value+"%", cX-3*(line2Value+"%").length, cY-radius1-extra*line2Value+2);

//Ligne3 contour
context.beginPath();	
context.arc(cX, cY, radius1+extra*line3Value, (-Math.PI/2)+0.1, (3*Math.PI/2)-0.1);
context.stroke();

//Ligne1 texte
context.strokeStyle = "rgb(0,0,0)";
context.fillStyle = "rgb(0,0,0)";
context.fillText(line3Value+"%", cX-3*(line3Value+"%").length, cY-radius1-extra*line3Value+2);

//InterEspace couleur
context.beginPath();	
context.fillStyle='white';
context.arc(cX, cY, radius1, 0, 2 * Math.PI);
context.fill();

//InterEspace contour
context.beginPath();	
context.arc(cX, cY, radius1, 0, 2 * Math.PI);
context.closePath();
context.stroke();

//Bleu extérieur
context.beginPath();	
//context.fillStyle='#05199D';
//context.fillStyle='#1E56A0';
//context.fillStyle='#94a5b2';
context.fillStyle='#e5e1df';
context.arc(cX, cY, radius1-5, 0, 2 * Math.PI);
context.fill();

//Sections extérieures
for (var i = 0; i < detailP.length; i++) {
	context.beginPath();
	context.moveTo(cX, cY);
	finAngle=initAngle+(detailP[i]*2*Math.PI/totalPonderation);
	context.arc(cX, cY, radius1-5, initAngle, finAngle);
	context.lineTo(cX,cY);
	context.closePath();
	context.stroke();
	initAngle=finAngle;
}

//Bleu intérieur
context.beginPath();	
//context.fillStyle='#061579';
//context.fillStyle='#163172';
context.fillStyle='#5f544d';
context.arc(cX, cY, 3*(radius1-5)/4, 0, 2 * Math.PI);
context.fill();

//Sections intérieures
for (var i = 0; i < continentalPonderation.length; i++) {
	context.beginPath();
	context.moveTo(cX, cY);
	finAngle=initAngle+(continentalPonderation[i]*2*Math.PI/totalPonderation);
	context.arc(cX, cY, 3*(radius1-5)/4, initAngle, finAngle);
	context.lineTo(cX,cY);
	context.closePath();
	context.stroke();
	initAngle=finAngle;
}

//Blanc intérieur
context.beginPath();	
context.fillStyle='white';
context.arc(cX, cY, (radius1-5)/2, 0, 2 * Math.PI);
context.fill();

//Contour intérieur
context.beginPath();	
context.arc(cX, cY, (radius1-5)/2, 0, 2 * Math.PI);
context.closePath();
context.stroke();

//Texte continents
var textContinentRadius = 5*(radius1-5)/8;
/*context.strokeStyle = "rgb(255,255,255)";
context.fillStyle = "rgb(255,255,255)";*/
context.strokeStyle = "rgb(229,225,223)";
context.fillStyle = "rgb(229,225,223)";
for(i=0; i < continentsNameList.length; i++)
{	  
	var textContinentAngle = initAngle+(continentalPonderation[i]*Math.PI/totalPonderation);
	finAngle=initAngle+(continentalPonderation[i]*2*Math.PI/totalPonderation);
	var dx = cX + textContinentRadius * Math.cos(textContinentAngle)-2*continentsNameList[i].length;
	var pourc = Math.round(continentalPonderation[i]*100/totalPonderation)+"%";
	var dxPourc = cX + textContinentRadius * Math.cos(textContinentAngle)-2*pourc.length;
	var dy = cY + textContinentRadius * Math.sin(textContinentAngle);	
	context.fillText(continentsNameList[i], dx, dy);
	context.fillText(pourc, dxPourc, dy+10);
	initAngle=finAngle;	
}

//Texte secteurs
var textSectorRadius = 7*(radius1-5)/8; 
/*context.strokeStyle = "rgb(255,255,255)";
context.fillStyle = "rgb(255,255,255)";*/
context.strokeStyle = "rgb(95,84,77)";
context.fillStyle = "rgb(95,84,77)";
for(i=0; i < sectorsNameList.length; i++)
{	  
	var textSectorAngle = initAngle+(detailP[i]*Math.PI/totalPonderation);
	finAngle=initAngle+(detailP[i]*2*Math.PI/totalPonderation);

	var substringSector6=sectorsNameList[i].substring(0,6);
	substringSector6=substringSector6.substring(0,110*detailP[i]/totalPonderation);
	var dx = cX + textSectorRadius * Math.cos(textSectorAngle)-(1+substringSector6.length*2);
	var dy = cY + textSectorRadius * Math.sin(textSectorAngle);	
	context.fillText(substringSector6, dx, dy);
	initAngle=finAngle;	
}

//Texte central
var fontSize=30;
context.strokeStyle = "rgb(0,0,0)";
context.fillStyle = "rgb(0,0,0)";
context.font=fontSize+"px Arial";
var centralText= "";
if (centralValue>0)
	centralText="+"+centralValue+"%";
else
	centralText=centralValue+"%";
context.fillText(centralText, cX-centralText.length*fontSize*0.27,cY-5+fontSize/2);

//Texte haut
var fontSize=11;
context.strokeStyle = "rgb(0,0,0)";
context.fillStyle = "rgb(0,0,0)";
context.font=fontSize+"px Arial";
context.fillText(sentence1, cX-sentence1.length*fontSize*0.2,cY+30-radius1/2);
context.fillText(sentence2, cX-sentence2.length*fontSize*0.25,cY+30+1.3*fontSize-radius1/2);
}


//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------MAIN-----------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//

//Apply functions
/*jsonFile = '{"continents":[{"name":"US", "sectors":[{"name":"Finance","p": 5,"g": 1.00,"t": 1.60},{"name":"Industrie","p": 2,"g": 3.00,"t": 3.20},{"name" : "Santé","p": 5,"g": -2.70,"t": -2.90},{"name" : "Techno","p": 3,"g": 3.10,"t": 3.00}]},'+
'{"name":"Europe", "sectors":[{"name":"Finance","p": 4,"g": 2.50,"t": 2.70},{"name":"Industrie","p": 1,"g": -1.50,"t": -1.20},{"name":"Raw Material","p": 1,"g": 6.20,"t": 6.20}]},'+
'{"name":"Asie", "sectors":[{"name":"Finance","p": 1,"g": 4.00,"t": 4.60},{"name" : "Santé","p": 2,"g": -2.70,"t": -2.90}, {"name" : "Techno","p": 6,"g": 3.10,"t": 3.00}]},'+
'{"name":"Océanie", "sectors":[{"name":"Finance","p": 4,"g": 3.50,"t": 3.70},{"name":"Industrie","p": 1,"g": -1.50,"t": -1.20},{"name":"Raw Material","p": 1,"g": 7.00,"t": 7.20}]},'+
'{"name":"Afrique", "sectors":[{"name" : "Santé","p": 4,"g": -1.70,"t": -1.90}]}]}';
obj=JSON.parse(jsonFile);
calc();
fillTable();
draw();*/
if (jsonFile.length<1){
	document.getElementById("resulttable").setAttribute("style","display:none");
	document.getElementById("canvas").setAttribute("style","display:none");
}
else
{
	document.getElementById("resulttable").setAttribute("style","margin:auto");
	document.getElementById("canvas").setAttribute("style","margin:auto;padding:0;display:block");
}

//OnClick on button Créer (Button : JSON)
document.getElementById("button").onclick=function(){
	jsonFile=document.getElementById("initial").value;
	obj=JSON.parse(jsonFile);
	if (jsonFile.length<1){
		document.getElementById("resulttable").setAttribute("style","display:none");
		document.getElementById("canvas").setAttribute("style","display:none");
	}
	else
	{
		document.getElementById("resulttable").setAttribute("style","margin:auto");
		document.getElementById("canvas").setAttribute("style","margin:auto;padding:0;display:block");
	}
	initialize();
	calc();
	fillTable();
	draw();
};
//{"continents":[{"name":"Europe","sectors":[{"name" : "Santé","p": 4,"g": 1.70,"t": 1.90}]}]}
//{"continents":[{"name":"US", "sectors":[{"name":"Finance","p": 5,"g": 1.00,"t": 1.60},{"name":"Industrie","p": 2,"g": 3.00,"t": 3.20},{"name" : "Santé","p": 5,"g": -2.70,"t": -2.90},{"name" : "Techno","p": 3,"g": 3.10,"t": 3.00}]},{"name":"Europe", "sectors":[{"name":"Finance","p": 4,"g": 2.50,"t": 2.70},{"name":"Industrie","p": 1,"g": -1.50,"t": -1.20},{"name":"Raw Material","p": 1,"g": 6.20,"t": 6.20}]},{"name":"Asie", "sectors":[{"name":"Finance","p": 1,"g": 4.00,"t": 4.60},{"name" : "Santé","p": 2,"g": -2.70,"t": -2.90}, {"name" : "Techno","p": 6,"g": 3.10,"t": 3.00}]},{"name":"Océanie", "sectors":[{"name":"Finance","p": 4,"g": 3.50,"t": 3.70},{"name":"Industrie","p": 1,"g": -1.50,"t": -1.20},{"name":"Raw Material","p": 1,"g": 7.00,"t": 7.20}]},{"name":"Afrique", "sectors":[{"name" : "Santé","p": 4,"g": -1.70,"t": -1.90}]}]}




//----------------------------------------------------------INIT TABLE---------------------------------------------------------//
function addContinent(){
	var table=document.getElementById("data");
	if(table){
		table.appendChild(createContinent(lines()+1));
	}
}

function lines(){
	var table = document.getElementById('data');
	return table.childNodes.length;
}

function createContinent(number){
	var newLine = document.createElement('tr');
	newLine.setAttribute('id','line'+number);
	var newCaseC = document.createElement('td');
	newCaseC.setAttribute('id','C'+number);
	newCaseC.setAttribute('rowspan',"1");
	var inputC = document.createElement('input');
	inputC.setAttribute('type', 'text');
	inputC.setAttribute('name', 'inputC' + number);
	inputC.setAttribute('id', 'inputC' + number);
	var newL = document.createElement('br');
	var buttonC = document.createElement('button');  
	buttonC.setAttribute('type', 'button');
	buttonC.setAttribute('value', 'Ajouter un secteur');
	buttonC.setAttribute('id', 'addSector' + number);
	buttonC.onclick = addSector;
	var buttonValue = document.createTextNode('Ajouter un secteur'); 
	var newCaseS = document.createElement('td');
	var inputS = document.createElement('input');
	inputS.setAttribute('type', 'text');
	inputS.setAttribute('name', 'inputS' + number);
	inputS.setAttribute('id', 'inputS' + number);
	var newCaseP = document.createElement('td');
	var inputP = document.createElement('input');
	inputP.setAttribute('type', 'number');
	inputP.setAttribute('name', 'inputP' + number);
	inputP.setAttribute('id', 'inputP' + number);
	var newCaseG = document.createElement('td');
	var inputG = document.createElement('input');
	inputG.setAttribute('type', 'number');
	inputG.setAttribute('name', 'inputG' + number);
	inputG.setAttribute('id', 'inputG' + number);
	buttonC.appendChild(buttonValue);
	newCaseC.appendChild(inputC);
	newCaseC.appendChild(newL);
	newCaseC.appendChild(buttonC);
	newCaseS.appendChild(inputS);
	newCaseP.appendChild(inputP);
	newCaseG.appendChild(inputG);	
	newLine.appendChild(newCaseC);
	newLine.appendChild(newCaseS);
	newLine.appendChild(newCaseP);
	newLine.appendChild(newCaseG);
	return newLine;
}

function createSector(number){
	var newLine = document.createElement('tr');
	newLine.setAttribute('id','line'+number);
	var buttonValue = document.createTextNode('Ajouter un secteur'); 
	var newCaseS = document.createElement('td');
	var inputS = document.createElement('input');
	inputS.setAttribute('type', 'text');
	inputS.setAttribute('name', 'inputS' + number);
	inputS.setAttribute('id', 'inputS' + number);
	var newCaseP = document.createElement('td');
	var inputP = document.createElement('input');
	inputP.setAttribute('type', 'number');
	inputP.setAttribute('name', 'inputP' + number);
	inputP.setAttribute('id', 'inputP' + number);
	var newCaseG = document.createElement('td');
	var inputG = document.createElement('input');
	inputG.setAttribute('type', 'number');
	inputG.setAttribute('name', 'inputG' + number);
	inputG.setAttribute('id', 'inputG' + number);
	newCaseS.appendChild(inputS);
	newCaseP.appendChild(inputP);
	newCaseG.appendChild(inputG);	
	newLine.appendChild(newCaseS);
	newLine.appendChild(newCaseP);
	newLine.appendChild(newCaseG);
	return newLine;
}

function addSector(){
	var pattern = /^addSector(\d+)$/;
	var number = this.id.replace(pattern,'$1');
	var continentCase = document.getElementById('C'+number);
	var rowspan = Number(continentCase.getAttribute('rowspan'))+1;
	document.getElementById('C'+number).setAttribute("rowspan",""+rowspan);
	var table=document.getElementById("data");
	var line = document.getElementById('line'+number);
	var nextContinentSibling=line.nextSibling;
	var lineIsDone = false;
	var hasFoundSibling=false;
	for (var i=0; i < table.childNodes.length;i++){
		if (lineIsDone){
			if (table.childNodes[i].childNodes.length == 5 && !hasFoundSibling){
				hasFoundSibling=true;
				nextContinentSibling=table.childNodes[i];
			}
		}
		else{
			if (table.childNodes[i]==line)lineIsDone=true;
		}
	}
	if(hasFoundSibling)
		table.insertBefore(createSector(number+1),nextContinentSibling);
	else
		table.appendChild(createSector(number+1));
}
document.getElementById("addContinent").onclick=function(){addContinent();}




//----------------------------------------------------CREATE FROM TABLE-------------------------------------------------//
//OnClick on button Créer (TableButton)
document.getElementById("tablebutton").onclick=function(){
	var table=document.getElementById("data");
	var linesInTable=table.childNodes.length;
	var continentLines=[];
	for(i=0; i < linesInTable; i++){
		if (table.childNodes[i].childNodes.length==4)
			continentLines.push(i);
	}
	continentLines.push(linesInTable);

	obj={
		continents:[]
	}
		//Pour chaque continent :
		for(i=0; i < continentLines.length-1; i++){
			//Pour chaque secteur du continent
			var continent={
				name:table.childNodes[continentLines[i]].childNodes[0].childNodes[0].value,
				sectors:[]
			}
			for(var j=0;j<continentLines[i+1]-continentLines[i];j++){
				var sectorTRLine = table.childNodes[continentLines[i]+j];
				if (j==0){
					var sector={
						name:sectorTRLine.childNodes[1].childNodes[0].value,
						p:Number(sectorTRLine.childNodes[2].childNodes[0].value),
						g:Number(sectorTRLine.childNodes[3].childNodes[0].value)
					}
				}
				else{
					var sector={
						name:sectorTRLine.childNodes[0].childNodes[0].value,
						p:Number(sectorTRLine.childNodes[1].childNodes[0].value),
						g:Number(sectorTRLine.childNodes[2].childNodes[0].value)
					}
				}
				continent.sectors.push(sector);
			}
			obj.continents.push(continent);
		}


		if (obj.continents.length <= 0){
			//document.getElementById("resulttable").setAttribute("style","display:none");
			document.getElementById("canvas").setAttribute("style","display:none");
		}
		else
		{
			//document.getElementById("resulttable").setAttribute("style","margin:auto");
			document.getElementById("canvas").setAttribute("style","margin:auto;padding:0;display:block");
		}

		initialize();
		calc();
		fillTable();
		draw();
	};

