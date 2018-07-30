//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------DECLARE--------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//

//Variable declaration
var canvas = "";
var context = "";
var obj="";
var totalAmount = 0;
var totalAmountw0 = 0;
var highestPerf = 0;
var lowestPerf = 0;
var diff = 0;
var zeroPlace = 0;
var width=500;
var height=300;
var topShift = 0;
var bottomShift = 0;
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------INITIALIZE-----------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//


//Initialize
function initialize(){
	totalAmount = 0;
	totalAmountw0 = 0;
	highestPerf = 0;
	lowestPerf = 0;
	diff=0;
	zeroPlace = 0;
	width=500;
	height=300;
	topShift = 0;
	bottomShift = 0;
	canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
}

//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------CALCULATE-----------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//


//Calculate
function calc(){
	for (i=0;i<obj.strategies.length;i++){
		//Get total amount
		totalAmount += obj.strategies[i].CA;

		//Get highest and lowest performance
		if(highestPerf<obj.strategies[i].CP){
			highestPerf=obj.strategies[i].CP;
		}
		if(highestPerf<obj.strategies[i].PP){
			highestPerf=obj.strategies[i].PP;
		}
		if(lowestPerf>obj.strategies[i].CP){
			lowestPerf=obj.strategies[i].CP;
		}
		if(lowestPerf>obj.strategies[i].PP){
			lowestPerf=obj.strategies[i].PP;
		}
	}

	//Prepare shift for right-side scale
	topShift = highestPerf - Math.trunc(highestPerf);
	bottomShift = lowestPerf - Math.trunc(lowestPerf);
	
	diff = highestPerf - lowestPerf;
	//Set highestPerf, lowestPert to avoid diff = 0
	if(diff == 0){
		highestPerf=1;
		lowestPerf=-1;
		diff = highestPerf - lowestPerf;
	}

	//Get the pixel value for the y=0 line
	zeroPlace = highestPerf * height / diff;

	//Calculate total amount without unaffected cash
	totalAmountw0 = totalAmount - obj.strategies[0].CA;
}

//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------CANVAS---------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//

//Draw Canvas
function draw(){
	//Initialize
	var xValue = 0;
	var previousY = 0;
	context.beginPath();
	context.strokeStyle="black";
	context.font="10px sans-serif";

	//Clear canvas and draw orthogonal system
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawsystem();

	//Draw rectangles
	for(i=0;i<obj.strategies.length;i++){

		//Draw rectangle
		var rectLength = (obj.strategies[i].CA / totalAmount)*width;
		var rectHeight = Math.abs(obj.strategies[i].CP-obj.strategies[i].PP) * height / diff;
		var positiveHeight = (obj.strategies[i].CP-obj.strategies[i].PP >= 0) ? true : false;
		var rectYValue = positiveHeight ? highestPerf-obj.strategies[i].CP : highestPerf-obj.strategies[i].PP;
		rectYValue= rectYValue * height / diff;
		if(i==0){
			rectHeight = height / 20;
			rectYValue = zeroPlace - rectHeight / 2;
			previousY = rectYValue;
		}
		if (positiveHeight)
			context.fillStyle='#93F6A5';
		else
			context.fillStyle='#F56B75';
		context.beginPath();
		context.fillRect(xValue, rectYValue, rectLength, rectHeight);

		//Draw contour
		context.beginPath();
		context.rect(xValue, rectYValue, rectLength, rectHeight);
		context.strokeStyle='#5f544d';
		context.lineWidth="1";
		context.stroke();


		//Manage previous amount (increase or reduction)
		//Manage reduction
		if (obj.strategies[i].CA < obj.strategies[i].PA){
			var reductionValue = obj.strategies[i].PA - obj.strategies[i].CA;
			var reductionLength = (reductionValue/totalAmount)*width;
			context.fillStyle='rgba(229, 225, 223, 0.5)';
			context.beginPath();
			if(!obj.strategies[i].SRS){
				context.fillRect(xValue-reductionLength, rectYValue, reductionLength, rectHeight);
				context.beginPath();
				context.rect(xValue-reductionLength, rectYValue, reductionLength, rectHeight);
				context.strokeStyle='#5f544d';
				context.lineWidth="1";
				context.stroke();
			}
			else{
				context.fillRect(xValue+rectLength, rectYValue, reductionLength, rectHeight);
				context.beginPath();
				context.rect(xValue+rectLength, rectYValue, reductionLength, rectHeight);
				context.strokeStyle='#5f544d';
				context.lineWidth="1";
				context.stroke();
			}
		}
		//Manage increase
		if (obj.strategies[i].CA > obj.strategies[i].PA){
			var increaseValue = obj.strategies[i].CA - obj.strategies[i].PA;
			var increaseLength = (increaseValue/totalAmount)*width;
			context.fillStyle='rgba(95, 84, 77, 0.3)';
			context.beginPath();
			context.fillRect(xValue + rectLength - increaseLength, rectYValue, increaseLength, rectHeight);
			context.beginPath();
			context.rect(xValue + rectLength - increaseLength, rectYValue, increaseLength, rectHeight);
			context.strokeStyle='#5f544d';
			context.lineWidth="1";
			context.stroke();
		}


		//Write name
		writeRectName(xValue, rectYValue, rectLength, rectHeight, obj.strategies[i].name);

		//Draw connection line with previous rectangle
		if (i!=0){
			context.beginPath();
			context.moveTo(xValue, previousY);
			context.lineTo(xValue, rectYValue);
			context.lineWidth="1";
			context.strokeStyle='#5f544d';
			context.stroke();
			previousY = rectYValue;
		}

		//Draw mini-line on y=0 line
		context.beginPath();
		context.moveTo(xValue, zeroPlace-height/40);
		context.lineTo(xValue, zeroPlace+height/40);
		context.lineWidth="2";
		context.strokeStyle='#5f544d';
		context.stroke();

		//Increment xValue
		xValue += rectLength;
	}

	//Draw last mini-line on y=0 line
	context.beginPath();
	context.moveTo(xValue, zeroPlace-height/40);
	context.lineTo(xValue, zeroPlace+height/40);
	context.lineWidth="2";
	context.strokeStyle='#5f544d';
	context.stroke();

	drawscale();
}

//Write rectangle's name
function writeRectName(xPos, yPos, xLength, yHeight, name){
	if (xLength > width/8){
		//Write horizontally
		context.beginPath();	
		context.strokeStyle = '#5f544d';
		context.fillStyle = '#5f544d';
		context.textAlign='center';
		var substringParameter = 95*xLength/width;
		name = name.substring(0, substringParameter);
		context.fillText(name, xPos+(xLength/2), yPos+(yHeight/2)+3);
	}
	else{
		//Write vertically
		context.save();
		context.translate(xPos+(xLength/2), yPos+(yHeight/2));
		context.rotate(-Math.PI / 2);
		context.beginPath();	
		context.strokeStyle = '#5f544d';
		context.fillStyle = '#5f544d';	
		context.textAlign='center';
		context.fillText(name, 0, 3);
		context.restore();
	}
}


//Draw orthogonal system
function drawsystem(){
	//Draw y=0 line
	context.beginPath();
	context.moveTo(0,zeroPlace);
	context.lineTo(width+20,zeroPlace);
	context.lineWidth="2";
	context.strokeStyle='#5f544d';
	context.stroke();

	//Draw x=width line
	context.beginPath();
	context.moveTo(width+10,zeroPlace); //Replace zeroPlace with height if needed
	context.lineTo(width+10,0);
	context.lineWidth="2";
	context.strokeStyle='#5f544d';
	context.stroke();

	//Draw arrow on x=width line
	context.beginPath();
	context.moveTo(width+5,5);
	context.lineTo(width+10,1);
	context.lineTo(width+15,5);
	context.lineWidth="2";
	context.strokeStyle='#5f544d';
	context.stroke();
}

//Draw right-side scale and bottom scale
function drawscale(){
	//Draw right-side scale
	//Draw top-part of the scale
	context.beginPath();
	context.fillStyle='#e5e1df';
	context.fillRect(width+25, 0, height/10, topShift*height/diff);

	context.beginPath();
	context.rect(width+25, 0, height/10, topShift*height/diff);
	context.strokeStyle='#FFFFFF';
	context.lineWidth="1";
	context.stroke();

	//Draw regular scale
	for(i=0;i<Math.trunc(highestPerf)-Math.trunc(lowestPerf);i++){
		context.beginPath();
		context.fillStyle='#e5e1df';	
		context.fillRect(width+25, (i+topShift)*height/diff, height/10, height/diff);

		context.beginPath();
		context.rect(width+25, (i+topShift)*height/diff, height/10, height/diff);
		context.strokeStyle='#FFFFFF';
		context.lineWidth="1";
		context.stroke();

		//Write number
		context.beginPath();	
		context.strokeStyle = '#5f544d';
		context.fillStyle = '#5f544d';
		var temp = Math.trunc(highestPerf)-1-i;
		context.textAlign='right';
		context.fillText(temp, (width+25)+(height/10)-3, (height/diff)+((i+topShift)*height/diff)-4);
	}

	//Draw bottom-part of the scale
	context.beginPath();
	context.fillStyle='#e5e1df';
	context.fillRect(width+25, (highestPerf-Math.trunc(lowestPerf))*height/diff, height/10, Math.abs(bottomShift)*height/diff);

	context.beginPath();
	context.rect(width+25, (highestPerf-Math.trunc(lowestPerf))*height/diff, height/10, Math.abs(bottomShift)*height/diff);
	context.strokeStyle='#FFFFFF';
	context.lineWidth="1";
	context.stroke();



	//Draw bottom scale
	//Calculating subdivision factor
	var firstNumber = Number(totalAmountw0.toString().substring(0,1));
	var factor = 1;
	if(firstNumber == 1)
		factor = 0.25;
	if (firstNumber >= 2 && firstNumber <= 5)
		factor = 0.5;
	//Calculating how many 0 to add behind the factor to get a section
	var zeros = Math.trunc(Math.log10(totalAmountw0));

	//Drawing bottom scale
	for(i=0;i<totalAmountw0;i+=factor*Math.pow(10,zeros)){
		context.beginPath();
		context.fillStyle='#e5e1df';
		context.fillRect(((obj.strategies[0].CA+i)/totalAmount)*width, height + 30, (factor*Math.pow(10,zeros)/totalAmount)*width, height/15);

		//Draw contour
		context.beginPath();
		context.rect(((obj.strategies[0].CA+i)/totalAmount)*width, height + 30, (factor*Math.pow(10,zeros)/totalAmount)*width, height/15);
		context.strokeStyle='#FFFFFF';
		context.lineWidth="1";
		context.stroke();

		//Write scale values
		context.beginPath();	
		context.strokeStyle = '#5f544d';
		context.fillStyle = '#5f544d';
		context.textAlign='center';
		context.fillText((i+factor*Math.pow(10,zeros)).toString(), ((obj.strategies[0].CA+i)/totalAmount)*width+((factor*Math.pow(10,zeros)/totalAmount)*width)/2, height + 43);

	}

}


//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------TABLE----------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------------//

//Global function to add a new line
function addStrategy(){
	var table=document.getElementById("data");
	if(table){
		table.appendChild(createStrategy(lines()));
	}
}

//Count how many lines there is (with the header)
function lines(){
	var table = document.getElementById('data');
	return table.childNodes.length;
}

//Create a new line
function createStrategy(number){
	var newLine = document.createElement('tr');
	newLine.setAttribute('id','line'+number);

	var newCaseS = document.createElement('td');
	var inputS = document.createElement('input');
	inputS.setAttribute('type', 'text');
	inputS.setAttribute('name', 'inputS' + number);
	if (number==1){
		inputS.setAttribute('value','Espèces non allouées');
		inputS.setAttribute('disabled','disabled');
	}

	var newCaseCA = document.createElement('td');
	var inputCA = document.createElement('input');
	inputCA.setAttribute('type', 'number');
	inputCA.setAttribute('name', 'inputCA' + number);

	var newCasePA = document.createElement('td');
	var inputPA = document.createElement('input');
	inputPA.setAttribute('type', 'number');
	inputPA.setAttribute('name', 'inputPA' + number);

	var newCaseCP = document.createElement('td');
	var inputCP = document.createElement('input');
	inputCP.setAttribute('type', 'number');
	inputCP.setAttribute('name', 'inputCP' + number);	
	if (number==1){
		inputCP.setAttribute('value',0);
		inputCP.setAttribute('disabled','disabled');
	}

	var newCasePP = document.createElement('td');
	var inputPP = document.createElement('input');
	inputPP.setAttribute('type', 'number');
	inputPP.setAttribute('name', 'inputPP' + number);	
	if (number==1){
		inputPP.setAttribute('value',0);
		inputPP.setAttribute('disabled','disabled');
	}

	var newCaseSRS = document.createElement('td');
	var inputSRS = document.createElement('input');
	inputSRS.setAttribute('type', 'checkbox');
	inputSRS.setAttribute('name', 'inputSRS' + number);

	newCaseS.appendChild(inputS);
	newCaseCA.appendChild(inputCA);
	newCasePA.appendChild(inputPA);
	newCaseCP.appendChild(inputCP);
	newCasePP.appendChild(inputPP);
	newCaseSRS.appendChild(inputSRS);

	newLine.appendChild(newCaseS);
	newLine.appendChild(newCaseCA);
	newLine.appendChild(newCasePA);
	newLine.appendChild(newCaseCP);
	newLine.appendChild(newCasePP);
	newLine.appendChild(newCaseSRS);
	return newLine;
}

//Create first table line
addStrategy();

//Add the function to the button
document.getElementById("addStrategy").onclick=function(){addStrategy();}

//Create from table onclick on button Create (tablebutton)
document.getElementById("tablebutton").onclick=function(){
	var table = document.getElementById('data');
	var linesInTable=lines()-1;
	obj={
		strategies:[]
	}
	for(i=1;i<=linesInTable;i++){
		var strategy={
			name:table.childNodes[i].childNodes[0].childNodes[0].value,
			CA:Number(table.childNodes[i].childNodes[1].childNodes[0].value),
			PA:Number(table.childNodes[i].childNodes[2].childNodes[0].value),
			CP:Number(table.childNodes[i].childNodes[3].childNodes[0].value),
			PP:Number(table.childNodes[i].childNodes[4].childNodes[0].value),
			SRS:table.childNodes[i].childNodes[5].childNodes[0].checked
		}
		obj.strategies.push(strategy);
	}

	if (obj.strategies.length <= 0){
		document.getElementById("canvas").setAttribute("style","display:none");
	}
	else{
		document.getElementById("canvas").setAttribute("style","margin:auto;padding:0;display:block");
	}

	initialize();
	calc();
	draw();
}